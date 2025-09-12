import About from "../components/about";
import Services from "../components/services";
import Teams from "../components/teams";
import WorkMarquee from "../components/work-marquee";
import BrandsSlider from "../components/brands-slider";
import { Scene } from "@/components/scene";
import Marquee from "../components/marquee";
import FullscreenVideo from "../components/fullscreen-video";
import { FullscreenSticky } from "../components/fullscreen-sticky";

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
      {/* <FullscreenVideo
        src="https://res.cloudinary.com/dhj9rq4mu/video/upload/v1755711349/We_built_a_giant_receipt_in_SoHo_for_maccosmetics_lipstickday_reels_cosmetics_mac_rkndgq.mp4"
        autoPlay={true}
        muted={true}
        loop={true}
      /> */}
      
      {/* Fullscreen Sticky Demo Sections with Mux Videos */}
      <FullscreenSticky 
        title="Creative Excellence"
        description="We specialize in creating stunning visual experiences that combine cutting-edge technology with creative storytelling. Our immersive approach captivates audiences and drives meaningful engagement through innovative design solutions."
        videoNumber="01"
        muxPlaybackId="GO9pmH6uyGB00x024YZ2Jv1c7XJvatGx02qDGJCTZMLtDY"
      />

      <FullscreenSticky 
        title="Brand Innovation"
        description="From concept to completion, we work closely with industry leaders to understand their vision and bring it to life through strategic thinking and creative execution that resonates with target audiences."
        videoNumber="02"
        muxPlaybackId="qLH6CPgJy00HIJxh8B67oLjT87Ly2VF00zEzvYaQk1qvA"
      />

      <FullscreenSticky 
        title="Connected Experiences"
        description="Every project is an opportunity to push creative boundaries and explore new possibilities. We craft experiences that tell stories, build connections, and deliver exceptional results across all touchpoints."
        videoNumber="03"
        muxPlaybackId="saKMQupIrVioY7mdPtRAIdCdrUWZX7ZzhRrYB00H007UI"
      />

      <FullscreenSticky 
        title="Future Forward"
        description="As technology evolves, we stay at the forefront of digital innovation. Every line of code, every pixel, every interaction is carefully crafted to deliver intuitive solutions that inspire and engage."
        videoNumber="04"
        muxPlaybackId="Kn017g6ax7ZC14b01VCbyozkWsWJCrHcej8qsMkNiYBIU"
        disableScrollSnap={true}
        relativeTextPosition={true}
      />
      
      <WorkMarquee />
    </div>
  );
}
