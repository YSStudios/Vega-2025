"use client";

import React, { useEffect, useRef } from "react";
import { useAccentColor } from "../contexts/accent-color-context";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { MotionBloomPass } from "../webgl/postprocessing/motion-bloom-pass";
import { ChromaticAberrationPass } from "../webgl/postprocessing/chromatic-aberration-pass";
import { GPGPU } from "../webgl/gpgpu/gpgpu";
import { GUI } from "lil-gui";
import styles from "../styles/scene.module.css";

const accents = ["#0093d0", "#00a78f", "#ff5057", "#ffde00"];

interface SceneProps {
  animationSpeedRef?: React.MutableRefObject<number>;
  className?: string;
}

export function Scene({ animationSpeedRef, className }: SceneProps) {
  const { currentAccent, setCurrentAccent } = useAccentColor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [accentIndex, setAccentIndex] = React.useState(() => {
    const index = accents.indexOf(currentAccent);
    return index >= 0 ? index : 0;
  });

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gpgpuRef = useRef<GPGPU | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<MotionBloomPass | null>(null);
  const chromaticPassRef = useRef<ChromaticAberrationPass | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const loadedRef = useRef(false);
  const guiRef = useRef<GUI | null>(null);
  const cameraAnimationRef = useRef<number | null>(null);
  const lastCameraChangeRef = useRef<number>(0);

  const settings = {
    camera: {
      fov: 50,
      near: 0.1,
      far: 1000,
      initialPosition: { x: 0, y: 0, z: 3 },
    },
    gpgpu: {
      particleSize: 600,
      particleColor: new THREE.Color(currentAccent),
      size: 1.7,
      minAlpha: 0.4,
      maxAlpha: 0.95,
      force: 0.05,
    },
    wave: {
      amplitude: 0.0,
      frequency: 1.0,
      speed: 1.0,
    },
    cameraAnimation: {
      enabled: true,
      duration: 4, // seconds between camera changes
    },
    colorShift: {
      enabled: false,
      speed: 0.5, // color shift speed
      colors: ["#0093d0", "#00a78f", "#ff5057", "#ffde00", "#9b59b6", "#e74c3c", "#f39c12", "#2ecc71"],
    },
    bloom: {
      threshold: 0.6,
      strength: 0.4,
      radius: 0,
	  directionX: 1.5,
	  directionY: 1,
    },
    chromatic: {
      particleIntensity: 0.0,
      aberrationAmount: 0.003,
      aberrationAngle: 0.0,
    },
    renderer: {
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1,
      backgroundColor: "#000000",
    },
  };

  const init = () => {
    if (!canvasRef.current || loadedRef.current) return;

    const ww = window.innerWidth;
    const wh = window.innerHeight;

    // Setup renderer
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      powerPreference: "high-performance",
    });
    rendererRef.current.setSize(ww, wh);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    rendererRef.current.setClearColor(settings.renderer.backgroundColor, 1);
    rendererRef.current.toneMapping = settings.renderer.toneMapping;
    rendererRef.current.toneMappingExposure = settings.renderer.toneMappingExposure;

    // Setup scene
    sceneRef.current = new THREE.Scene();

    // Setup camera
    cameraRef.current = new THREE.PerspectiveCamera(
      settings.camera.fov,
      ww / wh,
      settings.camera.near,
      settings.camera.far
    );
    cameraRef.current.position.set(
      settings.camera.initialPosition.x,
      settings.camera.initialPosition.y,
      settings.camera.initialPosition.z
    );
    cameraRef.current.lookAt(0, 0, 0);
    sceneRef.current.add(cameraRef.current);

    // Setup Orbit Controls
    orbitControlsRef.current = new OrbitControls(cameraRef.current, canvasRef.current);
    orbitControlsRef.current.enableDamping = true;
    orbitControlsRef.current.enableZoom = false;
    orbitControlsRef.current.enablePan = false;

    // Setup Post-processing
    composerRef.current = new EffectComposer(rendererRef.current);
    const renderPass = new RenderPass(sceneRef.current, cameraRef.current);
    composerRef.current.addPass(renderPass);

    bloomPassRef.current = new MotionBloomPass(
      new THREE.Vector2(ww, wh),
      1.5,
      0.4,
      0.85
    );
    // Override with our settings
    bloomPassRef.current.threshold = settings.bloom.threshold;
    bloomPassRef.current.strength = settings.bloom.strength;
    bloomPassRef.current.radius = settings.bloom.radius;
    bloomPassRef.current.BlurDirectionX.set(settings.bloom.directionX, 1.1);
    bloomPassRef.current.BlurDirectionY.set(settings.bloom.directionY, 1.0);
    composerRef.current.addPass(bloomPassRef.current);

    // Add chromatic aberration pass
    chromaticPassRef.current = new ChromaticAberrationPass();
    chromaticPassRef.current.uniforms['amount'].value = settings.chromatic.aberrationAmount;
    chromaticPassRef.current.uniforms['angle'].value = settings.chromatic.aberrationAngle;
    composerRef.current.addPass(chromaticPassRef.current);

    const outputPass = new OutputPass();
    composerRef.current.addPass(outputPass);

    // Load GLB model and setup GPGPU
    const loader = new GLTFLoader();
    loader.load(
      "/vega-v-logo.glb",
      (gltf) => {
        let mergedMesh: THREE.Mesh | null = null;
        
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            const geometry = child.geometry.clone();
            child.updateWorldMatrix(true, false);
            geometry.applyMatrix4(child.matrixWorld);
            
            if (!mergedMesh) {
              mergedMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
            } else {
              const newGeometry = new THREE.BufferGeometry();
              const positions: number[] = [];

              // Merge geometries manually
              const oldPos = mergedMesh.geometry.attributes.position;
              const newPos = geometry.attributes.position;

              for (let i = 0; i < oldPos.count; i++) {
                positions.push(oldPos.getX(i), oldPos.getY(i), oldPos.getZ(i));
              }
              for (let i = 0; i < newPos.count; i++) {
                positions.push(newPos.getX(i), newPos.getY(i), newPos.getZ(i));
              }

              newGeometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(positions, 3)
              );

              mergedMesh.geometry.dispose();
              mergedMesh.geometry = newGeometry;
            }
          }
        });

        if (mergedMesh && sceneRef.current && rendererRef.current && cameraRef.current) {
          // Scale and rotate the model to fit the scene better
          const scale = 0.5;
          const tempMesh = mergedMesh as THREE.Mesh;
          
          // Set position first
          tempMesh.position.set(0, 0.25, 0);
          tempMesh.scale.set(scale, scale, scale);
          
          // Rotate 90 degrees on X axis
          tempMesh.rotation.x = Math.PI / 2;
          tempMesh.updateMatrix();
          tempMesh.geometry.applyMatrix4(tempMesh.matrix);
          tempMesh.rotation.set(0, 0, 0);
          tempMesh.scale.set(1, 1, 1);
          tempMesh.updateMatrix();

          gpgpuRef.current = new GPGPU({
            size: settings.gpgpu.particleSize,
            camera: cameraRef.current,
            renderer: rendererRef.current,
            mouse: mouseRef.current,
            scene: sceneRef.current,
            sizes: { width: ww, height: wh },
            model: mergedMesh,
            params: {
              color: settings.gpgpu.particleColor,
              size: settings.gpgpu.size,
              minAlpha: settings.gpgpu.minAlpha,
              maxAlpha: settings.gpgpu.maxAlpha,
              force: settings.gpgpu.force,
            },
            canvas: canvasRef.current,
          });

          loadedRef.current = true;
          
          // Setup debug controls after GPGPU is initialized
          setupDebugControls();
          
          render();
        }
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model:", error);
      }
    );
  };

  const animateCameraToNewPosition = () => {
    if (!cameraRef.current) return;

    // Define different camera positions
    const cameraPositions = [
      { x: 2, y: 1, z: 2 },      // Top right
      { x: -2, y: 1, z: 2 },     // Top left
      { x: 2, y: -1, z: 2 },     // Bottom right
      { x: -2, y: -1, z: 2 },    // Bottom left
      { x: 0, y: 2, z: 2 },      // Top center
      { x: 0, y: -2, z: 2 },     // Bottom center
      { x: 3, y: 0, z: 1 },      // Right side
      { x: -3, y: 0, z: 1 },     // Left side
    ];

    // Pick a random position
    const randomIndex = Math.floor(Math.random() * cameraPositions.length);
    const targetPosition = cameraPositions[randomIndex];

    // Smoothly animate to new position
    const startPosition = cameraRef.current.position.clone();
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easedProgress = easeInOutCubic(progress);

      // Interpolate position
      cameraRef.current!.position.lerpVectors(startPosition, new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z), easedProgress);

      if (progress < 1) {
        cameraAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const render = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    animationFrameRef.current = requestAnimationFrame(render);

    // Update GPGPU
    if (gpgpuRef.current) {
      gpgpuRef.current.compute();
    }

    // Camera animation
    if (settings.cameraAnimation.enabled && cameraRef.current) {
      const now = performance.now() * 0.001;
      if (now - lastCameraChangeRef.current > settings.cameraAnimation.duration) {
        animateCameraToNewPosition();
        lastCameraChangeRef.current = now;
      }
    }

    // Color shifting
    if (settings.colorShift.enabled && gpgpuRef.current) {
      const time = performance.now() * 0.001;
      const totalTime = time * settings.colorShift.speed;
      const colorIndex = Math.floor(totalTime) % settings.colorShift.colors.length;
      const nextColorIndex = (colorIndex + 1) % settings.colorShift.colors.length;
      const t = totalTime - Math.floor(totalTime);
      
      const currentColor = new THREE.Color(settings.colorShift.colors[colorIndex]);
      const nextColor = new THREE.Color(settings.colorShift.colors[nextColorIndex]);
      
      const interpolatedColor = currentColor.clone().lerp(nextColor, t);
      gpgpuRef.current.updateColor(interpolatedColor);
    }

    // Update Orbit Controls
    if (orbitControlsRef.current) {
      orbitControlsRef.current.update();
    }

    // Render with composer (post-processing)
    if (composerRef.current) {
      rendererRef.current.clear();
      composerRef.current.render();
    } else {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const handleResize = () => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    
    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.setSize(ww, wh);
      cameraRef.current.aspect = ww / wh;
      cameraRef.current.updateProjectionMatrix();

      if (composerRef.current) {
        composerRef.current.setSize(ww, wh);
        composerRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      }

      if (gpgpuRef.current) {
        gpgpuRef.current.material.uniforms.uResolution.value.set(ww, wh);
      }
    }
  };

  const handleCanvasClick = () => {
    const nextIndex = (accentIndex + 1) % accents.length;
    setAccentIndex(nextIndex);
    setCurrentAccent(accents[nextIndex]);
  };

  const setupDebugControls = () => {
    if (typeof window === "undefined" || !gpgpuRef.current) return;

    // Remove existing GUI if present
    if (guiRef.current) {
      guiRef.current.destroy();
    }

    guiRef.current = new GUI({ title: "Particle Controls" });

    const particlesFolder = guiRef.current.addFolder("Particles");
    
    // Color control
    const colorControl = {
      color: `#${gpgpuRef.current.material.uniforms.uColor.value.getHexString()}`,
    };
    particlesFolder
      .addColor(colorControl, "color")
      .name("Color")
      .onChange((value: string) => {
        if (gpgpuRef.current) {
          gpgpuRef.current.material.uniforms.uColor.value = new THREE.Color(value);
        }
      });

    // Particle size
    particlesFolder
      .add(gpgpuRef.current.material.uniforms.uParticleSize, "value")
      .name("Size")
      .min(1)
      .max(10)
      .step(0.1);

    // Force (velocity damping)
    particlesFolder
      .add(gpgpuRef.current.uniforms.velocityUniforms.uForce, "value")
      .name("Force")
      .min(0)
      .max(0.8)
      .step(0.01);

    // Min Alpha
    particlesFolder
      .add(gpgpuRef.current.material.uniforms.uMinAlpha, "value")
      .name("Min Alpha")
      .min(0)
      .max(1)
      .step(0.01);

    // Max Alpha
    particlesFolder
      .add(gpgpuRef.current.material.uniforms.uMaxAlpha, "value")
      .name("Max Alpha")
      .min(0)
      .max(1)
      .step(0.01);

    // Mouse Radius
    particlesFolder
      .add(gpgpuRef.current.uniforms.velocityUniforms.uMouseRadius, "value")
      .name("Mouse Radius")
      .min(0)
      .max(0.5)
      .step(0.01);

    // Mouse Strength
    particlesFolder
      .add(gpgpuRef.current.uniforms.velocityUniforms.uMouseStrength, "value")
      .name("Mouse Strength")
      .min(0)
      .max(0.1)
      .step(0.001);

    // Chromatic Intensity
    particlesFolder
      .add(gpgpuRef.current.material.uniforms.uChromaticIntensity, "value")
      .name("Chromatic Intensity")
      .min(0)
      .max(1)
      .step(0.01);

    // Blend Mode
    const blendModeOptions = {
      Normal: THREE.NormalBlending,
      Additive: THREE.AdditiveBlending,
      Multiply: THREE.MultiplyBlending,
      Subtractive: THREE.SubtractiveBlending,
    };
    const blendModeControl = { mode: "Normal" };
    particlesFolder
      .add(blendModeControl, "mode", Object.keys(blendModeOptions))
      .name("Blend Mode")
      .onChange((value: string) => {
        if (gpgpuRef.current) {
          gpgpuRef.current.material.blending = blendModeOptions[value as keyof typeof blendModeOptions];
          // MultiplyBlending and SubtractiveBlending require premultipliedAlpha = true
          gpgpuRef.current.material.premultipliedAlpha = (value === "Multiply" || value === "Subtractive");
          gpgpuRef.current.material.needsUpdate = true;
        }
      });

    // Wave distortion controls
    if (gpgpuRef.current) {
      particlesFolder
        .add(gpgpuRef.current.uniforms.velocityUniforms.uWaveAmplitude, "value")
        .name("Wave Amplitude")
        .min(0)
        .max(0.5)
        .step(0.01);

      particlesFolder
        .add(gpgpuRef.current.uniforms.velocityUniforms.uWaveFrequency, "value")
        .name("Wave Frequency")
        .min(0.1)
        .max(10)
        .step(0.1);

      particlesFolder
        .add(gpgpuRef.current.uniforms.velocityUniforms.uWaveSpeed, "value")
        .name("Wave Speed")
        .min(0)
        .max(5)
        .step(0.1);
    }

    // Color shifting controls
    const colorShiftControl = {
      enabled: settings.colorShift.enabled,
      speed: settings.colorShift.speed,
    };
    
    particlesFolder
      .add(colorShiftControl, "enabled")
      .name("Color Shift")
      .onChange((value: boolean) => {
        settings.colorShift.enabled = value;
      });

    particlesFolder
      .add(colorShiftControl, "speed")
      .name("Color Speed")
      .min(0.1)
      .max(2)
      .step(0.1)
      .onChange((value: number) => {
        settings.colorShift.speed = value;
      });

    particlesFolder.open();

    // Camera folder
    const cameraFolder = guiRef.current.addFolder("Camera");
    
    if (cameraRef.current) {
      cameraFolder
        .add(cameraRef.current.position, "z")
        .name("Distance")
        .min(0.5)
        .max(5)
        .step(0.1);

      cameraFolder
        .add(cameraRef.current, "fov")
        .name("FOV")
        .min(15)
        .max(120)
        .step(1)
        .onChange(() => {
          if (cameraRef.current) {
            cameraRef.current.updateProjectionMatrix();
          }
        });
    }

    // Camera animation controls
    const cameraAnimationControl = {
      enabled: settings.cameraAnimation.enabled,
      duration: settings.cameraAnimation.duration,
    };
    
    cameraFolder
      .add(cameraAnimationControl, "enabled")
      .name("Auto Rotate")
      .onChange((value: boolean) => {
        settings.cameraAnimation.enabled = value;
      });

    cameraFolder
      .add(cameraAnimationControl, "duration")
      .name("Change Interval")
      .min(1)
      .max(10)
      .step(0.5)
      .onChange((value: number) => {
        settings.cameraAnimation.duration = value;
      });

    cameraFolder.close();

    // Post Processing folder
    const postProcessingFolder = guiRef.current.addFolder("Post Processing");

    // Bloom controls
    if (bloomPassRef.current) {
      postProcessingFolder
        .add(bloomPassRef.current, "threshold")
        .name("Bloom Threshold")
        .min(0)
        .max(1)
        .step(0.001);

      postProcessingFolder
        .add(bloomPassRef.current, "strength")
        .name("Bloom Strength")
        .min(0)
        .max(3)
        .step(0.01);

      postProcessingFolder
        .add(bloomPassRef.current, "radius")
        .name("Bloom Radius")
        .min(0)
        .max(1)
        .step(0.01);

      postProcessingFolder
        .add(bloomPassRef.current.BlurDirectionX, "x")
        .name("Direction X")
        .min(0)
        .max(10)
        .step(0.01);

      postProcessingFolder
        .add(bloomPassRef.current.BlurDirectionY, "y")
        .name("Direction Y")
        .min(0)
        .max(10)
        .step(0.01);
    }

    // Chromatic Aberration controls
    if (chromaticPassRef.current) {
      postProcessingFolder
        .add(chromaticPassRef.current.uniforms['amount'], "value")
        .name("Aberration Amount")
        .min(0)
        .max(0.02)
        .step(0.0001);

      postProcessingFolder
        .add(chromaticPassRef.current.uniforms['angle'], "value")
        .name("Aberration Angle")
        .min(0)
        .max(Math.PI * 2)
        .step(0.01);
    }

    postProcessingFolder.close();

    // Renderer folder
    const rendererFolder = guiRef.current.addFolder("Renderer");
    
    if (rendererRef.current) {
      const toneMappingOptions = {
        NoToneMapping: THREE.NoToneMapping,
        LinearToneMapping: THREE.LinearToneMapping,
        ReinhardToneMapping: THREE.ReinhardToneMapping,
        CineonToneMapping: THREE.CineonToneMapping,
        ACESFilmicToneMapping: THREE.ACESFilmicToneMapping,
      };

      const toneMappingControl = {
        toneMapping: "ACESFilmicToneMapping",
      };

      rendererFolder
        .add(toneMappingControl, "toneMapping", Object.keys(toneMappingOptions))
        .name("Tone Mapping")
        .onChange((value: string) => {
          if (rendererRef.current && sceneRef.current) {
            rendererRef.current.toneMapping = toneMappingOptions[value as keyof typeof toneMappingOptions];
            sceneRef.current.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                child.material.needsUpdate = true;
              }
            });
          }
        });

      rendererFolder
        .add(rendererRef.current, "toneMappingExposure")
        .name("Exposure")
        .min(0)
        .max(10)
        .step(0.1);

      // Background color control
      const backgroundColorControl = {
        color: settings.renderer.backgroundColor,
      };
      rendererFolder
        .addColor(backgroundColorControl, "color")
        .name("Background Color")
        .onChange((value: string) => {
          if (rendererRef.current) {
            settings.renderer.backgroundColor = value;
            rendererRef.current.setClearColor(value, 1);
          }
        });
    }

    rendererFolder.close();
  };

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (gpgpuRef.current) {
      gpgpuRef.current.dispose();
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    if (guiRef.current) {
      guiRef.current.destroy();
      guiRef.current = null;
    }
  };

  useEffect(() => {
    init();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (gpgpuRef.current && loadedRef.current) {
      const newColor = new THREE.Color(currentAccent);
      gpgpuRef.current.updateColor(newColor);
    }
  }, [currentAccent]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className={className || styles.canvas}
    />
  );
}
