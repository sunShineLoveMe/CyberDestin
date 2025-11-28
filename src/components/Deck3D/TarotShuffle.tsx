"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "./css3dRenderer";
import { createCSS3DCard } from "./CSS3DCard";
import * as TWEEN from "./tween";
import { TAROT_DECK } from "./TarotDeck";
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
  const rendererContainerRef = useRef<HTMLDivElement>(null);
  const isShufflingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || !rendererContainerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene Setup
    const scene = new THREE.Scene();
    
    // Camera Setup - positioned to see center of screen
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 5000);
    camera.position.set(0, 0, 2000); // Far back to see everything
    camera.lookAt(0, 0, 0);

    // WebGL Renderer - for particles and magic circle
    const webglRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    webglRenderer.setSize(width, height);
    webglRenderer.setPixelRatio(window.devicePixelRatio);
    webglRenderer.domElement.style.position = 'absolute';
    webglRenderer.domElement.style.top = '0';
    webglRenderer.domElement.style.left = '0';
    webglRenderer.domElement.style.zIndex = '1';
    webglRenderer.domElement.style.pointerEvents = 'none';
    rendererContainerRef.current.appendChild(webglRenderer.domElement);

    // CSS3D Renderer - for cards
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    cssRenderer.domElement.style.left = '0';
    cssRenderer.domElement.style.zIndex = '2';
    rendererContainerRef.current.appendChild(cssRenderer.domElement);

    // --- Create Cards ---
    const cards: CSS3DObject[] = [];
    for (let i = 0; i < cardCount; i++) {
      const card = createCSS3DCard(cardImage, i);
      // Start cards at center, stacked
      card.position.set(0, 0, -i * 3);
      card.rotation.set(0, 0, 0);
      scene.add(card);
      cards.push(card);
    }

    // --- Magic Circle (WebGL) ---
    const circleGeometry = new THREE.PlaneGeometry(1200, 1200);
    const circleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(particleColor) },
        uOpacity: { value: 0.15 } // Start with subtle glow instead of 0
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
          float rot = angle + uTime * 0.3;
          
          // Multiple rings
          float ring1 = smoothstep(0.49, 0.48, dist) * smoothstep(0.42, 0.43, dist);
          float ring2 = smoothstep(0.40, 0.39, dist) * smoothstep(0.36, 0.37, dist);
          float ring3 = smoothstep(0.34, 0.33, dist) * smoothstep(0.30, 0.31, dist);
          
          // Rotating runes pattern
          float runes = step(0.6, sin(rot * 8.0 + uTime)) * ring2;
          float symbols = step(0.5, sin(rot * 12.0 - uTime * 0.5)) * ring3;
          
          float alpha = (ring1 + ring2 + ring3 + runes + symbols) * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    
    const magicCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    magicCircle.position.set(0, 0, -300); // Behind cards
    scene.add(magicCircle);

    // --- Particles (WebGL) ---
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 800 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = radius * Math.cos(phi) - 300;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    
    const particleMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 4,
      transparent: true,
      opacity: 0.3, // Start visible with subtle opacity
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Breathing animation for particles in idle state
    const breatheParticles = () => {
      new TWEEN.Tween(particleMat)
        .to({ opacity: 0.5 }, 2000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .start();
    };
    breatheParticles();

    // Breathing animation for magic circle in idle state
    const breatheCircle = () => {
      new TWEEN.Tween(circleMaterial.uniforms.uOpacity)
        .to({ value: 0.25 }, 3000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .start();
    };
    breatheCircle();

    // --- Initial Animation: Cards fly in from bottom ---
    cards.forEach((card, i) => {
      // Start below screen
      card.position.set(0, -1500, -i * 3);
      
      // Fly to center
      new TWEEN.Tween(card.position)
        .to({ x: 0, y: 0, z: -i * 3 }, 1200)
        .delay(i * 3)
        .easing(TWEEN.Easing.Back.Out)
        .onComplete(() => {
          // After landing, add gentle floating animation
          const floatAnimation = () => {
            new TWEEN.Tween(card.position)
              .to({ 
                y: Math.sin(i * 0.5) * 10, // Slight vertical movement
                z: -i * 3 + Math.cos(i * 0.3) * 5 // Slight depth movement
              }, 3000 + i * 100)
              .easing(TWEEN.Easing.Sinusoidal.InOut)
              .yoyo(true)
              .repeat(Infinity)
              .start();
          };
          floatAnimation();
        })
        .start();
    });

    // --- Shuffle Animation Handler ---
    const handleStartShuffle = () => {
      if (isShufflingRef.current) return;
      isShufflingRef.current = true;

      // 1. Activate magic effects
      new TWEEN.Tween(circleMaterial.uniforms.uOpacity)
        .to({ value: 0.9 }, 800)
        .start();
        
      new TWEEN.Tween(particleMat)
        .to({ opacity: 0.7 }, 800)
        .start();

      // 2. Scatter cards
      cards.forEach((card, i) => {
        const angle = (i / cardCount) * Math.PI * 2;
        const radius = 600 + Math.random() * 200;
        
        const scatterPos = {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: (Math.random() - 0.5) * 400
        };
        
        new TWEEN.Tween(card.position)
          .to(scatterPos, shuffleDuration * 0.4)
          .easing(TWEEN.Easing.Exponential.Out)
          .start();
          
        new TWEEN.Tween(card.rotation)
          .to({
            x: Math.random() * Math.PI,
            y: Math.random() * Math.PI,
            z: Math.random() * Math.PI
          }, shuffleDuration * 0.4)
          .start();
      });

      // 3. Merge back to center
      setTimeout(() => {
        cards.forEach((card, i) => {
          new TWEEN.Tween(card.position)
            .to({ x: 0, y: 0, z: -i * 2 }, shuffleDuration * 0.4)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
            
          new TWEEN.Tween(card.rotation)
            .to({ x: 0, y: 0, z: 0 }, shuffleDuration * 0.4)
            .start();
        });
      }, shuffleDuration * 0.5);

      // 4. Draw 3 cards
      setTimeout(() => {
        const indices = new Set<number>();
        while (indices.size < 3) {
          indices.add(Math.floor(Math.random() * TAROT_DECK.length));
        }
        const drawnIndices = Array.from(indices);
        const drawnCardsData: DrawnCard[] = [];

        drawnIndices.forEach((idx, slot) => {
          const cardObj = cards[idx];
          const tarotData = TAROT_DECK[idx];
          const isUpright = Math.random() > 0.3;

          drawnCardsData.push({ card: tarotData, isUpright });
          (cardObj as any).setCardData(tarotData.name, tarotData.image_front);

          // Position: Left (-400), Center (0), Right (400)
          const xPos = (slot - 1) * 450;

          new TWEEN.Tween(cardObj.position)
            .to({ x: xPos, y: 0, z: 300 }, 1000)
            .easing(TWEEN.Easing.Back.Out)
            .start();

          // Flip card (rotate Y by 180°)
          const targetRotZ = isUpright ? 0 : Math.PI;
          new TWEEN.Tween(cardObj.rotation)
            .to({ x: 0, y: Math.PI, z: targetRotZ }, 1200)
            .delay(300)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        });

        // Fade out non-selected cards
        cards.forEach((card, i) => {
          if (!drawnIndices.includes(i)) {
            const el = (card as any).element as HTMLElement;
            if (el) {
              el.style.transition = 'opacity 0.8s';
              el.style.opacity = '0';
            }
          }
        });

        // Callback
        if (onDraw) {
          setTimeout(() => onDraw(drawnCardsData), 1500);
        }

        // Fade out effects
        new TWEEN.Tween(circleMaterial.uniforms.uOpacity)
          .to({ value: 0 }, 1000)
          .delay(500)
          .start();
          
        new TWEEN.Tween(particleMat)
          .to({ opacity: 0 }, 1000)
          .delay(500)
          .start();

      }, shuffleDuration + 600);
    };

    window.addEventListener('trigger-shuffle', handleStartShuffle);

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      TWEEN.update();

      // Animate effects
      circleMaterial.uniforms.uTime.value = time;
      particles.rotation.y = time * 0.1;

      webglRenderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      
      webglRenderer.setSize(w, h);
      cssRenderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('trigger-shuffle', handleStartShuffle);
      
      if (rendererContainerRef.current) {
        rendererContainerRef.current.innerHTML = '';
      }
      
      circleGeometry.dispose();
      circleMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      TWEEN.removeAll();
    };
  }, [cardImage, cardCount, particleColor, shuffleDuration, onDraw]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden">
      <div ref={rendererContainerRef} className="absolute inset-0" />
    </div>
  );
}
