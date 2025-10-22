"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Page() {
    const [front_image, setimage1] = useState<File | null>(null);
    const [back_image, setimage2] = useState<File | null>(null);
    const [result, setresult] = useState<{ text: string; text2: string } | null>(null);
    const [error, seterror] = useState("");

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        seterror("");
        setresult(null);

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
            setresult(data);
        } catch (error) {
            seterror("Error cannot process the image");
        }
    }
    return (
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/50 py-12 px-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">Deposit a Check</h1>
            <p className="text-muted-foreground text-sm mb-8">
                Upload both sides of your check to deposit
            </p>
            <form onSubmit={handleUpload} className="flex flex-col items-center gap-4 justify-start">
                <div className="flex flex-row justify-center items-center gap-10 w-full">
                    <label>
                        <Card>
                            <CardHeader>
                                <CardTitle>Front</CardTitle>
                            </CardHeader>
                            <CardAction className="flex items-center justify-center h-64 text-center">
                                {front_image ? (
                                    <img
                                        src={URL.createObjectURL(front_image)}
                                        alt=" Front Preview"
                                        className="object-cover rounded-md border"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-sm text-muted-foreground italic"> Click to upload</p>

                                    </div>
                                )}
                            </CardAction>
                            <input type="file"
                                accept="image/*"
                                onChange={(e) => setimage1(e.target.files?.[0] ?? null)}
                                className="hidden" />

                        </Card>
                    </label>
                    <label>
                        <Card>
                            <CardHeader>
                                <CardTitle>Back</CardTitle>
                            </CardHeader>
                            <input type="file"
                                accept="image/*"
                                onChange={(e) => setimage2(e.target.files?.[0] ?? null)}
                                className="hidden" />

                            <CardAction className="flex items-center justify-center h-64 text-center">
                                {back_image ? (
                                    <img
                                        src={URL.createObjectURL(back_image)}
                                        alt="Back Preview"
                                        className="object-cover rounded-md border"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-sm text-muted-foreground italic"> Click to upload</p>
                                    </div>
                                )}
                            </CardAction>
                        </Card>

                    </label>
                </div>
                <div>
                    <Input id="deposit"
                        placeholder="Enter deposit amount"
                        type="number">
                    </Input>
                </div>
                <Button type="submit">Upload</Button>
                {result && (
                    <div style={{ marginTop: "1rem" }}>
                        <h2>Result</h2>
                        <pre>{result.text}</pre>
                        <pre>{result.text2}</pre>

                    </div>
                )}
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </main >
    )
}
