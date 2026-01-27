// --- STATE MANAGEMENT ---
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth() + 1;
let currentFilter = "all";
let allUsersData = [];

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

// --- GOAL SEEKER LOGIC (NEW) ---
function handleUserChange() {
  loadCalendar(); // Reload grid for new user
  populateGoalSelect(); // Reload specific goals for new user
}

function populateGoalSelect() {
  const userId = document.getElementById("userSelect").value;
  const user = allUsersData.find((u) => u._id === userId);
  const goalSelect = document.getElementById("goalSelect");

  goalSelect.innerHTML = '<option value="">Select a Goal...</option>';

  if (user && user.actionRules) {
    user.actionRules.forEach((rule) => {
      const opt = document.createElement("option");
      opt.value = rule.action;
      opt.innerText = `${rule.icon} ${rule.action}`;
      goalSelect.appendChild(opt);
    });
  }
}

async function findDates() {
  const userId = document.getElementById("userSelect").value;
  const action = document.getElementById("goalSelect").value;

  if (!action) return alert("Please select a goal first!");

  const btn = document.querySelector('button[onclick="findDates()"]');
  const originalText = btn.innerText;
  btn.innerText = "Scanning...";

  try {
    // FIX: Pass currentYear and currentMonth to the API
    const query = `userId=${userId}&action=${encodeURIComponent(action)}&year=${currentYear}&month=${currentMonth}`;

    const res = await fetch(`/api/find-dates?${query}`);
    const results = await res.json();
    renderSearchResults(results, action);
  } catch (e) {
    alert("Error finding dates. Ensure server is running.");
  } finally {
    btn.innerText = originalText;
  }
}

function renderSearchResults(results, action) {
  const container = document.getElementById("searchResults");
  const modal = document.getElementById("searchModal");

  document.getElementById("searchTitle").innerText =
    `🎯 Best Dates for: ${action}`;

  if (results.length === 0) {
    container.innerHTML = `<p style="color:#666; text-align:center;">No perfect matches found in the next 90 days.<br>Try checking the User Rules to ensure this action is possible.</p>`;
  } else {
    container.innerHTML = results
      .map(
        (r) => `
            <div style="border:1px solid #eee; padding:15px; border-radius:8px; border-left:5px solid ${getColorBg(r.cssClass)}; background:#fcfcfc;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <strong style="font-size:1.1rem; color:#333;">${r.fullDate}</strong>
                    <span class="badge ${r.cssClass}" style="font-size:0.85rem;">${r.verdict} (${r.score}pts)</span>
                </div>
                
                <div style="font-size:0.9rem; color:#555; margin-bottom:8px;">
                     Officer: <strong>${r.dayInfo.officer}</strong> • Star: <strong>${r.dayInfo.constellation}</strong>
                </div>

                <div style="background:#e8f4fd; color:#004085; padding:8px; border-radius:4px; font-size:0.9rem; border:1px solid #b8daff;">
                    ${r.matchDetails.icon} <strong>Strategy:</strong> ${r.matchDetails.desc}
                </div>

                <div style="margin-top:8px; font-size:0.85rem; color:#155724; background:#d4edda; padding:5px; border-radius:4px; display:inline-block;">
                    <strong>🕒 Best Hours:</strong><br> ${r.goodHours.length ? r.goodHours[0] : "Any auspicious hour"}
                </div>
            </div>
        `,
      )
      .join("");
  }

  modal.style.display = "flex";
}

// --- CALENDAR LOGIC ---
async function loadCalendar() {
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

    // 1. TRANSLATE SCORE TO SIMPLE ENGLISH
    let supportLabel = "Unsupported";
    let supportColor = "#dc3545"; // Red

    if (pScore >= 85) {
      supportLabel = "Very Strong";
      supportColor = "#198754"; // Dark Green
    } else if (pScore >= 60) {
      supportLabel = "Supported";
      supportColor = "#0d6efd"; // Blue
    } else if (pScore >= 40) {
      supportLabel = "Weak";
      supportColor = "#fd7e14"; // Orange
    }

    // --- CONSTELLATION VISUAL LOGIC ---
    const flags = day.analysis.flags;

    let starIcon = "★";
    // Default: Grey
    let starStyle = "color:#999; font-size: 0.75rem;";

    // 1. Personal Clash (Bold Red)
    if (flags.includes("Bad Star")) {
      starIcon = "⛔";
      starStyle = "color:#dc3545; font-weight:800; font-size: 0.8rem;";
    }
    // 2. Personal Noble (Bold Green)
    else if (flags.includes("Good Star")) {
      starIcon = "✨";
      starStyle = "color:#28a745; font-weight:800; font-size: 0.8rem;";
    }
    // 3. Global Bad (Normal Red) - Check Log text
    else if (day.analysis.log.some((l) => l.includes("Gloomy Star"))) {
      starIcon = "☁️";
      starStyle = "color:#dc3545; font-weight:400; font-size: 0.75rem;";
    }
    // 4. Global Good (Normal Green) - Check Log text
    else if (day.analysis.log.some((l) => l.includes("Lucky Star"))) {
      starIcon = "🌟";
      starStyle = "color:#28a745; font-weight:400; font-size: 0.75rem;";
    }

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

    // --- BADGES LOGIC ---
    let badges = day.analysis.flags
      .map((f) => {
        if (f === "Nobleman")
          return `<span class="badge" style="background:#fff3cd; color:#856404; border:1px solid #ffeeba;">🌟 Noble</span>`;
        if (f === "Travel")
          return `<span class="badge" style="background:#e2e3e5; color:#383d41;">🐴 Travel</span>`;
        if (f === "Social")
          return `<span class="badge" style="background:#f8d7da; color:#721c24;">🌸 Social</span>`;
        if (f === "Intellect")
          return `<span class="badge" style="background:#d1ecf1; color:#0c5460;">🎓 Smart</span>`;
        if (f === "San Sha")
          return `<span class="badge" style="background:#343a40; color:#fff; border:1px solid #000;">🗡️ San Sha</span>`;
        if (f === "Year Sha")
          return `<span class="badge" style="background:#343a40; color:#fff; border:1px solid #000;">🗡️ Year Sha</span>`;
        if (f === "Goat Blade")
          return `<span class="badge" style="background:#343a40; color:#fff; border:1px solid #000;">🗡️ Goat Blade</span>`;
        // Hide "Bad Star" / "Good Star" from badges since we show them in the footer text now
        if (f === "Bad Star" || f === "Good Star") return "";
        return `<span class="badge">${f}</span>`;
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
                    ${yb.icon} ${yb.name}
                </span>
            </div>
            
            <div class="officer-row" style="text-align:center; margin-bottom:5px;">
                <span style="font-size:0.85rem; color:#555; font-weight:600; text-transform: uppercase;">${day.info.officer}</span>
                <span style="${typeStyle}">(${type})</span>
            </div>
            
            <div class="pillars-container" style="position:relative;">
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
  // 1. Get Data
  const userId = document.getElementById("userSelect").value;
  const user = allUsersData.find((u) => u._id === userId);

  // 2. Target LEGEND Modal Elements
  const body = document.getElementById("legendBody");
  // (Title is static in HTML, no need to set it via JS unless dynamic)

  // 3. Static Content
  const staticLegend = `
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

  // 4. Dynamic Content
  let dynamicLegend = `
        <h5 style="margin: 25px 0 15px 0; padding-bottom:10px; border-bottom:1px solid #eee; color:#333; font-weight:bold;">
            🎯 ${user ? user.name + "'s" : "User"} Specific Rules
        </h5>
    `;

  if (!user || !user.actionRules || user.actionRules.length === 0) {
    dynamicLegend += `
            <div style="background:#f8f9fa; padding:15px; border-radius:8px; text-align:center; color:#666; font-style:italic;">
                No custom action rules defined for this user.
            </div>`;
  } else {
    dynamicLegend +=
      `<div class="grid-dashboard">` +
      user.actionRules
        .map((rule) => {
          const officers = rule.officers.join(", ");
          return `
                <div style="background:#fff; border:1px solid #dee2e6; border-left:4px solid #0d6efd; padding:12px; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
                    <div style="font-weight:bold; color:#0d6efd; font-size:1rem; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                        ${rule.icon} ${rule.action}
                    </div>
                    <div style="font-size:0.85rem; color:#444; margin-bottom:4px;">
                        "${rule.description}"
                    </div>
                    <div style="font-size:0.75rem; color:#888; background:#f1f3f5; padding:2px 6px; border-radius:4px; display:inline-block;">
                        Requires: <strong>${officers}</strong>
                    </div>
                </div>
            `;
        })
        .join("") +
      `</div>`;
  }

  // 5. Inject & Open
  body.innerHTML = staticLegend + dynamicLegend;
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

  let recHtml = "";

  if (score < 50 || pScore < 30) {
    // DANGER MODE
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
  } else {
    // SAFE MODE
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
  const logs = day.analysis.log || [];
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

  const renderList = (items, icon, colorClass) => {
    if (items.length === 0)
      return `<div style="font-size:0.85rem; color:#aaa; font-style:italic;">None</div>`;
    return items
      .map(
        (text) =>
          `<div style="display:flex; align-items:start; margin-bottom:8px; font-size:0.9rem;"><span style="margin-right:8px;">${icon}</span><span class="${colorClass}">${text}</span></div>`,
      )
      .join("");
  };

  const analysisGrid = `
        <div style="margin-top:25px;">
            <h5 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; font-weight:700;">📊 Personal Analysis</h5>
            <div class="grid-dashboard">
                <div style="background: #f0fff4; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#155724; margin-bottom:12px; font-size:0.8rem;">✨ BOOSTS & LUCK</div>
                    ${renderList(pros, "🟢", "text-success")}
                </div>
                <div style="background: #fff5f5; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#721c24; margin-bottom:12px; font-size:0.8rem;">⚠️ RISKS & CLASHES</div>
                    ${renderList(cons, "🔻", "text-danger")}
                </div>
            </div>
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

// --- SYNERGY / TEAM MODE ---

function openSynergyModal() {
  const list = document.getElementById("synergyUserList");
  list.innerHTML = "";

  // Create a checkbox for every user
  allUsersData.forEach((user) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";
    div.innerHTML = `
            <input type="checkbox" id="syn_${user._id}" value="${user._id}" style="width:18px; height:18px;">
            <label for="syn_${user._id}" style="font-size:1rem; cursor:pointer;">${user.name}</label>
        `;
    list.appendChild(div);
  });

  document.getElementById("synergyModal").style.display = "flex";
}

async function calculateSynergy() {
  // 1. Get Selected IDs
  const checkboxes = document.querySelectorAll(
    "#synergyUserList input:checked",
  );
  const ids = Array.from(checkboxes).map((cb) => cb.value);

  if (ids.length < 2)
    return alert("Please select at least 2 people for a team analysis!");

  const btn = document.querySelector('button[onclick="calculateSynergy()"]');
  btn.innerText = "Analyzing...";

  try {
    // 2. Fetch API
    const res = await fetch(`/api/synergy?userIds=${ids.join(",")}&days=30`);
    const results = await res.json();

    // 3. Render
    renderSynergyResults(results);
    closeModal("synergyModal");
  } catch (e) {
    alert(
      "Synergy calculation failed. Ensure backend /api/synergy is implemented.",
    );
  } finally {
    btn.innerText = "Analyze Synergy 🚀";
  }
}

function renderSynergyResults(results) {
  const container = document.getElementById("synergyResultsList");
  const modal = document.getElementById("synergyResultsModal");

  if (results.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
  } else {
    container.innerHTML = results
      .map((r) => {
        const isConflict = r.groupVerdict === "CONFLICT";
        const cardClass = isConflict
          ? "synergy-card-danger"
          : "synergy-card-power";

        // Build the breakdown list
        const breakdownHtml = r.breakdown
          .map((person) => {
            let scoreColor = "score-neutral";
            if (person.verdict === "DANGEROUS") scoreColor = "score-bad";
            else if (person.score >= 80) scoreColor = "score-good";

            return `
                    <div class="team-member-row">
                        <span>👤 ${person.name}</span>
                        <span class="${scoreColor}">${person.verdict} (${person.score})</span>
                    </div>
                `;
          })
          .join("");

        return `
                <div style="padding:15px; border-radius:8px; margin-bottom:10px;" class="${cardClass}">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <strong style="font-size:1.1rem;">${r.fullDate}</strong>
                        <span class="badge ${r.cssClass}">${r.groupVerdict} (${r.groupScore}pts)</span>
                    </div>
                    
                    <div style="background:rgba(255,255,255,0.6); padding:10px; border-radius:5px;">
                        ${breakdownHtml}
                    </div>
                </div>
            `;
      })
      .join("");
  }

  modal.style.display = "flex";
}

// --- UTILS & CLOSERS ---

// Open Modal Helper (Handles Animation)
function openModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // 1. Set Display Flex
  modal.style.display = "flex";

  // 2. Small timeout to allow CSS transition to catch the display change
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
