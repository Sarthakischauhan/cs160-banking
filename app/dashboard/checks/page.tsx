"use client";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

type Account = {  // Structure to hold customer info from the UI input
    account_id: string | null;
    balance: number | null;
};
let test = "";

export default function Page() {
    const [front_image, setimage1] = useState<File | null>(null);
    const [back_image, setimage2] = useState<File | null>(null);
    const [result, setresult] = useState<{ frontText: string; backText: string } | null>(null);
    const [error, seterror] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [account, setAccount] = useState<Account | null>(null);
    const [showCamera, setShowCamera] = useState<'front' | 'back' | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => { // Fetchs the api to get Account info 
        async function fetchProfile() {
            const res = await fetch("/api/account");
            if (res.status === 401) { // Ensures user is logged in correctly
                window.location.href = "/auth/login";
                return;
            }

            const data = await res.json();
            const firstAccount = data[0];
            setAccount(firstAccount); //retrieve the first account info will need to modify later to allow picking of multiple accounts

            if (!firstAccount.account_id) {
                console.error("No account_id found!");
                return;
            }


            test = firstAccount.account_id; //Just to retain value
            console.log("test has been recorded " + test);
        }

        fetchProfile();
    }, []);

    useEffect(() => {
        async function startCamera() {
            if (!showCamera) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Camera access denied:", err);
            }
        }
        startCamera();
    }, [showCamera]);

    //  Capture photo from camera
    function capturePhoto() {
        if (!canvasRef.current || !videoRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `${showCamera}_check.jpg`, { type: "image/jpeg" });
                if (showCamera === "front") setimage1(file);
                if (showCamera === "back") setimage2(file);
                setShowCamera(null); // Close camera after capture
            }
        }, "image/jpeg");
    }

    //  Stop camera stream when closed
    useEffect(() => {
        if (!showCamera && videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((t) => t.stop());
            videoRef.current.srcObject = null;
        }
    }, [showCamera]);

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        seterror("");
        setresult(null);
        console.log("testing if test shows up " + test);

        if (!account) {
            seterror("Account not loaded");
            return;
        }

        const createDeposit = await fetch("/api/transactions",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    account_id: account.account_id,
                    amount: Number(amount),
                    description: "Check deposit",
                    transaction_type: "deposit",
                }),
            });
        console.log("seee", createDeposit)
        if (!createDeposit.ok) {
            throw new Error("Failed to create deposit");
        }
        const depositData = await createDeposit.json();
        console.log("Deposit API response:", depositData);
        const transactionId =
            depositData.transaction_id ||
            depositData.id ||
            depositData.transactionId;

        if (!transactionId) {
            throw new Error("Deposit response missing transactionId");
        }

        const formData = new FormData();
        if (front_image) {
            formData.append("image", front_image);
        }
        if (back_image) {
            formData.append("image2", back_image);
        }
        if (amount !== null && amount > 0) {
            formData.append("amount", amount.toString());
        }
        formData.append("transactionId", transactionId);
        try {
            const res = await fetch("/api/checks", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            setresult(data);
            ~
                alert("Check submitted successfully! We will review and approve it shortly.");
        } catch (error) {
            seterror("Error cannot process the image");
        }
    }
    return (
        <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-muted/50 py-12 px-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Deposit a Check</h1>
            <p className="text-muted-foreground text-sm mb-8">
                Upload both sides of your check to deposit
            </p>
            <form onSubmit={handleUpload} className="flex flex-col items-center gap-4 justify-start">
                <div className="flex flex-col justify-center items-center gap-10 w-full">
                    <Card className="w-65 h-55 flex flex-col items-center justify-between bg-background border border-border shadow-sm hover:bg-accent/10 rounded-none hover:shadow-md hover:border-accent hover:scale-[1.02] relative p-3">
                        <CardHeader>
                            <CardTitle className="text-blue-600">Front</CardTitle>
                        </CardHeader>

                        <div className="flex items-center justify-center w-full h-full overflow-hidden border border-dashed rounded-md mb-2">
                            {front_image ? (
                                <img
                                    src={URL.createObjectURL(front_image)}
                                    alt="Front Preview"
                                    className="object-contain w-full h-full"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center w-full h-full gap-1">
                                    <p className="text-sm italic text-muted-foreground">Click Upload</p>
                                    <p className="text-xs font-semibold text-muted-foreground">OR</p>
                                    <p className="text-sm italic text-muted-foreground">Take a Photo</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => document.getElementById("frontUpload")?.click()}
                            >
                                Choose file
                            </Button>

                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setShowCamera("front")}
                            >
                                <Camera className="mr-2 h-4 w-4" /> Use Camera
                            </Button>

                        </div>

                        <input
                            id="frontUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setimage1(e.target.files?.[0] ?? null)}
                            className="hidden"
                        />
                    </Card>

                    <Card className="w-65 h-55 flex flex-col items-center justify-between bg-background border border-border shadow-sm hover:bg-accent/10 rounded-none hover:shadow-md hover:border-accent hover:scale-[1.02] relative p-3">
                        <CardHeader>
                            <CardTitle className="text-blue-600">Back</CardTitle>
                        </CardHeader>

                        <div className="flex items-center justify-center w-full h-full overflow-hidden border border-dashed rounded-md mb-2">
                            {back_image ? (
                                <img
                                    src={URL.createObjectURL(back_image)}
                                    alt="Back Preview"
                                    className="object-contain w-full h-full"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center w-full h-full gap-1">
                                    <p className="text-sm italic text-muted-foreground">Click Upload</p>
                                    <p className="text-xs font-semibold text-muted-foreground">OR</p>
                                    <p className="text-sm italic text-muted-foreground">Take a Photo</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => document.getElementById("backUpload")?.click()}
                            >
                                Choose file
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setShowCamera("back")}
                            >
                                <Camera className="mr-2 h-4 w-4" /> Use Camera
                            </Button>
                        </div>

                        <input
                            id="backUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setimage2(e.target.files?.[0] ?? null)}
                            className="hidden"
                        />
                    </Card>

                </div>
                <div>
                    <Input
                        id="deposit"
                        required
                        placeholder="Enter deposit amount"
                        type="number"
                        min="1"
                        max="10000"
                        value={amount ?? ""}
                        onChange={(e) => setAmount(e.target.value === "" ? null : Number(e.target.value))}
                        step="0.01"
                    />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-none"
                >Upload
                </Button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {showCamera && (
                <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                    <video ref={videoRef} autoPlay playsInline className="w-80 rounded-lg shadow-lg" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="mt-4 flex gap-4">
                        <Button onClick={capturePhoto}>Capture</Button>
                        <Button variant="secondary" onClick={() => setShowCamera(null)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </main >
    )
}
