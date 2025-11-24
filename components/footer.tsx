import Link from "next/link";
import { Logo } from "@/components/logo";

export default function FooterSection() {
  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Logo />
        </Link>

        <span className="text-muted-foreground block text-center text-sm mt-3">
          {" "}
          © {new Date().getFullYear()} Group 1, All rights reserved
        </span>
      </div>
    </footer>
  );
}
