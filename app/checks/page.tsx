"use client";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

    type Customer = {  // Structure to hold customer info from the UI input
            customer_id: string | null;
            balance: number | null;
        };
let test = "";

export default function Page() {
    const [front_image, setimage1] = useState<File | null>(null);
    const [back_image, setimage2] = useState<File | null>(null);
    const [result, setresult] = useState<{ frontText: string; backText: string } | null>(null);
    const [error, seterror] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [customer, setAccount] = useState<number | null>(null);
   

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

    
    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        seterror("");
        setresult(null);
        console.log("testing if test shows up " + test);

        const createDeposit = await fetch("/api/deposit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                account_id: test,
                amount,
                description: "Check deposit",
            }),
        });
        if (!createDeposit.ok) {
            throw new Error("Failed to create deposit");
        }
        const depositData = await createDeposit.json();
        const createdDeposit = depositData.deposit;
        const transactionId = createdDeposit.transactionId;

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
                        <Card className="w-65 h-45 flex flex-col items-center justify-center bg-background border border-border shadow-sm hover:bg-accent/10 rounded-none hover:shadow-md hover:border-accent hover:scale-[1.02]">

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
                                    <div className="flex items-center justify-center w-full h-full">
                                        <p className="text-sm italic text-muted-foreground text-center">
                                            Click to upload
                                        </p>
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
                        <Card className="w-65 h-45 flex flex-col items-center justify-center bg-background border border-border shadow-sm hover:bg-accent/10 rounded-none hover:shadow-md hover:border-accent hover:scale-[1.02]">

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
                                    <div className="flex items-center justify-center w-full h-full">
                                        <p className="text-sm italic text-muted-foreground text-center group-hover:text-accent-foreground">
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
                <Button type="submit">Upload</Button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </main >
    )
}
