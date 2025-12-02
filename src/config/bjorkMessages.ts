export const BJORK_MESSAGES = {
  happy_messages: [
    "Nice! Keep going.",
    "Tiny win today!",
    "Proud of you!",
    "You're doing great!",
    "One step closer!",
    "Amazing progress!",
    "Keep it up!",
    "You've got this!",
  ],
  sad_messages: [
    "Don't worry, we've got this.",
    "Let's fix this together.",
    "It will get better.",
    "I'm here for you.",
    "Small steps forward.",
    "We'll manage this.",
    "Take it one day at a time.",
    "You're not alone.",
  ],
  neutral_messages: [
    "Here if you need me.",
    "One tiny step?",
    "Ready to help!",
    "Let's do this!",
    "What's next?",
    "I'm listening.",
  ],
};

export type BjorkMessageCategory = keyof typeof BJORK_MESSAGES;
