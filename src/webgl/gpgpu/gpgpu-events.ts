import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';

interface GPGPUUniforms {
    positionUniforms: { [key: string]: THREE.IUniform };
    velocityUniforms: { [key: string]: THREE.IUniform };
}

interface MouseState {
    x: number;
    y: number;
}

export class GPGPUEvents {
    camera: THREE.Camera;
    mouse: MouseState;
    geometry: THREE.BufferGeometry;
    uniforms: GPGPUUniforms;
    mesh: THREE.Mesh;
    mouseSpeed: number;
    raycaster: THREE.Raycaster;
    raycasterMesh: THREE.Mesh;
    canvas: HTMLCanvasElement | null;

    constructor(
        mouse: MouseState,
        camera: THREE.Camera,
        mesh: THREE.Mesh,
        uniforms: GPGPUUniforms,
        canvas: HTMLCanvasElement | null
    ) {
        this.camera = camera;
        this.mouse = mouse;
        this.geometry = mesh.geometry;
        this.uniforms = uniforms;
        this.mesh = mesh;
        this.canvas = canvas;
        this.mouseSpeed = 0;

        this.raycaster = new THREE.Raycaster();
        this.raycasterMesh = new THREE.Mesh(
            this.geometry,
            new THREE.MeshBasicMaterial()
        );

        this.init();
    }

    init() {
        this.setupMouse();
    }

    setupMouse() {
        // Add BVH acceleration to mesh raycast
        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        // Add BVH to geometry for faster raycasting
        (this.geometry as THREE.BufferGeometry & { boundsTree: MeshBVH }).boundsTree = new MeshBVH(this.geometry);

        this.raycaster.firstHitOnly = true;

        // Add mouse move listener
        if (this.canvas) {
            this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        }
    }

    handleMouseMove(event: MouseEvent) {
        if (!this.canvas) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.mouse.x = x;
        this.mouse.y = y;

        const cursorPosition = new THREE.Vector2(x, y);
        this.raycaster.setFromCamera(cursorPosition, this.camera);

        const intersects = this.raycaster.intersectObjects([this.raycasterMesh]);

        if (intersects.length > 0 && this.uniforms.velocityUniforms.uMouse) {
            const worldPoint = intersects[0].point.clone();
            this.mouseSpeed = 1;
            this.uniforms.velocityUniforms.uMouse.value = worldPoint;
        }
    }

    update() {
        this.mouseSpeed *= 0.85;
        if (this.uniforms.velocityUniforms.uMouseSpeed) {
            this.uniforms.velocityUniforms.uMouseSpeed.value = this.mouseSpeed;
        }
    }

    dispose() {
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        }
    }
}

