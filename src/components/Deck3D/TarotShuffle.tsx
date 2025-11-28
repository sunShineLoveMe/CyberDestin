"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "./css3dRenderer";
import { createCSS3DCard } from "./CSS3DCard";
import * as TWEEN from "./tween";
import { TAROT_DECK, TarotCard } from "./TarotDeck";
import { DrawnCard } from "./AIReader";

interface TarotShuffleProps {
  cardImage?: string;
  cardCount?: number;
  particleColor?: string;
  shuffleDuration?: number;
  onDraw?: (cards: DrawnCard[]) => void;
}

export default function TarotShuffle({
  cardImage = "/UI/card_back.png",
  cardCount = 78,
  particleColor = "#82eaff",
  shuffleDuration = 2800,
  onDraw,
}: TarotShuffleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cssContainerRef = useRef<HTMLDivElement>(null);
  const webglContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<CSS3DObject[]>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const isShufflingRef = useRef(false);

  // Initialize scene
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || !cssContainerRef.current || !webglContainerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(0, 0, 1200);

    // --- Renderers ---
    const webglRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    webglRenderer.setSize(window.innerWidth, window.innerHeight);
    webglRenderer.setPixelRatio(window.devicePixelRatio);
    webglContainerRef.current.appendChild(webglRenderer.domElement);

    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssContainerRef.current.appendChild(cssRenderer.domElement);

    // --- Cards ---
    const cards: CSS3DObject[] = [];
    // We only render a subset of DOM cards for performance if count is high, 
    // but user asked for 78. CSS3D with 78 divs is fine on modern devices.
    // Let's create them all but stack them.
    for (let i = 0; i < cardCount; i++) {
      const card = createCSS3DCard(cardImage, i);
      // Initial Stack Position
      card.position.set(0, -1000, 0); // Start off-screen or hidden
      card.rotation.x = -Math.PI / 2; // Flat
      scene.add(card);
      cards.push(card);
    }
    cardsRef.current = cards;

    // Initial Animation: Fly in to stack
    cards.forEach((card, i) => {
      new TWEEN.Tween(card.position)
        .to({ x: 0, y: 0, z: -i * 2 }, 1000)
        .delay(i * 5)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
      
      new TWEEN.Tween(card.rotation)
        .to({ x: 0, y: 0, z: (Math.random() - 0.5) * 0.1 }, 1000)
        .delay(i * 5)
        .start();
    });

    // --- Magic Circle (WebGL) ---
    const circleGeometry = new THREE.PlaneGeometry(800, 800);
    const circleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(particleColor) },
        uOpacity: { value: 0.0 }
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
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          vec2 centered = vUv - 0.5;
          float dist = length(centered);
          float angle = atan(centered.y, centered.x);
          float rot = angle + uTime * 0.2;
          
          // Rings
          float ring1 = smoothstep(0.48, 0.47, dist) * smoothstep(0.40, 0.41, dist);
          float ring2 = smoothstep(0.38, 0.37, dist) * smoothstep(0.35, 0.36, dist);
          
          // Runes (simulated by sine waves)
          float runes = step(0.5, sin(rot * 12.0)) * ring2;
          
          float alpha = (ring1 + runes) * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const magicCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    // magicCircle.rotation.x = -Math.PI / 2; // Not needed if we view from front, but let's put it behind cards
    // Actually, cards are at z ~ 0. Let's put circle at z = -200
    magicCircle.position.z = -200;
    scene.add(magicCircle);

    // --- Particles (WebGL) ---
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 1500;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 1500;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 3,
      transparent: true,
      opacity: 0.0, // Start hidden
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      webglRenderer.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      TWEEN.update();

      // Update Uniforms
      circleMaterial.uniforms.uTime.value = time;
      particles.rotation.z = time * 0.05;

      webglRenderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };
    animate();

    // Expose shuffle function to window for button click (or use ref/context)
    // For this implementation, we'll listen to a custom event or just export a function if we could.
    // But React way is to use useImperativeHandle or props. 
    // The user wants a button "Reveal Your Love Destiny" in page.tsx to trigger this.
    // We can use a ref passed from parent, or a custom event.
    // Let's use a custom event for simplicity in this decoupled structure.
    const handleStartShuffle = () => {
      if (isShufflingRef.current) return;
      isShufflingRef.current = true;
      
      // 1. Activate Energy
      new TWEEN.Tween(circleMaterial.uniforms.uOpacity)
        .to({ value: 0.8 }, 1000)
        .start();
      new TWEEN.Tween(particleMat)
        .to({ opacity: 0.6 }, 1000)
        .start();

      // 2. Shuffle Sequence
      const duration = shuffleDuration;
      
      cards.forEach((card, i) => {
        // A. Scatter
        const scatterPos = {
          x: (Math.random() - 0.5) * 1000,
          y: (Math.random() - 0.5) * 800,
          z: (Math.random() - 0.5) * 500
        };
        const scatterRot = {
          x: Math.random() * Math.PI,
          y: Math.random() * Math.PI,
          z: Math.random() * Math.PI
        };

        new TWEEN.Tween(card.position)
          .to(scatterPos, duration * 0.3)
          .easing(TWEEN.Easing.Exponential.Out)
          .delay(i * 5)
          .start();
        
        new TWEEN.Tween(card.rotation)
          .to(scatterRot, duration * 0.3)
          .delay(i * 5)
          .start();

        // B. Merge back to center
        setTimeout(() => {
          new TWEEN.Tween(card.position)
            .to({ x: 0, y: 0, z: -i * 1 }, duration * 0.3)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
          
          new TWEEN.Tween(card.rotation)
            .to({ x: 0, y: 0, z: 0 }, duration * 0.3)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        }, duration * 0.5);
      });

      // 3. Draw 3 Cards (Past, Present, Future)
      setTimeout(() => {
        // Pick 3 random unique indices
        const indices = new Set<number>();
        while(indices.size < 3) indices.add(Math.floor(Math.random() * TAROT_DECK.length));
        const drawnIndices = Array.from(indices);
        
        const drawnCardsData: DrawnCard[] = [];

        drawnIndices.forEach((idx, slot) => {
          const cardObj = cards[idx];
          const tarotData = TAROT_DECK[idx];
          const isUpright = Math.random() > 0.2; // 80% chance upright
          
          drawnCardsData.push({ card: tarotData, isUpright });

          // Set data on the hidden front face
          (cardObj as any).setCardData(tarotData.name, tarotData.image_front);

          // Move to slot
          // Slots: Left (-300), Center (0), Right (300)
          const xPos = (slot - 1) * 320;
          
          new TWEEN.Tween(cardObj.position)
            .to({ x: xPos, y: 0, z: 200 }, 1000)
            .easing(TWEEN.Easing.Back.Out)
            .start();

          // Flip to reveal
          // Initial rotation is 0,0,0 (Back showing)
          // Rotate Y to 180 (Front showing)
          // If reversed, Rotate Z to 180 as well? No, usually just upside down image or rotate Z.
          // Let's do: Rotate Y 180 (reveal) + Rotate Z 180 if reversed.
          const targetRotZ = isUpright ? 0 : Math.PI;
          
          new TWEEN.Tween(cardObj.rotation)
            .to({ x: 0, y: Math.PI, z: targetRotZ }, 1000)
            .delay(500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        });

        // Callback with data
        if (onDraw) {
          setTimeout(() => onDraw(drawnCardsData), 1500);
        }

        // Fade out others
        new TWEEN.Tween(circleMaterial.uniforms.uOpacity).to({ value: 0 }, 1000).start();
        new TWEEN.Tween(particleMat).to({ opacity: 0 }, 1000).start();

      }, duration + 500);
    };

    window.addEventListener('trigger-shuffle', handleStartShuffle);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('trigger-shuffle', handleStartShuffle);
      
      if (webglContainerRef.current && webglRenderer.domElement.parentNode) {
        webglContainerRef.current.removeChild(webglRenderer.domElement);
      }
      if (cssContainerRef.current && cssRenderer.domElement.parentNode) {
        cssContainerRef.current.removeChild(cssRenderer.domElement);
      }
      
      circleGeometry.dispose();
      circleMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      TWEEN.removeAll();
    };
  }, [cardImage, cardCount, particleColor, shuffleDuration, onDraw]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <div ref={webglContainerRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />
      <div ref={cssContainerRef} className="absolute top-0 left-0 w-full h-full z-10" />
    </div>
  );
}
