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

type GamePhase = 'idle' | 'shuffling' | 'sphere' | 'selecting' | 'result';

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
  const phaseRef = useRef<GamePhase>('idle');
  
  // State for game logic
  const cardsRef = useRef<CSS3DObject[]>([]);
  const availableCardsRef = useRef<CSS3DObject[]>([]);
  const selectedCardsRef = useRef<DrawnCard[]>([]);
  const centerCardRef = useRef<CSS3DObject | null>(null);
  const sphereGroupRef = useRef<THREE.Group>(new THREE.Group());
  const currentSlotRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || !rendererContainerRef.current) return;

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
          new TWEEN.Tween(card.position)
            .to({ 
              y: Math.sin(i * 0.5) * 10,
              z: -i * 3 + Math.cos(i * 0.3) * 5 
            }, 3000 + i * 100)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .yoyo(true)
            .repeat(Infinity)
            .start();
        })
        .start();
    });

    // --- Helper Functions ---

    const createSphereLayout = (count: number, radius: number) => {
      const positions: Array<{x: number, y: number, z: number}> = [];
      const phi = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radiusAtY * radius;
        const z = Math.sin(theta) * radiusAtY * radius;
        positions.push({ x: x, y: y * radius, z: z });
      }
      return positions;
    };

    const findCenterCard = () => {
      if (phaseRef.current !== 'selecting') return;
      
      const screenCenter = new THREE.Vector2(0, 0);
      let closestCard: CSS3DObject | null = null;
      let minDistance = Infinity;
      
      // We need to check distance to screen center (0,0) in NDC
      // But simpler: check distance to camera lookAt vector in world space?
      // No, screen projection is best.

      availableCardsRef.current.forEach(card => {
        // Get world position
        const worldPos = new THREE.Vector3();
        card.getWorldPosition(worldPos);
        
        // Project to screen
        const screenPos = worldPos.clone().project(camera);
        
        // Calculate distance to center (0,0)
        const distance = screenCenter.distanceTo(new THREE.Vector2(screenPos.x, screenPos.y));
        
        // Check if card is in front (z < 1 in NDC) and visible
        // Also check if it's "facing" the camera roughly?
        // For sphere, cards on back side should be ignored.
        // World Z should be positive (closer to camera) relative to sphere center?
        // Sphere center is (0, 200, 0). Camera is (0, 0, 2000).
        // Cards with larger Z are closer to camera.
        
        if (worldPos.z > 0 && distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });

      // Update highlight
      if (centerCardRef.current !== closestCard) {
        if (centerCardRef.current) {
          centerCardRef.current.element.classList.remove('center-highlight');
        }
        if (closestCard) {
          // Only highlight if it's reasonably close to center
          // NDC coordinates are -1 to 1. 0.15 is a good threshold.
          // Convert minDistance (which is in NDC 0-sqrt(2)) to check
          if (minDistance < 0.2) {
             (closestCard as any).element.classList.add('center-highlight');
             centerCardRef.current = closestCard;
          } else {
             centerCardRef.current = null;
          }
        } else {
          centerCardRef.current = null;
        }
      }
    };

    const handleCardClick = (clickedCard: CSS3DObject) => {
      if (phaseRef.current !== 'selecting') return;
      
      // Only allow clicking the highlighted center card
      if (clickedCard !== centerCardRef.current) return;
      
      // Select this card
      selectCard(clickedCard);
    };

    const selectCard = (card: CSS3DObject) => {
      // 1. Remove from available
      const index = availableCardsRef.current.indexOf(card);
      if (index > -1) {
        availableCardsRef.current.splice(index, 1);
      }
      
      // 2. Remove highlight
      card.element.classList.remove('center-highlight');
      centerCardRef.current = null;
      
      // 3. Move to slot
      // Remove from sphere group and add to scene directly to stop rotation
      // IMPORTANT: Get world transform before reparenting
      const worldPos = new THREE.Vector3();
      const worldQuat = new THREE.Quaternion();
      card.getWorldPosition(worldPos);
      card.getWorldQuaternion(worldQuat);
      
      sphereGroupRef.current.remove(card);
      scene.add(card);
      
      card.position.copy(worldPos);
      card.quaternion.copy(worldQuat);
      
      // Assign Tarot Data
      const usedIds = selectedCardsRef.current.map(c => c.card.id);
      const availableTarot = TAROT_DECK.filter(c => !usedIds.includes(c.id));
      const randomTarot = availableTarot[Math.floor(Math.random() * availableTarot.length)];
      const isUpright = Math.random() > 0.2; // 80% upright
      
      selectedCardsRef.current.push({ card: randomTarot, isUpright });
      (card as any).setCardData(randomTarot.name, randomTarot.image_front);
      
      // Slot positions (screen bottom)
      // Slot 0: Left, Slot 1: Center, Slot 2: Right
      // Y should be low (-600 or so)
      const slotX = (currentSlotRef.current - 1) * 350; // Tighter spacing
      const slotY = -500; // Lower part of screen
      const slotZ = 800; // Closer to camera for visibility
      
      new TWEEN.Tween(card.position)
        .to({ x: slotX, y: slotY, z: slotZ }, 1000)
        .easing(TWEEN.Easing.Back.Out)
        .start();
        
      new TWEEN.Tween(card.rotation)
        .to({ x: 0, y: Math.PI, z: isUpright ? 0 : Math.PI }, 1000) // Flip to front
        .start();
        
      currentSlotRef.current++;
      
      if (currentSlotRef.current >= 3) {
        phaseRef.current = 'result';
        if (onDraw) {
          setTimeout(() => onDraw(selectedCardsRef.current), 1500);
        }
        
        // Fade out effects
        new TWEEN.Tween(circleMaterial.uniforms.uOpacity)
          .to({ value: 0 }, 1000).start();
        new TWEEN.Tween(particleMat)
          .to({ opacity: 0 }, 1000).start();
          
        // Fade out remaining cards
        availableCardsRef.current.forEach(c => {
           new TWEEN.Tween(c.element.style)
             .to({ opacity: 0 }, 1000)
             .start();
        });
      }
    };

    const handleStartShuffle = () => {
      if (isShufflingRef.current) return;
      isShufflingRef.current = true;
      phaseRef.current = 'shuffling';

      // 1. Effects
      new TWEEN.Tween(circleMaterial.uniforms.uOpacity).to({ value: 0.9 }, 800).start();
      new TWEEN.Tween(particleMat).to({ opacity: 0.7 }, 800).start();

      // 2. Scatter - cards fly outward in a circle
      cards.forEach((card, i) => {
        // Stop idle animation
        TWEEN.remove(card.position as any); 
        
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

      // 3. Form Sphere - cards arrange into hollow sphere at top of screen
      setTimeout(() => {
        phaseRef.current = 'sphere';
        const sphereRadius = 700; // Larger radius for better visibility
        const sphereYOffset = 300; // Position sphere at top of screen
        const spherePositions = createSphereLayout(availableCardsRef.current.length, sphereRadius);
        
        availableCardsRef.current.forEach((card, i) => {
          const pos = spherePositions[i];
          
          // Animate to sphere position (add Y offset to move sphere up)
          new TWEEN.Tween(card.position)
            .to({ x: pos.x, y: pos.y + sphereYOffset, z: pos.z }, 1500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
               if (i === availableCardsRef.current.length - 1) {
                 phaseRef.current = 'selecting';
               }
            })
            .start();
            
          // Calculate rotation to face center of sphere (which is at y=sphereYOffset)
          const cardWorldPos = new THREE.Vector3(pos.x, pos.y + sphereYOffset, pos.z);
          const sphereCenter = new THREE.Vector3(0, sphereYOffset, 0);
          
          // Create a temporary object to calculate the correct rotation
          const tempObj = new THREE.Object3D();
          tempObj.position.copy(cardWorldPos);
          tempObj.lookAt(sphereCenter);
          
          // Rotate 180 degrees on Y so the back faces outward
          tempObj.rotateY(Math.PI);
          
          new TWEEN.Tween(card.rotation)
            .to({ 
              x: tempObj.rotation.x, 
              y: tempObj.rotation.y, 
              z: tempObj.rotation.z 
            }, 1500)
            .easing(TWEEN.Easing.Quadratic.Out)
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

      // Sphere Rotation
      if (phaseRef.current === 'sphere' || phaseRef.current === 'selecting') {
        sphereGroupRef.current.rotation.y += 0.003; // Slightly faster
        sphereGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1; // Gentle tilt
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
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden">
      <div ref={rendererContainerRef} className="absolute inset-0" />
    </div>
  );
}
