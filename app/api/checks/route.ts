import Tesseract from 'tesseract.js';

export async function POST(req: Request) {
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

    const frontBuffer = front_image ? Buffer.from(await front_image.arrayBuffer()) : null;
    const backBuffer = back_image ? Buffer.from(await back_image.arrayBuffer()) : null;

    if (frontBuffer && backBuffer && frontBuffer.equals(backBuffer)) {
        return new Response("Same image uploaded twice", { status: 400 });
    }
    try {
        const worker: any = await Tesseract.createWorker();
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");


        const [front, back] = await Promise.all([
            worker.recognize(frontBuffer),
            worker.recognize(backBuffer)
        ]);
        const text = front.data.text;
        const text2 = back.data.text;

        await worker.terminate();

        return Response.json({ text, text2 });
    } catch (error) {
        return new Response("OCR failed", { status: 500 });
    }

}