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
let drawing=false, scratchStrokes=0, strokeMoved=false, completed=false;
const MAX_SCRATCHES=5;
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
  scratchStrokes=0;strokeMoved=false;completed=false;label.style.opacity='1';status.textContent='Keep going — reveal a little more.';
}
function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function scratch(e){
  if(!drawing||completed)return;
  e.preventDefault();
  const p=point(e);
  strokeMoved=true;
  ctx.globalCompositeOperation='destination-out';
  ctx.lineWidth=56;
  ctx.lineCap='round';
  ctx.lineJoin='round';
  ctx.beginPath();
  if(scratch.lastPoint){
    ctx.moveTo(scratch.lastPoint.x,scratch.lastPoint.y);
    ctx.lineTo(p.x,p.y);
  }else{
    ctx.moveTo(p.x,p.y);
    ctx.lineTo(p.x+0.1,p.y+0.1);
  }
  ctx.stroke();
  scratch.lastPoint=p;
}
function revealCompletely(){
  completed=true;
  drawing=false;
  strokeMoved=false;
  scratch.lastPoint=null;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  label.style.opacity='0';
  status.textContent='✨ You revealed it! Let the celebrations begin.';
  celebrate();
}
canvas.addEventListener('pointerdown',e=>{
  if(completed)return;
  drawing=true;
  strokeMoved=false;
  scratch.lastPoint=null;
  canvas.setPointerCapture(e.pointerId);
  scratch(e);
});
canvas.addEventListener('pointermove',scratch);
canvas.addEventListener('pointerup',e=>{
  if(!drawing)return;
  drawing=false;
  scratch.lastPoint=null;
  if(strokeMoved){
    scratchStrokes++;
    if(scratchStrokes>=MAX_SCRATCHES){
      revealCompletely();
    }
  }
});
canvas.addEventListener('pointercancel',()=>{
  drawing=false;
  scratch.lastPoint=null;
});
window.addEventListener('resize',()=>{if(invitation.classList.contains('is-live'))resizeCanvas()});
setTimeout(resizeCanvas,1100);

// WhatsApp RSVP
const form=document.getElementById('wishForm');
form.querySelectorAll('.wish-button').forEach(button=>button.addEventListener('click',()=>{const name=document.getElementById('guestName').value.trim();const message=document.getElementById('guestMessage').value.trim();if(!name||!message){form.reportValidity();return;}const recipient=button.dataset.recipient;const isBride=recipient==='bride';const person=isBride?'Malathi':'Satheesh';const number=isBride?'919514216803':'919360005460';const text=`Hello ${person}! ❤️\n\nMy name is ${name}.\n\nMy wishes for you:\n${message}\n\nWishing you a lifetime of love, happiness and beautiful memories! 💍✨`;window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`,'_blank','noopener');}));

// Light floating petals after opening
function startPetals(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const layer=document.querySelector('.petal-layer');
  setInterval(()=>{
    if(document.hidden)return;const p=document.createElement('span');p.className='petal';p.textContent=Math.random()>.35?'✿':'♥';p.style.left=(Math.random()*100)+'vw';p.style.setProperty('--drift',((Math.random()-.5)*160)+'px');p.style.animationDuration=(7+Math.random()*7)+'s';p.style.fontSize=(9+Math.random()*9)+'px';layer.appendChild(p);setTimeout(()=>p.remove(),15000);
  },900);
}
