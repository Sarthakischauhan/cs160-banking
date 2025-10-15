"use client";
import { useState } from "react";
export default function Page() {
    const [front_image, setimage1] = useState<File | null>(null);
    const [back_image, setimage2] = useState<File | null>(null);
    const [result, setresult] = useState("");
    const [error, seterror] = useState("");

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        seterror("");
        setresult("");

        const formData = new FormData();
        if (front_image) {
            formData.append("image", front_image);
        }
        if (back_image) {
            formData.append("image2", back_image);
        }
        try {
            const res = await fetch("/api/checks", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            setresult(JSON.stringify(data));
        } catch (error) {
            seterror("Error cannot process the image");
        }
    }
    return (
        <main>  <h1> Upload front and back image</h1>
            <form onSubmit={handleUpload}>
                <div>
                    <label> Front </label>
                    <input type="file"
                        accept="image/*"
                        onChange={(e) => setimage1(e.target.files?.[0] ?? null)} />

                </div>
                <div>
                    <label> Back </label>
                    <input type="file"
                        accept="image/*"
                        onChange={(e) => setimage2(e.target.files?.[0] ?? null)} />
                </div>
                <button type="submit">Upload</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </main>
    )
}
