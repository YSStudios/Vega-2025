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
        src="https://res.cloudinary.com/dhj9rq4mu/video/upload/v1755711349/We_built_a_giant_receipt_in_SoHo_for_maccosmetics_lipstickday_reels_cosmetics_mac_rkndgq.mp4"
        autoPlay={true}
        muted={true}
        loop={true}
      />
      <WorkMarquee />
    </div>
  );
}
