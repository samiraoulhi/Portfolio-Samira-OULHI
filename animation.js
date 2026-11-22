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
var g=c.getContext('2d'),W,H,dpr,t=0,on=true,idle=true,mx=-999,my=-999,
    L=[4,7,7,5,3],N=[],act=[],pulses=[],k=1;
function size(){dpr=Math.min(devicePixelRatio||1,2);W=hero.clientWidth;H=hero.clientHeight;c.width=W*dpr;c.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);
 var small=W<760,x0=small?.06:.46,x1=small?.94:.95,y0=H*.14,y1=H*(small?.7:.74);k=small?.5:1;
 N=[];act=[];L.forEach(function(n,l){N[l]=[];act[l]=[];for(var i=0;i<n;i++){
  N[l].push({x:W*(x0+(x1-x0)*l/(L.length-1)),y:y0+(y1-y0)*(n==1?.5:i/(n-1)),ph:Math.random()*6.28});act[l].push(0)}});pulses=[]}
function spawn(l,i){if(l>=L.length-1)return;pulses.push({l:l,i:i,j:Math.floor(Math.random()*L[l+1]),p:0,v:.012+Math.random()*.01})}
function pos(n){return{x:n.x,y:n.y+Math.sin(t*1.5+n.ph)*5}}
function f(x){var u=x/W*8+t;return Math.sin(u)*.5+Math.sin(u*2.3+1)*.28+Math.sin(u*.45)*.3}
function nz(x){var q=Math.floor(x/3);var v=Math.sin(q*12.9898+Math.floor(t*60)*78.233)*43758.5453;return v-Math.floor(v)-.5}
var tick=0;
function draw(){
 g.clearRect(0,0,W,H);
 if(idle){mx=(t*90%(W+300))-150;my=H*.4}
 // impulsions d'entrée régulières
 if(++tick%38==0)spawn(0,Math.floor(Math.random()*L[0]));
 // connexions
 g.lineWidth=1;
 for(var l=0;l<L.length-1;l++)for(var i=0;i<L[l];i++)for(var j=0;j<L[l+1];j++){
  var a=pos(N[l][i]),b=pos(N[l+1][j]);g.strokeStyle='rgba(124,108,255,'+(.13*k+.25*Math.max(act[l][i],act[l+1][j])*k)+')';
  g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}
 // impulsions qui voyagent
 for(var n=pulses.length-1;n>=0;n--){var u=pulses[n];u.p+=u.v;
  var a=pos(N[u.l][u.i]),b=pos(N[u.l+1][u.j]),px=a.x+(b.x-a.x)*u.p,py=a.y+(b.y-a.y)*u.p;
  g.fillStyle='#35e0c2';g.shadowColor='#35e0c2';g.shadowBlur=12;g.globalAlpha=k<1?.8:1;g.beginPath();g.arc(px,py,3,0,6.283);g.fill();g.shadowBlur=0;g.globalAlpha=1;
  if(u.p>=1){act[u.l+1][u.j]=1;pulses.splice(n,1);if(Math.random()<.85)spawn(u.l+1,u.j);if(Math.random()<.25)spawn(u.l+1,u.j)}}
 // neurones
 for(var l=0;l<L.length;l++)for(var i=0;i<L[l];i++){var p=pos(N[l][i]),d=Math.hypot(p.x-mx,p.y-my);
  if(d<150&&Math.random()<.04){act[l][i]=1;spawn(l,i)}
  var A=act[l][i];act[l][i]*=.95;
  var col=l==L.length-1?'255,180,84':'53,224,194';
  g.fillStyle='#090b17';g.strokeStyle=A>.05?'rgba('+col+','+(.5+.5*A)+')':'rgba(124,108,255,'+.75*k+')';g.lineWidth=1.6;
  g.shadowColor='rgb('+col+')';g.shadowBlur=A*24;
  g.beginPath();g.arc(p.x,p.y,6+A*4,0,6.283);g.fill();g.stroke();
  if(A>.05){g.fillStyle='rgba('+col+','+A*.7+')';g.beginPath();g.arc(p.x,p.y,3+A*3,0,6.283);g.fill()}
  g.shadowBlur=0}
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
 
