varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uVelocityTexture;
uniform vec3 uColor;
uniform float uMinAlpha;
uniform float uMaxAlpha;
uniform float uChromaticIntensity;
uniform vec3 uBackgroundColor;


void main() {
	float center = length(gl_PointCoord - 0.5);

	vec3 velocity = texture2D( uVelocityTexture, vUv ).xyz * 100.0;

	// Use a more stable alpha calculation to prevent blinking
	float velocityMagnitude = length(velocity);
	float velocityAlpha = mix(uMinAlpha, uMaxAlpha, smoothstep(0.0, 2.0, velocityMagnitude));

	if (center > 0.5) { discard; }

	// Calculate background luminance to determine if it's light or dark
	float bgLuminance = dot(uBackgroundColor, vec3(0.299, 0.587, 0.114));
	bool isLightBackground = false; // Temporarily disabled - treat all backgrounds as dark

	// Chromatic color gradient based on velocity and position
	vec3 baseColor = uColor;
	
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
		
		baseColor = vec3(
			clamp(r + positionFactor, 0.0, 1.0),
			clamp(g + positionFactor, 0.0, 1.0),
			clamp(b + positionFactor, 0.0, 1.0)
		);
		
		// Enhance color saturation
		float luminance = dot(baseColor, vec3(0.299, 0.587, 0.114));
		baseColor = mix(vec3(luminance), baseColor, 1.0 + uChromaticIntensity * 0.5);
	}

	// Background-aware color adjustment
	vec3 finalColor = baseColor;
	if (isLightBackground) {
		// On light backgrounds: significantly darken particles for contrast
		finalColor = baseColor * 0.15; // Much darker for visibility
	} else {
		// On dark backgrounds: keep bright
		finalColor = baseColor;
	}

	// Create strong outline effect for definition on any background
	float outerRing = smoothstep(0.25, 0.5, center);
	float innerCore = 1.0 - smoothstep(0.0, 0.25, center);
	
	// Define outline color based on background
	vec3 outlineColor = isLightBackground 
		? vec3(0.0, 0.0, 0.0) // Pure black outline on light backgrounds
		: finalColor * 1.8;    // Much brighter outline on dark backgrounds
	
	// Mix outline with core color - much stronger outline
	finalColor = mix(finalColor, outlineColor, outerRing * 0.9);

	// Add soft glow/fade from center to edge for better visibility
	float softEdge = 1.0 - smoothstep(0.0, 0.5, center);
	float finalAlpha = velocityAlpha * softEdge;
	
	// Boost alpha on light backgrounds for better visibility
	if (isLightBackground) {
		finalAlpha = mix(finalAlpha, 1.0, 0.5); // Increase opacity by 50%
	}

	gl_FragColor = vec4(finalColor, finalAlpha);
}

