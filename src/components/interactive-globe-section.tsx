"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import styles from "../styles/interactive-globe-section.module.css";

interface GlobeProps {
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

function WireframeGlobe({ isHovered, onHover, onClick }: GlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = -state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Invisible sphere for pointer events - slightly smaller to avoid visual interference */}
      <mesh
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[1.15, 32, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      
      {/* Visible wireframe sphere */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 16]} />
        <meshBasicMaterial 
          color={isHovered ? "#00ff88" : "#ffffff"} 
          wireframe 
          transparent 
          opacity={isHovered ? 1 : 0.8} 
        />
      </mesh>
    </group>
  );
}

function SimpleRing({ isHovered, onHover, onClick }: GlobeProps) {
  const ringRef = useRef<THREE.Group>(null);

  const ringRadius = 1.8;
  const ringHeight = 0.2;
  const ringTiltX = 0.1; // Almost flat along x-axis
  const ringTiltZ = 0.05;

  useFrame((state) => {
    if (ringRef.current) {
      // Slowly rotate the entire ring group in opposite direction from globe
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  // Create canvas texture with repeating text
  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 128;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Clear canvas
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text style
    ctx.fillStyle = isHovered ? '#00ff88' : '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Draw repeating text
    const text = 'VEGA.EARTH  ';
    const textWidth = ctx.measureText(text).width;
    const repetitions = Math.ceil(canvas.width / textWidth) + 1;
    
    for (let i = 0; i < repetitions; i++) {
      ctx.fillText(text, i * textWidth, canvas.height / 2);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(3, 1); // Repeat texture 3 times around the cylinder
    texture.needsUpdate = true;
    
    return texture;
  }, [isHovered]);

  return (
    <group ref={ringRef}>
      {/* Cylinder with text texture */}
      <mesh 
        rotation={[ringTiltX, 0, ringTiltZ]}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <cylinderGeometry args={[ringRadius, ringRadius, ringHeight, 64, 1, true]} />
        <meshBasicMaterial 
          map={textTexture}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  
  const particleCount = 550;
  
  // Create geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    
    const globeRadius = 1.2;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      let x, y, z;
      
      // Keep generating until we get a valid particle position
      let isValid = false;
      do {
        const radius = 4 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
        
        // Check if particle would be in front of the globe sphere
        const distXY = Math.sqrt(x * x + y * y);
        
        // If outside globe's cylinder projection, particle is valid
        if (distXY >= globeRadius) {
          isValid = true;
        } else {
          // If inside projection, check if behind the globe surface
          const globeFrontZ = Math.sqrt(globeRadius * globeRadius - distXY * distXY);
          isValid = z < -globeFrontZ;
        }
        
      } while (!isValid);
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Random size variation for more realistic stars
      sizes[i] = 0.1 + Math.random() * 0.3;
      
      // Random alpha variation
      alphas[i] = 0.6 + Math.random() * 0.4;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    
    return geo;
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX - window.innerWidth / 2;
      mouse.current.y = e.clientY - window.innerHeight / 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useFrame(({ camera }) => {
    // Smooth camera follow like the example
    camera.position.x += (mouse.current.x * 0.001 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y * 0.001 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    
    // Slowly rotate the particles around the globe
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute float alpha;
          varying float vAlpha;
          
          void main() {
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (100.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            
            // Create a circular falloff
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            // Add a bright core
            float core = 1.0 - smoothstep(0.0, 0.2, distanceToCenter);
            
            // Combine core and falloff for star-like appearance
            float finalAlpha = alpha * vAlpha;
            vec3 color = vec3(1.0, 1.0, 1.0) * (0.3 + core * 0.7);
            
            gl_FragColor = vec4(color, finalAlpha);
          }
        `}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={{}}
      />
    </points>
  );
}

export default function InteractiveGlobeSection() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open('https://vega.earth', '_blank');
  };

  return (
    <motion.div
      className={styles.interactiveSection}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      style={{ cursor: isHovered ? 'pointer' : 'default' }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55, near: 1 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <Particles />
        
        <WireframeGlobe 
          isHovered={isHovered} 
          onHover={setIsHovered} 
          onClick={handleClick}
        />
        <SimpleRing 
          isHovered={isHovered} 
          onHover={setIsHovered} 
          onClick={handleClick}
        />
      </Canvas>
    </motion.div>
  );
}
