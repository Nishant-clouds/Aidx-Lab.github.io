const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- LOADER ---------- */
(function(){
  const ld=document.getElementById('loader'), num=document.getElementById('lnum'), bar=document.getElementById('lbar');
  if(!ld) return;
  if(reduce){ ld.classList.add('done'); document.body.style.overflow=''; return; }
  document.body.style.overflow='hidden';
  let v=0;
  const t=setInterval(()=>{
    v+=Math.random()*9+3;
    if(v>=100){v=100;clearInterval(t);
      setTimeout(()=>{ld.classList.add('done');document.body.style.overflow='';},420);}
    num.textContent=String(Math.floor(v)).padStart(3,'0');
    bar.style.width=v+'%';
  },70);
})();

/* ---------- MODE ---------- */
const lightBtn=document.getElementById('lightBtn');
lightBtn.addEventListener('click',()=>{
  const lite=document.documentElement.getAttribute('data-mode')==='light';
  document.documentElement.setAttribute('data-mode',lite?'dark':'light');
  lightBtn.setAttribute('aria-pressed',lite?'false':'true');
});

/* ---------- MENU ---------- */
const menuBtn=document.getElementById('menuBtn'), links=document.getElementById('links');
menuBtn.addEventListener('click',()=>{
  const o=links.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',o?'true':'false');
});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  links.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');
}));

/* ---------- NAV STUCK + PROGRESS ---------- */
const nav=document.getElementById('nav'), prog=document.getElementById('prog');
addEventListener('scroll',()=>{
  const d=document.documentElement;
  prog.style.width=(d.scrollTop/(d.scrollHeight-d.clientHeight))*100+'%';
  nav.classList.toggle('stuck',scrollY>40);
},{passive:true});

/* ---------- CLOCK (Sydney) ---------- */
(function(){
  const el=document.getElementById('clock'); if(!el) return;
  function tick(){
    try{
      el.textContent=new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())+' SYD';
    }catch(e){ el.textContent='SYD'; }
  }
  tick(); setInterval(tick,20000);
})();

/* ---------- CONTEXTUAL CURSOR ---------- */
(function(){
  if(reduce||matchMedia('(pointer:coarse)').matches) return;
  const c=document.getElementById('cur'), txt=document.getElementById('curTxt');
  let x=0,y=0,cx=0,cy=0;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;c.classList.add('on');});
  (function loop(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(loop);})();
  function bind(sel,label){
    document.querySelectorAll(sel).forEach(el=>{
      el.addEventListener('mouseenter',()=>{c.classList.add('big');txt.textContent=label;});
      el.addEventListener('mouseleave',()=>{c.classList.remove('big');txt.textContent='';});
    });
  }
  bind('.card[data-r]','Open'); bind('.rail','Drag'); bind('a[href]','Go');
  bind('button','Click'); bind('.p-img','View'); bind('input,textarea','Type');
})();

/* ---------- HERO LEXICAL FIELD ---------- */
(function(){
  const cv=document.getElementById('lex'); if(!cv||reduce) return;
  const ctx=cv.getContext('2d');
  const WORDS=['language','corpus','token','bias','dialect','signal','context','meaning',
    'model','data','voice','trust','equity','speech','text','audit'];
  let w,h,ns=[],raf=null;
  const N=innerWidth<760?16:30, D=innerWidth<760?150:210;
  function rgb(){const v=getComputedStyle(document.documentElement).getPropertyValue('--fg').trim().replace('#','');
    const n=parseInt(v.length===3?v.split('').map(s=>s+s).join(''):v,16);return [n>>16&255,n>>8&255,n&255];}
  function size(){const r=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    w=r.width;h=r.height;cv.width=w*dpr;cv.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function build(){ns=Array.from({length:N},(_,i)=>({x:Math.random()*w,y:Math.random()*h,
    vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,t:WORDS[i%WORDS.length],s:Math.random()*.5+.7}));}
  function draw(){
    const [R,G,B]=rgb();
    ctx.clearRect(0,0,w,h);
    ctx.font='400 12px "JetBrains Mono", monospace';
    for(let i=0;i<ns.length;i++){
      const p=ns[i];p.x+=p.vx;p.y+=p.vy;
      if(p.x<10||p.x>w-10)p.vx*=-1; if(p.y<14||p.y>h-10)p.vy*=-1;
      for(let j=i+1;j<ns.length;j++){
        const q=ns[j],d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<D){ctx.strokeStyle=`rgba(${R},${G},${B},${(1-d/D)*.11})`;ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
      }
      ctx.fillStyle=`rgba(${R},${G},${B},${.20*p.s})`;
      ctx.fillText(p.t,p.x+7,p.y+4);
      ctx.fillStyle=`rgba(${R},${G},${B},.34)`;
      ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,7);ctx.fill();
    }
    raf=requestAnimationFrame(draw);
  }
  function start(){size();build();if(raf)cancelAnimationFrame(raf);draw();}
  start();
  let t;addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(start,220);});
  new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){if(!raf)draw();}else{cancelAnimationFrame(raf);raf=null;}
  })).observe(document.getElementById('top'));
})();

/* ---------- TOKENIZER ---------- */
(function(){
  const hl=document.getElementById('headline'),box=document.getElementById('tokens'),
        btn=document.getElementById('tokBtn'),lbl=document.getElementById('tokLbl');
  if(!hl||!box||!btn) return;
  const T=[['Lang',43],['uage',6906],[' is',374],[' infra',55159],['structure',7993],['.',13],
           [' We',1226],[' study',4007],[' who',889],[' it',433],[' serves',17045],['.',13]];
  let built=false;
  function build(){
    box.innerHTML='';
    T.forEach(([s,id],i)=>{
      const e=document.createElement('span');
      e.className='tok'+(/^[.,!?]$/.test(s.trim())?' punc':'');
      e.dataset.k=i%3; e.style.animationDelay=(i*.045)+'s';
      const a=document.createElement('span');a.textContent=s.replace(/^ /,'␣');
      const b=document.createElement('span');b.className='id';b.textContent=id;
      e.append(a,b);box.appendChild(e);
    });
    built=true;
  }
  btn.addEventListener('click',()=>{
    const on=btn.getAttribute('aria-pressed')==='true';
    if(on){box.classList.remove('show');hl.classList.remove('hide');
      btn.setAttribute('aria-pressed','false');lbl.textContent='Tokenize';}
    else{
      if(!built)build();
      else box.querySelectorAll('.tok').forEach((e,i)=>{e.style.animation='none';void e.offsetWidth;
        e.style.animation='';e.style.animationDelay=(i*.045)+'s';});
      hl.classList.add('hide');box.classList.add('show');
      btn.setAttribute('aria-pressed','true');lbl.textContent='Detokenize';
    }
  });
})();

/* ---------- RAIL DRAG ---------- */
(function(){
  const r=document.getElementById('rail'); if(!r) return;
  let down=false,sx=0,sl=0;
  r.addEventListener('pointerdown',e=>{down=true;sx=e.clientX;sl=r.scrollLeft;r.classList.add('drag');});
  addEventListener('pointerup',()=>{down=false;r.classList.remove('drag');});
  r.addEventListener('pointermove',e=>{if(!down)return;r.scrollLeft=sl-(e.clientX-sx);});
})();

/* ---------- REVEAL ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
}),{threshold:.08});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));

/* ---------- COUNTERS ---------- */
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target,t=+el.dataset.t;let v=0;const st=t/34;
  const id=setInterval(()=>{v+=st;if(v>=t){el.textContent=t;clearInterval(id);}else el.textContent=Math.floor(v);},26);
  cio.unobserve(el);
}),{threshold:.6});
document.querySelectorAll('.n').forEach(e=>cio.observe(e));

/* ---------- SCRAMBLE ---------- */
(function(){
  if(reduce) return;
  const CH='ABCDEFGHJKLMNPQRSTUVWXYZ#%&@*+=';
  function run(el){
    const fin=el.dataset.f||el.textContent; el.dataset.f=fin;
    let f=0;
    const q=[...fin].map((c,i)=>({c,s:Math.floor(i*1.3),e:Math.floor(i*1.3)+8+Math.random()*7}));
    const id=setInterval(()=>{
      let out='',done=0;
      q.forEach(o=>{
        if(f>=o.e){out+=o.c;done++;}
        else if(f>=o.s&&o.c.trim())out+=CH[Math.floor(Math.random()*CH.length)];
        else out+=o.c;
      });
      el.textContent=out; if(done===q.length)clearInterval(id); f++;
    },26);
  }
  const so=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){run(e.target);so.unobserve(e.target);}
  }),{threshold:.85});
  document.querySelectorAll('.idx').forEach(e=>so.observe(e));
})();

/* ---------- ACTIVE NAV ---------- */
(function(){
  const as=links.querySelectorAll('a');
  document.querySelectorAll('section[id]').forEach(s=>{
    new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting)as.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id));
    }),{rootMargin:'-45% 0px -50% 0px'}).observe(s);
  });
})();

/* ---------- MARQUEE VELOCITY ---------- */
(function(){
  const t=document.getElementById('marqT'); if(!t||reduce) return;
  let last=scrollY,v=0;
  addEventListener('scroll',()=>{v=Math.min(Math.abs(scrollY-last)*.055,3);last=scrollY;},{passive:true});
  (function loop(){v+=(0-v)*.055;t.style.animationDuration=(38/(1+v))+'s';requestAnimationFrame(loop);})();
})();

/* ---------- MAGNETIC ---------- */
(function(){
  if(reduce||matchMedia('(pointer:coarse)').matches) return;
  document.querySelectorAll('.sbtn,.tokbtn,.soc a,.up,.gbtn').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      el.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.2}px,${(e.clientY-(r.top+r.height/2))*.28}px)`;
    });
    el.addEventListener('mouseleave',()=>{el.style.transform='';});
  });
})();

/* ---------- PAPERS ---------- */
(function(){
  const chips=document.querySelectorAll('#chips .ch'),items=document.querySelectorAll('.pp'),
        q=document.getElementById('q'),cnt=document.getElementById('cnt'),emp=document.getElementById('empty');
  let y='all';
  function apply(){
    const s=(q.value||'').trim().toLowerCase();let n=0;
    items.forEach(it=>{
      const ok=(y==='all'||it.dataset.y===y)&&(!s||it.textContent.toLowerCase().includes(s));
      it.classList.toggle('hide',!ok); if(ok)n++;
    });
    emp.hidden=n!==0; cnt.textContent=`${n} of ${items.length} shown`;
  }
  chips.forEach(b=>b.addEventListener('click',()=>{
    chips.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false');});
    b.classList.add('active');b.setAttribute('aria-pressed','true');y=b.dataset.y;apply();
  }));
  let t;q.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(apply,140);});
  apply();
})();

/* ---------- UP ---------- */
const up=document.getElementById('up');
addEventListener('scroll',()=>up.classList.toggle('show',scrollY>700),{passive:true});
up.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

/* ---------- SHEET ---------- */
(function(){
  const D={
    misinfo:{t:'Misinformation Detection',b:`<p>We build graph-based models that surface coordinated influence operations as they unfold, rather than weeks later.</p><ul><li>Bot-network detection over interaction graphs</li><li>Cross-platform narrative tracking</li><li>Real-time claim matching against fact-check corpora</li></ul><p><strong>Related:</strong> Detecting Coordinated Misinformation Campaigns at Scale — EMNLP 2026.</p>`},
    toxicity:{t:'Toxicity &amp; Abuse',b:`<p>Moderation systems routinely misclassify marginalised dialects as abusive. We build context-aware alternatives and audit the gap.</p><ul><li>Context-sensitive classifiers</li><li>Dialect bias auditing</li><li>Deployment-ready moderation APIs</li></ul><p><strong>Related:</strong> Cross-Lingual Toxicity Detection in Low-Resource Settings — ACL 2026.</p>`},
    lowres:{t:'Low-Resource Languages',b:`<p>Most of the world's languages have no usable NLP support. We build the datasets and models to change that, with the communities involved.</p><ul><li>Community-sourced corpus construction</li><li>Transfer from high-resource languages</li><li>Open model and dataset releases</li></ul><p><strong>Related:</strong> Low-Resource NLP for Under-Documented Languages — ACL 2025.</p>`}
  };
  const sh=document.getElementById('sheet'),bd=document.getElementById('sBody'),cl=document.getElementById('sClose');
  let last=null;
  function open(el){const d=D[el.dataset.r];if(!d)return;
    bd.innerHTML=`<h3 id="sTitle">${d.t}</h3>${d.b}`;sh.classList.add('open');
    sh.setAttribute('aria-hidden','false');last=el;cl.focus();document.body.style.overflow='hidden';}
  function shut(){sh.classList.remove('open');sh.setAttribute('aria-hidden','true');
    document.body.style.overflow='';if(last)last.focus();}
  document.querySelectorAll('.card[data-r]').forEach(el=>{
    el.addEventListener('click',()=>open(el));
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(el);}});
  });
  cl.addEventListener('click',shut);
  sh.addEventListener('click',e=>{if(e.target===sh)shut();});
  addEventListener('keydown',e=>{
    if(e.key==='Escape'&&sh.classList.contains('open'))shut();
    if(e.key==='Tab'&&sh.classList.contains('open')){
      const f=sh.querySelectorAll('button,a[href],input,textarea');if(!f.length)return;
      const a=f[0],z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
      else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
    }
  });
})();
