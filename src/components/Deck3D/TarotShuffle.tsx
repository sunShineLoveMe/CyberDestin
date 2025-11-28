"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "./css3dRenderer";
import { createCSS3DCard } from "./CSS3DCard";
import * as TWEEN from "./tween";

interface TarotShuffleProps {
  cardCount?: number;
  cardImage?: string;
  particleColor?: string;
  shuffleDuration?: number;
  phase?: string; // Add phase prop
  onComplete?: () => void;
}

export default function TarotShuffle({
  cardCount = 22,
  cardImage = "/UI/torpat.png",
  particleColor = "#66eaff",
  shuffleDuration = 2600,
  phase = "idle",
  onComplete,
}: TarotShuffleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cssContainerRef = useRef<HTMLDivElement>(null);
  const webglContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<CSS3DObject[]>([]);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const hasShuffledRef = useRef(false);

  // Initialize scene
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server
    if (!containerRef.current || !cssContainerRef.current || !webglContainerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 1500);

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
    for (let i = 0; i < cardCount; i++) {
      const card = createCSS3DCard(cardImage, i);
      card.position.set(0, i * 5, 0); // Stack with slight offset
      card.rotation.set(0, 0, (Math.random() - 0.5) * 0.1);
      scene.add(card);
      cards.push(card);
    }
    cardsRef.current = cards;

    // --- Magic Circle ---
    const circleGeometry = new THREE.PlaneGeometry(1000, 1000);
    const circleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(particleColor) },
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
        void main() {
          vec2 centered = vUv - 0.5;
          float dist = length(centered);
          float angle = atan(centered.y, centered.x);
          float rot = angle + uTime * 0.5;
          float alpha = smoothstep(0.5, 0.48, dist) * smoothstep(0.3, 0.32, dist);
          float runes = step(0.5, sin(rot * 10.0)) * alpha * 0.5;
          gl_FragColor = vec4(uColor, (alpha + runes) * 0.5);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const magicCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    magicCircle.rotation.x = -Math.PI / 2;
    magicCircle.position.y = -300;
    scene.add(magicCircle);

    // --- Particles ---
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 1000;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 500;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 4,
      transparent: true,
      opacity: 0.6,
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
      circleMaterial.uniforms.uTime.value = time;
      particles.rotation.y = time * 0.1;

      webglRenderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      
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
  }, [cardCount, cardImage, particleColor]);

  // Trigger animation when phase changes to "shuffling"
  useEffect(() => {
    if (phase === "shuffling" && !hasShuffledRef.current && cardsRef.current.length > 0) {
      hasShuffledRef.current = true;
      
      const cards = cardsRef.current;
      
      // Shuffle Animation
      cards.forEach((card, i) => {
        // Phase 1: Scatter
        const scatterTarget = {
          x: (Math.random() - 0.5) * 1200,
          y: (Math.random() - 0.5) * 800,
          z: (Math.random() - 0.5) * 500,
        };

        new TWEEN.Tween(card.position)
          .to(scatterTarget, shuffleDuration * 0.4)
          .easing(TWEEN.Easing.Exponential.Out)
          .delay(i * 10)
          .start();

        new TWEEN.Tween(card.rotation)
          .to({ 
            x: Math.random() * Math.PI * 2, 
            y: Math.random() * Math.PI * 2, 
            z: Math.random() * Math.PI * 2 
          }, shuffleDuration * 0.4)
          .delay(i * 10)
          .start();

        // Phase 2: Merge back
        setTimeout(() => {
          new TWEEN.Tween(card.position)
            .to({ x: 0, y: 0, z: i * 2 }, shuffleDuration * 0.4)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

          new TWEEN.Tween(card.rotation)
            .to({ x: 0, y: Math.PI, z: 0 }, shuffleDuration * 0.4)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        }, shuffleDuration * 0.6);
      });

      // Completion
      setTimeout(() => {
        hasShuffledRef.current = false; // Reset for next shuffle
        if (onComplete) onComplete();
      }, shuffleDuration + 500);
    }
  }, [phase, shuffleDuration, onComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <div ref={webglContainerRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />
      <div ref={cssContainerRef} className="absolute top-0 left-0 w-full h-full z-10" />
    </div>
  );
}
