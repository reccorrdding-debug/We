/* ====== НАСТРОЙКИ — меняй здесь ====== */
const CONFIG = {
  passwords: ['кися', 'девушка', 'любовь', 'кошко'], // подходит любой (регистр не важен)
  passwordHint: 'Кто ты для меня?',
  startDate: '2026-09-19T00:00:00',   // с какого момента вы вместе (счётчик)
  firstDate: '2026-08-06',            // дата первого свидания (плашка в разделе)
  heartsEnabled: true
};
/* ===================================== */

const $ = id => document.getElementById(id);

/* Пароль */
const gate = $('gate'), gateInput = $('gateInput');
$('gateHint').textContent = CONFIG.passwordHint;

function unlock(){
  gate.classList.add('open');
  document.body.classList.remove('locked');
  startMusic();
}

$('gateForm').addEventListener('submit', e => {
  e.preventDefault();
  if(CONFIG.passwords.includes(gateInput.value.trim().toLowerCase())){
    unlock();
  } else {
    $('gateError').textContent = 'Неверный код, попробуй ещё раз';
    const box = $('gateForm');
    box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
    gateInput.select();
  }
});

/* Счётчик «мы вместе» */
const start = new Date(CONFIG.startDate);
function tick(){
  const now = new Date();
  let y = now.getFullYear() - start.getFullYear();
  let m = now.getMonth() - start.getMonth();
  let d = now.getDate() - start.getDate();
  let h = now.getHours() - start.getHours();
  let mi = now.getMinutes() - start.getMinutes();
  let s = now.getSeconds() - start.getSeconds();
  if(s < 0){ s += 60; mi--; }
  if(mi < 0){ mi += 60; h--; }
  if(h < 0){ h += 24; d--; }
  if(d < 0){ d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); m--; }
  if(m < 0){ m += 12; y--; }
  $('cY').parentElement.hidden = (y === 0);
  $('cY').textContent = y; $('cM').textContent = m; $('cD').textContent = d;
  $('cH').textContent = h; $('cMin').textContent = mi; $('cS').textContent = s;
}
tick(); setInterval(tick, 1000);

/* Дата первого свидания в плашке */
const dateEl = $('datePill');
const [fy, fm, fd] = CONFIG.firstDate.split('-');
dateEl.textContent = `Дата: ${fd}.${fm}.${fy}`;

/* Музыка */
const audio = $('audio'), musicBtn = $('music');
function setMusicUI(on){ musicBtn.classList.toggle('on', on); }
let userPaused = false;
function startMusic(){ audio.volume = .5; audio.play().then(() => setMusicUI(true)).catch(() => setMusicUI(false)); }
/* если браузер заблокировал автозапуск — музыка включится при первом касании */
['click','touchstart','keydown'].forEach(ev => document.addEventListener(ev, () => { if(audio.paused && !userPaused && !document.body.classList.contains('locked')) startMusic(); }, {once:false}));
musicBtn.addEventListener('click', () => {
  if(audio.paused){ userPaused = false; startMusic(); } else { userPaused = true; audio.pause(); setMusicUI(false); }
});

/* Падающие сердечки */
if(CONFIG.heartsEnabled){
  const box = $('hearts'), symbols = ['♡','♥','❤'];
  setInterval(() => {
    if(document.hidden || document.body.classList.contains('locked')) return;
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    const dur = 7 + Math.random()*6;
    h.style.cssText = `left:${Math.random()*100}%;font-size:${12+Math.random()*20}px;animation-duration:${dur}s`;
    box.appendChild(h);
    setTimeout(() => h.remove(), dur*1000);
  }, 700);
}

/* Фото: если файла нет — прячем битую иконку, остаётся градиент */
document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }));

/* Галерея: просмотр фото */
const lb = $('lightbox'), lbImg = lb.querySelector('img');
$('gallery').addEventListener('click', e => {
  const img = e.target.closest('figure')?.querySelector('img');
  if(!img || img.style.visibility === 'hidden') return;
  lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false;
});
lb.addEventListener('click', () => { lb.hidden = true; });
document.addEventListener('keydown', e => { if(e.key === 'Escape') lb.hidden = true; });
