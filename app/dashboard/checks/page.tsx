"use client";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

type Account = {
  account_id: string | null;
  balance: number | null;
  customer_id: string | null;
};
let test = "";

export default function Page() {
  const [front_image, setimage1] = useState<File | null>(null);
  const [back_image, setimage2] = useState<File | null>(null);
  const [result, setresult] = useState<{
    frontText: string;
    backText: string;
  } | null>(null);
  const [error, seterror] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [showCamera, setShowCamera] = useState<"front" | "back" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/account");
      if (res.status === 401) {
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

      test = firstAccount.account_id;
      console.log("test has been recorded " + test);
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    async function startCamera() {
      if (!showCamera) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    startCamera();
  }, [showCamera]);

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
        const file = new File([blob], `${showCamera}_check.jpg`, {
          type: "image/jpeg",
        });
        if (showCamera === "front") setimage1(file);
        if (showCamera === "back") setimage2(file);
        setShowCamera(null);
      }
    }, "image/jpeg");
  }

  useEffect(() => {
    if (!showCamera && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }, [showCamera]);

  async function handleUpload(e: React.FormEvent) {
    try {
      e.preventDefault();
      seterror("");
      setresult(null);
      console.log("testing if test shows up " + test);

      if (!account) {
        seterror("Account not loaded");
        return;
      }

      if (!account.customer_id) {
        throw new Error("account missing");
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

      formData.append("customerId", account.customer_id!);
      const res = await fetch("/api/checks", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setresult(data);
      toast.success(
        "Check submitted successfully! We will review and approve it shortly.",
      );
    } catch (err: any) {
      seterror("Error cannot process the image");
      toast.error(err.message ||
        "Error cannot process the image. Verify that the images are clea and correct and try again.",
      );
    }
  }

  const ImageUploadCard = ({
    title,
    image,
    setImage,
    idPrefix,
  }: {
    title: string;
    image: File | null;
    setImage: (file: File | null) => void;
    idPrefix: "front" | "back";
  }) => (
    <Card className="w-full max-w-sm flex flex-col p-4 bg-card border border-border shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0 mb-4">
        {/* Removed text color utility (text-blue-400) */}
        <CardTitle className="text-xl font-semibold text-center">
          {title}
        </CardTitle>
      </CardHeader>

      <div
        className={`relative flex items-center justify-center w-full h-48 overflow-hidden rounded-lg mb-4 ${
          image ? "" : "border-2 border-dashed border-border p-4"
        }`}
      >
        {image ? (
          <>
            <img
              src={URL.createObjectURL(image)}
              alt={`${title} Check Preview`}
              className="object-contain w-full h-full"
            />
            {/* Kept button colors for visibility against image */}
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-/ bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label={`Remove ${title} image`}
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center w-full h-full gap-1 p-4">
            {/* Changed text colors to muted/foreground for automatic theming */}
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to Upload</p>
            <p className="text-xs font-medium text-muted">OR</p>
            <p className="text-sm text-muted-foreground">Use your Camera</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        {/* Changed button class to use default styling or primary/secondary variants without explicit text color */}
        <Button
          variant="secondary"
          type="button"
          className="flex-1"
          onClick={() => document.getElementById(`${idPrefix}Upload`)?.click()}
        >
          Choose File
        </Button>

        <Button
          variant="secondary"
          type="button"
          className="flex-1"
          onClick={() => setShowCamera(idPrefix)}
        >
          <Camera className="mr-2 h-4 w-4" /> Take Photo
        </Button>
      </div>

      <input
        id={`${idPrefix}Upload`}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        className="hidden"
      />
    </Card>
  );

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 bg-background">
      <div className="max-w-3xl w-full">
        {/* Removed text color utility (text-blue-400) */}
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          Deposit a Check
        </h1>
        {/* Changed text color to muted-foreground */}
        <p className="text-lg text-muted-foreground mb-10 text-center">
          Securely upload the front and back of your check.
        </p>

        <form
          onSubmit={handleUpload}
          className="flex flex-col items-center gap-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <ImageUploadCard
              title="Front of Check"
              image={front_image}
              setImage={setimage1}
              idPrefix="front"
            />
            <ImageUploadCard
              title="Back of Check"
              image={back_image}
              setImage={setimage2}
              idPrefix="back"
            />
          </div>

          <div className="w-full max-w-sm space-y-4 mt-4">
            <Input
              id="deposit"
              required
              placeholder="Enter deposit amount"
              type="number"
              min="1"
              max="10000"
              value={amount ?? ""}
              onChange={(e) =>
                setAmount(e.target.value === "" ? null : Number(e.target.value))
              }
              step="0.01"
              // Removed explicit text and background colors, letting theme handle it
              className="h-12 text-lg"
            />
            {/* Changed text color to use error semantic color (text-red-500) */}
            {error && (
              <p className="text-destructive text-sm text-center font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              // Removed explicit colors, letting primary variant handle it
              className="w-full h-12 text-lg font-semibold rounded-lg transition-colors dark:text-white"
              disabled={
                !front_image || !back_image || amount === null || amount <= 0
              }
            >
              {front_image && back_image
                ? "Submit Check for Deposit"
                : "Upload Missing Sides"}
            </Button>
          </div>
        </form>
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-lg rounded-xl shadow-2xl"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="mt-6 flex gap-4">
            {/* Using default primary button style */}
            <Button
              onClick={capturePhoto}
              className="text-lg font-semibold h-12 px-6"
            >
              Capture Photo
            </Button>
            {/* Using outline variant and relying on default colors */}
            <Button
              variant="outline"
              onClick={() => setShowCamera(null)}
              className="text-lg font-semibold h-12 px-6"
            >
              <X className="mr-2 h-5 w-5" /> Cancel
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
