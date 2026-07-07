import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ContinuousSlider from "@/components/landing/ContinusSlider";
import HowItWorks from "@/components/landing/HowItWorks";
import Categories from "@/components/landing/Categories";
import LiveNow from "@/components/landing/LiveNow";
import SellerCTA from "@/components/landing/SellerCTA";
import Testimonials from "@/components/landing/Testimonials";
import DownloadApp from "@/components/landing/DownloadApp";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="pt-8">
        <Hero />
        <ContinuousSlider />
        <HowItWorks />
        <Categories />
        <LiveNow />
        <SellerCTA />
        <Testimonials />
        <DownloadApp />
        <Footer />
      </div>
    </>
  );
}
