export async function POST(req: Request) {
    try {
        const formData = await req.formData();

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

        const [front, back] = await Promise.all(
            [performOcr(front_image!),
            performOcr(back_image!)]
        );
        console.log("OCR Result:", { frontText:front, backText: back });

        return new Response(JSON.stringify({ frontText: front, backText: back }), {
            status: 200, headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("OCR failed:", error);
        return new Response("OCR failed", { status: 500 });
    }

}