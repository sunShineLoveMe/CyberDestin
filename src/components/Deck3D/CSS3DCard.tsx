import { CSS3DObject } from "./css3dRenderer";

export function createCSS3DCard(imageUrl: string = "/UI/card_back.png", index: number): CSS3DObject {
  const div = document.createElement('div');
  div.className = 'css3d-card';
  
  // Container for flipping
  const inner = document.createElement('div');
  inner.className = 'css3d-card-inner';
  div.appendChild(inner);

  // Card Front (The Tarot Image - initially hidden/back)
  // Note: In 3D space, we'll rotate the card so the "back" (design) faces the camera initially.
  // Or we can structure it so "front" is the design and "back" is the tarot face.
  // Let's stick to standard: Front = Design (Back of card), Back = Tarot Face (Front of card)
  // Actually, usually "Front" is the image, "Back" is the pattern.
  // Let's define:
  // .card-front: The Tarot Image (e.g. The Fool)
  // .card-back: The Pattern (card_back.png)
  
  const front = document.createElement('div');
  front.className = 'card-face card-front'; // Tarot Image
  
  // 1. Generic Background for Front (since we lack 78 unique images)
  // We can use torpat.png as a base or a cool gradient
  const frontBg = document.createElement('div');
  frontBg.className = 'card-front-bg';
  frontBg.style.backgroundImage = 'url(/UI/torpat.png)'; // Use existing image as base
  frontBg.style.backgroundSize = 'cover';
  frontBg.style.width = '100%';
  frontBg.style.height = '100%';
  frontBg.style.position = 'absolute';
  frontBg.style.opacity = '0.5'; // Dim it so text pops
  front.appendChild(frontBg);

  // 2. Card Name Text
  const nameOverlay = document.createElement('div');
  nameOverlay.className = 'card-name-overlay';
  nameOverlay.style.position = 'absolute';
  nameOverlay.style.width = '100%';
  nameOverlay.style.height = '100%';
  nameOverlay.style.display = 'flex';
  nameOverlay.style.flexDirection = 'column';
  nameOverlay.style.justifyContent = 'center';
  nameOverlay.style.alignItems = 'center';
  nameOverlay.style.padding = '10px';
  nameOverlay.style.zIndex = '10';
  
  const nameText = document.createElement('h3');
  nameText.style.color = '#fff';
  nameText.style.fontFamily = '"Orbitron", sans-serif';
  nameText.style.fontSize = '18px';
  nameText.style.textAlign = 'center';
  nameText.style.textShadow = '0 0 10px #f72585';
  nameText.style.margin = '0';
  nameOverlay.appendChild(nameText);
  
  front.appendChild(nameOverlay);

  const back = document.createElement('div');
  back.className = 'card-face card-back'; // Pattern
  const backImg = document.createElement('img');
  backImg.src = "/UI/card_back.png";
  back.appendChild(backImg);

  inner.appendChild(front);
  inner.appendChild(back);

  const object = new CSS3DObject(div);
  // Store reference to inner div for flipping
  (object as any).elementInner = inner;
  
  // Update to set data
  (object as any).setCardData = (name: string, image: string) => {
    nameText.innerText = name;
    // If we had real images, we would set them here:
    // frontImg.src = image; 
    // But for now, we just keep the generic background + name
  };
  
  return object;
}
