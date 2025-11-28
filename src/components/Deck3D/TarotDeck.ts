export interface TarotCard {
  id: number;
  name: string;
  arcana: "Major" | "Minor";
  suit?: "Wands" | "Cups" | "Swords" | "Pentacles";
  number?: number | string;
  love_upright: string;
  love_reversed: string;
  image_front: string;
}

export const TAROT_DECK: TarotCard[] = [
  // --- Major Arcana ---
  {
    id: 0,
    name: "The Fool",
    arcana: "Major",
    love_upright: "New beginnings, spontaneity, taking a leap of faith in love.",
    love_reversed: "Recklessness, risk-taking without thought, fear of commitment.",
    image_front: "/UI/tarot/major_00.png"
  },
  {
    id: 1,
    name: "The Magician",
    arcana: "Major",
    love_upright: "Manifestation, resourcefulness, taking action to find love.",
    love_reversed: "Manipulation, deception, untrustworthiness in relationships.",
    image_front: "/UI/tarot/major_01.png"
  },
  {
    id: 2,
    name: "The High Priestess",
    arcana: "Major",
    love_upright: "Intuition, mystery, sensuality, unrevealed feelings.",
    love_reversed: "Secrets, hidden agendas, ignoring intuition about a partner.",
    image_front: "/UI/tarot/major_02.png"
  },
  {
    id: 3,
    name: "The Empress",
    arcana: "Major",
    love_upright: "Fertility, nurturing, abundance, deep emotional connection.",
    love_reversed: "Dependence, smothering, lack of self-care affecting love.",
    image_front: "/UI/tarot/major_03.png"
  },
  {
    id: 4,
    name: "The Emperor",
    arcana: "Major",
    love_upright: "Stability, structure, protection, a reliable partner.",
    love_reversed: "Domination, rigidity, controlling behavior in relationships.",
    image_front: "/UI/tarot/major_04.png"
  },
  {
    id: 5,
    name: "The Hierophant",
    arcana: "Major",
    love_upright: "Tradition, commitment, marriage, spiritual connection.",
    love_reversed: "Breaking rules, unconventional relationships, challenging norms.",
    image_front: "/UI/tarot/major_05.png"
  },
  {
    id: 6,
    name: "The Lovers",
    arcana: "Major",
    love_upright: "Love, harmony, relationships, values alignment, choices.",
    love_reversed: "Disharmony, imbalance, misalignment of values, bad choices.",
    image_front: "/UI/tarot/major_06.png"
  },
  {
    id: 7,
    name: "The Chariot",
    arcana: "Major",
    love_upright: "Determination, overcoming obstacles, pursuing love with focus.",
    love_reversed: "Aggression, lack of direction, losing control in love.",
    image_front: "/UI/tarot/major_07.png"
  },
  {
    id: 8,
    name: "Strength",
    arcana: "Major",
    love_upright: "Courage, compassion, patience, taming the ego in love.",
    love_reversed: "Insecurity, weakness, lack of confidence in relationships.",
    image_front: "/UI/tarot/major_08.png"
  },
  {
    id: 9,
    name: "The Hermit",
    arcana: "Major",
    love_upright: "Soul-searching, introspection, being alone to find oneself.",
    love_reversed: "Isolation, loneliness, withdrawing from love.",
    image_front: "/UI/tarot/major_09.png"
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    arcana: "Major",
    love_upright: "Destiny, turning point, karma, a change in relationship status.",
    love_reversed: "Bad luck, resistance to change, breaking cycles.",
    image_front: "/UI/tarot/major_10.png"
  },
  {
    id: 11,
    name: "Justice",
    arcana: "Major",
    love_upright: "Fairness, truth, law, cause and effect in relationships.",
    love_reversed: "Unfairness, dishonesty, lack of accountability.",
    image_front: "/UI/tarot/major_11.png"
  },
  {
    id: 12,
    name: "The Hanged Man",
    arcana: "Major",
    love_upright: "Pause, surrender, letting go, new perspective on love.",
    love_reversed: "Stalling, resistance, martyrdom, indecision.",
    image_front: "/UI/tarot/major_12.png"
  },
  {
    id: 13,
    name: "Death",
    arcana: "Major",
    love_upright: "Endings, transformation, transition, letting go of the past.",
    love_reversed: "Resistance to change, inability to move on.",
    image_front: "/UI/tarot/major_13.png"
  },
  {
    id: 14,
    name: "Temperance",
    arcana: "Major",
    love_upright: "Balance, moderation, patience, purpose, finding middle ground.",
    love_reversed: "Imbalance, excess, lack of long-term vision.",
    image_front: "/UI/tarot/major_14.png"
  },
  {
    id: 15,
    name: "The Devil",
    arcana: "Major",
    love_upright: "Shadow self, attachment, addiction, sexuality, materialism.",
    love_reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment.",
    image_front: "/UI/tarot/major_15.png"
  },
  {
    id: 16,
    name: "The Tower",
    arcana: "Major",
    love_upright: "Sudden change, upheaval, chaos, revelation, awakening.",
    love_reversed: "Personal transformation, fear of change, averting disaster.",
    image_front: "/UI/tarot/major_16.png"
  },
  {
    id: 17,
    name: "The Star",
    arcana: "Major",
    love_upright: "Hope, faith, purpose, renewal, spirituality.",
    love_reversed: "Lack of faith, despair, self-trust, disconnection.",
    image_front: "/UI/tarot/major_17.png"
  },
  {
    id: 18,
    name: "The Moon",
    arcana: "Major",
    love_upright: "Illusion, fear, anxiety, subconscious, intuition.",
    love_reversed: "Release of fear, repressed emotion, inner confusion.",
    image_front: "/UI/tarot/major_18.png"
  },
  {
    id: 19,
    name: "The Sun",
    arcana: "Major",
    love_upright: "Positivity, fun, warmth, success, vitality.",
    love_reversed: "Inner child, feeling down, overly optimistic.",
    image_front: "/UI/tarot/major_19.png"
  },
  {
    id: 20,
    name: "Judgement",
    arcana: "Major",
    love_upright: "Judgement, rebirth, inner calling, absolution.",
    love_reversed: "Self-doubt, inner critic, ignoring the call.",
    image_front: "/UI/tarot/major_20.png"
  },
  {
    id: 21,
    name: "The World",
    arcana: "Major",
    love_upright: "Completion, integration, accomplishment, travel.",
    love_reversed: "Seeking personal closure, short-cuts, delays.",
    image_front: "/UI/tarot/major_21.png"
  },
  // --- Minor Arcana (Wands) ---
  {
    id: 22,
    name: "Ace of Wands",
    arcana: "Minor",
    suit: "Wands",
    love_upright: "New passion, chemistry, excitement, flirtation.",
    love_reversed: "Lack of spark, delays, missed opportunities.",
    image_front: "/UI/tarot/wands_01.png"
  },
  {
    id: 23,
    name: "Two of Wands",
    arcana: "Minor",
    suit: "Wands",
    love_upright: "Future planning, decisions, travel with partner.",
    love_reversed: "Fear of unknown, lack of planning, staying in comfort zone.",
    image_front: "/UI/tarot/wands_02.png"
  },
  // ... (Adding a subset for brevity, but user asked for 78. I will generate a programmatic filler for the rest to ensure the file is valid and has 78 entries, but with generic text for the middle ones to save space, or I can try to list them all if context allows. Given the strict requirement, I will list all but with concise text.)
  // Actually, I will generate all 78 to be safe.
  { id: 24, name: "Three of Wands", arcana: "Minor", suit: "Wands", love_upright: "Expansion, foresight, long-distance love.", love_reversed: "Obstacles, delays, frustration in love.", image_front: "/UI/tarot/wands_03.png" },
  { id: 25, name: "Four of Wands", arcana: "Minor", suit: "Wands", love_upright: "Celebration, joy, harmony, homecoming.", love_reversed: "Conflict, tension, instability at home.", image_front: "/UI/tarot/wands_04.png" },
  { id: 26, name: "Five of Wands", arcana: "Minor", suit: "Wands", love_upright: "Conflict, competition, tension, rivalry.", love_reversed: "Avoiding conflict, respecting differences.", image_front: "/UI/tarot/wands_05.png" },
  { id: 27, name: "Six of Wands", arcana: "Minor", suit: "Wands", love_upright: "Success, public recognition, confidence.", love_reversed: "Egotism, fall from grace, lack of recognition.", image_front: "/UI/tarot/wands_06.png" },
  { id: 28, name: "Seven of Wands", arcana: "Minor", suit: "Wands", love_upright: "Challenge, competition, protection, perseverance.", love_reversed: "Giving up, overwhelmed, overly defensive.", image_front: "/UI/tarot/wands_07.png" },
  { id: 29, name: "Eight of Wands", arcana: "Minor", suit: "Wands", love_upright: "Movement, fast paced change, action.", love_reversed: "Delays, frustration, holding off.", image_front: "/UI/tarot/wands_08.png" },
  { id: 30, name: "Nine of Wands", arcana: "Minor", suit: "Wands", love_upright: "Resilience, courage, persistence, test of faith.", love_reversed: "On edge, defensive, hesitant, paranoia.", image_front: "/UI/tarot/wands_09.png" },
  { id: 31, name: "Ten of Wands", arcana: "Minor", suit: "Wands", love_upright: "Burden, extra responsibility, hard work.", love_reversed: "Doing it all, carrying the burden, delegation.", image_front: "/UI/tarot/wands_10.png" },
  { id: 32, name: "Page of Wands", arcana: "Minor", suit: "Wands", love_upright: "Inspiration, ideas, discovery, limitless potential.", love_reversed: "Newly formed ideas, redirecting energy.", image_front: "/UI/tarot/wands_11.png" },
  { id: 33, name: "Knight of Wands", arcana: "Minor", suit: "Wands", love_upright: "Energy, passion, inspired action, adventure.", love_reversed: "Passion project, haste, scattered energy.", image_front: "/UI/tarot/wands_12.png" },
  { id: 34, name: "Queen of Wands", arcana: "Minor", suit: "Wands", love_upright: "Courage, confidence, independence, social butterfly.", love_reversed: "Self-respect, self-confidence, introverted.", image_front: "/UI/tarot/wands_13.png" },
  { id: 35, name: "King of Wands", arcana: "Minor", suit: "Wands", love_upright: "Natural-born leader, vision, entrepreneur.", love_reversed: "Impulsiveness, haste, ruthless, high expectations.", image_front: "/UI/tarot/wands_14.png" },

  // --- Cups ---
  { id: 36, name: "Ace of Cups", arcana: "Minor", suit: "Cups", love_upright: "Love, new relationships, compassion, creativity.", love_reversed: "Self-love, intuition, repressed emotions.", image_front: "/UI/tarot/cups_01.png" },
  { id: 37, name: "Two of Cups", arcana: "Minor", suit: "Cups", love_upright: "Unified love, partnership, mutual attraction.", love_reversed: "Self-love, break-ups, disharmony.", image_front: "/UI/tarot/cups_02.png" },
  { id: 38, name: "Three of Cups", arcana: "Minor", suit: "Cups", love_upright: "Celebration, friendship, creativity, collaborations.", love_reversed: "Independence, alone time, hardcore partying.", image_front: "/UI/tarot/cups_03.png" },
  { id: 39, name: "Four of Cups", arcana: "Minor", suit: "Cups", love_upright: "Meditation, contemplation, apathy, reevaluation.", love_reversed: "Retreat, withdrawal, checking in.", image_front: "/UI/tarot/cups_04.png" },
  { id: 40, name: "Five of Cups", arcana: "Minor", suit: "Cups", love_upright: "Regret, failure, disappointment, pessimism.", love_reversed: "Personal setbacks, self-forgiveness, moving on.", image_front: "/UI/tarot/cups_05.png" },
  { id: 41, name: "Six of Cups", arcana: "Minor", suit: "Cups", love_upright: "Revisiting the past, childhood memories, innocence.", love_reversed: "Living in the past, forgiveness, lacking playfulness.", image_front: "/UI/tarot/cups_06.png" },
  { id: 42, name: "Seven of Cups", arcana: "Minor", suit: "Cups", love_upright: "Opportunities, choices, wishful thinking, illusion.", love_reversed: "Alignment, personal values, overwhelmed by choices.", image_front: "/UI/tarot/cups_07.png" },
  { id: 43, name: "Eight of Cups", arcana: "Minor", suit: "Cups", love_upright: "Disappointment, abandonment, withdrawal, escapism.", love_reversed: "Trying one more time, indecision, aimless drifting.", image_front: "/UI/tarot/cups_08.png" },
  { id: 44, name: "Nine of Cups", arcana: "Minor", suit: "Cups", love_upright: "Contentment, satisfaction, gratitude, wish come true.", love_reversed: "Inner happiness, materialism, dissatisfaction.", image_front: "/UI/tarot/cups_09.png" },
  { id: 45, name: "Ten of Cups", arcana: "Minor", suit: "Cups", love_upright: "Divine love, blissful relationships, harmony, alignment.", love_reversed: "Disconnection, misaligned values, struggling relationships.", image_front: "/UI/tarot/cups_10.png" },
  { id: 46, name: "Page of Cups", arcana: "Minor", suit: "Cups", love_upright: "Creative opportunities, intuitive messages, curiosity.", love_reversed: "New ideas, doubting intuition, creative block.", image_front: "/UI/tarot/cups_11.png" },
  { id: 47, name: "Knight of Cups", arcana: "Minor", suit: "Cups", love_upright: "Creativity, romance, charm, imagination, beauty.", love_reversed: "Overactive imagination, unrealistic, jealous, moody.", image_front: "/UI/tarot/cups_12.png" },
  { id: 48, name: "Queen of Cups", arcana: "Minor", suit: "Cups", love_upright: "Compassionate, caring, emotionally stable, intuitive.", love_reversed: "Inner feelings, self-care, self-love, co-dependency.", image_front: "/UI/tarot/cups_13.png" },
  { id: 49, name: "King of Cups", arcana: "Minor", suit: "Cups", love_upright: "Emotionally balanced, compassionate, diplomatic.", love_reversed: "Self-compassion, inner feelings, moody, emotionally manipulative.", image_front: "/UI/tarot/cups_14.png" },

  // --- Swords ---
  { id: 50, name: "Ace of Swords", arcana: "Minor", suit: "Swords", love_upright: "Breakthroughs, new ideas, mental clarity, success.", love_reversed: "Inner clarity, re-thinking an idea, clouded judgement.", image_front: "/UI/tarot/swords_01.png" },
  { id: 51, name: "Two of Swords", arcana: "Minor", suit: "Swords", love_upright: "Difficult decisions, weighing up options, an impasse.", love_reversed: "Indecision, confusion, information overload.", image_front: "/UI/tarot/swords_02.png" },
  { id: 52, name: "Three of Swords", arcana: "Minor", suit: "Swords", love_upright: "Heartbreak, emotional pain, sorrow, grief, hurt.", love_reversed: "Negative self-talk, releasing pain, optimism.", image_front: "/UI/tarot/swords_03.png" },
  { id: 53, name: "Four of Swords", arcana: "Minor", suit: "Swords", love_upright: "Rest, relaxation, meditation, contemplation.", love_reversed: "Exhaustion, burn-out, deep contemplation.", image_front: "/UI/tarot/swords_04.png" },
  { id: 54, name: "Five of Swords", arcana: "Minor", suit: "Swords", love_upright: "Conflict, disagreements, competition, defeat.", love_reversed: "Reconciliation, making amends, past resentment.", image_front: "/UI/tarot/swords_05.png" },
  { id: 55, name: "Six of Swords", arcana: "Minor", suit: "Swords", love_upright: "Transition, change, rite of passage, releasing baggage.", love_reversed: "Personal transition, resistance to change.", image_front: "/UI/tarot/swords_06.png" },
  { id: 56, name: "Seven of Swords", arcana: "Minor", suit: "Swords", love_upright: "Betrayal, deception, getting away with something.", love_reversed: "Imposter syndrome, self-deceit, keeping secrets.", image_front: "/UI/tarot/swords_07.png" },
  { id: 57, name: "Eight of Swords", arcana: "Minor", suit: "Swords", love_upright: "Negative thoughts, self-imposed restriction.", love_reversed: "Self-limiting beliefs, inner critic, releasing negative thoughts.", image_front: "/UI/tarot/swords_08.png" },
  { id: 58, name: "Nine of Swords", arcana: "Minor", suit: "Swords", love_upright: "Anxiety, worry, fear, depression, nightmares.", love_reversed: "Inner turmoil, deep-seated fears, secrets.", image_front: "/UI/tarot/swords_09.png" },
  { id: 59, name: "Ten of Swords", arcana: "Minor", suit: "Swords", love_upright: "Painful endings, deep wounds, betrayal, loss.", love_reversed: "Recovery, regeneration, resisting an inevitable end.", image_front: "/UI/tarot/swords_10.png" },
  { id: 60, name: "Page of Swords", arcana: "Minor", suit: "Swords", love_upright: "New ideas, curiosity, thirst for knowledge.", love_reversed: "Self-expression, all talk and no action.", image_front: "/UI/tarot/swords_11.png" },
  { id: 61, name: "Knight of Swords", arcana: "Minor", suit: "Swords", love_upright: "Ambitious, action-oriented, driven to succeed.", love_reversed: "Restless, unfocused, impulsive, burn-out.", image_front: "/UI/tarot/swords_12.png" },
  { id: 62, name: "Queen of Swords", arcana: "Minor", suit: "Swords", love_upright: "Independent, unbiased judgement, clear boundaries.", love_reversed: "Overly-emotional, easily influenced, bitchy.", image_front: "/UI/tarot/swords_13.png" },
  { id: 63, name: "King of Swords", arcana: "Minor", suit: "Swords", love_upright: "Mental clarity, intellectual power, authority.", love_reversed: "Quiet power, inner truth, misuse of power.", image_front: "/UI/tarot/swords_14.png" },

  // --- Pentacles ---
  { id: 64, name: "Ace of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "A new financial or career opportunity, manifestation.", love_reversed: "Lost opportunity, lack of planning and foresight.", image_front: "/UI/tarot/pentacles_01.png" },
  { id: 65, name: "Two of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Multiple priorities, time management, prioritisation.", love_reversed: "Over-committed, disorganisation, reprioritisation.", image_front: "/UI/tarot/pentacles_02.png" },
  { id: 66, name: "Three of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Teamwork, collaboration, learning, implementation.", love_reversed: "Disharmony, misalignment, working alone.", image_front: "/UI/tarot/pentacles_03.png" },
  { id: 67, name: "Four of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Saving money, security, conservatism, scarcity.", love_reversed: "Over-spending, greed, self-protection.", image_front: "/UI/tarot/pentacles_04.png" },
  { id: 68, name: "Five of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Financial loss, poverty, lack mindset, isolation.", love_reversed: "Recovery from financial loss, spiritual poverty.", image_front: "/UI/tarot/pentacles_05.png" },
  { id: 69, name: "Six of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Giving, receiving, sharing wealth, generosity.", love_reversed: "Self-care, unpaid debt, one-sided charity.", image_front: "/UI/tarot/pentacles_06.png" },
  { id: 70, name: "Seven of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Long-term view, sustainable results, perseverance.", love_reversed: "Lack of long-term vision, limited success.", image_front: "/UI/tarot/pentacles_07.png" },
  { id: 71, name: "Eight of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Apprenticeship, repetitive tasks, mastery.", love_reversed: "Self-development, perfectionism, misdirected activity.", image_front: "/UI/tarot/pentacles_08.png" },
  { id: 72, name: "Nine of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Abundance, luxury, self-sufficiency, financial independence.", love_reversed: "Self-worth, over-investment in work, hustling.", image_front: "/UI/tarot/pentacles_09.png" },
  { id: 73, name: "Ten of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Wealth, financial security, family, long-term success.", love_reversed: "The dark side of wealth, financial failure or loss.", image_front: "/UI/tarot/pentacles_10.png" },
  { id: 74, name: "Page of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Manifestation, financial opportunity, skill development.", love_reversed: "Lack of progress, procrastination, learn from failure.", image_front: "/UI/tarot/pentacles_11.png" },
  { id: 75, name: "Knight of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Hard work, productivity, routine, conservatism.", love_reversed: "Self-discipline, boredom, feeling 'stuck'.", image_front: "/UI/tarot/pentacles_12.png" },
  { id: 76, name: "Queen of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Nurturing, practical, providing financially, a working parent.", love_reversed: "Financial independence, self-care, work-home conflict.", image_front: "/UI/tarot/pentacles_13.png" },
  { id: 77, name: "King of Pentacles", arcana: "Minor", suit: "Pentacles", love_upright: "Wealth, business, leadership, security, discipline.", love_reversed: "Financially inept, obsessed with wealth and status.", image_front: "/UI/tarot/pentacles_14.png" },
];
