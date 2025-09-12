import About from "../components/about";
import Services from "../components/services";
import Teams from "../components/teams";
import WorkMarquee from "../components/work-marquee";
import BrandsSlider from "../components/brands-slider";
import { Scene } from "@/components/scene";
import Marquee from "../components/marquee";
import FullscreenVideo from "../components/fullscreen-video";

export default function Home() {
  return (
    <div className="container">
      <div className="scene-container">
        <Scene />
      </div>
      <Marquee />
      <About />
      <Teams />
      <BrandsSlider />
      <Services />
      <FullscreenVideo
        videos={[
          {
            playbackId: "Kn017g6ax7ZC14b01VCbyozkWsWJCrHcej8qsMkNiYBIU",
            title: "Giant Receipt Project - MAC Cosmetics",
            caseStudySlug: "mac-cosmetics"
          },
          {
            playbackId: "saKMQupIrVioY7mdPtRAIdCdrUWZX7ZzhRrYB00H007UI",
            title: "SoHo Installation - Behind the Scenes",
            caseStudySlug: "soho-installation"
          },
          {
            playbackId: "qLH6CPgJy00HIJxh8B67oLjT87Ly2VF00zEzvYaQk1qvA",
            title: "Lipstick Day Campaign - Final Cut",
            caseStudySlug: "lipstick-campaign"
          },
          {
            playbackId: "GO9pmH6uyGB00x024YZ2Jv1c7XJvatGx02qDGJCTZMLtDY",
            title: "Creative Campaign Project",
            caseStudySlug: "creative-campaign"
          }
        ]}
        autoPlay={true}
        muted={true}
        loop={true}
      />
      <WorkMarquee />
    </div>
  );
}
