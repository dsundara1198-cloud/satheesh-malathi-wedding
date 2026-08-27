const gate = document.getElementById('gate');
const envelope = document.getElementById('envelope');
const invitation = document.getElementById('invitation');
const seal = document.getElementById('seal');
const progress = document.getElementById('progress');

function openInvitation(){
  if(envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  setTimeout(()=>{
    gate.classList.add('hidden');
    invitation.classList.remove('is-locked');
    invitation.classList.add('is-live');
    window.scrollTo({top:0,behavior:'instant'});
    revealVisible();
    startPetals();
  }, 950);
}
envelope.addEventListener('click', openInvitation);
envelope.addEventListener('keydown', e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInvitation()}});
seal.addEventListener('click', e=>{e.stopPropagation();openInvitation()});

// Scroll reveal
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting) entry.target.classList.add('visible');
}),{threshold:.12,rootMargin:'0px 0px -40px'});
function revealVisible(){document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}

window.addEventListener('scroll',()=>{
  const doc=document.documentElement;
  const max=doc.scrollHeight-window.innerHeight;
  progress.style.width=max>0?`${(window.scrollY/max)*100}%`:'0%';
},{passive:true});

// Countdown: 13 Sep 2026, 07:30 IST (UTC+05:30)
const target = new Date('2026-09-13T07:30:00+05:30').getTime();
function updateCountdown(){
  let diff=Math.max(0,target-Date.now());
  const d=Math.floor(diff/86400000); diff%=86400000;
  const h=Math.floor(diff/3600000); diff%=3600000;
  const m=Math.floor(diff/60000); diff%=60000;
  const s=Math.floor(diff/1000);
  document.getElementById('days').textContent=String(d).padStart(2,'0');
  document.getElementById('hours').textContent=String(h).padStart(2,'0');
  document.getElementById('minutes').textContent=String(m).padStart(2,'0');
  document.getElementById('seconds').textContent=String(s).padStart(2,'0');
}
updateCountdown();setInterval(updateCountdown,1000);

// Touch/mouse scratch card
const canvas=document.getElementById('scratchCanvas');
const card=document.getElementById('scratchCard');
const status=document.getElementById('scratchStatus');
const label=document.getElementById('scratchLabel');
const ctx=canvas.getContext('2d',{willReadFrequently:true});
let drawing=false, scratched=0, completed=false;
function resizeCanvas(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const r=card.getBoundingClientRect();
  canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);
  canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const grad=ctx.createLinearGradient(0,0,r.width,r.height);grad.addColorStop(0,'#d0a4a6');grad.addColorStop(.5,'#a96d72');grad.addColorStop(1,'#d9b2ad');
  ctx.globalCompositeOperation='source-over';ctx.fillStyle=grad;ctx.fillRect(0,0,r.width,r.height);
  ctx.fillStyle='rgba(255,255,255,.12)';
  for(let i=0;i<180;i++){ctx.beginPath();ctx.arc(Math.random()*r.width,Math.random()*r.height,Math.random()*1.7+.3,0,Math.PI*2);ctx.fill()}
  ctx.font='600 12px DM Sans';ctx.textAlign='center';ctx.fillStyle='rgba(255,248,242,.9)';ctx.fillText('A LITTLE LOVE IS WAITING',r.width/2,r.height/2+80);
  scratched=0;completed=false;label.style.opacity='1';status.textContent='Keep going — reveal a little more.';
}
function point(e){const r=canvas.getBoundingClientRect();const p=e.touches?e.touches[0]:e;return{x:p.clientX-r.left,y:p.clientY-r.top}}
function scratch(e){if(!drawing||completed)return;e.preventDefault();const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(p.x,p.y,28,0,Math.PI*2);ctx.fill();scratched++;
  if(scratched%10===0) checkScratch();
}
function checkScratch(){
  const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let transparent=0;
  for(let i=3;i<data.length;i+=32) if(data[i]<30) transparent++;
  const ratio=transparent/(data.length/32);
  if(ratio>.58&&!completed){completed=true;label.style.opacity='0';status.textContent='✨ You revealed it! Let the celebrations begin.';celebrate();}
}
canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);scratch(e)});
canvas.addEventListener('pointermove',scratch);canvas.addEventListener('pointerup',e=>{drawing=false;checkScratch()});canvas.addEventListener('pointercancel',()=>drawing=false);
window.addEventListener('resize',()=>{if(invitation.classList.contains('is-live'))resizeCanvas()});
setTimeout(resizeCanvas,1100);

function celebrate(){for(let i=0;i<14;i++){const el=document.createElement('span');el.textContent=['♥','✦','✧'][i%3];el.style.position='fixed';el.style.left=(40+Math.random()*20)+'vw';el.style.top='48vh';el.style.zIndex=80;el.style.color=i%2?'#b95d55':'#a87926';el.style.fontSize=(12+Math.random()*18)+'px';el.style.pointerEvents='none';document.body.appendChild(el);el.animate([{transform:'translate(0,0) scale(.7)',opacity:1},{transform:`translate(${(Math.random()-.5)*260}px,${-80-Math.random()*220}px) rotate(${Math.random()*180-90}deg)`,opacity:0}],{duration:1000+Math.random()*600,easing:'cubic-bezier(.2,.7,.2,1)'}).onfinish=()=>el.remove();}}

// WhatsApp RSVP
const form=document.getElementById('wishForm');
form.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('guestName').value.trim();const message=document.getElementById('guestMessage').value.trim();if(!name||!message)return;const text=`Hello Satheesh & Malathi! ❤️\n\nMy name is ${name}.\n\nMy wishes for you:\n${message}\n\nWishing you both a lifetime of love, happiness and beautiful memories! 💍✨`;window.open(`https://wa.me/919514216803?text=${encodeURIComponent(text)}`,'_blank','noopener');});

// Light floating petals after opening
function startPetals(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const layer=document.querySelector('.petal-layer');
  setInterval(()=>{
    if(document.hidden)return;const p=document.createElement('span');p.className='petal';p.textContent=Math.random()>.35?'✿':'♥';p.style.left=(Math.random()*100)+'vw';p.style.setProperty('--drift',((Math.random()-.5)*160)+'px');p.style.animationDuration=(7+Math.random()*7)+'s';p.style.fontSize=(9+Math.random()*9)+'px';layer.appendChild(p);setTimeout(()=>p.remove(),15000);
  },900);
}
