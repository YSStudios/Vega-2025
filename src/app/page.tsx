import About from "../components/about";
import WorkMarquee from "../components/work-marquee";
import BrandsSlider from "../components/brands-slider";
import { Scene } from "@/components/scene";
import Marquee from "../components/marquee";
import ScrollVideoSection from "../components/scroll-video-section";
import ProjectAccordion from "../components/project-accordion";

export default function Home() {
  return (
    <div className="container">
      <div className="hero-section">
        <div className="scene-container">
          <Scene />
        </div>
        <Marquee />
      </div>
      <About />
      <ScrollVideoSection />
      <ProjectAccordion />
      <WorkMarquee />
      <BrandsSlider />
    </div>
  );
}
