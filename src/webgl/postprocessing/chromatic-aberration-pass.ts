import { ShaderMaterial, UniformsUtils, WebGLRenderTarget, WebGLRenderer } from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

export class ChromaticAberrationPass extends Pass {
    material: ShaderMaterial;
    fsQuad: FullScreenQuad;
    uniforms: { [uniform: string]: { value: unknown } };

    constructor() {
        super();

        const shader = {
            uniforms: {
                'tDiffuse': { value: null },
                'amount': { value: 0.003 },
                'angle': { value: 0.0 },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float amount;
                uniform float angle;
                varying vec2 vUv;

                vec2 rotate(vec2 v, float a) {
                    float s = sin(a);
                    float c = cos(a);
                    mat2 m = mat2(c, -s, s, c);
                    return m * v;
                }

                void main() {
                    vec2 offset = amount * vec2(cos(angle), sin(angle));
                    
                    // Sample each color channel with a slight offset
                    float r = texture2D(tDiffuse, vUv + offset).r;
                    float g = texture2D(tDiffuse, vUv).g;
                    float b = texture2D(tDiffuse, vUv - offset).b;
                    
                    // Add radial distortion for more dramatic effect
                    vec2 center = vUv - 0.5;
                    float dist = length(center);
                    float distortion = dist * amount * 2.0;
                    
                    vec2 direction = normalize(center);
                    
                    r = mix(r, texture2D(tDiffuse, vUv + direction * distortion).r, dist);
                    b = mix(b, texture2D(tDiffuse, vUv - direction * distortion).b, dist);
                    
                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            `
        };

        this.uniforms = UniformsUtils.clone(shader.uniforms);
        
        this.material = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        });

        this.fsQuad = new FullScreenQuad(this.material);
    }

    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
        this.uniforms['tDiffuse'].value = readBuffer.texture;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);
        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            this.fsQuad.render(renderer);
        }
    }

    dispose() {
        this.material.dispose();
        this.fsQuad.dispose();
    }
}

