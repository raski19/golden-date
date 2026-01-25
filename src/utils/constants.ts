// src/utils/constants.ts

// 1. Time & Logistics
export const BRANCH_HOURS: Record<string, string> = {
  Rat: "23:00 - 01:00",
  Ox: "01:00 - 03:00",
  Tiger: "03:00 - 05:00",
  Rabbit: "05:00 - 07:00",
  Dragon: "07:00 - 09:00",
  Snake: "09:00 - 11:00",
  Horse: "11:00 - 13:00",
  Goat: "13:00 - 15:00",
  Monkey: "15:00 - 17:00",
  Rooster: "17:00 - 19:00",
  Dog: "19:00 - 21:00",
  Pig: "21:00 - 23:00",
};

export const BRANCH_ELEMENTS: Record<string, string> = {
  Rat: "Water",
  Pig: "Water",
  Tiger: "Wood",
  Rabbit: "Wood",
  Snake: "Fire",
  Horse: "Fire",
  Monkey: "Metal",
  Rooster: "Metal",
  Ox: "Earth",
  Dragon: "Earth",
  Goat: "Earth",
  Dog: "Earth",
};

// 2. Interaction Maps
export const CLASH_PAIRS: Record<string, string> = {
  Rat: "Horse",
  Horse: "Rat",
  Ox: "Goat",
  Goat: "Ox",
  Tiger: "Monkey",
  Monkey: "Tiger",
  Rabbit: "Rooster",
  Rooster: "Rabbit",
  Dragon: "Dog",
  Dog: "Dragon",
  Snake: "Pig",
  Pig: "Snake",
};

export const SIX_HARMONY: Record<string, string> = {
  Rat: "Ox",
  Ox: "Rat",
  Tiger: "Pig",
  Pig: "Tiger",
  Rabbit: "Dog",
  Dog: "Rabbit",
  Dragon: "Rooster",
  Rooster: "Dragon",
  Snake: "Monkey",
  Monkey: "Snake",
  Horse: "Goat",
  Goat: "Horse",
};

export const THREE_HARMONY: Record<string, string[]> = {
  Rat: ["Dragon", "Monkey"],
  Dragon: ["Rat", "Monkey"],
  Monkey: ["Rat", "Dragon"],
  Ox: ["Snake", "Rooster"],
  Snake: ["Ox", "Rooster"],
  Rooster: ["Ox", "Snake"],
  Tiger: ["Horse", "Dog"],
  Horse: ["Tiger", "Dog"],
  Dog: ["Tiger", "Horse"],
  Rabbit: ["Pig", "Goat"],
  Pig: ["Rabbit", "Goat"],
  Goat: ["Rabbit", "Pig"],
};

// 3. Shen Sha (Stars) Logic
export const STEM_NOBLEMAN: Record<string, string[]> = {
  Jia: ["Ox", "Goat"],
  Wu: ["Ox", "Goat"],
  Geng: ["Ox", "Goat"],
  Yi: ["Rat", "Monkey"],
  Ji: ["Rat", "Monkey"],
  Bing: ["Pig", "Rooster"],
  Ding: ["Pig", "Rooster"],
  Ren: ["Rabbit", "Snake"],
  Gui: ["Rabbit", "Snake"],
  Xin: ["Horse", "Tiger"],
};

export const TRAVELING_HORSE: Record<string, string> = {
  Snake: "Pig",
  Rooster: "Pig",
  Ox: "Pig",
  Tiger: "Monkey",
  Horse: "Monkey",
  Dog: "Monkey",
  Pig: "Snake",
  Rabbit: "Snake",
  Goat: "Snake",
  Monkey: "Tiger",
  Rat: "Tiger",
  Dragon: "Tiger",
};

export const PEACH_BLOSSOM: Record<string, string> = {
  Snake: "Horse",
  Rooster: "Horse",
  Ox: "Horse",
  Tiger: "Rabbit",
  Horse: "Rabbit",
  Dog: "Rabbit",
  Pig: "Rat",
  Rabbit: "Rat",
  Goat: "Rat",
  Monkey: "Rooster",
  Rat: "Rooster",
  Dragon: "Rooster",
};

export const ACADEMIC_STAR: Record<string, string> = {
  Jia: "Snake",
  Yi: "Horse",
  Bing: "Monkey",
  Ding: "Rooster",
  Wu: "Monkey",
  Ji: "Rooster",
  Geng: "Pig",
  Xin: "Rat",
  Ren: "Tiger",
  Gui: "Rabbit",
};

export const BRANCH_START_TIMES: Record<string, number> = {
  Ox: 1,
  Tiger: 3,
  Rabbit: 5,
  Dragon: 7,
  Snake: 9,
  Horse: 11,
  Goat: 13,
  Monkey: 15,
  Rooster: 17,
  Dog: 19,
  Pig: 21,
  Rat: 23,
};
