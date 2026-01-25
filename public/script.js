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

  banner.className = analysis.cssClass;
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
  for (let i = 0; i < firstDayOfWeek; i++) {
    grid.innerHTML += "<div></div>";
  }

  days.forEach((day) => {
    const cssClass = day.analysis.cssClass || "neutral";
    const card = document.createElement("div");
    const tags = day.analysis.tags || [];
    card.dataset.tags = tags.join(",");

    // Footer Badges with Icons
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
        return `<span class="badge">${f}</span>`;
      })
      .join("");

    if (tags.includes("WEALTH"))
      badges += `<span class="badge" style="background:#d4edda; color:#155724">💰</span>`;
    if (tags.includes("CAREER"))
      badges += `<span class="badge" style="background:#cce5ff; color:#004085">🚀</span>`;
    if (tags.includes("PEOPLE"))
      badges += `<span class="badge" style="background:#e0cffc; color:#5a32a3">🤝</span>`;

    const simpleStem = day.info.stem.split(" ")[0];
    const tenGods = day.tenGods || { stemGod: "?", branchGod: "?" };
    const stemBadge = tenGods.stemGod || "?";
    const branchBadge = tenGods.branchGod || "?";

    // ACTION MATCHES (Only show first one in grid)
    const actions = day.analysis.specificActions || [];
    let actionHtml = "";
    if (actions.length > 0) {
      actionHtml = `<div class="action-row">${actions[0].icon} ${actions[0].action}</div>`;
    }

    card.className = `day-card ${cssClass}`;
    card.innerHTML = `
            <div class="card-header">
                <span class="date-num">${day.day}</span>
                <span class="officer">${day.info.officer}</span>
            </div>
            
            <div class="pillars-container">
                <div class="pillar-row">
                    <span class="pillar-txt">${simpleStem}</span>
                    <span class="god-badge" data-god="${stemBadge}">${stemBadge}</span>
                </div>
                <div class="pillar-row">
                    <span class="pillar-txt">${day.info.branch}</span>
                    <span class="god-badge" data-god="${branchBadge}">${branchBadge}</span>
                </div>
            </div>
            
            ${actionHtml}

            <div class="star">★ ${day.info.constellation}</div>
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
  const userId = document.getElementById("userSelect").value;
  const user = allUsersData.find((u) => u._id === userId);

  if (!user || !user.actionRules || user.actionRules.length === 0) {
    document.getElementById("legendBody").innerHTML =
      "<p>No specific action rules found for this user.</p>";
  } else {
    let html = "";
    user.actionRules.forEach((rule) => {
      const officers = rule.officers.join(" / ");
      const elements = rule.elements.join(" / ");
      html += `
                <div style="border:1px solid #eee; padding:10px; border-radius:6px; background:#fcfcfc;">
                    <div style="font-weight:bold; color:#0056b3; margin-bottom:4px;">${rule.icon} ${rule.action}</div>
                    <div style="font-size:0.85rem; color:#555;">
                        Requires: <strong>${officers}</strong> + <strong>${elements}</strong>
                    </div>
                    <div style="font-size:0.8rem; font-style:italic; color:#777; margin-top:4px;">"${rule.description}"</div>
                </div>
            `;
    });
    document.getElementById("legendBody").innerHTML = html;
  }
  document.getElementById("legendModal").style.display = "flex";
}

// --- DETAILS MODAL ---
function showDetails(day) {
  const modal = document.getElementById("modal");
  const tenGods = day.tenGods || {};
  const actions = day.analysis.specificActions || [];
  const badHours = day.analysis.badHours || [];
  const goodHours = day.analysis.goodHours || [];

  document.getElementById("modalDate").innerText =
    `${day.fullDate} (${day.analysis.verdict})`;

  let logHtml = day.analysis.log.map((l) => `<li>${l}</li>`).join("");

  let actionDetails = "";
  if (actions.length > 0) {
    actionDetails = `<div style="background:#e8f4fd; padding:10px; border-radius:5px; margin-bottom:15px; border-left: 4px solid #007bff;">
            <strong>🎯 Recommended Action:</strong><br>
            ${actions.map((a) => `<span>${a.icon} <strong>${a.action}:</strong> ${a.desc}</span>`).join("<br>")}
        </div>`;
  }

  let badHoursHtml = "";
  if (badHours.length > 0) {
    badHoursHtml = `<div style="margin-top:10px; padding:8px; background:#fff5f5; border:1px solid #f5c6cb; border-radius:4px; color:#721c24;">
            <strong>⚠️ Bad Hours (Avoid):</strong><br>
            ${badHours.join("<br>")}
        </div>`;
  }

  let goodHoursHtml = "";
  if (goodHours.length > 0) {
    goodHoursHtml = `<div style="margin-top:10px; padding:8px; background:#d4edda; border:1px solid #c3e6cb; border-radius:4px; color:#155724;">
            <strong>🌟 Golden Hours (Act Now):</strong><br>
            ${goodHours.join("<br>")}
        </div>`;
  }

  document.getElementById("modalBody").innerHTML = `
        ${actionDetails}
        <div style="background:#f8f9fa; padding:10px; border-radius:5px; margin-bottom:15px;">
            <strong>Stem:</strong> ${day.info.stem} (${tenGods.stemGod})<br>
            <strong>Branch:</strong> ${day.info.branch} (${tenGods.branchGod})<br>
            <strong>Officer:</strong> ${day.info.officer}<br>
            <strong>Star:</strong> ${day.info.constellation}
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div>${goodHoursHtml}</div>
            <div>${badHoursHtml}</div>
        </div>

        <h4>Analysis:</h4>
        <ul style="padding-left:20px;">${logHtml}</ul>
    `;
  modal.style.display = "flex";
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
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

function getColorBg(cssClass) {
  if (cssClass === "golden") return "#ffc107";
  if (cssClass === "excellent") return "#28a745";
  if (cssClass === "good") return "#17a2b8";
  return "#6c757d";
}

window.onclick = function (e) {
  // If the element clicked has the class 'modal', it means we clicked the backdrop
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
};
