// --- STATE MANAGEMENT ---
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth() + 1;
let currentFilter = "all";
let allUsersData = [];

// TODO: Fetch this from Backend
const CLIENT_RULES = [
  // --- WEALTH ---
  {
    officers: ["Success"],
    type: "wealth",
    action: "Sign Contracts",
    icon: "📝",
    description:
      "The #1 day for closing deals, financial agreements, and binding contracts.",
  },
  {
    officers: ["Open", "Full"],
    type: "wealth",
    action: "Networking & Sales",
    icon: "🥂",
    description: "Launch projects, host events, or network with crowds.",
  },
  {
    officers: ["Receive"],
    type: "wealth",
    action: "Ask for Favors",
    icon: "🤲",
    description: "Collect debts, ask for funding, or seek mentorship.",
  },
  {
    officers: ["Full"],
    type: "wealth",
    action: "Branding & Visibility",
    icon: "🌟",
    description:
      "Maximize returns, debt collection, and high-visibility marketing.",
  },
  // --- CAREER ---
  {
    officers: ["Stable"],
    type: "career",
    action: "Acquire Assets",
    icon: "🏦",
    description:
      "Buy property, hire key staff, or lock in long-term investments.",
  },
  {
    officers: ["Establish"],
    type: "career",
    action: "Start New Role",
    icon: "🏗️",
    description: "Begin a new job, lay groundwork, or discuss future strategy.",
  },
  {
    officers: ["Remove"],
    type: "career",
    action: "Fix Problems",
    icon: "🧹",
    description:
      "Remove obstacles, fire bad clients, or solve technical issues.",
  },
  {
    officers: ["Balance"],
    type: "career",
    action: "Negotiations",
    icon: "⚖️",
    description: "Resolve conflicts or negotiate terms with partners.",
  },
  // --- HEALTH ---
  {
    officers: ["Remove", "Destruction"],
    type: "health",
    action: "Health & Reset",
    icon: "🧘‍♀️",
    description:
      "Best day to remove illness, start a detox, have surgery, or break bad habits.",
  },
  {
    officers: ["Balance"],
    type: "health",
    action: "Adjustment/Therapy",
    icon: "🧘",
    description:
      "Ideal for alignment (chiropractic), therapy, or balancing diet.",
  },
  {
    officers: ["Stable"],
    type: "health",
    action: "Start Long-term Treatment",
    icon: "💊",
    description: "Begin a long course of medication or a new fitness regime.",
  },
];
const SEARCH_GOALS = [
  // --- Wealth ---
  { value: "Sign Contracts", label: "📝 Sign Contracts" },
  { value: "Networking & Sales", label: "🥂 Networking & Sales" },
  { value: "Ask for Favors", label: "🤲 Ask for Favors" },
  { value: "Branding & Visibility", label: "🌟 Branding & Visibility" },

  // --- Career ---
  { value: "Acquire Assets", label: "🏦 Acquire Assets" },
  { value: "Start New Role", label: "🏗️ Start New Role" },
  { value: "Fix Problems", label: "🧹 Fix Problems" },
  { value: "Negotiations", label: "⚖️ Negotiations" },

  // --- Health ---
  { value: "Health & Reset", label: "🧘‍♀️ Health & Reset (Detox)" },
  { value: "Adjustment/Therapy", label: "🧘 Adjustment / Therapy" },
  { value: "Start Long-term Treatment", label: "💊 Start Medication" },
];

// --- INITIALIZATION ---
// Fetch users immediately when the script loads
fetch("/api/users")
  .then((res) => res.json())
  .then((users) => {
    allUsersData = users;
    const select = document.getElementById("userSelect");
    users.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = u._id;
      opt.innerText = u.name;
      select.appendChild(opt);
    });

    updateDateInputs();
    // Initialize Calendar & Goal Dropdown
    handleUserChange();
    populateGoalSelect();
    renderTeamCheckboxes(users);
  });

// --- NAVIGATION ---
function updateDateInputs() {
  document.getElementById("monthSelect").value = currentMonth;
  document.getElementById("yearInput").value = currentYear;
}

function resetToCurrent() {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth() + 1;
  updateDateInputs();
  loadCalendar();
}

function jumpToDate() {
  const m = parseInt(document.getElementById("monthSelect").value);
  const y = parseInt(document.getElementById("yearInput").value);
  if (m && y) {
    currentMonth = m;
    currentYear = y;
    loadCalendar();
  }
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  }
  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  updateDateInputs();
  loadCalendar();
}

async function handleUserChange() {
  // Show Loading
  loadingOverlay("flex");

  // Use a small timeout to let the UI update before the heavy lifting starts
  // (This ensures the blur renders instantly)
  setTimeout(async () => {
    try {
      await loadCalendar(); // Wait for grid to render
      populateGoalSelect(); // Reload goals
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      // Hide Loading
      loadingOverlay("none");
    }
  }, 10);
}

function populateGoalSelect() {
  const select = document.getElementById("goalSelect");
  if (!select) return;

  // Add a default placeholder
  let html = `<option value="" disabled selected>Select a Goal...</option>`;

  // Add options from our list
  html += SEARCH_GOALS.map(
    (g) => `<option value="${g.value}">${g.label}</option>`,
  ).join("");

  select.innerHTML = html;
}

async function findDates() {
  const goalSelect = document.getElementById("goalSelect");
  const userSelect = document.getElementById("userSelect");

  const goal = goalSelect.value;
  const userId = userSelect.value;

  if (!goal) {
    alert("Please select a goal first.");
    return;
  }

  // 1. UI Feedback (Loading)
  const btn = document.querySelector(".btn-search"); // Ensure your button has this class
  if (btn) btn.innerText = "Searching...";

  try {
    // 2. Fetch Data
    const response = await fetch("/api/find-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        action: goal,
        year: parseInt(document.getElementById("yearInput").value) || 2026,
      }),
    });

    if (!response.ok) throw new Error("Server returned " + response.status);

    const data = await response.json();

    // 3. Render
    showSearchResults(data, goal);
  } catch (error) {
    console.error("❌ Search Failed:", error);
    alert("Search error: " + error.message);
  } finally {
    if (btn) btn.innerText = "Find";
  }
}

function showSearchResults(dates, action) {
  // 1. Target the Body ID we defined in HTML
  const container = document.getElementById("searchBody");

  if (!container) {
    console.error("❌ ERROR: <div id='searchBody'> is missing from index.html");
    return;
  }

  // 2. Build Content
  if (!dates || dates.length === 0) {
    container.innerHTML = `
            <div style="padding:30px; text-align:center; color:#666;">
                <div style="font-size:2rem; margin-bottom:10px;">🤷‍♂️</div>
                No top-tier dates found for <strong>${action}</strong>.
            </div>`;
  } else {
    container.innerHTML = dates
      .map(
        (d) => `
            <div style="border:1px solid #eee; margin:5px 0; padding:15px; border-radius:8px; border-left:5px solid ${getColorBg(d.cssClass)}; background:#fcfcfc;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <strong style="font-size:1.1rem; color:#333;">${d.fullDate}</strong>
                    <span class="badge ${d.cssClass} ${d.score >= 85 ? "golden" : ""}" style="font-weight:bold; letter-spacing:1px;">${d.verdict} (${d.score}pts)</span>
                </div>
                
                <div style="font-size:0.9rem; color:#555; margin-bottom:8px;">
                     Officer: <strong>${d.dayInfo.officer}</strong> • Star: <strong>${d.dayInfo.constellation}</strong>
                </div>

                <div style="background:#e8f4fd; color:#004085; padding:8px; border-radius:4px; font-size:0.9rem; border:1px solid #b8daff;">
                    ${d.matchDetails.icon} <strong>Strategy:</strong> ${d.matchDetails.desc}
                </div>
            </div>
        `,
      )
      .join("");
  }

  // 3. Open Modal
  openModalById("searchModal");
}

// --- CALENDAR LOGIC ---
async function loadCalendar() {
  // Show Loading
  loadingOverlay("flex");

  const userId = document.getElementById("userSelect").value;
  if (!userId) return;

  const res = await fetch(
    `/api/calendar?userId=${userId}&year=${currentYear}&month=${currentMonth}`,
  );
  const data = await res.json();

  const days = data.days;
  const analysis = data.monthAnalysis;

  renderBanner(analysis);
  renderGrid(days);

  // Hide Loading
  loadingOverlay("none");
}

function renderBanner(analysis) {
  const banner = document.getElementById("monthBanner");
  // Safety check if element exists (you added it to HTML in previous step)
  if (!banner) return;

  if (!analysis) {
    banner.style.display = "none";
    return;
  }

  banner.className = `month-banner ${analysis.cssClass}`;
  banner.style.display = "flex";

  let icon = "📅";
  if (analysis.verdict === "DANGEROUS") icon = "⚠️";
  if (analysis.verdict === "EXCELLENT") icon = "🌟";
  if (analysis.verdict === "CAUTION") icon = "🛑";

  banner.innerHTML = `
        <div class="banner-icon">${icon}</div>
        <div class="banner-content">
            <h3>${analysis.title}</h3>
            <p>${analysis.description}</p>
        </div>
    `;
}

function renderGrid(days) {
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth - 1;

  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  // Adjust logic if you want Mon start vs Sun start. (0=Sun currently)
  for (let i = 0; i < firstDayOfWeek; i++) {
    grid.innerHTML += "<div></div>";
  }

  days.forEach((day) => {
    const cssClass = day.analysis.cssClass || "neutral";
    const card = document.createElement("div");
    const tags = day.analysis.tags || [];
    card.dataset.tags = tags.join(",");

    // Mark today's card
    const isToday = isCurrentMonth && day.day === today.getDate();
    if (isToday) {
      card.classList.add("today");
      card.dataset.today = "true";
    }

    const type = day.analysis.dayType || "";
    let typeStyle = "color:#999; font-size:0.7rem; font-weight:normal;";

    if (type === "Wealth")
      typeStyle = "color:#198754; font-weight:bold; font-size:0.7rem;"; // Green
    if (type === "Influence")
      typeStyle = "color:#0d6efd; font-weight:bold; font-size:0.7rem;"; // Blue
    if (type === "Resource")
      typeStyle = "color:#6610f2; font-weight:bold; font-size:0.7rem;"; // Purple
    if (type === "Output")
      typeStyle = "color:#fd7e14; font-weight:bold; font-size:0.7rem;"; // Orange

    const pScore = day.analysis.pillarScore || 0;
    const pIcon = day.analysis.pillarIcon || "";
    const pNote = day.analysis.pillarNote || "";
    let strongFoundation = false;

    // 1. TRANSLATE SCORE TO SIMPLE ENGLISH
    let supportLabel = "Unsupported";
    let supportColor = "#dc3545"; // Red

    if (pScore >= 85) {
      supportLabel = "Very Strong";
      supportColor = "#198754"; // Dark Green
    } else if (pScore >= 60) {
      supportLabel = "Supported";
      supportColor = "#0d6efd"; // Blue
      strongFoundation = true;
    } else if (pScore >= 40) {
      supportLabel = "Weak";
      supportColor = "#fd7e14"; // Orange
    }

    // --- CONSTELLATION VISUAL LOGIC ---
    const analysis = day.analysis || {};
    const quality = analysis.starQuality || "Mixed";
    const isFav = analysis.isStarFavorable || false;
    const isAvoid = analysis.isStarAvoid || false;
    const isAvoidElement = analysis.isAvoidElement || false;

    let starIcon = "★";
    let starColor = "#999";
    let starWeight = "400";

    // 1. RED (Avoid)
    if (isAvoid) {
      starIcon = "⛔";
      starColor = "#dc3545"; // Red

      // BOLD RED CONDITION:
      // It is bold if it is inherently Bad AND the Element is also Avoided.
      // (This covers Pleiades: Bad + Fire Clash = Bold Red)
      // (This exempts Ghost: Bad + Metal Support = Normal Red)
      if (quality === "Bad" && isAvoidElement) {
        starWeight = "800";
      }
    }
    // 2. GREEN (Positive)
    else if (quality === "Good" || (quality === "Mixed" && isFav)) {
      starIcon = "🌟";
      starColor = "#28a745"; // Green

      // BOLD GREEN CONDITION:
      // Only if inherent Good AND Favorable Element
      if (quality === "Good" && isFav) {
        starWeight = "800";
      }
    }
    // 3. GREY: Mixed & Neutral
    else starColor = "#999";

    const starStyle = `color:${starColor}; font-weight:${starWeight}; font-size: 0.75rem;`;

    // --- NINE STAR VISUAL LOGIC (Period 9 Optimized) ---
    const ns = day.info.nineStar || ""; // e.g. "5 Yellow (Disaster)"
    const nsNumber = ns.split(" ")[0]; // "5"
    const nsShort = ns.split("(")[0].trim(); // "5 Yellow"

    let nsStyle = "color:#7f8c8d;"; // Default Metal Grey
    let nsIcon = "⭐";

    // Logic based on Period 9 Hierarchy
    if (nsNumber === "9") {
      // THE KING: Supreme Wealth & Fame (Fire)
      nsStyle =
        "color:#8e44ad; font-weight:900; text-shadow: 0px 0px 1px #e056fd;"; // Glowing Purple
      nsIcon = "🔥";
    } else if (nsNumber === "1") {
      // THE QUEEN: Future Wealth & Nobleman (Water)
      nsStyle = "color:#2980b9; font-weight:bold;"; // Strong Blue
      nsIcon = "🌊";
    } else if (nsNumber === "8") {
      // THE RETIREE: Stable Assets (Earth)
      nsStyle = "color:#27ae60; font-weight:bold;"; // Green
      nsIcon = "💰";
    } else if (nsNumber === "6") {
      // AUTHORITY: Execution & Status (Metal)
      nsStyle = "color:#7f8c8d; font-weight:bold;";
      nsIcon = "⚙️";
    } else if (nsNumber === "4") {
      // ACADEMIC: Wisdom & Romance (Wood)
      nsStyle = "color:#16a085;"; // Teal
      nsIcon = "🎓";
    } else if (nsNumber === "5") {
      // DISASTER: The Emperor of Bad Luck (Earth)
      nsStyle = "color:#c0392b; font-weight:900;"; // Deep Red
      nsIcon = "☣️";
    } else if (nsNumber === "2") {
      // SICKNESS: Illness (Earth)
      nsStyle = "color:#2c3e50; font-weight:bold;"; // Dark Grey/Black
      nsIcon = "💊";
    } else if (nsNumber === "3" || nsNumber === "7") {
      // CONFLICT: Robbery & Arguments
      nsStyle = "color:#d35400; font-weight:bold;"; // Burnt Orange
      nsIcon = "⚔️";
    }

    const worseBadgesStyle =
      "background:#343a40; color:#fff; border:1px solid #000;";

    // --- BADGES LOGIC ---
    let badges = day.analysis.flags
      .map((f) => {
        if (f === "Nobleman")
          return `<span class="badge" style="background:#fff3cd; color:#856404; border:1px solid #ffeeba;">🌟 ${f} </span>`;
        if (f === "Travel")
          return `<span class="badge" style="background:#e2e3e5; color:#383d41;">🐴 ${f} </span>`;
        if (f === "Social")
          return `<span class="badge" style="color:#721c24;">🌸 ${f} </span>`;
        if (f === "Intellect")
          return `<span class="badge" style="background:#d1ecf1; color:#0c5460;">🎓 ${f} </span>`;

        if (f === "3-Harmony" || f === "6-Harmony")
          return `<span class="badge" style="background:#d4edda; color:#721c24;"> ${f} </span>`;

        // BAD STARS
        if (
          f === "5 Yellow" ||
          f === "Self Punishment" ||
          f === "San Sha" ||
          f === "Year Sha"
        )
          return `<span class="badge" style="background:#f8d7da; color:#721c24;"> ${f} </span>`;
        if (
          f === "PERSONAL BREAKER" ||
          f === "MONTH BREAKER" ||
          f === "YEAR BREAKER" ||
          f === "Luck Clash" ||
          f === "Goat Blade"
        )
          return `<span class="badge" style="${worseBadgesStyle}">🗡️ ${f} </span>`;

        // Hide "Bad Star" / "Good Star" from badges since we show them in the footer text now
        if (f === "Bad Star" || f === "Good Star") return "";
        return `<span class="badge"> ${f} </span>`;
      })
      .join("");

    if (tags.includes("WEALTH"))
      badges += `<span class="badge" style="background:#d4edda; color:#155724">💰</span>`;
    if (tags.includes("CAREER"))
      badges += `<span class="badge" style="background:#cce5ff; color:#004085">🚀</span>`;
    if (tags.includes("PEOPLE"))
      badges += `<span class="badge" style="background:#e0cffc; color:#5a32a3">🤝</span>`;
    if (tags.includes("HEALTH"))
      badges += `<span class="badge" style="background:#d1e7dd; color:#0f5132">🧘</span>`;

    const simpleStem = day.info.stem.split(" ")[0];
    const tenGods = day.tenGods || { stemGod: "?", branchGod: "?" };
    const stemBadge = tenGods.stemGod || "?";
    const branchBadge = tenGods.branchGod || "?";

    // --- ACTION MATCHES ---
    const actions = day.analysis.specificActions || [];
    let actionHtml = "";
    if (actions.length > 0) {
      actionHtml = `<div class="action-row">${actions[0].icon} ${actions[0].action}</div>`;
    }

    // --- YELLOW/BLACK BELT ---
    const yb = day.info.yellowBlackBelt;
    const ybClass = yb.type === "Yellow" ? "spirit-yellow" : "spirit-black";

    card.className = `day-card ${cssClass}`;
    card.innerHTML = `
            <div class="card-header">
                <span class="date-num">${day.day}</span>
                <span class="spirit-badge ${ybClass}" title="${yb.name}: ${yb.desc}">
                    ${yb.name}
                </span>
            </div>
            
            <div class="officer-row" style="text-align:center; margin-bottom:5px;">
                <span style="font-size:0.85rem; color:#555; font-weight:600; text-transform: uppercase;">${strongFoundation ? "️<span title='Strong Foundation'>🏛️</span>" : ""}${day.info.officer}</span>
                <span style="${typeStyle}">(${type})</span>
            </div>
            
            <div class="pillars-container" style="position:relative;" title="${pNote}">
                <div class="pillar-row">
                    <span class="pillar-txt">${simpleStem}</span>
                    <span class="god-badge" data-god="${stemBadge}">${stemBadge}</span>
                </div>
                
                <div style="text-align:center; margin:4px 0; line-height:1.2;">
                    <div style="font-size:0.9rem;">${pIcon}</div>
                    
                    <div style="font-size:0.65rem; font-weight:bold; color:${supportColor}; text-transform:uppercase; letter-spacing:0.5px;">
                        ${supportLabel}
                    </div>
                    <div style="font-size:0.6rem; color:#888;">
                        ${pScore}% Support
                    </div>
                </div>

                <div class="pillar-row">
                    <span class="pillar-txt">${day.info.dayBranch}</span>
                    <span class="god-badge" data-god="${branchBadge}">${branchBadge}</span>
                </div>
            </div>
            
            ${actionHtml}

            <div style="font-size:0.75rem; margin-top:5px; padding-top:5px; border-top:1px dashed #eee; display:flex; justify-content:space-between; align-items:center;">
                <span style="${nsStyle}" title="${ns}">
                    ${nsIcon} ${nsShort}
                </span>
                <span style="${starStyle}" title="${day.info.constellation}">
                    ${starIcon} ${day.info.constellation}
                </span>
            </div>

            <div class="footer-badges">${badges}</div>
        `;

    card.onclick = () => showDetails(day);
    grid.appendChild(card);
  });

  applyFilter();

  // Scroll to today
  if (isCurrentMonth) {
    requestAnimationFrame(() => {
      const todayEl = grid.querySelector('[data-today="true"]');
      if (todayEl) {
        todayEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    });
  }
}

// --- FILTERING ---
function setFilter(filterType, btn) {
  currentFilter = filterType;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => (b.className = "filter-btn"));
  if (filterType === "all") btn.classList.add("active");
  else if (filterType === "WEALTH") btn.classList.add("wealth-active");
  else if (filterType === "CAREER") btn.classList.add("career-active");
  else if (filterType === "PEOPLE") btn.classList.add("people-active");
  else if (filterType === "HEALTH") btn.classList.add("health-active");
  applyFilter();
}

function applyFilter() {
  const cards = document.querySelectorAll(".day-card");
  cards.forEach((card) => {
    const tags = card.dataset.tags ? card.dataset.tags.split(",") : [];
    if (currentFilter === "all") card.classList.remove("dimmed");
    else {
      tags.includes(currentFilter)
        ? card.classList.remove("dimmed")
        : card.classList.add("dimmed");
    }
  });
}

// --- LEGEND LOGIC ---
function showLegend() {
  const body = document.getElementById("legendBody");
  const userId = document.getElementById("userSelect").value;
  const user = allUsersData ? allUsersData.find((u) => u._id === userId) : null;

  // A. STATIC CONTENT (Colors, Symbols, 12 Officers)
  let html = `
        <div class="grid-dashboard">
            <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px;">
                <h5 style="margin:0 0 12px 0; font-weight:700; color:#333;">🎨 Verdict Colors</h5>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="l-badge lb-gold">Golden</span>
                        <span style="font-size:0.9rem;"><strong>Perfect Day.</strong> Rare luck.</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="l-badge lb-green">Excellent</span>
                        <span style="font-size:0.9rem;"><strong>High Luck.</strong> Action.</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="l-badge lb-blue">Good</span>
                        <span style="font-size:0.9rem;"><strong>Supportive.</strong> Safe.</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="l-badge lb-red">Danger</span>
                        <span style="font-size:0.9rem;"><strong>Clash.</strong> Avoid risks.</span>
                    </div>
                </div>
            </div>

            <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px;">
                <h5 style="margin:0 0 12px 0; font-weight:700; color:#333;">★ Map Symbols</h5>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="l-icon">✨</span>
                        <span style="font-size:0.9rem;"><strong>Noble:</strong> Help for YOUR chart.</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="l-icon">⛔</span>
                        <span style="font-size:0.9rem;"><strong>Clash:</strong> Harm to YOUR chart.</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="l-icon">🐉</span>
                        <span style="font-size:0.9rem;"><strong>Yellow Belt:</strong> Good Spirit.</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="l-icon">🐯</span>
                        <span style="font-size:0.9rem;"><strong>Black Belt:</strong> Bad Spirit.</span>
                    </div>
                </div>
            </div>
        </div>

        <h5 style="margin: 25px 0 15px 0; padding-bottom:10px; border-bottom:1px solid #eee; color:#333; font-weight:bold;">
            📜 12 Day Officers Guide
        </h5>
        
        <div class="grid-dashboard">
            <div class="officer-card">
                <div class="officer-title" style="color:#155724;">💰 Wealth & Business</div>
                <div class="officer-list">
                    <div><strong>Success:</strong> Most auspicious. Investing.</div>
                    <div><strong>Open:</strong> Grand openings, new deals.</div>
                    <div><strong>Full:</strong> Signing contracts, abundance.</div>
                    <div><strong>Receive:</strong> Collecting debts, banking.</div>
                </div>
            </div>
            <div class="officer-card">
                <div class="officer-title" style="color:#004085;">🚀 Career & Strategy</div>
                <div class="officer-list">
                    <div><strong>Establish:</strong> Starting new jobs/roles.</div>
                    <div><strong>Initiate:</strong> Negotiations, groundwork.</div>
                    <div><strong>Jade Hall:</strong> Career status.</div>
                    <div><strong>Travel:</strong> Business trips, moving.</div>
                </div>
            </div>
            <div class="officer-card">
                <div class="officer-title" style="color:#0f5132;">🧘 Health & Medical</div>
                <div class="officer-list">
                    <div><strong>Remove:</strong> Detox, surgery, cleansing.</div>
                    <div><strong>Destruction:</strong> Removing tumors/illness.</div>
                    <div><strong>Balance:</strong> Chiropractic, therapy.</div>
                    <div><strong>Stable:</strong> Long-term medication.</div>
                </div>
            </div>
            <div class="officer-card">
                <div class="officer-title" style="color:#6610f2;">🤝 People & Relationships</div>
                <div class="officer-list">
                    <div><strong>Balance:</strong> Marriage, equality.</div>
                    <div><strong>Full:</strong> Parties, gatherings.</div>
                    <div><strong>Harmony:</strong> Bonding, connection.</div>
                    <div><strong>Peach Blossom:</strong> Romance, likability.</div>
                </div>
            </div>
        </div>
    `;

  // B. DYNAMIC USER RULES
  // This section changes based on who is selected in the dropdown
  if (user && user.rules) {
    html += `
            <h5 style="margin: 25px 0 15px 0; padding-bottom:10px; border-bottom:1px solid #eee; color:#333; font-weight:bold;">
                🎯 ${user.name}'s Specific Rules
            </h5>
            <div class="grid-dashboard">`;

    html += CLIENT_RULES.map((rule) => {
      // 1. Find User's Element for this Rule
      let elements = [];
      if (rule.type === "wealth") elements = user.rules.wealthElements || [];
      else if (rule.type === "career")
        elements = user.rules.careerElements || [];
      else if (rule.type === "health")
        elements = user.rules.healthElements || [];

      const elString = elements.length > 0 ? elements.join(", ") : "None";

      // 2. Render Card (Exact style you requested)
      return `
                <div style="background:#fff; border:1px solid #dee2e6; border-left:4px solid #0d6efd; padding:12px; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                    <div style="font-weight:bold; color:#0d6efd; font-size:1rem; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                        ${rule.icon} ${rule.action}
                    </div>
                    <div style="font-size:0.85rem; color:#444; margin-bottom:4px;">
                        "${rule.desc}"
                    </div>
                    <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">
                        <span style="font-size:0.75rem; color:#555; background:#f1f3f5; padding:2px 8px; border-radius:4px; border:1px solid #e9ecef;">
                            Requires: <strong>${rule.officers.join(", ")}</strong>
                        </span>
                        <span style="font-size:0.75rem; color:#0f5132; background:#d1e7dd; padding:2px 8px; border-radius:4px; border:1px solid #badbcc;">
                            Your Element: <strong>${elString}</strong>
                        </span>
                    </div>
                </div>
            `;
    }).join("");

    html += `</div>`;
  }

  body.innerHTML = html;
  openModalById("legendModal");
}

// --- DETAILS MODAL ---
function showDetails(day) {
  // 1. Target DETAILS Modal Elements
  const titleEl = document.getElementById("detailsTitle");
  const bodyEl = document.getElementById("detailsBody");

  // 2. Set Title
  titleEl.innerText = `${day.fullDate} (${day.analysis.verdict})`;

  // 3. Prepare Data
  const tenGods = day.tenGods || {};
  const badHours = day.analysis.badHours || [];
  const goodHours = day.analysis.goodHours || [];
  const yb = day.info.yellowBlackBelt;
  const starDesc = day.info.constellationDesc || "No specific data.";
  const nineStarDesc = day.info.nineStarDesc || "No specific data.";

  // --- SAFETY FILTER ---
  const officerName = (day.info.officer || "General").trim();
  const rec = day.analysis.officerRec || {
    action: "Proceed",
    icon: "⚠️",
    desc: "Caution",
    reality: "Unstable",
  };

  // Robust Score Check
  const rawScore =
    day.score !== undefined ? day.score : day.analysis?.score || 0;
  const score = Number(rawScore);
  const pScore = day.analysis.pillarScore || 0;

  // 🔴 CHECK FOR FATAL LOGS
  const logs = day.analysis.log || [];
  const fatalLog = logs.find(
    (l) => l.includes("💀") || l.includes("PERSONAL BREAKER"),
  );

  let recHtml = "";

  // 1. PRIORITY: FATAL BANNER
  if (fatalLog) {
    recHtml = `
            <div style="background:#f8d7da; color:#721c24; border:1px solid #f5c6cb; padding:15px; border-radius:8px; margin-bottom:20px; text-align:center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="font-size:2rem; margin-bottom:10px;">💀</div>
                <h3 style="margin:0 0 10px 0; font-size:1.2rem; font-weight:800; text-transform:uppercase;">FATAL CLASH DETECTED</h3>
                <p style="margin:0; font-weight:bold; font-size:1rem;">${fatalLog}</p>
                <div style="margin-top:10px; font-size:0.9rem; background:rgba(255,255,255,0.5); padding:5px; border-radius:4px;">
                    ⛔ Do not schedule important activities on this day.
                </div>
            </div>
        `;
  }
  // 2. DANGER MODE (Low Score but not fatal)
  else if (score < 50 || pScore < 30) {
    recHtml = `
            <div style="background:#fff5f5; border-left:4px solid #dc3545; padding:15px; border-radius:6px; margin-bottom:20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="font-size:0.75rem; color:#dc3545; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">
                        ⚠️ WARNING: UNSTABLE DAY
                    </div>
                    <div style="font-size:0.7rem; background:#dc3545; color:white; padding:2px 8px; border-radius:10px; font-weight:bold;">
                        Support: ${pScore}%
                    </div>
                </div>
                <div style="display:flex; align-items:flex-start; gap:12px;">
                    <div style="font-size:1.8rem; line-height:1;">🛑</div>
                    <div>
                        <div style="font-weight:700; color:#8e2020; font-size:1rem; margin-bottom:4px;">
                            Do Not "${rec.action}"
                        </div>
                        <div style="font-size:0.9rem; color:#a71d2a; line-height:1.4;">
                            While "${officerName}" days are usually for <strong>${rec.desc}</strong>, this specific day lacks support.
                        </div>
                        <div style="margin-top:8px; font-size:0.85rem; font-style:italic; color:#c53030;">
                            <strong>Reality Check:</strong> ${rec.reality}
                        </div>
                    </div>
                </div>
            </div>`;
  }
  // 3. SAFE MODE
  else {
    recHtml = `
            <div style="background:#f0fff4; border-left:4px solid #198754; padding:15px; border-radius:6px; margin-bottom:20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="font-size:0.75rem; color:#198754; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
                    🎯 Recommended Action
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size:1.8rem;">${rec.icon}</div>
                    <div>
                        <div style="font-weight:700; color:#2c3e50; font-size:1rem;">${rec.action}</div>
                        <div style="font-size:0.9rem; color:#555;">${rec.desc}</div>
                    </div>
                </div>
            </div>`;
  }

  // --- ARCHETYPE CARD ---
  const tenGod = day.analysis.tenGodName || "Day Energy";
  const guideTitle = day.analysis.actionTitle || "The Guide";
  const guideTagline = day.analysis.actionTagline || "";
  const goodList = day.analysis.suitableActions || [];
  const cautionText = day.analysis.cautionAction || "";
  const rawKeywords = day.analysis.actionKeywords || "";

  const bestHtml = goodList
    .map((item) => `<li style="margin-bottom:6px;">✅ ${item}</li>`)
    .join("");

  const keywordHtml = rawKeywords
    .split(",")
    .map((k) => {
      const cleanK = k.trim();
      return cleanK
        ? `<span style="display:inline-block; background:#f8f9fa; border:1px solid #e9ecef; color:#666; padding:2px 10px; border-radius:12px; font-size:0.75rem; margin-right:4px;">#${cleanK}</span>`
        : "";
    })
    .join("");

  const officersAdvice = `
        <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; margin-top:20px; margin-bottom:20px;">
            <div style="background: linear-gradient(to right, #f8f9fa, #ffffff); padding: 15px 20px; border-bottom: 1px solid #eee; display:flex; align-items:center; justify-content:space-between;">
                <div>
                    <div style="font-size:0.75rem; text-transform:uppercase; color:#888; font-weight:600;">Archetype</div>
                    <div style="font-size:1.25rem; font-weight:700; color:#333;">${tenGod}</div>
                    <div style="font-size:0.9rem; color:#666; font-style:italic;">"${guideTitle}"</div>
                </div>
                <div style="background:#e3f2fd; color:#0d6efd; width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">⚡</div>
            </div>
            <div style="padding: 20px;">
                <div style="margin-bottom:15px; font-size:0.95rem; color:#555; border-left:3px solid #0d6efd; padding-left:12px; font-style:italic;">${guideTagline}</div>
                <ul style="list-style:none; padding:0; margin-bottom:15px; font-size:0.9rem;">${bestHtml}</ul>
                <div style="background: #fff5f5; border: 1px solid #feb2b2; border-left: 4px solid #e53e3e; border-radius: 6px; padding: 10px;">
                    <div style="font-weight:700; color:#c53030; font-size:0.8rem; text-transform:uppercase;">⚠️ Caution</div>
                    <div style="font-size:0.9rem; color:#9b2c2c;">${cautionText}</div>
                </div>
                <div style="margin-top:15px;">${keywordHtml}</div>
            </div>
        </div>
    `;

  // --- ANALYSIS LOGIC (Pros/Cons) ---
  const pros = [];
  const cons = [];
  const neutrals = [];

  logs.forEach((msg) => {
    if (
      msg.includes("Avoid") ||
      msg.includes("Conflict") ||
      msg.includes("Killings") ||
      msg.includes("Clash") ||
      msg.includes("Risk")
    ) {
      cons.push(msg);
    } else if (
      msg.includes("Lucky") ||
      msg.includes("Great") ||
      msg.includes("Boost") ||
      msg.includes("Noble")
    ) {
      pros.push(msg);
    } else {
      neutrals.push(msg);
    }
  });

  const renderList = (items, colorClass) => {
    if (items.length === 0)
      return `<div style="font-size:0.85rem; color:#aaa; font-style:italic;">None</div>`;
    return items
      .map(
        (text) =>
          `<div style="display:flex; align-items:start; margin-bottom:8px; font-size:0.9rem;">
                <span class="${colorClass}">${text}</span>
            </div>`,
      )
      .join("");
  };

  const analysisGrid = `
        <div style="margin-top:25px;">
            <h5 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; font-weight:700;">📊 Personal Analysis</h5>
            <div class="grid-dashboard">
                <div style="background: #f0fff4; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#155724; margin-bottom:12px; font-size:0.8rem;">✨ BOOSTS & LUCK</div>
                    ${renderList(pros, "text-success")}
                </div>
                <div style="background: #fff5f5; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#721c24; margin-bottom:12px; font-size:0.8rem;">⚠️ RISKS & CLASHES</div>
                    ${renderList(cons, "text-danger")}
                </div>
            </div>
                
                ${
                  neutrals.length > 0
                    ? `
                <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin-top: 10px;">
                    <div style="font-weight:bold; color:#6c757d; margin-bottom:12px; font-size:0.8rem;">ℹ️ GENERAL CONTEXT</div>
                    ${renderList(neutrals, "text-muted")}
                </div>
                `
                    : ""
                }
        </div>
    `;

  // --- HOURLY GRID ---
  const formatHourLine = (line, type) => {
    const icon = type === "good" ? "🌟" : "🚫";
    return `<li style="display:flex; align-items:start; margin-bottom:6px; font-size:0.9rem;"><span style="margin-right:8px;">${icon}</span><span style="color:#444;">${line}</span></li>`;
  };

  const hourlyGrid = `
        <div style="margin-top:20px;">
            <h5 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; font-weight:700;">⏰ Hourly Timing</h5>
            <div class="grid-dashboard">
                <div style="background: linear-gradient(to bottom right, #fff, #f0fff4); border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#155724; margin-bottom:10px; font-size:0.9rem;">🌅 Golden Hours</div>
                    ${goodHours.length > 0 ? `<ul style="list-style:none; padding:0; margin:0;">${goodHours.map((h) => formatHourLine(h, "good")).join("")}</ul>` : `<div style="font-size:0.85rem; color:#888;">No specific auspicious hours.</div>`}
                </div>
                <div style="background: linear-gradient(to bottom right, #fff, #fff5f5); border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#721c24; margin-bottom:10px; font-size:0.9rem;">⚠️ Bad Hours</div>
                    ${badHours.length > 0 ? `<ul style="list-style:none; padding:0; margin:0;">${badHours.map((h) => formatHourLine(h, "bad")).join("")}</ul>` : `<div style="font-size:0.85rem; color:#888;">No major clashes.</div>`}
                </div>
            </div>
        </div>
    `;

  // 4. Inject & Open
  bodyEl.innerHTML = `
        ${recHtml}
        <div style="padding:0 10px; margin-bottom:15px; display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.9rem;">
            <div>
                <strong>Stem:</strong> ${day.info.stem} (${tenGods.stemGod})<br>
                <strong>Branch:</strong> ${day.info.dayBranch} (${tenGods.branchGod})
            </div>
            <div>
                <strong>Officer:</strong> ${day.info.officer}<br>
                <strong>Element:</strong> ${day.info.element}
            </div>
        </div>
        ${officersAdvice}
        ${analysisGrid}
        <div style="background:#fff3cd; margin-top:15px; padding:12px; border-radius:8px; border:1px solid #ffeeba;">
            <h4 style="margin:0 0 10px 0; color:#856404; font-size:1rem;">🔮 Energy Deep Dive</h4>
            <div style="margin-bottom:10px;">
                <div style="font-weight:bold; color:#555;">${yb.icon} ${yb.name} Spirit</div>
                <div style="font-size:0.9rem; color:#666; font-style:italic;">"${yb.desc}"</div>
            </div>
            <div>
                <div style="font-weight:bold; color:#555;">★ ${day.info.constellation} Star</div>
                <div style="font-size:0.9rem; color:#666; font-style:italic;">"${starDesc}"</div>
            </div>
        </div>
        ${hourlyGrid}
    `;

  openModalById("detailsModal");
}

// --- TEAM SYNERGY LOGIC ---

// 1. Render Checkboxes (Call this in your initial fetch("/api/users") block)
function renderTeamCheckboxes(users) {
  const container = document.getElementById("teamCheckboxes");
  if (!container) return;

  container.innerHTML = users
    .map(
      (u) => `
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; background:#f8f9fa; padding:8px; border-radius:6px; border:1px solid #dee2e6;">
            <input type="checkbox" value="${u._id}" class="team-cb">
            <span style="font-size:0.9rem;">${u.name}</span>
        </label>
    `,
    )
    .join("");
}

// 2. Calculate Synergy
async function calculateTeamSynergy() {
  // Get Selected IDs
  const checkboxes = document.querySelectorAll(".team-cb:checked");
  const userIds = Array.from(checkboxes).map((cb) => cb.value);

  if (userIds.length < 2) {
    alert("Please select at least 2 team members.");
    return;
  }

  const btn = document.querySelector(
    "button[onclick='calculateTeamSynergy()']",
  );
  const originalText = btn.innerText;
  btn.innerText = "Calculating...";
  btn.disabled = true;

  try {
    const year = document.getElementById("yearInput").value;
    const month = document.getElementById("monthSelect").value;

    const res = await fetch("/api/team-synergy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds, year, month }),
    });

    const data = await res.json();
    renderTeamResults(data);
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
}

// 3. Render Results Cards
function renderTeamResults(results) {
  const container = document.getElementById("teamResults");

  if (results.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:#666;">No conflict-free dates found for this combination. 📉</div>`;
    return;
  }

  container.innerHTML = results
    .slice(0, 8)
    .map((r) => {
      // Show top 8
      const avg = r.teamMetrics.avgScore;
      // Visual Logic
      let borderClass =
        avg >= 80
          ? "border-left:5px solid #28a745"
          : "border-left:5px solid #0d6efd";

      return `
        <div onclick='openTeamModal(${JSON.stringify(r)})' style="background:#fff; border:1px solid #e0e0e0; ${borderClass}; border-radius:8px; padding:15px; cursor:pointer; transition:transform 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.05);" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px;">
                <div>
                    <div style="font-weight:bold; font-size:1.1rem; color:#333;">${r.dateStr}</div>
                    <div style="font-size:0.85rem; color:#666;">${r.dayInfo.officer} • ${r.dayInfo.constellation}</div>
                </div>
                <div style="text-align:right;">
                    <div style="background:#e8f4fd; color:#0d6efd; font-weight:bold; padding:4px 8px; border-radius:6px; font-size:0.9rem;">
                        ${avg}% Avg
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:4px; margin-top:10px;">
                ${r.userBreakdown
                  .map(
                    (u) => `
                    <div title="${u.name}: ${u.score}" style="flex:1; height:4px; background:${getColorForScore(u.score)}; border-radius:2px;"></div>
                `,
                  )
                  .join("")}
            </div>
            <div style="margin-top:5px; font-size:0.75rem; color:#888; text-align:center;">
                Lowest Score: <strong>${r.teamMetrics.minScore}</strong>
            </div>
        </div>
        `;
    })
    .join("");
}

// 4. Team Modal (The "Click" Action)
function openTeamModal(dayData) {
  // 1. Target the Shared Modal Elements (Same as Calendar Grid)
  const titleEl = document.getElementById("detailsTitle");
  const bodyEl = document.getElementById("detailsBody");

  // 2. Set Title
  titleEl.innerText = `${dayData.fullDate} (Team View)`;

  // 3. Sort Users (Best Scores First)
  const sortedUsers = dayData.userBreakdown.sort((a, b) => b.score - a.score);

  // 4. Extract Header Data
  const yb = dayData.dayInfo.yellowBlackBelt || {
    name: "?",
    desc: "",
    type: "Black",
  };
  const ybClass = yb.type === "Yellow" ? "spirit-yellow" : "spirit-black";
  const ns = dayData.dayInfo.nineStar || "";

  // 5. Build HTML (Reusing Calendar Grid Styles)
  bodyEl.innerHTML = `
        <div style="padding:0 10px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:15px;">
             <div>
                <div style="display:flex; gap:6px; margin-bottom:5px;">
                    <span class="spirit-badge ${ybClass}" title="${yb.name}: ${yb.desc}">${yb.name}</span>
                    <span style="font-size:0.75rem; background:#f1f3f5; padding:2px 6px; border-radius:4px; color:#555;">${ns.split(" ")[0]} Star</span>
                </div>
                <div style="font-size:1.2rem; font-weight:bold; color:#333;">${dayData.dayInfo.officer} Day</div>
                <div style="color:#666; font-size:0.9rem;">${dayData.dayInfo.constellation} Star • ${dayData.dayInfo.element} Element</div>
             </div>
             <div style="text-align:right;">
                <div style="font-size:0.8rem; text-transform:uppercase; color:#888; font-weight:600;">Team Score</div>
                <div style="font-size:1.8rem; font-weight:800; color:#0d6efd;">${dayData.teamMetrics.avgScore}</div>
             </div>
        </div>

        <h5 style="color:#333; font-weight:700; margin-bottom:15px;">👥 Team Impact Breakdown</h5>
        <div class="grid-dashboard">
            ${sortedUsers
              .map((u) => {
                const color = getColorForScore(u.score);
                const isBad = u.score < 50;
                // Add note if available (e.g. "Nobleman")
                const noteHtml =
                  u.notes.length > 0
                    ? `<div style="font-size:0.75rem; color:#666; margin-top:2px;">✨ ${u.notes[0]}</div>`
                    : "";

                return `
                <div style="background:${isBad ? "#fff5f5" : "#fff"}; border:1px solid ${isBad ? "#f5c6cb" : "#e9ecef"}; border-left:4px solid ${color}; border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:bold; color:#333;">${u.name}</div>
                        <div style="font-size:0.8rem; color:${color}; font-weight:600;">${u.verdict}</div>
                        ${noteHtml}
                    </div>
                    <div style="font-size:1.2rem; font-weight:bold; color:${color};">
                        ${u.score}
                    </div>
                </div>`;
              })
              .join("")}
        </div>

        <div style="background:#e8f4fd; margin-top:20px; padding:15px; border-radius:8px; border:1px solid #b8daff; font-size:0.9rem; color:#004085; display:flex; gap:10px;">
            <div style="font-size:1.2rem;">💡</div>
            <div>
                <strong>Strategy:</strong> 
                This date avoids "Personal Breakers" for everyone. 
                The lowest individual score is <strong>${dayData.teamMetrics.minScore}</strong>, making it safe for group activities.
            </div>
        </div>
    `;

  // 6. Open the Shared Modal
  openModalById("detailsModal");
}

// --- MOMENTUM LOGIC ---

async function findMomentum() {
  const userId = document.getElementById("userSelect").value;
  const duration = document.getElementById("momentumDuration").value;
  const btn = document.querySelector("button[onclick='findMomentum()']");

  if (!userId) return;

  btn.innerText = "Scanning...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/momentum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, duration }),
    });

    const data = await res.json();
    renderMomentumResults(data);
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    btn.innerText = "Find Streaks";
    btn.disabled = false;
  }
}

function renderMomentumResults(data) {
  const container = document.getElementById("momentumResults");

  if (data.chains.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:#666;">No strong streaks found.</div>`;
    return;
  }

  let lastMonth = "";
  let html = "";

  data.chains.forEach((chain) => {
    const d = new Date(chain.days[0].date);
    const currentMonth = d.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Month Header
    if (currentMonth !== lastMonth) {
      html += `<h4 style="margin: 25px 0 10px 0; color:#0d6efd; border-bottom:2px solid #e0e0e0; padding-bottom:5px;">${currentMonth}</h4>`;
      lastMonth = currentMonth;
    }

    // UI Configuration for Momentum Themes
    const MOMENTUM_THEMES = {
      LAUNCH: {
        label: "Launch Sequence",
        icon: "🚀",
        color: "#0d6efd", // Blue
        desc: "Best for starting new projects.",
      },
      HARVEST: {
        label: "Harvest Sequence",
        icon: "💰",
        color: "#198754", // Green
        desc: "Best for sales and collection.",
      },
      FOUNDATION: {
        label: "Foundation Sequence",
        icon: "🧱",
        color: "#6610f2", // Purple
        desc: "Best for planning and internal work.",
      },
      CLEANSING: {
        label: "Cleansing Sequence",
        icon: "🧹",
        color: "#dc3545", // Red
        desc: "Best for removal and detox.",
      },
    };

    // 🎨 GET UI DETAILS FROM CONFIG
    // Fallback to GENERAL if key not found
    const ui = MOMENTUM_THEMES[chain.theme] || MOMENTUM_THEMES["GENERAL"];

    html += `
        <div style="background:#fff; border:1px solid #e0e0e0; border-left: 5px solid ${ui.color}; border-radius:12px; padding:20px; margin-bottom:15px; box-shadow:0 4px 6px rgba(0,0,0,0.02);">
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
                <div>
                    <h5 style="margin:0; color:#333; font-size:1.1rem;">${ui.icon} ${ui.label}</h5>
                    <span style="font-size:0.85rem; color:#666;">Starts ${chain.startDate}</span>
                </div>
                <div style="background:${ui.color}20; color:${ui.color}; font-weight:bold; padding:5px 10px; border-radius:20px;">
                    ${chain.avgScore}% Power
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:0;">
                ${chain.days
                  .map((day, index) => {
                    const isLast = index === chain.days.length - 1;
                    const color = getColorForScore(day.score);

                    return `
                    <div style="display:flex; gap:15px;">
                        <div style="display:flex; flex-direction:column; align-items:center; width:20px;">
                            <div style="width:12px; height:12px; background:${color}; border-radius:50%; margin-top:6px;"></div>
                            ${!isLast ? `<div style="width:2px; flex:1; background:#e0e0e0; min-height:30px;"></div>` : ``}
                        </div>
                        <div style="padding-bottom:15px; flex:1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <strong style="color:#333;">${day.fullDate}</strong>
                                <span style="font-weight:bold; color:${color};">${day.score}</span>
                            </div>
                            <div style="font-size:0.9rem; color:#555;">
                                ${day.dayInfo.officer} Officer • ${day.dayInfo.element}
                            </div>
                        </div>
                    </div>
                    `;
                  })
                  .join("")}
            </div>
        </div>
        `;
  });

  container.innerHTML = html;
}

// --- UTILS & CLOSERS ---

function loadingOverlay(display) {
  const overlay = document.getElementById("loadingOverlay");

  // 1. Show Loading
  if (overlay) {
    overlay.style.display = display;
    // Optional: Add a slight fade-in transition logic here if desired
  }
}

// Open Modal Helper (Handles Animation)
function openModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "flex";

  // Small delay to allow CSS to catch the display change before animating
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

// Close Modal Helper
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("show");

  // Wait for animation to finish before hiding
  setTimeout(() => {
    modal.style.display = "none";
  }, 200);
}

function getColorForScore(score) {
  if (score >= 80) return "#28a745"; // Green
  if (score >= 60) return "#0d6efd"; // Blue
  if (score >= 40) return "#fd7e14"; // Orange
  return "#dc3545"; // Red
}

function getColorBg(cssClass) {
  if (cssClass === "golden") return "#ffc107";
  if (cssClass === "excellent") return "#28a745";
  if (cssClass === "good") return "#aedae1";
  return "#6c757d";
}

window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target.id);
  }
};
