uniform sampler2D uOriginalPosition;
uniform vec3 uMouse;
uniform float uMouseSpeed;
uniform float uForce;
uniform float uMouseRadius;
uniform float uMouseStrength;


void main() {
	vec2 vUv = gl_FragCoord.xy / resolution.xy;

	vec3 position = texture2D( uCurrentPosition, vUv ).xyz;
	vec3 original = texture2D( uOriginalPosition, vUv ).xyz;
	vec3 velocity = texture2D( uCurrentVelocity, vUv ).xyz;

	velocity *= uForce; // Velocity relaxation


	// Particle attraction to shape force

	vec3 direction = normalize( original - position );

	float dist = length( original - position );

	if( dist > 0.001 ) velocity += direction * ( dist * 0.02 );


	// Mouse repel force

	float mouseDistance = distance( position, uMouse );
	float maxDistance = uMouseRadius;


	if( mouseDistance < maxDistance ) {
		vec3 pushDirection = normalize( position - uMouse );
		velocity += pushDirection * ( 1.0 - mouseDistance / maxDistance ) * uMouseStrength * uMouseSpeed;
	}


	gl_FragColor = vec4(velocity, 1.);
}

