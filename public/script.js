// --- STATE MANAGEMENT ---
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth() + 1;
let currentFilter = "all";
let allUsersData = [];
let currentUser;
let currentGuestUser = null;
let currentMonthDays = [];

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
const RELATIONSHIP_WEATHER = {
  Friend: {
    weather: "☀️ Sunny & Social",
    mood: "Confident, Brotherly, Competitive.",
    advice:
      "Great for group activities. Watch out for stubbornness. You may unconsciously compare yourself to others today.",
  },
  "Rob Wealth": {
    weather: "🌪️ Gusty Winds",
    mood: "Impulsive, Life of the Party.",
    advice:
      "You are charismatic but prone to overspending. Don't let friends pressure you. Fun today, regrets tomorrow if boundaries blur.",
  },
  "Eating God": {
    weather: "🌤️ Mild & Pleasant",
    mood: "Relaxed, Sensual, Creative.",
    advice: "You feel gentle and romantic. Perfect date night energy.",
  },
  "Hurting Officer": {
    weather: "⚡ Thunderstorms",
    mood: "Critical, Loud, Expressive.",
    advice:
      "Your tongue is sharp today. Be careful not to hurt your partner's feelings with 'brutal honesty'. You are right — but being right may cost intimacy.",
  },
  "Direct Wealth": {
    weather: "🧱 Stable High Pressure",
    mood: "Stoic, Practical, Hardworking.",
    advice:
      "You are focused on results, not feelings. You might seem cold to others. You show love through responsibility, not words.",
  },
  "Indirect Wealth": {
    weather: "🎲 Variable Clouds",
    mood: "Strategic, Risk-Taking, Playful.",
    advice:
      "You want excitement. Good for planning a surprise, bad for boring chores. You may lose interest quickly once excitement fades.",
  },
  "Direct Officer": {
    weather: "⚖️ Clear & Cold",
    mood: "Disciplined, Rigid, Polite.",
    advice:
      "You value order. You will get annoyed if your partner is messy or late. You expect others to ‘just know’ the rules.",
  },
  "7 Killings": {
    weather: "🔥 Heatwave / Hail",
    mood: "Aggressive, Impatient, Bold.",
    advice:
      "Short fuse warning! Burn this energy at the gym, not in an argument. Channel intensity into protection, not domination.",
  },
  "Direct Resource": {
    weather: "🛋️ Calm / Foggy",
    mood: "Lazy, Comfortable, Introspective.",
    advice:
      "You need me-time. You might be passive-aggressive if forced to socialize. You want support but may not ask for it.",
  },
  "Indirect Resource": {
    weather: "🔮 Mystic Mist",
    mood: "Intuitive, Suspicious, Quirky.",
    advice:
      "You feel misunderstood. Good for deep talks, bad for superficial small talk. You may read between lines that aren’t there.",
  },
};
const CLASH_PAIRS = {
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
const COMBO_PAIRS = {
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

function toggleTimeInput() {
  const checkbox = document.getElementById("noTimeCheckbox");
  const dobInput = document.getElementById("guestDob");

  // 1. Capture the current value before the browser wipes it
  const currentValue = dobInput.value;

  if (checkbox.checked) {
    // Switch to Date Only
    dobInput.type = "date";

    // Restore the YYYY-MM-DD part if a value existed
    if (currentValue && currentValue.includes("T")) {
      dobInput.value = currentValue.split("T")[0];
    }
  } else {
    // Switch back to Date & Time
    dobInput.type = "datetime-local";

    // Restore the date and add a default time (Noon) so it's valid
    if (currentValue && !currentValue.includes("T")) {
      dobInput.value = currentValue + "T12:00";
    }
  }
}

// 2. Update Generator Function
async function generateGuestProfile() {
  const name = document.getElementById("guestName").value;
  let dob = document.getElementById("guestDob").value; // "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm"
  const gender = document.getElementById("guestGender").value;
  const noTime = document.getElementById("noTimeCheckbox").checked;

  if (!name || !dob) {
    alert("Please fill in Name and Date");
    return;
  }

  // If no time is selected, append a default time for the Date constructor (Noon is safe)
  // But we send a flag telling the server to ignore it.
  if (noTime) {
    dob += "T12:00:00";
  }

  loadingOverlay("flex");

  try {
    const res = await fetch("/api/generate-guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthDate: dob, gender, hasTime: !noTime }),
    });

    if (!res.ok) throw new Error("Calculation failed");

    const guestUser = await res.json();

    // 1. Save to Global Variables
    currentGuestUser = currentUser = guestUser;

    // 2. UPDATE DROPDOWN (The Fix)
    const userSelect = document.getElementById("userSelect");

    // Check if we already added a "Guest" slot
    let guestOption = userSelect.querySelector("option[value='guest']");

    if (!guestOption) {
      guestOption = document.createElement("option");
      guestOption.value = "guest";
      userSelect.appendChild(guestOption);
    }

    // Set the text and force selection
    guestOption.text = `✨ Guest: ${guestUser.name}`;
    guestOption.selected = true;

    // 3. Show Success & Load
    // alert(`Profile Generated for ${guestUser.name}...`); // Optional now since UI shows it

    await loadCalendar(guestUser);
  } catch (e) {
    alert(e.message);
  } finally {
    loadingOverlay("none");
  }
}

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
  const userSelect = document.getElementById("userSelect");
  const selectedValue = userSelect.value;

  // Show Loading
  loadingOverlay("flex");

  // Use a small timeout to let the UI update before the heavy lifting starts
  setTimeout(async () => {
    try {
      if (selectedValue === "guest") {
        // CASE 1: SWITCHING TO GUEST (Memory)
        if (currentGuestUser) {
          currentUser = currentGuestUser; // Set global state
          await loadCalendar(currentGuestUser); // Pass full object to loader
        } else {
          // Safety fallback if memory was cleared
          alert("Guest session expired. Please generate a new profile.");
          userSelect.value = "";
          loadingOverlay("none");
          return;
        }
      } else {
        // CASE 2: SWITCHING TO DB USER (Server)
        // We set currentUser to null so loadCalendar knows to fetch from DB
        currentUser = null;
        await loadCalendar();
      }

      populateGoalSelect(); // Reload goals for whoever is selected
    } catch (error) {
      console.error("Error loading profile:", error);
      alert("Failed to load profile. Please try again.");
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
async function loadCalendar(guestUser = null) {
  loadingOverlay("flex");

  let url = `/api/calendar?year=${currentYear}&month=${currentMonth}`;
  let options = {};

  // If we have a guest user, we must POST their profile to the calendar engine
  if (guestUser) {
    url = `/api/calendar/guest?year=${currentYear}&month=${currentMonth}`; // New Endpoint
    options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: guestUser }),
    };
  } else {
    // Standard DB User
    const userId = document.getElementById("userSelect").value;
    if (!userId) return;
    url += `&userId=${userId}`;
  }

  const res = await fetch(url, options);
  const data = await res.json();

  currentUser = data.user;
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
  currentMonthDays = days;
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth - 1;

  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  // Adjust logic if you want Mon start vs Sun start.
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Render empty cells based on new offset
  // for (let i = 0; i < firstDayOfWeek; i++) {
  for (let i = 0; i < startOffset; i++) {
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

        // Hide unnecessary badges
        if (f === "Good Star" || f === "Bad Star") return "";

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

  // Check if the toggles are ON, and re-apply the visual effects immediately
  if (document.getElementById("architectToggle")?.checked) {
    toggleArchitectMode();
  }

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
                        "${rule.description}"
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
  const titleEl = document.getElementById("detailsTitle");
  const bodyEl = document.getElementById("detailsBody");

  // --- 1. Navigation Logic ---
  let currentIndex = currentMonthDays.findIndex(
    (d) => d.fullDate === day.fullDate,
  );
  if (currentIndex === -1) {
    console.error("Critical: Day not found in global array.");
    currentIndex = 0;
  }

  const prevDay = currentMonthDays[currentIndex - 1];
  const nextDay = currentMonthDays[currentIndex + 1];

  const btnStyle = `
        cursor: pointer; border: none; background: transparent; 
        font-size: 1.2rem; color: #555; padding: 0 10px;
        transition: color 0.2s; outline: none;
    `;
  const disabledStyle = `opacity: 0.2; cursor: default;`;

  // Set Title
  titleEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <button id="btnPrevDay" style="${btnStyle} ${!prevDay ? disabledStyle : ""}" ${!prevDay ? "disabled" : ""}> 
                &#9664; 
            </button>
            <div style="text-align: center; line-height: 1.1;">
                <div style="font-size: 1.1rem; font-weight: bold;">${day.fullDate} (${day.analysis.verdict})</div>
                <div style="font-size: 0.8rem; font-weight: normal; color: #666;">
                    ${day.info.stem} ${day.info.dayBranch} Day
                </div>
            </div>
            <button id="btnNextDay" style="${btnStyle} ${!nextDay ? disabledStyle : ""}" ${!nextDay ? "disabled" : ""}> 
                &#9654; 
            </button>
        </div>
    `;

  // --- 2. Data Preparation ---
  const logs = day.analysis.log || [];
  const score = day.analysis.score || 0;
  const officer = day.info.officer;

  // Traffic Light Status
  let status = {
    color: "#198754",
    bg: "#d1e7dd",
    icon: "✅",
    verdict: "EXCELLENT",
    advice: "Go for it! The energy supports growth.",
  };

  if (score < 40) {
    status = {
      color: "#dc3545",
      bg: "#f8d7da",
      icon: "🛑",
      verdict: "DANGEROUS",
      advice: "Stop. Do not launch major projects today.",
    };
  } else if (score < 60) {
    status = {
      color: "#fd7e14",
      bg: "#ffecd1",
      icon: "⚠️",
      verdict: "CAUTION",
      advice: "Proceed with care. Good for routine, bad for risks.",
    };
  } else if (score < 75) {
    status = {
      color: "#0dcaf0",
      bg: "#cff4fc",
      icon: "ℹ️",
      verdict: "AVERAGE",
      advice: "Stable energy. Good for planning and maintenance.",
    };
  }

  // Action Maps
  const bestForMap = {
    Establish: "Proposing Marriage, Starting a Job, or Medical Diagnosis",
    Remove: "Cleaning, Decluttering, or Medical Procedures",
    Full: "Collecting Debts, Parties, or Official Launches",
    Balance: "Negotiations, Marriage, or Travel",
    Stable: "Long-term Planning, Weddings, or Construction",
    Initiate: "Groundbreaking, Starting a Job, or Renovation",
    Destruction: "Demolition, Dieting, or Ending Bad Habits",
    Danger: "Risk assessment, Religious activities, or Dismantling",
    Success: "Everything! (Especially Business, Marriage, & Contracts)",
    Receive: "Asking for a Raise, Starting a Course, or Proposals",
    Open: "Grand Openings, Housewarming, or Signing Agreements",
    Close: "Stock taking, Planning, or Self-reflection",
  };

  const worstForMap = {
    Establish: "Funerals or Signing Agreements",
    Remove: "Opening a Business or Marriage",
    Full: "Legal Disputes or Signing Contracts (Stifles growth)",
    Balance: "Lawsuits (Levelling the scales)",
    Stable: "Moving House or Quick Projects",
    Initiate: "Moving House or Travel",
    Destruction: "Weddings, Signing Papers, or Travel",
    Danger: "Extreme Sports or Height Work",
    Success: "Litigation (Risk of competitors winning)",
    Receive: "Medical Treatment or Visiting the Sick",
    Open: "Burial, Groundbreaking, or Surgery",
    Close: "Medical Procedures or Important Meetings",
  };

  // --- 3. HTML Construction ---

  // Executive Summary
  const executiveSummaryHtml = `
  <div style="background: ${status.bg}; border-left: 6px solid ${status.color}; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div style="font-weight:900; color:${status.color}; font-size:1.1rem; letter-spacing:1px; text-transform:uppercase;">
              ${status.icon} ${status.verdict} DAY
          </div>
          <div style="font-weight:bold; font-size:1.2rem; color:#333;">${score} pts</div>
      </div>
      <div style="font-size:0.95rem; color:#444; margin-bottom:15px; font-style:italic;">"${status.advice}"</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; border-top:1px solid rgba(0,0,0,0.1); padding-top:10px;">
          <div>
              <div style="font-size:0.7rem; color:#198754; font-weight:bold; text-transform:uppercase;">✅ Best For</div>
              <div style="font-weight:600; color:#2c3e50; font-size:0.9rem; line-height:1.2;">${bestForMap[officer] || "Routine Work"}</div>
          </div>
          <div>
              <div style="font-size:0.7rem; color:#dc3545; font-weight:bold; text-transform:uppercase;">⛔ Avoid</div>
              <div style="font-weight:600; color:#2c3e50; font-size:0.9rem; line-height:1.2;">${worstForMap[officer] || "High Risk Activities"}</div>
          </div>
      </div>
  </div>`;

  // Strategy
  const tenGodName = day.tenGods?.stemGod || "F";
  const strategy = getPersonalizedActions(officer, tenGodName);
  const strategyHtml = `
  <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(to right, #f8f9fa, #ffffff); padding: 12px 15px; border-bottom: 1px solid #eee; display:flex; align-items:center; justify-content:space-between;">
          <div>
              <div style="font-size:0.75rem; text-transform:uppercase; color:#888; font-weight:700; letter-spacing:0.5px;">Your Strategy</div>
              <div style="font-size:1.1rem; font-weight:700; color:#333;">${strategy.title}</div>
          </div>
          <div style="text-align:right;">
             <span style="font-size:0.8rem; background:#e9ecef; padding:4px 8px; border-radius:4px; color:#555;">Context: ${strategy.context}</span>
          </div>
      </div>
      <div style="padding: 20px;">
          <div style="font-size:1rem; line-height:1.5; color:#444; margin-bottom:15px; border-left:4px solid #0d6efd; padding-left:12px;">${strategy.advice}</div>
          <div style="display:flex; gap:8px;">
             <span style="font-size:0.75rem; border:1px solid #dee2e6; padding:2px 8px; border-radius:12px; color:#666;">#${strategy.god}</span>
             <span style="font-size:0.75rem; border:1px solid #dee2e6; padding:2px 8px; border-radius:12px; color:#666;">#${strategy.officer}</span>
          </div>
      </div>
  </div>`;

  // Day Info
  const tenGods = day.tenGods || {};
  const dayInfo = `<div style="padding:0 10px; margin-bottom:15px; display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:0.9rem;">
    <div><strong>Stem:</strong> ${day.info.stem} (${tenGods.stemGod})<br><strong>Branch:</strong> ${day.info.dayBranch} (${tenGods.branchGod})</div>
    <div><strong>Officer:</strong> ${day.info.officer}<br><strong>Element:</strong> ${day.info.element}</div>
  </div>`;

  // Archetype
  const tenGodTitle = day.analysis.tenGodName || "Day Energy";
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
                    <div style="font-size:1.25rem; font-weight:700; color:#333;">${tenGodTitle}</div>
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
        </div>`;

  // Analysis Pros/Cons
  const pros = [],
    cons = [],
    neutrals = [];
  logs.forEach((msg) => {
    if (
      msg.includes("Avoid") ||
      msg.includes("Conflict") ||
      msg.includes("Killings") ||
      msg.includes("Clash") ||
      msg.includes("Risk")
    )
      cons.push(msg);
    else if (
      msg.includes("Lucky") ||
      msg.includes("Great") ||
      msg.includes("Boost") ||
      msg.includes("Noble")
    )
      pros.push(msg);
    else neutrals.push(msg);
  });

  const renderAnalysisList = (items, colorClass) => {
    if (items.length === 0)
      return `<div style="font-size:0.85rem; color:#aaa; font-style:italic;">None</div>`;
    return items
      .map(
        (text) =>
          `<div style="display:flex; align-items:start; margin-bottom:8px; font-size:0.9rem;"><span class="${colorClass}">${text}</span></div>`,
      )
      .join("");
  };

  const analysisGrid = `
        <div style="margin-top:25px;">
            <h5 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; font-weight:700;">📊 Personal Analysis</h5>
            <div class="grid-dashboard">
                <div style="background: #f0fff4; border: 1px solid #c3e6cb; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#155724; margin-bottom:12px; font-size:0.8rem;">✨ BOOSTS & LUCK</div>
                    ${renderAnalysisList(pros, "text-success")}
                </div>
                <div style="background: #fff5f5; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px;">
                    <div style="font-weight:bold; color:#721c24; margin-bottom:12px; font-size:0.8rem;">⚠️ RISKS & CLASHES</div>
                    ${renderAnalysisList(cons, "text-danger")}
                </div>
            </div>
            ${neutrals.length > 0 ? `<div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin-top: 10px;"><div style="font-weight:bold; color:#6c757d; margin-bottom:12px; font-size:0.8rem;">ℹ️ GENERAL CONTEXT</div>${renderAnalysisList(neutrals, "text-muted")}</div>` : ""}
        </div>`;

  // Hourly Grid (Personalized)
  const hoursData = day.analysis.hours || [];
  const formatHourRow = (h) => {
    const positives = ["Nobleman", "Academic", "Horse"];
    const negatives = ["Clash", "Day Breaker"];
    const hasPositive = h.tags.some((t) => positives.includes(t));
    const hasNegative = h.tags.some((t) => negatives.includes(t));
    let rowState = "neutral";
    if (hasPositive && hasNegative) rowState = "mixed";
    else if (hasPositive) rowState = "good";
    else if (hasNegative) rowState = "bad";

    const badgesHtml = h.tags
      .map((tag) => {
        if (tag === "User Nobleman")
          return `<span style="background:#d1e7dd; color:#0f5132; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:800; border:1px solid #a3cfbb;">🌟 YOUR Nobleman</span>`;
        if (tag === "Academic")
          return `<span style="background:#cff4fc; color:#055160; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:600;">📚 Academic</span>`;
        if (tag === "Travel Star")
          return `<span style="background:#e0f2f1; color:#00695c; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:600; border:1px solid #b2dfdb;">🐴 Travel Star</span>`;
        if (tag === "Social Peach")
          return `<span style="background:#f3e5f5; color:#7b1fa2; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:600; border:1px solid #e1bee7;">🥂 Social Peach</span>`;
        if (tag === "Romance Peach")
          return `<span style="background:#fce4ec; color:#c2185b; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:600; border:1px solid #f48fb1;">💘 Romance Peach</span>`;
        if (tag === "Personal Clash")
          return `<span style="background:#f8d7da; color:#842029; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:800; border:1px solid #f1aeb5;">💥 YOUR Clash</span>`;
        if (tag === "Day Nobleman")
          return `<span style="background:#e8f5e9; color:#2e7d32; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px;">✨ Day Nobleman</span>`;
        if (tag === "6 Harmony")
          return `<span style="background:#fff3e0; color:#ef6c00; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px;">🤝 6 Harmony</span>`;
        if (tag === "3 Harmony")
          return `<span style="background:#fff8e1; color:#f57f17; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px;">👥 Teamwork (3H)</span>`;
        if (tag === "Day Breaker")
          return `<span style="background:#e2e3e5; color:#666; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:6px; border:1px dashed #ccc;">⚡ Day Breaker</span>`;
        return "";
      })
      .join("");

    let rowBg = "transparent",
      borderStyle = "1px solid #f0f0f0";
    if (rowState === "good")
      rowBg = "linear-gradient(to right, #f0fff4, transparent)";
    else if (rowState === "bad")
      rowBg = "linear-gradient(to right, #fff5f5, transparent)";
    else if (rowState === "mixed") {
      rowBg = "linear-gradient(to right, #fff3cd, transparent)";
      borderStyle = "1px solid #ffeeba";
    }

    return `<div style="display:flex; align-items:center; padding:8px 0; border-bottom:${borderStyle}; background:${rowBg};"><div style="width:100px; font-size:0.9rem; font-weight:bold; color:#555;">${h.time}</div><div style="width:80px; font-size:0.9rem; color:#666;">${h.branch}</div><div style="flex-grow:1; display:flex; flex-wrap:wrap; align-items:center;">${badgesHtml}${rowState === "mixed" ? `<span style="font-size:0.7rem; color:#856404; margin-left:8px; font-style:italic;">(Turbulent Opportunity)</span>` : ""}</div></div>`;
  };

  const hourlyGrid = `
        <div style="margin-top:20px;">
            <h5 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; font-weight:700; display:flex; justify-content:space-between; align-items:center;">⏰ Strategic Timing <span style="font-size:0.7rem; font-weight:normal; color:#888;">(Personalized)</span></h5>
            <div class="grid-dashboard" style="display:block; max-height:300px; overflow-y:auto; border:1px solid #eee; border-radius:8px; padding:10px;">
                ${hoursData.length > 0 ? hoursData.map((h) => formatHourRow(h)).join("") : `<div style="text-align:center; padding:20px; color:#999;">No hourly data available.</div>`}
            </div>
            <div style="font-size:0.75rem; color:#999; margin-top:5px; text-align:center;">💡 <strong>Tip:</strong> Use "Nobleman" hours for asking favors. Use "Clash" hours for rest.</div>
        </div>`;

  // Cosmic & Energy
  const nineStarName = day.info.nineStar || "Unknown";
  const nineStarDesc = day.info.nineStarDesc || "No specific data.";
  const starDesc = day.info.constellationDesc || "No specific data.";
  let starColor = "#666",
    starBg = "#eee";
  if (nineStarName.includes("White")) {
    starColor = "#444";
    starBg = "#f8f9fa";
  } else if (nineStarName.includes("Black")) {
    starColor = "#000";
    starBg = "#e2e3e5";
  } else if (nineStarName.includes("Green")) {
    starColor = "#198754";
    starBg = "#d1e7dd";
  } else if (nineStarName.includes("Yellow")) {
    starColor = "#b45309";
    starBg = "#ffecd1";
  } else if (nineStarName.includes("Red")) {
    starColor = "#dc3545";
    starBg = "#f8d7da";
  } else if (nineStarName.includes("Purple")) {
    starColor = "#6f42c1";
    starBg = "#e0cffc";
  }

  const energyDeepDive = `<div style="background:#fff3cd; margin-top:15px; padding:12px; border-radius:8px; border:1px solid #ffeeba;"><h4 style="margin:0 0 10px 0; color:#856404; font-size:1rem;">🔮 Energy Deep Dive</h4><div style="margin-bottom:10px;"><div style="font-weight:bold; color:#555;">${day.info.yellowBlackBelt.icon} ${day.info.yellowBlackBelt.name} Spirit</div><div style="font-size:0.9rem; color:#666; font-style:italic;">"${day.info.yellowBlackBelt.desc}"</div></div><div><div style="font-weight:bold; color:#555;">★ ${day.info.constellation} Star</div><div style="font-size:0.9rem; color:#666; font-style:italic;">"${starDesc}"</div></div></div>`;

  const cosmicSection = `<div style="margin-top:20px; padding-top:15px;"><h5 style="color:#444; margin:10px 0; padding-bottom:8px; border-bottom:1px solid #eee">🌌 Cosmic Atmosphere</h5><div style="background:${starBg}; padding:10px; border-radius:6px; border-left:4px solid ${starColor};"><div style="display:flex; justify-content:space-between; align-items:center;"><div style="font-weight:bold; color:${starColor};">🧭 9 Star Qi: ${nineStarName}</div></div><div style="font-size:0.85rem; color:#555; margin-top:4px; font-style:italic;">"${nineStarDesc}"</div></div></div>`;

  // Emotional Weather
  const stemGod = day.analysis.tenGodName || "Friend";
  const cleanGodName = stemGod.split("(")[0].trim();
  const weatherData =
    RELATIONSHIP_WEATHER[cleanGodName] || RELATIONSHIP_WEATHER["Friend"];

  // Spouse Check
  const userSpouseBranch = currentUser ? currentUser.dayBranch : null;
  const db = day.info.dayBranch;
  let spouseStatusHtml = "";
  if (userSpouseBranch) {
    if (CLASH_PAIRS[userSpouseBranch] === db) {
      spouseStatusHtml = `<div style="margin-top:10px; padding:8px; background:#fff5f5; border-left:4px solid #dc3545; border-radius:4px;"><strong style="color:#dc3545;">⚠️ Spouse Clash (${userSpouseBranch} ⚔️ ${db})</strong><p style="margin:4px 0 0 0; font-size:0.9rem; color:#666;">The energy hits your relationship sector directly. Small disagreements can escalate quickly today. <strong>Strategy:</strong> Give each other space.</p></div>`;
    } else if (COMBO_PAIRS[userSpouseBranch] === db) {
      spouseStatusHtml = `<div style="margin-top:10px; padding:8px; background:#f3e5f5; border-left:4px solid #9c27b0; border-radius:4px;"><strong style="color:#9c27b0;">💞 Spouse Harmony (${userSpouseBranch} ❤️ ${db})</strong><p style="margin:4px 0 0 0; font-size:0.9rem; color:#666;">Harmony activates your relationship sector. You feel naturally connected and "sticky". <strong>Strategy:</strong> Plan a date night or deep conversation.</p></div>`;
    }
  }

  let bgTheme = "#f8f9fa",
    borderTheme = "#6c757d";
  if (["Hurting Officer", "7 Killings"].includes(cleanGodName)) {
    bgTheme = "#f8d7da";
    borderTheme = "#dc3545";
  } else if (["Friend", "Eating God"].includes(cleanGodName)) {
    bgTheme = "#d4edda";
    borderTheme = "#28a745";
  } else if (["Direct Officer", "Direct Wealth"].includes(cleanGodName)) {
    bgTheme = "#cff4fc";
    borderTheme = "#0dcaf0";
  } else if (["Direct Resource", "Indirect Resource"].includes(cleanGodName)) {
    bgTheme = "#e2e3e5";
    borderTheme = "#6f42c1";
  } else if (["Rob Wealth", "Indirect Wealth"].includes(cleanGodName)) {
    bgTheme = "#fff3cd";
    borderTheme = "#ffc107";
  }

  const weatherWidget = `<div style="margin-top: 15px; background: ${bgTheme}; border-left: 5px solid ${borderTheme}; padding: 15px; border-radius: 4px;"><h5 style="margin: 0 0 10px 0; color: ${borderTheme}; display: flex; align-items: center; gap: 8px;">${weatherData.weather} <span style="font-size:0.8rem; color:#666; font-weight:normal;">(${cleanGodName})</span></h5><div style="display: grid; grid-template-columns: 1fr; gap: 8px;"><div><strong>🧠 Mood:</strong> ${weatherData.mood}</div><div><strong>❤️ Advice:</strong> <i>${weatherData.advice}</i></div></div>${spouseStatusHtml}</div>`;

  // --- 4. Render Initial HTML (Sync Data) ---
  // We append a container specifically for the Almanac
  const almanacContainerHtml = `<div id="almanac-container"><small style="color:#aaa; display:block; text-align:center; margin-top:20px;">Checking Almanac...</small></div>`;

  bodyEl.innerHTML = `
        ${executiveSummaryHtml}
        ${strategyHtml}
        ${dayInfo}
        ${officersAdvice}
        ${analysisGrid}
        ${energyDeepDive}
        ${hourlyGrid}
        ${cosmicSection}
        ${weatherWidget}
        ${almanacContainerHtml}
    `;

  // --- 5. Navigation Events ---
  const btnPrev = document.getElementById("btnPrevDay");
  const btnNext = document.getElementById("btnNextDay");

  if (prevDay && btnPrev) {
    btnPrev.onclick = (e) => {
      e.stopPropagation();
      showDetails(prevDay);
    };
    btnPrev.onmouseover = () => (btnPrev.style.color = "#000");
    btnPrev.onmouseout = () => (btnPrev.style.color = "#555");
  }

  if (nextDay && btnNext) {
    btnNext.onclick = (e) => {
      e.stopPropagation();
      showDetails(nextDay);
    };
    btnNext.onmouseover = () => (btnNext.style.color = "#000");
    btnNext.onmouseout = () => (btnNext.style.color = "#555");
  }

  // --- 6. Open Modal & Fetch Async Data ---
  openModalById("detailsModal");

  // Fetch Almanac Data (Lazy Load)
  fetch(`/api/day-details/${day.fullDate}`)
    .then((res) => {
      if (!res.ok) throw new Error("No data");
      return res.json();
    })
    .then((data) => {
      const container = document.getElementById("almanac-container");
      if (container) {
        container.innerHTML = generateAlmanacHTML(data);
      }
    })
    .catch((err) => {
      const container = document.getElementById("almanac-container");
      if (container) container.innerHTML = ""; // Hide if fails
      // console.warn("Almanac fetch missing:", err);
    });
}

function getPersonalizedActions(officer, tenGodName) {
  // 1. CLEAN INPUTS
  const god = tenGodName || "F";
  const off = officer || "Stable";

  // 2. DEFINE THE "TEN GOD" STRATEGY (The "How")
  const godStrategies = {
    F: { style: "Connect", icon: "🤝", verb: "network with" },
    RW: { style: "Compete", icon: "🔥", verb: "rally the team for" },
    EG: { style: "Create", icon: "🎨", verb: "brainstorm" },
    HO: { style: "Perform", icon: "🎤", verb: "showcase" },
    DW: { style: "Manage", icon: "📊", verb: "execute" },
    IW: { style: "Opportunist", icon: "🎲", verb: "seize" },
    DO: { style: "Discipline", icon: "⚖️", verb: "standardize" },
    "7K": { style: "Conquer", icon: "⚔️", verb: "aggressively tackle" },
    DR: { style: "Analyze", icon: "📚", verb: "research" },
    IR: { style: "Intuitive", icon: "🔮", verb: "strategize" },
  };

  // 3. DEFINE THE "OFFICER" CONTEXT (The "What")
  const officerContext = {
    Establish: {
      mood: "New Beginnings",
      tasks: "new projects, proposals, or job starts",
    },
    Remove: {
      mood: "Decluttering",
      tasks: "cleaning, medical procedures, or firing bad clients",
    },
    Full: {
      mood: "Abundance",
      tasks: "signing contracts, collecting debts, or assets",
    },
    Balance: { mood: "Alignment", tasks: "negotiations, travel, or meetings" },
    Stable: {
      mood: "Persistence",
      tasks: "operations planning, status quo or routine day",
    },
    Initiate: {
      mood: "Start-up",
      tasks: "starting construction, groundbreaking, or commencing a new job",
    },
    Destruction: {
      mood: "Breakthrough",
      tasks: "demolition, breaking bad habits, or pivoting",
    },
    Danger: {
      mood: "Risk Mgmt",
      tasks: "risk assessment, delivering ultimatums, or managing crisis",
    },
    Success: {
      mood: "Achievement",
      tasks: "launches, pitches, or commercial deals",
    },
    Receive: {
      mood: "Rewards",
      tasks: "closing deals, asking for raises, or storing value",
    },
    Open: {
      mood: "Expansion",
      tasks: "grand openings, networking, or housewarming",
    },
    Close: {
      mood: "Stagnation",
      tasks: "internal review, filing, or whiteboarding",
    },
  };

  const myGod = godStrategies[god] || godStrategies["F"];
  const myOff = officerContext[off] || officerContext["Stable"];

  // 4. SYNTHESIZE THE SENTENCE
  // e.g. "Use your [Aggression] (7K) to [Break Bad Habits] (Destruction)"
  const synthesis = `Use your <strong>${myGod.style}</strong> energy to <strong>${myGod.verb}</strong> your <strong>${myOff.tasks}</strong>.`;

  return {
    title: `${myGod.icon} ${myGod.style} Mode`,
    context: `${myOff.mood} Day`,
    advice: synthesis,
    god: god,
    officer: off,
  };
}

function generateAlmanacHTML(data) {
  if (!data) return "";

  const { summary, advice, technical, hours, directions } = data;

  // Helpers
  const badge = (text, color, bg) =>
    `<span style="display:inline-block; background:${bg}; color:${color}; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:700; border:1px solid ${color}30; white-space:nowrap;">${text}</span>`;
  const renderList = (items) =>
    items && items.length
      ? items
          .slice(0, 6)
          .map((i) => `<li style="margin-bottom:4px;">${i}</li>`)
          .join("")
      : `<li style="color:#999; font-style:italic;">None</li>`;

  // --- FLYING STARS GRID ---
  const fs = technical.flyingStars || {};
  const gridOrder = ["SE", "S", "SW", "E", "Ctr", "W", "NE", "N", "NW"];

  const fsGridHtml = gridOrder
    .map((dir) => {
      const num = fs[dir] || "-";
      const isGood = ["1", "4", "6", "8", "9"].includes(num);
      const color = isGood ? "#198754" : "#666";
      const bg = dir === "Ctr" ? "#f8f9fa" : "#fff";
      return `<div style="background:${bg}; border:1px solid #eee; display:flex; flex-direction:column; align-items:center; justify-content:center; height:45px;"><span style="font-size:0.65rem; color:#888;">${dir}</span><span style="font-size:1rem; font-weight:bold; color:${color};">${num}</span></div>`;
    })
    .join("");

  // --- XKDG ---
  const xkdg = technical.xkdg;
  const xkdgHtml = xkdg
    ? `
    <div style="background:#f0f8ff; padding:8px 12px; border-radius:6px; border-left:4px solid #0d6efd; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
        <div>
            <div style="font-size:0.7rem; color:#666; text-transform:uppercase;">HEXAGRAM (XKDG)</div>
            <div style="font-weight:bold; color:#0d6efd; font-size:0.9rem;">${xkdg.name}</div>
        </div>
        <div style="text-align:right; font-size:0.8rem; color:#555;">
             <div>${xkdg.numbers} • ${xkdg.element}</div>
             <div style="font-size:0.7rem; color:#888;">${xkdg.star}</div>
        </div>
    </div>`
    : "";

  // --- HTML STRUCTURE ---
  return `
    <div class="almanac-wrapper" style="margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px;">
        <details>
            <summary style="cursor:pointer; list-style:none; display:flex; align-items:center; justify-content:space-between; padding:8px; background:#f8f9fa; border-radius:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:1.1rem;">📜</span>
                    <span style="color:#333; font-weight:700; font-size:0.95rem;">Tong Shu</span>
                </div>
                <div style="background:#000; color:#ffd700; padding:4px 10px; border-radius:6px; font-size:0.8rem; font-weight:bold; display:flex; align-items:center; gap:5px; box-shadow:0 2px 4px rgba(0,0,0,0.2);">
                    🐰 ${summary.blackRabbit}
                </div>
            </summary>
            
            <div class="almanac-content" style="margin-top: 15px; padding:0 5px;">
                
                <div style="margin-bottom: 15px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
                    ${badge(summary.pillar, "#333", "#fff")}
                    ${badge(summary.officer, "#198754", "#d1e7dd")} 
                    ${badge(summary.constellation, "#0d6efd", "#cfe2ff")}
                    <span style="font-size:0.75rem; color:#666; margin-left:auto;">${summary.naYin}</span>
                </div>

                ${xkdgHtml}

                <div style="display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 15px; margin-bottom: 15px;">
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <div style="background:#f0fff4; padding:10px; border-radius:6px; border:1px solid #c3e6cb;">
                            <strong style="color:#198754; display:block; margin-bottom:5px; font-size:0.75rem; text-transform:uppercase;">✅ Good For</strong>
                            <ul style="margin:0; padding-left:15px; font-size:0.8rem; color:#444;">${renderList(advice.good)}</ul>
                        </div>
                        <div style="background:#fff5f5; padding:10px; border-radius:6px; border:1px solid #f5c6cb;">
                            <strong style="color:#dc3545; display:block; margin-bottom:5px; font-size:0.75rem; text-transform:uppercase;">⛔ Avoid</strong>
                            <ul style="margin:0; padding-left:15px; font-size:0.8rem; color:#444;">${renderList(advice.avoid)}</ul>
                        </div>
                    </div>

                    <div>
                        <div style="font-size:0.7rem; font-weight:bold; color:#555; margin-bottom:5px; text-align:center;">FLYING STARS</div>
                        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1px; border:1px solid #ddd; background:#ccc;">${fsGridHtml}</div>
                        <div style="margin-top:10px; font-size:0.75rem; background:#f8f9fa; padding:6px; border-radius:4px; border:1px solid #eee;">
                            <div>💰 Wealth: <strong>${directions.wealth}</strong></div>
                            <div style="margin-top:2px;">👑 Noble: <strong>${directions.nobility}</strong></div>
                        </div>
                    </div>
                </div>

                <details>
                    <summary style="font-size:0.85rem; color:#6610f2; cursor:pointer; font-weight:600; padding:8px 0;">🔮 View Hours & Qi Men</summary>
                    
                    <div style="margin-top:10px; display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px;">
                        <div style="background:#f3e5f5; padding:8px; border-radius:6px;">
                            <strong style="color:#6610f2; font-size:0.75rem;">San Yuan Qi Men</strong>
                            <ul style="margin:4px 0 0 15px; font-size:0.7rem; color:#444; padding:0;">${technical.qiMen.sanYuan
                              .slice(0, 4)
                              .map((l) => `<li>${l}</li>`)
                              .join("")}</ul>
                        </div>
                        <div style="background:#fff3e0; padding:8px; border-radius:6px;">
                            <strong style="color:#e65100; font-size:0.75rem;">Zodiac Luck</strong>
                            <ul style="margin:4px 0 0 15px; font-size:0.7rem; color:#444; padding:0;">${technical.zodiacRaw
                              .slice(0, 4)
                              .map((l) => `<li>${l}</li>`)
                              .join("")}</ul>
                        </div>
                    </div>

                    <table style="width:100%; font-size:0.8rem; border-collapse:collapse;">
                        <thead style="background:#f1f3f5;">
                            <tr><th style="padding:6px; text-align:left;">Time</th><th style="padding:6px; text-align:left;">Stars</th></tr>
                        </thead>
                        <tbody>
                        ${hours
                          .map(
                            (h) => `
                            <tr style="border-bottom:1px solid #f0f0f0;">
                                <td style="padding:6px; white-space:nowrap; color:#555; vertical-align:top;"><strong>${h.time}</strong><br><span style="font-size:0.7rem;">${h.name}</span></td>
                                <td style="padding:6px;">
                                    ${h.goodStars.length ? `<div style="color:#198754; font-size:0.75rem;">✨ ${h.goodStars.join(", ")}</div>` : ""}
                                    ${h.badStars.length ? `<div style="color:#dc3545; font-size:0.75rem;">⚠️ ${h.badStars.join(", ")}</div>` : ""}
                                </td>
                            </tr>`,
                          )
                          .join("")}
                        </tbody>
                    </table>
                </details>
            </div>
        </details>
    </div>
  `;
}

function toggleArchitectMode() {
  const isModeActive = document.getElementById("architectToggle").checked;
  const cards = document.querySelectorAll(".day-card");

  cards.forEach((card) => {
    const badges = card.querySelector(".footer-badges").innerText;

    if (badges.includes("VOID") || badges.includes("Death God")) {
      if (isModeActive) {
        // Highlight as GOOD (Purple)
        card.style.background = "#f3e5f5"; // Light Purple
        card.style.borderColor = "#9c27b0";
        card.style.opacity = "1";
      } else {
        // Revert to normal (often these are low score days, so maybe grey/red)
        card.style.background = "";
        card.style.borderColor = "";
      }
    } else {
      // If mode is active, fade out the "Normal" days to focus on Deep Work
      if (isModeActive) {
        card.style.opacity = "0.4";
      } else {
        card.style.opacity = "1";
      }
    }
  });
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

// ==========================================
// MOBILE SWIPE NAVIGATION
// ==========================================

let touchStartX = 0;
let touchStartY = 0;

const modalContainer = document.getElementById("detailsModal");

if (modalContainer) {
  // 1. Capture the start of the touch
  modalContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true },
  ); // 'passive' improves scrolling performance

  // 2. Capture the end and calculate direction
  modalContainer.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;

      handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    },
    { passive: true },
  );
}

function handleSwipe(startX, startY, endX, endY) {
  const diffX = endX - startX;
  const diffY = endY - startY;

  // Thresholds
  const minSwipeDistance = 50; // Minimum px to count as a swipe
  const verticalLimit = 100; // Max vertical deviation allowed (prevents scrolling from triggering swipe)

  // Check if the swipe is primarily horizontal
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Check if movement was significant enough
    if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffY) < verticalLimit) {
      // Ensure your computed style or inline style actually matches "flex"
      const modal = document.getElementById("detailsModal");
      const isVisible =
        modal &&
        (modal.style.display === "flex" ||
          getComputedStyle(modal).display === "flex");

      if (isVisible) {
        if (diffX > 0) {
          // SWIPE RIGHT -> Go to Previous Day
          const btn = document.getElementById("btnPrevDay");
          if (btn && !btn.disabled) {
            btn.click();
            animateSwipe("right");
          }
        } else {
          // SWIPE LEFT -> Go to Next Day
          const btn = document.getElementById("btnNextDay");
          if (btn && !btn.disabled) {
            btn.click();
            animateSwipe("left");
          }
        }
      }
    }
  }
}
// Add a subtle slide animation to the modal body
function animateSwipe(direction) {
  const bodyEl = document.getElementById("detailsBody");
  if (bodyEl) {
    // Quick subtle animation
    const start = direction === "left" ? "10px" : "-10px";
    bodyEl.style.transform = `translateX(${start})`;
    bodyEl.style.opacity = "0.8";

    setTimeout(() => {
      bodyEl.style.transform = "translateX(0)";
      bodyEl.style.opacity = "1";
    }, 150);
  }
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
document.addEventListener("keydown", (e) => {
  // Only work if modal is open
  const modal = document.getElementById("detailsModal");
  if (modal.style.display === "flex") {
    if (e.key === "ArrowLeft") {
      const btn = document.getElementById("btnPrevDay");
      if (btn && !btn.disabled) btn.click();
    }
    if (e.key === "ArrowRight") {
      const btn = document.getElementById("btnNextDay");
      if (btn && !btn.disabled) btn.click();
    }
    if (e.key === "Escape") {
      closeModal("detailsModal");
    }
  }
});
