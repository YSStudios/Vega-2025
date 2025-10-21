import * as THREE from 'three';
import { GPGPUUtils } from './gpgpu-utils';
import { GPGPUEvents } from './gpgpu-events';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import simFragment from './shaders/simFragment.glsl';
import simFragmentVelocity from './shaders/simFragmentVelocity.glsl';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

interface GPGPUParams {
    color: THREE.Color;
    size: number;
    minAlpha: number;
    maxAlpha: number;
    force: number;
}

interface GPGPUUniforms {
    positionUniforms: { [key: string]: THREE.IUniform };
    velocityUniforms: { [key: string]: THREE.IUniform };
}

interface GPGPUConfig {
    size: number;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    mouse: { x: number; y: number };
    scene: THREE.Scene;
    sizes: { width: number; height: number };
    model: THREE.Mesh;
    params: GPGPUParams;
    canvas: HTMLCanvasElement | null;
}

export class GPGPU {
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    mouse: { x: number; y: number };
    scene: THREE.Scene;
    sizes: { width: number; height: number };
    size: number;
    model: THREE.Mesh;
    params: GPGPUParams;
    canvas: HTMLCanvasElement | null;
    utils: GPGPUUtils;
    gpgpuCompute: GPUComputationRenderer;
    positionVariable: Variable | null;
    velocityVariable: Variable | null;
    uniforms: GPGPUUniforms;
    events: GPGPUEvents;
    material: THREE.ShaderMaterial;
    mesh: THREE.Points;

    constructor(config: GPGPUConfig) {
        this.camera = config.camera;
        this.renderer = config.renderer;
        this.mouse = config.mouse;
        this.scene = config.scene;
        this.sizes = config.sizes;
        this.size = config.size;
        this.model = config.model;
        this.params = config.params;
        this.canvas = config.canvas;

        // Initialize placeholder values (will be properly set in init())
        this.gpgpuCompute = new GPUComputationRenderer(1, 1, this.renderer);
        this.positionVariable = null;
        this.velocityVariable = null;
        this.uniforms = {
            positionUniforms: {},
            velocityUniforms: {}
        };
        this.material = new THREE.ShaderMaterial();
        this.mesh = new THREE.Points();
        this.utils = new GPGPUUtils(this.model, this.size);
        // Events will be initialized after uniforms are set up
        this.events = {} as GPGPUEvents;

        this.init();
    }

    init() {
        this.utils = new GPGPUUtils(this.model, this.size);
        this.initGPGPU();
        // Now create events after uniforms are properly initialized
        this.events = new GPGPUEvents(this.mouse, this.camera, this.model, this.uniforms, this.canvas);
        this.createParticles();
    }

    initGPGPU() {
        this.gpgpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer);

        const positionTexture = this.utils.getPositionTexture();
        const velocityTexture = this.utils.getVelocityTexture();

        this.positionVariable = this.gpgpuCompute.addVariable('uCurrentPosition', simFragment, positionTexture);
        this.velocityVariable = this.gpgpuCompute.addVariable('uCurrentVelocity', simFragmentVelocity, velocityTexture);

        this.gpgpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);
        this.gpgpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);

        this.uniforms = {
            positionUniforms: this.positionVariable.material.uniforms,
            velocityUniforms: this.velocityVariable.material.uniforms
        };

        this.uniforms.velocityUniforms.uMouse = { value: new THREE.Vector3(10000, 10000, 10000) };
        this.uniforms.velocityUniforms.uMouseSpeed = { value: 0 };
        this.uniforms.velocityUniforms.uOriginalPosition = { value: positionTexture };
        this.uniforms.velocityUniforms.uTime = { value: 0 };
        this.uniforms.velocityUniforms.uForce = { value: this.params.force };
        this.uniforms.velocityUniforms.uMouseRadius = { value: 0.5 };
        this.uniforms.velocityUniforms.uMouseStrength = { value: .03 };

        // Wave distortion uniforms (in velocity shader)
        this.uniforms.velocityUniforms.uWaveAmplitude = { value: 0.0 };
        this.uniforms.velocityUniforms.uWaveFrequency = { value: 1.0 };
        this.uniforms.velocityUniforms.uWaveSpeed = { value: 1.0 };

        this.gpgpuCompute.init();
    }

    createParticles() {
        // These are guaranteed to be non-null after initGPGPU()
        const positionVar = this.positionVariable!;
        const velocityVar = this.velocityVariable!;
        
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uPositionTexture: { value: this.gpgpuCompute.getCurrentRenderTarget(positionVar).texture },
                uVelocityTexture: { value: this.gpgpuCompute.getCurrentRenderTarget(velocityVar).texture },
                uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
                uParticleSize: { value: this.params.size },
                uColor: { value: this.params.color },
                uMinAlpha: { value: this.params.minAlpha },
                uMaxAlpha: { value: this.params.maxAlpha },
                uChromaticIntensity: { value: 0.5 },
                uBackgroundColor: { value: new THREE.Color(0x000000) },
            },
            vertexShader,
            fragmentShader,
            depthWrite: false,
            depthTest: false,
            blending: THREE.NormalBlending,
            premultipliedAlpha: false,
            transparent: true
        });

        // Setup Particles Geometry
        const geometry = new THREE.BufferGeometry();

        // Get positions, uvs data for geometry attributes
        const positions = this.utils.getPositions();
        const uvs = this.utils.getUVs();

        // Set geometry attributes
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        // Setup Points
        this.mesh = new THREE.Points(geometry, this.material);
        this.scene.add(this.mesh);
    }

    compute() {
        // Update time for wave animation
        this.uniforms.velocityUniforms.uTime.value = performance.now() * 0.001;
        
        this.gpgpuCompute.compute();
        if (this.events && this.events.update) {
            this.events.update();
        }
    }

    updateColor(color: THREE.Color) {
        this.material.uniforms.uColor.value = color;
    }

    updateBackgroundColor(color: THREE.Color) {
        this.material.uniforms.uBackgroundColor.value = color;
    }

    dispose() {
        this.events.dispose();
        this.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        if (this.mesh.material) {
            (this.mesh.material as THREE.Material).dispose();
        }
    }
}

