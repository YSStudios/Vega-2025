varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uVelocityTexture;
uniform vec3 uColor;
uniform float uMinAlpha;
uniform float uMaxAlpha;
uniform float uChromaticIntensity;


void main() {
	float center = length(gl_PointCoord - 0.5);

	vec3 velocity = texture2D( uVelocityTexture, vUv ).xyz * 100.0;

	float velocityAlpha = clamp(length(velocity), uMinAlpha, uMaxAlpha);

	if (center > 0.5) { discard; }

	// Chromatic color gradient based on velocity and position
	vec3 finalColor = uColor;
	
	if (uChromaticIntensity > 0.0) {
		// Create color shift based on velocity magnitude
		float velocityMag = length(velocity);
		
		// RGB color separation based on velocity direction
		vec3 velocityNorm = normalize(velocity + vec3(0.001)); // avoid division by zero
		
		// Create chromatic shift
		float r = uColor.r + velocityNorm.x * uChromaticIntensity * velocityMag;
		float g = uColor.g + velocityNorm.y * uChromaticIntensity * velocityMag;
		float b = uColor.b + velocityNorm.z * uChromaticIntensity * velocityMag;
		
		// Add position-based color variation
		float positionFactor = (sin(vPosition.x * 2.0) + sin(vPosition.y * 2.0) + sin(vPosition.z * 2.0)) * 0.1;
		
		finalColor = vec3(
			clamp(r + positionFactor, 0.0, 1.0),
			clamp(g + positionFactor, 0.0, 1.0),
			clamp(b + positionFactor, 0.0, 1.0)
		);
		
		// Enhance color saturation
		float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
		finalColor = mix(vec3(luminance), finalColor, 1.0 + uChromaticIntensity * 0.5);
	}

	// Add soft glow/fade from center to edge for better visibility
	float softEdge = 1.0 - smoothstep(0.0, 0.5, center);
	float finalAlpha = velocityAlpha * softEdge;

	gl_FragColor = vec4(finalColor, finalAlpha);
}

