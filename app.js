const SBU='https://wqtenvjtuxvdoaechyjh.supabase.co',SBK='sb_publishable_3llEE8WVT0thYygn-HRu6g_Ks2ePuLD';
const sb=supabase.createClient(SBU,SBK);
const COLORS={purple:{bg:'rgba(167,139,250,.15)',text:'#a78bfa'},teal:{bg:'rgba(52,211,153,.15)',text:'#34d399'},coral:{bg:'rgba(251,113,133,.15)',text:'#fb7185'},blue:{bg:'rgba(91,156,246,.15)',text:'#5b9cf6'},amber:{bg:'rgba(255,184,48,.15)',text:'#ffb830'},neongreen:{bg:'rgba(57,255,20,.15)',text:'#39ff14'},gold:{bg:'rgba(255,215,0,.15)',text:'#ffd700'},violet:{bg:'rgba(238,130,238,.15)',text:'#ee82ee'},cyan:{bg:'rgba(0,255,255,.15)',text:'#00ffff'},red:{bg:'rgba(255,60,60,.15)',text:'#ff4444'},lime:{bg:'rgba(50,205,50,.15)',text:'#32cd32'},midnight:{bg:'rgba(100,120,200,.15)',text:'#8899dd'},rose:{bg:'rgba(255,100,150,.15)',text:'#ff6496'},orange:{bg:'rgba(255,150,50,.15)',text:'#ff9632'},sky:{bg:'rgba(100,200,255,.15)',text:'#64c8ff'}};
const PAL=[{n:'Neon Green',h:'#7fff6e'},{n:'Electric Blue',h:'#5b9cf6'},{n:'Purple',h:'#a78bfa'},{n:'Hot Pink',h:'#fb7185'},{n:'Teal',h:'#34d399'},{n:'Amber',h:'#ffb830'},{n:'Cyan',h:'#00ffff'},{n:'Gold',h:'#ffd700'},{n:'Lime',h:'#32cd32'},{n:'Orange',h:'#ff9632'},{n:'Red',h:'#ff4444'},{n:'Sky Blue',h:'#64c8ff'},{n:'Violet',h:'#ee82ee'},{n:'Rose',h:'#ff6496'},{n:'Coral',h:'#ff7f50'},{n:'Mint',h:'#98ff98'},{n:'Lavender',h:'#b57bee'},{n:'Peach',h:'#ffb347'},{n:'Steel',h:'#8899dd'},{n:'Ruby',h:'#e0115f'},{n:'Turquoise',h:'#40e0d0'},{n:'Magenta',h:'#ff00ff'},{n:'Indigo',h:'#6366f1'},{n:'Emerald',h:'#10b981'}];

function ls(k){try{var v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}}
function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

var RCOLS=ls('4k_rc')||{},customRA=ls('4k_cra')||{},delBase=ls('4k_del')||{tasks:{},rc:[]},customRC=ls('4k_crc')||[],catMeta=ls('4k_cm')||{},catOrder=ls('4k_co')||null;

function saveAll(){lss('4k_rc',RCOLS);lss('4k_cra',customRA);lss('4k_del',delBase);lss('4k_crc',customRC);lss('4k_cm',catMeta);lss('4k_co',catOrder);saveSettings();}

async function saveSettings(){
  try{
    var data={rcols:RCOLS,cra:customRA,del:delBase,crc:customRC,cm:catMeta,co:catOrder};
    await sb.from('settings').upsert([{key:'agency_prefs',value:data,updated_at:new Date().toISOString()}]);
  }catch(e){console.log('saveSettings err',e);}
}

async function loadSettings(){
  try{
    var r=await sb.from('settings').select('value').eq('key','agency_prefs').single();
    if(r.data&&r.data.value){
      var v=r.data.value;
      RCOLS=v.rcols||{};customRA=v.cra||{};delBase=v.del||{tasks:{},rc:[]};customRC=v.crc||[];catMeta=v.cm||{};catOrder=v.co||null;
    }
  }catch(e){console.log('No saved settings yet');}
}

const BRA={
  'Lead Searching':{icon:'🔍',desc:'Find and qualify high-potential leads.',tasks:['Scrape leads','Qualify leads','Add leads to sheet','Contact leads','Follow up with leads','Research potential model','Filter bad leads','Tag hot leads','DM prospect']},
  'Networking':{icon:'🤝',desc:'Build relationships that open doors.',tasks:['Message potential partner','Test networking script','Follow up','Book call','Log useful connection','Referral outreach','Warm intro','Check reply']},
  'Twitter/Social Growth':{icon:'🐦',desc:'Grow audience and build authority.',tasks:['Post content','Track impressions','Test hook','Check account growth','Analyze best post','Schedule content','Reply farming']},
  'Chaturbate':{icon:'⭐',desc:'Optimize discovery and model outreach.',tasks:['Find streamer','Log stats','Lead qualify','DM model','Track shift','Show notes','Top room review']},
  'Reddit':{icon:'👽',desc:'Leverage Reddit to attract quality leads.',tasks:['Post content','Engage in subreddit','Check post performance','Reply to comments','Test title','Track upvotes']},
  'Chatters':{icon:'💬',desc:'Recruit, train, and manage top chatters.',tasks:['Reply to DMs','Send mass message','Upsell content','Log conversation results','Recruit chatter','Interview','Test shift','Daily recap']},
  'Model Management':{icon:'👤',desc:'Oversee model performance and content.',tasks:['Check in with model','Review model content','Give feedback','Track model metrics']},
  'Systems/SOPs':{icon:'⚙️',desc:'Document, optimize, and scale operations.',tasks:['Create SOP','Update SOP','Fix workflow','Build tracker','Find bottleneck','Outsource prep','Task audit']},
  'PA/Oversight':{icon:'🛡️',desc:'Oversee execution and keep team aligned.',tasks:['Check submissions','Review late tasks','Ping team','Daily summary','Bottleneck review','ETA audit','Weekly recap']},
  'General Admin':{icon:'📋',desc:'Core admin tasks that keep things moving.',tasks:['Assign task','Review KPI','Calendar plan','Role update','Add member','Meeting prep']}
};
const BRC=['Lead found','Qualified lead','DM sent','Reply received','Positive reply','Call booked','Model recruited','Partner found','Post made','Impressions gained','Followers gained','Script tested','SOP created','SOP updated','Bottleneck found','Follow-up completed','No result','Needs review'];

function getOrder(){var base=Object.keys(BRA);if(!catOrder)return base;var extra=Object.keys(customRA).filter(function(r){return!base.includes(r)&&!catOrder.includes(r);});return catOrder.filter(function(r){return base.includes(r)||customRA[r];}).concat(extra);}
function getRA(){var order=getOrder(),res={};order.forEach(function(role){var bd=BRA[role],bt=bd?bd.tasks.filter(function(t){return!(delBase.tasks[role]||[]).includes(t);}):[];var ct=customRA[role]||[];res[role]=bt.concat(ct);});Object.keys(customRA).forEach(function(r){if(!res[r])res[r]=customRA[r]||[];});return res;}
function getRC(){return BRC.filter(function(r){return!delBase.rc.includes(r);}).concat(customRC.filter(function(r){return!BRC.includes(r);}));}
function getCatInfo(role){var ov=catMeta[role]||{},b=BRA[role]||{};return{icon:ov.icon||b.icon||'📌',desc:ov.desc||b.desc||'',name:ov.name||role};}
function getRCol(r){return RCOLS[r]||'#888';}

const TIMES=[{l:'15m',m:15},{l:'30m',m:30},{l:'45m',m:45},{l:'1h',m:60},{l:'1h 15m',m:75},{l:'1h 30m',m:90},{l:'1h 45m',m:105},{l:'2h',m:120},{l:'2h 30m',m:150},{l:'3h',m:180},{l:'4h',m:240},{l:'5h+',m:300}];
const QT=['The agency moves when the team moves.','Consistency beats motivation every time.','What gets measured gets managed.','Every logged task builds a better system.','Data does not lie. Log everything.','Small daily wins compound into agencies.','Accountability is the foundation of growth.'];

var members=[],tasks=[],hist=[],charts={},cu=null,calDate=new Date();
var sMid=null,sRoles=[],sTT=null,sRCs=[],sEta=null,sAct=null,selPin=null,isRec=false,recFreq=null;
var pickRole=null,editCat=null,curDayT=[],dragCat=null,dms=null;

function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):'';}
function fm(m){if(!m&&m!==0)return'—';if(m<60)return m+'m';var h=Math.floor(m/60),mn=m%60;return mn?h+'h '+mn+'m':h+'h';}
function ini(n){return(n||'??').slice(0,2).toUpperCase();}
function isC(m){return(m.role_tags||'').toLowerCase().includes('chatter');}
function el(id){return document.getElementById(id);}
function qs(sel,ctx){return(ctx||document).querySelector(sel);}
function qsa(sel,ctx){return(ctx||document).querySelectorAll(sel);}

// LOGIN
async function initLogin(){
  var r=await sb.from('members').select('*').order('name');
  members=r.data||[];
  renderLG(members);
}

function renderLG(list){
  var admins=list.filter(function(m){return m.is_admin;});
  var team=list.filter(function(m){return !m.is_admin;});
  var pi='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:.4;flex-shrink:0"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
  var h='';
  if(admins.length){
    h+='<div class="login-section"><div class="ls-line"></div><span class="ls-label">Admins</span><div class="ls-line"></div></div>';
    h+='<div class="admin-grid">';
    admins.forEach(function(m){h+='<button class="abtn mbtn" data-id="'+m.id+'" data-name="'+m.name+'">'+pi+m.name+'</button>';});
    h+='</div>';
  }
  if(team.length){
    h+='<div class="login-section"><div class="ls-line"></div><span class="ls-label">Team Members</span><div class="ls-line"></div></div>';
    h+='<div class="team-grid">';
    team.forEach(function(m){h+='<button class="tbtn2 mbtn" data-id="'+m.id+'" data-name="'+m.name+'">'+pi+m.name+'</button>';});
    h+='</div>';
  }
  el('lgrid').innerHTML=h;
  qsa('.mbtn').forEach(function(btn){
    btn.addEventListener('click',function(){selM(this.dataset.id,this.dataset.name);});
  });
}

function filterM(){var q=el('msearch').value.toLowerCase();renderLG(q?members.filter(function(m){return m.name.toLowerCase().includes(q);}):members);}

function selM(id,name){
  selPin={id:id,name:name};
  qsa('.mbtn').forEach(function(b){b.classList.toggle('sel',b.dataset.id===id);});
  el('pinlbl').textContent=name+' — enter PIN';
  el('step2').classList.add('show');
  ['p0','p1','p2','p3'].forEach(function(i){el(i).value='';});
  el('lerr').textContent='';
  el('p0').focus();
}

function backSel(){el('step2').classList.remove('show');selPin=null;}
function pnext(i){if(el('p'+i).value&&i<3)el('p'+(i+1)).focus();}
function pkey(e,i){if(e.key==='Backspace'&&!el('p'+i).value&&i>0)el('p'+(i-1)).focus();if(e.key==='Enter')doLogin();}
function getPin(){return['p0','p1','p2','p3'].map(function(i){return el(i).value;}).join('');}

function doLogin(){
  if(!selPin){el('lerr').textContent='Select your name first';return;}
  var pin=getPin();
  var m=members.find(function(x){return x.id===selPin.id;});
  if(!m)return;
  if(m.pin&&m.pin!==pin){
    el('lerr').textContent='Wrong PIN — try again';
    ['p0','p1','p2','p3'].forEach(function(i){el(i).value='';});
    el('p0').focus();return;
  }
  cu={id:m.id,name:m.name,isAdmin:m.is_admin||false,color:m.color||'teal'};
  enterApp();
}

function enterApp(){
  el('LS').classList.add('hidden');
  el('APP').style.display='flex';
  var c=COLORS[cu.color]||COLORS.teal;
  var av=el('uav');
  av.style.background=c.bg;av.style.color=c.text;av.textContent=ini(cu.name);
  el('uname').textContent=cu.name;
  el('urole').textContent=cu.isAdmin?'Admin':'Team member';
  qsa('.ao').forEach(function(e){e.style.display=cu.isAdmin?'':'none';});
  el('today').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  el('quote').textContent=QT[new Date().getDay()%QT.length];
  loadSettings().then(function(){load();});
}

function logout(){
  cu=null;
  el('LS').classList.remove('hidden');
  el('APP').style.display='none';
  el('step2').classList.remove('show');
  el('msearch').value='';
  renderLG(members);
}

// DATA
async function load(){
  var results=await Promise.all([
    sb.from('members').select('*').order('name'),
    sb.from('tasks').select('*').order('logged_at',{ascending:false}),
    sb.from('task_history').select('*').order('changed_at',{ascending:false})
  ]);
  members=results[0].data||[];tasks=results[1].data||[];hist=results[2].data||[];
  render();
}

function mt(id){return tasks.filter(function(t){return t.member_id===id;});}
function mst(id){
  var mine=mt(id),tot=mine.length,don=mine.filter(function(t){return t.status==='done';}).length,lat=mine.filter(function(t){return t.status==='late';}).length,rt=tot?Math.round(don/tot*100):0;
  var wt=mine.filter(function(t){return t.actual_minutes&&t.eta_minutes;});
  var aA=wt.length?Math.round(wt.reduce(function(s,t){return s+t.actual_minutes;},0)/wt.length):null;
  var aE=wt.length?Math.round(wt.reduce(function(s,t){return s+t.eta_minutes;},0)/wt.length):null;
  return{total:tot,done:don,late:lat,rate:rt,avgA:aA,avgE:aE,noR:mine.filter(function(t){return t.result_category==='No result';}).length,nf:mine.filter(function(t){return t.result_category==='Needs review'||(t.notes||'').toLowerCase().includes('follow');}).length};
}
function vrd(id){var s=mst(id);if(!s.total)return{label:'No data',cls:'nodata'};if(s.late>=2)return{label:'Falling behind',cls:'behind'};if(s.rate>=80)return{label:'Producing',cls:'producing'};if(s.rate>=50)return{label:'Watch',cls:'watch'};return{label:'Falling behind',cls:'behind'};}
function stag(s){var m={done:['Done','done'],prog:['In progress','prog'],late:['Late','late'],pending:['Pending','pending']};var p=m[s]||['?','pending'];return'<span class="tag '+p[1]+'">'+p[0]+'</span>';}
function ebar(eta,act){if(!eta)return'';var pct=act?Math.min(Math.round(act/eta*100),150):0,over=act>eta,cls=!act?'b':over?'r':'g';return'<div style="margin-top:4px"><div class="erow"><span>ETA '+fm(eta)+(act?' · '+fm(act):'')+'</span><span>'+(act?(over?'+'+fm(act-eta)+' over':'-'+fm(eta-act)+' under'):'—')+'</span></div><div class="btrack"><div class="bfill '+cls+'" style="width:'+Math.min(pct,100)+'%"></div></div></div>';}
function getTH(tid){return hist.filter(function(h){return h.task_id===tid;});}
function renderH(tid){var h=getTH(tid);if(!h.length)return'<div style="color:var(--text3);font-size:11px">No changes.</div>';return h.map(function(x){var c=members.find(function(m){return m.id===x.changed_by;});return'<div class="hist-item"><div class="hdot"></div><div><div class="htxt"><strong>'+(c?c.name:'?')+'</strong> changed <strong>'+x.field_changed+'</strong>: "'+x.old_value+'"→"'+x.new_value+'"</div><div class="htime">'+new Date(x.changed_at).toLocaleString()+'</div></div></div>';}).join('');}

// INSIGHTS
function genIns(){
  var ins=[],tod=new Date().toDateString(),todT=tasks.filter(function(t){return new Date(t.logged_at).toDateString()===tod;});
  members.forEach(function(m){if(!todT.some(function(t){return t.member_id===m.id;}))ins.push({t:'warn',i:'⚠️',txt:'<strong>'+m.name+'</strong> has logged 0 tasks today.'});});
  members.forEach(function(m){var mine=mt(m.id).filter(function(t){return t.actual_minutes&&t.eta_minutes;});if(mine.length<2)return;var ae=mine.reduce(function(s,t){return s+t.eta_minutes;},0)/mine.length,aa=mine.reduce(function(s,t){return s+t.actual_minutes;},0)/mine.length,d=Math.round(aa-ae);if(d>20)ins.push({t:'warn',i:'🕐',txt:'<strong>'+m.name+'</strong> averages <strong>+'+fm(d)+'</strong> over ETA.'});if(d<-15)ins.push({t:'good',i:'⚡',txt:'<strong>'+m.name+'</strong> is <strong>'+fm(Math.abs(d))+' under ETA</strong>.'});});
  members.forEach(function(m){var s=mst(m.id);if(s.late>=3)ins.push({t:'bad',i:'🚨',txt:'<strong>'+m.name+'</strong> has <strong>'+s.late+' late tasks</strong>.'});else if(s.late>=1)ins.push({t:'warn',i:'⚠️',txt:'<strong>'+m.name+'</strong> has <strong>'+s.late+' late task'+(s.late>1?'s':'')+'</strong>.'});});
  var ed=tasks.filter(function(t){return t.edited_at;});if(ed.length)ins.push({t:'info',i:'✏️',txt:'<strong>'+ed.length+' task'+(ed.length>1?'s have':' has')+'</strong> been edited after logging.'});
  var ttR={};tasks.forEach(function(t){if(t.task_type&&t.result_category&&t.result_category!=='No result')ttR[t.task_type]=(ttR[t.task_type]||0)+1;});
  var best=Object.entries(ttR).sort(function(a,b){return b[1]-a[1];})[0];if(best)ins.push({t:'good',i:'🏆',txt:'"<strong>'+best[0]+'</strong>" is top task — <strong>'+best[1]+' results</strong>.'});
  var tot=tasks.length,don=tasks.filter(function(t){return t.status==='done';}).length,rt=tot?Math.round(don/tot*100):0;
  if(tot>0){if(rt>=80)ins.push({t:'good',i:'✅',txt:'Completion rate is <strong>'+rt+'%</strong>.'});else if(rt>=50)ins.push({t:'warn',i:'📊',txt:'Completion rate is <strong>'+rt+'%</strong> — room to improve.'});else ins.push({t:'bad',i:'🔴',txt:'Only <strong>'+rt+'%</strong> completion.'});}
  var tp=members.map(function(m){return{m:m,s:mst(m.id)};}).filter(function(x){return x.s.total>0;}).sort(function(a,b){return b.s.rate-a.s.rate;})[0];
  if(tp&&tp.s.rate>0)ins.push({t:'good',i:'⭐',txt:'<strong>'+tp.m.name+'</strong> is top performer at <strong>'+tp.s.rate+'%</strong>.'});
  el('ilist').innerHTML=ins.length?ins.map(function(x){return'<div class="ii '+x.t+'"><div style="font-size:13px;flex-shrink:0;margin-top:1px">'+x.i+'</div><div>'+x.txt+'</div></div>';}).join(''):'<div style="color:var(--text3);font-size:12px;padding:4px 0">Log tasks to generate insights.</div>';
}

function toggleP(bid,iid){var b=el(bid),ic=el(iid);b.classList.toggle('coll');ic.classList.toggle('open',!b.classList.contains('coll'));}

function render(){rKPIs();rPulse();genIns();rMembers();var ap=function(n){return el('page-'+n).classList.contains('active');};if(ap('calendar'))renderCal();if(ap('performance'))rCharts();if(ap('oversight'))rOversight();if(ap('intelligence'))rIntel();if(ap('library'))rLib();if(ap('roles'))rRoles();}

function rKPIs(){
  var tot=tasks.length,don=tasks.filter(function(t){return t.status==='done';}).length,lat=tasks.filter(function(t){return t.status==='late';}).length;
  var res=tasks.filter(function(t){return t.result_category&&t.result_category!=='No result'&&t.result_category!=='Needs review';}).length;
  var rt=tot?Math.round(don/tot*100):0;
  var cards=[{l:'Tasks logged',v:tot,c:'',s:'all time',d:'all'},{l:'Completed',v:don,c:'g',s:rt+'% rate',d:'done'},{l:'Late / missed',v:lat,c:lat>2?'r':lat>0?'a':'g',s:'attention',d:'late'},{l:'Results',v:res,c:res>0?'g':'',s:'confirmed',d:'rk'},{l:'Team size',v:members.length,c:'',s:'members',d:''}];
  el('krow').innerHTML=cards.map(function(k){return'<div class="kcard"'+(k.d?' data-kd="'+k.d+'"':'')+' style="cursor:'+(k.d?'pointer':'default')+'"><div class="klbl">'+k.l+'</div><div class="kval '+k.c+'">'+k.v+'</div><div class="ksub">'+k.s+(k.d?' · tap':'')+'</div></div>';}).join('');
  qsa('.kcard[data-kd]').forEach(function(card){card.onclick=function(){dKPI(this.dataset.kd);};});
}

function rPulse(){
  var tot=tasks.length,don=tasks.filter(function(t){return t.status==='done';}).length,pct=tot?Math.round(don/tot*100):0;
  var cv=el('orb'),ctx=cv.getContext('2d');
  ctx.clearRect(0,0,40,40);
  ctx.beginPath();ctx.arc(20,20,17,0,Math.PI*2);ctx.fillStyle='#1a1a1a';ctx.fill();
  if(pct>0){ctx.beginPath();ctx.arc(20,20,17,-Math.PI/2,-Math.PI/2+Math.PI*2*(pct/100));ctx.strokeStyle='#7fff6e';ctx.lineWidth=4;ctx.lineCap='round';ctx.stroke();}
  el('opct').textContent=pct+'%';
  el('psub').textContent=pct>=80?'Agency firing 🔥':pct>=50?'Making moves':'Get those tasks logged';
  var str=0;for(var d=0;d<30;d++){var day=new Date();day.setDate(day.getDate()-d);if(tasks.some(function(t){return new Date(t.logged_at).toDateString()===day.toDateString();}))str++;else if(d>0)break;}
  el('streak').textContent='🔥 '+str+' day streak';
}

function rMembers(){
  var container=el('mgrid2');
  if(!members.length){container.innerHTML='<div style="color:var(--text3);font-size:13px">No members yet.</div>';return;}
  var q=(el('tsrch')?el('tsrch').value||'':'').toLowerCase();
  var show=cu&&cu.isAdmin?members:members.filter(function(m){return m.id===cu.id;});
  if(q)show=show.filter(function(m){return m.name.toLowerCase().includes(q)||(m.role||'').toLowerCase().includes(q);});
  var html='';
  show.forEach(function(m){
    var c=COLORS[m.color]||COLORS.teal,s=mst(m.id),v=vrd(m.id),mine=mt(m.id).slice(0,2);
    var rc=s.rate>=80?'g':s.rate>=50?'a':'r',lc=s.late===0?'g':s.late<=1?'a':'r';
    var dc=s.avgA&&s.avgE?(s.avgA>s.avgE?'r':'g'):'',dv=s.avgA&&s.avgE?((s.avgA>s.avgE?'+':'')+fm(Math.abs(s.avgA-s.avgE))):'—';
    var tHTML='';
    if(mine.length){mine.forEach(function(t){tHTML+='<div class="ti"><div class="tr1"><span class="tn">'+(t.task_type||t.name||'—')+(t.edited_at?'<span class="ebadge">edited</span>':'')+(t.is_recurring?'<span class="rbadge">🔄 '+t.recur_frequency+'</span>':'')+'</span>'+stag(t.status)+'</div><div class="tm">'+(t.role_area||'')+' '+(t.result_category?'· '+t.result_category:'')+'</div>'+ebar(t.eta_minutes,t.actual_minutes)+'</div>';});}
    else{tHTML='<div style="font-size:12px;color:var(--text3);padding:8px 0;text-align:center">No tasks yet</div>';}
    var editBtn=cu&&cu.isAdmin?'<button class="btn sm" data-edit="'+m.id+'">Edit</button>':'';
    html+='<div class="mcard '+v.cls+(isC(m)?' chatter':'')+'" draggable="true" data-mid="'+m.id+'">';
    html+='<div class="mhd"><div style="display:flex;align-items:center;gap:8px"><div class="av" style="background:'+c.bg+';color:'+c.text+'">'+ini(m.name)+'</div>';
    html+='<div><div class="mn">'+m.name+(isC(m)?'<span style="font-size:9px;color:var(--purple);margin-left:5px">CHATTER</span>':'')+'</div><div class="mr">'+m.role+'</div></div></div><span class="vd '+v.cls+'">'+v.label+'</span></div>';
    html+='<div class="mstats"><div class="ms"><div class="msl">Tasks</div><div class="msv">'+s.total+'</div></div><div class="ms"><div class="msl">Done</div><div class="msv '+rc+'">'+s.rate+'%</div></div><div class="ms"><div class="msl">Late</div><div class="msv '+lc+'">'+s.late+'</div></div><div class="ms"><div class="msl">vs ETA</div><div class="msv '+dc+'">'+dv+'</div></div></div>';
    html+='<div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Recent</div>'+tHTML;
    html+='<div style="display:flex;gap:5px;margin-top:8px"><button class="btn sm" style="flex:1;justify-content:center" data-log="'+m.id+'">+ Log task</button>'+editBtn+'</div></div>';
  });
  container.innerHTML=html;
  qsa('.mcard[data-mid]',container).forEach(function(card){
    var mid=card.dataset.mid;
    card.onclick=function(e){if(!e.target.closest('button'))viewP(mid);};
    card.ondragstart=function(){dms=mid;};
    card.ondragover=function(e){e.preventDefault();};
    card.ondrop=function(e){dropM(e,mid);};
    var m=members.find(function(x){return x.id===mid;});
    if(cu&&cu.isAdmin&&m&&isC(m)){card.onmouseenter=function(e){showCP(e,mid);};card.onmouseleave=hideCP;}
  });
  qsa('[data-log]',container).forEach(function(btn){var mid=btn.dataset.log;btn.onclick=function(e){e.stopPropagation();openTFor(mid);};});
  qsa('[data-edit]',container).forEach(function(btn){var mid=btn.dataset.edit;btn.onclick=function(e){e.stopPropagation();openEM(mid);};});
}

function dropM(e,tid){if(!dms||dms===tid)return;var idx=members.map(function(m){return m.id;});var fi=idx.indexOf(dms),ti=idx.indexOf(tid);idx.splice(fi,1);idx.splice(ti,0,dms);members.sort(function(a,b){return idx.indexOf(a.id)-idx.indexOf(b.id);});dms=null;rMembers();}

function showCP(e,mid){
  var m=members.find(function(x){return x.id===mid;});if(!m)return;
  var s=mst(mid),tod=new Date().toDateString(),tc=mt(mid).filter(function(t){return new Date(t.logged_at).toDateString()===tod;}).length;
  var p=el('cpanel');
  p.innerHTML='<div class="cpname">👁️ '+m.name+' — Chatter monitor</div><div class="cprow"><span>Tasks today</span><span style="color:'+(tc>0?'var(--accent)':'var(--red)')+'">'+tc+'</span></div><div class="cprow"><span>Completion</span><span style="color:'+(s.rate>=80?'var(--accent)':s.rate>=50?'var(--amber)':'var(--red)')+'">'+s.rate+'%</span></div><div class="cprow"><span>Late</span><span style="color:'+(s.late>0?'var(--red)':'var(--accent)')+'">'+s.late+'</span></div><div class="cprow"><span>vs ETA</span><span>'+(s.avgA&&s.avgE?((s.avgA>s.avgE?'+':'')+fm(Math.abs(s.avgA-s.avgE))):'—')+'</span></div><div style="margin-top:8px"><button class="btn p sm" data-prof="'+mid+'" style="width:100%;justify-content:center">Full profile →</button></div>';
  p.style.left=Math.min(e.clientX+10,window.innerWidth-280)+'px';
  p.style.top=Math.min(e.clientY-50,window.innerHeight-240)+'px';
  p.classList.add('show');
  var pb=p.querySelector('[data-prof]');if(pb)pb.onclick=function(){viewP(mid);};
}
function hideCP(){setTimeout(function(){el('cpanel').classList.remove('show');},300);}

// CALENDAR
function renderCal(){
  var y=calDate.getFullYear(),mo=calDate.getMonth();
  el('cml').textContent=calDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  var fd=new Date(y,mo,1).getDay(),dim=new Date(y,mo+1,0).getDate(),today=new Date();
  var q=(el('csrch')?el('csrch').value||'':'').toLowerCase();
  var h='';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(d){h+='<div class="cdlbl">'+d+'</div>';});
  for(var i=0;i<fd;i++){var d=new Date(y,mo,-(fd-1-i));h+='<div class="cday omth"><div class="cdnum">'+d.getDate()+'</div></div>';}
  for(var d=1;d<=dim;d++){
    var iT=today.getFullYear()===y&&today.getMonth()===mo&&today.getDate()===d,ds=new Date(y,mo,d).toDateString();
    var dT=tasks.filter(function(t){return new Date(t.logged_at).toDateString()===ds&&(!q||members.some(function(m){return m.id===t.member_id&&m.name.toLowerCase().includes(q);}));});
    var rT=tasks.filter(function(t){if(!t.is_recurring||!t.logged_at||!t.recur_frequency)return false;var orig=new Date(t.logged_at),chk=new Date(y,mo,d),diff=Math.round((chk-orig)/86400000);if(diff<=0)return false;var fm2={'Daily':1,'3 days':3,'5 days':5,'1 week':7,'2 weeks':14,'1 month':30};var f=fm2[t.recur_frequency];return f&&diff%f===0;});
    var dots=dT.slice(0,3).map(function(t){var m=members.find(function(x){return x.id===t.member_id;});return'<div class="cdot '+t.status+'">'+(m?m.name.split(' ')[0]:'?')+': '+(t.task_type||t.name||'Task')+'</div>';}).join('');
    var rdots=rT.slice(0,1).map(function(t){var m=members.find(function(x){return x.id===t.member_id;});return'<div class="cdot rec">🔄 '+(m?m.name.split(' ')[0]:'?')+'</div>';}).join('');
    var more=dT.length>3?'<div style="font-size:8px;color:var(--text3)">+'+(dT.length-3)+'</div>':'';
    h+='<div class="cday'+(iT?' today':'')+(dT.length?' htask':'')+(rT.length?' recday':'')+'" data-ds="'+ds+'"><div class="cdnum">'+d+'</div>'+dots+rdots+more+'</div>';
  }
  el('cgrid').innerHTML=h;
  qsa('.cday[data-ds]').forEach(function(day){day.onclick=function(){openDD(this.dataset.ds);};});
  rCalSum(y,mo);
}

function rCalSum(y,mo){var dim=new Date(y,mo+1,0).getDate(),tot=0,don=0,lat=0;for(var d=1;d<=dim;d++){var ds=new Date(y,mo,d).toDateString(),dT=tasks.filter(function(t){return new Date(t.logged_at).toDateString()===ds;});tot+=dT.length;don+=dT.filter(function(t){return t.status==='done';}).length;lat+=dT.filter(function(t){return t.status==='late';}).length;}var rt=tot?Math.round(don/tot*100):0;el('csum').innerHTML='<div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Month summary</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px"><div class="ms" style="border-radius:8px;padding:10px 12px"><div class="msl">Tasks</div><div class="msv">'+tot+'</div></div><div class="ms" style="border-radius:8px;padding:10px 12px"><div class="msl">Completed</div><div class="msv g">'+don+'</div></div><div class="ms" style="border-radius:8px;padding:10px 12px"><div class="msl">Late</div><div class="msv '+(lat>0?'r':'')+'">'+lat+'</div></div><div class="ms" style="border-radius:8px;padding:10px 12px"><div class="msl">Rate</div><div class="msv '+(rt>=80?'g':rt>=50?'a':'r')+'">'+rt+'%</div></div></div>';}

function buildDayHTML(dT,sq){
  var q=(sq||'').toLowerCase(),bM={};
  dT.forEach(function(t){if(!bM[t.member_id])bM[t.member_id]=[];bM[t.member_id].push(t);});
  var mids=Object.keys(bM);
  if(q){mids.sort(function(a,b){var ma=members.find(function(x){return x.id===a;}),mb=members.find(function(x){return x.id===b;});var ha=(ma?ma.name:'').toLowerCase().includes(q),hb=(mb?mb.name:'').toLowerCase().includes(q);return ha&&!hb?-1:!ha&&hb?1:0;});mids=mids.filter(function(mid){var m=members.find(function(x){return x.id===mid;});return(m?m.name:'').toLowerCase().includes(q);});}
  if(!mids.length)return'<div style="color:var(--text3);font-size:13px">No tasks match search.</div>';
  return mids.map(function(mid){
    var m=members.find(function(x){return x.id===mid;}),c=COLORS[(m?m.color:null)||'teal']||COLORS.teal,mT=bM[mid];
    var don=mT.filter(function(t){return t.status==='done';}).length,lat=mT.filter(function(t){return t.status==='late';}).length;
    var html='<div style="margin-bottom:14px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div class="av" style="width:28px;height:28px;font-size:10px;background:'+c.bg+';color:'+c.text+';border-radius:6px">'+ini(m?m.name:'?')+'</div><div style="font-size:13px;font-weight:600">'+(m?m.name:'Unknown')+'</div><div style="font-size:11px;color:var(--text2)">'+mT.length+' tasks · '+don+' done'+(lat>0?' · '+lat+' late':'')+'</div></div>';
    mT.forEach(function(t){
      var hh=getTH(t.id),hHTML=hh.length?'<div style="margin-top:5px;padding:6px 8px;background:var(--bg4);border-radius:5px"><div style="font-size:9px;color:var(--text3);margin-bottom:4px">Change history</div>'+renderH(t.id)+'</div>':'';
      html+='<div class="ti" style="margin-left:36px"><div class="tr1"><span class="tn">'+(t.task_type||t.name||'—')+(t.is_recurring?' <span class="rbadge">🔄 '+t.recur_frequency+'</span>':'')+'</span>'+stag(t.status)+'</div><div class="tm">'+(t.role_area||'')+' '+(t.result_category?'· '+t.result_category:'')+'</div>'+ebar(t.eta_minutes,t.actual_minutes)+(t.notes?'<div style="font-size:10px;color:var(--text3);margin-top:3px">'+t.notes+'</div>':'')+(t.edited_at?'<div style="font-size:10px;color:var(--amber);margin-top:2px">✏️ Edited '+new Date(t.edited_at).toLocaleString()+'</div>':'')+hHTML+(cu&&cu.isAdmin?'<div style="margin-top:5px;display:flex;gap:5px"><button class="btn sm" data-et="'+t.id+'">Edit</button><button class="btn sm danger" data-dt="'+t.id+'">Delete</button></div>':'')+'</div>';
    });
    html+='</div>';return html;
  }).join('');
}

function openDD(ds){
  var dT=tasks.filter(function(t){return new Date(t.logged_at).toDateString()===ds;});curDayT=dT;
  el('ddt').textContent=ds+' — '+dT.length+' task'+(dT.length!==1?'s':'');
  el('ddsrch').value='';
  el('ddc').innerHTML=dT.length?buildDayHTML(dT,''):'<div style="color:var(--text3);font-size:13px">No tasks logged this day.</div>';
  el('dd').classList.add('open');
  el('dd').scrollIntoView({behavior:'smooth',block:'nearest'});
  bindDayActions();
}

function filterDD(){
  el('ddc').innerHTML=curDayT.length?buildDayHTML(curDayT,el('ddsrch').value):'<div style="color:var(--text3);font-size:13px">No tasks.</div>';
  bindDayActions();
}

function bindDayActions(){
  qsa('[data-et]').forEach(function(btn){var id=btn.dataset.et;btn.onclick=function(){openET(id);};});
  qsa('[data-dt]').forEach(function(btn){var id=btn.dataset.dt;btn.onclick=function(){delT(id,btn);};});
}

function goT(){calDate=new Date();renderCal();}
function chM(d){calDate.setMonth(calDate.getMonth()+d);renderCal();}

// TASK LIBRARY
var dragCatEl=null;
function rLib(){
  var RA=getRA(),order=getOrder().filter(function(r){return RA[r]!==undefined||BRA[r];});
  el('bcats').innerHTML=order.map(function(role){
    var info=getCatInfo(role),col=getRCol(role),tl=RA[role]||[];
    var bubs=tl.map(function(t){return'<span class="lbub" style="border-color:'+col+'33;color:'+col+'" data-role="'+role+'" data-task="'+t+'">'+t+(cu&&cu.isAdmin?'<span class="lx">✕</span>':'')+'</span>';}).join('');
    var addB=cu&&cu.isAdmin?'<button class="add-bub" data-addrole="'+role+'">+ Add</button>':'';
    var editB=cu&&cu.isAdmin?'<button class="btn sm" data-editcat="'+role+'">Edit</button>':'';
    var colB=cu&&cu.isAdmin?'<button class="btn sm" data-colcat="'+role+'">Color</button>':'';
    var isBase=!!BRA[role];
    var delCatB=cu&&cu.isAdmin&&!isBase?'<button class="btn sm danger" data-delcat="'+role+'">Del</button>':'';
    return'<div class="bcat" style="background:'+col+'08;border-color:'+col+'22" draggable="true" data-catname="'+role+'"><div class="bchead"><div style="display:flex;align-items:center;gap:8px"><span class="bcicon">'+info.icon+'</span><div><div class="bcname">'+info.name+'</div><div class="bcdesc">'+info.desc+'</div></div></div><div style="display:flex;gap:5px">'+editB+colB+delCatB+'</div></div><div class="bubbles">'+bubs+'</div><div style="margin-top:5px">'+addB+'</div></div>';
  }).join('');
  // Bind lib events
  qsa('.lbub').forEach(function(bub){
    bub.onclick=function(){var role=this.dataset.role,task=this.dataset.task;quickLog(role,task);};
    var lx=bub.querySelector('.lx');if(lx)lx.onclick=function(e){e.stopPropagation();delLibT(bub.dataset.role,bub.dataset.task);};
  });
  qsa('[data-addrole]').forEach(function(btn){btn.onclick=function(){addLibBub(this.dataset.addrole,this);};});
  qsa('[data-editcat]').forEach(function(btn){btn.onclick=function(e){e.stopPropagation();openECM(this.dataset.editcat);};});
  qsa('[data-colcat]').forEach(function(btn){btn.onclick=function(e){e.stopPropagation();openCP(this.dataset.colcat);};});
  qsa('[data-delcat]').forEach(function(btn){btn.onclick=function(e){e.stopPropagation();delCat(this.dataset.delcat);};});
  qsa('.bcat[data-catname]').forEach(function(cat){
    cat.ondragstart=function(){dragCat=this.dataset.catname;};
    cat.ondragover=function(e){e.preventDefault();this.classList.add('dov');};
    cat.ondragleave=function(){this.classList.remove('dov');};
    cat.ondrop=function(e){this.classList.remove('dov');dropCat(e,this.dataset.catname);};
  });
}

function dropCat(e,targetRole){if(!dragCat||dragCat===targetRole)return;var order=getOrder();var fi=order.indexOf(dragCat),ti=order.indexOf(targetRole);if(fi<0||ti<0)return;order.splice(fi,1);order.splice(ti,0,dragCat);catOrder=order;saveAll();rLib();dragCat=null;}

function addLibBub(role,btn){
  var wrap=document.createElement('div');wrap.style.cssText='display:flex;gap:5px;margin-top:5px;flex-wrap:wrap';
  var inp=document.createElement('input');inp.style.cssText='background:var(--bg4);border:1px solid var(--border2);border-radius:6px;padding:5px 9px;font-size:12px;color:var(--text);font-family:DM Sans,sans-serif;outline:none;width:140px';inp.placeholder='New task name...';
  var ab=document.createElement('button');ab.className='btn sm';ab.textContent='Add';
  wrap.appendChild(inp);wrap.appendChild(ab);
  btn.closest('.bcat').appendChild(wrap);inp.focus();
  var doAdd=function(){var val=cap(inp.value.trim());if(!val){wrap.remove();return;}if(!customRA[role])customRA[role]=[];if(!customRA[role].includes(val))customRA[role].push(val);saveAll();wrap.remove();rLib();toast('"'+val+'" added');};
  ab.onclick=doAdd;inp.onkeydown=function(e){if(e.key==='Enter')doAdd();if(e.key==='Escape')wrap.remove();};
}

function delLibT(role,task){if(customRA[role]&&customRA[role].includes(task)){customRA[role]=customRA[role].filter(function(t){return t!==task;});}else{if(!delBase.tasks[role])delBase.tasks[role]=[];if(!delBase.tasks[role].includes(task))delBase.tasks[role].push(task);}saveAll();rLib();toast('"'+task+'" removed');}
function delCat(role){delete customRA[role];if(catOrder)catOrder=catOrder.filter(function(r){return r!==role;});saveAll();rLib();toast('"'+role+'" removed');}
function openECM(role){editCat=role;var info=getCatInfo(role);el('ecmtitle').textContent='Edit "'+info.name+'"';el('ecmname').value=catMeta[role]?catMeta[role].name||'':'';el('ecmdesc').value=info.desc;el('ecmicon').value=info.icon;el('ECM').classList.add('open');}
function saveECM(){if(!editCat)return;if(!catMeta[editCat])catMeta[editCat]={};var n=el('ecmname').value.trim(),d=el('ecmdesc').value.trim(),ic=el('ecmicon').value.trim();if(n)catMeta[editCat].name=n;if(d)catMeta[editCat].desc=d;if(ic)catMeta[editCat].icon=ic;saveAll();el('ECM').classList.remove('open');rLib();toast('Category updated');}
function openCP(role){pickRole=role;var cur=getRCol(role);el('cpgrid').innerHTML=PAL.map(function(c){return'<div class="csw'+(cur===c.h?' picked':'')+'" style="background:'+c.h+'" data-hex="'+c.h+'" title="'+c.n+'"></div>';}).join('');el('CPM').classList.add('open');qsa('.csw').forEach(function(sw){sw.onclick=function(){pickColor(this.dataset.hex);};});}
function pickColor(hex){if(!pickRole)return;RCOLS[pickRole]=hex;saveAll();el('CPM').classList.remove('open');rLib();toast('Color updated');}
function quickLog(role,tt){openT();setTimeout(function(){sRoles=[role];sTT=tt;bRoles();bTTs();},100);}

// CHARTS
function rCharts(){
  var lbl=members.map(function(m){return m.name;}),rates=members.map(function(m){return mst(m.id).rate;}),bc=rates.map(function(r){return r>=80?'#7fff6e':r>=50?'#ffb830':'#ff5c5c';});
  var aA=members.map(function(m){var s=mst(m.id);return s.avgA?+(s.avgA/60).toFixed(1):0;}),aE=members.map(function(m){var s=mst(m.id);return s.avgE?+(s.avgE/60).toFixed(1):0;}),lts=members.map(function(m){return mst(m.id).late;});
  var cd={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#444',font:{size:10}},grid:{display:false},border:{display:false}},y:{ticks:{color:'#444',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'},border:{display:false}}}};
  if(charts.c)charts.c.destroy();charts.c=new Chart(el('cc'),{type:'bar',data:{labels:lbl,datasets:[{data:rates,backgroundColor:bc,borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{min:0,max:100,ticks:Object.assign({},cd.scales.y.ticks,{callback:function(v){return v+'%';}})})})})});
  if(charts.t)charts.t.destroy();charts.t=new Chart(el('ct'),{type:'bar',data:{labels:lbl,datasets:[{label:'Actual',data:aA,backgroundColor:'#5b9cf6',borderRadius:4,borderSkipped:false},{label:'ETA',data:aE,backgroundColor:'#a78bfa',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{callback:function(v){return v+'h';}})})})})}); 
  var sc=[tasks.filter(function(t){return t.status==='done';}).length,tasks.filter(function(t){return t.status==='prog';}).length,tasks.filter(function(t){return t.status==='pending';}).length,tasks.filter(function(t){return t.status==='late';}).length];
  if(charts.s)charts.s.destroy();charts.s=new Chart(el('cs'),{type:'doughnut',data:{labels:['Done','In progress','Pending','Late'],datasets:[{data:sc,backgroundColor:['#7fff6e','#5b9cf6','#ffb830','#ff5c5c'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right',labels:{color:'#888',font:{size:10},boxWidth:10}}},cutout:'60%'}});
  if(charts.l)charts.l.destroy();charts.l=new Chart(el('cl'),{type:'bar',data:{labels:lbl,datasets:[{data:lts,backgroundColor:'#ff5c5c',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{stepSize:1})})})})});
  var rc={};tasks.forEach(function(t){if(t.result_category)rc[t.result_category]=(rc[t.result_category]||0)+1;});var rl=Object.keys(rc).slice(0,8),rd=rl.map(function(l){return rc[l];});
  if(charts.r)charts.r.destroy();charts.r=new Chart(el('cr'),{type:'bar',data:{labels:rl,datasets:[{data:rd,backgroundColor:'#34d399',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{indexAxis:'y',scales:{x:cd.scales.x,y:{ticks:{color:'#888',font:{size:9}},grid:{display:false},border:{display:false}}}})});
  var days=[],cnts=[];for(var d=13;d>=0;d--){var day=new Date();day.setDate(day.getDate()-d);var ds=day.toLocaleDateString('en-US',{month:'short',day:'numeric'});days.push(ds);cnts.push(tasks.filter(function(t){return new Date(t.logged_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})===ds;}).length);}
  if(charts.tr)charts.tr.destroy();charts.tr=new Chart(el('ctr'),{type:'line',data:{labels:days,datasets:[{data:cnts,borderColor:'#7fff6e',backgroundColor:'rgba(127,255,110,.08)',tension:.4,fill:true,pointRadius:3,pointBackgroundColor:'#7fff6e'}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{stepSize:1})})})})});
}

function tbl(list){
  if(!list.length)return'<div style="color:var(--text3);font-size:12px;padding:12px 0">No tasks found.</div>';
  var h='<div style="overflow-x:auto"><table class="dtbl"><thead><tr><th>Member</th><th>Task</th><th>Role</th><th>Status</th><th>ETA</th><th>Actual</th><th>Result</th><th>Edited?</th><th>Notes</th><th>Date</th>'+(cu&&cu.isAdmin?'<th>Actions</th>':'')+'</tr></thead><tbody>';
  list.slice(0,60).forEach(function(t){var m=members.find(function(x){return x.id===t.member_id;});h+='<tr><td>'+(m?m.name:'—')+'</td><td>'+(t.task_type||t.name||'—')+(t.is_recurring?' 🔄':'')+'</td><td>'+(t.role_area||'—')+'</td><td>'+stag(t.status)+'</td><td>'+fm(t.eta_minutes)+'</td><td>'+fm(t.actual_minutes)+'</td><td>'+(t.result_category||'—')+'</td><td>'+(t.edited_at?'<span class="ebadge">✏️</span>':'—')+'</td><td style="max-width:120px;word-break:break-word">'+(t.notes||'—')+'</td><td>'+(t.logged_at?new Date(t.logged_at).toLocaleDateString():'—')+'</td>'+(cu&&cu.isAdmin?'<td><div style="display:flex;gap:4px"><button class="btn sm" data-et="'+t.id+'">Edit</button><button class="btn sm danger" data-dt="'+t.id+'">Del</button></div></td>':'')+'</tr>';});
  h+='</tbody></table></div>';return h;
}

function dc(type){
  el('DD').classList.add('open');
  var cfgs={
    completion:{ti:'Completion rate',st:members.map(function(m){var s=mst(m.id);return'<div class="dstat"><div class="dstat-l">'+m.name+'</div><div class="dstat-v" style="color:'+(s.rate>=80?'var(--accent)':s.rate>=50?'var(--amber)':'var(--red)')+'">'+s.rate+'%</div></div>';}),li:tasks},
    time:{ti:'Time vs ETA',st:members.map(function(m){var s=mst(m.id),d=s.avgA&&s.avgE?s.avgA-s.avgE:null;return'<div class="dstat"><div class="dstat-l">'+m.name+'</div><div class="dstat-v" style="color:'+(d===null?'var(--text)':d>0?'var(--red)':'var(--accent)')+'">'+(d===null?'—':(d>0?'+':'')+fm(Math.abs(d)))+'</div></div>';}),li:tasks.filter(function(t){return t.actual_minutes||t.eta_minutes;})},
    status:{ti:'By status',st:[['Done',tasks.filter(function(t){return t.status==='done';}).length,'var(--accent)'],['In progress',tasks.filter(function(t){return t.status==='prog';}).length,'var(--blue)'],['Pending',tasks.filter(function(t){return t.status==='pending';}).length,'var(--amber)'],['Late',tasks.filter(function(t){return t.status==='late';}).length,'var(--red)']].map(function(x){return'<div class="dstat"><div class="dstat-l">'+x[0]+'</div><div class="dstat-v" style="color:'+x[2]+'">'+x[1]+'</div></div>';}),li:tasks},
    late:{ti:'Late tasks',st:members.map(function(m){var l=mt(m.id).filter(function(t){return t.status==='late';}).length;return'<div class="dstat"><div class="dstat-l">'+m.name+'</div><div class="dstat-v" style="color:'+(l>0?'var(--red)':'var(--accent)')+'">'+l+'</div></div>';}),li:tasks.filter(function(t){return t.status==='late';})},
    results:{ti:'Results by type',st:Object.entries(tasks.reduce(function(a,t){if(t.result_category)a[t.result_category]=(a[t.result_category]||0)+1;return a;},{})).sort(function(a,b){return b[1]-a[1];}).slice(0,5).map(function(x){return'<div class="dstat"><div class="dstat-l">'+x[0]+'</div><div class="dstat-v">'+x[1]+'</div></div>';}),li:tasks.filter(function(t){return t.result_category;})},
    trend:{ti:'Tasks — last 14 days',st:[],li:tasks.filter(function(t){var d=new Date(t.logged_at),c=new Date();c.setDate(c.getDate()-14);return d>=c;})}
  };
  var cfg=cfgs[type];
  el('ddt2').textContent=cfg.ti;
  el('dstats').innerHTML=Array.isArray(cfg.st)?cfg.st.join(''):cfg.st;
  el('dcontent').innerHTML=tbl(cfg.li);
  bindDrillActions();
}

function dKPI(type){
  el('DD').classList.add('open');
  var map={all:{t:'All tasks',l:tasks},done:{t:'Completed',l:tasks.filter(function(t){return t.status==='done';})},late:{t:'Late / missed',l:tasks.filter(function(t){return t.status==='late';})},rk:{t:'Results produced',l:tasks.filter(function(t){return t.result_category&&t.result_category!=='No result'&&t.result_category!=='Needs review';})}};
  var cfg=map[type]||{t:'Tasks',l:tasks};
  el('ddt2').textContent=cfg.t;el('dstats').innerHTML='';el('dcontent').innerHTML=tbl(cfg.l);
  bindDrillActions();
}

function bindDrillActions(){qsa('[data-et]').forEach(function(btn){var id=btn.dataset.et;btn.onclick=function(){openET(id);};});qsa('[data-dt]').forEach(function(btn){var id=btn.dataset.dt;btn.onclick=function(){delT(id,btn);};});}
function closeDrill(){el('DD').classList.remove('open');}

function viewP(mid){
  var m=members.find(function(x){return x.id===mid;});if(!m)return;
  var c=COLORS[m.color]||COLORS.teal,s=mst(mid),mine=mt(mid),v=vrd(mid);
  var ttC={},resC={};
  mine.forEach(function(t){if(t.task_type)ttC[t.task_type]=(ttC[t.task_type]||0)+1;if(t.result_category)resC[t.result_category]=(resC[t.result_category]||0)+1;});
  var ed=mine.filter(function(t){return t.edited_at;}).length;
  el('pedit').innerHTML=cu&&cu.isAdmin?'<button class="btn sm" data-edit="'+m.id+'">Edit member</button>':'';
  var h='<div class="profhd"><div class="profav" style="background:'+c.bg+';color:'+c.text+'">'+ini(m.name)+'</div><div><div class="profname">'+m.name+'</div><div class="profrole">'+m.role+'</div><span class="vd '+v.cls+'" style="margin-top:5px;display:inline-block">'+v.label+'</span></div></div>';
  h+='<div class="profstats"><div class="profstat"><div class="klbl">Tasks</div><div class="kval">'+s.total+'</div></div><div class="profstat"><div class="klbl">Completion</div><div class="kval '+(s.rate>=80?'g':s.rate>=50?'a':'r')+'">'+s.rate+'%</div></div><div class="profstat"><div class="klbl">Late</div><div class="kval '+(s.late===0?'g':s.late>=2?'r':'a')+'">'+s.late+'</div></div><div class="profstat"><div class="klbl">vs ETA</div><div class="kval '+(s.avgA&&s.avgE?(s.avgA>s.avgE?'r':'g'):'')+'">'+( s.avgA&&s.avgE?((s.avgA>s.avgE?'+':'')+fm(Math.abs(s.avgA-s.avgE))):'—')+'</div></div><div class="profstat"><div class="klbl">No result</div><div class="kval '+(s.noR>0?'a':'')+'">'+s.noR+'</div></div><div class="profstat"><div class="klbl">Edited</div><div class="kval '+(ed>0?'a':'')+'">'+ed+'</div></div></div>';
  if(ed>0&&cu&&cu.isAdmin)h+='<div style="background:rgba(255,184,48,.06);border:1px solid rgba(255,184,48,.15);border-radius:8px;padding:10px 12px;margin-bottom:14px;font-size:12px;color:var(--amber)">⚠️ '+ed+' task'+(ed>1?'s have':' has')+' been edited after logging.</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px"><div class="icard"><div class="ititle">Task types</div>'+Object.entries(ttC).sort(function(a,b){return b[1]-a[1];}).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span>'+x[1]+'</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">Results</div>'+Object.entries(resC).sort(function(a,b){return b[1]-a[1];}).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span>'+x[1]+'</span></div>';}).join('')+'</div></div>';
  h+='<div style="margin-bottom:9px;font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em">All tasks — '+m.name+'</div>'+tbl(mine);
  el('pcontent').innerHTML=h;
  var eb=el('pedit').querySelector('[data-edit]');if(eb)eb.onclick=function(){openEM(this.dataset.edit);};
  bindDrillActions();
  gp('profile',null);
}

function rOversight(){
  var tod=new Date().toDateString(),todT=tasks.filter(function(t){return new Date(t.logged_at).toDateString()===tod;}),zero=members.filter(function(m){return!todT.some(function(t){return t.member_id===m.id;});}),latM=members.filter(function(m){return mst(m.id).late>0;}),overE=members.filter(function(m){var s=mst(m.id);return s.avgA&&s.avgE&&s.avgA>s.avgE+15;}),stk=tasks.filter(function(t){return t.status==='prog';}),noR=tasks.filter(function(t){return t.result_category==='No result';}),fu=tasks.filter(function(t){return t.result_category==='Needs review'||(t.notes||'').toLowerCase().includes('follow');}),ed=tasks.filter(function(t){return t.edited_at;});
  var mn=function(t){return(members.find(function(x){return x.id===t.member_id;})||{name:'?'}).name;};
  el('ogrid').innerHTML='<div class="ocard"><div class="otitle">Not logged today</div>'+(zero.length?zero.map(function(m){return'<div class="oitem"><span>'+m.name+'</span><span class="oval r">0 tasks</span></div>';}).join(''):'<div class="oitem"><span>Everyone active</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle">Has late tasks</div>'+(latM.length?latM.map(function(m){return'<div class="oitem"><span>'+m.name+'</span><span class="oval r">'+mst(m.id).late+' late</span></div>';}).join(''):'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle">Over avg ETA</div>'+(overE.length?overE.map(function(m){var s=mst(m.id);return'<div class="oitem"><span>'+m.name+'</span><span class="oval a">+'+fm(s.avgA-s.avgE)+'</span></div>';}).join(''):'<div class="oitem"><span>All within ETA</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle">In progress ('+stk.length+')</div>'+(stk.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'Task')+'</span><span class="oval a">Active</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle">Edited ('+ed.length+')</div>'+(ed.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'?')+'</span><span class="oval a">Edited</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle">Follow-up needed ('+fu.length+')</div>'+(fu.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'?')+'</span><span class="oval a">Follow up</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div>';
  el('otasks').innerHTML=tbl(fu.concat(noR).slice(0,20));
  bindDrillActions();
}

function rIntel(){
  var ttS={};tasks.forEach(function(t){if(!t.task_type)return;if(!ttS[t.task_type])ttS[t.task_type]={total:0,done:0,results:0,mins:0,count:0};ttS[t.task_type].total++;if(t.status==='done')ttS[t.task_type].done++;if(t.result_category&&t.result_category!=='No result')ttS[t.task_type].results++;if(t.actual_minutes){ttS[t.task_type].mins+=t.actual_minutes;ttS[t.task_type].count++;}});
  var sorted=Object.entries(ttS).sort(function(a,b){return b[1].results-a[1].results;});
  el('igrid').innerHTML='<div class="icard"><div class="ititle">Completion by member</div>'+members.map(function(m){var s=mst(m.id);return'<div class="irow"><span>'+m.name+'</span><span style="color:'+(s.rate>=80?'var(--accent)':s.rate>=50?'var(--amber)':'var(--red)')+'">'+s.rate+'% ('+s.done+'/'+s.total+')</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">Avg task time</div>'+members.map(function(m){var s=mst(m.id);return'<div class="irow"><span>'+m.name+'</span><span>'+(s.avgA?fm(s.avgA):'No data')+'</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">ETA accuracy</div>'+members.map(function(m){var s=mst(m.id),d=s.avgA&&s.avgE?s.avgA-s.avgE:null;return'<div class="irow"><span>'+m.name+'</span><span style="color:'+(d===null?'var(--text3)':d>0?'var(--red)':'var(--accent)')+'">'+(d===null?'—':(d>0?'+':'')+fm(Math.abs(d)))+'</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">Edit rate</div>'+members.map(function(m){var mine=mt(m.id),ed=mine.filter(function(t){return t.edited_at;}).length,rt=mine.length?Math.round(ed/mine.length*100):0;return'<div class="irow"><span>'+m.name+'</span><span style="color:'+(rt>20?'var(--amber)':'var(--accent)')+'">'+ed+' edited ('+rt+'%)</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">Best result tasks</div>'+sorted.slice(0,6).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span style="color:var(--accent)">'+x[1].results+' results</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">Ready to outsource</div>'+Object.entries(ttS).filter(function(x){return x[1].count>=3&&x[1].mins/x[1].count<90&&x[1].done/x[1].total>=.8;}).slice(0,5).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span style="color:var(--teal)">Ready ✓</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">Needs SOP</div>'+Object.entries(ttS).filter(function(x){return x[1].count>=2&&(x[1].mins/x[1].count>120||x[1].done/x[1].total<.6);}).slice(0,5).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span style="color:var(--amber)">Needs SOP</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">Recurring tasks</div>'+Object.entries(tasks.filter(function(t){return t.is_recurring;}).reduce(function(a,t){a[t.task_type||'Unknown']=(a[t.task_type||'Unknown']||0)+1;return a;},{})).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span style="color:var(--blue)">🔄 '+x[1]+'</span></div>';}).join('')+'</div>';
}

function rRoles(){
  el('rlist').innerHTML=members.map(function(m){
    var c=COLORS[m.color]||COLORS.teal,tags=(m.role_tags||'').split(',').filter(Boolean),desc=m.description||'No description yet.';
    return'<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--rlg);padding:15px;margin-bottom:9px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><div style="display:flex;align-items:center;gap:9px"><div class="av" style="background:'+c.bg+';color:'+c.text+';width:30px;height:30px;font-size:10px;border-radius:7px">'+ini(m.name)+'</div><div><div style="font-size:13px;font-weight:600">'+m.name+'</div><div style="font-size:11px;color:var(--text2)">'+m.role+'</div></div></div>'+(cu&&cu.isAdmin?'<button class="btn sm" data-edit="'+m.id+'">Edit</button>':'')+'</div><div style="font-size:12px;color:var(--text2);line-height:1.7;margin-bottom:7px">'+desc+'</div>'+(tags.length?'<div style="display:flex;flex-wrap:wrap;gap:5px">'+tags.map(function(t){return'<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--bg3);color:var(--text2)">'+t.trim()+'</span>';}).join('')+'</div>':'')+'</div>';
  }).join('');
  qsa('[data-edit]',el('rlist')).forEach(function(btn){var mid=btn.dataset.edit;btn.onclick=function(){openEM(mid);};});
}

// BUBBLE SELECTORS
function bMembers(){
  var show=cu&&cu.isAdmin?members:members.filter(function(m){return m.id===cu.id;});
  el('bm').innerHTML=show.map(function(m){var c=COLORS[m.color]||COLORS.teal,on=sMid===m.id;return'<span class="sb'+(on?' on':'')+'" style="'+(on?'border-color:'+c.text+';color:'+c.text+';background:'+c.bg:'')+'" data-mb="'+m.id+'">'+m.name+'</span>';}).join('');
  qsa('[data-mb]',el('bm')).forEach(function(s){s.onclick=function(){selMb(this.dataset.mb);};});
}
function selMb(id){sMid=id;bMembers();chkETA();}

function bRoles(){
  var RA=getRA();
  el('br').innerHTML=Object.keys(RA).map(function(r){return'<span class="sb'+(sRoles.includes(r)?' on':'')+'" data-br="'+r+'">'+r+'<span class="sbx" data-xr="'+r+'">✕</span></span>';}).join('')+'<button class="add-bub" onclick="el(\'brad\').classList.add(\'show\')">+ Add</button>';
  qsa('[data-br]',el('br')).forEach(function(s){s.onclick=function(e){if(!e.target.dataset.xr)togR(this.dataset.br);};});
  qsa('[data-xr]',el('br')).forEach(function(s){s.onclick=function(e){e.stopPropagation();delRoleM(this.dataset.xr);};});
}
function togR(r){if(sRoles.includes(r))sRoles=sRoles.filter(function(x){return x!==r;});else sRoles.push(r);bRoles();bTTs();}
function delRoleM(r){if(BRA[r]){toast('Built-in roles cannot be removed here','error');return;}delete customRA[r];sRoles=sRoles.filter(function(x){return x!==r;});saveAll();bRoles();bTTs();}

function bTTs(){
  var RA=getRA(),tl=sRoles.length===1?RA[sRoles[0]]||[]:sRoles.length>1?(function(){var s=[];sRoles.forEach(function(r){(RA[r]||[]).forEach(function(t){if(!s.includes(t))s.push(t);});});return s;})():Object.values(RA).reduce(function(a,v){v.forEach(function(t){if(!a.includes(t))a.push(t);});return a;},[]).slice(0,30);
  el('btt').innerHTML=tl.map(function(t){return'<span class="sb'+(sTT===t?' on':'')+'" data-tt="'+t+'">'+t+'<span class="sbx" data-xt="'+t+'">✕</span></span>';}).join('')+'<button class="add-bub" onclick="el(\'bttad\').classList.add(\'show\')">+ Add</button>';
  qsa('[data-tt]',el('btt')).forEach(function(s){s.onclick=function(e){if(!e.target.dataset.xt)selTT(this.dataset.tt);};});
  qsa('[data-xt]',el('btt')).forEach(function(s){s.onclick=function(e){e.stopPropagation();delTTM(this.dataset.xt);};});
}
function selTT(t){sTT=t;bTTs();chkETA();}
function delTTM(t){var role=sRoles[0];if(role&&BRA[role]&&BRA[role].tasks.includes(t)){if(!delBase.tasks[role])delBase.tasks[role]=[];if(!delBase.tasks[role].includes(t))delBase.tasks[role].push(t);}else if(role&&customRA[role]){customRA[role]=customRA[role].filter(function(x){return x!==t;});}if(sTT===t)sTT=null;saveAll();bTTs();toast('"'+t+'" removed');}

function bRCs(){
  var RC=getRC();
  el('brc').innerHTML=RC.map(function(r){return'<span class="sb'+(sRCs.includes(r)?' on':'')+'" data-rc="'+r+'">'+r+'<span class="sbx" data-xrc="'+r+'">✕</span></span>';}).join('')+'<button class="add-bub" onclick="el(\'brcad\').classList.add(\'show\')">+ Add</button>';
  qsa('[data-rc]',el('brc')).forEach(function(s){s.onclick=function(e){if(!e.target.dataset.xrc)togRC(this.dataset.rc);};});
  qsa('[data-xrc]',el('brc')).forEach(function(s){s.onclick=function(e){e.stopPropagation();delRCM(this.dataset.xrc);};});
}
function togRC(r){if(sRCs.includes(r))sRCs=sRCs.filter(function(x){return x!==r;});else sRCs.push(r);bRCs();}
function delRCM(r){if(BRC.includes(r)){if(!delBase.rc.includes(r))delBase.rc.push(r);}else{customRC=customRC.filter(function(x){return x!==r;});}sRCs=sRCs.filter(function(x){return x!==r;});saveAll();bRCs();toast('"'+r+'" removed');}

function addBub(type){
  var ids={role:'bri',tt:'btti',rc:'brci'},wids={role:'brad',tt:'bttad',rc:'brcad'};
  var raw=el(ids[type]).value.trim();if(!raw)return;
  var val=cap(raw);el(ids[type]).value='';el(wids[type]).classList.remove('show');
  if(type==='role'){if(!customRA[val])customRA[val]=[];if(!sRoles.includes(val))sRoles.push(val);saveAll();bRoles();bTTs();}
  else if(type==='tt'){var role=sRoles[0];if(role){if(!customRA[role])customRA[role]=[];if(!customRA[role].includes(val))customRA[role].push(val);}sTT=val;saveAll();bTTs();}
  else if(type==='rc'){if(!customRC.includes(val))customRC.push(val);if(!sRCs.includes(val))sRCs.push(val);saveAll();bRCs();}
  toast('"'+val+'" added');
}

function chkETA(){if(!sTT||!sMid)return;var sim=tasks.filter(function(t){return t.task_type===sTT&&t.actual_minutes&&t.member_id===sMid;});var e=el('etas');if(sim.length>=2){var avg=Math.round(sim.reduce(function(s,t){return s+t.actual_minutes;},0)/sim.length);e.textContent='💡 Typical: '+fm(avg)+' (from '+sim.length+' past logs)';e.classList.add('show');}else e.classList.remove('show');}

function bTimeG(id,vn){el(id).innerHTML=TIMES.map(function(t){return'<button class="tbtn" data-mins="'+t.m+'" data-vn="'+vn+'" data-gid="'+id+'">'+t.l+'</button>';}).join('');qsa('.tbtn',el(id)).forEach(function(btn){btn.onclick=function(){selT(this.dataset.gid,this.dataset.vn,parseInt(this.dataset.mins),this);};});}
function selT(id,v,mins,btn){qsa('#'+id+' .tbtn').forEach(function(b){b.classList.remove('on');});btn.classList.add('on');if(v==='eta')sEta=mins;else sAct=mins;}
function togRec(){isRec=!isRec;el('rtog').classList.toggle('on',isRec);el('recwrap').style.display=isRec?'block':'none';if(!isRec)recFreq=null;}
function setRec(f,btn){recFreq=f;qsa('.rbtn').forEach(function(b){b.classList.remove('on');});btn.classList.add('on');}

// TASK MODAL
function openT(){
  el('tmtitle').textContent='Log task';el('tsave').textContent='Save task';el('teid').value='';el('tname').value='';el('tnotes').value='';el('tstat').value='done';
  sMid=cu&&cu.isAdmin?null:cu.id;sRoles=[];sTT=null;sRCs=[];sEta=null;sAct=null;isRec=false;recFreq=null;
  el('rtog').classList.remove('on');el('recwrap').style.display='none';
  qsa('.rbtn').forEach(function(b){b.classList.remove('on');});
  ['brad','bttad','brcad'].forEach(function(id){el(id).classList.remove('show');});
  bMembers();bRoles();bTTs();bRCs();bTimeG('etag','eta');bTimeG('actg','act');
  el('TM').classList.add('open');
}
function openTFor(mid){sMid=mid;openT();}
function openEditSelf(){openEM(cu.id);}
function closeTM(){el('TM').classList.remove('open');closeDrill();}

function openET(tid){
  var t=tasks.find(function(x){return x.id===tid;});if(!t)return;
  el('tmtitle').textContent='Edit task';el('tsave').textContent='Update task';el('teid').value=tid;
  sMid=t.member_id;sRoles=t.role_area?[t.role_area]:[];sTT=t.task_type||null;
  sRCs=t.result_category?t.result_category.split(',').map(function(s){return s.trim();}).filter(Boolean):[];
  sEta=t.eta_minutes||null;sAct=t.actual_minutes||null;isRec=t.is_recurring||false;recFreq=t.recur_frequency||null;
  el('tname').value=t.name||'';el('tnotes').value=t.notes||'';el('tstat').value=t.status||'done';
  el('rtog').classList.toggle('on',isRec);el('recwrap').style.display=isRec?'block':'none';
  ['brad','bttad','brcad'].forEach(function(id){el(id).classList.remove('show');});
  bMembers();bRoles();bTTs();bRCs();bTimeG('etag','eta');bTimeG('actg','act');
  if(sEta){var eb=Array.from(qsa('#etag .tbtn')).find(function(b){return parseInt(b.dataset.mins)===sEta;});if(eb)eb.classList.add('on');}
  if(sAct){var ab=Array.from(qsa('#actg .tbtn')).find(function(b){return parseInt(b.dataset.mins)===sAct;});if(ab)ab.classList.add('on');}
  if(recFreq)qsa('.rbtn').forEach(function(b){if(b.textContent===recFreq)b.classList.add('on');});
  el('TM').classList.add('open');
}

async function saveT(){
  var eid=el('teid').value;
  if(!sMid){toast('Select a member','error');return;}
  if(!sTT){toast('Select a task type','error');return;}
  var name=el('tname').value.trim(),status=el('tstat').value,notes=el('tnotes').value.trim(),resultStr=sRCs.join(', ');
  var payload={member_id:sMid,name:name||sTT,status:status,role_area:sRoles[0]||null,task_type:sTT,result_category:resultStr||null,notes:notes,eta_minutes:sEta||null,actual_minutes:sAct||null,is_recurring:isRec,recur_frequency:recFreq||null};
  if(eid){
    var orig=tasks.find(function(t){return t.id===eid;});
    if(orig){var fields=['status','role_area','task_type','result_category','eta_minutes','actual_minutes','notes'];for(var i=0;i<fields.length;i++){var f=fields[i];if(String(orig[f]||'')!==String(payload[f]||''))await sb.from('task_history').insert([{task_id:eid,changed_by:cu.id,field_changed:f,old_value:String(orig[f]||''),new_value:String(payload[f]||'')}]);}}
    payload.edited_at=new Date().toISOString();payload.edited_by=cu.id;
    var r=await sb.from('tasks').update(payload).eq('id',eid);if(r.error){toast('Error updating','error');return;}toast('Task updated ✓');
  }else{
    var r=await sb.from('tasks').insert([payload]);if(r.error){toast('Error saving','error');return;}toast('Task logged ✓');
  }
  closeTM();await load();
}

function delT(tid,btn){
  if(btn.textContent==='Del'||btn.textContent==='Delete'){btn.textContent='Sure?';setTimeout(function(){if(btn.textContent==='Sure?')btn.textContent='Del';},3000);return;}
  (async function(){await sb.from('tasks').delete().eq('id',tid);closeDrill();el('dd').classList.remove('open');toast('Task deleted');await load();})();
}

// MEMBER MODAL
function openM(){el('mmtitle').textContent='Add team member';el('meid').value='';el('mdel').style.display='none';['mname','mrole','mtags','mdesc','mpin'].forEach(function(id){el(id).value='';});el('madmin').value='false';el('mcolor').value='teal';el('MM').classList.add('open');}
function openEM(mid){var m=members.find(function(x){return x.id===mid;});if(!m)return;el('mmtitle').textContent='Edit member';el('meid').value=mid;el('mdel').style.display='flex';el('mname').value=m.name||'';el('mrole').value=m.role||'';el('mtags').value=m.role_tags||'';el('mdesc').value=m.description||'';el('mpin').value=m.pin||'';el('madmin').value=m.is_admin?'true':'false';el('mcolor').value=m.color||'teal';el('MM').classList.add('open');}
function closeMM(){el('MM').classList.remove('open');}

async function saveM(){
  var eid=el('meid').value,name=el('mname').value.trim(),role=el('mrole').value.trim(),description=el('mdesc').value.trim(),color=el('mcolor').value,role_tags=el('mtags').value.trim(),pin=el('mpin').value.trim(),is_admin=el('madmin').value==='true';
  if(!name||!role){toast('Name and role required','error');return;}
  var payload={name:name,role:role,description:description,color:color,role_tags:role_tags,pin:pin,is_admin:is_admin};
  var r=eid?await sb.from('members').update(payload).eq('id',eid):await sb.from('members').insert([payload]);
  if(r.error){toast('Error saving','error');return;}
  closeMM();toast(eid?name+' updated ✓':name+' added ✓');
  if(eid&&cu&&cu.id===eid){cu.color=color;var c=COLORS[color]||COLORS.teal;el('uav').style.background=c.bg;el('uav').style.color=c.text;}
  await load();
}

function delM(){
  var eid=el('meid').value;if(!eid)return;
  var btn=el('mdel');
  if(btn.textContent==='Delete'){btn.textContent='Confirm?';setTimeout(function(){if(btn.textContent==='Confirm?')btn.textContent='Delete';},3000);return;}
  (async function(){await sb.from('tasks').delete().eq('member_id',eid);var r=await sb.from('members').delete().eq('id',eid);if(r.error){toast('Error','error');return;}closeMM();toast('Member deleted');await load();})();
}

function gp(page,btn){
  qsa('.page').forEach(function(p){p.classList.remove('active');});
  qsa('.ni').forEach(function(b){b.classList.remove('active');});
  el('page-'+page).classList.add('active');
  if(btn)btn.classList.add('active');
  if(page==='calendar')renderCal();
  if(page==='performance')rCharts();
  if(page==='oversight')rOversight();
  if(page==='intelligence')rIntel();
  if(page==='library')rLib();
  if(page==='roles')rRoles();
}

function toast(msg,type){type=type||'success';var t=el('toast');t.textContent=msg;t.className='toast '+type+' show';setTimeout(function(){t.className='toast';},2600);}

// MODAL CLOSE ON BACKDROP
['TM','MM','ECM','CPM'].forEach(function(id){el(id).addEventListener('click',function(e){if(e.target===el(id))el(id).classList.remove('open');});});
el('DD').addEventListener('click',function(e){if(e.target===el('DD'))closeDrill();});
el('dd').querySelector('button').addEventListener('click',function(){el('dd').classList.remove('open');});

// REALTIME
sb.channel('kpi').on('postgres_changes',{event:'*',schema:'public',table:'tasks'},function(){load();}).on('postgres_changes',{event:'*',schema:'public',table:'members'},function(){load();}).on('postgres_changes',{event:'*',schema:'public',table:'task_history'},function(){load();}).subscribe();

initLogin();
