export interface ParsedDayData {
  date: string;
  summary: {
    pillar: string;
    lunar: string;
    officer: string;
    constellation: string;
    blackRabbit: string;
    naYin: string;
  };
  advice: {
    good: string[];
    avoid: string[];
  };
  // Professional Data
  technical: {
    xkdg: {
      name: string;
      numbers: string;
      element: string;
      star: string;
    } | null;
    flyingStars: Record<string, string>; // e.g. { Ctr: "6", NW: "7" }
    qiMen: {
      sanYuan: string[]; // List of deities directions
      charms: string[]; // List of charm directions
    };
    zodiacRaw: string[]; // Raw text for zodiac luck
  };
  directions: {
    wealth: string;
    nobility: string;
  };
  hours: HourData[];
}

export interface HourData {
  time: string;
  name: string;
  goodStars: string[];
  badStars: string[];
}

export const parseDailyText = (
  date: string,
  rawText: string,
): ParsedDayData => {
  const lines = rawText.split("\n").map((l) => l.trim());

  // --- 1. BASIC SUMMARY ---
  const pillarMatch = rawText.match(/60 Jia Zi:\s*(.*?)\n/);
  const naYinMatch = rawText.match(/Na Yin:\s*(.*?)\n/);
  const lunarMatch = rawText.match(/Lunar:\s*(.*?)\n/);
  const officerMatch = rawText.match(/12 Day Officer:\s*(.*?)\s*\(/);
  const constellationMatch = rawText.match(/28 Constellations:\s*(.*?)\s*\(/);
  const rabbitMatch = rawText.match(/Black Rabbit:\s*(.*?)\n/);

  // --- 2. XKDG (Xuan Kong Da Gua) ---
  // Format: "Accomplished, 7/9, Kan/Li, Greedy Wolf"
  let xkdg = null;
  const xkdgMatch = rawText.match(/XKDG:\n(.*?)\n/);
  if (xkdgMatch) {
    const parts = xkdgMatch[1].split(",").map((s) => s.trim());
    if (parts.length >= 4) {
      xkdg = {
        name: parts[0],
        numbers: parts[1],
        element: parts[2],
        star: parts[3],
      };
    }
  }

  // --- 3. FLYING STARS ---
  // Format: "Ctr:6, NW:7, N:2..."
  const flyingStars: Record<string, string> = {};
  const fsMatch = rawText.match(/Flying Stars:\s*(.*?)\n/);
  if (fsMatch) {
    const stars = fsMatch[1].split(",");
    stars.forEach((s) => {
      const [dir, num] = s.split(":").map((x) => x.trim());
      if (dir && num) flyingStars[dir] = num;
    });
  }

  // --- 4. QI MEN DUN JIA ---
  const sanYuanLines: string[] = [];
  const charmLines: string[] = [];

  // Extract San Yuan section
  const syStart = rawText.indexOf("San Yuan QiMen:");
  const syEnd = rawText.indexOf("5 Charms QiMen");
  if (syStart > -1) {
    const syBlock = rawText.substring(syStart, syEnd > -1 ? syEnd : undefined);
    syBlock.split("\n").forEach((l) => {
      if (l.includes(":")) sanYuanLines.push(l.trim());
    });
  }

  // Extract Charms section
  if (syEnd > -1) {
    const charmEnd = rawText.indexOf("10 Day Masters:");
    const charmBlock = rawText.substring(
      syEnd,
      charmEnd > -1 ? charmEnd : undefined,
    );
    charmBlock.split("\n").forEach((l) => {
      if (l.includes(":")) charmLines.push(l.trim());
    });
  }

  // --- 5. DIRECTIONS (Quick Lookup) ---
  const wealthMatch = rawText.match(/Life Door \(Wealth\):\s*(\w+)/);
  const nobilityMatch = rawText.match(/Chief \(Nobility\):\s*(\w+)/);

  // --- 6. ADVICE PARSING (Existing Logic) ---
  const goodSet = new Set<string>();
  const avoidSet = new Set<string>();

  let captureMode = false;
  for (const line of lines) {
    if (line.includes("Usage:") || line.includes("DETAILS OF"))
      captureMode = true;
    else if (line.includes("BI-HOURLY STARS") || line.includes("Heavenly Path"))
      captureMode = false;

    if (captureMode && line.startsWith("•")) {
      let content = line.replace(/•/g, "").trim();
      const isNegative = /NOT FOR|Avoid|Inauspicious|Don't|bad for/i.test(
        content,
      );
      content = content.replace(/NOT FOR|SUITABLE for|Avoid/gi, "").trim();
      content = content.charAt(0).toUpperCase() + content.slice(1);

      if (content.length > 2) {
        if (isNegative) avoidSet.add(content);
        else goodSet.add(content);
      }
    }
  }

  // --- 7. EXTRACT ZODIAC RAW ---
  // To display the "Book" version of zodiac luck
  const zodiacRaw: string[] = [];
  const zodiacStart = rawText.indexOf("12 Earthly Branches:");
  if (zodiacStart > -1) {
    const zodiacEnd = rawText.indexOf("Heavenly Path");
    const zodiacBlock = rawText.substring(zodiacStart, zodiacEnd);
    zodiacBlock.split("\n").forEach((l) => {
      if (l.includes(":") && l.split(":")[1].trim().length > 0) {
        zodiacRaw.push(l.trim());
      }
    });
  }

  // --- 8. HOURS ---
  const hours: HourData[] = [];
  const hourRegex = /(.*?) Hour \((.*?)\):/g;
  const hourSectionIndex = rawText.indexOf("BI-HOURLY STARS");

  if (hourSectionIndex > -1) {
    const hourText = rawText.substring(hourSectionIndex);
    let match;
    while ((match = hourRegex.exec(hourText)) !== null) {
      const [fullHeader, hourName, timeRange] = match;
      const startIndex = match.index + fullHeader.length;
      const nextIndex = hourText.indexOf("Hour (", startIndex);
      const content = hourText.substring(
        startIndex,
        nextIndex > -1 ? nextIndex : undefined,
      );

      const extractStars = (marker: string) => {
        const start = content.indexOf(marker);
        if (start === -1) return [];
        const sub = content.substring(start + marker.length);
        const end = sub.indexOf("(-) Hour Stars");
        const chunk =
          end > -1 && marker.includes("(+)") ? sub.substring(0, end) : sub;
        return chunk
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s && !s.includes("Hour Stars"));
      };

      hours.push({
        name: hourName.trim(),
        time: timeRange.trim(),
        goodStars: extractStars("(+) Hour Stars:"),
        badStars: extractStars("(-) Hour Stars:"),
      });
    }
  }

  return {
    date,
    summary: {
      pillar: pillarMatch ? pillarMatch[1].trim() : "Unknown",
      lunar: lunarMatch ? lunarMatch[1].trim() : "",
      officer: officerMatch ? officerMatch[1].trim() : "",
      constellation: constellationMatch ? constellationMatch[1].trim() : "",
      blackRabbit: rabbitMatch ? rabbitMatch[1].trim() : "",
      naYin: naYinMatch ? naYinMatch[1].trim() : "",
    },
    advice: { good: Array.from(goodSet), avoid: Array.from(avoidSet) },
    technical: {
      xkdg,
      flyingStars,
      qiMen: { sanYuan: sanYuanLines, charms: charmLines },
      zodiacRaw,
    },
    directions: {
      wealth: wealthMatch ? wealthMatch[1] : "-",
      nobility: nobilityMatch ? nobilityMatch[1] : "-",
    },
    hours,
  };
};
