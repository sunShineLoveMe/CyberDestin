"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "./css3dRenderer";
import { createCSS3DCard } from "./CSS3DCard";
import * as TWEEN from "./tween";
import { TAROT_DECK } from "./TarotDeck";
import { DrawnCard } from "./AIReader";
import { getLoveReading, LoveReadingResult } from "./LoveReadingService";

interface TarotShuffleProps {
  cardImage?: string;
  cardCount?: number;
  particleColor?: string;
  shuffleDuration?: number;
  onDraw?: (cards: DrawnCard[]) => void;
  onPhaseChange?: (phase: GamePhase) => void;
}

type GamePhase =
  | 'idle'
  | 'shuffling'
  | 'sphere'
  | 'selecting'
  | 'reading'
  | 'result';

export default function TarotShuffle({
  cardImage = "/UI/card_back.png",
  cardCount = 78,
  particleColor = "#82eaff",
  shuffleDuration = 2800,
  onDraw,
  onPhaseChange,
}: TarotShuffleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererContainerRef = useRef<HTMLDivElement>(null);
  const isShufflingRef = useRef(false);
  const phaseRef = useRef<GamePhase>('idle');
  
  // State for game logic
  const cardsRef = useRef<CSS3DObject[]>([]);
  const availableCardsRef = useRef<CSS3DObject[]>([]);
  const selectedCardsRef = useRef<DrawnCard[]>([]);
  const centerCardRef = useRef<CSS3DObject | null>(null);
  const sphereGroupRef = useRef<THREE.Group>(new THREE.Group());
  const currentSlotRef = useRef<number>(0);
  const phaseChangeRef = useRef<TarotShuffleProps['onPhaseChange']>(undefined);
  const idleTweensRef = useRef<any[]>([]); // Store idle tweens to stop them later
  const [readingResult, setReadingResult] = useState<LoveReadingResult | null>(null);

  useEffect(() => {
    phaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || !rendererContainerRef.current) return;

    const setPhase = (phase: GamePhase) => {
      phaseRef.current = phase;
      if (phase === 'idle') {
        currentSlotRef.current = 0;
        selectedCardsRef.current = [];
      }
      if (phase !== 'selecting' && centerCardRef.current) {
        centerCardRef.current.element.classList.remove('center-highlight');
        centerCardRef.current = null;
      }
      phaseChangeRef.current?.(phase);
    };

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 5000);
    camera.position.set(0, 0, 2000);
    camera.lookAt(0, 0, 0);

    // Renderers
    const webglRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    webglRenderer.setSize(width, height);
    webglRenderer.setPixelRatio(window.devicePixelRatio);
    webglRenderer.domElement.style.position = 'absolute';
    webglRenderer.domElement.style.top = '0';
    webglRenderer.domElement.style.left = '0';
    webglRenderer.domElement.style.zIndex = '1';
    webglRenderer.domElement.style.pointerEvents = 'none';
    rendererContainerRef.current.appendChild(webglRenderer.domElement);

    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    cssRenderer.domElement.style.left = '0';
    cssRenderer.domElement.style.zIndex = '2';
    rendererContainerRef.current.appendChild(cssRenderer.domElement);

    // Sphere Group - Keep at origin, we'll position cards in world space
    scene.add(sphereGroupRef.current);

    // --- Create Cards ---
    const cards: CSS3DObject[] = [];
    for (let i = 0; i < cardCount; i++) {
      const card = createCSS3DCard(cardImage, i);
      // Initial position: center, stacked
      card.position.set(0, 0, -i * 3);
      card.rotation.set(0, 0, 0);

      // Add click listener to card element
      const element = card.element;
      element.style.cursor = 'pointer';
      element.style.willChange = 'transform';
      element.onclick = () => handleCardClick(card);
      
      sphereGroupRef.current.add(card); // Add to group initially
      cards.push(card);
    }
    cardsRef.current = cards;
    availableCardsRef.current = [...cards];

    // --- Magic Circle ---
    const circleGeometry = new THREE.PlaneGeometry(1200, 1200);
    const circleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(particleColor) },
        uOpacity: { value: 0.15 }
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
          float ring1 = smoothstep(0.49, 0.48, dist) * smoothstep(0.42, 0.43, dist);
          float ring2 = smoothstep(0.40, 0.39, dist) * smoothstep(0.36, 0.37, dist);
          float ring3 = smoothstep(0.34, 0.33, dist) * smoothstep(0.30, 0.31, dist);
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
    magicCircle.position.set(0, 0, -300);
    
    // Responsive scaling
    const updateMagicCircleScale = () => {
      const aspect = window.innerWidth / window.innerHeight;
      if (aspect < 0.8) {
        magicCircle.scale.set(aspect * 1.2, aspect * 1.2, 1);
      } else if (aspect < 1.2) {
        magicCircle.scale.set(aspect * 0.9, aspect * 0.9, 1);
      } else {
        magicCircle.scale.set(1, 1, 1);
      }
    };
    updateMagicCircleScale();
    
    scene.add(magicCircle);

    // --- Particles ---
    // Responsive particle count for better mobile performance
    const particleCount = width < 768 ? 250 : 500;
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
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Animations ---
    const breatheParticles = () => {
      new TWEEN.Tween(particleMat)
        .to({ opacity: 0.5 }, 2000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .start();
    };
    breatheParticles();

    const breatheCircle = () => {
      new TWEEN.Tween(circleMaterial.uniforms.uOpacity)
        .to({ value: 0.25 }, 3000)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .start();
    };
    breatheCircle();

    // Initial Fly-in
    cards.forEach((card, i) => {
      // Start below screen
      card.position.set(0, -1500, -i * 3);
      
      // Fly to center
      new TWEEN.Tween(card.position)
        .to({ x: 0, y: 0, z: -i * 3 }, 1200)
        .delay(i * 3)
        .easing(TWEEN.Easing.Back.Out)
        .onComplete(() => {
          // Idle float
          const tween = new TWEEN.Tween(card.position)
            .to({ 
              y: Math.sin(i * 0.5) * 10,
              z: -i * 3 + Math.cos(i * 0.3) * 5 
            }, 3000 + i * 100)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .yoyo(true)
            .repeat(Infinity)
            .start();
          idleTweensRef.current.push(tween);
        })
        .start();
    });

    // --- Helper Functions ---

    const createSphereLayout = (count: number, radius: number) => {
      const positions: Array<{x: number, y: number, z: number, rotation: {x: number, y: number, z: number}}> = [];
      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
        const radiusAtY = Math.sqrt(1 - y * y); // Radius at y
        const theta = phi * i; // Golden angle increment

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        // Scale by radius
        const pX = x * radius;
        const pY = y * radius;
        const pZ = z * radius;

        // Rotation: Face center
        // Look at center (0,0,0) from (pX, pY, pZ)
        // We can use a dummy object to calculate rotation
        const dummy = new THREE.Object3D();
        dummy.position.set(pX, pY, pZ);
        dummy.lookAt(0, 0, 0);
        
        positions.push({ 
          x: pX, y: pY, z: pZ, 
          rotation: { x: dummy.rotation.x, y: dummy.rotation.y, z: dummy.rotation.z } 
        });
      }
      
      return positions;
    };

    const findCenterCard = () => {
      // In Sphere layout, finding the "center" card is complex because of 3D rotation.
      // For now, we allow clicking ANY card in the sphere, as per requirements "User can click arbitrary card".
      // We can add a raycaster-like logic if needed, but CSS3D handles clicks natively.
      // So we might not strictly need to highlight a "center" card for selection if we allow free selection.
      // However, to keep the "Ceremonial" feel, we can highlight the card closest to the camera (Z > something).
      
      // Simplified: Just highlight card under mouse (handled by CSS hover).
      // If we really want to highlight the one "facing" the user:
      // We can check dot product of card forward vector and camera forward vector.
    };

    const handleCardClick = (clickedCard: CSS3DObject) => {
      if (phaseRef.current !== 'selecting') return;
      
      // Allow clicking any card in Sphere mode
      // if (clickedCard !== centerCardRef.current) return;
      
      // Select this card
      selectCard(clickedCard);
    };

    const selectCard = async (card: CSS3DObject) => {
      // 1. Remove from available
      const index = availableCardsRef.current.indexOf(card);
      if (index > -1) {
        availableCardsRef.current.splice(index, 1);
      }
      
      // 2. Remove highlight
      card.element.classList.remove('center-highlight');
      centerCardRef.current = null;
      
      // 3. Move to Center
      // Get world transform before reparenting
      const worldPos = new THREE.Vector3();
      const worldQuat = new THREE.Quaternion();
      card.getWorldPosition(worldPos);
      card.getWorldQuaternion(worldQuat);
      
      // Remove from sphere group and add to scene directly to stop rotation
      sphereGroupRef.current.remove(card);
      scene.add(card);
      
      // Set world position and rotation
      card.position.copy(worldPos);
      card.quaternion.copy(worldQuat);
      
      // Assign Tarot Data
      const usedIds = selectedCardsRef.current.map(c => c.card.id);
      const availableTarot = TAROT_DECK.filter(c => !usedIds.includes(c.id));
      const randomTarot = availableTarot[Math.floor(Math.random() * availableTarot.length)];
      const isUpright = Math.random() > 0.2; // 80% upright
      
      selectedCardsRef.current.push({ card: randomTarot, isUpright });
      (card as any).setCardData(randomTarot.name, randomTarot.image_front);
      
      // Animate to Center
      const targetPos = { x: 0, y: 0, z: 500 }; // Center, close to camera
      
      new TWEEN.Tween(card.position)
        .to(targetPos, 1500)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();
        
      // Flip to show front
      // Rotate 180 deg around Y axis relative to current, but ensure it faces camera upright
      new TWEEN.Tween(card.rotation)
        .to({ x: 0, y: Math.PI, z: isUpright ? 0 : Math.PI }, 1500)
        .easing(TWEEN.Easing.Exponential.Out)
        .onComplete(() => {
           setPhase('reading');
           // Trigger AI Reading
           getLoveReading(randomTarot.name, isUpright).then(result => {
             setReadingResult(result);
           });
        })
        .start();

      // Fade out other cards
      availableCardsRef.current.forEach(c => {
         new TWEEN.Tween(c.element.style)
           .to({ opacity: 0 }, 1000)
           .start();
      });
      
      // Fade out effects
      new TWEEN.Tween(circleMaterial.uniforms.uOpacity)
        .to({ value: 0 }, 1000).start();
      new TWEEN.Tween(particleMat)
        .to({ opacity: 0 }, 1000).start();
    };

    const handleStartShuffle = () => {
      if (isShufflingRef.current) return;
      isShufflingRef.current = true;
      setPhase('shuffling');

      // 1. Effects
      new TWEEN.Tween(circleMaterial.uniforms.uOpacity).to({ value: 0.9 }, 800).start();
      new TWEEN.Tween(particleMat).to({ opacity: 0.7 }, 800).start();

      // 2. Scatter - cards fly outward in a circle
      cards.forEach((card, i) => {
        // Stop idle animations
        idleTweensRef.current.forEach(t => t.stop());
        idleTweensRef.current = [];
        
        const angle = (i / cardCount) * Math.PI * 2;
        const radius = 600 + Math.random() * 200;
        const scatterPos = {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius * 0.5, // Flatten vertically
          z: (Math.random() - 0.5) * 400
        };
        
        new TWEEN.Tween(card.position)
          .to(scatterPos, shuffleDuration * 0.4)
          .easing(TWEEN.Easing.Exponential.Out)
          .start();
          
        new TWEEN.Tween(card.rotation)
          .to({ x: Math.random()*Math.PI, y: Math.random()*Math.PI, z: Math.random()*Math.PI }, shuffleDuration * 0.4)
          .start();
      });

      // 3. Form Sphere - cards arrange into a 3D sphere
      setTimeout(() => {
        setPhase('sphere'); 
        
        // Responsive sphere sizing
        const isMobile = width < 768;
        const sphereRadius = isMobile ? 400 : 600;
        
        // Position the sphere group in center
        sphereGroupRef.current.position.set(0, 0, 0);
        
        const spherePositions = createSphereLayout(availableCardsRef.current.length, sphereRadius);
        
        availableCardsRef.current.forEach((card, i) => {
          const pos = spherePositions[i];
          
          // Animate to sphere position RELATIVE to sphere group
          new TWEEN.Tween(card.position)
            .to({ x: pos.x, y: pos.y, z: pos.z }, 2000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onComplete(() => {
               if (i === availableCardsRef.current.length - 1) {
                 setPhase('selecting');
               }
            })
            .start();
            
          // Rotate to face center
          new TWEEN.Tween(card.rotation)
            .to({ x: pos.rotation.x, y: pos.rotation.y, z: pos.rotation.z }, 2000)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();
        });
      }, shuffleDuration * 0.5);
    };

    window.addEventListener('trigger-shuffle', handleStartShuffle);

    // --- Loop ---
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      TWEEN.update();

      // Effects
      circleMaterial.uniforms.uTime.value = time;
      particles.rotation.y = time * 0.1;

      // Sphere Rotation (Y-axis and X-axis for 3D feel)
      if (phaseRef.current === 'sphere' || phaseRef.current === 'selecting') {
        sphereGroupRef.current.rotation.y += 0.002;
        sphereGroupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      }

      // Center Detection
      if (phaseRef.current === 'selecting') {
        findCenterCard();
      }

      webglRenderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      webglRenderer.setSize(w, h);
      cssRenderer.setSize(w, h);
      updateMagicCircleScale();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('trigger-shuffle', handleStartShuffle);
      if (rendererContainerRef.current) rendererContainerRef.current.innerHTML = '';
      circleGeometry.dispose();
      circleMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      TWEEN.removeAll();
    };
  }, [cardImage, cardCount, particleColor, shuffleDuration, onDraw]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Background Fallback */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a2e_0%,_#000000_100%)] z-0" />
      
      <div ref={rendererContainerRef} className="absolute inset-0" />
      
      {/* Reading Result Overlay */}
      {readingResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 border border-cyan-500/50 p-8 rounded-xl max-w-md text-center backdrop-blur-md pointer-events-auto animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
              {readingResult.cardName}
            </h2>
            <p className="text-cyan-300 mb-4 italic">{readingResult.uprightOrReversed}</p>
            
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Love Meaning</h3>
                <p className="text-gray-200 leading-relaxed">{readingResult.loveMeaning}</p>
              </div>
              
              <div>
                <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Advice</h3>
                <p className="text-gray-200 leading-relaxed">{readingResult.advice}</p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="mt-8 px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full text-white font-semibold hover:scale-105 transition-transform"
            >
              Draw Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
