varying vec2 vUv;

uniform sampler2D uVelocityTexture;
uniform vec3 uColor;
uniform float uMinAlpha;
uniform float uMaxAlpha;


void main() {
	float center = length(gl_PointCoord - 0.5);

	vec3 velocity = texture2D( uVelocityTexture, vUv ).xyz * 100.0;

	float velocityAlpha = clamp(length(velocity.r), uMinAlpha, uMaxAlpha);

	if (center > 0.5) { discard; }


	gl_FragColor = vec4(uColor, velocityAlpha);
}

