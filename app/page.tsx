import { auth0, getRole } from "@/lib/auth0";
import { AppHeader } from "../components/landing/app-header";
import HeroSection from "@/components/hero-section";
import Features from "@/components/features-3";
import StatsSection from "@/components/stats-2";
import TeamSection from "@/components/team";
import FooterSection from "@/components/footer";

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) {
    return (
      <div>
        <HeroSection />

        <section id="features">
          <Features />
        </section>

        <section id="about">
          <StatsSection />
        </section>

        <section id="contact">
          <TeamSection />
        </section>

        <FooterSection />
      </div>
    );
  }
  const { redirect } = await import("next/navigation");
  const roles = getRole(session);
  if (roles.includes("Admin")) {
    redirect("/admin/dashboard");
  }
  redirect('/dashboard')
}
