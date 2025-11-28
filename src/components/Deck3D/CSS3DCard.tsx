import { CSS3DObject } from "./css3dRenderer";

export function createCSS3DCard(imageUrl: string = "/UI/torpat.png", index: number): CSS3DObject {
  const div = document.createElement('div');
  div.className = 'css3d-card';
  
  // Card Face (Front - Image)
  const face = document.createElement('div');
  face.className = 'card-face';
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = `Card ${index}`;
  face.appendChild(img);
  
  // Card Back (Back - Design)
  const back = document.createElement('div');
  back.className = 'card-back';
  
  div.appendChild(face);
  div.appendChild(back);

  const object = new CSS3DObject(div);
  return object;
}
