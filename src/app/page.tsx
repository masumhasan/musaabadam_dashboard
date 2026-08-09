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
        <div id="explore">
          <Hero />
        </div>
        <ContinuousSlider />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="categories">
          <Categories />
        </div>
        <div id="live-now">
          <LiveNow />
        </div>
        <SellerCTA />
        <Testimonials />
        <div id="sell-on-bidsrush">
          <DownloadApp />
        </div>
        <Footer />
      </div>
    </>
  );
}
