
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function peony(s){let g='';[[8,23,22,42,'#F7E8E8',0],[7,19,19,32,'#F0D0DB',20],[6,15,16,23,'#E8B7C8',8],[5,10,11,13,'#D79AB0',30]].forEach(r=>{for(let i=0;i<r[0];i++)g+=`<ellipse cx="${r[3]}" rx="${r[1]}" ry="${r[2]}" fill="${r[4]}" stroke="#E0A9BC" stroke-width=".8" transform="rotate(${r[5]+360/r[0]*i})"/>`});return`<svg viewBox="-100 -100 200 200" width="${s}" height="${s}" aria-hidden="true"><g stroke="#8C9A7B" stroke-width="2" fill="#DCE3D2"><ellipse cx="-62" cy="58" rx="30" ry="11" transform="rotate(-30 -62 58)"/><ellipse cx="62" cy="58" rx="30" ry="11" transform="rotate(30 62 58)"/></g>${g}<circle r="5" fill="#C98AA1"/></svg>`}
const SAMPLE="Фотосинтез хлоропластарда жүреді. Жарық фазасында АТФ және НАДФ·Н түзіледі. Хлорофилл қызыл және көк жарықты жұтады. Процесс барысында оттегі бөлінеді.";
const S={route:'home',text:'',file:null,cfg:{n:10,d:'Аралас',t:'Бір дұрыс жауап',lang:'Қазақша',mode:'practice',sq:true,so:true,ex:true},
quiz:[],edit:-1,loading:null,err:null,i:0,ans:{},ask:false,saved:[],att:[],bloom:false,mq:[],mdone:0,mi:0,mans:null,title:'Жаңа тест',gform:null};
const NAV=[['home','Басты бет'],['new','Тест құрастыру'],['quizzes','Менің тесттерім'],['take','Тест тапсыру'],['results','Нәтижелерім'],['mistakes','Қателермен жұмыс']];
const go=r=>{if(r==='new'&&S.route!=='new')S.preview=false;S.route=r;S.ask=false;S.err=null;draw();window.scrollTo(0,0)};
const L='ABCD',pct=(a,b)=>b?Math.round(a/b*100):0;
function opt(name,vals,cur){return`<div class="opts">${vals.map(v=>`<label><input type="radio" name="${name}" value="${v}" ${v==cur?'checked':''} data-cfg="${name}"><span>${v}</span></label>`).join('')}</div>`}
const V={
home:()=>`<section class="iris-hero" aria-label="IRIS — Білімің гүлдей берсін"><img src="/images/iris-hero.jpeg" alt="IRIS: гүлдер алқабы мен шыны шар бейнеленген авторлық иллюстрация"/><div class="iris-hero-copy"><span class="iris-eyebrow">IRIS · AI QUIZ STUDIO</span><h1>Білімің гүлдей берсін.</h1><p>Өз материалыңнан ақылды тест құрастыр. Оқы, тексер, дамы.</p><div class="row"><button class="btn" data-go="new">Тест құрастыру</button><button class="btn alt" data-go="how">Қалай жұмыс істейді?</button></div></div></section>`+`
<section id="how"><h2>Қалай жұмыс істейді?</h2><div class="grid">${['Материалды жүктеңіз','Параметрлерді таңдаңыз','Жасанды интеллект тест жасайды','Тестті IRIS ішінде тапсырыңыз'].map((s,i)=>`<div class="card"><div class="step">${i+1}</div><p><b>${s}</b></p></div>`).join('')}</div></section>
<section style="background:var(--blush);border-radius:24px;padding:28px;margin-top:20px"><div class="grid">${[['Тек сіздің материалыңыз','Жасанды интеллект сыртқы ақпаратты қолданбайды.'],['Сапалы дистракторлар','Қате жауаптар логикалы әрі шынайы көрінеді.'],['Дереккөзбен тексеру','Әр сұрақтың қай материалға негізделгенін көруге болады.'],['Нәтижелер тарихы','Өз прогресіңізді бақылап, қателерді қайталаңыз.']].map(p=>`<div class="perk"><h3>${p[0]}</h3>${p[1]}</div>`).join('')}</div></section>`,
new:()=>{const c=S.cfg;if(S.loading)return`<div class="card empty"><div style="animation:bl 3s infinite">${peony(110)}</div><h2>${S.loading}</h2><div class="bar" style="max-width:300px;margin:auto"><i style="width:${S.pg}%"></i></div></div>`;
if(S.quiz.length&&S.route==='new'&&S.preview)return V.editor();
return`<h2>Материалыңызды жүктеңіз</h2><p>Тест жасау үшін PDF, DOCX, PPTX немесе TXT файлын жүктеңіз. Мәтінді тікелей енгізуге де болады.</p>
${S.err?`<div class="note err" role="alert"><b>${S.err[0]}</b> ${S.err[1]}</div>`:''}
<div class="card"><div class="drop" id="dz"><p>Файлды осы жерге сүйреңіз</p><label class="btn alt sm" style="display:inline-block">Файл таңдау<input type="file" id="fi" accept=".txt,.pdf,.docx,.pptx" hidden></label>
${S.file?`<p class="note" style="margin-top:14px">${esc(S.file.name)} · ${S.file.type} · ${S.file.size} · <b>${S.file.st}</b> <button class="btn alt sm" data-act="rmf">Алып тастау</button></p>`:''}</div>
<label class="fl" for="tx">Мәтін енгізу</label><textarea id="tx" rows="6" placeholder="Мәтінді осы жерге қойыңыз">${esc(S.text)}</textarea><button class="btn alt sm" data-act="sample" style="margin-top:8px">Үлгі мәтінді қою</button></div>
<h2>Тест параметрлері</h2><div class="card"><span class="fl">Сұрақтар саны</span>${opt('n',[10,20,30,40,50],c.n)}
<span class="fl">Қиындық деңгейі</span>${opt('d',['Жеңіл','Орташа','Қиын','Аралас'],c.d)}
<span class="fl">Сұрақ түрі</span>${opt('t',['Бір дұрыс жауап'],c.t)}<p class="muted">Басқа түрлер кейін қосылады.</p>
<span class="fl">Тест тілі</span>${opt('lang',['Қазақша','Орысша','Ағылшынша'],c.lang)}
<span class="fl">Режим</span>${opt('mode',['practice','exam'].map(x=>x),c.mode).replace('>practice<','>Жаттығу<').replace('>exam<','>Емтихан<')}
<span class="fl">Қосымша</span><div class="row"><label><input type="checkbox" data-tg="sq" ${c.sq?'checked':''}> Сұрақтарды араластыру</label><label><input type="checkbox" data-tg="so" ${c.so?'checked':''}> Жауап нұсқаларын араластыру</label><label><input type="checkbox" data-tg="ex" ${c.ex?'checked':''}> Жауаптан кейін түсіндірме көрсету</label></div>
<button class="btn" data-act="gen" style="margin-top:14px">Тест жасау</button></div>`},
editor:()=>`<h2>Тест дайын</h2><p>${S.quiz.length} сұрақ жасалды</p><input type="text" id="ti" value="${esc(S.title)}" aria-label="Тест атауы" style="margin-bottom:14px">
${S.quiz.map((q,k)=>S.edit===k?`<div class="card"><label class="fl">Сұрақ</label><textarea data-ed="q" data-k="${k}">${esc(q.q)}</textarea>${q.o.map((o,j)=>`<label class="fl">${L[j]}</label><input type="text" data-ed="o${j}" data-k="${k}" value="${esc(o)}">`).join('')}<label class="fl">Дұрыс жауап</label><select data-ed="c" data-k="${k}">${L.split('').map((l,j)=>`<option value="${j}" ${j==q.c?'selected':''}>${l}</option>`).join('')}</select><label class="fl">Түсіндірме</label><textarea data-ed="e" data-k="${k}">${esc(q.e)}</textarea><button class="btn sm" data-act="done" style="margin-top:10px">Дайын</button></div>`
:`<div class="card"><b>${k+1}. ${esc(q.q)}</b>${q.o.map((o,j)=>`<div style="padding:4px 0">${L[j]}. ${esc(o)} ${j==q.c?'<span style="color:var(--sage)">✓ Дұрыс жауап</span>':''}</div>`).join('')}<details style="margin:8px 0"><summary>Дереккөзді көру</summary><div class="note"><b>Материалдағы негіз:</b> «${esc(q.x)}» — ${esc(q.l)}</div></details><div class="row"><button class="btn alt sm" data-edit="${k}">Өзгерту</button><button class="btn alt sm" data-del="${k}">Жою</button><button class="btn alt sm" data-regen="${k}" ${S.regen!=null?'disabled':''}>${S.regen===k?'Жасалуда...':'Қайта жасау'}</button></div></div>`).join('')}
<div class="row"><button class="btn" data-act="save">Тестті сақтау</button><button class="btn alt" data-act="start">Тестті бастау</button></div>`,
quizzes:()=>!S.saved.length?`<div class="card empty">${peony(130)}<h2>Әзірге тест жоқ</h2><p>Алғашқы тестіңізді құрастырып, білім бақшаңызды гүлдетіңіз.</p><button class="btn" data-go="new">Тест құрастыру</button></div>`:`<h2>Менің тесттерім</h2>${S.saved.map((s,k)=>`<div class="card row sp"><div><b>${esc(s.t)}</b><div class="muted">${s.n} сұрақ · ${s.d} · Ең жақсы нәтиже: ${s.b==null?'—':s.b+'%'}</div></div><div class="row"><button class="btn sm" data-open="${k}">Ашу</button><button class="btn alt sm" data-open="${k}">Қайта тапсыру</button><button class="btn alt sm" data-rm="${k}">Жою</button></div></div>`).join('')}`,
take:()=>{if(!S.quiz.length)return V.noq();const q=S.quiz[S.i],a=S.ans[S.i],pr=S.cfg.mode==='practice',lock=pr&&a!=null;
if(S.ask)return`<div class="card empty"><h2>Тестті аяқтайсыз ба?</h2><p>Жауап берілген: ${Object.keys(S.ans).length} / ${S.quiz.length}</p><div class="row" style="justify-content:center"><button class="btn" data-act="fin">Иә, аяқтау</button><button class="btn alt" data-act="back">Жалғастыру</button></div></div>`;
return`<div class="row sp"><b>Сұрақ ${S.i+1} / ${S.quiz.length}</b><span class="muted">${pr?'Жаттығу':'Емтихан'}</span></div><div class="bar" style="margin:10px 0 22px"><i style="width:${(S.i+1)/S.quiz.length*100}%"></i></div>
<h2>${esc(q.q)}</h2>${q.o.map((o,j)=>`<button class="ans ${lock?(j==q.c?'ok':j==a?'bad':''):(a==j?'sel':'')}" data-pick="${j}" ${lock?'disabled':''}><b>${L[j]}.</b> ${esc(o)}</button>`).join('')}
${lock&&S.cfg.ex?`<div class="note"><b>Түсіндірме:</b> ${esc(q.e)}</div>`:''}
<div class="row sp" style="margin-top:20px"><button class="btn alt" data-act="prev" ${S.i?'':'disabled'}>Артқа</button>${S.i<S.quiz.length-1?'<button class="btn" data-act="next">Келесі</button>':'<button class="btn" data-act="ask">Тестті аяқтау</button>'}</div>`},
noq:()=>`<div class="card empty">${peony(110)}<h2>Тест таңдалмаған</h2><p>Алдымен тест құрастырыңыз немесе сақталған тестті ашыңыз.</p><button class="btn" data-go="new">Тест құрастыру</button></div>`,
results:()=>{const a=S.att[S.att.length-1];if(!a)return`<div class="card empty">${peony(110)}<h2>Нәтижелер әзірге жоқ</h2><p>Тестті тапсырған соң статистика осында көрінеді.</p><button class="btn" data-go="take">Тест тапсыру</button></div>`;const p=pct(a.s,a.n);
return`<div class="card bloomwrap" style="text-align:center">${S.bloom?[[6,10,90],[75,6,110],[14,55,100],[70,52,80],[44,18,120]].map((b,i)=>`<div class="bloom" style="left:${b[0]}%;top:${b[1]}%;animation-delay:${i*.15}s">${peony(b[2])}</div>`).join(''):''}<h2>Нәтиже</h2><div class="big">${a.s} / ${a.n}</div><div class="bar" style="max-width:320px;margin:10px auto"><i style="width:${p}%"></i></div><p><b>${p}%</b></p><p>Дұрыс жауаптар: ${a.s} · Қате жауаптар: ${a.n-a.s}</p>
<div class="row" style="justify-content:center"><button class="btn" data-act="mist" ${a.n==a.s?'disabled':''}>Қателерді қайталау</button><button class="btn alt" data-act="start">Тестті қайта тапсыру</button><button class="btn alt" data-go="new">Жаңа тест жасау</button></div></div>
<h2>Талдау</h2>${a.rev.filter(r=>!r.ok).map(r=>`<div class="card"><b>${esc(r.q.q)}</b><p>Сіздің жауабыңыз: ${r.a==null?'—':esc(r.q.o[r.a])}<br>Дұрыс жауап: <b>${esc(r.q.o[r.q.c])}</b></p><p class="note">Түсіндірме: ${esc(r.q.e)}</p><details><summary>Дереккөзді көру</summary>«${esc(r.q.x)}» — ${esc(r.q.l)}</details></div>`).join('')||'<p>Барлық жауап дұрыс! 🌸</p>'}
<h2>Тапсырулар тарихы</h2>${S.att.map((x,k)=>`<div class="card row sp"><span>${k+1}-әрекет · ${x.m}</span><b>${pct(x.s,x.n)}%</b></div>`).join('')}`},
mistakes:()=>{if(!S.mq.length)return`<div class="card empty">${peony(120)}<h2>${S.mdone?'Керемет! Барлық қателер түзетілді':'Қателер жоқ'}</h2><p>${S.mdone?`Түзетілген сұрақ: ${S.mdone}.`:'Тестті тапсырған соң қателі сұрақтар осында жиналады.'}</p><button class="btn" data-go="new">Жаңа тест жасау</button></div>`;
const q=S.mq[S.mi%S.mq.length],a=S.mans;return`<h2>Қателермен жұмыс</h2><p class="muted">Қалған сұрақ: ${S.mq.length} · Түзетілді: ${S.mdone}</p><h3>${esc(q.q)}</h3>${q.o.map((o,j)=>`<button class="ans ${a!=null?(j==q.c?'ok':j==a?'bad':''):''}" data-mpick="${j}" ${a!=null?'disabled':''}><b>${L[j]}.</b> ${esc(o)}</button>`).join('')}${a!=null?`<div class="note">${esc(q.e)}</div><button class="btn" data-act="mnext" style="margin-top:12px">Келесі</button>`:''}`}
};
function draw(){drawUser();$('#lg').innerHTML=peony(34)+'<span>IRIS</span>';$('#lk').innerHTML=NAV.map(n=>`<button data-go="${n[0]}" class="${S.route===n[0]?'on':''}">${n[1]}</button>`).join('');$('#app').innerHTML=(S.booting?'<div class="note" role="status">Жүктелуде...</div>':S.route!=='home'&&!S.user?V.login():V[S.route]());
const dz=$('#dz');if(dz){['dragover','dragleave','drop'].forEach(e=>dz.addEventListener(e,ev=>{ev.preventDefault();dz.classList.toggle('over',e==='dragover');if(e==='drop')loadFile(ev.dataTransfer.files[0])}));$('#fi').onchange=e=>loadFile(e.target.files[0])}
const tx=$('#tx');if(tx)tx.oninput=e=>S.text=e.target.value;const ti=$('#ti');if(ti)ti.oninput=e=>S.title=e.target.value}
function shuf(a){return a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1])}
function start(){S.i=0;S.ans={};S.ask=false;S.bloom=false;go('take')}
document.addEventListener('click',e=>{const t=e.target.closest('button,[data-go]');if(!t)return;const d=t.dataset;
if(d.go==='how'){S.route='home';draw();document.getElementById('how').scrollIntoView({behavior:'smooth'});return}if(d.go)return go(d.go);
if(d.edit!=null){S.edit=+d.edit;draw()}if(d.del!=null){S.quiz.splice(+d.del,1);draw()}
if(d.pick!=null){if(S.cfg.mode==='practice'&&S.ans[S.i]!=null)return;S.ans[S.i]=+d.pick;draw()}
if(d.open!=null){S.quiz=S.saved[+d.open].qs;S.title=S.saved[+d.open].t;S.cfg.mode='practice';start()}if(d.rm!=null){S.saved.splice(+d.rm,1);draw()}
if(d.mpick!=null){S.mans=+d.mpick;draw()}
const a=d.act;if(!a)return;
if(a==='sample'){S.text=SAMPLE;draw()}if(a==='rmf'){S.file=null;S.pages=null;draw()}if(a==='gen')gen();if(a==='done'){S.edit=-1;draw()}
if(a==='save')saveQuiz(true);
if(a==='start')start();if(a==='next'){S.i++;draw()}if(a==='prev'){S.i--;draw()}if(a==='ask'){S.ask=true;draw()}if(a==='back'){S.ask=false;draw()}
if(a==='fin'){const rev=S.quiz.map((q,k)=>({q,a:S.ans[k],ok:S.ans[k]===q.c}));const s=rev.filter(r=>r.ok).length;S.att.push({s,n:S.quiz.length,m:S.cfg.mode==='practice'?'Жаттығу':'Емтихан',rev});const sv=S.saved.find(x=>x.t===S.title);if(sv)sv.b=Math.max(sv.b||0,pct(s,S.quiz.length));postAttempt(s,rev);S.mq=rev.filter(r=>!r.ok).map(r=>r.q);S.mdone=0;S.mi=0;S.mans=null;S.bloom=true;go('results')}
if(a==='mist'){S.mi=0;S.mans=null;go('mistakes')}
if(a==='mnext'){const q=S.mq[S.mi%S.mq.length];if(S.mans===q.c){S.mq.splice(S.mi%S.mq.length,1);S.mdone++}else S.mi++;S.mans=null;draw()}});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.cfg){S.cfg[t.dataset.cfg]=t.dataset.cfg==='n'?+t.value:t.value}if(t.dataset.tg)S.cfg[t.dataset.tg]=t.checked;
if(t.dataset.ed){const q=S.quiz[+t.dataset.k],f=t.dataset.ed;if(f==='q')q.q=t.value;else if(f==='e')q.e=t.value;else if(f==='c')q.c=+t.value;else q.o[+f[1]]=t.value}});
draw();

/* ---- Real backend wiring: /api/extract and /api/generate (no sample questions) ---- */
const DIFF={'Жеңіл':'easy','Орташа':'medium','Қиын':'hard','Аралас':'mixed'};
const LANG={'Қазақша':'Kazakh','Орысша':'Russian','Ағылшынша':'English'};
const ERR={UNSUPPORTED_TYPE:['Қолдау көрсетілмейтін файл.','PDF, DOCX, PPTX немесе TXT жүктеңіз.'],TOO_LARGE:['Файл тым үлкен.','Ең көбі 15 МБ.'],EMPTY_FILE:['Файл бос.','Басқа файл таңдаңыз.'],
EMPTY_TEXT:['Мәтін табылмады.','Файлда мәтін жоқ немесе ол сканерленген сурет. Мәтіні бар файл жүктеңіз.'],EXTRACTION_FAILED:['Файлды оқу мүмкін болмады.','Файл зақымдалған болуы мүмкін.'],
INSUFFICIENT_MATERIAL:['Материал жеткіліксіз.','Тест жасау үшін мәтін тым қысқа.'],AI_GENERATION_FAILED:['Тест жасау кезінде қате пайда болды.','Біраздан соң қайталап көріңіз.'],
NO_API_KEY:['Жасанды интеллект бапталмаған.','Серверде ANTHROPIC_API_KEY орнатылмаған.'],INVALID_INPUT:['Дұрыс емес деректер.','Параметрлерді тексеріп, қайталаңыз.']};
const NET=['Байланыс қатесі.','Интернетті тексеріп, қайталаңыз.'];
function textPages(t){const ps=t.split(/\n\s*\n/),out=[];let b='';for(const p of ps){if((b+p).length>3000&&b){out.push(b);b=''}b+=p+'\n\n'}if(b.trim())out.push(b);return out.map((x,i)=>({location:out.length>1?'Бөлім '+(i+1):'Мәтін',text:x.trim()}))}
async function loadFile(f){if(!f)return;S.err=null;S.pages=null;S.file={name:f.name,type:f.name.split('.').pop().toUpperCase(),size:(f.size/1024).toFixed(1)+' КБ',st:'Мәтін өңделуде...'};draw();
if(f.size>15*1024*1024){S.file=null;S.err=ERR.TOO_LARGE;draw();return}
const fd=new FormData();fd.append('file',f);
try{const r=await fetch('/api/extract',{method:'POST',body:fd}),j=await r.json().catch(()=>({}));
if(!r.ok){S.file=null;S.err=ERR[j.error]||ERR.EXTRACTION_FAILED}else{S.pages=j.pages;S.file.st='Материал дайын ('+j.charCount+' таңба)';S.file.bytes=f.size;S.file.chars=j.charCount}}catch{S.file=null;S.err=NET}draw()}
async function gen(){const pages=S.pages||textPages(S.text.trim());if(pages.reduce((a,p)=>a+p.text.length,0)<200){S.err=ERR.INSUFFICIENT_MATERIAL;draw();return}
S.err=null;S.notice=null;S.pg=8;S.loading='Материал оқылуда...';draw();
const M={analyze:['Негізгі тақырыптар анықталуда...',20],generate:['Сұрақтар жасалуда...',45],verify:['Жауап нұсқалары мен дереккөздер тексерілуде...',75],dedupe:['Қайталанатын сұрақтар тексерілуде...',90],done:['Тест дайын!',100]};
try{const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pages,count:S.cfg.n,difficulty:DIFF[S.cfg.d],language:LANG[S.cfg.lang],questionType:'single_choice'})});
if(!r.ok||!r.body){const j=await r.json().catch(()=>({}));throw j.error||'AI_GENERATION_FAILED'}
const rd=r.body.getReader(),dec=new TextDecoder();let buf='',res=null;
for(;;){const{done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let k;while((k=buf.indexOf('\n'))>=0){const ln=buf.slice(0,k).trim();buf=buf.slice(k+1);if(!ln)continue;const m=JSON.parse(ln);
if(m.error)throw m.error;if(m.stage&&M[m.stage]){S.loading=M[m.stage][0];S.pg=M[m.stage][1];draw()}if(m.result)res=m.result}}
if(!res)throw'AI_GENERATION_FAILED';S.loading=null;
if(!res.questions.length){S.err=['Материал жеткіліксіз.','Бұл материалдан дереккөзбен расталған сенімді сұрақ жасау мүмкін болмады. Көлемдірек немесе мазмұнды мәтін жүктеңіз.'];draw();return}
S.quiz=res.questions.map(x=>({q:x.question,o:x.options,c:x.correctIndex,e:x.explanation,x:x.sourceExcerpt,l:x.sourceLocation,d:x.difficulty,f:x.confidence}));
if(S.cfg.sq)S.quiz=shuf(S.quiz);S.title=S.file?S.file.name.replace(/\.[^.]+$/,''):'Жаңа тест';
if(res.produced<res.requested)S.notice='Материал жеткіліксіз: '+res.requested+' сұрақ сұралды, бірақ '+res.produced+' сапалы сұрақ жасалды. Қалған сұрақтар материалдағы нақты дереккөзбен расталмағандықтан қосылмады.';
S.qid=null;S.srcPages=pages;S.genLang=LANG[S.cfg.lang]||'Kazakh';S.srcInfo=S.file?{fileName:S.file.name,fileType:S.file.type,sizeBytes:S.file.bytes||0,charCount:S.file.chars||0}:{fileName:'Қойылған мәтін',fileType:'TXT',sizeBytes:S.text.length,charCount:S.text.length};S.preview=true;S.edit=-1;draw()}catch(e){S.loading=null;S.err=typeof e==='string'&&ERR[e]?ERR[e]:NET;draw()}}
const _ed=V.editor;V.editor=()=>(S.notice?`<div class="note" role="status"><b>Материал жеткіліксіз.</b> ${esc(S.notice.replace('Материал жеткіліксіз: ',''))}</div><br>`:'')+_ed();

/* ---- Account login and persistent saved quizzes ---- */
Object.assign(ERR,{UNAUTHORIZED:['Жүйеге кіру қажет.','Google арқылы қайта кіріңіз.'],
NOT_FOUND:['Тест табылмады.','Бетті жаңартып көріңіз.'],DB_ERROR:['Деректер базасының қатесі.','Біраздан соң қайталап көріңіз.']});
const AUTH_ERR={AccessDenied:'Кіруге рұқсат берілмеді.',Configuration:'Сервер дұрыс бапталмаған. Әкімшіге хабарласыңыз.',default:'Кіру кезінде қате пайда болды. Қайталап көріңіз.'};
const H={'Content-Type':'application/json'};
async function api(u,o){try{const r=await fetch(u,o),j=await r.json().catch(()=>({}));if(r.status===401&&S.user){S.user=null;draw()}return{ok:r.ok,status:r.status,j}}catch{return{ok:false,status:0,j:{error:'NET'}}}}
async function authPost(path){const r=await api('/api/auth/csrf');if(!r.ok){S.loginErr=AUTH_ERR.Configuration;draw();return}
const f=document.createElement('form');f.method='POST';f.action=path;[['csrfToken',r.j.csrfToken],['callbackUrl',location.origin+'/']].forEach(([k,v])=>{const i=document.createElement('input');i.type='hidden';i.name=k;i.value=v;f.appendChild(i)});document.body.appendChild(f);f.submit()}
function drawUser(){const u=document.getElementById('um');if(!u)return;u.innerHTML=S.user?`${S.user.image?`<img src="${esc(S.user.image)}" alt="" width="32" height="32" referrerpolicy="no-referrer" style="border-radius:50%">`:''}<span class="muted">${esc(S.user.name||S.user.email||'')}</span><button class="btn alt sm" data-act="out">Шығу</button>`:'<button class="btn sm" data-act="in">Кіру</button>'}
V.login=()=>`<div class="card empty" style="max-width:520px;margin:30px auto">${peony(130)}<h2>IRIS-ке қош келдіңіз</h2><p>Тесттеріңіз бен нәтижелеріңізді сақтау үшін Google аккаунтыңызбен кіріңіз.</p>${S.loginErr?`<div class="note err" role="alert">${S.loginErr}</div><br>`:''}<button class="btn" data-act="in">Google арқылы кіру</button><p class="muted" style="margin-top:14px">Тек негізгі профиль мен email рұқсаты сұралады. Құпиясөзіңіз бізге көрінбейді.</p></div>`;
async function loadList(){const r=await api('/api/quizzes');if(r.ok)S.saved=r.j.quizzes}
async function boot(){const q=new URLSearchParams(location.search).get('error');if(q){S.loginErr=AUTH_ERR[q]||AUTH_ERR.default;history.replaceState(null,'','/')}
const r=await api('/api/auth/session');S.user=r.j&&r.j.user?r.j.user:null;if(S.user)await loadList();else if(r.status===0||r.status>=500)S.loginErr=AUTH_ERR.Configuration;draw()}
async function saveQuiz(nav){S.saving=true;S.err=null;draw();try{return await _save(nav)}finally{S.saving=false;draw()}}
async function _save(nav){const qs=S.quiz.map(q=>({question:q.q,options:q.o,correctIndex:q.c,explanation:q.e||'',sourceExcerpt:q.x||'',sourceLocation:q.l||'',difficulty:q.d||'mixed',confidence:q.f??1}));
const body=JSON.stringify({title:S.title||'Жаңа тест',difficulty:DIFF[S.cfg.d]||'mixed',requestedCount:S.cfg.n,questions:qs,source:S.srcInfo||undefined,language:S.genLang||undefined,pages:S.qid?undefined:(S.srcPages||undefined)});
const r=S.qid?await api('/api/quizzes/'+S.qid,{method:'PUT',headers:H,body}):await api('/api/quizzes',{method:'POST',headers:H,body});
if(!r.ok){S.err=r.j.error==='INVALID_INPUT'?['Тест сақталмады.','Әр сұрақта 4 әртүрлі жауап нұсқасы және дұрыс жауап болуы керек.']:(ERR[r.j.error]||NET);draw();return null}
S.qid=r.j.id;S.srcPages=null;r.j.questionIds.forEach((id,k)=>{if(S.quiz[k])S.quiz[k].id=id});await loadList();if(nav)go('quizzes');else draw();return S.qid}
async function openQuiz(id,mode){const r=await api('/api/quizzes/'+id);if(!r.ok){S.err=ERR[r.j.error]||NET;go('quizzes');S.err=ERR[r.j.error]||NET;draw();return}
const z=r.j.quiz;S.qid=z.id;S.title=z.title;S.notice=null;S.edit=-1;S.quiz=z.questions.map(q=>({id:q.id,q:q.text,o:q.options,c:q.correct,e:q.explanation,x:q.sourceExcerpt,l:q.sourceLocation,d:q.difficulty,f:q.confidence}));
if(mode==='edit'){S.preview=true;S.route='new';draw();window.scrollTo(0,0)}else start()}
async function start(){if(S.quiz.length&&!S.qid&&S.user){if(!await saveQuiz(false))return}S.i=0;S.ans={};S.ask=false;S.bloom=false;go('take')}
async function postAttempt(s,rev){if(!S.qid)return;const answers=[];S.quiz.forEach((q,k)=>{if(S.ans[k]!=null&&q.id)answers.push({questionId:q.id,selected:S.ans[k]})});
const r=await api('/api/quizzes/'+S.qid+'/attempts',{method:'POST',headers:H,body:JSON.stringify({answers})});if(r.ok)loadList()}
const _ed2=V.editor;V.editor=()=>(S.saving?'<div class="note" role="status">Сақталуда...</div><br>':'')+(S.err?`<div class="note err" role="alert"><b>${S.err[0]}</b> ${S.err[1]}</div><br>`:'')+_ed2()+(S.qid?'':'<p class="muted">Тест әлі сақталмаған.</p>');
V.quizzes=()=>{const e=S.err?`<div class="note err" role="alert"><b>${S.err[0]}</b> ${S.err[1]}</div><br>`:'';
return e+(!S.saved.length?`<div class="card empty">${peony(130)}<h2>Әзірге тест жоқ</h2><p>Алғашқы тестіңізді құрастырып, білім бақшаңызды гүлдетіңіз.</p><button class="btn" data-go="new">Тест құрастыру</button></div>`
:`<h2>Менің тесттерім</h2>`+S.saved.map(s=>`<div class="card"><b>${esc(s.title)}</b><div class="muted">${esc(s.source||'')} · ${s.count} сұрақ · ${new Date(s.createdAt).toLocaleDateString('kk-KZ')} · Ең жақсы нәтиже: ${s.best==null?'—':s.best+'%'}</div><div class="row" style="margin-top:12px"><button class="btn sm" data-qe="${s.id}">Ашу</button><button class="btn alt sm" data-qo="${s.id}">Қайта тапсыру</button><button class="btn alt sm" data-qd="${s.id}">Жою</button></div></div>`).join(''))};
document.addEventListener('click',async e=>{const t=e.target.closest('[data-act],[data-qo],[data-qe],[data-qd]');if(!t)return;const d=t.dataset;
if(d.act==='in')return authPost('/api/auth/signin/google');if(d.act==='out')return authPost('/api/auth/signout');
if(d.qo)return openQuiz(d.qo,'take');if(d.qe)return openQuiz(d.qe,'edit');
if(d.qd){if(!confirm('Тестті жою керек пе?'))return;const r=await api('/api/quizzes/'+d.qd,{method:'DELETE'});if(r.ok){if(S.qid===d.qd){S.qid=null;S.quiz=[]}await loadList()}else S.err=ERR[r.j.error]||NET;draw();return}


if(d.copy)navigator.clipboard.writeText(d.copy).then(()=>{t.textContent='Көшірілді!'}).catch(()=>{t.textContent='Көшіру мүмкін болмады'})});

/* ---- Phase 5: persistent history, mistakes attempts, regenerate one question, error states ---- */
Object.assign(ERR,{RATE_LIMITED:['Тым көп сұраныс.','Сағатына 20 генерация мүмкін. Кейінірек қайталаңыз.'],AI_KEY_INVALID:['Жасанды интеллект кілті жарамсыз.','Серверде ANTHROPIC_API_KEY дұрыс емес.'],
AI_BUSY:['Жасанды интеллект қазір бос емес.','Бірнеше минуттан соң қайталап көріңіз.'],NO_SOURCE:['Дереккөз сақталмаған.','Бұл тестті ескі нұсқада сақтаған екенсіз. Тестті қайта құрастырыңыз.'],
NO_NEW_QUESTION:['Жаңа сапалы сұрақ табылмады.','Материалдан расталған басқа сұрақ жасау мүмкін болмады.']});
async function loadHist(){const r=await api('/api/attempts');if(r.ok)S.hist=r.j.attempts}
const _boot=boot;boot=async function(){S.booting=true;try{await _boot();if(S.user)await loadHist()}finally{S.booting=false;draw()}};
const _pa=postAttempt;postAttempt=async function(s,rev){await _pa(s,rev);await loadHist()};
function histHtml(){const h=S.hist||[];if(!h.length)return`<div class="card empty">${peony(110)}<h2>Нәтижелер әзірге жоқ</h2><p>Тестті тапсырған соң статистика осында көрінеді.</p><button class="btn" data-go="quizzes">Менің тесттерім</button></div>`;
const avg=Math.round(h.reduce((a,x)=>a+pct(x.score,x.total),0)/h.length),best=Math.max(...h.map(x=>pct(x.score,x.total)));
return`<h2>Нәтижелерім</h2><div class="grid"><div class="card"><div class="muted">Тапсырулар</div><div class="big">${h.length}</div></div><div class="card"><div class="muted">Орташа нәтиже</div><div class="big">${avg}%</div></div><div class="card"><div class="muted">Ең жақсы нәтиже</div><div class="big">${best}%</div></div></div>`+h.map(x=>`<div class="card row sp"><div><b>${esc(x.title)}</b><div class="muted">${x.mistakesOnly?'Қателермен жұмыс':'Тест'} · ${new Date(x.finishedAt).toLocaleDateString('kk-KZ')}</div></div><b>${x.score} / ${x.total} · ${pct(x.score,x.total)}%</b></div>`).join('')}
const _res=V.results;V.results=()=>{if(!S.att.length)return histHtml();const t=_res(),i=t.indexOf('<h2>Тапсырулар тарихы</h2>');return(i>=0?t.slice(0,i):t)+histHtml()};
document.addEventListener('click',async e=>{const t=e.target.closest('[data-mpick],[data-act],[data-regen]');if(!t)return;const d=t.dataset;
if(d.act==='fin'){S.mtotal=S.mq.length;S.mfirst={};S.mposted=false}
if(d.mpick!=null&&S.mq.length){const q=S.mq[S.mi%S.mq.length];if(q&&q.id&&S.mfirst&&S.mfirst[q.id]==null)S.mfirst[q.id]=+d.mpick}
if(d.act==='mnext'&&!S.mq.length&&S.mtotal&&!S.mposted&&S.qid){S.mposted=true;const answers=Object.entries(S.mfirst||{}).map(([questionId,selected])=>({questionId,selected}));
if(answers.length){const r=await api('/api/quizzes/'+S.qid+'/attempts',{method:'POST',headers:H,body:JSON.stringify({mistakesOnly:true,answers})});if(r.ok)loadHist()}}
if(d.regen!=null){const k=+d.regen;if(S.regen!=null)return;S.regen=k;S.err=null;draw();
let id=S.quiz[k]&&S.quiz[k].id;if(!id){await saveQuiz(false);id=S.quiz[k]&&S.quiz[k].id}
if(!id){S.regen=null;draw();return}
const r=await api('/api/quizzes/'+S.qid+'/regenerate',{method:'POST',headers:H,body:JSON.stringify({questionId:id})});S.regen=null;
if(r.ok){const x=r.j.question;S.quiz[k]={id:x.id,q:x.question,o:x.options,c:x.correctIndex,e:x.explanation,x:x.sourceExcerpt,l:x.sourceLocation,d:x.difficulty,f:x.confidence}}else S.err=ERR[r.j.error]||NET;draw()}});
S.booting=true;boot();
