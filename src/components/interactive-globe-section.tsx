"use client";

import React, { useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
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
        camera={{ position: [0, 0, 6], fov: 55 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
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
