import { CSS3DRenderer as ThreeCSS3DRenderer, CSS3DObject as ThreeCSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

// Re-export directly as we will use them in client-side only components
export const CSS3DRenderer = ThreeCSS3DRenderer;
export type CSS3DRenderer = ThreeCSS3DRenderer;

export const CSS3DObject = ThreeCSS3DObject;
export type CSS3DObject = ThreeCSS3DObject;
