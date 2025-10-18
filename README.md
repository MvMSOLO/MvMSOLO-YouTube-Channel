<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>David — Fun & Professional Portfolio + Daily Riddle</title>
<meta name="description" content="Professional mini-portfolio with a daily riddle quiz. Built to impress friends and recruiters." />
<link rel="icon" href="data:;base64,iVBORw0KGgo=">

<style>
  :root{
    --bg:#0f1724;
    --card:#0b1220;
    --muted:#94a3b8;
    --accent:#6ee7b7;
    --accent-2:#60a5fa;
    --glass: rgba(255,255,255,0.03);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  }
  *{box-sizing:border-box}
  body{
    margin:0;
    background:linear-gradient(180deg,#071023 0%, var(--bg) 100%);
    color:#e6eef8;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:32px;
  }
  .wrap{
    width:100%;
    max-width:980px;
    display:grid;
    grid-template-columns: 360px 1fr;
    gap:28px;
  }
  .card{
    background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border-radius:14px;
    padding:20px;
    box-shadow: 0 6px 24px rgba(2,6,23,0.6);
    border:1px solid rgba(255,255,255,0.03);
  }
  .profile{
    display:flex;
    gap:14px;
    align-items:center;
  }
  .avatar{
    width:76px;height:76px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--accent-2));
    display:flex;align-items:center;justify-content:center;font-weight:700;font-size:26px;color:#022;
    box-shadow: 0 6px 18px rgba(60,100,255,0.08);
  }
  h1{margin:0;font-size:20px}
  p.muted{color:var(--muted);margin:8px 0 0;font-size:13px}
  .links{margin-top:14px;display:flex;flex-wrap:wrap;gap:8px}
  .btn{
    background:var(--glass);border-radius:10px;padding:8px 12px;font-weight:600;color:var(--accent-2);border:1px solid rgba(255,255,255,0.02);
    text-decoration:none;font-size:13px;
  }
  .btn.ghost{color:var(--muted);border:1px dashed rgba(255,255,255,0.02)}
  .stats{margin-top:18px;padding:12px;border-radius:10px;background:linear-gradient(180deg, rgba(255,255,255,0.01), transparent);}
  .stat-row{display:flex;justify-content:space-between;margin:8px 0;color:var(--muted);font-size:14px}
  .game-area{display:flex;flex-direction:column;gap:12px}
  .riddle{font-size:18px;padding:12px;background:linear-gradient(180deg, rgba(255,255,255,0.015), transparent);border-radius:10px}
  .options{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .opt{
    padding:10px;border-radius:8px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.02);
    cursor:pointer;font-weight:600;color:var(--muted);transition:all .18s;
  }
  .opt:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(2,6,23,0.6)}
  .opt.correct{background:linear-gradient(90deg, rgba(110,231,183,0.12), rgba(96,165,250,0.08));color:var(--accent)}
  .opt.wrong{background:rgba(255,60,60,0.06);color:#ff9aa2}
  .controls{display:flex;gap:10px;align-items:center;justify-content:space-between;margin-top:6px}
  .small{font-size:13px;color:var(--muted)}
  .footer{margin-top:18px;color:var(--muted);font-size:13px}
  .hero-title{font-size:26px;margin:0 0 6px}
  .center{display:flex;align-items:center;justify-content:center}
  .share{padding:8px 12px;border-radius:10px;background:linear-gradient(90deg,var(--accent),var(--accent-2));color:#022;font-weight:700;border:none;cursor:pointer}
  .streak{font-weight:800;color:var(--accent);font-size:18px}
  @media (max-width:880px){
    .wrap{grid-template-columns:1fr; padding:12px}
  }
</style>
</head>
<body>
  <main class="wrap" role="main">
    <!-- Left column: profile -->
    <section class="card">
      <div class="profile">
        <div class="avatar" id="avatarTxt">D</div>
        <div>
          <h1>David — Full-Stack Tinkerer</h1>
          <p class="muted">Building tiny joyful tools & puzzles. Friendly, a little goofy, actually useful.</p>
        </div>
      </div>

      <div class="links">
        <a class="btn" href="https://github.com/david-dev" target="_blank" rel="noopener">GitHub</a>
        <a class="btn" href="mailto:mirzayevavazbek15@gmail.com">📧 Email</a>
        <a class="btn ghost" href="#" id="resumeBtn">Resume</a>
      </div>

      <div class="stats" id="profileStats">
        <div class="stat-row"><span>Daily Riddle Streak</span><span class="streak" id="streak">0</span></div>
        <div class="stat-row"><span>Total Points</span><span id="points">0</span></div>
        <div class="stat-row"><span>Last Solved</span><span id="lastSolved" class="small">Never</span></div>
      </div>

      <div style="margin-top:12px" class="small">
        Pro-tip: share the challenge with friends — watch who cracks it first. Recruiters love creative profiles.
      </div>
    </section>

    <!-- Right column: game / content -->
    <section class="card">
      <div>
        <h2 class="hero-title">Daily Riddle — Come back tomorrow for a fresh brain-teaser</h2>
        <p class="muted">Solve the mini-quiz to score points. Correct answer = +10. Daily solve gives a streak bonus.</p>
      </div>

      <div class="game-area" style="margin-top:12px">
        <div class="riddle" id="riddleText">Loading today's riddle...</div>
        <div class="options" id="options">
          <!-- option buttons rendered here -->
        </div>

        <div class="controls">
          <div class="small">Question #<span id="qnum">—</span></div>
          <div style="display:flex;gap:8px">
            <button class="btn ghost" id="newRiddleBtn">Random riddle</button>
            <button class="share" id="shareBtn">Share</button>
          </div>
        </div>

        <div class="footer center" style="gap:12px;">
          <div class="small">Score: <strong id="score">0</strong></div>
          <div class="small">Attempts today: <strong id="attempts">0</strong></div>
        </div>
      </div>

      <hr style="margin:16px 0;border:none;border-top:1px solid rgba(255,255,255,0.03)">

      <div>
        <h3 style="margin:0 0 8px">Top mini-features</h3>
        <ul class="small" style="margin:0;padding-left:18px">
          <li>Daily rotating riddle (date-based)</li>
          <li>Local streak & points stored in browser (GitHub Pages-friendly)</li>
          <li>Share a direct link with encoded answer hint</li>
        </ul>
      </div>
    </section>
  </main>

<script>
/*
  Single-file professional mini-portfolio + riddle-quiz.
  Everything is client-side (works on GitHub Pages).
  Customize: edit `RIDDLES` array, avatar initial, links.
*/

const RIDDLES = [
  // Each item: {q, choices:[], a: index, hint}
  { q: "Men oq tunaman, ammo tunda yashayman; odamlarni sevasiz — mening nimam?", choices:["Yorug'lik","Oy","Qalam","Kitob"], a:1, hint:"Men osmonda porlayman." },
  { q: "Qaysi so'zning oxiri har doim suyuq bo'ladi?", choices:["Suv","Sharbat","Shoe","So'z"], a:0, hint:"Men suyuqman." },
  { q: "Doim o’girilib, hech qachon siljimasam, men nima?", choices:["Qo'l soat","Pol","Aylana","Zamin"], a:2, hint:"Men doim aylana." },
  { q: "Bitta bosh, lekin qancha bo’lsa ham oyoq jo’g’ri ishlaydi. Bu nima?", choices:["Stol","Shaxmat","Qalam","Kapalak"], a:0, hint:"Odatda ustiga narsa qo'yiladi." },
  { q: "Bir soatda 60, bir minutda 60 — bu nimaning sanog'i?", choices:["Sekund","Daqiqa","Soat","Zamonaviylik"], a:0, hint:"Bular kichik lahzalar." },
  { q: "U doimo oldinga boradi, lekin hech qachon orqaga qaytmaydi. Bu nima?", choices:["Soat","Kelajak","Bugun","Poyezd"], a:1, hint:"U vaqt bilan bog'liq." }
];

const username = "David";
document.getElementById('avatarTxt').textContent = username[0] || 'D';
document.querySelector('a[href*="github.com"]').href = "https://github.com/david-dev"; // change to real

// Storage keys
const KEY = "riddle_portfolio_v1";
const state = JSON.parse(localStorage.getItem(KEY) || '{}');

const todayKey = () => {
  const d = new Date();
  return d.toISOString().slice(0,10); // YYYY-MM-DD
}

function initState(){
  if(!state.points) state.points = 0;
  if(!state.streak) state.streak = 0;
  if(!state.lastSolved) state.lastSolved = null;
  if(!state.lastVisit) state.lastVisit = null;
  if(!state.todaySolved) state.todaySolved) state.todaySolved = false;
}

try { initState(); } catch(e){ /*noop*/ }

// Save helper
function saveState(){ localStorage.setItem(KEY, JSON.stringify(state)); }

// Choose today's riddle deterministically by date
function todaysRiddle(){
  const d = new Date();
  const seed = parseInt(d.toISOString().slice(0,10).replace(/-/g,''),10);
  const idx = seed % RIDDLES.length;
  return { idx, ...RIDDLES[idx] };
}

// Render riddle and options
let current = null;
function renderRiddle(r){
  current = r;
  document.getElementById('riddleText').textContent = r.q;
  document.getElementById('qnum').textContent = r.idx + 1;
  const opts = document.getElementById('options');
  opts.innerHTML = '';
  r.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.textContent = choice;
    btn.onclick = () => handleAnswer(i, btn);
    opts.appendChild(btn);
  });
}

// Answer handling
function handleAnswer(i, btn){
  const opts = document.querySelectorAll('.opt');
  // disable further clicks
  opts.forEach(o => o.onclick = null);

  const correct = (i === current.a);
  if(correct){
    btn.classList.add('correct');
    const base = 10;
    let gained = base;
    // streak bonus
    const ld = state.lastSolved;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0,10);

    // update daily solve
    const tk = todayKey();
    if(state.lastSolvedDate === tk){
      // already solved today (shouldn't happen because we disable), no bonus
    } else {
      // if lastSolvedDate === yesterdayKey => increment streak
      if(state.lastSolvedDate === yesterdayKey) {
        state.streak = (state.streak || 0) + 1;
        gained += 5; // streak bonus
      } else {
        state.streak = 1;
      }
      state.lastSolvedDate = tk;
      state.points = (state.points || 0) + gained;
      state.lastSolved = new Date().toISOString();
      state.todaySolved = true;
      saveState();
      showToast(`Correct! +${gained} points. Streak: ${state.streak}`);
    }
  } else {
    btn.classList.add('wrong');
    // reveal correct
    const optsEls = document.querySelectorAll('.opt');
    optsEls.forEach((el, idx) => {
      if(idx === current.a) el.classList.add('correct');
    });
    showToast("Nah, that wasn't it. Try tomorrow's riddle or a random one!");
  }
  updateUI();
}

// UI updates
function updateUI(){
  document.getElementById('score').textContent = state.points || 0;
  document.getElementById('streak').textContent = state.streak || 0;
  document.getElementById('points').textContent = state.points || 0;
  document.getElementById('lastSolved').textContent = state.lastSolved ? new Date(state.lastSolved).toLocaleString() : 'Never';
  document.getElementById('attempts').textContent = state.attemptsToday || 0;
}

// Toast for UX
function showToast(msg){
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.right = '18px';
  el.style.bottom = '18px';
  el.style.background = 'linear-gradient(90deg,#6ee7b7,#60a5fa)';
  el.style.color = '#022';
  el.style.padding = '10px 14px';
  el.style.borderRadius = '10px';
  el.style.fontWeight = '700';
  el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 2800);
}

// New random riddle
function randomRiddle(){
  const idx = Math.floor(Math.random()*RIDDLES.length);
  renderRiddle({ idx, ...RIDDLES[idx] });
}

// Share: encode current question index in URL
function shareCurrent(){
  if(!current) return;
  const url = new URL(location.href);
  url.searchParams.set('r', current.idx);
  navigator.clipboard.writeText(url.toString()).then(()=>{
    showToast('Link copied! Send to friends — they can try to beat your streak 😏');
  }).catch(()=> {
    showToast('Could not copy. Here: ' + url.toString());
  });
}

// Handle URL param (r=)
function checkURLParam(){
  const params = new URLSearchParams(location.search);
  const r = params.get('r');
  if(r !== null){
    const idx = parseInt(r,10);
    if(!Number.isNaN(idx) && RIDDLES[idx]) {
      renderRiddle({ idx, ...RIDDLES[idx] });
      return true;
    }
  }
  return false;
}

// daily rendering
function showDailyOrParam(){
  if(!checkURLParam()){
    renderRiddle(todaysRiddle());
  }
}

// init
document.getElementById('shareBtn').addEventListener('click', shareCurrent);
document.getElementById('newRiddleBtn').addEventListener('click', randomRiddle);
document.getElementById('resumeBtn').addEventListener('click', ()=>{
  window.open('https://example.com/resume.pdf','_blank');
});

// daily visit and streak logic on load
(function onLoad(){
  const tk = todayKey();
  if(state.lastVisit !== tk){
    // new day visit
    state.todaySolved = false;
    state.lastVisit = tk;
    saveState();
  }
  showDailyOrParam();
  updateUI();
})();
</script>

</body>
</html>
