const SBU='https://wqtenvjtuxvdoaechyjh.supabase.co',SBK='sb_publishable_3llEE8WVT0thYygn-HRu6g_Ks2ePuLD';
var sb=null;
try{
  if(typeof supabase==='undefined')throw new Error('Supabase JS library did not load — check index.html script tags');
  sb=supabase.createClient(SBU,SBK);
  console.log('[4KPI] Supabase client initialized',SBU);
}catch(e){
  console.error('[4KPI] Supabase init FAILED:',e);
}
function logKPI(stage,extra){
  var info={members:members.length,tasks:tasks.length,hist:hist.length,user:cu?cu.name:null};
  if(extra)Object.keys(extra).forEach(function(k){info[k]=extra[k];});
  console.log('[4KPI]',stage,info);
}
function sbErr(label,r){
  if(!r||!r.error)return null;
  console.error('[4KPI]',label,r.error.message||r.error,r.status,r.statusText);
  return r.error;
}
const COLORS={purple:{bg:'rgba(167,139,250,.15)',text:'#a78bfa'},teal:{bg:'rgba(52,211,153,.15)',text:'#34d399'},coral:{bg:'rgba(251,113,133,.15)',text:'#fb7185'},blue:{bg:'rgba(91,156,246,.15)',text:'#5b9cf6'},amber:{bg:'rgba(255,184,48,.15)',text:'#ffb830'},neongreen:{bg:'rgba(57,255,20,.15)',text:'#39ff14'},gold:{bg:'rgba(255,215,0,.15)',text:'#ffd700'},violet:{bg:'rgba(238,130,238,.15)',text:'#ee82ee'},cyan:{bg:'rgba(0,255,255,.15)',text:'#00ffff'},red:{bg:'rgba(255,60,60,.15)',text:'#ff4444'},lime:{bg:'rgba(50,205,50,.15)',text:'#32cd32'},midnight:{bg:'rgba(100,120,200,.15)',text:'#8899dd'},rose:{bg:'rgba(255,100,150,.15)',text:'#ff6496'},orange:{bg:'rgba(255,150,50,.15)',text:'#ff9632'},sky:{bg:'rgba(100,200,255,.15)',text:'#64c8ff'}};

const HELP={
  dashboard:'Your home base — like the scoreboard at a basketball game. Everything the team has logged shows up here so you can see at a glance how the agency is doing today.',
  pulse:'The agency pulse is like a fitness tracker for the whole team. The green ring fills up as more tasks get marked done — think of it as a gas tank for productivity.',
  pulse_pct:'This percentage is how many logged tasks are finished. If you logged 10 tasks and 8 are done, that\'s 80%. Higher is better — it means stuff is actually getting completed, not just started.',
  streak:'The streak counts how many days in a row someone on the team logged at least one task. It\'s like a Snapchat streak but for work — keep it alive by logging something every day!',
  kpis:'These cards are quick score counters — like points on a leaderboard. Tap any card (except Team size) to see the actual tasks behind the number.',
  kpi_logged:'Every task anyone on the team has ever logged, all added together. Think of it like counting every lap run at practice — more laps means more effort tracked.',
  kpi_completed:'Tasks marked as "Done." This is your finished homework pile. The percentage below shows what share of all logged tasks are actually complete.',
  kpi_late:'Tasks that were missed or finished late — like homework turned in after the deadline. Keep this number low; red means it needs attention.',
  kpi_results:'Tasks where something actually happened — a DM sent, a lead found, a call booked. These are real outcomes, not just busywork.',
  kpi_team:'How many people are on the team right now. Simple headcount — like counting players on a roster.',
  insights:'Live insights are like a coach shouting tips from the sideline. They pop up automatically when something needs attention or when someone is crushing it.',
  team:'Your team roster — team members only see other team members here, not admins. Click anyone to see their profile. Search to find someone by name.',
  calendar:'A month-view calendar of who did what and when. Click any day to open a detailed list. The colored dots are like sticky notes showing tasks on that date.',
  cal_filter:'Filter the calendar to only show tasks from one person — like zooming in on one player\'s stats instead of the whole team.',
  cal_summary:'A quick recap of the whole month — total tasks, how many finished, how many late, and the overall completion rate.',
  performance:'Charts that turn your task data into pictures — like report cards with graphs. Click any chart to see the full list of tasks behind it.',
  chart_completion:'Shows each person\'s completion rate as a bar. Taller green bars = more tasks finished. It\'s like comparing test scores across the class.',
  chart_time:'Compares how long tasks actually took (blue) vs how long people estimated (purple). If blue is taller, they took longer than expected — like thinking a drive is 10 minutes but it takes 20.',
  chart_status:'A donut chart splitting all tasks into Done, In progress, Pending, and Late. Think of it as sorting your laundry into clean, dirty, in the washer, and lost-sock piles.',
  chart_late:'Shows how many late tasks each person has. Red bars = missed deadlines. Like a tardy count in school — you want zeros.',
  chart_results:'Breaks down what kinds of results the team is producing — DMs sent, leads found, etc. Shows which outcomes happen most often.',
  chart_trend:'A line graph of how many tasks were logged each day over the last 2 weeks. Spikes mean busy days; flat lines mean quiet days.',
  oversight:'A "needs help right now" dashboard for admins. Like a teacher\'s desk with all the papers that need grading or follow-up.',
  os_notlogged:'People who haven\'t logged any tasks today. Like teammates who haven\'t shown up to practice yet.',
  os_late:'People who currently have tasks marked as late or missed. These need attention before they pile up.',
  os_overeta:'People who consistently take longer than they estimated. Like someone who always says "5 minutes" but takes 30.',
  os_inprogress:'Tasks currently marked "In progress" — started but not finished. Like open browser tabs you haven\'t closed yet.',
  os_edited:'Tasks that were changed after being logged. Could mean someone corrected a mistake or updated info.',
  os_followup:'Tasks flagged as needing a follow-up or review. Like sticky notes that say "call this person back."',
  intelligence:'Smart math about how the team works — who\'s fastest, which tasks get results, and what might need a written playbook (SOP).',
  intel_completion:'Each person\'s completion rate side by side. Who finishes what they start vs who leaves things hanging.',
  intel_avgtime:'Average time each person spends on tasks. Helps spot who works fast vs who takes their time.',
  intel_eta:'How accurate people\'s time estimates are. Positive = takes longer than expected; negative = finishes faster. Like guessing how long homework takes.',
  intel_editrate:'How often each person edits tasks after logging. High edit rate might mean rushing or making mistakes the first time.',
  intel_bestresults:'Which task types produce the most real results. Like figuring out which fishing spot catches the most fish.',
  intel_outsource:'Tasks that are done fast, done well, and done often — ready to hand off to someone else. Like a recipe you\'ve mastered.',
  intel_sop:'Tasks that take too long or fail too often — they need a written step-by-step guide (SOP) so anyone can do them.',
  intel_recurring:'Tasks set to repeat on a schedule. Shows which repeating jobs the team runs most.',
  library:'The menu of job types your team can do. Tap any bubble to log that task instantly — like speed-dial for common work.',
  roles:'Job descriptions for each person — who does what on the team. Search by name and drag to reorder how they appear.',
  assign:'Who this task is for. Tap one or more people. Team members can assign to other team members; admins can pick anyone.',
  tasktype:'What kind of work it was. Pick one or more types if the task covered multiple things — like tagging a photo with multiple labels.',
  results:'What happened because of the task — "DM sent," "Lead found," etc. Pick all that apply, like checking boxes on a checklist.',
  profile:'One person\'s full stats page. Use the time buttons to zoom in — today, last week, last month, or everything ever.',
  compare:'See who\'s winning the completion game. The leaderboard ranks everyone; 1v1 puts you head-to-head against one person.',
  cmp_leaderboard:'Everyone ranked by completion rate — like a high score table at an arcade. Green = 80%+, yellow = 50%+, red = below 50%.',
  cmp_1v1:'Pick yourself and an opponent to compare stats side by side. Toggle "Personality text" for fun commentary on who\'s winning.',
  cmp_humor:'Funny commentary that reacts to how the comparison is going — winning, losing, close match, etc. Works for everyone, not just admins!',
  login:'Pick your name, then enter your PIN. Admins: tap the gear to drag names into the order you want on this screen.',
  feedback:'Rate the app 1–5 stars and leave a comment. Your feedback helps us make 4everKPI better for everyone.',
  rolenotes:'Shared notes for this role category. Write meeting notes, conversation summaries, reminders — anything the team needs to remember. Everyone can read and edit.',
  results:'Your wins board — log results you got (DM sent, lead found, call booked) and upload screenshots or files as proof. Like a trophy case for the team.'
};
const FL={status:'Status',role_area:'Role area',task_type:'Task type',result_category:'Result',eta_minutes:'ETA',actual_minutes:'Actual time',notes:'Notes',member_id:'Assigned to',name:'Description'};
function hBtn(key){return'<span class="help-wrap"><button type="button" class="help-btn" onclick="toggleHelp(event,this)" aria-label="Help">?</button><span class="help-tip">'+(HELP[key]||'')+'</span></span>';}
function hLbl(text,key){return text+'<span class="help-end">'+hBtn(key)+'</span>';}
function toggleHelp(e,btn){
  e.stopPropagation();
  var w=btn.parentElement,tip=w.querySelector('.help-tip'),floater=el('helpFloat');
  var wasOpen=w.classList.contains('open');
  document.querySelectorAll('.help-wrap.open').forEach(function(x){x.classList.remove('open');});
  qsa('.help-btn.open').forEach(function(x){x.classList.remove('open');});
  if(floater){floater.classList.remove('show');floater.innerHTML='';}
  if(wasOpen)return;
  w.classList.add('open');btn.classList.add('open');
  if(!tip||!floater)return;
  floater.innerHTML=tip.innerHTML;
  floater.classList.add('show');
  var rect=btn.getBoundingClientRect(),fw=floater.offsetWidth||300,fh=floater.offsetHeight||80;
  var left=Math.min(Math.max(12,rect.left+rect.width/2-fw/2),window.innerWidth-fw-12);
  var top=rect.bottom+8;
  if(top+fh>window.innerHeight-12)top=Math.max(12,rect.top-fh-8);
  floater.style.left=left+'px';floater.style.top=top+'px';
}
document.addEventListener('click',function(e){
  if(!e.target.closest('.help-wrap')&&!e.target.closest('#helpFloat')){
    document.querySelectorAll('.help-wrap.open').forEach(function(x){x.classList.remove('open');});
    qsa('.help-btn.open').forEach(function(x){x.classList.remove('open');});
    var f=el('helpFloat');if(f){f.classList.remove('show');f.innerHTML='';}
  }
});
function getTeamVisible(){if(cu&&cu.isAdmin)return members;return members.filter(function(m){return!m.is_admin;});}
function toggleSidebar(){
  var sb=el('sidebar'),btn=el('sbToggle');
  if(!sb)return;
  sb.classList.toggle('collapsed');
  var c=sb.classList.contains('collapsed');
  lss('4k_sb',c);
  if(btn){btn.title=c?'Expand sidebar':'Collapse sidebar';btn.setAttribute('aria-label',c?'Expand sidebar':'Collapse sidebar');}
}
function initSidebar(){
  var sb=el('sidebar'),btn=el('sbToggle');
  if(ls('4k_sb')&&sb)sb.classList.add('collapsed');
  if(btn&&sb&&sb.classList.contains('collapsed')){btn.title='Expand sidebar';btn.setAttribute('aria-label','Expand sidebar');}
  setupFileDrop();
}
function fillHelpSlots(){qsa('.help-slot[data-help]').forEach(function(slot){if(slot.querySelector('.help-wrap'))return;slot.innerHTML=hBtn(slot.dataset.help);});}
function roleExists(name,skipKey){var n=name.trim().toLowerCase();if(!n)return true;var keys=Object.keys(BRA).concat(Object.keys(customRA));for(var i=0;i<keys.length;i++){if(skipKey&&keys[i]===skipKey)continue;if(keys[i].toLowerCase()===n)return true;var info=catMeta[keys[i]];if(info&&info.name&&info.name.toLowerCase()===n)return true;}return false;}
function getMC(m){if(!m)return COLORS.teal;var col=m.color||'teal';if(col.charAt(0)==='#')return{bg:col+'26',text:col};return COLORS[col]||COLORS.teal;}
function renderSwatches(gridId,hiddenId,cur){var g=el(gridId),h=el(hiddenId);if(!g)return;g.innerHTML=PAL.map(function(c){return'<div class="csw'+(cur===c.h?' picked':'')+'" style="background:'+c.h+'" data-hex="'+c.h+'" title="'+c.n+'"></div>';}).join('');qsa('.csw',g).forEach(function(sw){sw.onclick=function(){h.value=this.dataset.hex;qsa('.csw',g).forEach(function(x){x.classList.remove('picked');});this.classList.add('picked');};});}
function sortByOrder(list,orderKey){var order=orderKey==='login'?loginOrder:rolesOrder;if(!order||!order.length)return list.slice();return list.slice().sort(function(a,b){var ia=order.indexOf(a.id),ib=order.indexOf(b.id);if(ia<0)ia=999;if(ib<0)ib=999;return ia-ib;});}
function getAssignable(){if(cu&&cu.isAdmin)return members;return members.filter(function(m){return!m.is_admin;});}
function canEditTask(t){if(!cu||!t)return false;return cu.isAdmin||t.member_id===cu.id;}
function canDelTask(t){return cu&&cu.isAdmin;}
function taskActions(t){var h='';if(canEditTask(t))h+='<button class="btn sm" data-et="'+t.id+'">Edit</button>';if(canDelTask(t))h+='<button class="btn sm danger" data-dt="'+t.id+'">Del</button>';return h?'<div style="display:flex;gap:4px">'+h+'</div>':'';}
function taskTypesStr(){return sTTs.length?sTTs.join(', '):'';}
function parseTT(s){if(!s)return[];return s.split(',').map(function(x){return x.trim();}).filter(Boolean);}
function filterByPeriod(list,period){if(period==='all')return list;var now=new Date(),cut=new Date();if(period==='today'){return list.filter(function(t){return new Date(t.logged_at).toDateString()===now.toDateString();});}if(period==='7d'){cut.setDate(cut.getDate()-7);}else if(period==='30d'){cut.setDate(cut.getDate()-30);}return list.filter(function(t){return new Date(t.logged_at)>=cut;});}
function fmtField(f,v){if(f==='eta_minutes'||f==='actual_minutes')return fm(parseInt(v,10)||0);if(f==='status'){var m={done:'Done',prog:'In progress',nostart:'Not started yet',pending:'Pending',late:'Late'};return m[v]||v;}return v||'—';}
function taskCardHist(tid){var h=getTH(tid);if(!h.length)return'';return'<div class="hist-inline"><div class="hist-inline-title">✏️ Edit history</div>'+h.map(function(x){var c=members.find(function(m){return m.id===x.changed_by;});var fn=FL[x.field_changed]||x.field_changed;return'<div class="hist-change"><strong>'+(c?c.name:'Someone')+'</strong> changed <strong>'+fn+'</strong> from "'+fmtField(x.field_changed,x.old_value)+'" to "'+fmtField(x.field_changed,x.new_value)+'"<div class="hist-meta">'+fmtDT(x.changed_at||x.created_at)+'</div></div>';}).join('')+'</div>';}
function renderTaskLine(t){var types=parseTT(t.task_type);var typeLbl=types.length?types.join(' · '):(t.name||'—');return'<div class="ti"><div class="tr1"><span class="tn">'+typeLbl+(t.edited_at?'<span class="ebadge">edited</span>':'')+(t.is_recurring?'<span class="rbadge">🔄 '+t.recur_frequency+'</span>':'')+'</span>'+stag(t.status)+'</div><div class="tm">'+(t.role_area||'')+' '+(t.result_category?'· '+t.result_category:'')+'</div>'+ebar(t.eta_minutes,t.actual_minutes)+(t.edited_at?taskCardHist(t.id):'')+'</div>';}

const PAL=[{n:'Neon Green',h:'#7fff6e'},{n:'Electric Blue',h:'#5b9cf6'},{n:'Purple',h:'#a78bfa'},{n:'Hot Pink',h:'#fb7185'},{n:'Teal',h:'#34d399'},{n:'Amber',h:'#ffb830'},{n:'Cyan',h:'#00ffff'},{n:'Gold',h:'#ffd700'},{n:'Lime',h:'#32cd32'},{n:'Orange',h:'#ff9632'},{n:'Red',h:'#ff4444'},{n:'Sky Blue',h:'#64c8ff'},{n:'Violet',h:'#ee82ee'},{n:'Rose',h:'#ff6496'},{n:'Coral',h:'#ff7f50'},{n:'Mint',h:'#98ff98'},{n:'Lavender',h:'#b57bee'},{n:'Peach',h:'#ffb347'},{n:'Steel',h:'#8899dd'},{n:'Ruby',h:'#e0115f'},{n:'Turquoise',h:'#40e0d0'},{n:'Magenta',h:'#ff00ff'},{n:'Indigo',h:'#6366f1'},{n:'Emerald',h:'#10b981'}];

function ls(k){try{var v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}}
function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function parseDT(s){
  if(!s)return null;
  if(s instanceof Date)return isNaN(s)?null:s;
  var str=String(s).trim();if(!str)return null;
  if(str.indexOf('T')===-1&&str.indexOf(' ')!==-1)str=str.replace(' ','T');
  if(!/[zZ]|[+-]\d{2}:\d{2}$/.test(str))str+='Z';
  var d=new Date(str);return isNaN(d)?null:d;
}
function fmtDT(s){
  var d=parseDT(s);if(!d)return'—';
  return d.toLocaleString(undefined,{month:'numeric',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
}
function nowISO(){return new Date().toISOString();}

var RCOLS=ls('4k_rc')||{},customRA=ls('4k_cra')||{},delBase=ls('4k_del')||{tasks:{},rc:[],rcByRole:{}},customRC=ls('4k_crc')||[],customRCByRole=ls('4k_crcr')||{},catMeta=ls('4k_cm')||{},catOrder=ls('4k_co')||null,loginOrder=ls('4k_lo')||null,rolesOrder=ls('4k_ro')||null,memberNavAccess=ls('4k_mna')||{};

var NAV_TAB_DEFS=[
  {id:'dashboard',label:'Dashboard'},{id:'calendar',label:'Calendar'},{id:'performance',label:'Performance'},{id:'compare',label:'Compare'},
  {id:'oversight',label:'Oversight',adminDefault:false},{id:'intelligence',label:'Intelligence',adminDefault:false},
  {id:'log_task',label:'Log task'},{id:'library',label:'Task library'},{id:'results',label:'Results'},{id:'trash',label:'Trash'},
  {id:'add_member',label:'Add member',adminDefault:false},{id:'roles',label:'Role guides'}
];
var DEFAULT_MEMBER_NAV={dashboard:true,calendar:true,performance:true,compare:true,oversight:false,intelligence:false,log_task:true,library:true,results:true,trash:true,add_member:false,roles:true};

function saveAll(){lss('4k_rc',RCOLS);lss('4k_cra',customRA);lss('4k_del',delBase);lss('4k_crc',customRC);lss('4k_crcr',customRCByRole);lss('4k_cm',catMeta);lss('4k_co',catOrder);lss('4k_lo',loginOrder);lss('4k_ro',rolesOrder);lss('4k_mna',memberNavAccess);saveSettings();}

async function saveSettings(){
  if(!sb)return;
  try{
    var data={rcols:RCOLS,cra:customRA,del:delBase,crc:customRC,crcr:customRCByRole,cm:catMeta,co:catOrder,lo:loginOrder,ro:rolesOrder,mna:memberNavAccess};
    await sb.from('settings').upsert([{key:'agency_prefs',value:data,updated_at:nowISO()}]);
  }catch(e){console.log('saveSettings err',e);}
}

async function loadSettings(){
  if(!sb)return;
  try{
    var r=await sb.from('settings').select('value').eq('key','agency_prefs').single();
    if(r.error&&r.error.code!=='PGRST116')sbErr('settings',r);
    if(r.data&&r.data.value){
      var v=r.data.value;
      RCOLS=v.rcols||{};customRA=v.cra||{};delBase=v.del||{tasks:{},rc:[],rcByRole:{}};if(!delBase.rcByRole)delBase.rcByRole={};customRC=v.crc||[];customRCByRole=v.crcr||{};catMeta=v.cm||{};catOrder=v.co||null;loginOrder=v.lo||null;rolesOrder=v.ro||null;
      if(v.mna&&typeof v.mna==='object'){memberNavAccess=v.mna;lss('4k_mna',memberNavAccess);}
    }
  }catch(e){console.error('[4KPI] loadSettings failed',e);}
}
function getNavAccess(mid){
  var m=members.find(function(x){return x.id===mid;});
  if(m&&m.is_admin)return NAV_TAB_DEFS.reduce(function(a,t){a[t.id]=true;return a;},{});
  var base=Object.assign({},DEFAULT_MEMBER_NAV);
  var custom=(mid&&memberNavAccess[mid])?memberNavAccess[mid]:null;
  if(custom&&typeof custom==='object'){
    NAV_TAB_DEFS.forEach(function(t){
      if(Object.prototype.hasOwnProperty.call(custom,t.id))base[t.id]=!!custom[t.id];
    });
  }
  return base;
}
function syncUserRole(){
  var isAdmin=!!(cu&&cu.isAdmin);
  document.body.classList.toggle('is-admin',isAdmin);
  qsa('[data-admin-only]').forEach(function(node){node.hidden=!isAdmin;});
}
function applyNavAccess(){
  if(!cu)return;
  syncUserRole();
  var access=getNavAccess(cu.id);
  qsa('[data-nav]').forEach(function(node){
    var key=node.dataset.nav;
    var show=access[key]!==false;
    node.hidden=!show;
    node.style.display=show?'':'none';
  });
  qsa('[data-require-nav]').forEach(function(node){
    var key=node.dataset.requireNav;
    var show=access[key]!==false;
    node.hidden=!show;
    node.style.display=show?'':'none';
  });
  var sidebar=el('sidebar');
  if(sidebar){
    qsa('.sb-section',sidebar).forEach(function(sec){
      var items=Array.from(qsa('[data-nav]',sec));
      var any=items.some(function(n){return!n.hidden&&n.style.display!=='none';});
      sec.style.display=any?'':'none';
    });
    var trashWrap=sidebar.querySelector('.sb-trash');
    if(trashWrap){
      var trashOn=access.trash!==false;
      var wipeOn=!!(cu&&cu.isAdmin);
      trashWrap.style.display=trashOn||wipeOn?'':'none';
    }
  }
}
function bindBubble(node,onTap,ignoreSel){
  node.addEventListener('click',function(e){
    if(ignoreSel&&e.target.closest(ignoreSel))return;
    e.preventDefault();
    e.stopPropagation();
    onTap.call(node,e);
  });
}
function bindBubbleX(node,onTap){
  node.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    onTap.call(node,e);
  });
}
function syncMAccessSec(){
  var sec=el('mAccessSec');if(!sec)return;
  var show=cu&&cu.isAdmin&&el('madmin').value!=='true';
  sec.style.display=show?'block':'none';
  if(show)renderMemberNavAccess(el('meid').value||'');
}
function renderMemberNavAccess(mid){
  var box=el('mNavAccess');if(!box)return;
  var access=getNavAccess(mid);
  box.innerHTML=NAV_TAB_DEFS.map(function(t){
    return'<label class="nav-access-item"><input type="checkbox" data-navkey="'+t.id+'"'+(access[t.id]!==false?' checked':'')+'><span class="nav-access-lbl">'+t.label+'</span></label>';
  }).join('');
}
function readMemberNavAccess(mid){
  var access={};
  NAV_TAB_DEFS.forEach(function(t){access[t.id]=DEFAULT_MEMBER_NAV[t.id]!==false;});
  qsa('[data-navkey]',el('mNavAccess')).forEach(function(inp){access[inp.dataset.navkey]=inp.checked;});
  memberNavAccess[mid]=access;
  saveAll();
  logKPI('nav access saved for '+mid,{access:access});
}
function toggleMobileNav(){
  var sb=el('sidebar'),bd=el('sbBackdrop');
  if(!sb)return;
  sb.classList.toggle('mobile-open');
  if(bd)bd.classList.toggle('show',sb.classList.contains('mobile-open'));
}
function closeMobileNav(){
  var sb=el('sidebar'),bd=el('sbBackdrop');
  if(sb)sb.classList.remove('mobile-open');
  if(bd)bd.classList.remove('show');
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
const BRR={
  'Lead Searching':['Lead found','Qualified lead','DM sent','Reply received','Positive reply','Call booked','Follow-up completed','No result','Needs review'],
  'Networking':['Partner found','Call booked','Positive reply','Reply received','DM sent','Follow-up completed','No result','Needs review'],
  'Twitter/Social Growth':['Post made','Impressions gained','Followers gained','DM sent','Reply received','No result','Needs review'],
  'Chaturbate':['Lead found','Qualified lead','Model recruited','DM sent','Reply received','Call booked','No result','Needs review'],
  'Reddit':['Post made','Impressions gained','Followers gained','Reply received','Lead found','No result','Needs review'],
  'Chatters':['DM sent','Reply received','Positive reply','Call booked','Follow-up completed','No result','Needs review'],
  'Model Management':['Model recruited','Call booked','Follow-up completed','No result','Needs review'],
  'Systems/SOPs':['SOP created','SOP updated','Bottleneck found','Script tested','No result','Needs review'],
  'PA/Oversight':['Bottleneck found','Needs review','Follow-up completed','No result'],
  'General Admin':['Needs review','Follow-up completed','SOP created','No result']
};

function getOrder(){var base=Object.keys(BRA);if(!catOrder)return base;var extra=Object.keys(customRA).filter(function(r){return!base.includes(r)&&!catOrder.includes(r);});return catOrder.filter(function(r){return base.includes(r)||customRA[r];}).concat(extra);}
function getRA(){var order=getOrder(),res={};order.forEach(function(role){var bd=BRA[role],bt=bd?bd.tasks.filter(function(t){return!(delBase.tasks[role]||[]).includes(t);}):[];var ct=customRA[role]||[];res[role]=bt.concat(ct);});Object.keys(customRA).forEach(function(r){if(!res[r])res[r]=customRA[r]||[];});return res;}
function getRC(){return BRC.filter(function(r){return!delBase.rc.includes(r);}).concat(customRC.filter(function(r){return!BRC.includes(r);}));}
function parseMemberRoles(m){
  if(!m)return[];
  var all=Object.keys(BRA).concat(Object.keys(customRA)),roles=[],seen={};
  function add(role){if(role&&!seen[role]){seen[role]=true;roles.push(role);}}
  (m.role_tags||'').split(',').forEach(function(tag){
    tag=tag.trim();if(!tag)return;
    var match=all.find(function(r){return r.toLowerCase()===tag.toLowerCase();});
    if(match)add(match);
  });
  if(m.role){
    var rm=all.find(function(r){return r.toLowerCase()===m.role.toLowerCase();});
    if(rm){roles=roles.filter(function(x){return x!==rm;});roles.unshift(rm);}
  }
  return roles;
}
function getContextRoles(){
  if(sRoles.length)return sRoles.slice();
  if(sMids.length===1){var m=members.find(function(x){return x.id===sMids[0];});if(m)return parseMemberRoles(m);}
  if(cu){var me=members.find(function(x){return x.id===cu.id;});if(me)return parseMemberRoles(me);}
  return[];
}
function getRCForRoles(roles){
  if(!roles||!roles.length)return getRC();
  if(!delBase.rcByRole)delBase.rcByRole={};
  var out=[],seen={};
  roles.forEach(function(role){
    var base=BRR[role]||BRC;
    var deleted=(delBase.rcByRole[role]||[]).concat(delBase.rc||[]);
    var custom=customRCByRole[role]||[];
    base.filter(function(r){return!deleted.includes(r);}).concat(custom.filter(function(r){return!deleted.includes(r);})).forEach(function(r){
      if(!seen[r]){seen[r]=true;out.push(r);}
    });
  });
  customRC.filter(function(r){return!BRC.includes(r)&&!out.includes(r);}).forEach(function(r){out.push(r);});
  return out.length?out:getRC();
}
function addCustomRC(val,roles){
  if(!roles||!roles.length){if(!customRC.includes(val))customRC.push(val);return;}
  roles.forEach(function(role){
    if(!customRCByRole[role])customRCByRole[role]=[];
    if(!customRCByRole[role].includes(val))customRCByRole[role].push(val);
  });
}
function removeRC(val,roles){
  if(!delBase.rcByRole)delBase.rcByRole={};
  var primary=roles&&roles.length?roles[0]:null;
  if(primary&&BRR[primary]&&BRR[primary].includes(val)){
    if(!delBase.rcByRole[primary])delBase.rcByRole[primary]=[];
    if(!delBase.rcByRole[primary].includes(val))delBase.rcByRole[primary].push(val);
  }else if(BRC.includes(val)){
    if(!delBase.rc.includes(val))delBase.rc.push(val);
  }else{
    if(roles&&roles.length)roles.forEach(function(role){
      if(customRCByRole[role])customRCByRole[role]=customRCByRole[role].filter(function(x){return x!==val;});
    });
    customRC=customRC.filter(function(x){return x!==val;});
  }
}
function getCatInfo(role){var ov=catMeta[role]||{},b=BRA[role]||{};return{icon:ov.icon||b.icon||'📌',desc:ov.desc||b.desc||'',name:ov.name||role};}
function getRCol(r){return RCOLS[r]||'#888';}

const TIMES=[{l:'15m',m:15},{l:'30m',m:30},{l:'45m',m:45},{l:'1h',m:60},{l:'1h 15m',m:75},{l:'1h 30m',m:90},{l:'1h 45m',m:105},{l:'2h',m:120},{l:'2h 30m',m:150},{l:'3h',m:180},{l:'4h',m:240},{l:'5h+',m:300}];
const QT=['The agency moves when the team moves.','Consistency beats motivation every time.','What gets measured gets managed.','Every logged task builds a better system.','Data does not lie. Log everything.','Small daily wins compound into agencies.','Accountability is the foundation of growth.'];

var members=[],tasks=[],hist=[],charts={},cu=null,calDate=new Date();
var sMids=[],sRoles=[],sTTs=[],sRCs=[],sEta=null,sAct=null,selPin=null,isRec=false,recFreq=null;
var pickRole=null,editCat=null,editCatNew=false,curDayT=[],dragCat=null,dms=null,loginEditMode=false,profileFilter='all',profileMid=null,dragLoginId=null,dragRoleId=null;
var cmpMeId=null,cmpThemId=null,humorOff=ls('4k_humor')===true,humorLastPair=null,fbRating=0,curNoteRole=null,roleNotesCache={},feedbackList=[],resultPosts=[],pendingResultFiles=[],keptResultFiles=[],sResultType=null,editingResultId=null,resultBusy=false,trashItems=[];
const HUMOR={
  losing_badly:['lock in 💀','buddy you getting cooked rn 💀','this ain\'t it chief 😭','they running laps around you fr','go touch grass then come back'],
  winning:['you think you doing something don\'t you? 😂','okay okay we see you 👀','main character energy right there 🔥','you ate that and left no crumbs','don\'t get too comfy up there 😂'],
  both_bad:['yall are both unworthy lmao 😭💀','two NPCs fighting over last place 💀','neither of yall clocked in huh 😭','the bar was on the floor and you both tripped','embarrassing for both of you honestly'],
  both_great:['two giants going at it fr 🔥','elite vs elite — cinema 🍿','yall making everyone else look bad 😤','this is what peak performance looks like','CEO vs CEO energy'],
  close_match:['it\'s giving photo finish 👀','too close to call — run it back','neck and neck like it\'s a race fr','one task could flip the whole thing','this rivalry is personal 😂'],
  you_no_data:['bro hasn\'t even showed up yet 💀','you log zero tasks and want to compare? bold 💀','can\'t compare air to stats 😭','show up first then talk'],
  opponent_no_data:['they ghosting the scoreboard 💀','opponent MIA — free win technically','hard to compare when they\'re on vacation 😂','you vs nobody — easy dub'],
  slight_win:['you edging them but don\'t celebrate yet 👀','small lead — stay locked in','you up but it\'s not a blowout yet'],
  slight_loss:['you down but it\'s not over 👀','close one — one good day flips it','they ahead but you still in it']
};

function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):'';}
function fm(m){if(!m&&m!==0)return'—';if(m<60)return m+'m';var h=Math.floor(m/60),mn=m%60;return mn?h+'h '+mn+'m':h+'h';}
function ini(n){return(n||'??').slice(0,2).toUpperCase();}
function isC(m){return(m.role_tags||'').toLowerCase().includes('chatter');}
function el(id){return document.getElementById(id);}
function qs(sel,ctx){return(ctx||document).querySelector(sel);}
function qsa(sel,ctx){return(ctx||document).querySelectorAll(sel);}

// LOGIN
async function initLogin(){
  if(!sb){console.error('[4KPI] Cannot load login — Supabase client missing');return;}
  logKPI('initLogin start');
  var r=await sb.from('members').select('*').order('name');
  sbErr('members (login)',r);
  members=r.data||[];
  logKPI('initLogin members loaded',{count:members.length});
  await loadSettings();
  renderLG(members);
  var sub=el('login-sub');if(sub&&!sub.querySelector('.help-wrap'))sub.insertAdjacentHTML('beforeend',' '+hBtn('login'));
}

function renderLG(list){
  list=sortByOrder(list,'login');
  var admins=list.filter(function(m){return m.is_admin;});
  var team=list.filter(function(m){return !m.is_admin;});
  var pi='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:.4;flex-shrink:0"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
  var drag=loginEditMode?'<span class="drag-hint">⠿</span>':'';
  var h='';
  if(loginEditMode)h+='<div style="font-size:11px;color:var(--amber);text-align:center;margin-bottom:10px">Drag names to reorder · order saves automatically</div>';
  function bub(m,extra){return'<button class="login-bubble mbtn'+extra+'" draggable="'+(loginEditMode?'true':'false')+'" data-id="'+m.id+'" data-name="'+m.name+'">'+drag+pi+m.name+'</button>';}
  if(admins.length){
    h+='<div class="login-section"><div class="ls-line"></div><span class="ls-label">Admins</span><div class="ls-line"></div></div>';
    h+='<div class="login-grid-unified">';
    admins.forEach(function(m){h+=bub(m,'');});
    h+='</div>';
  }
  if(team.length){
    h+='<div class="login-section login-section-spaced"><div class="ls-line"></div><span class="ls-label">Team Members</span><div class="ls-line"></div></div>';
    h+='<div class="login-grid-unified">';
    team.forEach(function(m){h+=bub(m,' team');});
    h+='</div>';
  }
  el('lgrid').innerHTML=h;
  qsa('.mbtn').forEach(function(btn){
    if(loginEditMode){
      btn.onclick=function(e){e.preventDefault();};
      btn.ondragstart=function(){dragLoginId=this.dataset.id;this.classList.add('dragging');};
      btn.ondragend=function(){this.classList.remove('dragging');dragLoginId=null;};
      btn.ondragover=function(e){e.preventDefault();};
      btn.ondrop=function(e){e.preventDefault();dropLoginOrder(this.dataset.id);};
    }else{
      btn.addEventListener('click',function(){selM(this.dataset.id,this.dataset.name);});
    }
  });
}
function dropLoginOrder(targetId){
  if(!dragLoginId||dragLoginId===targetId)return;
  var ids=sortByOrder(members,'login').map(function(m){return m.id;});
  var fi=ids.indexOf(dragLoginId),ti=ids.indexOf(targetId);
  if(fi<0||ti<0)return;
  ids.splice(fi,1);ids.splice(ti,0,dragLoginId);
  loginOrder=ids;saveAll();renderLG(members);toast('Login order saved');
}
function toggleLoginEdit(){
  if(loginEditMode){loginEditMode=false;el('loginGear').classList.remove('on');renderLG(members);return;}
  var pin=prompt('Enter any admin PIN to reorder login names:');
  if(!pin)return;
  var ok=members.some(function(m){return m.is_admin&&m.pin===pin;});
  if(!ok){toast('Wrong admin PIN','error');return;}
  loginEditMode=true;el('loginGear').classList.add('on');renderLG(members);
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
  cu={id:m.id,name:m.name,isAdmin:!!m.is_admin,color:m.color||'teal'};
  console.log('[4KPI] login ok',{id:cu.id,name:cu.name,isAdmin:cu.isAdmin});
  enterApp();
}

function enterApp(){
  el('LS').classList.add('hidden');
  el('APP').style.display='flex';
  syncUserRole();
  var c=getMC({color:cu.color});
  var av=el('uav');
  av.style.background=c.bg;av.style.color=c.text;av.textContent=ini(cu.name);
  el('uname').textContent=cu.name;
  el('urole').textContent=cu.isAdmin?'Admin':'Team member';
  applyNavAccess();
  var dStr=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});el('today').textContent=dStr;var ins=el('insDate');if(ins)ins.textContent=dStr;
  el('quote').textContent=QT[new Date().getDay()%QT.length];
  var ht=el('humorToggle');if(ht)ht.checked=!humorOff;
  initSidebar();
  fetchAndRender(true);
}

var rtSubscribed=false;
async function fetchAndRender(showLoadErr){
  if(!sb){console.error('[4KPI] fetchAndRender aborted — no Supabase client');if(showLoadErr)toast('App failed to connect to Supabase — refresh the page','error');return;}
  if(!cu){console.warn('[4KPI] fetchAndRender skipped — not logged in');return;}
  logKPI('fetchAndRender start');
  try{
    await loadSettings();

    var mr=await sb.from('members').select('*').order('name');
    sbErr('members',mr);
    if(mr.data)members=mr.data;
    else if(mr.error)members=[];

    var tr=await sb.from('tasks').select('*').order('logged_at',{ascending:false});
    if(tr.error||!tr.data){
      sbErr('tasks (ordered)',tr);
      tr=await sb.from('tasks').select('*');
      sbErr('tasks (fallback)',tr);
    }
    tasks=tr.data||[];

    var hr=await sb.from('task_history').select('*').order('changed_at',{ascending:false});
    if(hr.error||!hr.data){
      sbErr('task_history (changed_at)',hr);
      hr=await sb.from('task_history').select('*');
      sbErr('task_history (fallback)',hr);
    }
    hist=hr.data||[];

    logKPI('fetch complete',{memberCount:members.length,taskCount:tasks.length,histCount:hist.length});

    try{await loadRoleNotes();}catch(e){console.error('[4KPI] loadRoleNotes failed',e);}
    try{await loadResultPosts();}catch(e){console.error('[4KPI] loadResultPosts failed',e);}
    try{await loadTrash();}catch(e){console.error('[4KPI] loadTrash failed',e);}

    render();
    applyNavAccess();
    logKPI('fetchAndRender done');

    if(!rtSubscribed){subscribeRealtime();rtSubscribed=true;}
  }catch(e){
    console.error('[4KPI] fetchAndRender FAILED:',e);
    if(showLoadErr)toast('Could not load dashboard data — open browser console (F12) for details','error');
  }
}
async function load(){await fetchAndRender(false);}

function logout(){
  cu=null;
  syncUserRole();
  el('LS').classList.remove('hidden');
  el('APP').style.display='none';
  el('step2').classList.remove('show');
  el('msearch').value='';
  renderLG(members);
}

// DATA (mt, mst, etc. below)
function mt(id){return tasks.filter(function(t){return t.member_id===id;});}
function mst(id){
  var mine=mt(id),tot=mine.length,don=mine.filter(function(t){return t.status==='done';}).length,lat=mine.filter(function(t){return t.status==='late';}).length,rt=tot?Math.round(don/tot*100):0;
  var wt=mine.filter(function(t){return t.actual_minutes&&t.eta_minutes;});
  var aA=wt.length?Math.round(wt.reduce(function(s,t){return s+t.actual_minutes;},0)/wt.length):null;
  var aE=wt.length?Math.round(wt.reduce(function(s,t){return s+t.eta_minutes;},0)/wt.length):null;
  return{total:tot,done:don,late:lat,rate:rt,avgA:aA,avgE:aE,noR:mine.filter(function(t){return t.result_category==='No result';}).length,nf:mine.filter(function(t){return t.result_category==='Needs review'||(t.notes||'').toLowerCase().includes('follow');}).length};
}
function vrd(id){var s=mst(id);if(!s.total)return{label:'No data',cls:'nodata'};if(s.late>=2)return{label:'Falling behind',cls:'behind'};if(s.rate>=80)return{label:'Producing',cls:'producing'};if(s.rate>=50)return{label:'Watch',cls:'watch'};return{label:'Falling behind',cls:'behind'};}
function stag(s){var m={done:['Done','done'],prog:['In progress','prog'],late:['Late','late'],pending:['Pending','pending'],nostart:['Not started','nostart']};var p=m[s]||['?','pending'];return'<span class="tag '+p[1]+'">'+p[0]+'</span>';}
function ebar(eta,act){if(!eta)return'';var pct=act?Math.min(Math.round(act/eta*100),150):0,over=act>eta,cls=!act?'b':over?'r':'g';return'<div style="margin-top:4px"><div class="erow"><span>ETA '+fm(eta)+(act?' · '+fm(act):'')+'</span><span>'+(act?(over?'+'+fm(act-eta)+' over':'-'+fm(eta-act)+' under'):'—')+'</span></div><div class="btrack"><div class="bfill '+cls+'" style="width:'+Math.min(pct,100)+'%"></div></div></div>';}
function getTH(tid){return hist.filter(function(h){return h.task_id===tid;});}
function renderH(tid){return taskCardHist(tid)||'<div style="color:var(--text3);font-size:11px">No changes.</div>';}

// INSIGHTS
function genIns(){
  var box=el('ilist');if(!box)return;
  var ins=[],tod=new Date().toDateString(),todT=tasks.filter(function(t){var dt=parseDT(t.logged_at);return dt&&dt.toDateString()===tod;});
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
  var todRes=resultPosts.filter(function(r){return new Date(r.created_at).toDateString()===tod;});
  todRes.slice(0,6).forEach(function(r){
    var rm=members.find(function(x){return x.id===r.member_id;});
    var rt=r.result_type||'Result';
    ins.unshift({t:'good',i:'🎯',txt:'<strong>'+(rm?rm.name:'Someone')+'</strong> posted <strong>'+(r.title||'a result')+'</strong> · '+rt+' · '+fmtDT(r.created_at).split(', ').pop()});
  });
  box.innerHTML=ins.length?ins.map(function(x){return'<div class="ii '+x.t+'"><div style="font-size:13px;flex-shrink:0;margin-top:1px">'+x.i+'</div><div>'+x.txt+'</div></div>';}).join(''):'<div style="color:var(--text3);font-size:12px;padding:4px 0">Log tasks to generate insights.</div>';
}

function toggleP(bid,iid){var b=el(bid),ic=el(iid);b.classList.toggle('coll');ic.classList.toggle('open',!b.classList.contains('coll'));}

function injectPageHelp(){var map={'page-dashboard':['dashboard'],'page-calendar':['calendar'],'page-performance':['performance'],'page-oversight':['oversight'],'page-intelligence':['intelligence'],'page-library':['library'],'page-results':['results'],'page-roles':['roles'],'page-compare':['compare'],'page-rolenotes':['rolenotes']};Object.keys(map).forEach(function(pid){var pg=el(pid);if(!pg||pg.querySelector('.ph-help'))return;var ph=pg.querySelector('.ph');if(!ph)return;var d=document.createElement('div');d.className='ph-help';d.innerHTML=map[pid].map(function(k){return'<span class="ph-help-item">'+k.charAt(0).toUpperCase()+k.slice(1)+hBtn(k)+'</span>';}).join('');ph.after(d);});injectDashHelp();fillHelpSlots();}
function injectDashHelp(){
  var pt=el('pulseTitle');if(pt&&!pt.querySelector('.help-end'))pt.innerHTML='Agency pulse<span class="help-end">'+hBtn('pulse')+'</span>';
  var st=el('streak');if(st&&!st.querySelector('.help-end')){var n=st.textContent;st.innerHTML=n+'<span class="help-end">'+hBtn('streak')+'</span>';}
}
function render(){
  try{
    logKPI('render start');
    rKPIs();rPulse();genIns();rMembers();injectPageHelp();
    var ap=function(n){return el('page-'+n).classList.contains('active');};
    if(ap('calendar')){renderCal();rMyTasks();}
    if(ap('performance'))rCharts();
    if(ap('oversight'))rOversight();
    if(ap('intelligence'))rIntel();
    if(ap('library'))rLib();
    if(ap('results'))rResults();
    if(ap('roles'))rRoles();
    if(ap('compare'))rCompare();
    if(ap('trash'))rTrash();
    logKPI('render complete');
  }catch(e){console.error('[4KPI] render failed',e);}
}

function rKPIs(){
  var box=el('krow');
  if(!box){console.error('[4KPI] rKPIs: #krow element not found');return;}
  var tot=tasks.length,don=tasks.filter(function(t){return t.status==='done';}).length,lat=tasks.filter(function(t){return t.status==='late';}).length;
  var res=tasks.filter(function(t){return t.result_category&&t.result_category!=='No result'&&t.result_category!=='Needs review';}).length;
  var rt=tot?Math.round(don/tot*100):0;
  var cards=[{l:'Tasks logged',v:tot,c:'',s:'all time',d:'all',h:'kpi_logged'},{l:'Completed',v:don,c:'g',s:rt+'% rate',d:'done',h:'kpi_completed'},{l:'Late / missed',v:lat,c:lat>2?'r':lat>0?'a':'g',s:'attention',d:'late',h:'kpi_late'},{l:'Results',v:res,c:res>0?'g':'',s:'confirmed',d:'rk',h:'kpi_results'},{l:'Team size',v:members.filter(function(m){return!m.is_admin;}).length,c:'',s:'members',d:'',h:'kpi_team'}];
  box.innerHTML=cards.map(function(k){return'<div class="kcard"'+(k.d?' data-kd="'+k.d+'"':'')+' style="cursor:'+(k.d?'pointer':'default')+'"><div class="kcard-top"><div class="klbl">'+k.l+'</div><span class="help-slot" data-help="'+k.h+'"></span></div><div class="kval '+k.c+'">'+k.v+'</div><div class="ksub">'+k.s+(k.d?' · tap':'')+'</div></div>';}).join('');
  qsa('.kcard[data-kd]').forEach(function(card){card.onclick=function(){dKPI(this.dataset.kd);};});
}

function rPulse(){
  var tot=tasks.length,don=tasks.filter(function(t){return t.status==='done';}).length,pct=tot?Math.round(don/tot*100):0;
  var cv=el('orb');
  if(cv){
    var ctx=cv.getContext('2d'),sz=48;
    ctx.clearRect(0,0,sz,sz);
    ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2-3,0,Math.PI*2);ctx.fillStyle='#1a1a1a';ctx.fill();
    if(pct>0){ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2-3,-Math.PI/2,-Math.PI/2+Math.PI*2*(pct/100));ctx.strokeStyle='#7fff6e';ctx.lineWidth=4;ctx.lineCap='round';ctx.stroke();}
  }
  var op=el('opct');if(op)op.textContent=pct+'%';
  var ps=el('psub');if(ps)ps.textContent=pct>=80?'Agency firing 🔥':pct>=50?'Making moves':'Get those tasks logged';
  var str=0;for(var d=0;d<30;d++){var day=new Date();day.setDate(day.getDate()-d);if(tasks.some(function(t){var dt=parseDT(t.logged_at);return dt&&dt.toDateString()===day.toDateString();}))str++;else if(d>0)break;}
  var st=el('streak');if(st)st.innerHTML='🔥 '+str+' day streak<span class="help-end">'+hBtn('streak')+'</span>';
}

function rMembers(){
  var container=el('mgrid2');
  if(!container)return;
  if(!members.length){container.innerHTML='<div style="color:var(--text3);font-size:13px">No members yet.</div>';return;}
  var pool=getTeamVisible();
  var q=(el('tsrch')?el('tsrch').value||'':'').toLowerCase();
  var show=q?pool.filter(function(m){return m.name.toLowerCase().includes(q)||(m.role||'').toLowerCase().includes(q);}):pool;
  if(!show.length){container.innerHTML='<div style="color:var(--text3);font-size:13px;padding:8px 0">'+(q?'No team members match that search.':'No team members to show.')+'</div>';return;}
  var html='';
  show.forEach(function(m){
    var c=getMC(m),s=mst(m.id),v=vrd(m.id),mine=mt(m.id).slice(0,2);
    var rc=s.rate>=80?'g':s.rate>=50?'a':'r',lc=s.late===0?'g':s.late<=1?'a':'r';
    var dc=s.avgA&&s.avgE?(s.avgA>s.avgE?'r':'g'):'',dv=s.avgA&&s.avgE?((s.avgA>s.avgE?'+':'')+fm(Math.abs(s.avgA-s.avgE))):'—';
    var tHTML='';
    if(mine.length){mine.forEach(function(t){tHTML+=renderTaskLine(t);if(canEditTask(t)||canDelTask(t))tHTML+='<div style="margin-top:4px">'+taskActions(t)+'</div>';});}
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
  qsa('[data-et]',container).forEach(function(btn){btn.onclick=function(e){e.stopPropagation();openET(btn.dataset.et);};});
  qsa('[data-dt]',container).forEach(function(btn){btn.onclick=function(e){e.stopPropagation();delT(btn.dataset.dt,btn);};});
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

function rCalSum(y,mo){var dim=new Date(y,mo+1,0).getDate(),tot=0,don=0,lat=0;for(var d=1;d<=dim;d++){var ds=new Date(y,mo,d).toDateString(),dT=tasks.filter(function(t){return new Date(t.logged_at).toDateString()===ds;});tot+=dT.length;don+=dT.filter(function(t){return t.status==='done';}).length;lat+=dT.filter(function(t){return t.status==='late';}).length;}var rt=tot?Math.round(don/tot*100):0;el('csum').innerHTML='<div class="csum-title">Month summary<span class="help-end">'+hBtn('cal_summary')+'</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px"><div class="ms" style="border-radius:8px;padding:10px 12px"><div class="msl">Tasks</div><div class="msv">'+tot+'</div></div><div class="ms" style="border-radius:8px;padding:10px 12px"><div class="msl">Completed</div><div class="msv g">'+don+'</div></div><div class="ms" style="border-radius:8px;padding:10px 12px"><div class="msl">Late</div><div class="msv '+(lat>0?'r':'')+'">'+lat+'</div></div><div class="ms" style="border-radius:8px;padding:10px 12px"><div class="msl">Rate</div><div class="msv '+(rt>=80?'g':rt>=50?'a':'r')+'">'+rt+'%</div></div></div>';}

function taskCheckHTML(t){
  if(!canEditTask(t))return'';
  var done=t.status==='done';
  if(!done&&t.status!=='prog'&&t.status!=='pending'&&t.status!=='late'&&t.status!=='nostart')return'';
  return'<label class="tchk-wrap" onclick="event.stopPropagation()"><input type="checkbox" class="tchk" data-complete="'+t.id+'"'+(done?' checked disabled':'')+'><span class="tchk-box'+(done?' done':'')+'"></span></label>';
}

function renderCalTaskRow(t,extra){
  var types=parseTT(t.task_type),typeLbl=types.length?types.join(' · '):(t.name||'—');
  var chk=taskCheckHTML(t);
  return'<div class="cal-task'+(t.status==='done'?' done':'')+'"'+(extra||'')+'>'+chk+'<div class="cal-task-body"><div class="cal-task-top"><span class="cal-task-name">'+typeLbl+'</span>'+stag(t.status)+'</div><div class="cal-task-meta">'+(t.role_area||'')+(t.eta_minutes?' · ETA '+fm(t.eta_minutes):'')+(t.edited_at?' · <span class="ebadge">edited</span>':'')+'</div>'+(t.edited_at?taskCardHist(t.id):'')+'</div></div>';
}

function rMyTasks(){
  var list=el('myTasksList'),panel=el('myTasksPanel');if(!list||!panel)return;
  if(!cu){panel.style.display='none';return;}
  var open=tasks.filter(function(t){return t.member_id===cu.id&&(t.status==='prog'||t.status==='pending'||t.status==='nostart');}).sort(function(a,b){return new Date(b.logged_at)-new Date(a.logged_at);});
  panel.style.display='block';
  if(!open.length){list.innerHTML='<div class="mytasks-empty">No open tasks — log one from the dashboard or check a completed day below.</div>';return;}
  list.innerHTML=open.map(function(t){return renderCalTaskRow(t);}).join('');
  bindCompleteChecks(list);
}

function buildDayHTML(dT,sq){
  var q=(sq||'').toLowerCase(),bM={};
  dT.forEach(function(t){if(!bM[t.member_id])bM[t.member_id]=[];bM[t.member_id].push(t);});
  var mids=Object.keys(bM);
  if(q){mids.sort(function(a,b){var ma=members.find(function(x){return x.id===a;}),mb=members.find(function(x){return x.id===b;});var ha=(ma?ma.name:'').toLowerCase().includes(q),hb=(mb?mb.name:'').toLowerCase().includes(q);return ha&&!hb?-1:!ha&&hb?1:0;});mids=mids.filter(function(mid){var m=members.find(function(x){return x.id===mid;});return(m?m.name:'').toLowerCase().includes(q);});}
  if(!mids.length)return'<div style="color:var(--text3);font-size:13px">No tasks match search.</div>';
  return mids.map(function(mid){
    var m=members.find(function(x){return x.id===mid;}),c=getMC(m),mT=bM[mid];
    var don=mT.filter(function(t){return t.status==='done';}).length,lat=mT.filter(function(t){return t.status==='late';}).length;
    var html='<div style="margin-bottom:14px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div class="av" style="width:28px;height:28px;font-size:10px;background:'+c.bg+';color:'+c.text+';border-radius:6px">'+ini(m?m.name:'?')+'</div><div style="font-size:13px;font-weight:600">'+(m?m.name:'Unknown')+'</div><div style="font-size:11px;color:var(--text2)">'+mT.length+' tasks · '+don+' done'+(lat>0?' · '+lat+' late':'')+'</div></div>';
    mT.forEach(function(t){
      var acts=taskActions(t);
      html+=renderCalTaskRow(t)+ (acts?'<div style="margin:4px 0 8px 36px">'+acts+'</div>':'');
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
  bindCompleteChecks(el('ddc'));
}

function bindCompleteChecks(ctx){
  qsa('[data-complete]',ctx||document).forEach(function(chk){
    chk.onchange=function(){
      if(this.checked)completeTask(this.dataset.complete);
      else this.checked=true;
    };
  });
}

async function completeTask(tid){
  var t=tasks.find(function(x){return x.id===tid;});
  if(!t||!canEditTask(t)){toast('You can only complete your own tasks','error');return;}
  if(t.status==='done')return;
  var old=t.status;
  await sb.from('task_history').insert([{task_id:tid,changed_by:cu.id,field_changed:'status',old_value:old,new_value:'done',changed_at:nowISO()}]);
  var r=await sb.from('tasks').update({status:'done',edited_at:nowISO(),edited_by:cu.id}).eq('id',tid);
  if(r.error){toast('Could not update task','error');return;}
  toast('Task marked done ✓');
  await load();
}

function goT(){calDate=new Date();renderCal();}
function chM(d){calDate.setMonth(calDate.getMonth()+d);renderCal();}

// TASK LIBRARY
var dragCatEl=null;
function rLib(){
  var RA=getRA(),order=getOrder().filter(function(r){return RA[r]!==undefined||BRA[r];});
  var newBtn=cu&&cu.isAdmin?'<div class="lib-new-cat"><button class="btn p" onclick="openNewCat()">+ New role category</button></div>':'';
  el('bcats').innerHTML=newBtn+order.map(function(role){
    var info=getCatInfo(role),col=getRCol(role),tl=RA[role]||[];
    var bubs=tl.map(function(t){return'<span class="lbub" style="border-color:'+col+'33;color:'+col+'" data-role="'+role+'" data-task="'+t+'">'+t+(cu&&cu.isAdmin?'<span class="lx">✕</span>':'')+'</span>';}).join('');
    var addB=cu&&cu.isAdmin?'<button class="add-bub" data-addrole="'+role+'">+ Add</button>':'';
    var editB=cu&&cu.isAdmin?'<button class="btn sm" data-editcat="'+role+'">Edit</button>':'';
    var notesB='<button class="btn sm" data-notes="'+role+'">Notes</button>';
    var isBase=!!BRA[role];
    var delCatB=cu&&cu.isAdmin&&!isBase?'<button class="btn sm danger" data-delcat="'+role+'">Del</button>':'';
    return'<div class="bcat" style="background:'+col+'08;border-color:'+col+'22" draggable="true" data-catname="'+role+'"><div class="bchead"><div style="display:flex;align-items:center;gap:8px"><span class="bcicon">'+info.icon+'</span><div><div class="bcname">'+info.name+'</div><div class="bcdesc">'+info.desc+'</div></div></div><div style="display:flex;gap:5px">'+notesB+editB+delCatB+'</div></div><div class="bubbles">'+bubs+'</div><div style="margin-top:5px">'+addB+'</div></div>';
  }).join('');
  // Bind lib events
  qsa('.lbub').forEach(function(bub){
    bub.onclick=function(){var role=this.dataset.role,task=this.dataset.task;quickLog(role,task);};
    var lx=bub.querySelector('.lx');if(lx)lx.onclick=function(e){e.stopPropagation();delLibT(bub.dataset.role,bub.dataset.task);};
  });
  qsa('[data-addrole]').forEach(function(btn){btn.onclick=function(){addLibBub(this.dataset.addrole,this);};});
  qsa('[data-editcat]').forEach(function(btn){btn.onclick=function(e){e.stopPropagation();openECM(this.dataset.editcat);};});
  qsa('[data-notes]').forEach(function(btn){btn.onclick=function(e){e.stopPropagation();openRoleNotes(this.dataset.notes);};});
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
function openECM(role){editCat=role;editCatNew=false;var info=getCatInfo(role);el('ecmtitle').textContent='Edit "'+info.name+'"';el('ecmname').value=info.name;el('ecmdesc').value=info.desc;el('ecmicon').value=info.icon;var cur=getRCol(role);el('ecmcolor').value=cur;renderSwatches('ecmcolorgrid','ecmcolor',cur);el('ecmdel').style.display=BRA[role]?'none':'flex';el('ECM').classList.add('open');}
function openNewCat(){editCat=null;editCatNew=true;el('ecmtitle').textContent='New role category';el('ecmname').value='';el('ecmdesc').value='';el('ecmicon').value='📌';el('ecmcolor').value='#7fff6e';renderSwatches('ecmcolorgrid','ecmcolor','#7fff6e');el('ecmdel').style.display='none';el('ECM').classList.add('open');}
function saveECM(){
  if(saveECM._busy)return;
  var n=el('ecmname').value.trim(),d=el('ecmdesc').value.trim(),ic=el('ecmicon').value.trim(),col=el('ecmcolor').value;
  if(!n){toast('Role name required','error');return;}
  if(editCatNew){
    if(roleExists(n)){toast('That role already exists','error');return;}
    saveECM._busy=true;
    customRA[n]=[];RCOLS[n]=col;if(!catMeta[n])catMeta[n]={};catMeta[n].name=n;catMeta[n].desc=d;catMeta[n].icon=ic||'📌';
    var order=getOrder();if(!order.includes(n))order.push(n);catOrder=order;
    toast('Category created');editCat=n;editCatNew=false;
  }else if(editCat){
    if(n.toLowerCase()!==editCat.toLowerCase()&&roleExists(n,editCat)){toast('That role name already exists','error');return;}
    saveECM._busy=true;
    if(!catMeta[editCat])catMeta[editCat]={};
    catMeta[editCat].name=n;catMeta[editCat].desc=d;if(ic)catMeta[editCat].icon=ic;
    RCOLS[editCat]=col;toast('Category updated');
  }
  saveAll();el('ECM').classList.remove('open');saveECM._busy=false;rLib();
}
function delCatFromECM(){if(!editCat||BRA[editCat])return;if(!confirm('Delete this entire role and its custom tasks?'))return;delCat(editCat);el('ECM').classList.remove('open');}
function openCP(role){openECM(role);}
function quickLog(role,tt){openT();setTimeout(function(){sRoles=[role];sTTs=[tt];bRoles();bTTs();},100);}

// CHARTS
function rCharts(){
  var lbl=members.map(function(m){return m.name;}),rates=members.map(function(m){return mst(m.id).rate;}),bc=rates.map(function(r){return r>=80?'#7fff6e':r>=50?'#ffb830':'#ff5c5c';});
  var aA=members.map(function(m){var s=mst(m.id);return s.avgA?+(s.avgA/60).toFixed(1):0;}),aE=members.map(function(m){var s=mst(m.id);return s.avgE?+(s.avgE/60).toFixed(1):0;}),lts=members.map(function(m){return mst(m.id).late;});
  var cd={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#444',font:{size:10}},grid:{display:false},border:{display:false}},y:{ticks:{color:'#444',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'},border:{display:false}}}};
  if(charts.c)charts.c.destroy();charts.c=new Chart(el('cc'),{type:'bar',data:{labels:lbl,datasets:[{data:rates,backgroundColor:bc,borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{min:0,max:100,ticks:Object.assign({},cd.scales.y.ticks,{callback:function(v){return v+'%';}})})})})});
  if(charts.t)charts.t.destroy();charts.t=new Chart(el('ct'),{type:'bar',data:{labels:lbl,datasets:[{label:'Actual',data:aA,backgroundColor:'#5b9cf6',borderRadius:4,borderSkipped:false},{label:'ETA',data:aE,backgroundColor:'#a78bfa',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{callback:function(v){return v+'h';}})})})})}); 
  var sc=[tasks.filter(function(t){return t.status==='done';}).length,tasks.filter(function(t){return t.status==='prog';}).length,tasks.filter(function(t){return t.status==='nostart';}).length,tasks.filter(function(t){return t.status==='pending';}).length,tasks.filter(function(t){return t.status==='late';}).length];
  if(charts.s)charts.s.destroy();charts.s=new Chart(el('cs'),{type:'doughnut',data:{labels:['Done','In progress','Not started','Pending','Late'],datasets:[{data:sc,backgroundColor:['#7fff6e','#5b9cf6','#888','#ffb830','#ff5c5c'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right',labels:{color:'#888',font:{size:10},boxWidth:10}}},cutout:'60%'}});
  if(charts.l)charts.l.destroy();charts.l=new Chart(el('cl'),{type:'bar',data:{labels:lbl,datasets:[{data:lts,backgroundColor:'#ff5c5c',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{stepSize:1})})})})});
  var rc={};tasks.forEach(function(t){if(t.result_category)rc[t.result_category]=(rc[t.result_category]||0)+1;});var rl=Object.keys(rc).slice(0,8),rd=rl.map(function(l){return rc[l];});
  if(charts.r)charts.r.destroy();charts.r=new Chart(el('cr'),{type:'bar',data:{labels:rl,datasets:[{data:rd,backgroundColor:'#34d399',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{indexAxis:'y',scales:{x:cd.scales.x,y:{ticks:{color:'#888',font:{size:9}},grid:{display:false},border:{display:false}}}})});
  var days=[],cnts=[];for(var d=13;d>=0;d--){var day=new Date();day.setDate(day.getDate()-d);var ds=day.toLocaleDateString('en-US',{month:'short',day:'numeric'});days.push(ds);cnts.push(tasks.filter(function(t){return new Date(t.logged_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})===ds;}).length);}
  if(charts.tr)charts.tr.destroy();charts.tr=new Chart(el('ctr'),{type:'line',data:{labels:days,datasets:[{data:cnts,borderColor:'#7fff6e',backgroundColor:'rgba(127,255,110,.08)',tension:.4,fill:true,pointRadius:3,pointBackgroundColor:'#7fff6e'}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{stepSize:1})})})})});
  var chHelp={cc:'chart_completion',ct:'chart_time',cs:'chart_status',cl:'chart_late',cr:'chart_results',ctr:'chart_trend'};
  Object.keys(chHelp).forEach(function(cid){var cv=el(cid);if(!cv)return;var card=cv.closest('.chcard');if(!card)return;var title=card.querySelector('.chtitle');if(!title||title.querySelector('.help-slot'))return;var hint=title.querySelector('.chhint'),label=title.textContent.replace('click','').trim();title.innerHTML='<span>'+label+'</span><span class="help-slot" data-help="'+chHelp[cid]+'"></span>'+(hint?' <span class="chhint">click</span>':'');});
  fillHelpSlots();
}

function tbl(list){
  if(!list.length)return'<div style="color:var(--text3);font-size:12px;padding:12px 0">No tasks found.</div>';
  var showActCol=cu&&(cu.isAdmin||list.some(function(t){return canEditTask(t);}));var h='<div style="overflow-x:auto"><table class="dtbl"><thead><tr><th>Member</th><th>Task</th><th>Role</th><th>Status</th><th>ETA</th><th>Actual</th><th>Result</th><th>Edited?</th><th>Notes</th><th>Date</th>'+(showActCol?'<th>Actions</th>':'')+'</tr></thead><tbody>';
  var cols=showActCol?11:10;
  list.slice(0,60).forEach(function(t){var m=members.find(function(x){return x.id===t.member_id;});var ld=parseDT(t.logged_at);h+='<tr><td>'+(m?m.name:'—')+'</td><td>'+(t.task_type||t.name||'—')+(t.is_recurring?' 🔄':'')+'</td><td>'+(t.role_area||'—')+'</td><td>'+stag(t.status)+'</td><td>'+fm(t.eta_minutes)+'</td><td>'+fm(t.actual_minutes)+'</td><td>'+(t.result_category||'—')+'</td><td>'+(t.edited_at?'<span class="ebadge">✏️</span>':'—')+'</td><td style="max-width:120px;word-break:break-word">'+(t.notes||'—')+'</td><td>'+(ld?ld.toLocaleDateString():'—')+'</td>'+(showActCol?'<td>'+taskActions(t)+'</td>':'')+'</tr>';if(t.edited_at)h+='<tr><td colspan="'+cols+'" style="padding-top:0">'+taskCardHist(t.id)+'</td></tr>';});
  h+='</tbody></table></div>';return h;
}

function dc(type){
  el('DD').classList.add('open');
  var cfgs={
    completion:{ti:'Completion rate',st:members.map(function(m){var s=mst(m.id);return'<div class="dstat"><div class="dstat-l">'+m.name+'</div><div class="dstat-v" style="color:'+(s.rate>=80?'var(--accent)':s.rate>=50?'var(--amber)':'var(--red)')+'">'+s.rate+'%</div></div>';}),li:tasks},
    time:{ti:'Time vs ETA',st:members.map(function(m){var s=mst(m.id),d=s.avgA&&s.avgE?s.avgA-s.avgE:null;return'<div class="dstat"><div class="dstat-l">'+m.name+'</div><div class="dstat-v" style="color:'+(d===null?'var(--text)':d>0?'var(--red)':'var(--accent)')+'">'+(d===null?'—':(d>0?'+':'')+fm(Math.abs(d)))+'</div></div>';}),li:tasks.filter(function(t){return t.actual_minutes||t.eta_minutes;})},
    status:{ti:'By status',st:[['Done',tasks.filter(function(t){return t.status==='done';}).length,'var(--accent)'],['In progress',tasks.filter(function(t){return t.status==='prog';}).length,'var(--blue)'],['Not started',tasks.filter(function(t){return t.status==='nostart';}).length,'#888'],['Pending',tasks.filter(function(t){return t.status==='pending';}).length,'var(--amber)'],['Late',tasks.filter(function(t){return t.status==='late';}).length,'var(--red)']].map(function(x){return'<div class="dstat"><div class="dstat-l">'+x[0]+'</div><div class="dstat-v" style="color:'+x[2]+'">'+x[1]+'</div></div>';}),li:tasks},
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

function viewP(mid,keepFilter){
  profileMid=mid;if(!keepFilter)profileFilter='all';
  var m=members.find(function(x){return x.id===mid;});if(!m)return;
  var c=getMC(m),mine=filterByPeriod(mt(mid),profileFilter);
  var s=(function(){var tot=mine.length,don=mine.filter(function(t){return t.status==='done';}).length,lat=mine.filter(function(t){return t.status==='late';}).length,rt=tot?Math.round(don/tot*100):0,wt=mine.filter(function(t){return t.actual_minutes&&t.eta_minutes;}),aA=wt.length?Math.round(wt.reduce(function(s,t){return s+t.actual_minutes;},0)/wt.length):null,aE=wt.length?Math.round(wt.reduce(function(s,t){return s+t.eta_minutes;},0)/wt.length):null;return{total:tot,done:don,late:lat,rate:rt,avgA:aA,avgE:aE,noR:mine.filter(function(t){return t.result_category==='No result';}).length,nf:mine.filter(function(t){return t.result_category==='Needs review'||(t.notes||'').toLowerCase().includes('follow');}).length};})(),v=vrd(mid);
  var ttC={},resC={};
  mine.forEach(function(t){parseTT(t.task_type).forEach(function(tt){ttC[tt]=(ttC[tt]||0)+1;});if(t.result_category)resC[t.result_category]=(resC[t.result_category]||0)+1;});
  var ed=mine.filter(function(t){return t.edited_at;}).length;
  el('pedit').innerHTML=cu&&cu.isAdmin?'<button class="btn sm" data-edit="'+m.id+'">Edit member</button>':'';
  var h='<div class="profhd"><div class="profav" style="background:'+c.bg+';color:'+c.text+'">'+ini(m.name)+'</div><div><div class="profname">'+m.name+'</div><div class="profrole">'+m.role+'</div><span class="vd '+v.cls+'" style="margin-top:5px;display:inline-block">'+v.label+'</span></div></div>';
  h+='<div class="prof-filters"><button class="pfbtn'+(profileFilter==='today'?' on':'')+'" onclick="setProfFilter(\'today\')">Today</button><button class="pfbtn'+(profileFilter==='7d'?' on':'')+'" onclick="setProfFilter(\'7d\')">Last 7 Days</button><button class="pfbtn'+(profileFilter==='30d'?' on':'')+'" onclick="setProfFilter(\'30d\')">Last 30 Days</button><button class="pfbtn'+(profileFilter==='all'?' on':'')+'" onclick="setProfFilter(\'all\')">All Time</button></div>';
  h+='<div class="profstats"><div class="profstat"><div class="klbl">Tasks</div><div class="kval">'+s.total+'</div></div><div class="profstat"><div class="klbl">Completion</div><div class="kval '+(s.rate>=80?'g':s.rate>=50?'a':'r')+'">'+s.rate+'%</div></div><div class="profstat"><div class="klbl">Late</div><div class="kval '+(s.late===0?'g':s.late>=2?'r':'a')+'">'+s.late+'</div></div><div class="profstat"><div class="klbl">vs ETA</div><div class="kval '+(s.avgA&&s.avgE?(s.avgA>s.avgE?'r':'g'):'')+'">'+( s.avgA&&s.avgE?((s.avgA>s.avgE?'+':'')+fm(Math.abs(s.avgA-s.avgE))):'—')+'</div></div><div class="profstat"><div class="klbl">No result</div><div class="kval '+(s.noR>0?'a':'')+'">'+s.noR+'</div></div><div class="profstat"><div class="klbl">Edited</div><div class="kval '+(ed>0?'a':'')+'">'+ed+'</div></div></div>';
  if(ed>0&&cu&&cu.isAdmin)h+='<div style="background:rgba(255,184,48,.06);border:1px solid rgba(255,184,48,.15);border-radius:8px;padding:10px 12px;margin-bottom:14px;font-size:12px;color:var(--amber)">⚠️ '+ed+' task'+(ed>1?'s have':' has')+' been edited after logging.</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px"><div class="icard"><div class="ititle">Task types</div>'+Object.entries(ttC).sort(function(a,b){return b[1]-a[1];}).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span>'+x[1]+'</span></div>';}).join('')+'</div><div class="icard"><div class="ititle">Results</div>'+Object.entries(resC).sort(function(a,b){return b[1]-a[1];}).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span>'+x[1]+'</span></div>';}).join('')+'</div></div>';
  h+='<div style="margin-bottom:9px;font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em">Tasks — '+m.name+' ('+mine.length+')</div>'+tbl(mine);
  el('pcontent').innerHTML=h;
  var eb=el('pedit').querySelector('[data-edit]');if(eb)eb.onclick=function(){openEM(this.dataset.edit);};
  bindDrillActions();
  gp('profile',null);
}

function setProfFilter(f){profileFilter=f;if(profileMid)viewP(profileMid,true);}

function rOversight(){
  var tod=new Date().toDateString(),todT=tasks.filter(function(t){return new Date(t.logged_at).toDateString()===tod;}),zero=members.filter(function(m){return!todT.some(function(t){return t.member_id===m.id;});}),latM=members.filter(function(m){return mst(m.id).late>0;}),overE=members.filter(function(m){var s=mst(m.id);return s.avgA&&s.avgE&&s.avgA>s.avgE+15;}),stk=tasks.filter(function(t){return t.status==='prog';}),noR=tasks.filter(function(t){return t.result_category==='No result';}),fu=tasks.filter(function(t){return t.result_category==='Needs review'||(t.notes||'').toLowerCase().includes('follow');}),ed=tasks.filter(function(t){return t.edited_at;});
  var mn=function(t){return(members.find(function(x){return x.id===t.member_id;})||{name:'?'}).name;};
  el('ogrid').innerHTML='<div class="ocard"><div class="otitle"><span>Not logged today</span><span class="help-slot" data-help="os_notlogged"></span></div>'+(zero.length?zero.map(function(m){return'<div class="oitem"><span>'+m.name+'</span><span class="oval r">0 tasks</span></div>';}).join(''):'<div class="oitem"><span>Everyone active</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>Has late tasks</span><span class="help-slot" data-help="os_late"></span></div>'+(latM.length?latM.map(function(m){return'<div class="oitem"><span>'+m.name+'</span><span class="oval r">'+mst(m.id).late+' late</span></div>';}).join(''):'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>Over avg ETA</span><span class="help-slot" data-help="os_overeta"></span></div>'+(overE.length?overE.map(function(m){var s=mst(m.id);return'<div class="oitem"><span>'+m.name+'</span><span class="oval a">+'+fm(s.avgA-s.avgE)+'</span></div>';}).join(''):'<div class="oitem"><span>All within ETA</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>In progress ('+stk.length+')</span><span class="help-slot" data-help="os_inprogress"></span></div>'+(stk.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'Task')+'</span><span class="oval a">Active</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>Edited ('+ed.length+')</span><span class="help-slot" data-help="os_edited"></span></div>'+(ed.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'?')+'</span><span class="oval a">Edited</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>Follow-up needed ('+fu.length+')</span><span class="help-slot" data-help="os_followup"></span></div>'+(fu.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'?')+'</span><span class="oval a">Follow up</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div>';
  fillHelpSlots();
  el('otasks').innerHTML=tbl(fu.concat(noR).slice(0,20));
  bindDrillActions();
}

function rIntel(){
  var ttS={};tasks.forEach(function(t){if(!t.task_type)return;if(!ttS[t.task_type])ttS[t.task_type]={total:0,done:0,results:0,mins:0,count:0};ttS[t.task_type].total++;if(t.status==='done')ttS[t.task_type].done++;if(t.result_category&&t.result_category!=='No result')ttS[t.task_type].results++;if(t.actual_minutes){ttS[t.task_type].mins+=t.actual_minutes;ttS[t.task_type].count++;}});
  var sorted=Object.entries(ttS).sort(function(a,b){return b[1].results-a[1].results;});
  el('igrid').innerHTML='<div class="icard"><div class="ititle"><span>Completion by member</span><span class="help-slot" data-help="intel_completion"></span></div>'+members.map(function(m){var s=mst(m.id);return'<div class="irow"><span>'+m.name+'</span><span style="color:'+(s.rate>=80?'var(--accent)':s.rate>=50?'var(--amber)':'var(--red)')+'">'+s.rate+'% ('+s.done+'/'+s.total+')</span></div>';}).join('')+'</div><div class="icard"><div class="ititle"><span>Avg task time</span><span class="help-slot" data-help="intel_avgtime"></span></div>'+members.map(function(m){var s=mst(m.id);return'<div class="irow"><span>'+m.name+'</span><span>'+(s.avgA?fm(s.avgA):'No data')+'</span></div>';}).join('')+'</div><div class="icard"><div class="ititle"><span>ETA accuracy</span><span class="help-slot" data-help="intel_eta"></span></div>'+members.map(function(m){var s=mst(m.id),d=s.avgA&&s.avgE?s.avgA-s.avgE:null;return'<div class="irow"><span>'+m.name+'</span><span style="color:'+(d===null?'var(--text3)':d>0?'var(--red)':'var(--accent)')+'">'+(d===null?'—':(d>0?'+':'')+fm(Math.abs(d)))+'</span></div>';}).join('')+'</div><div class="icard"><div class="ititle"><span>Edit rate</span><span class="help-slot" data-help="intel_editrate"></span></div>'+members.map(function(m){var mine=mt(m.id),ed=mine.filter(function(t){return t.edited_at;}).length,rt=mine.length?Math.round(ed/mine.length*100):0;return'<div class="irow"><span>'+m.name+'</span><span style="color:'+(rt>20?'var(--amber)':'var(--accent)')+'">'+ed+' edited ('+rt+'%)</span></div>';}).join('')+'</div><div class="icard"><div class="ititle"><span>Best result tasks</span><span class="help-slot" data-help="intel_bestresults"></span></div>'+sorted.slice(0,6).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span style="color:var(--accent)">'+x[1].results+' results</span></div>';}).join('')+'</div><div class="icard"><div class="ititle"><span>Ready to outsource</span><span class="help-slot" data-help="intel_outsource"></span></div>'+Object.entries(ttS).filter(function(x){return x[1].count>=3&&x[1].mins/x[1].count<90&&x[1].done/x[1].total>=.8;}).slice(0,5).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span style="color:var(--teal)">Ready ✓</span></div>';}).join('')+'</div><div class="icard"><div class="ititle"><span>Needs SOP</span><span class="help-slot" data-help="intel_sop"></span></div>'+Object.entries(ttS).filter(function(x){return x[1].count>=2&&(x[1].mins/x[1].count>120||x[1].done/x[1].total<.6);}).slice(0,5).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span style="color:var(--amber)">Needs SOP</span></div>';}).join('')+'</div><div class="icard"><div class="ititle"><span>Recurring tasks</span><span class="help-slot" data-help="intel_recurring"></span></div>'+Object.entries(tasks.filter(function(t){return t.is_recurring;}).reduce(function(a,t){a[t.task_type||'Unknown']=(a[t.task_type||'Unknown']||0)+1;return a;},{})).map(function(x){return'<div class="irow"><span>'+x[0]+'</span><span style="color:var(--blue)">🔄 '+x[1]+'</span></div>';}).join('')+'</div>';
  fillHelpSlots();
}

function rRoles(){
  var q=(el('rsearch')?el('rsearch').value||'':'').toLowerCase();
  var show=sortByOrder(members,'roles');
  if(q)show=show.filter(function(m){return m.name.toLowerCase().includes(q)||(m.role||'').toLowerCase().includes(q);});
  el('rlist').innerHTML=show.map(function(m){
    var c=getMC(m),tags=(m.role_tags||'').split(',').filter(Boolean),desc=m.description||'No description yet.';
    return'<div class="role-card" draggable="true" data-rid="'+m.id+'" style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--rlg);padding:15px;margin-bottom:9px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><div style="display:flex;align-items:center;gap:9px"><div class="av" style="background:'+c.bg+';color:'+c.text+';width:30px;height:30px;font-size:10px;border-radius:7px">'+ini(m.name)+'</div><div><div style="font-size:13px;font-weight:600">'+m.name+'</div><div style="font-size:11px;color:var(--text2)">'+m.role+'</div></div></div>'+(cu&&cu.isAdmin?'<button class="btn sm" data-edit="'+m.id+'">Edit</button>':'')+'</div><div style="font-size:12px;color:var(--text2);line-height:1.7;margin-bottom:7px">'+desc+'</div>'+(tags.length?'<div style="display:flex;flex-wrap:wrap;gap:5px">'+tags.map(function(t){return'<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--bg3);color:var(--text2)">'+t.trim()+'</span>';}).join('')+'</div>':'')+'</div>';
  }).join('');
  qsa('[data-edit]',el('rlist')).forEach(function(btn){var mid=btn.dataset.edit;btn.onclick=function(){openEM(mid);};});
  qsa('.role-card',el('rlist')).forEach(function(card){
    card.ondragstart=function(){dragRoleId=card.dataset.rid;card.classList.add('dragging');};
    card.ondragend=function(){card.classList.remove('dragging');dragRoleId=null;};
    card.ondragover=function(e){e.preventDefault();};
    card.ondrop=function(e){e.preventDefault();dropRoleOrder(card.dataset.rid);};
  });
}
function dropRoleOrder(targetId){
  if(!dragRoleId||dragRoleId===targetId)return;
  var ids=sortByOrder(members,'roles').map(function(m){return m.id;});
  var fi=ids.indexOf(dragRoleId),ti=ids.indexOf(targetId);
  if(fi<0||ti<0)return;
  ids.splice(fi,1);ids.splice(ti,0,dragRoleId);
  rolesOrder=ids;saveAll();rRoles();toast('Order saved');
}

// BUBBLE SELECTORS
function bMembers(){
  var show=getAssignable();
  var q=(el('massignsrch')?el('massignsrch').value||'':'').toLowerCase();
  if(q)show=show.filter(function(m){return m.name.toLowerCase().includes(q);});
  if(!cu||!cu.isAdmin)show=show.filter(function(m){return m.id===cu.id||!m.is_admin;});
  el('bm').innerHTML=show.map(function(m){var c=getMC(m),on=sMids.includes(m.id);return'<span class="sb'+(on?' on':'')+'" style="'+(on?'border-color:'+c.text+';color:'+c.text+';background:'+c.bg:'')+'" data-mb="'+m.id+'">'+m.name+'</span>';}).join('');
  qsa('[data-mb]',el('bm')).forEach(function(s){bindBubble(s,function(){togMb(this.dataset.mb);});});
}
function togMb(id){
  if(sMids.includes(id))sMids=sMids.filter(function(x){return x!==id;});
  else sMids.push(id);
  if(sMids.length===1&&!sRoles.length){
    var m=members.find(function(x){return x.id===sMids[0];});
    if(m)sRoles=parseMemberRoles(m);
  }
  bMembers();bTTs();bRCs();chkETA();
}

function bRoles(){
  var RA=getRA();
  el('br').innerHTML=Object.keys(RA).map(function(r){return'<span class="sb'+(sRoles.includes(r)?' on':'')+'" data-br="'+r+'">'+r+'<span class="sbx" data-xr="'+r+'">✕</span></span>';}).join('')+'<button class="add-bub" onclick="el(\'brad\').classList.add(\'show\')">+ Add</button>';
  qsa('[data-br]',el('br')).forEach(function(s){bindBubble(s,function(){togR(this.dataset.br);},'.sbx,[data-xr]');});
  qsa('[data-xr]',el('br')).forEach(function(s){bindBubbleX(s,function(){delRoleM(this.dataset.xr);});});
}
function togR(r){if(sRoles.includes(r))sRoles=sRoles.filter(function(x){return x!==r;});else sRoles.push(r);bRoles();bTTs();bRCs();}
function delRoleM(r){if(BRA[r]){toast('Built-in roles cannot be removed here','error');return;}delete customRA[r];sRoles=sRoles.filter(function(x){return x!==r;});saveAll();bRoles();bTTs();}

function bTTs(){
  var RA=getRA(),tl=sRoles.length===1?RA[sRoles[0]]||[]:sRoles.length>1?(function(){var s=[];sRoles.forEach(function(r){(RA[r]||[]).forEach(function(t){if(!s.includes(t))s.push(t);});});return s;})():Object.values(RA).reduce(function(a,v){v.forEach(function(t){if(!a.includes(t))a.push(t);});return a;},[]).slice(0,30);
  el('btt').innerHTML=tl.map(function(t){return'<span class="sb'+(sTTs.includes(t)?' on':'')+'" data-tt="'+t+'">'+t+'<span class="sbx" data-xt="'+t+'">✕</span></span>';}).join('')+'<button class="add-bub" onclick="el(\'bttad\').classList.add(\'show\')">+ Add</button>';
  qsa('[data-tt]',el('btt')).forEach(function(s){bindBubble(s,function(){togTT(this.dataset.tt);},'.sbx,[data-xt]');});
  qsa('[data-xt]',el('btt')).forEach(function(s){bindBubbleX(s,function(){delTTM(this.dataset.xt);});});
}
function togTT(t){if(sTTs.includes(t))sTTs=sTTs.filter(function(x){return x!==t;});else sTTs.push(t);bTTs();chkETA();}
function delTTM(t){var role=sRoles[0];if(role&&BRA[role]&&BRA[role].tasks.includes(t)){if(!delBase.tasks[role])delBase.tasks[role]=[];if(!delBase.tasks[role].includes(t))delBase.tasks[role].push(t);}else if(role&&customRA[role]){customRA[role]=customRA[role].filter(function(x){return x!==t;});}sTTs=sTTs.filter(function(x){return x!==t;});saveAll();bTTs();toast('"'+t+'" removed');}

function bRCs(){
  var roles=getContextRoles(),RC=getRCForRoles(roles);
  el('brc').innerHTML=RC.map(function(r){return'<span class="sb'+(sRCs.includes(r)?' on':'')+'" data-rc="'+r+'">'+r+'<span class="sbx" data-xrc="'+r+'">✕</span></span>';}).join('')+'<button class="add-bub" onclick="el(\'brcad\').classList.add(\'show\')">+ Add</button>';
  qsa('[data-rc]',el('brc')).forEach(function(s){bindBubble(s,function(){togRC(this.dataset.rc);},'.sbx,[data-xrc]');});
  qsa('[data-xrc]',el('brc')).forEach(function(s){bindBubbleX(s,function(){delRCM(this.dataset.xrc);});});
}
function togRC(r){if(sRCs.includes(r))sRCs=sRCs.filter(function(x){return x!==r;});else sRCs.push(r);bRCs();}
function delRCM(r){
  var roles=getContextRoles();
  removeRC(r,roles);
  sRCs=sRCs.filter(function(x){return x!==r;});
  if(sResultType===r)sResultType=getRCForRoles(roles)[0]||null;
  saveAll();bRCs();
  if(el('RM')&&el('RM').classList.contains('open'))bResultTypes();
  toast('"'+r+'" removed');
}

function addBub(type){
  var ids={role:'bri',tt:'btti',rc:'brci'},wids={role:'brad',tt:'bttad',rc:'brcad'};
  var raw=el(ids[type]).value.trim();if(!raw)return;
  var val=cap(raw);el(ids[type]).value='';el(wids[type]).classList.remove('show');
  if(type==='role'){if(!customRA[val])customRA[val]=[];if(!sRoles.includes(val))sRoles.push(val);saveAll();bRoles();bTTs();}
  else if(type==='tt'){var role=sRoles[0];if(role){if(!customRA[role])customRA[role]=[];if(!customRA[role].includes(val))customRA[role].push(val);}if(!sTTs.includes(val))sTTs.push(val);saveAll();bTTs();}
  else if(type==='rc'){var roles=getContextRoles();addCustomRC(val,roles);if(!sRCs.includes(val))sRCs.push(val);saveAll();bRCs();if(el('RM')&&el('RM').classList.contains('open'))bResultTypes();}
  toast('"'+val+'" added');
}

function chkETA(){var tt=sTTs[0],mid=sMids[0];if(!tt||!mid)return;var sim=tasks.filter(function(t){return parseTT(t.task_type).includes(tt)&&t.actual_minutes&&t.member_id===mid;});var e=el('etas');if(sim.length>=2){var avg=Math.round(sim.reduce(function(s,t){return s+t.actual_minutes;},0)/sim.length);e.textContent='💡 Typical: '+fm(avg)+' (from '+sim.length+' past logs)';e.classList.add('show');}else e.classList.remove('show');}

function bTimeG(id,vn){el(id).innerHTML=TIMES.map(function(t){return'<button class="tbtn" data-mins="'+t.m+'" data-vn="'+vn+'" data-gid="'+id+'">'+t.l+'</button>';}).join('');qsa('.tbtn',el(id)).forEach(function(btn){bindBubble(btn,function(){selT(this.dataset.gid,this.dataset.vn,parseInt(this.dataset.mins),this);});});}
function selT(id,v,mins,btn){qsa('#'+id+' .tbtn').forEach(function(b){b.classList.remove('on');});btn.classList.add('on');if(v==='eta')sEta=mins;else sAct=mins;}
function togRec(){isRec=!isRec;el('rtog').classList.toggle('on',isRec);el('recwrap').style.display=isRec?'block':'none';if(!isRec)recFreq=null;}
function setRec(f,btn){recFreq=f;qsa('.rbtn').forEach(function(b){b.classList.remove('on');});btn.classList.add('on');}

// TASK MODAL
function openT(){
  closeMobileNav();
  if(cu&&getNavAccess(cu.id).log_task===false){toast('You don\'t have access to log tasks','error');return;}
  el('tmtitle').textContent='Log task';el('tsave').textContent='Save task';el('teid').value='';el('tname').value='';el('tnotes').value='';el('tstat').value='done';
  sMids=cu?[cu.id]:[];
  var me=cu?members.find(function(x){return x.id===cu.id;}):null;
  sRoles=me?parseMemberRoles(me):[];
  sTTs=[];sRCs=[];sEta=null;sAct=null;isRec=false;recFreq=null;
  if(el('massignsrch'))el('massignsrch').value='';
  el('rtog').classList.remove('on');el('recwrap').style.display='none';
  qsa('.rbtn').forEach(function(b){b.classList.remove('on');});
  ['brad','bttad','brcad'].forEach(function(id){el(id).classList.remove('show');});
  bMembers();bRoles();bTTs();bRCs();bTimeG('etag','eta');bTimeG('actg','act');
  var al=el('TM').querySelector('.assign-help');if(!al){var lbl=el('TM').querySelector('.bsel .bsel-lbl');if(lbl&&!lbl.querySelector('.help-wrap'))lbl.insertAdjacentHTML('beforeend',' '+hBtn('assign'));}
  var tl=el('TM').querySelectorAll('.bsel .bsel-lbl')[2];if(tl&&!tl.querySelector('.help-wrap'))tl.insertAdjacentHTML('beforeend',' '+hBtn('tasktype'));
  el('TM').classList.add('open');
}
function openTFor(mid){openT();sMids=[mid];var m=members.find(function(x){return x.id===mid;});if(m)sRoles=parseMemberRoles(m);bMembers();bRoles();bTTs();bRCs();}
function openEditSelf(){openEM(cu.id);}
function closeTM(){el('TM').classList.remove('open');closeDrill();}

function openET(tid){
  var t=tasks.find(function(x){return x.id===tid;});if(!t)return;if(!canEditTask(t)){toast('You can only edit your own tasks','error');return;}
  el('tmtitle').textContent='Edit task';el('tsave').textContent='Update task';el('teid').value=tid;
  sMids=[t.member_id];sRoles=t.role_area?[t.role_area]:[];sTTs=parseTT(t.task_type);
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
  if(!sMids.length){toast('Select at least one member','error');return;}
  if(!sTTs.length){toast('Select at least one task type','error');return;}
  var name=el('tname').value.trim(),status=el('tstat').value,notes=el('tnotes').value.trim(),resultStr=sRCs.join(', ');
  var ttStr=taskTypesStr(),baseName=name||sTTs[0];
  var payload={name:baseName,status:status,role_area:sRoles[0]||null,task_type:ttStr,result_category:resultStr||null,notes:notes,eta_minutes:sEta||null,actual_minutes:sAct||null,is_recurring:isRec,recur_frequency:recFreq||null};
  if(eid){
    payload.member_id=sMids[0];
    var orig=tasks.find(function(t){return t.id===eid;});
    if(orig){var fields=['status','role_area','task_type','result_category','eta_minutes','actual_minutes','notes','member_id'];for(var i=0;i<fields.length;i++){var f=fields[i];if(String(orig[f]||'')!==String(payload[f]||''))await sb.from('task_history').insert([{task_id:eid,changed_by:cu.id,field_changed:f,old_value:String(orig[f]||''),new_value:String(payload[f]||''),changed_at:nowISO()}]);}}
    payload.edited_at=nowISO();payload.edited_by=cu.id;
    var r=await sb.from('tasks').update(payload).eq('id',eid);if(r.error){toast('Error updating','error');return;}toast('Task updated ✓');
  }else{
    var rows=sMids.map(function(mid){var p=Object.assign({},payload);p.member_id=mid;return p;});
    var r=await sb.from('tasks').insert(rows);if(r.error){toast('Error saving','error');return;}
    toast(rows.length>1?rows.length+' tasks logged ✓':'Task logged ✓');
  }
  closeTM();await load();
}

function delT(tid,btn){
  if(btn.textContent==='Del'||btn.textContent==='Delete'){btn.textContent='Sure?';setTimeout(function(){if(btn.textContent==='Sure?')btn.textContent='Del';},3000);return;}
  (async function(){
    var t=tasks.find(function(x){return x.id===tid;});
    if(t){var ok=await moveToTrash('task',tid,t,(parseTT(t.task_type)[0]||t.name||'Task'));if(!ok){toast('Could not move to trash','error');return;}}
    else{await sb.from('tasks').delete().eq('id',tid);}
    closeDrill();el('dd').classList.remove('open');toast('Moved to trash — restore from Trash page');await load();
  })();
}

// MEMBER MODAL
function openM(){if(!cu||!cu.isAdmin||getNavAccess(cu.id).add_member===false){toast('You don\'t have access to add members','error');return;}el('mmtitle').textContent='Add team member';el('meid').value='';el('mdel').style.display='none';['mname','mrole','mtags','mdesc','mpin'].forEach(function(id){el(id).value='';});el('madmin').value='false';el('mcolor').value='#34d399';renderSwatches('mcolorgrid','mcolor','#34d399');syncMAccessSec();el('MM').classList.add('open');}
function openEM(mid){var m=members.find(function(x){return x.id===mid;});if(!m)return;var col=(m.color&&m.color.charAt(0)==='#')?m.color:(getMC(m).text);el('mmtitle').textContent='Edit member';el('meid').value=mid;el('mdel').style.display='flex';el('mname').value=m.name||'';el('mrole').value=m.role||'';el('mtags').value=m.role_tags||'';el('mdesc').value=m.description||'';el('mpin').value=m.pin||'';el('madmin').value=m.is_admin?'true':'false';el('mcolor').value=col;renderSwatches('mcolorgrid','mcolor',col);syncMAccessSec();el('MM').classList.add('open');}
function closeMM(){el('MM').classList.remove('open');}

async function saveM(){
  var eid=el('meid').value,name=el('mname').value.trim(),role=el('mrole').value.trim(),description=el('mdesc').value.trim(),color=el('mcolor').value,role_tags=el('mtags').value.trim(),pin=el('mpin').value.trim(),is_admin=el('madmin').value==='true';
  if(!name||!role){toast('Name and role required','error');return;}
  var payload={name:name,role:role,description:description,color:color,role_tags:role_tags,pin:pin,is_admin:is_admin};
  var r=eid?await sb.from('members').update(payload).eq('id',eid):await sb.from('members').insert([payload]).select();
  if(r.error){toast('Error saving','error');return;}
  var savedId=eid||(r.data&&r.data[0]?r.data[0].id:null);
  if(cu&&cu.isAdmin&&savedId){
    if(is_admin)delete memberNavAccess[savedId];
    else if(el('mAccessSec').style.display!=='none')readMemberNavAccess(savedId);
    else if(!memberNavAccess[savedId])memberNavAccess[savedId]=Object.assign({},DEFAULT_MEMBER_NAV);
    saveAll();
  }
  closeMM();toast(eid?name+' updated ✓':name+' added ✓');
  if(eid&&cu&&cu.id===eid){cu.color=color;var c=getMC({color:color});el('uav').style.background=c.bg;el('uav').style.color=c.text;}
  await load();
  if(savedId&&cu&&cu.id===savedId&&!is_admin)applyNavAccess();
}

function delM(){
  var eid=el('meid').value;if(!eid)return;
  var btn=el('mdel');
  if(btn.textContent==='Delete'){btn.textContent='Confirm?';setTimeout(function(){if(btn.textContent==='Confirm?')btn.textContent='Delete';},3000);return;}
  (async function(){
    var m=members.find(function(x){return x.id===eid;});if(!m){toast('Error','error');return;}
    var mine=tasks.filter(function(t){return t.member_id===eid;});
    for(var i=0;i<mine.length;i++)await moveToTrash('task',mine[i].id,mine[i],parseTT(mine[i].task_type)[0]||mine[i].name||'Task');
    var ok=await moveToTrash('member',eid,m,m.name||'Member');
    if(!ok){toast('Could not move to trash','error');return;}
    closeMM();toast('Moved to trash — restore from Trash page');await load();
  })();
}


function pickHumor(key){
  if(humorOff)return'';
  var pool=HUMOR[key]||[];
  if(!pool.length)return'';
  return pool[Math.floor(Math.random()*pool.length)];
}
function toggleHumor(){humorOff=!el('humorToggle').checked;lss('4k_humor',humorOff);rCompare();}
function cmpStatBox(lbl,val,cls){return'<div class="cmp-stat"><div class="cmp-stat-l">'+lbl+'</div><div class="cmp-stat-v'+(cls?' '+cls:'')+'">'+val+'</div></div>';}
function getCmpScenario(s1,s2){
  if(s1.total===0&&s2.total===0)return'both_bad';
  if(s1.total===0)return'you_no_data';
  if(s2.total===0)return'opponent_no_data';
  if(s1.rate>=80&&s2.rate>=80)return'both_great';
  if(s1.rate<50&&s2.rate<50&&s1.total>0&&s2.total>0)return'both_bad';
  if(Math.abs(s1.rate-s2.rate)<=5)return'close_match';
  if(s1.rate>s2.rate+15)return'winning';
  if(s2.rate>s1.rate+15)return'losing_badly';
  if(s1.rate>s2.rate)return'slight_win';
  if(s2.rate>s1.rate)return'slight_loss';
  return'close_match';
}
function rCompare(){
  if(!el('lbTable'))return;
  var ranked=members.map(function(m){var s=mst(m.id);return{m:m,s:s};}).sort(function(a,b){return b.s.rate-a.s.rate||b.s.done-a.s.done||a.m.name.localeCompare(b.m.name);});
  var lbl=ranked.map(function(x){return x.m.name;}),rates=ranked.map(function(x){return x.s.rate;}),bc=rates.map(function(r){return r>=80?'#7fff6e':r>=50?'#ffb830':'#ff5c5c';});
  if(charts.lb)charts.lb.destroy();
  if(el('lbChart')){
    charts.lb=new Chart(el('lbChart'),{type:'bar',data:{labels:lbl,datasets:[{data:rates,backgroundColor:bc,borderRadius:4,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#888',font:{size:10}},grid:{display:false}},y:{min:0,max:100,ticks:{color:'#888'},grid:{color:'rgba(255,255,255,.04)'}}}}});
  }
  el('lbTable').innerHTML=ranked.length?ranked.map(function(x,i){var col=x.s.rate>=80?'var(--accent)':x.s.rate>=50?'var(--amber)':'var(--red)';return'<div class="lb-row"><span class="lb-rank">#'+(i+1)+'</span><span style="min-width:90px;font-weight:600">'+x.m.name+'</span><div class="lb-bar"><div class="lb-bar-fill" style="width:'+x.s.rate+'%;background:'+col+'"></div></div><span style="min-width:42px;color:'+col+'">'+x.s.rate+'%</span><span style="color:var(--text2)">'+x.s.done+' done · '+x.s.late+' late</span></div>';}).join(''):'<div style="color:var(--text3);font-size:12px;padding:8px 0">No task data yet.</div>';
  var panels=qsa('.cmp-panel');
  if(panels[0]){var t0=panels[0].querySelector('.cmp-title');if(t0&&!t0.querySelector('.help-slot'))t0.innerHTML='<span>🏆 Leaderboard</span><span class="help-slot" data-help="cmp_leaderboard"></span>';}
  if(panels[1]){var t1=panels[1].querySelector('.cmp-title');if(t1&&!t1.querySelector('.help-slot'))t1.innerHTML='<span>⚔️ 1v1 Compare</span><span class="help-slot" data-help="cmp_1v1"></span>';}
  var ht=el('humorToggle');if(ht&&!ht.parentElement.querySelector('.help-slot')){var lbl=ht.parentElement;lbl.insertAdjacentHTML('beforeend',' <span class="help-slot" data-help="cmp_humor"></span>');}
  fillHelpSlots();
  var q=(el('cmpSearch')?el('cmpSearch').value||'':'').toLowerCase();
  var show=members.filter(function(m){return!q||m.name.toLowerCase().includes(q);});
  if(!cmpMeId&&cu)cmpMeId=cu.id;
  function bub(id,sel,wrap){return show.map(function(m){var c=getMC(m),on=sel===m.id;return'<span class="sb'+(on?' on':'')+'" style="'+(on?'border-color:'+c.text+';color:'+c.text+';background:'+c.bg:'')+'" data-cmp="'+wrap+'" data-mid="'+m.id+'">'+m.name+'</span>';}).join('');}
  el('cmpMe').innerHTML=bub(cmpMeId,cmpMeId,'me');
  el('cmpThem').innerHTML=bub(cmpThemId,cmpThemId,'them');
  qsa('[data-cmp]',el('cmpMe').parentElement.parentElement).forEach(function(s){
    s.onclick=function(){var w=this.dataset.cmp,mid=this.dataset.mid;if(w==='me')cmpMeId=mid;else cmpThemId=mid;rCompare();};
  });
  var res=el('cmpResult');
  if(!cmpMeId||!cmpThemId){res.innerHTML='<div style="color:var(--text3);font-size:12px;text-align:center">Pick two names to compare.</div>';return;}
  if(cmpMeId===cmpThemId){res.innerHTML='<div style="color:var(--text3);font-size:12px;text-align:center">Pick two different people.</div>';return;}
  var m1=members.find(function(m){return m.id===cmpMeId;}),m2=members.find(function(m){return m.id===cmpThemId;});
  var s1=mst(cmpMeId),s2=mst(cmpThemId);
  var pairKey=cmpMeId+'|'+cmpThemId;
  if(humorLastPair!==pairKey){humorLastPair=pairKey;}
  var humor=!humorOff?pickHumor(getCmpScenario(s1,s2)):'';
  var h=humor?'<div class="cmp-humor">'+humor+'</div>':'';
  h+='<div class="cmp-side"><div><div style="font-size:12px;font-weight:600;margin-bottom:8px">'+m1.name+'</div>'+cmpStatBox('Completion',s1.rate+'%',s1.rate>=80?'g':s1.rate>=50?'a':'r')+cmpStatBox('Tasks done',s1.done,'')+cmpStatBox('Late',s1.late,s1.late?'r':'')+'</div>';
  h+='<div><div style="font-size:12px;font-weight:600;margin-bottom:8px">'+m2.name+'</div>'+cmpStatBox('Completion',s2.rate+'%',s2.rate>=80?'g':s2.rate>=50?'a':'r')+cmpStatBox('Tasks done',s2.done,'')+cmpStatBox('Late',s2.late,s2.late?'r':'')+'</div></div>';
  res.innerHTML=h;
}


function gp(page,btn){
  closeMobileNav();
  var access=cu?getNavAccess(cu.id):{};
  if(access[page]===false){toast('You don\'t have access to this section','error');return;}
  qsa('.page').forEach(function(p){p.classList.remove('active');});
  qsa('.ni').forEach(function(b){b.classList.remove('active');});
  el('page-'+page).classList.add('active');
  if(btn&&btn.classList&&btn.classList.contains('ni'))btn.classList.add('active');
  if(page==='calendar'){renderCal();rMyTasks();}
  if(page==='performance')rCharts();
  if(page==='oversight')rOversight();
  if(page==='intelligence')rIntel();
  if(page==='library')rLib();
  if(page==='results'){refreshResFilters();rResults();}
  if(page==='trash')rTrash();
  if(page==='roles')rRoles();
  if(page==='compare')rCompare();
}

// FEEDBACK
function setStar(n){fbRating=n;qsa('#starRow .star').forEach(function(s){s.classList.toggle('on',parseInt(s.dataset.v,10)<=n);});}
function openFeedback(){fbRating=0;el('fbComment').value='';qsa('#starRow .star').forEach(function(s){s.classList.remove('on');});var sec=el('fbAdminSec');if(sec)sec.style.display=cu&&cu.isAdmin?'block':'none';if(cu&&cu.isAdmin)loadFeedbackList();el('FBM').classList.add('open');}
function closeFeedback(){el('FBM').classList.remove('open');}
async function saveFeedback(){
  if(!fbRating){toast('Pick a star rating','error');return;}
  if(!cu)return;
  var r=await sb.from('feedback').insert([{member_id:cu.id,rating:fbRating,comment:el('fbComment').value.trim()||null}]);
  if(r.error){toast('Could not save — run supabase_migration.sql first','error');return;}
  toast('Feedback sent — thank you! ✓');closeFeedback();if(cu.isAdmin)loadFeedbackList();
}
async function loadFeedbackList(){
  var r=await sb.from('feedback').select('*').order('created_at',{ascending:false}).limit(50);
  feedbackList=r.data||[];
  var list=el('fbList');if(!list)return;
  if(!feedbackList.length){list.innerHTML='<div style="color:var(--text3);font-size:12px">No feedback yet.</div>';return;}
  list.innerHTML=feedbackList.map(function(f){
    var m=members.find(function(x){return x.id===f.member_id;});
    var stars='★'.repeat(f.rating)+'☆'.repeat(5-f.rating);
    return'<div class="fb-item"><div class="fb-item-head"><span style="font-weight:600">'+(m?m.name:'Unknown')+'</span><span class="fb-stars">'+stars+'</span></div>'+(f.comment?'<div style="color:var(--text2);margin-bottom:4px">'+f.comment+'</div>':'')+'<div class="fb-meta">'+fmtDT(f.created_at)+'</div></div>';
  }).join('');
}

// ROLE NOTES
async function loadRoleNotes(){
  try{
    var r=await sb.from('role_notes').select('*');
    roleNotesCache={};
    (r.data||[]).forEach(function(n){roleNotesCache[n.role_name]=n;});
  }catch(e){roleNotesCache={};}
}
function openRoleNotes(role){
  curNoteRole=role;
  var info=getCatInfo(role);
  el('rnTitle').textContent=info.name+' — Notes';
  gp('rolenotes',null);
  var note=roleNotesCache[role];
  el('rnContent').value=note?note.content||'':'';
  updateNoteMeta(note);
}
function updateNoteMeta(note){
  var meta=el('rnMeta');
  if(!meta)return;
  if(note&&note.updated_at){
    var m=members.find(function(x){return x.id===note.updated_by;});
    meta.textContent='Last updated by '+(m?m.name:'someone')+' · '+fmtDT(note.updated_at);
  }else meta.textContent='No notes yet — start writing!';
}
async function saveRoleNotes(){
  if(!curNoteRole||!cu)return;
  var content=el('rnContent').value;
  var existing=roleNotesCache[curNoteRole];
  var payload={role_name:curNoteRole,content:content,updated_by:cu.id,updated_at:nowISO()};
  var r;
  if(existing&&existing.id)r=await sb.from('role_notes').update(payload).eq('id',existing.id);
  else r=await sb.from('role_notes').upsert([payload],{onConflict:'role_name'});
  if(r.error){toast('Could not save — run supabase_migration.sql first','error');return;}
  toast('Notes saved ✓');
  await loadRoleNotes();
  updateNoteMeta(roleNotesCache[curNoteRole]);
}

// RESULTS
async function loadResultPosts(){
  try{
    var r=await sb.from('result_posts').select('*').order('created_at',{ascending:false});
    resultPosts=r.data||[];
  }catch(e){resultPosts=[];}
}
function parseResFiles(r){
  var files=r.file_urls||r.files;
  if(!files)return[];
  if(typeof files==='string'){try{files=JSON.parse(files);}catch(e){return[];}}
  if(!Array.isArray(files))return[];
  return files.map(function(item){
    if(typeof item==='object'&&item&&item.url)return item;
    if(typeof item!=='string')return null;
    if(item.charAt(0)==='{'){try{return JSON.parse(item);}catch(e){}}
    return{name:item.split('/').pop()||'File',url:item,type:''};
  }).filter(Boolean);
}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function getResultsPool(){
  if(!cu)return resultPosts.slice();
  if(cu.isAdmin)return resultPosts.slice();
  var ids={};
  getTeamVisible().forEach(function(m){ids[m.id]=true;});
  ids[cu.id]=true;
  return resultPosts.filter(function(r){return ids[r.member_id];});
}
function refreshResFilters(){
  var mf=el('resMemberFilter');
  if(mf){
    var cur=mf.value,pool=cu&&cu.isAdmin?members.slice():getTeamVisible().slice();
    if(cu&&!pool.some(function(m){return m.id===cu.id;}))pool.push(cu);
    mf.innerHTML='<option value="all">All members</option><option value="mine">My results</option>'+pool.map(function(m){return'<option value="'+m.id+'">'+esc(m.name)+'</option>';}).join('');
    if(cur&&Array.from(mf.options).some(function(o){return o.value===cur;}))mf.value=cur;
  }
}
function fmtResDate(d){
  var dt=parseDT(d),now=new Date();
  if(!dt)return'—';
  if(dt.toDateString()===now.toDateString())return'Today · '+dt.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
  return dt.toLocaleDateString(undefined,{month:'short',day:'numeric',year:dt.getFullYear()!==now.getFullYear()?'numeric':undefined})+' · '+dt.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
}
function rResults(){
  var grid=el('resGrid');if(!grid)return;
  var q=(el('resSearch')?el('resSearch').value:'').toLowerCase();
  var memberF=el('resMemberFilter')?el('resMemberFilter').value:'all';
  var dateF=el('resDateFilter')?el('resDateFilter').value:'all';
  var list=getResultsPool();
  if(memberF==='mine'&&cu)list=list.filter(function(r){return r.member_id===cu.id;});
  else if(memberF!=='all')list=list.filter(function(r){return r.member_id===memberF;});
  if(dateF!=='all'){
    var now=new Date();
    list=list.filter(function(r){
      var d=new Date(r.created_at);
      if(dateF==='today')return d.toDateString()===now.toDateString();
      if(dateF==='week')return now-d<7*86400000;
      if(dateF==='month')return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
      return true;
    });
  }
  if(q)list=list.filter(function(r){var m=members.find(function(x){return x.id===r.member_id;});return(r.title||'').toLowerCase().includes(q)||(r.result_type||'').toLowerCase().includes(q)||(r.notes||'').toLowerCase().includes(q)||(m?m.name:'').toLowerCase().includes(q);});
  if(!list.length){grid.innerHTML='<div class="res-empty">No results yet — hit "+ Add result" to log your first win with screenshots.</div>';return;}
  grid.innerHTML=list.map(function(r){
    var m=members.find(function(x){return x.id===r.member_id;}),c=getMC(m),files=parseResFiles(r);
    var imgs=files.filter(function(f){return f.type&&f.type.indexOf('image/')===0;});
    var others=files.filter(function(f){return!f.type||f.type.indexOf('image/')!==0;});
    var media='';
    if(imgs.length)media+='<div class="res-imgs">'+imgs.map(function(f){return'<a href="'+esc(f.url)+'" target="_blank" rel="noopener"><img src="'+esc(f.url)+'" alt=""></a>';}).join('')+'</div>';
    if(others.length)media+='<div class="res-files">'+others.map(function(f){return'<a href="'+esc(f.url)+'" target="_blank" rel="noopener" class="res-file-link">📎 '+esc(f.name)+'</a>';}).join('')+'</div>';
    var canEdit=cu&&(cu.isAdmin||r.member_id===cu.id);
    var actions=canEdit?'<div class="res-foot"><div class="res-actions"><button class="btn sm res-edit" data-rid="'+r.id+'">Edit</button><button class="btn sm danger res-del" data-rid="'+r.id+'">Delete</button></div></div>':'';
    return'<div class="res-card" data-rid="'+r.id+'"><div class="res-head"><div class="res-av" style="background:'+c.bg+';color:'+c.text+'">'+ini(m?m.name:'?')+'</div><div class="res-meta"><div class="res-author">'+esc(m?m.name:'Unknown')+'</div><div class="res-date">'+fmtResDate(r.created_at)+'</div></div><span class="res-type">'+esc(r.result_type||'Result')+'</span></div><div class="res-title">'+esc(r.title)+'</div>'+(r.notes?'<div class="res-notes">'+esc(r.notes)+'</div>':'')+media+actions+'</div>';
  }).join('');
  qsa('.res-edit',grid).forEach(function(btn){btn.onclick=function(){openEditResult(this.dataset.rid);};});
  qsa('.res-del',grid).forEach(function(btn){btn.onclick=function(){askDelResult(this.dataset.rid,this);};});
}
function bResultTypes(){
  var roles=cu?(function(){var m=members.find(function(x){return x.id===cu.id;});return m?parseMemberRoles(m):[];})():[];
  var RC=getRCForRoles(roles),wrap=el('brtype');if(!wrap)return;
  wrap.innerHTML=RC.map(function(r){return'<span class="sb'+(sResultType===r?' on':'')+'" data-rtype="'+esc(r)+'">'+esc(r)+'<span class="sbx" data-xrtype="'+esc(r)+'">✕</span></span>';}).join('')+'<button type="button" class="add-bub" onclick="el(\'rtypead\').classList.add(\'show\')">+ Add</button>';
  qsa('[data-rtype]',wrap).forEach(function(s){bindBubble(s,function(){sResultType=this.dataset.rtype;bResultTypes();},'.sbx,[data-xrtype]');});
  qsa('[data-xrtype]',wrap).forEach(function(s){bindBubbleX(s,function(){delResultType(this.dataset.xrtype);});});
}
function delResultType(r){
  var roles=cu?(function(){var m=members.find(function(x){return x.id===cu.id;});return m?parseMemberRoles(m):[];})():[];
  removeRC(r,roles);
  if(sResultType===r)sResultType=getRCForRoles(roles)[0]||null;
  saveAll();bResultTypes();toast('"'+r+'" removed');
}
function addResultType(){
  var val=cap(el('rtypei').value.trim());if(!val)return;
  el('rtypei').value='';el('rtypead').classList.remove('show');
  var roles=cu?(function(){var m=members.find(function(x){return x.id===cu.id;});return m?parseMemberRoles(m):[];})():[];
  addCustomRC(val,roles);
  sResultType=val;saveAll();bResultTypes();toast('"'+val+'" added');
}
function openResultModal(){
  editingResultId=null;
  el('rmtitle').textContent='Add result';
  el('rsaveBtn').textContent='Post result';
  el('rtitle').value='';el('rnotes').value='';pendingResultFiles=[];keptResultFiles=[];el('filePreviews').innerHTML='';
  var roles=cu?(function(){var m=members.find(function(x){return x.id===cu.id;});return m?parseMemberRoles(m):[];})():[];
  sResultType=getRCForRoles(roles)[0]||null;el('rtypead').classList.remove('show');
  bResultTypes();
  el('RM').classList.add('open');
}
function openEditResult(id){
  var r=resultPosts.find(function(x){return x.id===id;});if(!r)return;
  if(!cu||(r.member_id!==cu.id&&!cu.isAdmin)){toast('You can only edit your own results','error');return;}
  editingResultId=id;
  el('rmtitle').textContent='Edit result';
  el('rsaveBtn').textContent='Save changes';
  el('rtitle').value=r.title||'';
  el('rnotes').value=r.notes||'';
  pendingResultFiles=[];
  keptResultFiles=parseResFiles(r);
  sResultType=r.result_type||getRCForRoles((function(){var m=members.find(function(x){return x.id===cu.id;});return m?parseMemberRoles(m):[];})())[0]||null;
  el('rtypead').classList.remove('show');
  bResultTypes();
  renderFilePreviews();
  el('RM').classList.add('open');
}
function closeResultModal(){el('RM').classList.remove('open');editingResultId=null;pendingResultFiles=[];keptResultFiles=[];el('filePreviews').innerHTML='';}
function previewResultFiles(){var inp=el('rfiles');if(!inp||!inp.files)return;for(var i=0;i<inp.files.length;i++)pendingResultFiles.push(inp.files[i]);inp.value='';renderFilePreviews();}
function renderFilePreviews(){
  var box=el('filePreviews');if(!box)return;
  var items=keptResultFiles.map(function(f,i){return{kind:'kept',file:f,index:i};}).concat(pendingResultFiles.map(function(f,i){return{kind:'new',file:f,index:i};}));
  box.innerHTML=items.map(function(item,i){
    var f=item.file,isImg=f.type&&f.type.indexOf('image/')===0;
    var preview=isImg?'<img src="'+(item.kind==='new'?URL.createObjectURL(f):esc(f.url))+'" class="fp-thumb" alt="">':'<span class="fp-icon">📄</span>';
    return'<div class="fp-item">'+preview+'<span class="fp-name">'+esc(f.name)+'</span><button type="button" class="fp-x" data-fi="'+i+'" data-fk="'+item.kind+'" data-idx="'+item.index+'">✕</button></div>';
  }).join('');
  qsa('.fp-x',box).forEach(function(btn){btn.onclick=function(e){
    e.stopPropagation();
    if(this.dataset.fk==='kept')keptResultFiles.splice(parseInt(this.dataset.idx,10),1);
    else pendingResultFiles.splice(parseInt(this.dataset.idx,10),1);
    renderFilePreviews();
  };});
}
function setupFileDrop(){
  var drop=el('fileDrop');if(!drop)return;
  ['dragenter','dragover'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();e.stopPropagation();drop.classList.add('drag');});});
  ['dragleave','drop'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();e.stopPropagation();drop.classList.remove('drag');});});
  drop.addEventListener('drop',function(e){if(e.dataTransfer&&e.dataTransfer.files){for(var i=0;i<e.dataTransfer.files.length;i++)pendingResultFiles.push(e.dataTransfer.files[i]);renderFilePreviews();}});
}
async function uploadResultFiles(files){
  var out=[];
  for(var i=0;i<files.length;i++){
    var f=files[i],safe=f.name.replace(/[^a-zA-Z0-9._-]/g,'_'),path=(cu?cu.id:'anon')+'/'+Date.now()+'_'+i+'_'+safe;
    var up=await sb.storage.from('result-files').upload(path,f,{upsert:false,contentType:f.type||undefined});
    if(up.error)throw up.error;
    var pub=sb.storage.from('result-files').getPublicUrl(path);
    out.push({name:f.name,url:pub.data.publicUrl,type:f.type||''});
  }
  return out;
}
function fireConfetti(){
  var c=document.createElement('canvas');
  c.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:99999';
  c.width=window.innerWidth;c.height=window.innerHeight;
  document.body.appendChild(c);
  var ctx=c.getContext('2d'),colors=['#7fff6e','#ffb830','#5b9cf6','#fb7185','#a78bfa','#34d399'],parts=[];
  for(var i=0;i<130;i++)parts.push({x:Math.random()*c.width,y:-Math.random()*c.height*.5,vx:(Math.random()-.5)*8,vy:Math.random()*4+2,r:Math.random()*6+3,color:colors[Math.floor(Math.random()*colors.length)],rot:Math.random()*360,vr:(Math.random()-.5)*12});
  var frames=0;
  (function tick(){
    ctx.clearRect(0,0,c.width,c.height);
    var alive=false;
    parts.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.18;p.rot+=p.vr;
      if(p.y<c.height+24){alive=true;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.color;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);ctx.restore();}
    });
    frames++;
    if(alive&&frames<200)requestAnimationFrame(tick);else c.remove();
  })();
}
async function saveResult(){
  var title=el('rtitle').value.trim();
  if(!title){toast('Title required','error');return;}
  if(!sResultType){toast('Pick a result type','error');return;}
  if(!cu)return;
  if(resultBusy)return;
  var btn=el('rsaveBtn');resultBusy=true;btn.disabled=true;btn.textContent=editingResultId?'Saving...':'Uploading...';
  try{
    var newFiles=pendingResultFiles.length?await uploadResultFiles(pendingResultFiles):[];
    var files=keptResultFiles.concat(newFiles);
    var payload={title:title,result_type:sResultType,notes:el('rnotes').value.trim()||null,file_urls:files.map(function(f){return JSON.stringify(f);})};
    var r;
    if(editingResultId){
      r=await sb.rpc('update_result_post',{post_id:editingResultId,p_title:title,p_result_type:sResultType,p_notes:el('rnotes').value.trim()||null,p_file_urls:files.map(function(f){return JSON.stringify(f);})});
      if(r.error||!r.data){
        r=await sb.from('result_posts').update(payload).eq('id',editingResultId).select();
        if(r.error){toast(r.error.message||'Could not update result','error');return;}
        if(!r.data||!r.data.length){toast('Could not update — run the QUICK FIX block at the top of supabase_migration.sql','error');return;}
      }
    }else{
      r=await sb.from('result_posts').insert([Object.assign({member_id:cu.id},payload)]).select();
      if(r.error){toast(r.error.message||'Could not save result','error');return;}
    }
    if(editingResultId){toast('Result updated ✓');closeResultModal();await loadResultPosts();rResults();render();}
    else{fireConfetti();toast('Result posted ✓');closeResultModal();await loadResultPosts();rResults();render();}
  }catch(e){toast((e&&e.message)||'Upload failed — check storage bucket setup','error');}
  resultBusy=false;btn.disabled=false;btn.textContent=editingResultId?'Save changes':'Post result';
}
function askDelResult(id,btn){
  if(resultBusy)return;
  var card=btn.closest('.res-card');if(!card)return;
  var foot=card.querySelector('.res-foot');if(!foot)return;
  foot.innerHTML='<div class="res-confirm"><span>Delete this result?</span><button class="btn sm danger" data-yes="'+id+'">Yes, delete</button><button class="btn sm res-cancel">Cancel</button></div>';
  foot.querySelector('.res-cancel').onclick=function(){rResults();};
  foot.querySelector('[data-yes]').onclick=function(){confirmDelResult(id,this);};
}
async function confirmDelResult(id,btn){
  if(resultBusy)return;
  resultBusy=true;btn.disabled=true;btn.textContent='Deleting...';
  var item=resultPosts.find(function(x){return x.id===id;});
  var ok=item?await moveToTrash('result',id,item,item.title||'Result'):false;
  if(!ok){
    var r=await sb.rpc('delete_result_post',{post_id:id});
    if(r.error||!r.data){
      var fb=await sb.from('result_posts').delete().eq('id',id).select('id');
      if(fb.error||!fb.data||!fb.data.length){
        resultBusy=false;
        toast('Could not delete — run supabase_migration.sql in SQL Editor','error');
        rResults();
        return;
      }
    }
  }
  resultBusy=false;
  resultPosts=resultPosts.filter(function(x){return x.id!==id;});
  toast(ok?'Moved to trash — restore from Trash page':'Result deleted');rResults();render();
}

// TRASH & RECOVERY
async function loadTrash(){
  var local=(ls('4k_trash')||[]).filter(function(x){return x.local;});
  try{
    var r=await sb.from('trash_bin').select('*').order('deleted_at',{ascending:false});
    trashItems=(r.data||[]).concat(local);
  }catch(e){trashItems=local;}
}
function getTrashPool(){
  if(!cu)return trashItems.slice();
  if(cu.isAdmin)return trashItems.slice();
  return trashItems.filter(function(t){
    if(t.deleted_by===cu.id)return true;
    var p=t.payload||{};
    return p.member_id===cu.id;
  });
}
function trashTypeLabel(t){return t==='task'?'Task':t==='result'?'Result':t==='member'?'Profile':'Item';}
function trashTypeIcon(t){return t==='task'?'📋':t==='result'?'🎯':t==='member'?'👤':'🗑️';}
function rTrash(){
  var box=el('trashList');if(!box)return;
  var q=(el('trashSearch')?el('trashSearch').value:'').toLowerCase();
  var filt=el('trashFilter')?el('trashFilter').value:'all';
  var list=getTrashPool();
  if(filt!=='all')list=list.filter(function(t){return t.item_type===filt;});
  if(q)list=list.filter(function(t){return(t.title||'').toLowerCase().includes(q)||t.item_type.includes(q);});
  if(!list.length){box.innerHTML='<div class="trash-empty">Trash is empty — deleted tasks, results, and profiles will appear here for recovery.</div>';return;}
  box.innerHTML=list.map(function(t){
    var by=members.find(function(m){return m.id===t.deleted_by;});
    var meta='Deleted '+fmtDT(t.deleted_at)+(by?' · by '+by.name:'');
    return'<div class="trash-item" data-tid="'+t.id+'"><div class="trash-icon">'+trashTypeIcon(t.item_type)+'</div><div class="trash-body"><div class="trash-title">'+esc(t.title||'Untitled')+'</div><div class="trash-meta">'+esc(meta)+'</div></div><span class="trash-type">'+trashTypeLabel(t.item_type)+'</span><div class="trash-actions"><button class="btn sm p" data-restore="'+t.id+'">Restore</button><button class="btn sm danger" data-purge="'+t.id+'">Delete forever</button></div></div>';
  }).join('');
  qsa('[data-restore]',box).forEach(function(btn){btn.onclick=function(){restoreTrashItem(this.dataset.restore);};});
  qsa('[data-purge]',box).forEach(function(btn){btn.onclick=function(){purgeTrashItem(this.dataset.purge,this);};});
}
async function moveToTrash(type,id,payload,title){
  try{
    var r=await sb.rpc('move_to_trash',{p_type:type,p_id:id,p_payload:payload,p_title:title,p_deleted_by:cu?cu.id:null});
    if(!r.error&&r.data){await loadTrash();return true;}
  }catch(e){}
  var local={id:'local_'+Date.now()+'_'+Math.random().toString(36).slice(2),item_type:type,item_id:id,title:title,payload:payload,deleted_by:cu?cu.id:null,deleted_at:nowISO(),local:true};
  var lt=ls('4k_trash')||[];lt.unshift(local);lss('4k_trash',lt);
  if(type==='task'){await sb.from('task_history').delete().eq('task_id',id);await sb.from('tasks').delete().eq('id',id);}
  else if(type==='result'){await sb.rpc('delete_result_post',{post_id:id});}
  else if(type==='member'){await sb.from('members').delete().eq('id',id);}
  trashItems=lt.concat(trashItems.filter(function(x){return!x.local}));
  return true;
}
async function restoreTrashItem(trashId){
  var item=trashItems.find(function(x){return x.id===trashId;});
  if(!item){toast('Item not found','error');return;}
  if(item.local){
    var p=item.payload;
    if(item.item_type==='task')await sb.from('tasks').insert([p]);
    else if(item.item_type==='result')await sb.from('result_posts').insert([p]);
    else if(item.item_type==='member')await sb.from('members').insert([p]);
    var lt=(ls('4k_trash')||[]).filter(function(x){return x.id!==trashId;});lss('4k_trash',lt);
  }else{
    var r=await sb.rpc('restore_from_trash',{p_trash_id:trashId});
    if(r.error||!r.data){toast(r.error?r.error.message:'Could not restore — run trash migration SQL','error');return;}
  }
  toast('Restored ✓');await load();if(el('page-trash').classList.contains('active'))rTrash();
}
async function purgeTrashItem(trashId,btn){
  if(btn.dataset.confirm!=='yes'){btn.textContent='Sure?';btn.dataset.confirm='yes';setTimeout(function(){if(btn.dataset.confirm==='yes'){btn.textContent='Delete forever';btn.dataset.confirm='';}},3000);return;}
  var item=trashItems.find(function(x){return x.id===trashId;});
  if(item&&item.local){
    var lt=(ls('4k_trash')||[]).filter(function(x){return x.id!==trashId;});lss('4k_trash',lt);
  }else{
    var r=await sb.rpc('purge_from_trash',{p_trash_id:trashId});
    if(r.error){toast('Could not remove','error');return;}
  }
  trashItems=trashItems.filter(function(x){return x.id!==trashId;});
  toast('Permanently deleted');rTrash();
}

// WIPE ALL DATA (admin — keeps member accounts)
function openWipeModal(){
  if(!cu||!cu.isAdmin){toast('Only admins can erase agency data','error');return;}
  el('wipeConfirm').value='';
  el('wipeBtn').textContent='Erase all data';
  el('wipeBtn').disabled=true;
  el('WPM').classList.add('open');
}
function closeWipeModal(){el('WPM').classList.remove('open');}
function onWipeType(){
  var btn=el('wipeBtn');
  if(btn)btn.disabled=(el('wipeConfirm').value.trim().toUpperCase()!=='ERASE');
}
async function confirmWipeData(){
  if(!cu||!cu.isAdmin)return;
  if(el('wipeConfirm').value.trim().toUpperCase()!=='ERASE'){toast('Type ERASE to confirm','error');return;}
  var btn=el('wipeBtn');
  btn.disabled=true;btn.textContent='Erasing…';
  try{
    var r=await sb.rpc('wipe_agency_data');
    if(r.error){
      console.warn('wipe RPC failed, falling back',r.error);
      await wipeDataFallback();
    }
    resetLocalPrefs();
    tasks=[];hist=[];resultPosts=[];trashItems=[];feedbackList=[];roleNotesCache={};
    closeWipeModal();
    toast('All agency data erased — team accounts kept');
    await fetchAndRender(false);
  }catch(e){
    console.error('wipe failed',e);
    toast('Could not erase data — run supabase_migration.sql','error');
    btn.disabled=false;btn.textContent='Erase all data';
  }
}
async function wipeDataFallback(){
  await sb.from('task_history').delete().neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('tasks').delete().neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('result_posts').delete().neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('feedback').delete().neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('role_notes').delete().neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('trash_bin').delete().neq('id','00000000-0000-0000-0000-000000000000');
  await sb.from('settings').delete().eq('key','agency_prefs');
}
function resetLocalPrefs(){
  RCOLS={};customRA={};delBase={tasks:{},rc:[],rcByRole:{}};customRC=[];customRCByRole={};catMeta={};catOrder=null;loginOrder=null;rolesOrder=null;memberNavAccess={};
  ['4k_rc','4k_cra','4k_del','4k_crc','4k_crcr','4k_cm','4k_co','4k_lo','4k_ro','4k_mna','4k_trash'].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
}

function subscribeRealtime(){
  if(!sb||!cu)return;
  sb.channel('kpi').on('postgres_changes',{event:'*',schema:'public',table:'tasks'},function(){if(cu)fetchAndRender(false);}).on('postgres_changes',{event:'*',schema:'public',table:'members'},function(){if(cu)fetchAndRender(false);}).on('postgres_changes',{event:'*',schema:'public',table:'task_history'},function(){if(cu)fetchAndRender(false);}).on('postgres_changes',{event:'*',schema:'public',table:'role_notes'},function(){if(cu)loadRoleNotes();}).on('postgres_changes',{event:'*',schema:'public',table:'result_posts'},function(){if(!cu)return;loadResultPosts().then(function(){if(el('page-results').classList.contains('active'))rResults();if(el('page-dashboard').classList.contains('active'))genIns();});}).on('postgres_changes',{event:'*',schema:'public',table:'trash_bin'},function(){if(!cu)return;loadTrash().then(function(){if(el('page-trash').classList.contains('active'))rTrash();});}).subscribe();
}

function toast(msg,type){type=type||'success';var t=el('toast');if(!t)return;t.textContent=msg;t.className='toast '+type+' show';setTimeout(function(){t.className='toast';},2600);}

// MODAL CLOSE ON BACKDROP
['TM','MM','ECM','FBM','RM','WPM'].forEach(function(id){var node=el(id);if(node)node.addEventListener('click',function(e){if(e.target===node)node.classList.remove('open');});});
var ddOv=el('DD');if(ddOv)ddOv.addEventListener('click',function(e){if(e.target===ddOv)closeDrill();});
var ddEl=el('dd');if(ddEl){var ddBtn=ddEl.querySelector('button');if(ddBtn)ddBtn.addEventListener('click',function(){ddEl.classList.remove('open');});}

initLogin();
initSidebar();
