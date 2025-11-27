export interface TarotCard {
  id: number;
  slug: string;
  image_url: string;
  locales: {
    ro: CardLocale;
    en: CardLocale;
    zh: CardLocale;
  };
}

interface CardLocale {
  name: string;
  keywords: string[];
  meaning_love: string;
}

export const tarotData: TarotCard[] = [
  {
    id: 0,
    slug: "the-fool",
    image_url: "/assets/cards/fool_cyber.jpg",
    locales: {
      ro: {
        name: "Nebunul",
        keywords: ["Început", "Spontaneitate", "Potențial"],
        meaning_love: "Un nou început în dragoste te așteaptă. Fii deschis la neprevăzut și lasă-te purtat de valul emoțiilor fără frică."
      },
      en: {
        name: "The Fool",
        keywords: ["Beginning", "Spontaneity", "Potential"],
        meaning_love: "A new beginning in love awaits you. Be open to the unexpected and let yourself be carried by the wave of emotions without fear."
      },
      zh: {
        name: "愚人",
        keywords: ["开始", "自发性", "潜力"],
        meaning_love: "爱情的新开始正在等待着你。对意想不到的事情保持开放态度，毫无畏惧地随波逐流。"
      }
    }
  },
  {
    id: 6,
    slug: "the-lovers",
    image_url: "/assets/cards/lovers_cyber.jpg",
    locales: {
      ro: {
        name: "Îndrăgostiții",
        keywords: ["Armonie", "Alegere", "Uniune Cosmică"],
        meaning_love: "O conexiune divină se formează. Datele sufletului tău se sincronizează perfect cu partenerul, creând o rezonanță unică."
      },
      en: {
        name: "The Lovers",
        keywords: ["Harmony", "Choice", "Cosmic Union"],
        meaning_love: "A divine connection is forming. Your soul data is synchronizing perfectly with your partner, creating a unique resonance."
      },
      zh: {
        name: "恋人",
        keywords: ["和谐", "选择", "宇宙结合"],
        meaning_love: "一种神圣的连接正在形成。你的灵魂数据正在与伴侣完美同步，创造出独特的共鸣。"
      }
    }
  }
  // Add more cards here...
];
