'use client'

import * as THREE from 'three'
import { useRef, useReducer, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody, RapierRigidBody } from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { easing } from 'maath'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAccentColor } from '../contexts/accent-color-context'

const accents = ['#0093d0', '#00a78f', '#ff5057', '#ffde00']

const shuffle = (accent = 0) => [
  // Original objects
  { color: '#444', roughness: 0.1, metalness: 0.2 },
  { color: '#444', roughness: 0.75, metalness: 0.2 },
  { color: '#444', roughness: 0.1, metalness: 0.2 },
  { color: 'white', roughness: 0.1, metalness: 0.2 },
  { color: 'white', roughness: 0.75, metalness: 0.2 },
  { color: 'white', roughness: 0.1, metalness: 0.2 },
  { color: accents[accent], roughness: 0.1, metalness: 0.2, accent: true },
  { color: accents[accent], roughness: 0.75, metalness: 0.2, accent: true },
  { color: accents[accent], roughness: 0.1, metalness: 0.2, accent: true },
  { color: accents[accent], metalness: 1, roughness: 0 },
  { color: accents[accent], metalness: 1, roughness: 1 },

  // Additional smaller objects for filling
  { color: '#666', roughness: 0.3, metalness: 0.1 },
  { color: '#666', roughness: 0.8, metalness: 0.1 },
  { color: 'white', roughness: 0.2, metalness: 0.3 },
  { color: 'white', roughness: 0.6, metalness: 0.3 },
  { color: '#888', roughness: 0.4, metalness: 0.2 },
  { color: '#888', roughness: 0.9, metalness: 0.2 },
  { color: accents[accent], roughness: 0.2, metalness: 0.3 },
  { color: accents[accent], roughness: 0.6, metalness: 0.3 },
  { color: '#999', roughness: 0.5, metalness: 0.1 },
  { color: '#777', roughness: 0.7, metalness: 0.1 },
  { color: 'white', roughness: 0.3, metalness: 0.4 },
  { color: '#555', roughness: 0.4, metalness: 0.3 },
]

interface SceneProps {
  className?: string
}

function OrbitingScene({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (ref.current) {
      // Rotate around X-axis for vertical circular orbit
      ref.current.rotation.x += delta * 0.1
    }
  })

  return <group ref={ref}>{children}</group>
}

export function Scene(props: SceneProps) {
  const [accent, click] = useReducer((state: number) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  const { setCurrentAccent } = useAccentColor()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [1, 0])
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 15])

  // Update context when accent changes
  useEffect(() => {
    setCurrentAccent(accents[accent])
  }, [accent, setCurrentAccent])

  // Adjust camera position based on screen size
  useEffect(() => {
    const updateCameraPosition = () => {
      const width = window.innerWidth
      if (width <= 768) {
        // Mobile: move camera further back
        setCameraPosition([0, 0, 22] as [number, number, number])
      } else if (width <= 1024) {
        // Tablet: move camera back moderately
        setCameraPosition([0, 0, 19] as [number, number, number])
      } else {
        // Desktop: default position
        setCameraPosition([0, 0, 15] as [number, number, number])
      }
    }

    updateCameraPosition()
    window.addEventListener('resize', updateCameraPosition)
    return () => window.removeEventListener('resize', updateCameraPosition)
  }, [])
  
  return (
    <>
      <Canvas
        onClick={click}
        shadows={false}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ position: cameraPosition, fov: 17.5, near: 1, far: 30 }}
        {...props}
      >
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <OrbitingScene>
          {connectors.map((connectorProps, i) => (
            <Connector key={i} {...connectorProps} />
          ))}
          <Connector position={[10, 10, 5]}>
            <Model>
              <MeshTransmissionMaterial
                clearcoat={1}
                thickness={0.1}
                anisotropicBlur={0.1}
                chromaticAberration={0.1}
                samples={8}
                resolution={512}
              />
            </Model>
          </Connector>
        </OrbitingScene>
        <EffectComposer enableNormalPass={false} multisampling={8}>
          <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
        </EffectComposer>
        <Environment preset="city" frames={1} resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer 
              form="circle" 
              intensity={4} 
              rotation-x={Math.PI / 2} 
              position={[0, 5, -9]} 
              scale={2} 
            />
            <Lightformer 
              form="circle" 
              intensity={2} 
              rotation-y={Math.PI / 2} 
              position={[-5, 1, -1]} 
              scale={2} 
            />
            <Lightformer 
              form="circle" 
              intensity={2} 
              rotation-y={Math.PI / 2} 
              position={[-5, -1, -1]} 
              scale={2} 
            />
            <Lightformer 
              form="circle" 
              intensity={2} 
              rotation-y={-Math.PI / 2} 
              position={[10, 1, 0]} 
              scale={8} 
            />
          </group>
        </Environment>
      </Canvas>
      
      <motion.div 
        initial={{ x: '-50%', opacity: 1 }}
        style={{ 
          opacity,
          x: '-50%'
        }}
        className="scroll-indicator-fixed"
      >
        <span className="scroll-text">scroll down</span>
        <div className="scroll-arrow">↓</div>
      </motion.div>
    </>
  )
}

interface ConnectorProps {
  position?: [number, number, number]
  children?: React.ReactNode
  accent?: boolean
  color?: string
  roughness?: number
  metalness?: number
}

function Connector({
  position,
  children,
  accent,
  ...props
}: ConnectorProps) {
  const meshRef = useRef<THREE.Group>(null)
  const r = THREE.MathUtils.randFloatSpread
  const pos = useMemo(() => position || [r(10), r(10), r(10)] as [number, number, number], [position, r])
  const initialPos = useMemo(() => pos, [pos])
  const randomOffset = useMemo(() => Math.random() * 10000, [])
  const scale = useMemo(() => {
    // Favor smaller objects for better performance and screen filling
    // More smaller objects, fewer large ones
    const sizes = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4]
    return sizes[Math.floor(Math.random() * sizes.length)]
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + randomOffset
      // Spinning rotation on all axes
      meshRef.current.rotation.set(
        Math.cos(t / 4) / 2,
        Math.sin(t / 4) / 2,
        Math.cos(t / 1.5) / 2
      )
      // Floating Y position
      meshRef.current.position.set(
        initialPos[0],
        initialPos[1] + Math.sin(t / 1.5) / 2,
        initialPos[2]
      )
    }
  })

  return (
    <group ref={meshRef} position={pos} scale={scale}>
      {children ? children : <Model {...props} />}
      {accent && <pointLight intensity={4} distance={5.5} color={props.color} />}
    </group>
  )
}


interface FancyRingProps extends React.ComponentProps<'mesh'> {
  geometry?: THREE.BufferGeometry
  metalness?: number
  roughness?: number
}

function FancyRing({ metalness = 0.2, roughness = 0.15, ...props }: FancyRingProps) {
  return (
    <mesh {...props}>
      <meshPhysicalMaterial 
        metalness={metalness} 
        roughness={roughness}
        clearcoat={1} 
        clearcoatRoughness={0.9}
        iridescence={1} 
        iridescenceIOR={1.3} 
        iridescenceThicknessRange={[120, 700]}
      />
    </mesh>
  )
}

interface ModelProps {
  children?: React.ReactNode
  color?: string
  roughness?: number
  metalness?: number
}

function Model({ children, color = 'white', roughness = 0.15, metalness = 0.2, ...props }: ModelProps) {
  const ref = useRef<THREE.Mesh>(null)
  
  // Using the vega-v-logo.glb file from public directory
  let nodes: { [key: string]: THREE.Object3D } = {}
  
  try {
    const gltf = useGLTF('/vega-v-logo.glb')
    nodes = gltf.nodes
  } catch {
    // Fallback geometry if GLB file doesn't exist
    console.warn('GLB file not found, using fallback geometry')
  }
  
  useFrame((state, delta) => {
    if (ref.current?.material && 'color' in ref.current.material) {
      const material = ref.current.material as THREE.MeshPhysicalMaterial
      easing.dampC(material.color, color, 0.2, delta)
    }
  })
  
  // Use the specific mesh name from the vega-v-logo.glb file
  const vegaLogoNode = nodes['vega-logo-deep'] as THREE.Mesh | undefined
  
  const geometry = vegaLogoNode?.geometry || new THREE.BoxGeometry(0.2, 0.2, 0.2)

  
  return (
    <FancyRing
      ref={ref}
      castShadow
      receiveShadow
      scale={1}
      geometry={geometry}
      metalness={metalness}
      roughness={roughness}
      rotation={[Math.PI / 2, 0, 0]}
      {...props}
    >
      {children}
    </FancyRing>
  )
}

// Preload the GLB file (optional, but recommended for performance)
useGLTF.preload('/vega-v-logo.glb')
