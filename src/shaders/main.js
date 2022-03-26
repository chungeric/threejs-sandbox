export const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  void main() {
    // vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 uv = vUv;
    gl_FragColor = vec4(uv.x,uv.y,1.0,uTime);
  }
`;
