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
      {/* Main Card Body - Holographic/Glassy look */}
      <mesh ref={ref}>
        <primitive object={geometry} />
        <meshPhysicalMaterial
          color="#2a2a2a"
          roughness={0.1}
          metalness={0.8}
          transmission={0.2}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Neon Edges */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} toneMapped={false} linewidth={2} />
      </lineSegments>
      
      {/* Inner Glow (Fake) */}
      <mesh scale={[0.95, 0.95, 1.1]}>
        <boxGeometry args={[2, 3.5, 0.04]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </group>
  );
});

CardMesh.displayName = "CardMesh";

export default CardMesh;
