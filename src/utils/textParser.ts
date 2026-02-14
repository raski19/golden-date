export interface ParsedDayData {
  date: string;
  summary: {
    pillar: string;
    lunar: string;
    officer: string;
    constellation: string;
    blackRabbit: string;
    naYin: string;
    heavenlyPath: string;
  };
  advice: { good: string[]; avoid: string[] };
  technical: {
    xkdg: {
      name: string;
      numbers: string;
      element: string;
      star: string;
    } | null;
    flyingStars: Record<string, string>;
    qiMen: {
      sanYuan: string[];
      charms: string[];
    };
    dayMasters: string[];
    zodiacRaw: string[];
  };
  directions: { wealth: string; nobility: string };
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

  // 1. SUMMARY
  const pillarMatch = rawText.match(/60 Jia Zi:\s*(.*?)\n/);
  const naYinMatch = rawText.match(/Na Yin:\s*(.*?)\n/);
  const lunarMatch = rawText.match(/Lunar:\s*(.*?)\n/);
  const officerMatch = rawText.match(/12 Day Officer:\s*(.*?)\s*\(/);
  const constellationMatch = rawText.match(/28 Constellations:\s*(.*?)\s*\(/);
  const rabbitMatch = rawText.match(/Black Rabbit:\s*(.*?)\n/);
  const pathMatch = rawText.match(/Heavenly Path:\s*(.*?)\n/); // Extract Heavenly Path

  // 2. XKDG
  let xkdg = null;
  const xkdgMatch = rawText.match(/XKDG:\n(.*?)\n/);
  if (xkdgMatch) {
    const parts = xkdgMatch[1].split(",").map((s) => s.trim());
    if (parts.length >= 4)
      xkdg = {
        name: parts[0],
        numbers: parts[1],
        element: parts[2],
        star: parts[3],
      };
  }

  // 3. FLYING STARS
  const flyingStars: Record<string, string> = {};
  const fsMatch = rawText.match(/Flying Stars:\s*(.*?)\n/);
  if (fsMatch) {
    fsMatch[1].split(",").forEach((s) => {
      const [dir, num] = s.split(":").map((x) => x.trim());
      if (dir && num) flyingStars[dir] = num;
    });
  }

  // 4. QI MEN (San Yuan & 5 Charms)
  const sanYuanLines: string[] = [];
  const charmLines: string[] = [];

  const syStart = rawText.indexOf("San Yuan QiMen:");
  const charmStart = rawText.indexOf("5 Charms QiMen Mobility:");
  const dmStart = rawText.indexOf("10 Day Masters:");

  // Extract San Yuan
  if (syStart > -1 && charmStart > -1) {
    rawText
      .substring(syStart, charmStart)
      .split("\n")
      .forEach((l) => {
        if (l.includes(":")) sanYuanLines.push(l.replace(":", ": ").trim());
      });
  }
  // Extract 5 Charms
  if (charmStart > -1 && dmStart > -1) {
    rawText
      .substring(charmStart, dmStart)
      .split("\n")
      .forEach((l) => {
        // Clean up the string to remove headers
        if (l.includes(":") && !l.includes("QiMen")) charmLines.push(l.trim());
      });
  }

  // 5. DAY MASTERS & ZODIAC
  const dmLines: string[] = [];
  const zodiacLines: string[] = [];
  const zodiacStart = rawText.indexOf("12 Earthly Branches:");
  const pathStart = rawText.indexOf("Heavenly Path");

  if (dmStart > -1 && zodiacStart > -1) {
    rawText
      .substring(dmStart, zodiacStart)
      .split("\n")
      .forEach((l) => {
        if (l.includes(":")) dmLines.push(l.trim());
      });
  }
  if (zodiacStart > -1 && pathStart > -1) {
    rawText
      .substring(zodiacStart, pathStart)
      .split("\n")
      .forEach((l) => {
        if (l.includes(":") && l.split(":")[1].trim())
          zodiacLines.push(l.trim());
      });
  }

  // 6. ADVICE (Good/Avoid)
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

  // 7. HOURS
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
      heavenlyPath: pathMatch ? pathMatch[1].trim() : "-",
    },
    advice: { good: Array.from(goodSet), avoid: Array.from(avoidSet) },
    technical: {
      xkdg,
      flyingStars,
      qiMen: { sanYuan: sanYuanLines, charms: charmLines },
      dayMasters: dmLines,
      zodiacRaw: zodiacLines,
    },
    directions: {
      wealth: (rawText.match(/Life Door \(Wealth\):\s*(\w+)/) || [])[1] || "-",
      nobility: (rawText.match(/Chief \(Nobility\):\s*(\w+)/) || [])[1] || "-",
    },
    hours,
  };
};
