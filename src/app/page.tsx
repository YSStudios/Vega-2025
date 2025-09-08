import About from '../components/about';
import { Scene } from '@/components/scene'

export default function Home() {
  return (
    <div className="container">
		<div className="scene-container">
        <Scene />
      </div>
      <div className="scroll-indicator">
        <span className="scroll-text">scroll down</span>
        <div className="scroll-arrow">↓</div>
      </div>
      <About />
      
    </div>
  );
}
