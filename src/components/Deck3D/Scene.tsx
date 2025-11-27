"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CardMesh from "./CardMesh";
import { useGameStore } from "@/store/useGameStore";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface DeckProps {
  onShuffleComplete?: () => void;
}

function Deck({ onShuffleComplete }: DeckProps) {
  const { phase } = useGameStore();
  const groupRef = useRef<THREE.Group>(null);
  const cardsRef = useRef<(THREE.Mesh | null)[]>([]);
  
  // Create 30 cards
  const cardCount = 30;
  const cards = useMemo(() => Array.from({ length: cardCount }), []);

  useEffect(() => {
    if (phase === "shuffling" && groupRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onShuffleComplete) onShuffleComplete();
        }
      });

      // Phase 1: Explosion
      // Expand outwards from center
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        
        // Random direction for explosion
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 5 + Math.random() * 3;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi) + 2; // Bias towards camera

        tl.to(card.position, {
          x: x,
          y: y,
          z: z,
          duration: 0.8,
          ease: "power2.out"
        }, 0);
        
        tl.to(card.rotation, {
          x: Math.random() * Math.PI * 4,
          y: Math.random() * Math.PI * 4,
          z: Math.random() * Math.PI * 4,
          duration: 0.8,
          ease: "power2.out"
        }, 0);
      });

      // Phase 2: Chaos Shuffle
      // Random movement in cloud
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        
        tl.to(card.position, {
          x: "random(-4, 4)",
          y: "random(-4, 4)",
          z: "random(-2, 6)",
          duration: 1.7,
          ease: "none", // Linear for constant chaotic motion
          repeat: 1,
          yoyo: true
        }, 0.8);

        tl.to(card.rotation, {
          x: "+=random(5, 10)",
          y: "+=random(5, 10)",
          z: "+=random(5, 10)",
          duration: 1.7,
          ease: "none"
        }, 0.8);
      });

      // Phase 3: Reassembly
      // Snap back to stack
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        
        tl.to(card.position, {
          x: 0,
          y: i * 0.02,
          z: 0,
          duration: 1.0,
          ease: "back.out(1.2)", // Slight overshoot
          delay: i * 0.01 // Stagger slightly for effect
        }, 2.5);

        tl.to(card.rotation, {
          x: 0,
          y: 0,
          z: i * 0.05, // Slight spiral in stack
          duration: 1.0,
          ease: "power2.out"
        }, 2.5);
      });
    }
  }, [phase, onShuffleComplete]);

  return (
    <group ref={groupRef}>
      {cards.map((_, i) => (
        <CardMesh 
          key={i}
          ref={(el) => { cardsRef.current[i] = el; }}
          position={[0, i * 0.02, 0]} 
          rotation={[0, 0, i * 0.05]}
          color={i % 2 === 0 ? "#00f5d4" : "#7b2cbf"} 
        />
      ))}
    </group>
  );
}

interface SceneProps {
  onShuffleComplete?: () => void;
}

export default function Scene({ onShuffleComplete }: SceneProps) {
  return (
    <div className="w-full h-[60vh] relative">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <pointLight position={[-10, -10, 10]} intensity={1} color="#00ffff" />
        <Environment preset="city" />
        
        <Deck onShuffleComplete={onShuffleComplete} />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        </EffectComposer>
        
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
