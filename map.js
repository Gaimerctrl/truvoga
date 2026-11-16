/* Карта повітряних загроз — спільний код для index.html (перегляд) і admin.html (адмін) */
(async function(){
"use strict";
const CFG=window.APP_CONFIG||{};
const ADMIN=!!window.IS_ADMIN;
const $=id=>document.getElementById(id);
if(!window.d3){document.body.innerHTML='<p style="padding:20px;color:#fff">Не вдалося завантажити карту. Перевір інтернет і перезавантаж сторінку.</p>';return;}

const BORDER=[[23.6,51.55],[24.0,51.62],[24.4,51.9],[25.2,51.95],[26.0,51.9],[26.9,51.75],[27.7,51.6],[28.2,51.55],[28.7,51.45],[29.2,51.4],[29.7,51.5],[30.2,51.5],[30.55,51.3],[30.6,51.65],[30.95,52.05],[31.3,52.1],[31.8,52.1],[32.2,52.1],[32.4,52.3],[33.2,52.35],[33.6,52.35],[34.1,51.95],[34.4,51.7],[34.2,51.25],[35.1,51.2],[35.4,50.8],[35.6,50.4],[36.1,50.42],[36.6,50.25],[37.4,50.4],[38.0,49.95],[38.3,50.05],[38.9,49.95],[39.2,49.85],[39.7,49.55],[40.1,49.6],[40.15,49.2],[39.7,48.75],[39.9,48.3],[39.75,47.85],[38.85,47.85],[38.25,47.55],[38.2,47.1],[37.55,47.08],[36.8,46.75],[36.2,46.6],[35.5,46.4],[35.2,46.15],[34.95,45.95],[35.3,45.65],[35.9,45.45],[36.6,45.42],[36.45,45.1],[35.4,45.03],[34.9,44.8],[34.4,44.68],[34.15,44.5],[33.75,44.4],[33.5,44.55],[33.55,44.9],[33.35,45.2],[32.5,45.35],[33.0,45.6],[33.6,45.9],[33.7,46.15],[33.2,46.12],[32.6,46.1],[31.95,46.3],[31.55,46.5],[31.5,46.62],[30.75,46.45],[30.5,46.1],[29.9,45.6],[29.7,45.25],[28.9,45.3],[28.2,45.45],[28.5,45.95],[28.9,46.45],[29.2,46.55],[29.9,46.4],[30.1,46.42],[29.9,46.8],[29.6,47.3],[29.2,47.5],[29.15,47.95],[28.6,48.15],[27.8,48.45],[27.0,48.4],[26.6,48.25],[25.9,47.95],[25.1,47.75],[24.6,47.95],[23.5,48.0],[22.9,47.95],[22.6,48.1],[22.15,48.4],[22.55,49.08],[22.65,49.5],[23.5,50.2],[24.1,50.6],[24.0,51.0],[23.6,51.55]];
const DNIPRO=[[30.6,51.6],[30.5,51.0],[30.55,50.45],[31.0,50.05],[31.6,49.7],[32.05,49.45],[32.6,49.15],[33.4,49.07],[34.0,48.8],[34.6,48.5],[35.05,48.45],[35.15,47.85],[34.6,47.6],[34.1,47.5],[33.4,46.75],[32.6,46.62],[32.0,46.55]];
const DNISTER=[[23.0,49.4],[24.1,49.25],[25.0,48.95],[26.2,48.6],[27.3,48.45],[28.2,48.1],[29.0,47.6],[29.6,47.0],[30.1,46.5]];
const DESNA=[[33.4,52.3],[32.9,51.8],[31.3,51.5],[30.6,50.6]];
const PIVD_BUH=[[27.0,49.6],[28.5,49.2],[29.7,48.5],[30.8,47.9],[31.4,47.4],[31.95,46.95],[31.9,46.6]];

// id, назва, [центри для поділу], обласний центр [lon,lat,назва]
// id, назва, обласний центр [lon,lat,назва]
const OBLASTS=[
 ['vin','Вінницька',[28.47,49.23,'Вінниця']],['vol','Волинська',[25.34,50.75,'Луцьк']],
 ['dnp','Дніпропетровська',[35.05,48.46,'Дніпро']],['don','Донецька',[37.8,48.0,'Донецьк']],
 ['zht','Житомирська',[28.66,50.25,'Житомир']],['zak','Закарпатська',[22.3,48.62,'Ужгород']],
 ['zap','Запорізька',[35.14,47.84,'Запоріжжя']],['ifr','Івано-Франківська',[24.71,48.92,'Ів.-Франківськ']],
 ['kyv','Київська',[30.52,50.45,'Київ']],['kir','Кіровоградська',[32.26,48.51,'Кропивницький']],
 ['lug','Луганська',[39.31,48.57,'Луганськ']],['lvv','Львівська',[24.03,49.84,'Львів']],
 ['myk','Миколаївська',[31.99,46.97,'Миколаїв']],['ode','Одеська',[30.73,46.48,'Одеса']],
 ['plt','Полтавська',[34.55,49.59,'Полтава']],['riv','Рівненська',[26.25,50.62,'Рівне']],
 ['sum','Сумська',[34.8,50.91,'Суми']],['ter','Тернопільська',[25.59,49.55,'Тернопіль']],
 ['khr','Харківська',[36.23,49.99,'Харків']],['khs','Херсонська',[32.62,46.64,'Херсон']],
 ['khm','Хмельницька',[26.99,49.42,'Хмельницький']],['chk','Черкаська',[32.06,49.44,'Черкаси']],
 ['chv','Чернівецька',[25.94,48.29,'Чернівці']],['chn','Чернігівська',[31.29,51.49,'Чернігів']],
 ['krm','АР Крим',[34.1,44.95,'Сімферополь']],
];
// райони: назва, [точки поділу] (схематично, за райцентрами)
const RAIONS={
 vin:[['Вінницький',[[28.5,49.3]]],['Гайсинський',[[29.4,48.8]]],['Жмеринський',[[28.0,49.0]]],['Могилів-Подільський',[[27.8,48.5]]],['Тульчинський',[[28.8,48.5]]],['Хмільницький',[[27.9,49.6]]]],
 vol:[['Володимирський',[[24.3,50.85]]],['Камінь-Каширський',[[25.0,51.6]]],['Ковельський',[[24.6,51.3]]],['Луцький',[[25.4,50.75]]]],
 dnp:[['Дніпровський',[[35.0,48.45]]],['Кам’янський',[[34.4,48.6]]],['Криворізький',[[33.4,47.9]]],['Нікопольський',[[34.3,47.6]]],['Самарівський',[[35.3,48.75]]],['Павлоградський',[[35.95,48.5]]],['Синельниківський',[[35.6,48.15]]]],
 don:[['Бахмутський',[[38.0,48.65]]],['Волноваський',[[37.5,47.6]]],['Горлівський',[[38.1,48.3]]],['Донецький',[[37.8,48.0]]],['Кальміуський',[[38.2,47.55]]],['Краматорський',[[37.6,48.9]]],['Маріупольський',[[37.6,47.15]]],['Покровський',[[37.1,48.3]]]],
 zht:[['Бердичівський',[[28.6,49.85]]],['Житомирський',[[28.7,50.3]]],['Звягельський',[[27.6,50.6]]],['Коростенський',[[28.6,51.0]]]],
 zak:[['Берегівський',[[22.65,48.2]]],['Мукачівський',[[22.8,48.5]]],['Рахівський',[[24.2,48.1]]],['Тячівський',[[23.6,48.1]]],['Ужгородський',[[22.4,48.75]]],['Хустський',[[23.3,48.3]]]],
 zap:[['Бердянський',[[36.7,46.85]]],['Василівський',[[35.25,47.4]]],['Запорізький',[[35.4,47.85]]],['Мелітопольський',[[35.3,46.85]]],['Пологівський',[[36.3,47.45]]]],
 ifr:[['Верховинський',[[24.8,48.1]]],['Івано-Франківський',[[24.8,49.0]]],['Калуський',[[24.3,49.0]]],['Коломийський',[[25.1,48.6]]],['Косівський',[[25.1,48.3]]],['Надвірнянський',[[24.5,48.6]]]],
 kyv:[['Білоцерківський',[[30.1,49.75]]],['Бориспільський',[[31.1,50.3]]],['Броварський',[[31.0,50.65]]],['Бучанський',[[29.9,50.55]]],['Вишгородський',[[30.35,51.0]]],['Обухівський',[[30.7,50.05]]],['Фастівський',[[29.8,50.1]]]],
 kir:[['Голованівський',[[30.4,48.4]]],['Кропивницький',[[32.2,48.4]]],['Новоукраїнський',[[31.5,48.3]]],['Олександрійський',[[33.1,48.7]]]],
 lug:[['Алчевський',[[38.75,48.45]]],['Довжанський',[[39.7,48.1]]],['Луганський',[[39.35,48.55]]],['Ровеньківський',[[39.3,48.05]]],['Сватівський',[[38.1,49.5]]],['Сєвєродонецький',[[38.5,48.95]]],['Старобільський',[[39.0,49.3]]],['Щастинський',[[39.4,48.8]]]],
 lvv:[['Дрогобицький',[[23.4,49.3]]],['Золочівський',[[24.9,49.8]]],['Львівський',[[24.2,49.75]]],['Самбірський',[[23.0,49.45]]],['Стрийський',[[23.8,49.15]]],['Шептицький',[[24.3,50.3]]],['Яворівський',[[23.5,49.95]]]],
 myk:[['Баштанський',[[32.5,47.35]]],['Вознесенський',[[31.4,47.6]]],['Миколаївський',[[31.7,46.9]]],['Первомайський',[[30.9,48.0]]]],
 ode:[['Березівський',[[30.9,47.2]]],['Білгород-Дністровський',[[29.9,46.1]]],['Болградський',[[28.6,45.75]]],['Ізмаїльський',[[28.9,45.4]]],['Одеський',[[30.65,46.55]]],['Подільський',[[29.6,47.8]]],['Роздільнянський',[[30.1,46.85]]]],
 plt:[['Кременчуцький',[[33.4,49.15]]],['Лубенський',[[33.0,50.05]]],['Миргородський',[[33.7,50.0]]],['Полтавський',[[34.6,49.55]]]],
 riv:[['Вараський',[[25.8,51.4]]],['Дубенський',[[25.6,50.35]]],['Рівненський',[[26.3,50.7]]],['Сарненський',[[26.7,51.35]]]],
 sum:[['Конотопський',[[33.2,51.2]]],['Охтирський',[[34.9,50.3]]],['Роменський',[[33.5,50.75]]],['Сумський',[[34.85,50.9]]],['Шосткинський',[[33.6,51.9]]]],
 ter:[['Кременецький',[[25.7,50.05]]],['Тернопільський',[[25.5,49.5]]],['Чортківський',[[25.8,48.95]]]],
 khr:[['Берестинський',[[35.4,49.4]]],['Богодухівський',[[35.5,50.2]]],['Ізюмський',[[37.25,49.15]]],['Куп’янський',[[37.7,49.75]]],['Лозівський',[[36.3,48.9]]],['Харківський',[[36.2,50.0]]],['Чугуївський',[[36.75,49.75]]]],
 khs:[['Бериславський',[[33.6,47.05]]],['Генічеський',[[34.7,46.3]]],['Каховський',[[33.8,46.65]]],['Херсонський',[[32.7,46.7]]],['Скадовський',[[32.9,46.25]]]],
 khm:[['Кам’янець-Подільський',[[26.6,48.75]]],['Хмельницький',[[27.0,49.4]]],['Шепетівський',[[27.0,50.15]]]],
 chk:[['Звенигородський',[[31.0,49.1]]],['Золотоніський',[[32.2,49.7]]],['Уманський',[[30.2,48.75]]],['Черкаський',[[31.7,49.35]]]],
 chv:[['Вижницький',[[25.2,48.2]]],['Дністровський',[[26.9,48.45]]],['Чернівецький',[[25.9,48.3]]]],
 chn:[['Корюківський',[[32.3,51.8]]],['Ніжинський',[[31.9,51.0]]],['Новгород-Сіверський',[[33.3,52.05]]],['Прилуцький',[[32.4,50.6]]],['Чернігівський',[[31.2,51.5]]]],
 krm:[['АР Крим',[[34.2,45.3],[33.3,45.45],[35.6,45.3],[33.9,44.75]]]],
};
const KYIV={id:'kyc',name:'м. Київ',lon:30.52,lat:50.45};
const NAMES=Object.fromEntries(OBLASTS.map(o=>[o[0],o[1]]));NAMES[KYIV.id]=KYIV.name;
const RN={};const RBY={};// rid -> {name,oid,lon,lat}; oid -> [rid]
OBLASTS.forEach(o=>{RBY[o[0]]=[];(RAIONS[o[0]]||[]).forEach((r,i)=>{const rid=o[0]+':'+i;RN[rid]={name:r[0],oid:o[0],lon:r[1][0][0],lat:r[1][0][1],pts:r[1]};RBY[o[0]].push(rid);});});
function rLabel(rid){if(rid===KYIV.id)return 'м. Київ';const r=RN[rid];return r.oid==='krm'?'АР Крим':`${r.name} р-н, ${NAMES[r.oid]} обл.`;}

/* ---------- Типи загроз ---------- */
const P={
 delta:"M0,-13 L2,-6 L10,6 L2,5 L1,9 L-1,9 L-2,5 L-10,6 L-2,-6 Z",
 fpv:"M-2,-11 h4 v7 h7 v4 h-7 v7 h-4 v-7 h-7 v-4 h7 Z",
 recon:"M0,-9 L1.5,-2 L10,0 L10,2.5 L1.5,2.5 L1,7 L3.5,9 L-3.5,9 L-1,7 L-1.5,2.5 L-10,2.5 L-10,0 L-1.5,-2 Z",
 rocket:"M0,-13 L3,-6 L3,7 L6.5,12 L-6.5,12 L-3,7 L-3,-6 Z",
 ballistic:"M0,-14 L3.5,-7 L3.5,8 L7,13 L-7,13 L-3.5,8 L-3.5,-7 Z M-1,-2 h2 v6 h-2Z",
 bomb:"M0,-11 C5.5,-7 5.5,3 3,7 L6,11 L-6,11 L-3,7 C-5.5,3 -5.5,-7 0,-11 Z",
 plane:"M0,-12 L2,-4 L11,2 L11,4.5 L2,2.5 L1,8 L4.5,11 L-4.5,11 L-1,8 L-2,2.5 L-11,4.5 L-11,2 L-2,-4 Z",
 unknown:"M0,-11 L11,0 L0,11 L-11,0 Z M-1.6,3 h3.2 v3.2 h-3.2Z M-4,-3.5 C-4,-8 4,-8 4,-3.5 C4,-1 1.6,-0.5 1.6,1.8 L-1.6,1.8 C-1.6,-1.5 1,-1.8 1,-3.5 C1,-5 -1,-5 -1,-3.5Z",
 burst:"M0,-12 L3,-4 L11,-6 L5,1 L10,8 L2,5 L0,12 L-2,5 L-10,8 L-5,1 L-11,-6 L-3,-4 Z",
 shield:"M0,-11 L9,-7 L8,3 L0,11 L-8,3 L-9,-7 Z",
 sh:"M0,-12 L2.5,-5 L13,5 L13,7.5 L2.5,5 L1.5,9 L-1.5,9 L-2.5,5 L-13,7.5 L-13,5 L-2.5,-5 Z",
 g5:"M0,-15 L1.7,-10 L1.7,-3 L11.5,-1 L11.5,1.6 L1.7,1.6 L1.7,9 L5.5,12.5 L-5.5,12.5 L-1.7,9 L-1.7,1.6 L-11.5,1.6 L-11.5,-1 L-1.7,-3 L-1.7,-10 Z",
 jet:"M0,-14 L1.8,-7 L2.2,-2 L10,6 L10,8 L2.2,5 L2,9 L5,12 L-5,12 L-2,9 L-2.2,5 L-10,8 L-10,6 L-2.2,-2 L-1.8,-7 Z",
};
const TYPES={
 shahed:{name:'«Шахед» · тип не уточнено',short:'Шахед',color:'#ff8a00',fill:'#ffffff',glyph:'sh',dir:true,sil:true,extr:true,speed:180,speedTxt:'150–200 км/год',desc:'Загальне позначення ударного БпЛА родини Shahed без підтвердження модифікації.'},
 shahed136:{name:'Shahed-136 / «Герань-2»',short:'Shahed-136',color:'#ff8a00',fill:'#ffffff',glyph:'sh',dir:true,sil:true,extr:true,speed:170,speedTxt:'150–185 км/год',desc:'Ударний БпЛА-камікадзе з поршневим двигуном. Характерний звук «мопеда».'},
 jet:{name:'Реактивний Shahed / «Герань-3»',short:'Реактивний',color:'#ff5e3a',fill:'#ffc9b8',glyph:'jet',dir:true,sil:true,extr:true,speed:500,speedTxt:'400–600 км/год',desc:'Ударний БпЛА з реактивним двигуном. Летить у кілька разів швидше за звичайний «Шахед».'},
 geran4:{name:'«Герань-4» (реактивний)',short:'Герань-4',color:'#ff4d2e',fill:'#ffb199',glyph:'jet',dir:true,sil:true,extr:true,speed:400,speedTxt:'300–400 км/год, до 500',desc:'Реактивний ударний БпЛА з новим планером. За даними ГУР, маневрує на 300–400 км/год, висота до 5 км, дальність до 450 км.'},
 geran5:{name:'«Герань-5» (реактивна)',short:'Герань-5',color:'#ff2d55',fill:'#ff9fb3',glyph:'g5',dir:true,sil:true,extr:true,speed:500,speedTxt:'450–600 км/год',desc:'Фактично дешева крилата ракета з реактивним двигуном: БЧ ~90 кг, дальність ~1000 км. Модифікація К5-К на окремих маневрах — до 1000 км/год.'},
 gerbera:{name:'«Гербера» / дрон-імітатор',short:'Гербера',color:'#c4c4cc',fill:'none',glyph:'sh',dir:true,sil:true,extr:true,speed:150,speedTxt:'~150 км/год',desc:'Дешевий дрон-імітатор для перевантаження ППО. Деякі несуть бойову частину.'},
 fpv:{name:'БпЛА FPV / Ланцет',short:'FPV',color:'#ff7a7a',glyph:'fpv',dir:true,sil:true,extr:true,speed:100,speedTxt:'80–120 км/год',desc:'Ударні дрони малої дальності поблизу лінії фронту.'},
 recon:{name:'Розвідувальний БпЛА',short:'Розвідка',color:'#ffd60a',fill:'#ffe680',glyph:'recon',dir:true,sil:true,extr:true,speed:130,speedTxt:'100–150 км/год',desc:'Розвідка часто передує ударам: коригує ракети й дрони.'},
 cruise:{name:'Крилата ракета',short:'Крилата',color:'#ff375f',glyph:'rocket',dir:true,sil:true,extr:true,speed:750,speedTxt:'700–900 км/год',desc:'Х-101, Калібр та інші. Летять низько й маневрують.'},
 ballistic:{name:'Балістика',short:'Балістика',color:'#bf5af2',glyph:'ballistic',dir:true,sil:true,extr:false,speed:3000,speedTxt:'понад 3000 км/год',desc:'Іскандер-М, KN-23, Кинджал. Час підльоту — лічені хвилини. Одразу в укриття!'},
 kab:{name:'КАБ',short:'КАБ',color:'#40c8e0',glyph:'bomb',dir:true,sil:true,extr:false,speed:400,speedTxt:'—',desc:'Керовані авіабомби, скидаються з літаків поблизу фронту.'},
 aviation:{name:'Авіація / МіГ-31К',short:'Авіація',color:'#e5e7eb',fill:'#ffffff',glyph:'plane',dir:true,sil:true,extr:false,speed:900,speedTxt:'—',desc:'Зліт носіїв ракет (МіГ-31К — Кинджал). Загроза для всієї країни.'},
 unknown:{name:'Невідома ціль',short:'Невідомі',color:'#a1a1aa',glyph:'unknown',dir:true,extr:false,speed:0,desc:'Тип цілі ще уточнюється.'},
 explosion:{name:'Вибух / приліт',short:'Вибух',color:'#ff453a',glyph:'burst',dir:false,speed:0},
 pvo:{name:'Робота ППО',short:'ППО',color:'#30d158',glyph:'shield',dir:false,speed:0},
};
const DRONES=['shahed','shahed136','jet','geran4','geran5','gerbera'];
const DANGER_TYPES=['ballistic','cruise','aviation','jet','geran4','geran5'];
const EXTRAP_MIN=+CFG.EXTRAPOLATE_MIN||20;
const REL={1:'низька',2:'середня',3:'висока'};
const KINDS={info:{name:'Інфо',color:'#3b82f6'},warn:{name:'Увага',color:'#e3b008'},danger:{name:'Загроза',color:'#e5484d'},ok:{name:'Відбій',color:'#30d158'}};
const ORDER=[KYIV.id,...OBLASTS.map(o=>o[0])];

/* ---------- Допоміжне ---------- */
const now=()=>Date.now();
const ts=v=>typeof v==='number'?v:Date.parse(v);
function uid(){try{return crypto.randomUUID();}catch(e){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return (c==='x'?r:(r&3|8)).toString(16);});}}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function fmtTime(t){return new Date(ts(t)).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'});}
function fmtDur(ms){const m=Math.max(0,Math.floor(ms/60000));return m<60?m+' хв':Math.floor(m/60)+' год '+(m%60)+' хв';}
function fmtAgo(t){const m=Math.floor((now()-ts(t))/60000);return m<1?'щойно':m<60?m+' хв тому':Math.floor(m/60)+' год '+(m%60)+' хв тому';}
function dirName(h){return ['північ','пн-схід','схід','пд-схід','південь','пд-захід','захід','пн-захід'][Math.round(h/45)%8];}
function relHtml(r){return `<span class="rel" title="Достовірність: ${REL[r]}">${[1,2,3].map(i=>`<i class="${i<=r?'on':''}"></i>`).join('')}</span>`;}
let toastT=null;function toast(msg){const t=$('toast');t.textContent=msg;t.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>t.style.display='none',5000);}
const prefs=(()=>{try{return JSON.parse(localStorage.getItem('airmap_prefs')||'{}');}catch(e){return {};}})();
function savePrefs(){try{localStorage.setItem('airmap_prefs',JSON.stringify(prefs));}catch(e){}}

/* ---------- Дані та сховище ---------- */
// D.threats: [{id,type,lon,lat,heading,count,note,reliability,trail,created_at,updated_at}]
// D.alerts: {rid:{l:1|2,t:ms}}   D.posts: [{id,text,kind,created_at}]
let D={threats:[],alerts:{},posts:[]};
let cfgError='';
if(CFG.SUPABASE_URL){CFG.SUPABASE_URL=String(CFG.SUPABASE_URL).trim().replace(/\/+$/,'');if(!/^https?:\/\//i.test(CFG.SUPABASE_URL))CFG.SUPABASE_URL='https://'+CFG.SUPABASE_URL;}
if(CFG.SUPABASE_ANON_KEY){CFG.SUPABASE_ANON_KEY=String(CFG.SUPABASE_ANON_KEY).trim();if(!/^(eyJ|sb_publishable_)/.test(CFG.SUPABASE_ANON_KEY))cfgError='Ключ у config.js не схожий на anon / publishable ключ Supabase (він починається з eyJ… або sb_publishable_…).';}
let backend;
try{backend=(CFG.SUPABASE_URL&&CFG.SUPABASE_ANON_KEY&&window.supabase)?supaBackend():localBackend();}
catch(e){console.error(e);cfgError='Помилка налаштувань Supabase: '+(e.message||e);backend=localBackend();}

function localBackend(){
  const KEY='airmap_demo_v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{threats:[],alerts:{},posts:[]};}catch(e){return {threats:[],alerts:{},posts:[]};}};
  const write=st=>{try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}};
  let cb=null;
  const mut=f=>{const st=read();f(st);write(st);cb&&setTimeout(cb,0);};
  return {
    kind:'local',
    async load(){const st=read();return {threats:st.threats,alerts:st.alerts,posts:[...st.posts].sort((a,b)=>ts(b.created_at)-ts(a.created_at))};},
    subscribe(f,status){cb=f;window.addEventListener('storage',e=>{if(e.key===KEY)f();});status('local');},
    async upsertThreat(t){mut(st=>{const i=st.threats.findIndex(x=>x.id===t.id);if(i>=0)st.threats[i]=t;else st.threats.push(t);});},
    async deleteThreats(ids){mut(st=>{st.threats=st.threats.filter(x=>!ids.includes(x.id));});},
    async clearThreats(){mut(st=>{st.threats=[];});},
    async setAlerts(ch){mut(st=>{Object.keys(ch).forEach(r=>{if(ch[r])st.alerts[r]={l:ch[r],t:now()};else delete st.alerts[r];});});},
    async addPost(p){mut(st=>{st.posts.push(p);if(st.posts.length>200)st.posts=st.posts.slice(-200);});},
    async deletePosts(ids){mut(st=>{st.posts=st.posts.filter(x=>!ids.includes(x.id));});},
    async session(){return {email:'demo',admin:true};},
    async signIn(){return {email:'demo',admin:true};}, async signOut(){},
  };
}
function supaBackend(){
  const sb=window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY);
  const chk=r=>{if(r.error)throw r.error;return r.data;};
  const toRow=t=>({id:t.id,type:t.type,lon:t.lon,lat:t.lat,heading:t.heading,count:t.count,note:t.note||'',reliability:t.reliability,trail:t.trail||[],updated_at:new Date(ts(t.updated_at)).toISOString()});
  async function isAdmin(){const r=await sb.rpc('is_admin');return !r.error&&r.data===true;}
  return {
    kind:'supabase',
    async load(){
      const [t,a,p]=await Promise.all([sb.from('threats').select('*'),sb.from('alerts').select('*'),sb.from('posts').select('*').order('created_at',{ascending:false}).limit(60)]);
      const alerts={};chk(a).forEach(r=>alerts[r.rid]={l:r.level,t:ts(r.started_at),src:r.source||'manual'});
      return {threats:chk(t).map(r=>Object.assign({},r,{trail:r.trail||[]})),alerts,posts:chk(p)};
    },
    subscribe(f,status){
      let tm=null;const deb=()=>{clearTimeout(tm);tm=setTimeout(f,250);};
      sb.channel('airmap').on('postgres_changes',{event:'*',schema:'public',table:'threats'},deb)
        .on('postgres_changes',{event:'*',schema:'public',table:'alerts'},deb)
        .on('postgres_changes',{event:'*',schema:'public',table:'posts'},deb)
        .subscribe(s=>{status(s==='SUBSCRIBED'?'ok':(s==='CHANNEL_ERROR'||s==='TIMED_OUT'||s==='CLOSED')?'bad':'wait');if(s==='SUBSCRIBED')f();});
      setInterval(f,60000);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)f();});
    },
    async upsertThreat(t){chk(await sb.from('threats').upsert(toRow(t)));},
    async deleteThreats(ids){chk(await sb.from('threats').delete().in('id',ids));},
    async clearThreats(){chk(await sb.from('threats').delete().not('id','is',null));},
    async setAlerts(ch){
      const up=[],del=[];const iso=new Date().toISOString();
      Object.keys(ch).forEach(r=>ch[r]?up.push({rid:r,level:ch[r],started_at:iso,source:'manual'}):del.push(r));
      if(up.length)chk(await sb.from('alerts').upsert(up));
      if(del.length)chk(await sb.from('alerts').delete().in('rid',del));
    },
    async addPost(p){chk(await sb.from('posts').insert({id:p.id,text:p.text,kind:p.kind}));},
    async deletePosts(ids){chk(await sb.from('posts').delete().in('id',ids));},
    async session(){const r=await sb.auth.getSession();const s=r.data&&r.data.session;if(!s)return null;return {email:s.user.email,admin:await isAdmin()};},
    async signIn(email,password){const r=await sb.auth.signInWithPassword({email,password});if(r.error)throw r.error;return {email:r.data.user.email,admin:await isAdmin()};},
    async signOut(){await sb.auth.signOut();},
  };
}
function fail(e){console.error(e);toast('Помилка збереження: '+(e&&e.message||e)+'. Дані оновлено з сервера.');refresh();}

/* ---------- Справжні межі районів (GeoJSON, CC BY 4.0: github.com/slawomirmatuszak/ukrainian_geodata) ---------- */
const GEO_SOURCES=[
  ['geo/rayony.geojson','geo/regiony.geojson'],
  ['https://cdn.jsdelivr.net/gh/slawomirmatuszak/ukrainian_geodata@main/rayony.geojson','https://cdn.jsdelivr.net/gh/slawomirmatuszak/ukrainian_geodata@main/regiony.geojson'],
];
const ALIAS={'Шептицький':['Червоноградський'],'Самарівський':['Новомосковський'],'Берестинський':['Красноградський'],'Звягельський':['Новоград-Волинський','Новоградволинський'],'Довжанський':['Свердловський']};
const normName=s=>String(s||'').toLowerCase().replace(/район|р-н|raion|rayon/g,'').replace(/[^а-яіїєґa-z]/g,'');
async function fetchJson(u){const c=new AbortController();const t=setTimeout(()=>c.abort(),25000);try{const r=await fetch(u,{signal:c.signal});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(t);}}
function walkCoords(c,f){if(typeof c[0]==='number')f(c);else c.forEach(x=>walkCoords(x,f));}
function cleanFC(fc){
  if(!fc)return null;if(fc.type==='Feature')fc={type:'FeatureCollection',features:[fc]};
  if(!fc.features)return null;
  const feats=fc.features.filter(f=>f&&f.geometry&&(f.geometry.type==='Polygon'||f.geometry.type==='MultiPolygon'));
  let big=false;feats.forEach(f=>walkCoords(f.geometry.coordinates,p=>{if(Math.abs(p[0])>180||Math.abs(p[1])>90)big=true;}));
  feats.forEach(f=>walkCoords(f.geometry.coordinates,p=>{if(big){p[0]=p[0]/6378137*180/Math.PI;p[1]=(2*Math.atan(Math.exp(p[1]/6378137))-Math.PI/2)*180/Math.PI;}p.length=2;}));
  feats.forEach(f=>{const g=f.geometry;const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;
    polys.forEach(poly=>poly.forEach((ring,i)=>{const small=d3.geoArea({type:'Polygon',coordinates:[ring]})<=2*Math.PI;if(i===0?!small:small)ring.reverse();}));});
  return {type:'FeatureCollection',features:feats};
}
function featName(p){let best='',bs=-1e9;for(const [k,v] of Object.entries(p||{})){if(typeof v!=='string'||!/[а-яіїєґ]/i.test(v))continue;
  let s=0;if(/район/i.test(v))s+=3;if(/(ськ|цьк|зьк)ий/i.test(v))s+=2;if(/name|назв|ray|raion|adm2|admin2|nazva/i.test(k))s+=2;if(/obl|region|adm1|admin1|област/i.test(k)||/област/i.test(v))s-=4;
  if(s>bs){bs=s;best=v;}}return best;}
function prepGeo(raw){
  const fc=cleanFC(raw);if(!fc||fc.features.length<60)return null;
  const byNorm={};Object.keys(RN).forEach(rid=>{const nm=RN[rid].name;[nm,...(ALIAS[nm]||[])].forEach(n=>{(byNorm[normName(n)]=byNorm[normName(n)]||[]).push(rid);});});
  fc.features.forEach(f=>{
    f._bb=d3.geoBounds(f);const nm=featName(f.properties);const nn=normName(nm);
    if(/київ/i.test(nm)&&!/ськ/i.test(nm)){f.rid=KYIV.id;f.oid=KYIV.id;f.srcName=nm;return;}
    if(/севастоп/i.test(nm)){f.rid='krm:0';f.oid='krm';f.srcName=nm;return;}
    const bb=f._bb,inBB=q=>q[0]>=bb[0][0]&&q[0]<=bb[1][0]&&q[1]>=bb[0][1]&&q[1]<=bb[1][1];
    const inside=Object.keys(RN).filter(rid=>RN[rid].pts.some(q=>inBB(q)&&d3.geoContains(f,q)));
    const byName=(byNorm[nn]||[]);
    let rid=inside.find(r=>byName.includes(r))||(inside.length===1?inside[0]:null)||(byName.length===1?byName[0]:null)||inside[0]||null;
    if(!rid&&byName.length){const c=d3.geoCentroid(f);rid=byName.slice().sort((x,y)=>distKm(c[0],c[1],RN[x].lon,RN[x].lat)-distKm(c[0],c[1],RN[y].lon,RN[y].lat))[0];}
    if(!rid){const c=d3.geoCentroid(f);let bd=1e9;Object.keys(RN).forEach(r=>{const d=distKm(c[0],c[1],RN[r].lon,RN[r].lat);if(d<bd){bd=d;rid=r;}});}
    f.rid=rid;f.oid=RN[rid].oid;f.srcName=nm;
  });
  return {raions:fc.features};
}
async function loadGeo(){
  if(CFG.SCHEMATIC_MAP)return null;
  const ld=document.createElement('div');ld.id='geoLoading';ld.innerHTML='<div class="spin"></div>Завантаження карти…';$('mapwrap').appendChild(ld);
  try{
    for(const [ra,re] of GEO_SOURCES){
      try{const g=prepGeo(await fetchJson(ra));if(!g)continue;
        try{const r=cleanFC(await fetchJson(re));if(r&&r.features.length>=20)g.regions=r.features;}catch(e){}
        return g;}catch(e){console.warn('Межі районів не завантажились з',ra,e);}
    }
    return null;
  }finally{ld.remove();}
}
function distKm(a,b,c,d){return d3.geoDistance([a,b],[c,d])*6371;}
const GEO=await loadGeo();

/* ---------- Карта ---------- */
const W=1000,H=700;
const svg=d3.select('#map').attr('viewBox',`0 0 ${W} ${H}`).attr('preserveAspectRatio','xMidYMid meet');
let ring=BORDER.slice();
const feature={type:'Feature',geometry:{type:'Polygon',coordinates:[ring]}};
if(d3.geoArea(feature)>2*Math.PI){ring=ring.reverse();feature.geometry.coordinates=[ring];}
const fitTarget=GEO?{type:'FeatureCollection',features:GEO.raions}:feature;
const proj=d3.geoMercator().fitExtent([[20,ADMIN?80:20],[W-20,H-20]],fitTarget);
const gpath=d3.geoPath(proj);
const lineGen=d3.line().curve(d3.curveCatmullRom.alpha(.5));
const pr=(lon,lat)=>proj([lon,lat]);
const inv=(x,y)=>proj.invert([x,y]);
let mode=ADMIN?'select':'view',selected=null,k=1,hoverRid=null,dragging=false;

const clip=svg.append('defs').append('clipPath').attr('id','uaClip');
if(GEO)GEO.raions.forEach(f=>clip.append('path').attr('d',gpath(f)));else clip.append('path').attr('d',gpath(feature));
const zg=svg.append('g');
const gLand=zg.append('g');
const gBounds=zg.append('g').style('pointer-events','none');
const gRivers=zg.append('g').attr('clip-path','url(#uaClip)').style('pointer-events','none');
const gBorder=zg.append('g').style('pointer-events','none');
const gKyiv=zg.append('g');
const gRLabels=zg.append('g').style('pointer-events','none');
const gCities=zg.append('g');
const gTrails=zg.append('g');
const gMarkers=zg.append('g');
const preview=zg.append('line').attr('id','preview').style('display','none');
const gHome=zg.insert('g',()=>gTrails.node()).attr('class','home').style('pointer-events','none');

const seeds=[];Object.keys(RN).forEach(rid=>RN[rid].pts.forEach(q=>seeds.push({rid,oid:RN[rid].oid,p:pr(q[0],q[1])})));
const delaunay=d3.Delaunay.from(seeds.map(s=>s.p));
let cells;
if(GEO){
  cells=gLand.selectAll('path.cell').data(GEO.raions).join('path').attr('class','cell').attr('d',f=>gpath(f));
  gBounds.append('path').attr('class','rbounds').attr('d',GEO.raions.map(f=>gpath(f)).join(''));
  // межі областей: з regiony або між районами різних областей
  if(GEO.regions)gBounds.append('path').attr('class','bounds').attr('d',GEO.regions.map(f=>gpath(f)).join(''));
  else{const byO={};GEO.raions.forEach(f=>(byO[f.oid]=byO[f.oid]||[]).push(f));}
}else{
  const vor=delaunay.voronoi([-200,-200,W+200,H+200]);
  gLand.attr('clip-path','url(#uaClip)');gBounds.attr('clip-path','url(#uaClip)');
  cells=gLand.selectAll('path.cell').data(seeds).join('path').attr('class','cell').attr('d',(d,i)=>vor.renderCell(i));
  const {halfedges,triangles}=delaunay;const cc=vor.circumcenters;let dR='',dO='';
  for(let e=0;e<halfedges.length;e++){const j=halfedges[e];if(j<e)continue;
   const a=seeds[triangles[e]],b=seeds[triangles[e%3===2?e-2:e+1]];if(a.rid===b.rid)continue;
   const t1=Math.floor(e/3),t2=Math.floor(j/3);const seg=`M${cc[t1*2]},${cc[t1*2+1]}L${cc[t2*2]},${cc[t2*2+1]}`;
   if(a.oid===b.oid)dR+=seg;else dO+=seg;}
  gBounds.append('path').attr('class','rbounds').attr('d',dR);
  gBounds.append('path').attr('class','bounds').attr('d',dO);
  gBorder.append('path').attr('class','border').attr('d',gpath(feature));
}
cells.on('mouseenter',(e,d)=>{hoverRid=d.rid;paintCells();showHint(rLabel(d.rid)+lvlTxt(d.rid));})
  .on('mouseleave',()=>{hoverRid=null;paintCells();showHint();})
  .on('click',(e,d)=>{
    if(ADMIN&&mode==='alert'){applyAlert(alertScope==='oblast'?ridsOf(d.oid):[d.rid],d.oid);}
    else if(ADMIN&&mode==='select'&&e.detail>=2){cycleOblast(d.oid);}
    else if(!ADMIN){showHint(rLabel(d.rid)+lvlTxt(d.rid),3500);}
  });
[DNIPRO,DNISTER,DESNA,PIVD_BUH].forEach((r,i)=>gRivers.append('path').attr('class','river').attr('data-w',i===0?3:1.6).attr('d',lineGen(r.map(p=>pr(p[0],p[1])))));
const kyivPoly=GEO&&GEO.raions.some(f=>f.rid===KYIV.id);
const kp=pr(KYIV.lon,KYIV.lat);const KYIV_R=Math.abs(pr(KYIV.lon,KYIV.lat+0.14)[1]-kp[1]);
const kyivC=gKyiv.append('circle').attr('class','kyiv').attr('cx',kp[0]).attr('cy',kp[1])
  .on('click',e=>{if(ADMIN&&mode==='alert'){e.stopPropagation();applyAlert([KYIV.id],KYIV.id);}else if(ADMIN&&mode==='select'&&e.detail>=2){e.stopPropagation();cycleOblast(KYIV.id);}else if(!ADMIN){e.stopPropagation();showHint('м. Київ'+lvlTxt(KYIV.id),3500);}})
  .on('mouseenter',()=>showHint('м. Київ'+lvlTxt(KYIV.id))).on('mouseleave',()=>showHint());
if(kyivPoly)kyivC.style('display','none');
// підписи районів: у центрі найбільшої частини району
const labelPos={};
Object.keys(RN).forEach(r=>labelPos[r]=pr(RN[r].lon,RN[r].lat));
if(GEO){const best={};GEO.raions.forEach(f=>{const a=gpath.area(f);if(!best[f.rid]||a>best[f.rid].a)best[f.rid]={a,c:gpath.centroid(f)};});Object.keys(best).forEach(r=>{if(isFinite(best[r].c[0]))labelPos[r]=best[r].c;});}
const rl=gRLabels.selectAll('text').data(Object.keys(RN).filter(r=>RN[r].oid!=='krm')).join('text').attr('class','rlabel')
  .attr('text-anchor','middle').attr('x',r=>labelPos[r][0]).attr('y',r=>labelPos[r][1]).text(r=>RN[r].name);
const cities=OBLASTS.map(o=>({lon:o[2][0],lat:o[2][1],name:o[2][2]}));
const cg=gCities.selectAll('g').data(cities).join('g').attr('class','city').style('pointer-events','none')
  .attr('transform',d=>{const p=pr(d.lon,d.lat);return `translate(${p[0]},${p[1]})`;});
cg.append('circle');cg.append('text');

const zoom=d3.zoom().scaleExtent([1,14]).translateExtent([[-100,-100],[W+100,H+100]])
  .filter(e=>{if(e.type==='wheel')return true;if(e.type==='dblclick')return false;if(e.touches&&e.touches.length>1)return true;return (mode==='select'||mode==='view'||mode==='pick')&&!e.button;})
  .on('zoom',e=>{zg.attr('transform',e.transform);k=e.transform.k;if(e.sourceEvent&&e.sourceEvent.type!=='wheel'&&followId){followId=null;renderPopup(true);}rescale();});
svg.call(zoom).on('dblclick.zoom',null);
d3.select('#zin').on('click',()=>svg.transition().duration(250).call(zoom.scaleBy,1.6));
d3.select('#zout').on('click',()=>svg.transition().duration(250).call(zoom.scaleBy,1/1.6));
d3.select('#zreset').on('click',()=>svg.transition().duration(350).call(zoom.transform,d3.zoomIdentity));
function rescale(){
  gBorder.select('path').attr('stroke-width',2/k);
  gBounds.select('.bounds').attr('stroke-width',1.5/Math.sqrt(k));gBounds.select('.rbounds').attr('stroke-width',.6/k);
  rl.attr('dy',13/k).attr('font-size',9.5/k).style('stroke-width',(2.5/k)+'px').style('display',k>=2.4?null:'none');
  gRivers.selectAll('path').attr('stroke-width',function(){return (+this.dataset.w)/Math.sqrt(k);});
  kyivC.attr('r',Math.max(KYIV_R*.6,7/k)).attr('stroke-width',1.2/k);
  cg.select('circle').attr('r',2.6/k);
  cg.select('text').style('stroke-width',(3/k)+'px').attr('font-size',11/k).attr('dx',4/k).attr('dy',-4/k).text(d=>d.name);
  renderMarkers();
}
let hintT=null;
function showHint(txt,dur){const h=$('hint');if(!h)return;clearTimeout(hintT);
  if(txt){h.textContent=txt;if(dur)hintT=setTimeout(()=>showHint(),dur);return;}
  h.textContent=defaultHint();}
function defaultHint(){
  if(!ADMIN)return '';
  if(mode==='select')return 'Перетягуй карту · клікни ціль, щоб змінити · подвійний клік по області — тривога/загроза/відбій';
  if(mode==='alert')return `Клікни ${alertScope==='oblast'?'область':'район'} → ${alertLvl===2?'🔴 тривога':alertLvl===1?'🟡 загроза':'🟢 відбій'} · повторний клік знімає`;
  return TYPES[mode].dir?`Клікни, щоб поставити «${TYPES[mode].name}». Потягни — щоб задати курс`:`Клікни, щоб позначити «${TYPES[mode].name}»`;
}

/* ---------- Тривоги ---------- */
let alertLvl=2,alertScope='raion';
function lvl(rid){return D.alerts[rid]?D.alerts[rid].l:0;}
function lvlTxt(rid){const l=lvl(rid);return l===2?' — 🔴 тривога':l===1?' — 🟡 загроза':'';}
function ridsOf(oid){return oid===KYIV.id?[KYIV.id]:RBY[oid];}
function scopeName(rids,oid){if(oid===KYIV.id)return 'м. Київ';if(rids.length>1&&rids.length===RBY[oid].length)return NAMES[oid]+' обл.';return rids.map(rLabel).join(', ');}
function oblStatus(oid){const rids=ridsOf(oid);const ls=rids.map(lvl);const n=ls.filter(x=>x).length,r=ls.filter(x=>x===2).length;
  const full=n===rids.length?(r===n?2:r===0?1:3):0;const tt=rids.filter(x=>D.alerts[x]).map(x=>D.alerts[x].t);
  return {n,r,y:n-r,total:rids.length,full,t:tt.length?Math.min(...tt):0};}
function applyAlert(rids,oid,lv){
  if(lv==null)lv=alertLvl;
  const clear=lv===0||rids.every(r=>lvl(r)===lv);const ch={};
  if(clear){rids.forEach(r=>{if(lvl(r))ch[r]=0;});}else{rids.forEach(r=>{if(lvl(r)!==lv)ch[r]=lv;});}
  if(!Object.keys(ch).length)return;
  Object.keys(ch).forEach(r=>{if(ch[r])D.alerts[r]={l:ch[r],t:now()};else delete D.alerts[r];});
  renderAll();backend.setAlerts(ch).catch(fail);
  if(prefs.autoPost)postMsg((clear?'🟢 Відбій: ':(lv===2?'🔴 Тривога: ':'🟡 Загроза: '))+scopeName(rids,oid),clear?'ok':lv===2?'danger':'warn');
}
function cycleOblast(oid){const st=oblStatus(oid);applyAlert(ridsOf(oid),oid,st.full===2?1:(st.n?0:2));}
function paintCells(){
  gLand.selectAll('.cell').attr('class',d=>{const l=lvl(d.rid);return 'cell'+(l===2?' on':l===1?' warn':'')+(d.rid===hoverRid?' hover':'');});
  const kl=lvl(KYIV.id);kyivC.classed('on',kl===2).classed('warn',kl===1);
}

/* ---------- Цілі ---------- */
const whereCache=new Map();
function findFeature(lon,lat){const key=lon.toFixed(3)+','+lat.toFixed(3);if(whereCache.has(key))return whereCache.get(key);let hit=null;
  for(const f of GEO.raions){const b=f._bb;if(lon<b[0][0]||lon>b[1][0]||lat<b[0][1]||lat>b[1][1])continue;if(d3.geoContains(f,[lon,lat])){hit=f;break;}}
  if(whereCache.size>5000)whereCache.clear();whereCache.set(key,hit);return hit;}
function whereObj(lon,lat){const p=pr(lon,lat);
  if(!kyivPoly&&Math.hypot(p[0]-kp[0],p[1]-kp[1])<KYIV_R)return {rid:KYIV.id,oid:KYIV.id};
  if(GEO){const f=findFeature(lon,lat);if(f)return {rid:f.rid,oid:f.oid};}
  const s=seeds[delaunay.find(p[0],p[1])];return {rid:s.rid,oid:s.oid};}
function nearestCity(lon,lat){let best=null,bd=1e9;cities.forEach(c=>{const d=distKm(lon,lat,c.lon,c.lat);if(d<bd){bd=d;best=c;}});
  return bd<25?`біля м. ${best.name}`:bd<120?`${Math.round(bd)} км від м. ${best.name}`:'';}
function whereIs(lon,lat){const w=whereObj(lon,lat);const near=nearestCity(lon,lat);return rLabel(w.rid)+(near&&w.rid!==KYIV.id?`, ${near}`:'');}
function ageMin(m){return (now()-ts(m.updated_at))/60000;}
function opacityOf(m){const a=ageMin(m);return a<20?1:a<60?.8:.55;}
function showDir(m){return m.heading!=null&&(ADMIN||m.reliability>=2);}
function destPoint(lon,lat,brg,km){const R=6371,d=km/R,t=brg*Math.PI/180,f1=lat*Math.PI/180,l1=lon*Math.PI/180;
  const f2=Math.asin(Math.sin(f1)*Math.cos(d)+Math.cos(f1)*Math.sin(d)*Math.cos(t));
  const l2=l1+Math.atan2(Math.sin(t)*Math.sin(d)*Math.cos(f1),Math.cos(d)-Math.sin(f1)*Math.sin(f2));return [l2*180/Math.PI,f2*180/Math.PI];}
function bearing(a,b){const f1=a[1]*Math.PI/180,f2=b[1]*Math.PI/180,dl=(b[0]-a[0])*Math.PI/180;
  return (Math.atan2(Math.sin(dl)*Math.cos(f2),Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl))*180/Math.PI+360)%360;}
function moving(m){const t=TYPES[m.type];return prefs.extrap!==false&&t&&t.extr&&m.heading!=null&&m.reliability>=2&&t.speed>0;}
function posOf(m){if(!moving(m))return [m.lon,m.lat];const min=Math.min(EXTRAP_MIN,Math.max(0,(now()-ts(m.updated_at))/60000));
  return min<0.05?[m.lon,m.lat]:destPoint(m.lon,m.lat,m.heading,TYPES[m.type].speed*min/60);}
function rebase(m){const p=posOf(m);if(p[0]!==m.lon||p[1]!==m.lat){m.trail=(m.trail||[]).concat([[m.lon,m.lat]]).slice(-40);m.lon=p[0];m.lat=p[1];}m.updated_at=now();}

let followId=null;
function renderMarkers(){
  const sel=gMarkers.selectAll('g.marker').data(D.threats.filter(m=>TYPES[m.type]),d=>d.id);
  const ent=sel.enter().append('g').attr('class','marker');
  ent.append('path').attr('class','tail');ent.append('path').attr('class','heading');ent.append('path').attr('class','arrowhead');
  ent.append('circle').attr('class','halo').attr('r',15);ent.append('path').attr('class','glyph');
  ent.append('text').attr('class','badge').attr('x',12).attr('y',-11);
  if(ADMIN)ent.call(d3.drag().filter(e=>mode==='select'&&!e.button)
    .on('start',function(e,d){d._moved=false;const p=posOf(d);d._orig=[p[0],p[1]];dragging=true;})
    .on('drag',function(e,d){const p=d3.pointer(e.sourceEvent,zg.node());const ll=inv(p[0],p[1]);d.lon=ll[0];d.lat=ll[1];d.updated_at=now();d._moved=true;renderMarkers();})
    .on('end',function(e,d){dragging=false;if(d._moved){d.trail=(d.trail||[]).concat([d._orig]).slice(-40);d.updated_at=now();saveThreat(d,0);renderAll();}}));
  ent.on('click',(e,d)=>{e.stopPropagation();if(!ADMIN||mode==='select'||mode in TYPES)select(d.id);});
  sel.exit().remove();
  const all=ent.merge(sel);
  const sc=1/Math.pow(k,.85);
  all.classed('sel',d=>d.id===selected).classed('low',d=>d.reliability===1).classed('sil',d=>!!TYPES[d.type].sil)
    .attr('opacity',d=>opacityOf(d)*(d.reliability===1?.75:1))
    .attr('transform',d=>{const q=posOf(d);const p=pr(q[0],q[1]);return `translate(${p[0]},${p[1]}) scale(${sc})`;});
  all.select('.halo').attr('stroke',d=>TYPES[d.type].color).style('display',d=>!TYPES[d.type].sil||d.id===selected?null:'none');
  all.select('.glyph').attr('d',d=>P[TYPES[d.type].glyph]).attr('fill-rule','evenodd')
    .attr('fill',d=>{const t=TYPES[d.type];return t.fill==='none'?'rgba(0,0,0,.35)':(t.fill||t.color);})
    .attr('stroke',d=>{const t=TYPES[d.type];return t.sil?(t.fill==='none'?t.color:'#05080c'):null;})
    .attr('stroke-width',d=>TYPES[d.type].fill==='none'?1.8:1.1)
    .attr('stroke-dasharray',d=>d.reliability===1&&TYPES[d.type].sil?'3 2':null)
    .attr('transform',d=>{const t=TYPES[d.type];const r=d.heading!=null&&t.dir&&d.type!=='unknown'?`rotate(${d.heading})`:'';return r+(t.sil?' scale(1.15)':'');});
  // «хвіст» позаду силуету
  all.select('.tail').attr('stroke',d=>TYPES[d.type].fill&&TYPES[d.type].fill!=='none'?TYPES[d.type].fill:TYPES[d.type].color)
    .attr('d',d=>{if(!TYPES[d.type].sil||!showDir(d))return null;const r=d.heading*Math.PI/180;return `M${-Math.sin(r)*12},${Math.cos(r)*12}L${-Math.sin(r)*34},${Math.cos(r)*34}`;});
  // стрілка курсу — для звичайних іконок або вибраної цілі
  const arrow=d=>showDir(d)&&!TYPES[d.type].sil;
  all.select('.heading').attr('stroke',d=>TYPES[d.type].color)
    .attr('d',d=>{if(!arrow(d))return null;const r=d.heading*Math.PI/180;return `M${Math.sin(r)*17},${-Math.cos(r)*17}L${Math.sin(r)*52},${-Math.cos(r)*52}`;});
  all.select('.arrowhead').attr('fill',d=>TYPES[d.type].color).attr('d',d=>arrow(d)?'M0,-60 L6,-50 L-6,-50Z':null).attr('transform',d=>arrow(d)?`rotate(${d.heading})`:null);
  all.select('.badge').text(d=>d.count>1?'×'+d.count:'');
  // пройдений шлях
  const tr=gTrails.selectAll('path.trail').data(D.threats.filter(m=>m.trail&&m.trail.length&&TYPES[m.type]),d=>d.id);
  tr.exit().remove();
  tr.enter().append('path').attr('class','trail').merge(tr).attr('stroke',d=>d.id===selected?'#ffffff':TYPES[d.type].color)
    .attr('opacity',d=>d.id===selected?.9:.45)
    .attr('stroke-width',d=>(d.id===selected?2:1.4)/k).attr('stroke-dasharray',d=>d.id===selected?null:`${2/k} ${4/k}`)
    .attr('d',d=>lineGen([...d.trail,posOf(d)].map(p=>pr(p[0],p[1]))));
  // прогноз для вибраної цілі: точки через 5/10/15 хв
  const m=D.threats.find(x=>x.id===selected);const fc=gTrails.selectAll('g.forecast').data(m&&showDir(m)&&TYPES[m.type].speed&&TYPES[m.type].sil?[m]:[],d=>d.id);
  fc.exit().remove();
  const fe=fc.enter().append('g').attr('class','forecast');fe.append('path');
  fe.merge(fc).each(function(d){const g=d3.select(this);const p0=posOf(d);const sp=TYPES[d.type].speed;
    const marks=[5,10,15].map(mn=>({mn,ll:destPoint(p0[0],p0[1],d.heading,sp*mn/60)}));
    g.select('path').attr('d',`M${pr(p0[0],p0[1])}L${pr(marks[2].ll[0],marks[2].ll[1])}`).attr('stroke','#fff').attr('stroke-width',1.6/k).attr('stroke-dasharray',`${5/k} ${4/k}`).attr('opacity',.8).attr('fill','none');
    const dots=g.selectAll('g.fm').data(marks).join(en=>{const x=en.append('g').attr('class','fm');x.append('circle');x.append('text');return x;});
    dots.attr('transform',q=>{const p=pr(q.ll[0],q.ll[1]);return `translate(${p[0]},${p[1]})`;});
    dots.select('circle').attr('r',3/k).attr('fill','#fff');
    dots.select('text').attr('x',5/k).attr('y',-5/k).attr('font-size',10/k).style('stroke-width',(2.5/k)+'px').text(q=>q.mn+' хв');});
  renderHome();
}
const saveTimers={};
function saveThreat(m,delay){clearTimeout(saveTimers[m.id]);saveTimers[m.id]=setTimeout(()=>{const c=Object.assign({},m);delete c._moved;delete c._orig;backend.upsertThreat(c).catch(fail);},delay==null?400:delay);}
function delThreat(m){D.threats=D.threats.filter(x=>x.id!==m.id);if(selected===m.id)selected=null;renderAll();backend.deleteThreats([m.id]).catch(fail);}

function glyphSvg(type,size){
  const s=size?` width="${size}" height="${size}"`:'';
  if(type==='select')return `<svg${s} viewBox="-12 -12 24 24"><path d="M-6,-10 L7,2 L1,3 L4,10 L1,11 L-2,4 L-6,8 Z" fill="#e6edf3"/></svg>`;
  if(type==='alert')return `<svg${s} viewBox="-12 -12 24 24"><path d="M0,-10 L10,9 L-10,9Z" fill="#e5484d"/><path d="M-1,-3h2v6h-2zM-1,5h2v2h-2z" fill="#fff"/></svg>`;
  const t=TYPES[type];return `<svg${s} viewBox="-14 -14 28 28"><path d="${P[t.glyph]}" fill="${t.color}" fill-rule="evenodd"/></svg>`;
}

/* ---------- Попап цілі ---------- */
function select(id){selected=id;renderMarkers();renderPopup(true);}
svg.on('click.desel',e=>{if((mode==='select'||mode==='view')&&!e.target.closest('.marker')&&selected){selected=null;renderMarkers();renderPopup(true);}});
function renderPopup(force){
  const box=$('popup');const m=D.threats.find(x=>x.id===selected);
  if(!m){box.style.display='none';return;}
  if(!force&&((box.contains(document.activeElement)&&document.activeElement.tagName==='INPUT')||box.dataset.id===m.id)){const i=box.querySelector('.meta');if(i)i.innerHTML=metaHtml(m);const l=box.querySelector('.live');if(l)l.innerHTML=liveHtml(m);return;}
  box.dataset.id=m.id;
  const t=TYPES[m.type];box.style.display='block';
  if(ADMIN&&innerWidth>820)box.style.top=($('toolbar').offsetHeight+18)+'px';
  let h=`<h3>${glyphSvg(m.type,20)} ${t.name}${m.count>1?' ×'+m.count:''}</h3>`;
  if(!ADMIN){
    h=`<button class="x pclose" data-a="close" title="Закрити">✕</button><h3 class="ptitle">${t.name}${m.count>1?' <span class="pcount">×'+m.count+'</span>':''}</h3>
      <div class="psil">${silSvg(m.type)}</div>${t.desc?`<div class="pdesc">${t.desc}</div>`:''}
      ${t.speedTxt&&t.speedTxt!=='—'?`<div class="pspeed">Орієнтовна швидкість: <b>${t.speedTxt}</b></div>`:''}
      <div class="meta">${metaHtml(m)}</div>
      <div class="f"><span>Достовірність</span>${relHtml(m.reliability)} ${REL[m.reliability]}</div>
      ${showDir(m)?`<div class="f"><span>Курс</span>${dirName(m.heading)}</div>`:''}
      ${m.note?`<div class="f"><span>Примітка</span>${esc(m.note)}</div>`:''}
      <div class="live">${liveHtml(m)}</div>
      <div class="btns" style="margin-top:10px"><button class="btn ${followId===m.id?'primary':''}" data-a="follow">⌖ ${followId===m.id?'Стежу':'Стежити'}</button><button class="btn" data-a="home">📍 Моя точка</button></div>`;
  }else{
    h+=`<div class="f"><span>Кількість</span><button class="btn" data-a="dec">−</button><b style="min-width:24px;text-align:center">${m.count}</b><button class="btn" data-a="inc">+</button></div>
    <div class="f"><span>Достовірність</span><select data-a="rel">${[1,2,3].map(r=>`<option value="${r}" ${m.reliability===r?'selected':''}>${REL[r]}</option>`).join('')}</select></div>
    <div class="meta">${metaHtml(m)}</div>
    <div class="f"><span>Тип</span><select data-a="type" style="flex:1;min-width:0">${Object.keys(TYPES).map(x=>`<option value="${x}" ${m.type===x?'selected':''}>${TYPES[x].name}</option>`).join('')}</select></div>
    ${t.dir?`<div class="f"><span>Курс</span><input type="range" min="0" max="359" value="${m.heading==null?0:Math.round(m.heading)}" data-a="hd" ${m.heading==null?'style="opacity:.4"':''}><b style="width:66px">${m.heading==null?'—':dirName(m.heading)}</b></div>
    <label class="inline"><input type="checkbox" data-a="nodir" ${m.heading==null?'checked':''}> без курсу</label>`:''}
    <div class="f"><span>Примітка</span><input type="text" data-a="note" value="${esc(m.note)}" placeholder="видно всім" style="flex:1;min-width:0"></div>
    <div class="btns" style="margin-top:10px"><button class="btn" data-a="touch" title="Оновити час — ціль ще актуальна">Актуально</button><button class="btn" data-a="dup">Дублювати</button><button class="btn" data-a="clrtrail">Стерти слід</button><button class="btn danger" data-a="del">Видалити</button><button class="btn" data-a="close">✕</button></div>`;
  }
  box.innerHTML=h;
  box.querySelectorAll('[data-a]').forEach(el=>{
    const a=el.dataset.a;
    if(a==='hd'){el.onpointerdown=()=>rebase(m);el.oninput=()=>{m.heading=+el.value;el.nextElementSibling.textContent=dirName(m.heading);el.style.opacity=1;const cb=box.querySelector('[data-a=nodir]');if(cb)cb.checked=false;renderMarkers();};el.onchange=()=>{m.updated_at=now();saveThreat(m);renderLists();};return;}
    if(a==='note'){el.oninput=()=>{m.note=el.value;saveThreat(m,800);};el.onchange=()=>renderLists();return;}
    if(a==='nodir'){el.onchange=()=>{m.heading=el.checked?null:0;saveThreat(m,0);renderAll(true);};return;}
    if(a==='rel'){el.onchange=()=>{m.reliability=+el.value;saveThreat(m,0);renderAll(true);};return;}
    if(a==='type'){el.onchange=()=>{rebase(m);m.type=el.value;if(!TYPES[m.type].dir)m.heading=null;saveThreat(m,0);renderAll(true);};return;}
    el.onclick=()=>{
      if(a==='close'){selected=null;followId=null;box.dataset.id='';renderMarkers();renderPopup(true);return;}
      if(a==='follow'){followId=followId===m.id?null:m.id;if(followId)centerOn(m,true);renderPopup(true);return;}
      if(a==='home'){openHomeSection();return;}
      if(a==='del'){delThreat(m);return;}
      if(a==='inc'){m.count++;saveThreat(m);}
      if(a==='dec'){m.count=Math.max(1,m.count-1);saveThreat(m);}
      if(a==='touch'){rebase(m);saveThreat(m,0);}
      if(a==='clrtrail'){m.trail=[];saveThreat(m,0);}
      if(a==='dup'){const n=Object.assign({},m,{id:uid(),lat:m.lat-0.08,lon:m.lon+0.08,trail:[],created_at:now(),updated_at:now()});D.threats.push(n);selected=n.id;saveThreat(n,0);}
      renderAll(true);};
  });
}
function metaHtml(m){const p=posOf(m);return `${esc(whereIs(p[0],p[1]))}<br>оновлено ${fmtTime(m.updated_at)} · ${fmtAgo(m.updated_at)}${moving(m)?' · <span title="Положення розраховане за курсом і швидкістю">прогноз руху</span>':''}`;}
function silSvg(type){const t=TYPES[type];const f=t.fill==='none'?'none':(t.fill||t.color);
  return `<svg width="64" height="64" viewBox="-16 -16 32 32"><path d="${P[t.glyph]}" fill="${f}" stroke="${t.fill==='none'?t.color:'none'}" stroke-width="1.4" fill-rule="evenodd" transform="rotate(90)"/></svg>`;}
function etaInfo(m){if(!prefs.home)return null;const p=posOf(m);const h=[prefs.home.lon,prefs.home.lat];const dist=distKm(p[0],p[1],h[0],h[1]);
  const t=TYPES[m.type];let eta=null,toward=null;
  if(m.heading!=null&&t.speed){const diff=Math.abs(((bearing(p,h)-m.heading)+540)%360-180);toward=diff<35;if(toward)eta=dist/t.speed*60;}
  return {dist,eta,toward};}
function liveHtml(m){const e=etaInfo(m);if(!e)return '<div class="pnote">Для відстані й часу підльоту обери свою точку.</div>';
  return `<div class="peta ${e.dist<=(prefs.zoneKm||25)?'near':''}">До ${esc(prefs.home.name||'моєї точки')}: <b>${e.dist<10?e.dist.toFixed(1):Math.round(e.dist)} км</b>${e.toward?(e.eta!=null?` · підліт ~<b>${e.eta<1?'<1':Math.round(e.eta)} хв</b>`:''):(m.heading!=null?' · курс не на тебе':'')}</div>`;}
function centerOn(m,zoomIn){const p0=posOf(m);const p=pr(p0[0],p0[1]);const kk=zoomIn?Math.max(k,4):k;const t=d3.zoomIdentity.translate(W/2-p[0]*kk,H/2-p[1]*kk).scale(kk);
  if(zoomIn)svg.transition().duration(500).call(zoom.transform,t);else svg.call(zoom.transform,t);}

/* ---------- Списки, легенда, шапка ---------- */
function renderLegend(){
  const el=$('legend');if(!el)return;
  const sums={};D.threats.forEach(m=>sums[m.type]=(sums[m.type]||0)+m.count);
  if(prefs.legendClosed==null)prefs.legendClosed=innerWidth<=820||ADMIN;
  el.classList.toggle('closed',!!prefs.legendClosed);
  el.innerHTML=`<h4><span>Легенда</span><span>${prefs.legendClosed?'▴':'▾'}</span></h4><div class="items">
    <div class="li"><span class="sw" style="background:#9b2328"></span>Повітряна тривога</div>
    <div class="li"><span class="sw" style="background:#86701a"></span>Загроза</div>
    ${Object.keys(TYPES).map(t=>`<div class="li ${sums[t]?'':'zero'}">${glyphSvg(t)}${TYPES[t].name}${sums[t]?`<b>${sums[t]}</b>`:''}</div>`).join('')}
    <div class="li" style="color:var(--muted);font-size:11.5px">Пунктирне коло — низька достовірність</div></div>`;
  el.querySelector('h4').onclick=()=>{prefs.legendClosed=!prefs.legendClosed;savePrefs();renderLegend();};
}
function renderLists(){
  const t0=now();const sts=Object.fromEntries(ORDER.map(id=>[id,oblStatus(id)]));
  const nR=ORDER.filter(id=>sts[id].r).length,nY=ORDER.filter(id=>sts[id].n&&!sts[id].r).length;
  // шапка
  const total=D.threats.reduce((a,m)=>a+m.count,0);
  const sh=D.threats.filter(m=>DRONES.includes(m.type)).reduce((a,m)=>a+m.count,0);
  $('topchips').innerHTML=`<span class="chip"><span class="dot" style="background:var(--red)"></span>Тривога: <b>${nR}</b><span class="hide-m">обл.</span></span>`+
    (nY?`<span class="chip"><span class="dot" style="background:var(--yellow)"></span>Загроза: <b>${nY}</b></span>`:'')+
    (sh?`<span class="chip hide-m"><span class="dot" style="background:${TYPES.shahed.color}"></span>Шахеди: <b>${sh}</b></span>`:'')+
    `<span class="chip hide-m">Цілей: <b>${total}</b></span>`;
  // банер «мій регіон»
  const b=$('banner');
  if(b){const reg=prefs.region;if(reg&&sts[reg]&&sts[reg].n){const st=sts[reg];b.style.display='block';b.style.background=st.r?'':'#4a3d0a';b.style.animation=st.r?'':'none';
    b.textContent=(st.r?'🔴 Повітряна тривога: ':'🟡 Загроза: ')+(reg===KYIV.id?'м. Київ':NAMES[reg]+' обл.')+(st.full?'':` (${st.n} з ${st.total} р-нів)`)+' · '+fmtDur(t0-st.t);}else b.style.display='none';}
  // тривоги
  const ol=$('oblastList');
  if(ADMIN){
    ol.innerHTML=ORDER.map(id=>{const st=sts[id];const cls=st.full===2?'on':st.full===1?'warn':st.n?(st.r?'part':'partw'):'';
      const extra=st.n?`<span class="t">${st.full?fmtDur(t0-st.t):st.n+'/'+st.total+' р-н'}</span>`:'';
      return `<span class="ob ${cls}" data-id="${id}" title="Клік: райони цієї області">${NAMES[id]}${extra}</span>`;}).join('');
    ol.querySelectorAll('.ob').forEach(el=>{el.classList.toggle('open',el.dataset.id===openOblast);el.onclick=()=>{openOblast=openOblast===el.dataset.id?null:el.dataset.id;renderLists();if(openOblast)zoomToOblast(openOblast);};});
    renderObPanel(sts);
  }else{
    const act=ORDER.filter(id=>sts[id].n).sort((a,b)=>sts[b].r-sts[a].r||sts[a].t-sts[b].t);
    ol.innerHTML=act.length?act.map(id=>{const st=sts[id];return `<div class="arow"><span class="dot" style="background:${st.r?'var(--red)':'var(--yellow)'}"></span><span class="name">${id===KYIV.id?'м. Київ':NAMES[id]+' обл.'}${st.full?'':`<br><small>${ridsOf(id).filter(r=>lvl(r)).map(r=>(lvl(r)===2?'🔴 ':'🟡 ')+(RN[r]?RN[r].name+' р-н':'')).join(', ')}</small>`}</span><small>${fmtDur(t0-st.t)}</small></div>`;}).join('')
      :'<div class="empty">🟢 Зараз тривог немає</div>';
  }
  $('alertCnt').textContent=ORDER.filter(id=>sts[id].n).length;
  const rlist=$('raionList');
  if(rlist){const part=Object.keys(RN).filter(r=>lvl(r)&&!sts[RN[r].oid].full).sort((a,b)=>D.alerts[a].t-D.alerts[b].t);
    rlist.innerHTML=part.length?'<div class="rhead">Окремі райони</div>'+part.map(r=>`<div class="rrow"><span class="dot" style="background:${lvl(r)===2?'var(--red)':'var(--yellow)'}"></span><span class="name">${RN[r].name} р-н <small>· ${NAMES[RN[r].oid]}</small></span><small>${fmtDur(t0-D.alerts[r].t)}</small><button class="x" data-r="${r}" title="Відбій">✕</button></div>`).join(''):'';
    rlist.querySelectorAll('[data-r]').forEach(el=>el.onclick=()=>applyAlert([el.dataset.r],RN[el.dataset.r].oid,0));}
  // цілі
  $('objCnt').textContent=total;
  const ms=[...D.threats].filter(m=>TYPES[m.type]).sort((a,b)=>ts(b.updated_at)-ts(a.updated_at));
  $('objList').innerHTML=ms.length?ms.map(m=>`<div class="row" data-id="${m.id}">${glyphSvg(m.type,18)}<div class="name">${TYPES[m.type].name}${m.count>1?' ×'+m.count:''}${showDir(m)?' → '+dirName(m.heading):''}<br><small>${esc(whereIs(...posOf(m)))}${m.note?' · '+esc(m.note):''}</small></div><small>${fmtTime(m.updated_at)}</small></div>`).join('')
    :`<div class="empty">${ADMIN?'Обери тип на панелі зверху і клікни по карті.':'Наразі цілей не зафіксовано'}</div>`;
  $('objList').querySelectorAll('.row').forEach(el=>el.onclick=()=>{const m=D.threats.find(x=>x.id===el.dataset.id);if(!m)return;if(ADMIN)setMode('select');select(m.id);
    const p=pr(...posOf(m));const kk=Math.max(k,4);svg.transition().duration(500).call(zoom.transform,d3.zoomIdentity.translate(W/2-p[0]*kk,H/2-p[1]*kk).scale(kk));
    if(innerWidth<=820&&!ADMIN){$('side').classList.add('collapsed');}});
  // стрічка
  $('feed').innerHTML=D.posts.length?D.posts.map(p=>{const kd=KINDS[p.kind]||KINDS.info;return `<div class="post" style="border-left-color:${kd.color}"><div class="pm"><span class="dot" style="background:${kd.color}"></span>${fmtTime(p.created_at)} · ${kd.name}${ADMIN?`<button class="x" data-p="${p.id}" title="Видалити">✕</button>`:''}</div>${esc(p.text)}</div>`;}).join('')
    :'<div class="empty">Повідомлень поки немає</div>';
  if(ADMIN)$('feed').querySelectorAll('[data-p]').forEach(el=>el.onclick=()=>{D.posts=D.posts.filter(p=>p.id!==el.dataset.p);renderLists();backend.deletePosts([el.dataset.p]).catch(fail);});
  $('updated').textContent=fmtTime(t0);
  const at=$('autoAttr');if(at)at.style.display=Object.values(D.alerts).some(a=>a.src==='auto')?'block':'none';
}
let openOblast=null;
function renderObPanel(sts){
  const box=$('obPanel');if(!box)return;const oid=openOblast;
  if(!oid){box.style.display='none';box.innerHTML='';return;}
  const t0=now();const st=sts[oid];const title=oid===KYIV.id?'м. Київ':NAMES[oid]+' обл.';
  const btns=(attr,val)=>`<button class="lv r" ${attr}="${val}" data-v="2" title="Тривога">🔴</button><button class="lv y" ${attr}="${val}" data-v="1" title="Загроза">🟡</button><button class="lv g" ${attr}="${val}" data-v="0" title="Відбій">✕</button>`;
  let h=`<div class="obh"><b>${title}</b><span class="obst">${st.n?(st.full===2?'🔴 тривога':st.full===1?'🟡 загроза':st.n+' з '+st.total+' р-нів')+' · '+fmtDur(t0-st.t):'тривоги немає'}</span><button class="x" data-close="1" title="Закрити">✕</button></div>`;
  h+=`<div class="obrow all"><span class="name">${oid===KYIV.id?'Усе місто':'Вся область'}</span>${btns('data-all',oid)}</div>`;
  if(oid!==KYIV.id)h+=RBY[oid].map(r=>{const l=lvl(r);return `<div class="obrow"><span class="dot" style="background:${l===2?'var(--red)':l===1?'var(--yellow)':'#3a404a'}"></span><span class="name">${RN[r].name}${l?` <small>${fmtDur(t0-D.alerts[r].t)}</small>`:''}${D.alerts[r]&&D.alerts[r].src==='auto'?' <span class="autotag" title="Автоматично з alerts.in.ua">авто</span>':''}</span>${btns('data-r',r)}</div>`;}).join('');
  box.innerHTML=h;box.style.display='block';
  box.querySelector('[data-close]').onclick=()=>{openOblast=null;renderLists();};
  box.querySelectorAll('[data-all]').forEach(b=>b.onclick=()=>{const v=+b.dataset.v;const rids=ridsOf(oid);
    if(v===0)applyAlert(rids,oid,0);else if(!rids.every(r=>lvl(r)===v))applyAlert(rids,oid,v);});
  box.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const v=+b.dataset.v,r=b.dataset.r;
    if(v===0)applyAlert([r],oid,0);else if(lvl(r)!==v)applyAlert([r],oid,v);});
  box.querySelectorAll('[data-r]').forEach(b=>{const l=lvl(b.dataset.r),v=+b.dataset.v;if(v&&l===v)b.classList.add('on');});
  box.querySelectorAll('[data-all]').forEach(b=>{const v=+b.dataset.v;if(v&&st.full===v)b.classList.add('on');});
  box.querySelectorAll('.obrow').forEach(row=>{const b=row.querySelector('[data-r]');if(!b)return;const r=b.dataset.r;
    row.onmouseenter=()=>{hoverRid=r;paintCells();};row.onmouseleave=()=>{hoverRid=null;paintCells();};});
}
function zoomToOblast(oid){
  let pts=[];
  if(oid===KYIV.id)pts=[[kp[0]-40,kp[1]-40],[kp[0]+40,kp[1]+40]];
  else if(GEO){GEO.raions.filter(f=>f.oid===oid).forEach(f=>{const b=gpath.bounds(f);pts.push(b[0],b[1]);});}
  else pts=seeds.filter(s=>s.oid===oid).map(s=>s.p);
  if(!pts.length)return;
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  if(!GEO){x0-=30;x1+=30;y0-=30;y1+=30;}
  const kk=Math.max(1,Math.min(6,0.8/Math.max((x1-x0)/W,(y1-y0)/H)));
  svg.transition().duration(500).call(zoom.transform,d3.zoomIdentity.translate(W/2-kk*(x0+x1)/2,H/2-kk*(y0+y1)/2).scale(kk));
}
function renderAll(forcePopup){paintCells();renderMarkers();renderLists();renderLegend();renderPopup(forcePopup);}

/* ---------- Публікації ---------- */
function postMsg(text,kind){text=String(text).trim().slice(0,1000);if(!text)return;const p={id:uid(),text,kind:kind||'info',created_at:new Date().toISOString()};
  D.posts.unshift(p);renderLists();backend.addPost(p).catch(fail);}

/* ---------- Завантаження й синхронізація ---------- */
let first=true,prevAlerts={},prevThreatIds=new Set(),prevPostIds=new Set();
async function refresh(){
  if(dragging)return;
  try{const d=await backend.load();D=d;}catch(e){console.error(e);setConn('bad');if(first)toast('Не вдалося завантажити дані з бази: '+(e.message||e));first=false;return;}
  if(selected&&!D.threats.find(x=>x.id===selected))selected=null;
  if(!ADMIN&&!first)notifyChanges();
  prevAlerts=Object.assign({},D.alerts);prevThreatIds=new Set(D.threats.map(t=>t.id));prevPostIds=new Set(D.posts.map(p=>p.id));first=false;
  renderAll(false);
}
function setConn(s){const c=$('conn');if(!c)return;c.className='chip '+(s==='ok'||s==='local'?'ok':s==='bad'?'bad':'');
  c.querySelector('.txt').textContent=s==='local'?'демо-режим':s==='ok'?'онлайн':s==='bad'?'немає зʼєднання':'підключення…';}

/* ---------- Звук (перегляд) ---------- */
/* ---------- Звуки (синтез у браузері, без записів) ---------- */
const SOUNDS={
  siren:{name:'Повітряна тривога (сирена)',grp:'alert',pri:9},
  allclear:{name:'Відбій тривоги',grp:'allclear',pri:2},
  shahed:{name:'Шахед / дрон',grp:'drone',pri:4},
  jetdrone:{name:'Реактивний дрон (Герань-3/4/5)',grp:'missile',pri:6},
  missile:{name:'Крилата ракета',grp:'missile',pri:7},
  ballistic:{name:'Балістика',grp:'ballistic',pri:10},
  aviation:{name:'Авіація / МіГ-31К',grp:'missile',pri:5},
  explosion:{name:'Вибух',grp:'explosion',pri:5},
  zone:{name:'Ціль у моїй зоні',grp:'zone',pri:8},
  post:{name:'Повідомлення «Загроза»',grp:'post',pri:3},
};
const SND_GROUPS={alert:'Тривога',allclear:'Відбій',drone:'Шахеди й дрони',missile:'Ракети й авіація',ballistic:'Балістика',explosion:'Вибухи',zone:'Ціль у зоні',post:'Повідомлення'};
const TYPE_SOUND={shahed:'shahed',shahed136:'shahed',gerbera:'shahed',fpv:'shahed',recon:'shahed',jet:'jetdrone',geran4:'jetdrone',geran5:'jetdrone',cruise:'missile',ballistic:'ballistic',aviation:'aviation',kab:'missile',explosion:'explosion'};
const A={ctx:null,out:null,busyUntil:0,busyPri:0};
function audio(){
  if(!A.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;A.ctx=new C();
    const comp=A.ctx.createDynamicsCompressor();comp.threshold.value=-12;comp.ratio.value=6;
    A.out=A.ctx.createGain();A.out.connect(comp);comp.connect(A.ctx.destination);}
  A.out.gain.value=prefs.vol==null?0.7:prefs.vol;
  if(A.ctx.state==='suspended')A.ctx.resume();return A.ctx;}
function noise(ctx,sec){const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*sec),ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=ctx.createBufferSource();s.buffer=b;return s;}
function shaper(ctx,amt){const w=ctx.createWaveShaper();const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i*2/n-1;c[i]=(1+amt)*x/(1+amt*Math.abs(x));}w.curve=c;return w;}
function env(ctx,g,t,a,hold,rel,peak){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,t+a+hold);g.gain.exponentialRampToValueAtTime(0.0001,t+a+hold+rel);}
const SYNTH={
  siren(ctx,o,t){ // механічна сирена: наростання, тримання, спад — двічі
    const dur=9;const g=ctx.createGain();const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;const ws=shaper(ctx,4);
    [1,1.5,2.01].forEach((m,i)=>{const os=ctx.createOscillator();os.type=i===0?'sawtooth':'square';
      const f=os.frequency;f.setValueAtTime(140*m,t);
      for(let c=0;c<2;c++){const b=t+c*4.5;f.linearRampToValueAtTime(140*m,b);f.exponentialRampToValueAtTime(620*m,b+2.2);f.setValueAtTime(620*m,b+2.6);f.exponentialRampToValueAtTime(180*m,b+4.4);}
      const og=ctx.createGain();og.gain.value=i===0?0.5:0.18;os.connect(og);og.connect(ws);os.start(t);os.stop(t+dur);});
    const trem=ctx.createOscillator(),tg=ctx.createGain();trem.frequency.value=7;tg.gain.value=0.12;trem.connect(tg);tg.connect(g.gain);trem.start(t);trem.stop(t+dur);
    ws.connect(lp);lp.connect(g);g.connect(o);env(ctx,g,t,0.4,dur-1.4,1,0.55);return dur;},
  shahed(ctx,o,t){ // двотактний «мопед», що пролітає повз (доплер)
    const dur=5;const g=ctx.createGain();const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=900;bp.Q.value=0.8;
    const am=ctx.createGain();am.gain.value=0.6;const lfo=ctx.createOscillator();lfo.type='square';lfo.frequency.setValueAtTime(34,t);lfo.frequency.linearRampToValueAtTime(29,t+dur);
    const lg=ctx.createGain();lg.gain.value=0.4;lfo.connect(lg);lg.connect(am.gain);
    [[110,'sawtooth',0.5],[220,'sawtooth',0.25],[55,'square',0.2]].forEach(([fr,ty,v])=>{const os=ctx.createOscillator();os.type=ty;
      os.frequency.setValueAtTime(fr*1.08,t);os.frequency.setValueAtTime(fr*1.08,t+dur*0.45);os.frequency.exponentialRampToValueAtTime(fr*0.86,t+dur*0.62);
      const og=ctx.createGain();og.gain.value=v;os.connect(og);og.connect(am);os.start(t);os.stop(t+dur);});
    const ns=noise(ctx,dur),nf=ctx.createBiquadFilter();nf.type='highpass';nf.frequency.value=1500;const ng=ctx.createGain();ng.gain.value=0.08;ns.connect(nf);nf.connect(ng);ng.connect(am);ns.start(t);
    lfo.start(t);lfo.stop(t+dur);am.connect(shaper(ctx,3)).connect(bp);bp.connect(g);g.connect(o);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(2.2,t+dur*0.48);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);return dur;},
  jetdrone(ctx,o,t){ // реактивний свист + рев
    const dur=4;const g=ctx.createGain();const ns=noise(ctx,dur);const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=3;
    bp.frequency.setValueAtTime(1200,t);bp.frequency.exponentialRampToValueAtTime(4200,t+dur*0.5);bp.frequency.exponentialRampToValueAtTime(900,t+dur);
    ns.connect(bp);bp.connect(g);ns.start(t);
    const os=ctx.createOscillator();os.type='sine';os.frequency.setValueAtTime(2400,t);os.frequency.linearRampToValueAtTime(3200,t+dur*0.5);os.frequency.exponentialRampToValueAtTime(1500,t+dur);
    const og=ctx.createGain();og.gain.value=0.15;os.connect(og);og.connect(g);os.start(t);os.stop(t+dur);
    g.connect(o);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(1.8,t+dur*0.5);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);return dur;},
  missile(ctx,o,t){ // наростаючий свист і низький гул
    const dur=4.5;const g=ctx.createGain();const ns=noise(ctx,dur);const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=6;
    bp.frequency.setValueAtTime(400,t);bp.frequency.exponentialRampToValueAtTime(3500,t+dur*0.7);bp.frequency.exponentialRampToValueAtTime(700,t+dur);
    ns.connect(bp);bp.connect(g);ns.start(t);
    const rb=ctx.createOscillator();rb.type='sawtooth';rb.frequency.setValueAtTime(45,t);rb.frequency.linearRampToValueAtTime(70,t+dur);
    const rl=ctx.createBiquadFilter();rl.type='lowpass';rl.frequency.value=160;const rg=ctx.createGain();rg.gain.value=0.6;rb.connect(rl);rl.connect(rg);rg.connect(g);rb.start(t);rb.stop(t+dur);
    g.connect(o);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(1,t+dur*0.75);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);return dur;},
  ballistic(ctx,o,t){ // швидкий тривожний сигнал + виття
    const dur=5;const g=ctx.createGain();g.connect(o);g.gain.value=0.5;
    for(let i=0;i<20;i++){const os=ctx.createOscillator();os.type='square';os.frequency.value=i%2?1250:900;const og=ctx.createGain();os.connect(og);og.connect(g);
      const b=t+i*0.13;env(ctx,og,b,0.005,0.08,0.03,0.6);os.start(b);os.stop(b+0.13);}
    const w=ctx.createOscillator();w.type='sawtooth';w.frequency.setValueAtTime(300,t+2.6);w.frequency.exponentialRampToValueAtTime(1100,t+4.2);w.frequency.exponentialRampToValueAtTime(400,t+dur);
    const wg=ctx.createGain();w.connect(shaper(ctx,5)).connect(wg);wg.connect(g);env(ctx,wg,t+2.6,0.1,1.5,0.7,0.6);w.start(t+2.6);w.stop(t+dur);return dur;},
  aviation(ctx,o,t){ // низький рев літака
    const dur=5;const g=ctx.createGain();const ns=noise(ctx,dur);const lp=ctx.createBiquadFilter();lp.type='lowpass';
    lp.frequency.setValueAtTime(250,t);lp.frequency.exponentialRampToValueAtTime(1400,t+dur*0.5);lp.frequency.exponentialRampToValueAtTime(300,t+dur);
    ns.connect(lp);lp.connect(g);ns.start(t);
    const hum=ctx.createOscillator();hum.type='triangle';hum.frequency.setValueAtTime(70,t);hum.frequency.linearRampToValueAtTime(95,t+dur*0.5);hum.frequency.linearRampToValueAtTime(60,t+dur);
    const hg=ctx.createGain();hg.gain.value=0.5;hum.connect(hg);hg.connect(g);hum.start(t);hum.stop(t+dur);
    g.connect(o);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(1,t+dur*0.5);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);return dur;},
  explosion(ctx,o,t){ // удар + розкат
    const dur=3;const g=ctx.createGain();const ns=noise(ctx,dur);const lp=ctx.createBiquadFilter();lp.type='lowpass';
    lp.frequency.setValueAtTime(3000,t);lp.frequency.exponentialRampToValueAtTime(90,t+dur);ns.connect(lp);lp.connect(g);ns.start(t);
    const th=ctx.createOscillator();th.type='sine';th.frequency.setValueAtTime(110,t);th.frequency.exponentialRampToValueAtTime(28,t+0.8);
    const tg=ctx.createGain();th.connect(tg);tg.connect(o);env(ctx,tg,t,0.005,0.05,0.9,0.9);th.start(t);th.stop(t+1.2);
    g.connect(shaper(ctx,6)).connect(o);g.gain.setValueAtTime(0.7,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);return dur;},
  zone(ctx,o,t){ // три різкі сигнали, потім дрон
    const g=ctx.createGain();g.connect(o);
    for(let i=0;i<3;i++){const os=ctx.createOscillator();os.type='square';os.frequency.setValueAtTime(980,t+i*0.35);os.frequency.linearRampToValueAtTime(700,t+i*0.35+0.25);
      const og=ctx.createGain();os.connect(og);og.connect(g);env(ctx,og,t+i*0.35,0.01,0.18,0.08,0.5);os.start(t+i*0.35);os.stop(t+i*0.35+0.3);}
    return 1.1+SYNTH.shahed(ctx,o,t+1.1);},
  allclear(ctx,o,t){ // спокійний висхідний акорд
    const g=ctx.createGain();g.connect(o);[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const os=ctx.createOscillator();os.type='sine';os.frequency.value=f;
      const og=ctx.createGain();os.connect(og);og.connect(g);env(ctx,og,t+i*0.22,0.02,0.25,1.2,0.35);os.start(t+i*0.22);os.stop(t+i*0.22+1.6);});return 2.4;},
  post(ctx,o,t){const g=ctx.createGain();g.connect(o);[880,1320].forEach((f,i)=>{const os=ctx.createOscillator();os.type='triangle';os.frequency.value=f;const og=ctx.createGain();os.connect(og);og.connect(g);
      env(ctx,og,t+i*0.18,0.01,0.1,0.4,0.5);os.start(t+i*0.18);os.stop(t+i*0.18+0.6);});return 0.9;},
};
function sndOn(name){const gr=SOUNDS[name].grp;const s=prefs.snd||{};return s[gr]!==false;}
function playSound(name,force){
  if(!force&&(!prefs.sound||!sndOn(name)))return;
  const ctx=audio();if(!ctx||!SYNTH[name])return;
  const pri=SOUNDS[name].pri;const nowT=ctx.currentTime;
  if(!force&&nowT<A.busyUntil&&pri<=A.busyPri)return; // не перебивати важливіший звук
  try{const dur=SYNTH[name](ctx,A.out,nowT+0.05);A.busyUntil=nowT+dur;A.busyPri=pri;return dur;}catch(e){console.warn(e);}
  return 0;
}
/* ---------- Голосові оголошення (синтез мовлення браузера) ---------- */
const HAS_TTS='speechSynthesis' in window;
function allVoices(){return HAS_TTS?speechSynthesis.getVoices():[];}
function ukVoices(){return allVoices().filter(v=>/^uk/i.test(v.lang));}
function pickVoice(){const vs=allVoices();return vs.find(v=>v.voiceURI===prefs.voiceURI&&/^uk/i.test(v.lang))||ukVoices().sort((a,b)=>(/natural|online|google/i.test(b.name)?1:0)-(/natural|online|google/i.test(a.name)?1:0))[0];}
let lastSpeak=0;
function say(text,delayMs,force){
  if(!HAS_TTS||!text)return;
  if(!force&&(!prefs.sound||prefs.voice===false))return;
  const v=pickVoice();if(!v)return;
  setTimeout(()=>{
    if(!force&&speechSynthesis.pending&&Date.now()-lastSpeak>60000)speechSynthesis.cancel(); // не накопичувати старі оголошення
    const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=prefs.vrate||1;u.pitch=0.9;u.volume=1;
    speechSynthesis.speak(u);lastSpeak=Date.now();},delayMs||0);
}
const DIR_WORDS=['північ','північний схід','схід','південний схід','південь','південний захід','захід','північний захід'];
function dirWords(h){return DIR_WORDS[Math.round(h/45)%8];}
function placeName(oid){return oid===KYIV.id?'місто Київ':oid==='krm'?'Автономна Республіка Крим':NAMES[oid]+' область';}
function plural3(n,a,b,c){const m10=n%10,m100=n%100;return m10===1&&m100!==11?a:m10>=2&&m10<=4&&(m100<10||m100>=20)?b:c;}
const SPOKEN={shahed:'Шахед',shahed136:'Шахед',gerbera:'дрон-імітатор Гербера',fpv:'ударний дрон',recon:'розвідувальний дрон',jet:'реактивний Шахед',geran4:'реактивна Герань-4',geran5:'реактивна Герань-5',
  cruise:'крилата ракета',ballistic:'балістика',kab:'керовані авіабомби',aviation:'активність авіації',explosion:'вибух'};
// звук + голос: спершу сигнал, потім оголошення
function announce(sound,text){
  if(!prefs.sound)return;
  const groupOn=sndOn(sound);
  const dur=groupOn?playSound(sound):0;
  if(groupOn||prefs.voiceAlways)say(text,Math.round((dur||0)*1000)+300);
}
function beep(){playSound('post');}
function inMyRegion(oid){return !prefs.region||prefs.region===oid;}
function notifyChanges(){
  const ev=[];
  // нові тривоги (по областях)
  const newRed=new Set();
  Object.keys(D.alerts).forEach(r=>{if(D.alerts[r].l===2&&(!prevAlerts[r]||prevAlerts[r].l!==2)){const oid=r===KYIV.id?r:RN[r]&&RN[r].oid;if(oid&&inMyRegion(oid))newRed.add(oid);}});
  if(newRed.size){const list=[...newRed];
    ev.push({snd:'siren',text:'Увага! Повітряна тривога. '+(list.length<=3?list.map(placeName).join('. ')+'.':list.length+' '+plural3(list.length,'область','області','областей')+'.')+' Негайно пройдіть до укриття.'});}
  // відбій
  if(prefs.region){const was=ridsOf(prefs.region).some(r=>prevAlerts[r]&&prevAlerts[r].l===2),is=ridsOf(prefs.region).some(r=>D.alerts[r]&&D.alerts[r].l===2);
    if(was&&!is)ev.push({snd:'allclear',text:'Відбій повітряної тривоги. '+placeName(prefs.region)+'.'});}
  else if(Object.keys(prevAlerts).length&&!Object.keys(D.alerts).length)ev.push({snd:'allclear',text:'Відбій повітряної тривоги по всій країні.'});
  // нові цілі
  const byType={};
  D.threats.forEach(t=>{if(prevThreatIds.has(t.id))return;const snd=TYPE_SOUND[t.type];if(!snd)return;
    const p=posOf(t);const oid=whereObj(p[0],p[1]).oid;const everywhere=t.type==='ballistic'||t.type==='aviation';
    if(!(everywhere||!prefs.region||oid===prefs.region))return;
    (byType[t.type]=byType[t.type]||[]).push({t,oid});});
  Object.keys(byType).forEach(type=>{const arr=byType[type];const n=arr.reduce((a,x)=>a+(x.t.count||1),0);const f=arr[0];
    let text;
    if(type==='ballistic')text='Загроза балістики! Негайно в укриття!';
    else if(type==='aviation')text='Увага! Активність авіації. Можливі пуски ракет.';
    else if(type==='explosion')text='Повідомляють про вибух. '+placeName(f.oid)+'.';
    else{text='Увага! '+SPOKEN[type]+(n>1?', '+n+' '+plural3(n,'ціль','цілі','цілей'):'')+'. '+placeName(f.oid)+'.';
      if(f.t.heading!=null&&f.t.reliability>=2)text+=' Курс на '+dirWords(f.t.heading)+'.';}
    ev.push({snd:TYPE_SOUND[type],text});});
  // повідомлення адміна з рівнем «Загроза» — зачитуємо
  D.posts.forEach(p=>{if(!prevPostIds.has(p.id)&&p.kind==='danger')ev.push({snd:'post',text:'Увага! '+String(p.text).slice(0,220)});});
  if(!ev.length)return;
  ev.sort((a,b)=>SOUNDS[b.snd].pri-SOUNDS[a.snd].pri);
  announce(ev[0].snd,ev.slice(0,2).map(e=>e.text).join(' '));
}

/* ---------- Моя точка, зона, рух ---------- */
function renderHome(){
  const h=prefs.home;gHome.selectAll('*').remove();if(!h)return;
  const r=prefs.zoneKm||25;const circ=d3.geoCircle().center([h.lon,h.lat]).radius(r/111.2)();
  gHome.append('path').attr('class','zone').attr('d',gpath(circ)).attr('stroke-width',1.5/k).attr('stroke-dasharray',`${6/k} ${4/k}`);
  const p=pr(h.lon,h.lat);
  gHome.append('circle').attr('class','homedot').attr('cx',p[0]).attr('cy',p[1]).attr('r',5/k).attr('stroke-width',2/k);
  gHome.append('text').attr('class','homelbl').attr('x',p[0]+8/k).attr('y',p[1]+4/k).attr('font-size',11/k).style('stroke-width',(3/k)+'px').text(h.name||'Моя точка');
}
const inZone=new Set();let zoneInit=false;
function checkZone(){
  const zb=$('zoneBanner');if(!zb)return;
  if(!prefs.home){zb.style.display='none';inZone.clear();return;}
  const r=prefs.zoneKm||25;const list=[];let entered=false;
  D.threats.forEach(m=>{const t=TYPES[m.type];if(!t||m.type==='explosion'||m.type==='pvo')return;const e=etaInfo(m);if(!e)return;
    if(e.dist<=r){list.push({m,e});if(!inZone.has(m.id)){inZone.add(m.id);if(zoneInit)entered=true;}}else inZone.delete(m.id);});
  zoneInit=true;
  if(!list.length){zb.style.display='none';return;}
  list.sort((a,b)=>a.e.dist-b.e.dist);
  zb.style.display='block';
  zb.innerHTML='⚠ У твоїй зоні: '+list.slice(0,3).map(x=>`<b>${TYPES[x.m.type].short}${x.m.count>1?' ×'+x.m.count:''}</b> ${Math.round(x.e.dist)} км${x.e.eta!=null?' (~'+Math.max(1,Math.round(x.e.eta))+' хв)':''}`).join(' · ')+(list.length>3?` і ще ${list.length-3}`:'');
  if(entered&&prefs.zoneAlert!==false){const x=list[0];const e=x.e;
    announce('zone','Увага! Ціль у вашій зоні. '+(SPOKEN[x.m.type]||TYPES[x.m.type].short)+', '+Math.round(e.dist)+' '+plural3(Math.round(e.dist),'кілометр','кілометри','кілометрів')+(e.eta!=null?', підліт приблизно '+Math.max(1,Math.round(e.eta))+' '+plural3(Math.max(1,Math.round(e.eta)),'хвилина','хвилини','хвилин'):'')+'. Пройдіть до укриття.');}
}
function setHome(lon,lat,name){prefs.home={lon,lat,name:name||'Моя точка'};savePrefs();inZone.clear();zoneInit=false;renderHomeUI();renderMarkers();checkZone();renderPopup(true);}
function openHomeSection(){const sd=$('side');if(sd)sd.classList.remove('collapsed');const h=$('homeSec');if(h)h.scrollIntoView({behavior:'smooth',block:'start'});}
function renderHomeUI(){const t=$('homeTxt');if(!t)return;
  t.textContent=prefs.home?`📍 ${prefs.home.name||'Моя точка'} · зона ${prefs.zoneKm||25} км`:'Точку не обрано';}
setInterval(()=>{
  if(dragging)return;
  if(D.threats.some(moving))renderMarkers();
  if(followId){const m=D.threats.find(x=>x.id===followId);if(m)centerOn(m,false);else followId=null;}
  if(selected){const m=D.threats.find(x=>x.id===selected);const box=$('popup');if(m&&box){const l=box.querySelector('.live');if(l)l.innerHTML=liveHtml(m);}}
  if(!ADMIN)checkZone();
},1000);

/* ---------- Інтерфейс перегляду ---------- */
function renderSoundUI(){
  const box=$('soundSet');if(!box)return;const st=prefs.snd||{};
  box.innerHTML=`${prefs.sound?'':'<div class="sndwarn">🔕 Звук вимкнено. Натисни 🔔 угорі, щоб увімкнути.</div>'}
   <label class="inline">Гучність <input type="range" id="sndVol" min="0" max="1" step="0.05" value="${prefs.vol==null?0.7:prefs.vol}" style="flex:1"></label>
   <div class="voicebox">
     <label class="inline"><input type="checkbox" id="vOn" ${prefs.voice!==false?'checked':''}> 🗣 Голосові оголошення</label>
     ${HAS_TTS&&ukVoices().length?`<label class="inline">Голос <select id="vSel" style="flex:1;min-width:0">${ukVoices().map(v=>`<option value="${esc(v.voiceURI)}" ${pickVoice()&&pickVoice().voiceURI===v.voiceURI?'selected':''}>${esc(v.name)}</option>`).join('')}</select></label>
     <label class="inline">Швидкість <input type="range" id="vRate" min="0.7" max="1.4" step="0.05" value="${prefs.vrate||1}" style="flex:1"></label>
     <button class="btn sm" id="vTest">▶ Прослухати голос</button>`
     :`<div class="sndwarn">У цьому браузері немає українського голосу. Найкраще працює в <b>Microsoft Edge</b> (голоси «Ostap» і «Polina») та в Chrome на <b>Android</b>. У Windows можна додати: Параметри → Час і мова → Мовлення → Додати голоси → Українська.</div>`}
   </div>
   <div class="sndlist">${Object.keys(SOUNDS).map(k=>`<div class="sndrow"><label><input type="checkbox" data-g="${SOUNDS[k].grp}" ${st[SOUNDS[k].grp]!==false?'checked':''}> ${SOUNDS[k].name}</label><button class="btn sm" data-play="${k}" title="Прослухати">▶</button></div>`).join('')}</div>`;
  box.querySelector('#sndVol').oninput=e=>{prefs.vol=+e.target.value;savePrefs();if(A.out)A.out.gain.value=prefs.vol;};
  box.querySelectorAll('[data-g]').forEach(cb=>cb.onchange=()=>{prefs.snd=Object.assign({},prefs.snd,{[cb.dataset.g]:cb.checked});savePrefs();renderSoundUI();});
  box.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>playSound(b.dataset.play,true));
  const vOn=box.querySelector('#vOn');if(vOn)vOn.onchange=()=>{prefs.voice=vOn.checked;savePrefs();};
  const vSel=box.querySelector('#vSel');if(vSel)vSel.onchange=()=>{prefs.voiceURI=vSel.value;savePrefs();};
  const vRate=box.querySelector('#vRate');if(vRate)vRate.oninput=()=>{prefs.vrate=+vRate.value;savePrefs();};
  const vT=box.querySelector('#vTest');if(vT)vT.onclick=()=>{const d=playSound('post',true);say('Увага! Шахед. Сумська область. Курс на південний захід. Пройдіть до укриття.',Math.round(d*1000)+200,true);};
}
if(HAS_TTS)speechSynthesis.onvoiceschanged=()=>{if($('soundSet'))renderSoundUI();};
function initViewer(){
  const sel=$('regionSel');
  sel.innerHTML='<option value="">Вся Україна</option>'+ORDER.map(id=>`<option value="${id}">${id===KYIV.id?'м. Київ':NAMES[id]}</option>`).join('');
  sel.value=prefs.region||'';sel.onchange=()=>{prefs.region=sel.value;savePrefs();renderLists();};
  const sb=$('soundBtn');const paint=()=>{sb.classList.toggle('on',!!prefs.sound);sb.textContent=prefs.sound?'🔔':'🔕';sb.title=prefs.sound?'Звук увімкнено':'Увімкнути звук';};
  paint();sb.onclick=()=>{prefs.sound=!prefs.sound;savePrefs();paint();if(prefs.sound)playSound('post',true);renderSoundUI();};
  renderSoundUI();
  // моя точка
  const hc=$('homeCity');hc.innerHTML='<option value="">Обрати місто…</option>'+cities.map((c,i)=>`<option value="${i}">${c.name}</option>`).join('');
  hc.onchange=()=>{const c=cities[+hc.value];if(c)setHome(c.lon,c.lat,c.name);hc.value='';};
  $('homeGps').onclick=()=>{if(!navigator.geolocation){toast('Геолокація недоступна в цьому браузері');return;}
    $('homeGps').disabled=true;navigator.geolocation.getCurrentPosition(p=>{$('homeGps').disabled=false;setHome(p.coords.longitude,p.coords.latitude,'Я тут');},
      err=>{$('homeGps').disabled=false;toast('Не вдалося визначити місце: '+(err.code===1?'доступ заборонено':'спробуй ще раз'));},{enableHighAccuracy:true,timeout:15000});};
  $('homePick').onclick=()=>{mode='pick';svg.style('cursor','crosshair');showHint('Клікни на карті, де ти знаходишся',8000);if(innerWidth<=820)$('side').classList.add('collapsed');};
  svg.on('click.pick',e=>{if(mode!=='pick')return;const p=d3.pointer(e,zg.node());const ll=inv(p[0],p[1]);mode='view';svg.style('cursor',null);showHint();
    const w=whereObj(ll[0],ll[1]);setHome(ll[0],ll[1],nearestCity(ll[0],ll[1]).replace(/^біля м\. /,'')||rLabel(w.rid).split(',')[0]);});
  $('homeClear').onclick=()=>{prefs.home=null;savePrefs();renderHomeUI();renderMarkers();checkZone();renderPopup(true);};
  const zr=$('zoneR');zr.value=String(prefs.zoneKm||25);zr.onchange=()=>{prefs.zoneKm=+zr.value;savePrefs();inZone.clear();zoneInit=false;renderHomeUI();renderMarkers();checkZone();};
  const za=$('zoneAlert');za.checked=prefs.zoneAlert!==false;za.onchange=()=>{prefs.zoneAlert=za.checked;savePrefs();};
  const ex=$('extrapOn');ex.checked=prefs.extrap!==false;ex.onchange=()=>{prefs.extrap=ex.checked;savePrefs();renderAll(true);};
  renderHomeUI();
}

/* ---------- Інтерфейс адміна ---------- */
let placeRel=2,placeSub='shahed';
function initAdmin(){
  const MODES=[['select','Вибір'],['alert','Тривога'],...Object.keys(TYPES).filter(x=>!DRONES.includes(x)||x==='shahed').map(x=>[x,TYPES[x].short])];
  const tb=d3.select('#toolbar');
  MODES.forEach(([m,label],i)=>{if(i===2)tb.append('div').attr('class','sep');
    tb.append('button').attr('class','tool').attr('data-m',m).attr('title',TYPES[m]?TYPES[m].name:label).html(glyphSvg(m)+`<span class="lbl">${label}</span>`).on('click',()=>setMode(m));});
  // розміщення
  let drawStart=null,lastP=null;
  svg.on('pointerdown.place',e=>{
    if(!(mode in TYPES)||e.button!==0)return;if(e.target.closest&&e.target.closest('.marker'))return;
    const p=d3.pointer(e,zg.node());const ll=inv(p[0],p[1]);if(!ll||!(ll[0]>21&&ll[0]<41.5&&ll[1]>43.5&&ll[1]<53))return;
    e.preventDefault();drawStart=p;lastP=p;try{svg.node().setPointerCapture(e.pointerId);}catch(_){}
    preview.attr('x1',p[0]).attr('y1',p[1]).attr('x2',p[0]).attr('y2',p[1]).attr('stroke-width',2/k).style('display',TYPES[mode].dir?null:'none');});
  svg.on('pointermove.place',e=>{if(!drawStart)return;const p=d3.pointer(e,zg.node());lastP=p;preview.attr('x2',p[0]).attr('y2',p[1]);});
  svg.on('pointerup.place pointercancel.place',e=>{
    if(!drawStart)return;const p=e.type==='pointercancel'?lastP:d3.pointer(e,zg.node());const s=drawStart;drawStart=null;preview.style('display','none');
    const dx=(p[0]-s[0])*k,dy=(p[1]-s[1])*k;let heading=null;
    if(TYPES[mode].dir&&Math.hypot(dx,dy)>14)heading=(Math.atan2(dx,-dy)*180/Math.PI+360)%360;
    const ll=inv(s[0],s[1]);
    const m={id:uid(),type:mode==='shahed'?placeSub:mode,lon:ll[0],lat:ll[1],heading,count:1,note:'',reliability:placeRel,trail:[],created_at:now(),updated_at:now()};
    D.threats.push(m);renderAll();saveThreat(m,0);
  });
  // панель параметрів (тривога / достовірність)
  const ob=$('optbar');
  ob.innerHTML=`<span class="grp" data-g="alert"><button class="ab" data-l="2"><span class="dot" style="background:var(--red)"></span>Тривога</button><button class="ab" data-l="1"><span class="dot" style="background:var(--yellow)"></span>Загроза</button><button class="ab" data-l="0"><span class="dot" style="background:var(--green)"></span>Відбій</button><span class="sep"></span><button class="ab" data-s="raion">Район</button><button class="ab" data-s="oblast">Вся область</button></span>
   <span class="grp" data-g="sub"><span class="lbl2">Модифікація:</span>${DRONES.map(x=>`<button class="ab" data-sub="${x}">${x==='shahed'?'не уточнено':TYPES[x].short}</button>`).join('')}<span class="sep"></span></span>
   <span class="grp" data-g="place"><span class="lbl2">Достовірність:</span><button class="ab" data-r="1">низька</button><button class="ab" data-r="2">середня</button><button class="ab" data-r="3">висока</button></span>`;
  ob.querySelectorAll('.grp').forEach(g=>g.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap');
  ob.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{alertLvl=+b.dataset.l;paintOpt();showHint();});
  ob.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{alertScope=b.dataset.s;paintOpt();showHint();});
  ob.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{placeRel=+b.dataset.r;paintOpt();});
  ob.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{placeSub=b.dataset.sub;paintOpt();showHint(`Клікни, щоб поставити «${TYPES[placeSub].name}». Потягни — щоб задати курс`);});
  // публікація
  let kind='info';const kb=$('kinds');
  kb.innerHTML=Object.keys(KINDS).map(x=>`<button data-k="${x}"><span class="dot" style="background:${KINDS[x].color}"></span>${KINDS[x].name}</button>`).join('');
  const paintK=()=>kb.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.k===kind));paintK();
  kb.querySelectorAll('button').forEach(b=>b.onclick=()=>{kind=b.dataset.k;paintK();});
  const ta=$('postText');
  const send=()=>{if(!ta.value.trim())return;postMsg(ta.value,kind);ta.value='';};
  $('postBtn').onclick=send;ta.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();send();}};
  // налаштування
  const ap=$('autoPost');ap.checked=!!prefs.autoPost;ap.onchange=()=>{prefs.autoPost=ap.checked;savePrefs();};
  const ex=$('expire');ex.value=String(prefs.expire||0);ex.onchange=()=>{prefs.expire=+ex.value;savePrefs();};
  $('clearAlerts').onclick=()=>confirmBox('Відбій по всій країні?',()=>{const ch={};Object.keys(D.alerts).forEach(r=>ch[r]=0);if(!Object.keys(ch).length)return;D.alerts={};renderAll();backend.setAlerts(ch).catch(fail);if(prefs.autoPost)postMsg('🟢 Відбій тривоги по всій країні','ok');});
  $('clearThreats').onclick=()=>confirmBox('Прибрати всі цілі з карти?',()=>{D.threats=[];selected=null;renderAll(true);backend.clearThreats().catch(fail);});
  $('clearFeed').onclick=()=>confirmBox('Видалити всі повідомлення зі стрічки?',()=>{const ids=D.posts.map(p=>p.id);if(!ids.length)return;D.posts=[];renderLists();backend.deletePosts(ids).catch(fail);});
  // клавіші
  const KEYS={'1':'shahed','2':'fpv','3':'recon','4':'cruise','5':'ballistic','6':'kab','7':'aviation','8':'unknown','9':'explosion','0':'pvo','a':'alert','ф':'alert','Escape':'select'};
  window.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;
    if(KEYS[e.key]){setMode(KEYS[e.key]);if(e.key==='Escape'){selected=null;renderAll(true);}}
    if((e.key==='Delete'||e.key==='Backspace')&&selected){const m=D.threats.find(x=>x.id===selected);if(m)delThreat(m);}});
  // автоочищення старих цілей
  setInterval(()=>{if(!prefs.expire)return;const old=D.threats.filter(m=>ageMin(m)>=prefs.expire).map(m=>m.id);if(!old.length)return;
    D.threats=D.threats.filter(m=>!old.includes(m.id));renderAll();backend.deleteThreats(old).catch(fail);},30000);
  // вихід
  $('logoutBtn').onclick=async()=>{await backend.signOut();location.reload();};
}
function paintOpt(){const ob=$('optbar');if(!ob)return;
  const show=mode==='alert'||mode in TYPES;ob.style.display=show?'flex':'none';ob.style.top=($('toolbar').offsetHeight+16)+'px';
  ob.querySelector('[data-g=alert]').style.display=mode==='alert'?'flex':'none';
  ob.querySelector('[data-g=place]').style.display=mode in TYPES?'flex':'none';
  ob.querySelectorAll('[data-l]').forEach(b=>b.classList.toggle('active',+b.dataset.l===alertLvl));
  ob.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('active',b.dataset.s===alertScope));
  ob.querySelectorAll('[data-r]').forEach(b=>b.classList.toggle('active',+b.dataset.r===placeRel));
  ob.querySelector('[data-g=sub]').style.display=mode==='shahed'?'flex':'none';
  ob.querySelectorAll('[data-sub]').forEach(b=>b.classList.toggle('active',b.dataset.sub===placeSub));}
function setMode(m){mode=m;d3.selectAll('.tool').classed('active',function(){return this.dataset.m===m;});
  svg.style('cursor',m==='select'?'grab':m==='alert'?'pointer':'crosshair');paintOpt();showHint();}
function confirmBox(title,ok){const o=$('confirm');$('cTitle').textContent=title;o.style.display='flex';
  $('cYes').onclick=()=>{o.style.display='none';ok();};$('cNo').onclick=()=>{o.style.display='none';};}

/* ---------- Спільне ---------- */
const st=$('sideToggle');if(st)st.onclick=()=>$('side').classList.toggle('collapsed');
if(innerWidth<=820&&!ADMIN&&$('side'))$('side').classList.add('collapsed');
if(backend.kind==='local'&&$('demo'))$('demo').style.display='block';
if(cfgError){const d=$('demo');if(d){d.style.display='block';d.textContent='⚠ '+cfgError+' Перевір config.js (див. інструкцію).';}console.error(cfgError);}
setInterval(()=>{if(!dragging){renderLists();renderPopup(false);}},15000);

async function start(){
  rescale();
  if(ADMIN){
    initAdmin();setMode('select');
    let s=null;try{s=await backend.session();}catch(e){}
    if(!s||!s.admin){s=await loginFlow(s);}
    $('who').textContent=backend.kind==='local'?'демо':s?s.email:'';
  }else initViewer();
  backend.subscribe(refresh,setConn);
  await refresh();
}
function loginFlow(s){return new Promise(res=>{
  const o=$('login');o.style.display='flex';
  if(s&&!s.admin)$('loginErr').textContent=`Акаунт ${s.email} не має прав адміна. Додай його в таблицю admins (див. інструкцію).`;
  $('loginForm').onsubmit=async e=>{e.preventDefault();$('loginErr').textContent='';$('loginBtn').disabled=true;
    try{const r=await backend.signIn($('email').value.trim(),$('password').value);
      if(!r.admin){$('loginErr').textContent='Вхід виконано, але цей акаунт не має прав адміна. Додай його в таблицю admins.';await backend.signOut();}
      else{o.style.display='none';$('who').textContent=r.email;res(r);}}
    catch(err){$('loginErr').textContent=/Invalid login/i.test(err.message||'')?'Невірний email або пароль':'Помилка: '+(err.message||err);}
    $('loginBtn').disabled=false;};
});}
start();
})();
