# CyberDestin

A futuristic AI-powered Love Tarot divination web app built with Next.js, featuring advanced 3D animations, hybrid rendering technology, and multi-language support.

## ✨ Features Completed

### 🎯 Core Features
- ✅ **Next.js 16** with App Router and TypeScript
- ✅ **Tailwind CSS 4.0** with custom theme system
- ✅ **Multi-language support** (EN/ZH/RO) using next-intl v4
- ✅ **Daily reading limit** system with localStorage (configurable to 9999 for testing)
- ✅ **Responsive design** optimized for mobile, tablet, and desktop
- ✅ **SEO-optimized** with proper meta tags and semantic HTML

### 🎨 Advanced 3D Visualization System
- ✅ **CSS3D + WebGL Hybrid Rendering** - Dual-renderer architecture for optimal performance
  - CSS3D for high-quality card DOM rendering
  - WebGL for performant particle effects and shaders
- ✅ **Complex Shuffle Animation Sequence**
  - Cards fly in from bottom to center
  - 360° scatter with physics-based motion
  - Orbital shuffle with dynamic trajectories
  - Smooth merge back to center
  - Automatic 3-card draw and reveal
- ✅ **Magic Circle Shader System**
  - Procedural GLSL shader with multiple rings
  - Rotating rune patterns
  - Pulsing glow effects synchronized with animation
- ✅ **Particle System** - 500+ particles with:
  - Spherical distribution
  - Continuous rotation animation
  - Additive blending for ethereal effect
- ✅ **Card Flip Animation**
  - 3D CSS transforms for smooth flipping
  - Upright/Reversed orientation support
  - Neon border glows and shadows

### 🔮 AI Love Tarot System
- ✅ **Complete 78-Card Database** (`TarotDeck.ts`)
  - 22 Major Arcana cards
  - 56 Minor Arcana cards (4 suits × 14 cards)
  - Love-specific meanings for upright and reversed positions
  - Metadata: arcana type, suit, card ID, image paths
- ✅ **Intelligent Drawing Algorithm**
  - Random unique card selection
  - 80% upright / 20% reversed probability
  - Past/Present/Future spread layout
- ✅ **AI Reading Service** (`AIReader.ts`)
  - Structured reading format (Past, Present, Future, Summary, Advice)
  - Ready for OpenAI/Anthropic LLM integration
  - Mock response for testing
- ✅ **Custom Tween Engine** (`tween.ts`)
  - Lightweight animation library
  - Multiple easing functions (Back, Exponential, Quadratic)
  - Chained and delayed animations support
- ✅ **Beautiful Result Display**
  - Glassmorphism panels with blur effects
  - Fade-in animations
  - Responsive 3-column layout
  - "Start New Reading" functionality

### 💎 Visual Effects & UI
- ✅ **Cyberpunk Neon Theme**
  - Custom color palette: Deep Space Black, Neon Purple, Cyan Tech, Hot Pink
  - Gradient text effects
  - Neon borders and glows
- ✅ **Dynamic Background**
  - Full-screen magic pattern (`bg_magic.png`)
  - Semi-transparent gradient overlay
  - Layered z-index management
- ✅ **Card Visuals**
  - Custom card back design (`card_back.png`)
  - Generic front with card name overlay
  - Holographic effects and rounded corners
- ✅ **Interactive Elements**
  - Hover effects on buttons
  - Scale transforms on interaction
  - Smooth color transitions
- ✅ **Typography**
  - Orbitron font for headings
  - Rajdhani for body text
  - Proper font loading and fallbacks

### 🛠️ Technical Implementation
- ✅ **SSR Compatibility** - Dynamic imports for client-only 3D components
- ✅ **Performance Optimized**
  - Efficient tween update loop
  - Proper resource cleanup on unmount
  - RequestAnimationFrame for smooth 60fps rendering
- ✅ **Type Safety** - Full TypeScript coverage with proper interfaces
- ✅ **Code Organization**
  - Modular component structure
  - Separation of concerns (data, logic, presentation)
  - Reusable utility functions

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **3D Rendering**: Three.js with CSS3DRenderer
- **Animation**: Custom Tween.js engine
- **Internationalization**: next-intl v4
- **State Management**: Zustand
- **Fonts**: Orbitron, Rajdhani, Inter

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx          # Main page with TarotShuffle integration
│   │   └── layout.tsx        # Root layout with i18n
│   └── globals.css           # Global styles and CSS3D card styles
├── components/
│   ├── Deck3D/
│   │   ├── TarotShuffle.tsx  # Main 3D shuffle component
│   │   ├── CSS3DCard.tsx     # Card factory function
│   │   ├── css3dRenderer.ts  # CSS3DRenderer wrapper
│   │   ├── tween.ts          # Custom animation engine
│   │   ├── TarotDeck.ts      # 78-card database
│   │   └── AIReader.ts       # AI reading service
│   └── UI/
│       └── LanguageSwitch.tsx # Language switcher component
├── i18n/
│   ├── routing.ts            # Locale configuration
│   └── request.ts            # next-intl setup
├── hooks/
│   └── useDailyLimit.ts      # Daily limit logic
└── store/
    └── gameStore.ts          # Zustand state management
```

## 🎮 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/CyberDestin.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Usage

1. **Landing Page**: View the magical background and cyberpunk UI
2. **Click Button**: Click "REVEAL YOUR LOVE DESTINY" to start
3. **Watch Animation**: Observe the 3D card shuffle sequence
4. **View Results**: See your Past/Present/Future spread with AI interpretation
5. **Start New Reading**: Click to reload and try again

## 🔧 Configuration

### Daily Limit

Edit `src/hooks/useDailyLimit.ts`:

```typescript
const MAX_DAILY_READINGS = 9999; // Change this value
```

### LLM Integration

Replace the mock function in `src/components/Deck3D/AIReader.ts`:

```typescript
export async function getLoveReading(drawnCards: DrawnCard[]): Promise<ReadingResult> {
  // Replace with your API call
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ cards: drawnCards })
  });
  return response.json();
}
```

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Three.js community for CSS3DRenderer
- Next.js team for the amazing framework
- Tarot community for card meanings and interpretations
