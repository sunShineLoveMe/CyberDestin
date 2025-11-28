"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CardMesh from "./CardMesh";
import MagicCircle from "./MagicCircle";
import ParticleSystem from "./ParticleSystem";
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

      // Phase 1: Energy Awakening (0s - 0.5s)
      // Lift up and glow
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        tl.to(card.position, {
          y: i * 0.02 + 1.5,
          duration: 0.5,
          ease: "power2.out"
        }, 0);
      });

      // Phase 2: Hologram Split (0.5s - 1.0s)
      // Split into 3 stacks
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const stackIndex = i % 3;
        const offsetX = (stackIndex - 1) * 3; // -3, 0, 3
        
        tl.to(card.position, {
          x: offsetX,
          y: (Math.floor(i / 3) * 0.02) + 1.5,
          z: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        }, 0.5);
        
        tl.to(card.rotation, {
          z: (stackIndex - 1) * 0.2,
          duration: 0.5
        }, 0.5);
      });

      // Phase 3: Arcane Orbit Shuffle (1.0s - 2.5s)
      // Orbit in circle
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        
        // Random orbit parameters
        const radius = 3 + Math.random() * 1.5; // Constrained radius
        const startAngle = (i / cardCount) * Math.PI * 2;
        const speed = 2 + Math.random();
        
        // We animate a proxy object or use a custom update function for orbit
        // Here we simulate orbit by animating x/z with sine/cosine in a loop
        // For GSAP, we can animate a 'progress' value and update position in onUpdate
        
        const orbitObj = { angle: startAngle, y: card.position.y };
        
        tl.to(orbitObj, {
          angle: startAngle + Math.PI * 2 * speed,
          y: Math.random() * 2 + 1, // Hover height variation
          duration: 1.5,
          ease: "none",
          onUpdate: () => {
            if (card) {
              card.position.x = Math.cos(orbitObj.angle) * radius;
              card.position.z = Math.sin(orbitObj.angle) * radius;
              card.position.y = orbitObj.y;
              card.rotation.y = -orbitObj.angle; // Face center
              card.rotation.z += 0.1; // Spin
            }
          }
        }, 1.0);
      });

      // Phase 4: Energy Convergence (2.5s - 3.0s)
      // Collapse to center
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        
        tl.to(card.position, {
          x: 0,
          y: i * 0.02,
          z: 0,
          duration: 0.5,
          ease: "expo.inOut"
        }, 2.5);

        tl.to(card.rotation, {
          x: 0,
          y: 0,
          z: i * 0.05,
          duration: 0.5,
          ease: "power2.inOut"
        }, 2.5);
      });

      // Phase 5: Idle Hover (handled by separate logic or final state)
      // The timeline ends here, and the component can switch to idle animation loop
    }
  }, [phase, onShuffleComplete]);

  return (
    <group ref={groupRef}>
      <MagicCircle />
      <ParticleSystem />
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
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
        <color attach="background" args={['#050505']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff00ff" />
        <pointLight position={[-10, 5, 10]} intensity={1.5} color="#00ffff" />
        <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" />
        
        <Environment preset="city" />
        
        <Deck onShuffleComplete={onShuffleComplete} />
        
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            height={300} 
            intensity={2.0} 
            radius={0.8}
          />
        </EffectComposer>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below ground
          minPolarAngle={Math.PI / 4} 
        />
      </Canvas>
    </div>
  );
}
