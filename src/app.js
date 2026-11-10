const D=window.LOAN_DATA;
const $=s=>document.querySelector(s),sum=(a,k)=>a.reduce((x,r)=>x+r[k],0),fn=x=>Math.round(x).toLocaleString('en-US'),
fm=x=>x>=1e6?(x/1e6).toFixed(2)+'M':(x/1e3).toFixed(1)+'K',MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const st={p:-1,g:-1},F=a=>a.filter(r=>(st.p<0||r[0]===st.p)&&(st.g<0||r[1]===st.g)),
view=()=>['overview','portfolio','risk'].includes(location.hash.slice(1))?location.hash.slice(1):'overview',
SC=['#10b981','#f59e0b','#e5484d'];
const pill=v=>`<span class="pill ${v<0?'dnp':'up'}">${v>=0?'+':''}${v.toFixed(1)}%</span>`;
function kpis(){const c=F(D.c),n=sum(c,3);return{n,f:sum(c,4),r:sum(c,5),i:n?sum(c,6)/n*100:0,d:n?sum(c,7)/n*100:0,bad:sum(c.filter(r=>r[2]===2),3)}}
function mom(k){const m=F(D.m),a=sum(m.filter(r=>r[2]===12),k),b=sum(m.filter(r=>r[2]===11),k);return b?(a-b)/b*100:0}
function line(){const m=F(D.m),W=640,H=270,L=46,B=24,T=10,R=10,ph=H-T-B,grp=[[0,1],[2,3],[4,5,6]],nm=['Grade A–B','Grade C–D','Grade E–G'],co=['#f97316','#4f46e5','#10b981'];
const ser=grp.map(gs=>Array.from({length:12},(_,i)=>sum(m.filter(r=>r[2]===i+1&&gs.includes(r[1])),3))),tot=Array.from({length:12},(_,i)=>ser.reduce((x,s)=>x+s[i],0));
const mx=Math.max(1,...ser.flat()),p=10**Math.floor(Math.log10(mx)),ym=Math.ceil(mx/(p/2))*(p/2),mt=Math.max(1,...tot),x=i=>L+(W-L-R)*(i+.5)/12,y=v=>T+ph*(1-v/ym);
let s=`<svg viewBox="0 0 ${W} ${H}">`;for(let j=0;j<=4;j++){const v=ym*j/4;s+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--bd)" stroke-dasharray="3 3"/><text x="${L-6}" y="${y(v)+3}" text-anchor="end">${fn(v)}</text>`}
const bw=(W-L-R)/12;for(let i=0;i<12;i++){const h=tot[i]/mt*ph*.22;s+=`<g class="mg" data-tip="${MN[i]} 2021|${fn(tot[i])} applications|A–B ${fn(ser[0][i])} · C–D ${fn(ser[1][i])} · E–G ${fn(ser[2][i])}"><rect class="hit" x="${x(i)-bw/2}" y="${T}" width="${bw}" height="${ph}"/><rect class="bar" x="${x(i)-bw*.3}" y="${T+ph-h}" width="${bw*.6}" height="${h}" rx="2"/></g><text x="${x(i)}" y="${H-7}" text-anchor="middle">${MN[i]}</text>`}
ser.forEach((v,k)=>{let d='';v.forEach((q,i)=>{if(!i)d=`M${x(0)} ${y(q)}`;else{const xm=(x(i-1)+x(i))/2;d+=` C${xm} ${y(v[i-1])} ${xm} ${y(q)} ${x(i)} ${y(q)}`}});s+=`<path class="pth" pathLength="1" stroke-dasharray="1" stroke-linecap="round" d="${d}" fill="none" stroke="${co[k]}" stroke-width="2.4"/>`});
return`<div class="lgd">${nm.map((q,k)=>`<span><span class="dot" style="background:${co[k]}"></span>${q}</span>`).join('')}</div>`+s+'</svg>'}
function donut(sg,c1,c2){const R=42,C=2*Math.PI*R,t=sg.reduce((x,s)=>x+s.v,0)||1;let o=0;
const a=sg.map(s=>{const l=C*s.v/t,e=`<circle cx="60" cy="60" r="${R}" fill="none" stroke="${s.c}" stroke-width="14" stroke-dasharray="${l} ${C-l}" data-tip="${s.t||''}" stroke-dashoffset="${-o}" transform="rotate(-90 60 60)"/>`;o+=l;return e}).join('');
return`<svg viewBox="0 0 120 120" class="dn">${a}<text x="60" y="60" class="dv">${c1}</text><text x="60" y="76" text-anchor="middle">${c2}</text></svg>`}
function hb(items,f,c){const mx=Math.max(1e-9,...items.map(i=>i.v));return items.map(i=>`<div class="hb" data-tip="${i.l}|${f(i.v)}"><div>${i.l}</div><div><b style="width:${i.v/mx*100}%;${c?'background:'+c:''}"></b></div><div>${f(i.v)}</div></div>`).join('')}
function ptab(){const c=F(D.c);return D.P.map((nm,i)=>{const r=c.filter(x=>x[0]===i),n=sum(r,3);return{nm,n,f:sum(r,4),r:sum(r,5),b:n?sum(r.filter(x=>x[2]===2),3)/n*100:0}}).filter(x=>x.n).sort((a,b)=>b.n-a.n)}
function ov(k){const c=F(D.c),good=k.n-k.bad,gf=sum(c.filter(r=>r[2]<2),4),gr=sum(c.filter(r=>r[2]<2),5),bf=sum(c.filter(r=>r[2]===2),4),br=sum(c.filter(r=>r[2]===2),5),pt=ptab();
const kp=[['Total loan applications',fn(k.n),pill(mom(3))],['Total funded amount',fm(k.f),pill(mom(4))],['Total amount received',fm(k.r),pill(mom(5))],['Average interest rate',k.i.toFixed(2)+'%','<span class="sub">avg</span>'],['Average DTI',k.d.toFixed(2)+'%','<span class="sub">avg</span>']];
const sd=D.S.map((nm,s)=>{const r=c.filter(x=>x[2]===s),n=sum(r,3),gs=D.G.map((_,g)=>sum(r.filter(x=>x[1]===g),3)),mx=Math.max(1,...gs);
return`<div class="sc"><span class="m"><span class="dot" style="background:${SC[s]}"></span>${nm}</span><div class="mini">${gs.map(v=>`<i style="height:${Math.max(3,v/mx*34)}px"></i>`).join('')}</div><div class="n">${fn(n)} <span class="pill up">${(n/k.n*100).toFixed(1)}%</span></div><div class="m">Funded ${fm(sum(r,4))} · Received ${fm(sum(r,5))}</div><div class="m">Avg rate ${n?(sum(r,6)/n*100).toFixed(2):0}% · DTI ${n?(sum(r,7)/n*100).toFixed(2):0}%</div></div>`}).join('');
return`<div class="kp">${kp.map(q=>`<div class="card"><div class="l">${q[0]}</div><div class="v">${q[1]}</div>${q[2]}</div>`).join('')}</div>
<h2>Loan volume</h2><p class="sub">Monthly applications by risk grade · side cards show each loan status (mini bars = grades A→G) · MoM compares Dec with Nov</p>
<div class="card big"><div>${line()}</div><div class="side">${sd}</div></div>
<h2>Good loans vs bad loans</h2><p class="sub">Good = Fully Paid + Current · Bad = Charged Off</p>
<div class="g2"><div class="card">${donut([{v:good,c:'#10b981',t:`Good loans|${fn(good)} applications|${(good/k.n*100).toFixed(2)}% of loans`},{v:k.bad,c:'var(--bd)',t:`Bad loans|${fn(k.bad)} applications|${(k.bad/k.n*100).toFixed(2)}% of loans`}],(good/k.n*100).toFixed(2)+'%','Good loans')}<p style="text-align:center" class="sub">${fn(good)} applications · Funded ${fm(gf)} · Received ${fm(gr)}</p></div>
<div class="card">${donut([{v:k.bad,c:'#e5484d',t:`Bad loans|${fn(k.bad)} applications|${(k.bad/k.n*100).toFixed(2)}% of loans`},{v:good,c:'var(--bd)',t:`Good loans|${fn(good)} applications|${(good/k.n*100).toFixed(2)}% of loans`}],(k.bad/k.n*100).toFixed(2)+'%','Bad loans')}<p style="text-align:center" class="sub">${fn(k.bad)} applications · Funded ${fm(bf)} · Received ${fm(br)}</p></div></div>
<h2>Loan purposes</h2><p class="sub">Applications, money funded and received, and the bad-loan rate for each purpose</p>
<div class="card tw"><table><tr><th>Purpose</th><th>Applications</th><th>Funded</th><th>Received</th><th>Bad-loan rate</th></tr>${pt.map(x=>`<tr><td>${x.nm}</td><td>${fn(x.n)}</td><td>${fm(x.f)}</td><td>${fm(x.r)}</td><td><span class="pill ${x.b>k.bad/k.n*100?'dnp':'up'}">${x.b.toFixed(1)}%</span></td></tr>`).join('')}</table></div>`}
function sq(it,W,H){const tot=it.reduce((p,c)=>p+c.v,0),k=W*H/tot,a=it.map(q=>q.v*k),out=[];let x=0,y=0,w=W,h=H,row=[],ri=[];
const worst=(r,s)=>{const t=r.reduce((p,c)=>p+c,0);return Math.max(s*s*Math.max(...r)/(t*t),t*t/(s*s*Math.min(...r)))};
const lay=()=>{const t=row.reduce((p,c)=>p+c,0);if(w>=h){const rw=t/h;let yy=y;row.forEach((r,j)=>{const rh=r/rw;out.push({i:ri[j],x,y:yy,w:rw,h:rh});yy+=rh});x+=rw;w-=rw}else{const rh=t/w;let xx=x;row.forEach((r,j)=>{const rw=r/rh;out.push({i:ri[j],x:xx,y,w:rw,h:rh});xx+=rw});y+=rh;h-=rh}row=[];ri=[]};
for(let i=0;i<a.length;i++){const s=Math.min(w,h);if(row.length&&worst([...row,a[i]],s)>worst(row,s))lay();row.push(a[i]);ri.push(i)}
if(row.length)lay();return out}
function pf(k){const tm=['36 months','60 months'].map((l,i)=>({l,v:sum(F(D.t).filter(r=>r[2]===i),3)})),hm=D.H.map((l,i)=>({l,v:sum(F(D.h).filter(r=>r[2]===i),3)})).sort((a,b)=>b.v-a.v),pt=ptab(),
sa=F(D.s),cnt={};D.ST.forEach((l,i)=>{cnt[l]=sum(sa.filter(r=>r[2]===i),3)});
const mx=Math.max(1,...Object.values(cnt)),rank=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]),pal=['#f97316','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6'],H=46,rc=sq(pt.map(x=>({v:x.n})),100,H),
top=rank.slice(0,8).filter(a=>cnt[a]).map(a=>({l:D.map.n[a],v:cnt[a]})),pc=v=>(v/k.n*100).toFixed(1)+'% of loans',
ps=Object.entries(D.map.p).map(([ab,d])=>{const v=cnt[ab]||0,al=v?.14+.86*Math.sqrt(v/mx):.05;return`<path d="${d}" fill="rgba(249,115,22,${al.toFixed(3)})" data-ab="${ab}" data-tip="${D.map.n[ab]}|${fn(v)} applications|${pc(v)}${v?' · rank #'+(rank.indexOf(ab)+1):''}"/>`}).join('');
return`<div class="g2"><div class="card"><h2 style="margin-top:0">Loan term</h2>${donut([{v:tm[0].v,c:'#4f46e5',t:`36 months|${fn(tm[0].v)} applications|${pc(tm[0].v)}`},{v:tm[1].v,c:'#f97316',t:`60 months|${fn(tm[1].v)} applications|${pc(tm[1].v)}`}],fn(k.n),'applications')}<p style="text-align:center" class="sub">36 months ${(tm[0].v/k.n*100).toFixed(1)}% · 60 months ${(tm[1].v/k.n*100).toFixed(1)}%</p></div>
<div class="card"><h2 style="margin-top:0">Home ownership</h2>${hb(hm,fn,'#a855f7')}</div></div>
<h2>Loan purpose breakdown</h2><p class="sub">Box size = number of applications · hover for details</p><div class="card"><div class="tmw">${rc.map(r=>{const x=pt[r.i],big=r.w>9&&r.h>8;return`<div data-tip="${x.nm}|${fn(x.n)} applications|${pc(x.n)}" style="left:${r.x}%;top:${r.y/H*100}%;width:${r.w}%;height:${r.h/H*100}%;background:${pal[r.i%6]}">${big?`<span class="${r.w<22?'sm':''}">${x.nm}</span><em class="${r.w<22?'sm':''}">${fn(x.n)}</em>`:''}</div>`}).join('')}</div></div>
<h2>Applications by state</h2><p class="sub">Darker orange = more applications · hover a state for details</p>
<div class="mapg"><div class="card"><svg class="map" viewBox="0 0 975 610">${ps}<path class="hl" d="" fill="none" pointer-events="none"/></svg><div class="lgd2">Fewer<span class="grad"></span>More</div></div><div class="card"><h2 style="margin-top:0">Top 8 states</h2>${hb(top,fn,'#f97316')}</div></div>`}
function rk(k){const c=F(D.c),gr=D.G.map((l,g)=>{const r=c.filter(x=>x[1]===g),n=sum(r,3);return{l:'Grade '+l,n,b:n?sum(r.filter(x=>x[2]===2),3)/n*100:0,i:n?sum(r,6)/n*100:0}}).filter(x=>x.n),pt=ptab().sort((a,b)=>b.b-a.b);
return`<div class="g2"><div class="card"><h2 style="margin-top:0">Bad-loan rate by grade</h2><p class="sub">Portfolio average ${(k.bad/k.n*100).toFixed(2)}%</p>${hb(gr.map(x=>({l:x.l,v:x.b})),v=>v.toFixed(1)+'%','#e5484d')}</div>
<div class="card"><h2 style="margin-top:0">Average interest rate by grade</h2><p class="sub">Riskier grades are priced higher</p>${hb(gr.map(x=>({l:x.l,v:x.i})),v=>v.toFixed(2)+'%','#10b981')}</div></div>
<h2>Bad-loan rate by purpose</h2><p class="sub">Highest risk first</p><div class="card">${hb(pt.map(x=>({l:x.nm,v:x.b})),v=>v.toFixed(1)+'%','#e5484d')}</div>`}
function render(){hideTip();const v=view();document.querySelectorAll('[data-v]').forEach(a=>a.classList.toggle('on',a.dataset.v===v));const k=kpis();$('#cnt').textContent=fn(k.n)+' loans in view';
$('#app').innerHTML=k.n?{overview:ov,portfolio:pf,risk:rk}[v](k):'<div class="card empty">No loans match these filters. Try resetting them.</div>';anim(first);first=false}
const tp=document.createElement('div');tp.className='tipbox';document.body.appendChild(tp);
const hideTip=()=>{tp.style.opacity=0;const h=document.querySelector('.map .hl');if(h)h.setAttribute('d','')};
function moveTip(e){const el=e.target.closest&&e.target.closest('[data-tip]');if(!el||!el.dataset.tip){hideTip();return}
 const[t,...r]=el.dataset.tip.split('|');tp.innerHTML='<b style="display:block;font-size:13px">'+t+'</b>'+r.map(x=>'<span style="display:block;opacity:.7">'+x+'</span>').join('');
 const w=tp.offsetWidth,h=tp.offsetHeight;let x=e.clientX+16,y=e.clientY+16;if(x+w>innerWidth-8)x=e.clientX-w-16;if(y+h>innerHeight-8)y=e.clientY-h-16;tp.style.transform='translate('+x+'px,'+y+'px)';tp.style.opacity=1;
 const hl=document.querySelector('.map .hl');if(hl)hl.setAttribute('d',el.dataset.ab?el.getAttribute('d'):'')}
document.addEventListener('mousemove',moveTip);document.addEventListener('scroll',hideTip,true);document.addEventListener('mouseleave',hideTip);
const RM=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)').matches:false,GS=window.gsap,MO=window.Motion;let first=true;
const safe=f=>{try{f()}catch(e){console.warn('anim',e)}};
function countUp(el,dur){const t=el.textContent,m=t.match(/^([\d,]*\.?\d+)(.*)$/);if(!m)return;const n=parseFloat(m[1].replace(/,/g,'')),d=(m[1].split('.')[1]||'').length,o={v:0};
GS.to(o,{v:n,duration:dur,ease:'power2.out',onUpdate:()=>{el.textContent=o.v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})+m[2]},onComplete:()=>{el.textContent=t}})}
function anim(f){if(RM)return;const q=s=>[...document.querySelectorAll(s)],d=f?1:.7;
if(GS)safe(()=>{
 const A=(sel,v)=>{if(document.querySelector(sel))GS.from(sel,v)};
 if(f){GS.timeline({defaults:{ease:'power3.out'}}).from('.sb',{x:-70,opacity:0,duration:.8,clearProps:'transform,opacity'}).from('.sb a',{x:-18,opacity:0,stagger:.07,duration:.45,clearProps:'transform,opacity'},.3).from('.top,.tabs,.flt',{y:-16,opacity:0,stagger:.09,duration:.55,clearProps:'transform,opacity'},.25);
 GS.to('.blob1',{x:80,y:50,duration:10,repeat:-1,yoyo:true,ease:'sine.inOut'});GS.to('.blob2',{x:-70,y:-40,duration:12,repeat:-1,yoyo:true,ease:'sine.inOut'})}
 A('.kp .card',{y:28,opacity:0,scale:.94,stagger:.08,duration:.7*d,ease:'back.out(1.5)',clearProps:'transform,opacity'});
 q('.kp .v').forEach(e=>countUp(e,1.4*d));
 A('.pth',{strokeDashoffset:1,duration:1.6*d,stagger:.22,ease:'power2.inOut',delay:.2});
 A('.mg .bar',{scaleY:0,transformOrigin:'50% 100%',stagger:.045,duration:.7*d,ease:'power2.out',delay:.1});
 A('.sc',{x:34,opacity:0,stagger:.12,duration:.7*d,ease:'power3.out',clearProps:'transform,opacity'});
 A('.mini i',{scaleY:0,transformOrigin:'50% 100%',stagger:.03,duration:.6*d,delay:.4,ease:'back.out(2)'});
 A('.dn',{rotation:-110,scale:.6,opacity:0,transformOrigin:'50% 50%',duration:1.1*d,ease:'back.out(1.4)',clearProps:'transform,opacity'});
 A('.hb b',{scaleX:0,transformOrigin:'0% 50%',duration:1*d,stagger:.06,ease:'power3.out'});
 A('.tw tr',{opacity:0,y:12,stagger:.04,duration:.5*d,clearProps:'transform,opacity'});
 A('.tmw div',{opacity:0,y:14,stagger:.05,duration:.6*d,ease:'power3.out'});
 A('.map path[data-ab]',{opacity:0,stagger:{amount:1.1,from:'random'},duration:.5*d,ease:'power2.out'})});
if(MO&&'IntersectionObserver'in window)safe(()=>{
 const els=q('#app>h2,#app>p,#app>.card,#app>.g2');els.forEach(e=>{e.style.opacity=0});
 els.forEach(e=>MO.inView(e,()=>{Promise.resolve(MO.animate(e,{opacity:[0,1],transform:['translateY(30px)','translateY(0px)']},{duration:.8,ease:[.22,1,.36,1]}).finished).then(()=>{e.style.opacity='';e.style.transform=''})}));
 setTimeout(()=>els.forEach(e=>{if(e.style.opacity==='0')e.style.opacity=''}),3500)});
}
$('#fp').innerHTML='<option value="-1">All purposes</option>'+D.P.map((p,i)=>`<option value="${i}">${p}</option>`).join('');
$('#fg').innerHTML='<option value="-1">All grades</option>'+D.G.map((g,i)=>`<option value="${i}">Grade ${g}</option>`).join('');
$('#fp').onchange=e=>{st.p=+e.target.value;render()};$('#fg').onchange=e=>{st.g=+e.target.value;render()};
$('#rs').onclick=()=>{st.p=st.g=-1;$('#fp').value=$('#fg').value='-1';render()};
addEventListener('hashchange',render);render();
