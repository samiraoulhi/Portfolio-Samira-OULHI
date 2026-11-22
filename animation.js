/* Animations du portfolio : réseau de neurones + signal nettoyé par la souris,
   apparition au scroll, projecteur sur les cartes, barre de progression. */
(function(){
var hero=document.querySelector('.hero');
// barre de progression
var pb=document.createElement('div');pb.id='progress';document.body.appendChild(pb);
addEventListener('scroll',function(){var h=document.documentElement;pb.style.transform='scaleX('+(h.scrollTop/(h.scrollHeight-h.clientHeight||1))+')'},{passive:true});

// apparition au scroll
var sel='.section-title,.lede,.project-card,.tp-card,.skill-group,.timeline-item,.cert-card,.ref-card,.soft-item,.trio>div,.motivation,.note-inline';
var els=[].slice.call(document.querySelectorAll(sel));
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
 els.forEach(function(el){var sib=[].indexOf.call(el.parentNode.children,el);el.style.transitionDelay=Math.min(sib,6)*90+'ms';el.classList.add('rv');io.observe(el)});
}
// projecteur sur les cartes
document.addEventListener('pointermove',function(e){var t=e.target.closest&&e.target.closest('.skill-group,.tp-card,.project-card,.cert-card,.ref-card,.trio>div,.soft-item');
 if(t){var r=t.getBoundingClientRect();t.style.setProperty('--x',e.clientX-r.left+'px');t.style.setProperty('--y',e.clientY-r.top+'px')}});

// canvas de l'en-tête
if(!hero)return;
var c=document.createElement('canvas');c.id='fx';c.setAttribute('aria-hidden','true');hero.insertBefore(c,hero.firstChild);
var g=c.getContext('2d'),W,H,dpr,P=[],mx=-999,my=-999,t=0,on=true,idle=true;
function size(){dpr=Math.min(devicePixelRatio||1,2);W=hero.clientWidth;H=hero.clientHeight;c.width=W*dpr;c.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);
 var n=Math.min(90,Math.round(W*H/13000));P=[];for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H*.75,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5})}
function f(x){var u=x/W*8+t;return Math.sin(u)*.5+Math.sin(u*2.3+1)*.28+Math.sin(u*.45)*.3}
function nz(x){var k=Math.floor(x/3);var v=Math.sin(k*12.9898+Math.floor(t*60)*78.233)*43758.5453;return v-Math.floor(v)-.5}
function draw(){
 g.clearRect(0,0,W,H);
 if(idle){mx=(t*90%(W+300))-150;my=H*.4}
 // réseau
 for(var i=0;i<P.length;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;
  if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H*.78)p.vy*=-1;
  var dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);
  if(d<140){p.x+=dx/d*1.4;p.y+=dy/d*1.4}
  for(var j=i+1;j<P.length;j++){var q=P[j],l=Math.hypot(p.x-q.x,p.y-q.y);
   if(l<130){g.strokeStyle='rgba(124,108,255,'+(.35*(1-l/130))+')';g.lineWidth=1;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}}
  if(d<190){g.strokeStyle='rgba(53,224,194,'+(.6*(1-d/190))+')';g.beginPath();g.moveTo(p.x,p.y);g.lineTo(mx,my);g.stroke()}
  g.fillStyle=d<190?'#35e0c2':'#7c6cff';g.beginPath();g.arc(p.x,p.y,d<190?3:2,0,6.283);g.fill()}
 // signal : brut en gris, nettoyé en cyan autour du curseur
 var mid=H*.88,amp=H*.07,R=Math.max(160,W*.16);
 g.lineWidth=1.2;g.strokeStyle='rgba(141,147,184,.6)';g.beginPath();
 for(var x=0;x<=W;x+=3){var y=mid+(f(x)+nz(x)*1.1)*amp;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();
 g.lineWidth=2.8;g.strokeStyle='#35e0c2';g.shadowColor='#35e0c2';g.shadowBlur=14;
 for(var x=0;x<=W;x+=3){var a=Math.max(0,1-Math.pow(Math.abs(x-mx)/R,2));
  if(a<.02)continue;g.globalAlpha=a;g.beginPath();g.moveTo(x,mid+(f(x)+nz(x)*1.1*(1-a))*amp);g.lineTo(x+3,mid+(f(x+3)+nz(x+3)*1.1*(1-a))*amp);g.stroke()}
 g.globalAlpha=1;g.shadowBlur=0}
function loop(){if(on){t+=.011;draw()}requestAnimationFrame(loop)}
hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;idle=false});
hero.addEventListener('pointerleave',function(){idle=true});
if('IntersectionObserver' in window)new IntersectionObserver(function(e){on=e[0].isIntersecting}).observe(hero);
addEventListener('resize',size);size();loop();
})();
