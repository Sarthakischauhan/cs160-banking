import { prisma } from "@/prisma/prisma";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import { TicketType } from "@prisma/client";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

export async function GET() {
    const checks = await prisma.checks.findMany();
    return Response.json(checks);
}
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const customerId = formData.get("customerId") as string | null;
        const accountId = formData.get("accountId") as string | null;

        const front_image = formData.get("image") as File | null;
        const back_image = formData.get("image2") as File | null;

        if (!front_image || !back_image) {
            return new Response("Please upload front and back image", { status: 400 });
        }
        const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validImageTypes.includes(front_image.type) || !validImageTypes.includes(back_image.type)) {
            return new Response("Invalid image type. Only JPEG , JPG & PNG are allowed.", { status: 415 });
        }

        const frontBuffer = Buffer.from(await front_image.arrayBuffer());
        const backBuffer = Buffer.from(await back_image.arrayBuffer());

        if (frontBuffer.equals(backBuffer)) {
            return new Response("Same image uploaded twice", { status: 400 });
        }

        async function getUrl(file: File, folder: string) {
            const buffer = Buffer.from(await file.arrayBuffer());

            if (buffer.byteLength === 0) throw new Error("Empty file buffer");

            const filePath = `${folder}/${crypto.randomUUID()}-${file.name}`;
            const { data: uploadData, error } = await supabase.storage
                .from("Checks")
                .upload(filePath, buffer, {
                    contentType: file.type || "image/jpeg",
                    upsert: false,
                });

            if (error || !uploadData) {
                console.error(" Upload failed full response:", error);
                throw new Error("Upload failed");
            }

            const { data: publicData } = supabase
                .storage
                .from("Checks")
                .getPublicUrl(uploadData.path);
            return publicData.publicUrl;
        }

        async function performOcr(imageFile: File): Promise<string> {
            const ocrApiKey = process.env.OCR_SPACE_KEY;
            if (!ocrApiKey) {
                throw new Error("Ocr API key not found");
            }
            const form = new FormData();
            form.append("file", imageFile);
            form.append("language", "eng");
            form.append("OCREngine", "2");

            const res = await fetch("https://api.ocr.space/parse/image", {
                method: "POST",
                headers: { apiKey: ocrApiKey },
                body: form,
            });

            const data = await res.json();
            const parsedText = data?.ParsedResults?.[0]?.ParsedText ?? "";
            return String(parsedText).trim();

        }


        async function checkValidator(imageFile: File, amount: number): Promise<boolean> {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const arrayBuffer = await imageFile.arrayBuffer();
            const base64Image = Buffer.from(arrayBuffer).toString("base64");

            const contents: Content[] = [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
            You are validating a bank check image for a deposit system.
            Return 'true' if:
            1. The image clearly shows a valid bank check (front or back).
            2. The deposit amount "$${amount}" (or numerically equivalent) is visible on the check.
            Return 'false' only if it is unrelated, amount does not match or clearly not a check.`,
                        },
                        {
                            inlineData: {
                                mimeType: imageFile.type,
                                data: base64Image,
                            },
                        },
                    ],
                },
            ];

            const result = await model.generateContent({ contents });
            const answer = result.response.text().trim().toLowerCase();
            console.log("Gemini validation result:", answer);
            return answer.includes("true") && !answer.includes("false");
        }

        const [front, back] = await Promise.all(
            [performOcr(front_image),
            performOcr(back_image)]
        );

        const amount = Number(formData.get("amount"));
        if (!amount || amount <= 0) {
            return new Response("Deposit amount must be a positive number", { status: 400 });
        }
        const [frontValid, backValid] = await Promise.all([
            checkValidator(front_image, amount),
            checkValidator(back_image, 0 || amount),
        ]);
        if (!frontValid || !backValid) {
            console.log("❌ Check image failed validation — rejecting deposit.");
            return new Response(
                "Invalid or unreadable check image. Deposit rejected.",
                { status: 400 }
            );
        }

        const [frontUrl, backUrl] = await Promise.all([
            getUrl(front_image, "front"),
            getUrl(back_image, "back"),
        ]);

        const transactionId = formData.get("transactionId") as string | null;
        if (!transactionId) {
            return new Response("Missing transaction ID", { status: 400 });
        }
        const account = await prisma.account.findFirst({
            where: {
                customer_id: customerId ?? undefined,
                account_type: "CHECKING",
            },
        });
        if (!account) {
            throw new Error("Checking account not found for this customer");
        }

        const transaction = await prisma.transaction.create({
            data: {
                amount,
                transaction_type: "DEPOSIT",
                transaction_status: "PENDING",
                description: "Check deposit",
                Account: {
                    connect: { account_id: account.account_id }, // use the customer's real account
                },
            },
        });


        const newCheck = await prisma.checks.create({
            data: {
                front_text: front,
                back_text: back,
                deposit_amount: amount,
                created_at: new Date(),
                front_image: frontUrl,
                back_image: backUrl,
                deposit_date: new Date(),
                transactionId: transaction.transaction_id
            }
        });

        await prisma.supportTicket.create({
            data: {
                customer_id: customerId!,
                transaction_id: transaction.transaction_id,
                account_id: account.account_id,           
                ticket_type: TicketType.APPROVE,              
                ticket_status: "OPEN",                     
                subject: `Check deposit of $${amount} awaiting approval.`,
                message: `Check deposit for $${amount} is pending admin approval.`,
                tags: ["check", "deposit", "approval"],    
            },
        });


        console.log("OCR Result:", newCheck);

        return new Response(
            JSON.stringify({ message: "Saved to DB", checks: newCheck }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("OCR failed:", error);
        return new Response("OCR failed", { status: 500 });
    }
}
