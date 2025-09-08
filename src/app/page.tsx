import About from '../components/about';
import { Scene } from '@/components/scene'

export default function Home() {
  return (
    <div className="container">
      <About />
      <div className="scene-container">
        <Scene />
      </div>
    </div>
  );
}
