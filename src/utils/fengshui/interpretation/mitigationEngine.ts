export interface MitigationAdvice {
  severity: "low" | "medium" | "high";
  advice: string[];
}

export function generateMitigation(
  mountain: number,
  water: number,
  annual?: number,
  monthly?: number
): MitigationAdvice {
  const dynamicStars = [mountain, water, annual, monthly].filter(Boolean);

  let severity: MitigationAdvice["severity"] = "low";
  const advice: string[] = [];

  if (dynamicStars.includes(5)) {
    severity = "high";
    advice.push("Place strong metal cure (6-rod brass wind chime).");
    advice.push("Avoid renovation and loud activity.");
  }

  if (dynamicStars.includes(2)) {
    severity = "medium";
    advice.push("Introduce metal element to weaken earth illness star.");
  }

  if (dynamicStars.includes(3)) {
    advice.push("Use fire element (red tones, lighting) to reduce conflict.");
  }

  if (dynamicStars.includes(7)) {
    advice.push("Reduce sharp metal objects; introduce calm water tones.");
  }

  if (dynamicStars.includes(9)) {
    advice.push("Activate with light and movement if sector is usable.");
  }

  if (advice.length === 0) {
    advice.push("No major mitigation required.");
  }

  return { severity, advice };
}
