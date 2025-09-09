import About from '../components/about';
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
    </div>
  );
}
