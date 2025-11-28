import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, ShaderMaterial, Color } from "three";

const MagicCircleShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new Color("#00f5d4") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;

    #define PI 3.14159265359

    float ring(vec2 uv, float r, float width) {
      float d = length(uv - 0.5);
      return smoothstep(width, 0.0, abs(d - r));
    }

    void main() {
      vec2 uv = vUv;
      vec2 centered = uv - 0.5;
      float dist = length(centered);
      float angle = atan(centered.y, centered.x);

      // Rotating pattern
      float rot = angle + uTime * 0.5;
      
      // Main Ring
      float alpha = ring(uv, 0.4, 0.01);
      
      // Inner Runes (simulated with noise/pattern)
      float runes = step(0.5, sin(rot * 10.0)) * ring(uv, 0.35, 0.02);
      
      // Pulsing Glow
      float glow = 0.0;
      glow += 0.02 / abs(dist - 0.4); // Outer glow
      glow += 0.01 / abs(dist - 0.35); // Inner glow

      vec3 finalColor = uColor * (alpha + runes + glow);
      
      gl_FragColor = vec4(finalColor, (alpha + runes) * 0.8 + glow * 0.5);
    }
  `,
};

export default function MagicCircle() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[8, 8]} />
      <shaderMaterial
        ref={materialRef}
        args={[MagicCircleShader]}
        transparent
        depthWrite={false}
        blending={2} // Additive blending
      />
    </mesh>
  );
}
