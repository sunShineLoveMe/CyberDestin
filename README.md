# CyberDestin

A futuristic AI-powered Love Tarot divination web app built with Next.js, featuring advanced 3D animations, hybrid rendering technology, and multi-language support.

## 🔮 塔罗牌抽卡逻辑说明

### 为什么是三张牌？

本项目采用塔罗牌中最经典的**"过去-现在-未来"三牌阵**（Past-Present-Future Spread），这是塔罗占卜中使用最广泛的牌阵之一，特别适合爱情占卜。

#### 三牌阵的意义

1. **第一张牌 - 过去（Past）**
   - 代表：过去的感情经历、影响当前感情状态的因素
   - 解读：帮助理解你的感情模式、过往关系中的教训、以及塑造现状的历史背景
   - 作用：揭示根源，理解"为什么会走到今天这一步"

2. **第二张牌 - 现在（Present）**
   - 代表：当前的感情状况、正在面临的问题或机会
   - 解读：聚焦当下的感情能量、现阶段的挑战、以及需要注意的关键点
   - 作用：提供清晰的现状认知，明确"此刻的真实状态是什么"

3. **第三张牌 - 未来（Future）**
   - 代表：感情发展的趋势、可能的结果、未来的方向
   - 解读：预示爱情走向、潜在的发展路径、以及需要准备的变化
   - 作用：给出方向指引，回答"如果保持现状，将会走向何方"

#### 为什么三张牌最合适？

- **简洁明了**：三张牌构成完整的"起承转"叙事结构，既不过于简单，也不会信息过载
- **时间维度**：覆盖过去、现在、未来三个时间维度，形成完整的故事线
- **易于理解**：即使是塔罗初学者也能快速理解三个位置的含义
- **深度适中**：足够提供有价值的洞察，又不会让咨询者感到困惑
- **传统认可**：在塔罗界被公认为最有效的基础牌阵之一

### 交互式抽卡流程（已实现）

1. **洗牌启动** ✅
   - 点击"REVEAL YOUR LOVE DESTINY"按钮触发洗牌动画
   
2. **洗牌动效** ✅
   - 卡牌从中心位置散开成圆形
   - 随机旋转和位移，模拟真实洗牌效果
   - 持续约 1.1 秒
   
3. **球体形成** ✅
   - 78张卡牌使用**斐波那契球体算法**均匀分布
   - 在页面上方组成半径700px的3D中空球体
   - 每张卡牌朝向球心外侧，确保背面可见
   - 形成动画持续 1.5 秒，使用二次缓动
   
4. **球体旋转** ✅
   - 球体自动绕Y轴旋转（速度：0.003 rad/frame）
   - 同时在X轴上轻微摆动，增加动态感
   - 旋转过程中持续检测中心卡牌
   
5. **中心高亮** ✅
   - 实时计算每张卡牌投影到屏幕中心的距离
   - 最接近中心且在前方的卡牌自动高亮
   - 高亮效果：白色边框 + 强烈发光阴影 + 1.1倍缩放
   - 高亮判定阈值：NDC距离 < 0.2
   
6. **交互选择** ✅
   - 用户点击高亮的中心卡牌进行选择
   - 非高亮卡牌点击无效，防止误触
   - 选中后卡牌从球体组中移除，停止旋转
   
7. **卡牌归位** ✅
   - 选中的卡牌保持世界坐标系位置
   - 飞向页面下方预留槽位（过去/现在/未来）
   - 槽位间距：350px，Y坐标：-500px，Z坐标：800px
   - 同时翻转卡牌显示正面，根据正逆位旋转
   - 归位动画：1秒，使用Back.Out缓动
   
8. **流程循环** ✅
   - 自动进入下一轮选择，直到选满3张
   - 剩余卡牌继续旋转，中心检测持续更新
   
9. **结果揭晓** ✅
   - 第3张牌归位后，触发AI解读流程
   - 魔法阵和粒子效果淡出
   - 剩余卡牌透明度降为0
   - 1.5秒后调用`onDraw`回调，传递选中的3张牌数据

### 技术实现细节

#### 斐波那契球体算法

```typescript
function createSphereLayout(count: number, radius: number) {
  const positions = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // 黄金角度
  
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y 从 1 到 -1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    
    const x = Math.cos(theta) * radiusAtY * radius;
    const z = Math.sin(theta) * radiusAtY * radius;
    positions.push({ x, y: y * radius, z });
  }
  
  return positions;
}
```

- **优势**：均匀分布，无极点聚集
- **应用**：78张卡牌完美覆盖球面

#### 中心卡牌检测

```typescript
// 1. 获取卡牌世界坐标
card.getWorldPosition(worldPos);

// 2. 投影到屏幕空间（NDC）
const screenPos = worldPos.clone().project(camera);

// 3. 计算到屏幕中心(0,0)的距离
const distance = screenCenter.distanceTo(new THREE.Vector2(screenPos.x, screenPos.y));

// 4. 筛选：在前方 && 距离最小
if (worldPos.z > 0 && distance < minDistance) {
  closestCard = card;
}
```

### 项目中的抽卡实现逻辑

#### 1. 随机抽取机制

```typescript
// 从 78 张塔罗牌中随机抽取 3 张不重复的牌
const indices = new Set<number>();
while(indices.size < 3) {
  indices.add(Math.floor(Math.random() * TAROT_DECK.length));
}
```

- **牌库**：完整的 78 张塔罗牌（22 张大阿尔卡纳 + 56 张小阿尔卡纳）
- **不重复**：使用 `Set` 数据结构确保三张牌各不相同
- **纯随机**：每张牌被抽中的概率完全相等

#### 2. 正逆位判定

```typescript
const isUpright = Math.random() > 0.2; // 80% 正位, 20% 逆位
```

- **正位（Upright）**：牌面朝上，表示牌义的正面能量
- **逆位（Reversed）**：牌面倒置，表示牌义的负面能量或阻碍
- **概率设计**：80% 正位 / 20% 逆位，符合传统塔罗的平衡比例

#### 3. 牌位分配

```typescript
drawnIndices.forEach((idx, slot) => {
  // slot 0 = 过去（Left, x: -450）
  // slot 1 = 现在（Center, x: 0）
  // slot 2 = 未来（Right, x: 450）
  const xPos = (slot - 1) * 450;
});
```

- **视觉布局**：从左到右依次为 过去 → 现在 → 未来
- **空间位置**：左侧（-450px）、中央（0px）、右侧（+450px）
- **时间流动**：符合人类从左到右的阅读习惯

#### 4. AI 解读生成

```typescript
export async function getLoveReading(drawnCards: DrawnCard[]): Promise<ReadingResult> {
  const [past, present, future] = drawnCards;
  // 基于三张牌的牌义和正逆位，生成综合解读
  return {
    past: { name, upright, love_meaning },
    present: { name, upright, love_meaning },
    future: { name, upright, love_meaning },
    summary: "综合心理分析...",
    advice: "具体建议..."
  };
}
```

- **个性化解读**：针对每张牌的具体含义和正逆位状态
- **整体分析**：将三张牌作为一个完整故事进行综合解读
- **实用建议**：基于牌面给出具有可操作性的感情建议

### 塔罗牌数据库

项目包含完整的 78 张塔罗牌数据（`TarotDeck.ts`）：

- **22 张大阿尔卡纳**：愚者、魔术师、女祭司...世界
- **56 张小阿尔卡纳**：
  - 权杖（Wands）：14 张（象征行动、激情）
  - 圣杯（Cups）：14 张（象征情感、爱情）
  - 宝剑（Swords）：14 张（象征理智、冲突）
  - 星币（Pentacles）：14 张（象征物质、稳定）

每张牌都包含：
- `love_upright`: 正位时的爱情含义
- `love_reversed`: 逆位时的爱情含义
- `image_front`: 牌面图片路径
- 完整的牌面信息（名称、编号、所属阿尔卡纳等）

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
