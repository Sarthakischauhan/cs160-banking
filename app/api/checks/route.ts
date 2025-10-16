import Tesseract from 'tesseract.js';

export async function POST(req: Request) {
    try{
    const formData = await req.formData();

    const front_image = formData.get("image") as File | null;
    const back_image = formData.get("image2") as File | null;

    if (!front_image || !back_image) {
        return new Response("Please upload front and back image", { status: 400 });
    }
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if ((front_image && !validImageTypes.includes(front_image.type)) ||
        (back_image && !validImageTypes.includes(back_image.type))) {
        return new Response("Invalid image type. Only JPEG , JPG & PNG are allowed.", { status: 415 });
    }

    const frontBuffer = Buffer.from(await front_image.arrayBuffer());
    const backBuffer = Buffer.from(await back_image.arrayBuffer());

    if (frontBuffer && backBuffer && frontBuffer.equals(backBuffer)) {
        return new Response("Same image uploaded twice", { status: 400 });
    }
        const front = await Tesseract.recognize(frontBuffer, "eng");
    const back = await Tesseract.recognize(backBuffer, "eng");

    const text = front.data.text.trim();
    const text2 = back.data.text.trim();

        return Response.json({ text, text2 });
    } catch (error) {
         console.error("OCR failed:", error);
        return new Response("OCR failed", { status: 500 });
    }

}