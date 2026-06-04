/* ── GLOBALS ──────────────────────────────────── */
const TODAY = new Date();
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const todayKey = `${TODAY.getFullYear()}-${TODAY.getMonth()}-${TODAY.getDate()}`;
const isJuly = TODAY.getMonth() >= 6;

let S = JSON.parse(localStorage.getItem('lifeOS2') || '{}');
function ensure(path, def) {
  let o = S; const k = path.split('.');
  for (let i = 0; i < k.length-1; i++) { if (!o[k[i]]) o[k[i]] = {}; o = o[k[i]]; }
  if (o[k[k.length-1]] === undefined) o[k[k.length-1]] = def;
}
ensure('tasks', {}); ensure(`tasks.${todayKey}`, {});
ensure('notes', {}); ensure('meals', {}); ensure(`meals.${todayKey}`, []);
ensure('supps', {}); ensure(`supps.${todayKey}`, {});
ensure('workouts', {}); ensure('gymState', { step: 0 });
function save() { localStorage.setItem('lifeOS2', JSON.stringify(S)); }

document.getElementById('navDate').textContent =
  `${DAYS[TODAY.getDay()]} ${TODAY.getDate()} ${MONTHS[TODAY.getMonth()]} ${TODAY.getFullYear()}`;

/* ── TABS ─────────────────────────────────────── */
function goTab(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
  if (name === 'checklist') renderChecklist();
  if (name === 'diet') renderDiet();
  if (name === 'gym') renderGym();
}

/* ══════════════════════════════════════════════
   PAGE 1 — SCHEDULE (TRAIN PATHWAY)
══════════════════════════════════════════════ */
const SCHEDULE = [
  { time:'6:00 AM', task:'Wake up + Brush teeth', type:'personal' },
  { time:'6:15 AM', task:'Face steam (Mon, Wed, Fri, Sun)', type:'personal', sub:'10 min · skin care' },
  { time:'6:30 AM', task:'Jawline exercise', type:'personal', sub:'10 min daily' },
  { time:'7:00 AM', task:'Startup work block', type:'startup', sub: isJuly ? '2–3 hrs · college mode':'5 hrs total · June only' },
  ...(isJuly ? [{ time:'8:00 AM', task:'Get ready — leave by 8:30 AM', type:'college', sub:'KSRTC / Scooty · ~4 km' },
                { time:'9:15 AM', task:'CLASSES — GEC Trikaripur', type:'college', sub:'Until 4:00 PM' },
                { time:'4:00 PM', task:'College ends · Head home', type:'college' }]
             : [{ time:'10:00 AM', task:'Blog writing (Tue, Fri)', type:'content', sub:'~45 min · 2×/week' },
                { time:'11:00 AM', task:'YouTube video editing', type:'content', sub:'3 videos/week · ~2 hrs/video' }]),
  { time:'1:00 PM', task:'Lunch + Log food', type:'personal' },
  { time:'2:00 PM', task:'Instagram gym content', type:'content', sub:'3 videos/week · shoot + edit' },
  { time:'4:30 PM', task:'YouTube personal dev / English fluency', type:'personal', sub:'3 hrs/week' },
  { time:'5:30 PM', task:'🏋️ GYM — 2 hours', type:'gym', sub:'Evening session · non-negotiable' },
  { time:'7:30 PM', task:'Dinner + Creatine + Water check', type:'personal' },
  { time:'8:00 PM', task:'Update class notes (Mon, Thu)', type:'startup', sub:'2×/week' },
  { time:'8:30 PM', task:'📖 Read 30 min', type:'personal' },
  { time:'9:00 PM', task:'Wash clothes (Mon, Wed, Sat)', type:'personal', sub:'3×/week' },
  { time:'9:30 PM', task:'Room cleaning (Tue, Sat)', type:'personal', sub:'2×/week' },
  { time:'10:00 PM', task:'Night brush + Skin care', type:'personal' },
  { time:'10:15 PM', task:'🌙 Plan tomorrow', type:'personal' },
  { time:'10:30 PM', task:'Sleep', type:'personal' },
];
document.getElementById('modeBadge').textContent = isJuly ? 'JULY MODE' : 'JUNE MODE';
document.getElementById('timeline').innerHTML = SCHEDULE.map((s,i) => `
  <div class="tl-item">
    <div class="tl-sleeper"></div>
    <div class="tl-station type-${s.type}"></div>
    <div class="tl-time">${s.time}</div>
    <div class="tl-task">${s.task}</div>
    ${s.sub ? `<div class="tl-sub">${s.sub}</div>` : ''}
  </div>`).join('');

/* ══════════════════════════════════════════════
   PAGE 2 — CHECKLIST
══════════════════════════════════════════════ */
const TASKS = [
  { id:'brush_am',  label:'Brush teeth (AM)',         tag:'Daily',     cat:'Morning Routine' },
  { id:'jawline',   label:'Jawline exercise',          tag:'Daily',     cat:'Morning Routine' },
  { id:'face_steam',label:'Face steam',                tag:'4×/week',   cat:'Morning Routine' },
  { id:'startup',   label:'💼 Startup work',             tag:isJuly?'2-3hr':'5hr', cat:'Work & Content' },
  { id:'ig_content',label:'📱 IG gym content',           tag:'3×/week',   cat:'Work & Content' },
  { id:'yt_video',  label:'🎬 YouTube video',            tag:isJuly?'2×/week':'3×/week', cat:'Work & Content' },
  { id:'blog',      label:'✍️ Blog post',                tag:'2×/week',   cat:'Work & Content' },
  { id:'yt_pd',     label:'📺 YT personal dev/English', tag:'3hr/week',  cat:'Work & Content' },
  { id:'gym',       label:'🏋️ Gym — 2 hrs evening',     tag:'Daily',     cat:'Fitness' },
  { id:'read30',    label:'📖 Read 30 min',              tag:'Daily',     cat:'Personal Growth' },
  { id:'notes_upd', label:'📓 Update class notes',       tag:'2×/week',   cat:'Personal Growth' },
  { id:'wash_clothes',label:'👕 Wash clothes',           tag:'3×/week',   cat:'Chores' },
  { id:'room_clean',label:'🧹 Room cleaning',            tag:'2×/week',   cat:'Chores' },
  { id:'brush_pm',  label:'Brush teeth (PM)',            tag:'Daily',     cat:'Night Routine' },
  { id:'plan_tmr',  label:'🌙 Plan tomorrow',            tag:'Daily',     cat:'Night Routine' },
];
function renderChecklist() {
  const td = S.tasks[todayKey];
  const cats = [...new Set(TASKS.map(t => t.cat))];
  let html = '';
  cats.forEach(cat => {
    html += `<div class="check-section-hdr">${cat}</div>`;
    TASKS.filter(t => t.cat === cat).forEach(t => {
      const done = !!td[t.id];
      html += `<div class="task-item${done?' done':''}" onclick="toggleTask('${t.id}')">
        <div class="task-check"></div>
        <span class="task-label">${t.label}</span>
        <span class="task-tag">${t.tag}</span>
      </div>`;
    });
  });
  document.getElementById('taskList').innerHTML = html;
  const dc = Object.values(td).filter(Boolean).length;
  const pct = Math.round((dc / TASKS.length) * 100);
  document.getElementById('taskPct').textContent = `${dc} / ${TASKS.length}`;
  document.getElementById('taskBar').style.width = pct + '%';
}
function toggleTask(id) {
  S.tasks[todayKey][id] = !S.tasks[todayKey][id];
  save(); renderChecklist();
}
document.getElementById('tomorrowNotes').value = S.notes[todayKey] || '';
function saveNotes() {
  S.notes[todayKey] = document.getElementById('tomorrowNotes').value;
  save();
  const btn = event.target; btn.textContent = 'SAVED ✓';
  setTimeout(() => btn.textContent = 'SAVE PLAN', 1500);
}

/* ══════════════════════════════════════════════
   PAGE 3 — DIET TRACKER (AI POWERED)
══════════════════════════════════════════════ */
const SUPPS_DEF = [
  { id:'mass_gainer', label:'Mass Gainer — 2 bottles taken' },
  { id:'creatine',    label:'Creatine 5g taken' },
  { id:'water4l',     label:'Drank 4 litres of water' },
];
function renderDiet() {
  const meals = S.meals[todayKey];
  let html = '';
  meals.forEach((m, i) => {
    html += `<div class="meal-entry">
      <div class="meal-header">
        <span class="meal-no">MEAL ${i+1}</span>
        <span class="meal-time">${m.time}</span>
      </div>
      <div style="font-size:.82rem;color:var(--accent2)">${m.food} · <span style="color:var(--muted)">${m.qty} ${m.unit}</span></div>
      ${m.result ? renderMealResult(m.result) : `<div class="loading-txt">Analysing<span class="loading-dots"></span></div>`}
    </div>`;
  });
  document.getElementById('mealList').innerHTML = html;
  // Supps
  let sh = '';
  SUPPS_DEF.forEach(s => {
    const checked = !!S.supps[todayKey][s.id];
    sh += `<div class="supp-item${checked?' checked':''}" onclick="toggleSupp('${s.id}')">
      <div class="supp-check"></div>
      <span style="font-size:.84rem">${s.label}</span>
    </div>`;
  });
  document.getElementById('suppChecks').innerHTML = sh;
}
function renderMealResult(r) {
  const chips = Object.entries(r).map(([k,v]) => `<div class="macro-chip">${k}: ${v}</div>`).join('');
  return `<div class="meal-result"><div class="macro-chips">${chips}</div></div>`;
}
function toggleSupp(id) {
  S.supps[todayKey][id] = !S.supps[todayKey][id];
  save(); renderDiet();
}
async function logFood() {
  const food = document.getElementById('foodName').value.trim();
  const qty = document.getElementById('foodQty').value.trim();
  const unit = document.getElementById('foodUnit').value;
  const time = document.getElementById('foodTime').value || new Date().toTimeString().slice(0,5);
  if (!food || !qty) { alert('Enter food name and quantity'); return; }
  const mealNo = S.meals[todayKey].length + 1;
  const entry = { food, qty, unit, time, result: null };
  S.meals[todayKey].push(entry);
  save(); renderDiet();
  document.getElementById('foodName').value = '';
  document.getElementById('foodQty').value = '';
  // AI analyse
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Analyse the nutritional content of: ${qty} ${unit} of ${food}.
Return ONLY a JSON object (no markdown, no explanation) with these exact keys:
Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium, Calcium, Iron, Vitamin_C, Vitamin_A, Potassium.
Use units like "320 kcal", "18g", "2mg" etc. Be as accurate as possible.`
        }]
      })
    });
    const data = await res.json();
    const txt = data.content?.find(b => b.type === 'text')?.text || '{}';
    const clean = txt.replace(/```json|```/g,'').trim();
    entry.result = JSON.parse(clean);
  } catch(e) {
    entry.result = { Error: 'Analysis failed' };
  }
  save(); renderDiet();
}
async function endOfDay() {
  const meals = S.meals[todayKey];
  if (!meals.length) { alert('No meals logged today.'); return; }
  document.getElementById('daySummary').innerHTML = `<div class="day-summary-box"><div class="loading-txt">Calculating full day summary<span class="loading-dots"></span></div></div>`;
  // sum up
  let totals = { Calories:0, Protein:0, Carbs:0, Fat:0, Fiber:0, Sugar:0 };
  let vitDetails = {};
  meals.forEach(m => {
    if (!m.result) return;
    const parseN = v => parseFloat((v+'').replace(/[^0-9.]/g,'')) || 0;
    Object.entries(m.result).forEach(([k,v]) => {
      if (totals[k] !== undefined) totals[k] += parseN(v);
      else vitDetails[k] = (vitDetails[k] || '') ? vitDetails[k] + ' + ' + v : v;
    });
  });
  const mealSummaryText = meals.map((m,i) => `Meal ${i+1}: ${m.qty}${m.unit} ${m.food} at ${m.time}`).join('\n');
  let aiAnalysis = '';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `I am Vignesh, 75kg, 187cm, ectomorph, trying to build muscle (bulk). My daily targets: 3200 kcal, 150g protein, 4L water.
Today I ate:
${mealSummaryText}
Total approximate: Calories ${Math.round(totals.Calories)} kcal, Protein ${Math.round(totals.Protein)}g, Carbs ${Math.round(totals.Carbs)}g, Fat ${Math.round(totals.Fat)}g.
Write a short (4-5 sentences) nutrition analysis for today: did I hit targets? What was good? What to improve tomorrow? Keep it direct and motivating.`
        }]
      })
    });
    const data = await res.json();
    aiAnalysis = data.content?.find(b => b.type === 'text')?.text || '';
  } catch(e) {}
  const suppStatus = SUPPS_DEF.map(s => `${S.supps[todayKey][s.id] ? '✅' : '❌'} ${s.label}`).join('<br>');
  document.getElementById('daySummary').innerHTML = `
    <div class="day-summary-box">
      <div class="section-title">📋 DAY SUMMARY</div>
      <div class="summary-grid">
        <div class="summary-tile"><div class="summary-val">${Math.round(totals.Calories)}</div><div class="summary-lbl">Calories</div></div>
        <div class="summary-tile"><div class="summary-val">${Math.round(totals.Protein)}g</div><div class="summary-lbl">Protein</div></div>
        <div class="summary-tile"><div class="summary-val">${Math.round(totals.Carbs)}g</div><div class="summary-lbl">Carbs</div></div>
        <div class="summary-tile"><div class="summary-val">${Math.round(totals.Fat)}g</div><div class="summary-lbl">Fat</div></div>
        <div class="summary-tile"><div class="summary-val">${Math.round(totals.Fiber)}g</div><div class="summary-lbl">Fiber</div></div>
        <div class="summary-tile"><div class="summary-val">${meals.length}</div><div class="summary-lbl">Meals</div></div>
      </div>
      <div style="margin-top:14px;font-size:.78rem;color:var(--muted);line-height:1.6">${suppStatus}</div>
      ${aiAnalysis ? `<div style="margin-top:14px;padding:12px;background:rgba(255,255,255,0.05);border-radius:10px;border:1px solid rgba(255,255,255,0.1);font-size:.8rem;line-height:1.65;color:var(--accent2)">${aiAnalysis}</div>` : ''}
    </div>`;
}

/* ══════════════════════════════════════════════
   PAGE 4 — GYM TRACKER
══════════════════════════════════════════════ */
const MUSCLE_GROUPS = ['Chest','Back','Shoulders','Biceps','Triceps','Arms','Legs','Abs','Rest Day'];
const EXERCISE_MAP = {
  Chest:    ['Bench Press','Incline DB Press','Cable Fly','Push-ups','Chest Dips'],
  Back:     ['Deadlift','Lat Pulldown','Bent-Over Row','Seated Cable Row','Pull-ups'],
  Shoulders:['Overhead Press','Lateral Raise','Front Raise','Face Pull','Arnold Press'],
  Biceps:   ['Barbell Curl','Hammer Curl','Concentration Curl','Cable Curl','Preacher Curl'],
  Triceps:  ['Skull Crusher','Tricep Pushdown','Overhead Extension','Close-Grip Bench','Dips'],
  Arms:     ['Barbell Curl','Hammer Curl','Tricep Pushdown','Skull Crusher','Cable Curl'],
  Legs:     ['Squat','Leg Press','Romanian Deadlift','Leg Curl','Calf Raise'],
  Abs:      ['Crunches','Plank','Leg Raise','Russian Twist','Cable Crunch'],
  'Rest Day':[],
};
const QUOTES = [
  { q:"The only bad workout is the one that didn't happen.", a:"— Unknown" },
  { q:"Rest is not quitting, it's recovery. Come back stronger.", a:"— Unknown" },
  { q:"Champions are built in the off days too.", a:"— Unknown" },
  { q:"Your body is your most priceless possession. Rest it well.", a:"— Jack LaLanne" },
  { q:"One day of rest is not failure. It's strategy.", a:"— Unknown" },
];
let selectedMuscles = [];
let exercises = [];
function renderGym() {
  document.getElementById('muscleGrid').innerHTML = MUSCLE_GROUPS.map(m =>
    `<div class="muscle-chip${selectedMuscles.includes(m)?' selected':''}" onclick="toggleMuscle('${m}')">${m}</div>`
  ).join('');
}
function toggleMuscle(m) {
  if (m === 'Rest Day') { selectedMuscles = ['Rest Day']; }
  else {
    selectedMuscles = selectedMuscles.filter(x => x !== 'Rest Day');
    if (selectedMuscles.includes(m)) selectedMuscles = selectedMuscles.filter(x => x !== m);
    else if (selectedMuscles.length < 3) selectedMuscles.push(m);
  }
  renderGym();
}
function gymYes() {
  document.getElementById('gymGate').style.display = 'none';
  document.getElementById('gymTracker').style.display = 'block';
}
function gymNo() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('gymGate').style.display = 'none';
  document.getElementById('gymMotivation').style.display = 'block';
  document.getElementById('motivQuote').textContent = q.q;
  document.getElementById('motivAuthor').textContent = q.a;
}
function resetGym() {
  selectedMuscles = []; exercises = [];
  document.getElementById('gymGate').style.display = 'block';
  document.getElementById('gymMotivation').style.display = 'none';
  document.getElementById('gymTracker').style.display = 'none';
  document.getElementById('gymStep1').style.display = 'block';
  document.getElementById('gymStep2').style.display = 'none';
  renderGym();
}
function confirmMuscles() {
  if (!selectedMuscles.length) { alert('Select at least one'); return; }
  if (selectedMuscles.includes('Rest Day')) {
    gymNo(); document.getElementById('gymTracker').style.display='none'; return;
  }
  exercises = [...new Set(selectedMuscles.flatMap(m => EXERCISE_MAP[m] || []))];
  document.getElementById('gymStep1').style.display = 'none';
  document.getElementById('gymStep2').style.display = 'block';
  document.getElementById('gymDayLabel').textContent = selectedMuscles.join(' + ');
  renderExercises();
}
function renderExercises() {
  document.getElementById('exerciseList').innerHTML = exercises.map((ex, ei) => `
    <div class="exercise-block" id="exBlock${ei}">
      <div class="ex-header">
        <span class="ex-name">${ex}</span>
        <button class="btn" style="font-size:.7rem;padding:4px 10px" onclick="addSet(${ei})">+ SET</button>
      </div>
      <table class="sets-table">
        <thead><tr><th>Set</th><th>Reps</th><th>Weight (kg)</th><th>Rest (s)</th></tr></thead>
        <tbody id="setRows${ei}">
          <tr>
            <td>1</td>
            <td><input type="number" placeholder="12" onchange="updateStats()"></td>
            <td><input type="number" placeholder="0" onchange="updateStats()"></td>
            <td><input type="number" placeholder="60" onchange="updateStats()"></td>
          </tr>
        </tbody>
      </table>
    </div>`).join('');
  updateStats();
}
function addSet(ei) {
  const tbody = document.getElementById('setRows' + ei);
  const rowN = tbody.rows.length + 1;
  const tr = tbody.insertRow();
  tr.innerHTML = `<td>${rowN}</td>
    <td><input type="number" placeholder="12" onchange="updateStats()"></td>
    <td><input type="number" placeholder="0" onchange="updateStats()"></td>
    <td><input type="number" placeholder="60" onchange="updateStats()"></td>`;
}
function addCustomEx() {
  const nm = document.getElementById('customExName').value.trim();
  if (!nm) return;
  exercises.push(nm);
  document.getElementById('customExName').value = '';
  renderExercises();
}
function updateStats() {
  let sets=0,reps=0,vol=0;
  document.querySelectorAll('.sets-table tbody tr').forEach(tr => {
    const ins = tr.querySelectorAll('input');
    const r = parseFloat(ins[0]?.value)||0;
    const w = parseFloat(ins[1]?.value)||0;
    if (r>0) { sets++; reps+=r; vol+=r*w; }
  });
  document.getElementById('statSets').textContent = sets;
  document.getElementById('statReps').textContent = reps;
  document.getElementById('statVol').textContent = Math.round(vol);
  renderVolChart(vol);
}
function renderVolChart(todayVol) {
  const history = S.workouts || {};
  const bars = [];
  for (let i=6; i>=1; i--) {
    const d = new Date(TODAY); d.setDate(TODAY.getDate()-i);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    bars.push({ lbl: DAYS[d.getDay()], vol: history[k]?.volume || 0 });
  }
  bars.push({ lbl: 'Today', vol: todayVol });
  const maxV = Math.max(...bars.map(b=>b.vol), 1);
  document.getElementById('volChart').innerHTML = bars.map(b => {
    const h = Math.max(4, Math.round((b.vol/maxV)*70));
    return `<div class="bar-col">
      <div style="font-size:.58rem;color:var(--muted)">${b.vol>0?Math.round(b.vol):''}</div>
      <div class="bar" style="height:${h}px;${b.lbl==='Today'?'background:rgba(255,255,255,0.7)':''}"></div>
      <div class="bar-lbl">${b.lbl}</div>
    </div>`;
  }).join('');
}
function saveWorkout() {
  let sets=0,reps=0,vol=0;
  document.querySelectorAll('.sets-table tbody tr').forEach(tr => {
    const ins = tr.querySelectorAll('input');
    const r = parseFloat(ins[0]?.value)||0;
    const w = parseFloat(ins[1]?.value)||0;
    if (r>0) { sets++; reps+=r; vol+=r*w; }
  });
  S.workouts[todayKey] = { muscles: selectedMuscles, sets, reps, volume: Math.round(vol), date: TODAY.toISOString() };
  save();
  const btn = event.target; btn.textContent = 'SAVED ✓';
  setTimeout(() => btn.textContent = 'SAVE WORKOUT', 1500);
  renderVolChart(vol);
  //hai
}

// init
renderChecklist();
renderDiet();
renderGym();