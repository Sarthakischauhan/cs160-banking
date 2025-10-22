"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [front_image, setimage1] = useState<File | null>(null);
  const [back_image, setimage2] = useState<File | null>(null);
  const [result, setresult] = useState<{
    frontText: string;
    backText: string;
  } | null>(null);
  const [error, seterror] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    seterror("");
    setresult(null);

    const formData = new FormData();
    if (front_image) {
      formData.append("image", front_image);
    }
<<<<<<< HEAD
    return (
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/50 py-12 px-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">Deposit a Check</h1>
            <p className="text-muted-foreground text-sm mb-8">
                Upload both sides of your check to deposit
            </p>
            <form onSubmit={handleUpload} className="flex flex-col items-center gap-4 justify-start">
                <div className="flex flex-row justify-center items-center gap-10 w-full">
                    <label>
                        <Card className="w-64 h-64 flex flex-col items-center justify-center border border-muted bg-background/60 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-accent transition-all duration-200">
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
                        <Card className="w-64 h-64 flex flex-col items-center justify-center border border-muted bg-background/60 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-accent transition-all duration-200">
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
                    <div className="mt-8 w-full max-w-2xl bg-muted p-4 rounded-lg shadow border border-border">
                        <h2 className="text-lg font-semibold mb-2">Display Contents of Check</h2>
                        <pre className="bg-background border rounded-md p-3 text-sm overflow-auto mb-2">
                            {result.frontText}
                        </pre>
                        <pre className="bg-background border rounded-md p-3 text-sm overflow-auto">
                            {result.backText}
                        </pre>
                    </div>
=======
    if (back_image) {
      formData.append("image2", back_image);
    }
    try {
      const res = await fetch("/api/checks", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setresult(data);
    } catch (error) {
      seterror("Error cannot process the image");
    }
  }
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/50 py-12 px-4">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Deposit a Check
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Upload both sides of your check to deposit
      </p>
      <form
        onSubmit={handleUpload}
        className="flex flex-col items-center gap-4 justify-start"
      >
        <div className="flex flex-row justify-center items-center gap-10 max-w-[50%]">
          <label>
            <Card className="w-100">
              <CardHeader>
                <CardTitle>Front</CardTitle>
              </CardHeader>
              <CardAction className="flex items-center w-full justify-center h-48 text-center px-5">
                {front_image ? (
                  <img
                    src={URL.createObjectURL(front_image)}
                    alt=" Front Preview"
                    className="object-cover w-fit rounded-md border"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground italic">
                      {" "}
                      Click to upload
                    </p>
                  </div>
>>>>>>> beb0410c3db6fe5c049dbbee0a6c228646a5e08d
                )}
              </CardAction>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setimage1(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </Card>
          </label>
          <label>
            <Card className="w-100">
              <CardHeader>
                <CardTitle>Back</CardTitle>
              </CardHeader>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setimage2(e.target.files?.[0] ?? null)}
                className="hidden"
              />

              <CardAction className="flex items-center w-full justify-center h-48 text-center px-5">
                {back_image ? (
                  <img
                    src={URL.createObjectURL(back_image)}
                    alt="Back Preview"
                    className="object-cover rounded-md border w-fit"
                  />
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground italic">
                      {" "}
                      Click to upload
                    </p>
                  </div>
                )}
              </CardAction>
            </Card>
          </label>
        </div>
        <div>
          <Input
            id="deposit"
            placeholder="Enter deposit amount"
            type="number"
          ></Input>
        </div>
        <Button type="submit">Upload</Button>
        {result && (
          <div className="mt-8 w-full max-w-2xl bg-muted p-4 rounded-lg shadow border border-border">
            <h2 className="text-lg font-semibold mb-2">
              Display Contents of Check
            </h2>
            <pre className="bg-background border rounded-md p-3 text-sm overflow-auto mb-2">
              {result.frontText}
            </pre>
            <pre className="bg-background border rounded-md p-3 text-sm overflow-auto">
              {result.backText}
            </pre>
          </div>
        )}
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
