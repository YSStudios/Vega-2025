import About from '../components/about';
import Teams from '../components/teams';
import WorkMarquee from '../components/work-marquee';
import BrandsSlider from '../components/brands-slider';
import { Scene } from '@/components/scene'
import Marquee from '../components/marquee';

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
      <WorkMarquee />
    </div>
  );
}
