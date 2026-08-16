import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import SkillCategories from "@/components/landing/SkillCategories";
import FeaturedMatches from "@/components/landing/FeaturedMatches";
import WhySkillSwap from "@/components/landing/WhySkillSwap";
import CommunityStats from "@/components/landing/CommunityStats";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <SkillCategories />
        <FeaturedMatches />
        <WhySkillSwap />
        <CommunityStats />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
