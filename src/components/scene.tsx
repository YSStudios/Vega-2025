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
]

interface SceneProps {
  className?: string
}

function OrbitingScene({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state, delta) => {
    if (ref.current) {
      // Very slow rotation around Y-axis (one full rotation every ~30 seconds)
      ref.current.rotation.y += delta * 0.05
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
  
  // Update context when accent changes
  useEffect(() => {
    setCurrentAccent(accents[accent])
  }, [accent, setCurrentAccent])
  
  return (
    <>
      <Canvas 
        onClick={click} 
        shadows 
        dpr={[1, 1.5]} 
        gl={{ antialias: false }} 
        camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 30 }} 
        {...props}
      >
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <OrbitingScene>
          <Physics gravity={[0, 0, 0]}>
            <Pointer />
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
          </Physics>
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
  const api = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const r = THREE.MathUtils.randFloatSpread
  const pos = useMemo(() => position || [r(20), r(20), r(20)] as [number, number, number], [position, r])
  
  useFrame((state, delta) => {
    Math.min(0.1, delta)
    if (api.current) {
      const impulse = vec.copy(api.current.translation()).negate().multiplyScalar(0.2)
      api.current.applyImpulse(impulse, true)
    }
  })
  
  return (
    <RigidBody 
      linearDamping={4} 
      angularDamping={1} 
      friction={0.1} 
      position={pos} 
      ref={api} 
      colliders={false}
    >
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ? children : <Model {...props} />}
      {accent && <pointLight intensity={4} distance={5.5} color={props.color} />}
    </RigidBody>
  )
}

function Pointer() {
  const ref = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  
  useFrame(({ mouse, viewport }) => {
    if (ref.current) {
      ref.current.setNextKinematicTranslation(
        vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)
      )
    }
  })
  
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
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
