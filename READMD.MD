CyberDestin RO: Sci-Fi Love Tarot (Web / H5)
Project Name: CyberDestin RO Target Market: Romania 🇷🇴 Core Concept: A mobile-first, sci-fi themed Tarot application focusing on love & relationships. Tech Stack: Next.js (App Router), Tailwind CSS, Three.js, i18n.

1. Project Overview
This is a Single Page Application (SPA) designed as a high-performance H5 mobile web app. It blends traditional Tarot mysticism with a high-fidelity "Cyberpunk/Sci-Fi" visual aesthetic.

Key Value Propositions:

Frictionless: No login required. Immediate value delivery.

Localized: Deeply tailored for the Romanian market (Language & Cultural nuance), with fallback to English and Chinese.

Visual Impact: High-end 3D animations and neon aesthetics to differentiate from traditional "witchy" tarot sites.

2. Tech Stack & Dependencies
Framework: Next.js 14+ (App Router)

Language: TypeScript

Styling: Tailwind CSS (Structure), Framer Motion (2D transitions).

3D Animation: Three.js + @react-three/fiber + @react-three/drei (For the 3D card shuffling effect).

Internationalization: next-intl (Handling RO / EN / ZH).

State Management: Zustand (For managing deck state, user limits, and selected cards).

Persistence: localStorage (To handle daily limits without a backend database).

Icons: Lucide React (Futuristic/Clean style).

3. Functional Requirements
3.1 Internationalization (i18n)
Supported Languages:

Romanian (ro) - DEFAULT. Must be the initial state.

English (en)

Chinese (zh)

Mechanism: Automatic locale detection is optional; prefer a clean manual toggle (Language Switcher) in the UI.

3.2 User System (No-Login Strategy)
Access: Open to all users immediately.

Rate Limiting (The "Game Rule"):

Limit: 3 Readings per user, per day.

Implementation: Store a timestamp and counter in localStorage (e.g., last_reading_date: '2023-11-27', count: 2).

Reset Logic: If last_reading_date != today, reset count to 0.

Block State: If count >= 3, disable the "Draw" button and show a countdown timer to midnight or a "Come back tomorrow" message.

3.3 Core User Flow
Landing / Home:

Hero section with the 3D Deck (Static or hovering).

Language Switcher.

"Energy Status" display (e.g., "Energy: 2/3").

CTA Button: "Reveal Destiny" (RO: "Descoperă Destinul").

The Ritual (Shuffle & Draw):

Triggered by clicking CTA.

Action: The 3D deck performs an explosive shuffle animation (Expansion -> Chaos -> Reassembly).

Selection: User taps the deck to draw ONE card (simulated random selection from 78 cards).

The Reveal (Result):

Card flip animation (Cyberpunk style).

Display high-res Tarot Card image (Midjourney generated style).

Interpretation Text:

Card Name.

Keywords (3-5 words).

Love Guidance: A specific paragraph focusing on romantic relationships, tone tailored to the selected language (Mystical/Sci-Fi tone).

Share (Viral Loop):

A "Share Result" button that generates a clean screenshot or copies a link with the specific card parameters to share on WhatsApp/Socials.

4. UI/UX Design System
4.1 Visual Theme: "Cyber-Mysticism"
Background: Deep Space Black (#050505) with subtle animated nebula fog.

Primary Colors:

Neon Purple: #7b2cbf (Borders, mystical elements).

Cyan: #00f5d4 (Data streams, technical text).

Hot Pink: #f72585 (Love/Heart elements, CTAs).

Glassmorphism: All text containers should look like translucent frosted glass (Head-Up Display style).

4.2 Typography
Headings: Orbitron or Rajdhani (Tech/Sci-fi feel).

Body: Inter or Roboto (Readability).

5. Data Structure (Mock Data)
Since there is no backend initially, Tarot data is stored in src/data/tarot-cards.json.

Schema Example:
    ```
    [
        {
            "id": 6,
            "slug": "the-lovers",
            "image_url": "/assets/cards/lovers_cyber.jpg",
            "locales": {
            "ro": {
                "name": "Îndrăgostiții",
                "keywords": ["Armonie", "Alegere", "Uniune Cosmică"],
                "meaning_love": "O conexiune divină se formează. Datele sufletului tău se sincronizează perfect cu partenerul..."
            },
            "en": {
                "name": "The Lovers",
                "keywords": ["Harmony", "Choice", "Cosmic Union"],
                "meaning_love": "A divine connection is forming. Your soul data is synchronizing perfectly..."
            },
            "zh": {
                "name": "恋人",
                "keywords": ["和谐", "选择", "宇宙结合"],
                "meaning_love": "一种神圣的连接正在形成。你的灵魂数据正在与伴侣完美同步..."
            }
            }
        }
        ]
    ```

6. Directory Structure (Suggested)

    ```
    ├── public/
    │   ├── assets/
    │   │   └── cards/        # High-res card images
    │   └── locales/          # (Optional) if using JSON based i18n
    ├── src/
    │   ├── app/
    │   │   ├── [locale]/     # i18n routing
    │   │   │   ├── page.tsx  # Landing + Shuffle Logic
    │   │   │   └── layout.tsx
    │   ├── components/
    │   │   ├── Deck3D/       # Three.js Components
    │   │   │   ├── CardMesh.tsx
    │   │   │   └── Scene.tsx
    │   │   ├── UI/
    │   │   │   ├── ReadingResult.tsx
    │   │   │   └── LanguageSwitch.tsx
    │   ├── hooks/
    │   │   └── useDailyLimit.ts  # Logic for 3/day restriction
    │   ├── store/
    │   │   └── useGameStore.ts   # Zustand state
    │   └── data/
    │       └── tarot_data.ts     # The full 78 card text database
    ```

 7. Implementation Roadmap for AI Agent
Setup: Initialize Next.js app with TypeScript, Tailwind, and install three @react-three/fiber @react-three/drei framer-motion zustand next-intl.

Core UI: Build the layout skeleton with the "Cyber-Mysticism" theme (Background, Fonts).

3D Component: Implement the Deck3D component. Use simple BoxGeometries initially, mapped with textures. Implement the "Explosion -> Shuffle -> Reset" animation using React Spring or GSAP inside the canvas.

Logic Hook: Implement useDailyLimit hook to check and write to localStorage.

Integration: Connect the "Reveal" button to trigger the 3D animation, then pick a random card ID, and display the Result Overlay.

Localization: Populate the JSON data for at least the Major Arcana (22 cards) in RO/EN/ZH to test the language switching.    

