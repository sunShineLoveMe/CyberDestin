import { forwardRef, useMemo } from "react";
import { Mesh, BoxGeometry, EdgesGeometry } from "three";

interface CardMeshProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

const CardMesh = forwardRef<Mesh, CardMeshProps>(({ position, rotation = [0, 0, 0], color = "#00f5d4" }, ref) => {
  const geometry = useMemo(() => new BoxGeometry(2, 3.5, 0.05), []);
  const edges = useMemo(() => new EdgesGeometry(geometry), [geometry]);

  return (
    <group position={position} rotation={rotation}>
      {/* Main Card Body - Ultra Holographic/Glassy look */}
      <mesh ref={ref}>
        <primitive object={geometry} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.05}
          metalness={0.9}
          transmission={0.6}
          thickness={1.5}
          clearcoat={1}
          clearcoatRoughness={0.0}
          ior={1.5}
          reflectivity={1}
        />
      </mesh>

      {/* Neon Edges - Brighter */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} toneMapped={false} linewidth={3} />
      </lineSegments>
      
      {/* Inner Glow (Fake) - Pulsing */}
      <mesh scale={[0.98, 0.98, 1.02]}>
        <boxGeometry args={[2, 3.5, 0.04]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} blending={2} />
      </mesh>
    </group>
  );
});

CardMesh.displayName = "CardMesh";

export default CardMesh;
