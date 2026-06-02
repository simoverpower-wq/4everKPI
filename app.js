const APP_VER='20260527.56';
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
  dashboard:'Your overseer home base — everything you\'ve logged for the team shows up here so you can see at a glance how the agency is pacing today.',
  pulse:'The agency pulse is today\'s completion score — the percentage of assigned tasks checked off as done. It resets each day.',
  pulse_pct:'The ring equals done ÷ scheduled tasks for that day. ETA and actual time show on tasks but do not affect the pulse.',
  streak:'Counts consecutive days you\'ve logged at least one task for the team. Keep it alive by tracking work every day.',
  kpis:'Quick score counters for the agency — tap any card (except Team tracking) to see the tasks behind the number.',
  kpi_logged:'Every task you\'ve logged for the team, all together. Your running tally of what\'s being tracked.',
  kpi_completed:'Tasks marked as "Done." The percentage below shows what share of tracked tasks are finished.',
  kpi_late:'Tasks missed or finished late — needs attention before they pile up.',
  kpi_tasktime:'Average time tasks actually take once you log actual minutes. Core data for planning ETAs and freeing up the day.',
  kpi_etaacc:'How actual time compares to ETA across timed tasks. Under estimate (green) = faster than planned; over = running long.',
  kpi_team:'Team members actively being tracked for KPIs. Inactive members (not tracking yet) are excluded from pulse and insights.',
  inactive_member:'Inactive means you haven\'t started logging or tracking this person\'s work yet. They won\'t count against agency pulse or show up in "nothing tracked today" nudges.',
  insights:'Live nudges for the overseer — who still needs tasks logged, who\'s over ETA, and how the agency is pacing. Updates as you track the day.',
  team:'Your full team roster on the dashboard — every account, always up to date. Click anyone to see their profile. Search to find someone by name.',
  calendar:'A month-view calendar of who did what and when. Click any day to open Daily profiles for that date. The colored dots show tasks on that date.',
  cal_filter:'Filter the calendar to only show tasks from one person — like zooming in on one player\'s stats instead of the whole team.',
  cal_summary:'A quick recap of the whole month — total tasks, how many finished, how many late, and the overall completion rate.',
  tasks:'Daily profiles — everyone\'s tasks for the day in a wrapped grid. Click a task name to rename it, tap 📋 for steps/description. Check off, edit, clear a day, revert, or restore saved versions.',
  performance:'Charts that turn your task data into pictures — like report cards with graphs. Click any chart to see the full list of tasks behind it.',
  chart_completion:'Shows each person\'s completion rate as a bar. Taller green bars = more tasks finished. It\'s like comparing test scores across the class.',
  chart_time:'Compares how long tasks actually took (blue) vs how long people estimated (purple). If blue is taller, they took longer than expected — like thinking a drive is 10 minutes but it takes 20.',
  chart_status:'A donut chart splitting all tasks into Done, In progress, Pending, and Late. Think of it as sorting your laundry into clean, dirty, in the washer, and lost-sock piles.',
  chart_late:'Shows how many late tasks each person has. Red bars = missed deadlines. Like a tardy count in school — you want zeros.',
  chart_results:'Breaks down what kinds of results the team is producing — DMs sent, leads found, etc. Shows which outcomes happen most often.',
  chart_trend:'A line graph of how many tasks were logged each day over the last 2 weeks. Spikes mean busy days; flat lines mean quiet days.',
  oversight:'A "needs help right now" dashboard for admins. Like a teacher\'s desk with all the papers that need grading or follow-up.',
  os_notlogged:'Team members with no tasks logged for them today yet — your cue to log their lineup.',
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
  assign:'Who this task is for — who you\'re overseeing on this one. Pick one or more people on their lineup.',
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
const FL={status:'Status',role_area:'Role area',task_type:'Task type',result_category:'Result',eta_minutes:'ETA',actual_minutes:'Actual time',notes:'Notes',work_notes:'Work log',member_id:'Assigned to',name:'Description',display_name:'Task name',scheduled_start_time:'Start time'};
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
function canEditTask(t){if(!cu||!t)return false;return cu.isAdmin||isSelfMember(t.member_id);}
function canDelTask(t){if(!cu||!t)return false;return cu.isAdmin||isSelfMember(t.member_id);}
function isSelfMember(mid){return !!(cu&&mid!=null&&String(mid)===String(cu.id));}
function taskTypeLabel(t){
  var types=parseTT(t&&t.task_type);
  return types.length?types.join(' · '):'';
}
function taskDisplayLabel(t){
  if(!t)return'Task';
  var dn=(t.display_name||'').trim();
  if(!dn&&t.id)dn=(getLocalTaskDisplayName(t.id)||'').trim();
  if(dn)return dn;
  var tl=taskTypeLabel(t);
  if(tl)return tl;
  var desc=(t.name||'').trim();
  if(desc){
    var first=desc.split('\n')[0].trim();
    if(first)return first.length>72?first.slice(0,70)+'…':first;
  }
  return'Task';
}
function taskDisplayPlaceholder(t){return taskTypeLabel(t)||'Name this task…';}
function taskShortLabel(t){
  var lbl=taskDisplayLabel(t);
  lbl=(lbl||'task').trim();
  return lbl.length>24?lbl.slice(0,22)+'…':lbl;
}
function taskActionButtons(t,opts){
  opts=opts||{};
  if(!t||(!canEditTask(t)&&!canDelTask(t)))return'';
  var lbl=taskShortLabel(t),compact=!!opts.compact,labeled=opts.labeled!==false&&!compact;
  var editLbl=t._isOccurrence?'Edit this day':(labeled?'Edit · '+lbl:'Edit');
  var delLbl=labeled?'Del · '+lbl:'Del';
  var h='';
  if(canEditTask(t))h+='<button type="button" class="btn sm" data-et="'+t.id+'"'+(t._isOccurrence?' data-occ="'+t._occurrenceDate+'"':'')+' title="Edit '+esc(lbl)+'">'+editLbl+'</button>';
  if(canEditTask(t))h+='<button type="button" class="btn sm task-dup-btn" data-dup="'+t.id+'"'+(t._isOccurrence?' data-occ="'+t._occurrenceDate+'"':'')+' title="Duplicate for this member">Duplicate</button>';
  if(canDelTask(t))h+='<button type="button" class="btn sm danger" data-dt="'+t.id+'"'+(t._isOccurrence?' data-occ="'+t._occurrenceDate+'"':'')+' title="Delete '+esc(lbl)+'">'+delLbl+'</button>';
  return h;
}
function taskActions(t,opts){
  var h=taskActionButtons(t,opts);
  return h?'<div class="task-act-row">'+h+'</div>':'';
}
function bindDeleteTaskBtn(btn,stopProp){btn.onclick=function(e){if(stopProp)e.stopPropagation();openDeleteTask(btn.dataset.dt,btn.dataset.occ||null);};}
function bindEditTaskBtn(btn,stopProp){btn.onclick=function(e){if(stopProp)e.stopPropagation();if(btn.dataset.occ)openETOcc(btn.dataset.et,btn.dataset.occ);else openET(btn.dataset.et);};}
function bindDuplicateTaskBtn(btn,stopProp){btn.onclick=function(e){if(stopProp)e.stopPropagation();duplicateTask(btn.dataset.dup,btn.dataset.occ||null,btn);};}
function taskDuplicateLogDate(){
  if(el('page-mytasks')&&el('page-mytasks').classList.contains('active')){
    if(myTasksViewDate)return new Date(myTasksViewDate);
    if(myTasksDate)return new Date(myTasksDate);
  }
  if(el('page-tasks')&&el('page-tasks').classList.contains('active')){
    if(lineupDate)return new Date(lineupDate);
    if(myTasksDate)return new Date(myTasksDate);
  }
  return new Date();
}
async function duplicateTask(tid,occDate,btnEl){
  if(!sb){toast('Not connected','error');return;}
  if(cu&&getNavAccess(cu.id).log_task===false){toast('You don\'t have access to log tasks','error');return;}
  var orig=tasks.find(function(x){return x.id===tid;});
  if(!orig||!canEditTask(orig)){toast('You can\'t duplicate this task','error');return;}
  if(btnEl)btnEl.disabled=true;
  try{
    var anchor=occDate||resolveEditOccDate(orig,null);
    var src=orig.is_recurring?mergeOccurrence(orig,anchor):orig;
    var logDate=taskDuplicateLogDate();
    logDate.setHours(12,0,0,0);
    var row={
      member_id:orig.member_id,
      name:src.name,
      display_name:src.display_name||null,
      notes:src.notes||'',
      role_area:src.role_area||null,
      task_type:src.task_type||null,
      result_category:src.result_category||null,
      status:'nostart',
      eta_minutes:src.eta_minutes||null,
      actual_minutes:null,
      scheduled_start_time:src.scheduled_start_time||null,
      is_recurring:!!orig.is_recurring,
      recur_frequency:orig.is_recurring?(orig.recur_frequency||null):null,
      logged_at:logDate.toISOString()
    };
    if(orig.is_recurring)row.recur_overrides={};
    var r=await sbInsertTasks([row],{select:true});
    if(r.error){console.error('[4KPI] duplicateTask',r.error);toast('Could not duplicate task','error');return;}
    var m=members.find(function(x){return x.id===orig.member_id;});
    toast('Task duplicated for '+(m?m.name:'member')+' ✓');
    await load();
    refreshDashboardMetrics();
    if(el('page-tasks').classList.contains('active'))rTasksPage();
    if(el('page-mytasks')&&el('page-mytasks').classList.contains('active'))rMyTasksPage();
  }finally{
    if(btnEl)btnEl.disabled=false;
  }
}
function taskTypesStr(){return sTTs.length?sTTs.join(', '):'';}
function parseTT(s){if(!s)return[];return s.split(',').map(function(x){return x.trim();}).filter(Boolean);}
function filterByPeriod(list,period){if(period==='all')return list;var now=new Date(),cut=new Date();if(period==='today'){return list.filter(function(t){return new Date(t.logged_at).toDateString()===now.toDateString();});}if(period==='7d'){cut.setDate(cut.getDate()-7);}else if(period==='30d'){cut.setDate(cut.getDate()-30);}return list.filter(function(t){return new Date(t.logged_at)>=cut;});}
function fmtField(f,v){if(f==='eta_minutes'||f==='actual_minutes')return fm(parseInt(v,10)||0);if(f==='scheduled_start_time')return fmtStartTime(v);if(f==='status'){var m={done:'Done',prog:'In progress',nostart:'Not started yet',pending:'Pending',late:'Late'};return m[v]||v;}return v||'—';}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function truncCell(text,lines){text=(text||'').trim();if(!text)return'—';var cls=lines===3?' text-clamp-3':lines===4?' text-clamp-4':'';return'<span class="text-clamp'+cls+'" title="'+esc(text)+'">'+esc(text)+'</span>';}
function histVal(v){v=String(v||'—');return'<span class="hist-val" title="'+esc(v)+'">'+esc(v)+'</span>';}
function taskDescContent(t){
  var types=parseTT(t.task_type),desc=(t.name||'').trim();
  if(!desc)return'';
  if(types.length&&desc===types[0])return'';
  return desc;
}
function formatTaskDescHTML(text){
  if(!text)return'';
  return text.split('\n').map(function(line){
    var l=line.trimEnd(),t=l.trim();
    if(!t)return'<div class="task-desc-spacer"></div>';
    if(/^\[ \]/.test(t)||/^☐/.test(t))return'<div class="task-desc-check">'+esc(t)+'</div>';
    if(/^\[x\]/i.test(t)||/^☑/.test(t))return'<div class="task-desc-check done">'+esc(t)+'</div>';
    if(/^[•\-\*]\s?/.test(t))return'<div class="task-desc-bullet">'+esc(t.replace(/^[•\-\*]\s?/,''))+'</div>';
    if(/^\d+\.\s?/.test(t))return'<div class="task-desc-num">'+esc(t)+'</div>';
    return'<div class="task-desc-line">'+esc(t)+'</div>';
  }).join('');
}
function taskDescBlockHTML(t){
  var desc=taskDescContent(t);
  if(!desc)return'<div class="task-desc-emphasis empty">No description — edit to add who/what this covers</div>';
  return'<div class="task-desc-emphasis"><div class="task-desc-emphasis-lbl">Description</div><div class="task-desc-emphasis-body">'+formatTaskDescHTML(desc)+'</div></div>';
}
function taskDescLine(t){var desc=taskDescContent(t);return desc?taskDescBlockHTML(t):'';}
function isInactiveMember(m){return!!(m&&(m.is_inactive||inactiveMembers[m.id]));}
function syncInactiveMembersFromSettings(){members.forEach(function(m){if(inactiveMembers[m.id])m.is_inactive=true;});}
function isInactiveColumnError(err){if(!err)return false;var msg=(err.message||'')+(err.details||'')+(err.hint||'');return err.code==='PGRST204'||/is_inactive|column.*does not exist|Could not find the/i.test(msg);}
function isDisplayNameColumnError(err){if(!err)return false;var msg=(err.message||'')+(err.details||'')+(err.hint||'');return(/display_name/i.test(msg)&&/Could not find|schema cache|does not exist|PGRST204/i.test(msg));}
function memberPayloadWithoutInactive(payload){var p=Object.assign({},payload);delete p.is_inactive;return p;}
function isWorkNotesColumnError(err){if(!err)return false;var msg=(err.message||'')+(err.details||'')+(err.hint||'');return(/work_notes/i.test(msg)&&/Could not find|schema cache|does not exist|PGRST204/i.test(msg));}
function taskPayloadWithoutWorkNotes(payload){var p=Object.assign({},payload);delete p.work_notes;return p;}
function markWorkNotesColMissing(){if(workNotesColMissing)return;workNotesColMissing=true;lss('4k_wncm',true);}
function workNotesLocalKey(tid,occ){return String(tid)+(occ?':'+occ:'');}
function getLocalWorkNotes(tid,occ){var k=workNotesLocalKey(tid,occ);return taskWorkNotesCache[k]!=null?taskWorkNotesCache[k]:(occ?null:(taskWorkNotesCache[String(tid)]||null));}
function setLocalWorkNotes(tid,occ,text){
  var k=workNotesLocalKey(tid,occ);
  if(text)taskWorkNotesCache[k]=text;else delete taskWorkNotesCache[k];
  lss('4k_twn',taskWorkNotesCache);
}
function getTaskWorkNotes(t){
  if(!t)return'';
  var wn=(t.work_notes||'').trim();
  if(!wn&&t.id)wn=(getLocalWorkNotes(t.id,t._occurrenceDate)||'').trim();
  return wn;
}
function prepTaskPayload(payload){
  var p=Object.assign({},payload);
  if(displayNameColMissing)delete p.display_name;
  if(workNotesColMissing)delete p.work_notes;
  return p;
}
function taskPayloadWithoutDisplayName(payload){var p=Object.assign({},payload);delete p.display_name;if(workNotesColMissing)delete p.work_notes;return p;}
function markDisplayNameColMissing(){if(displayNameColMissing)return;displayNameColMissing=true;lss('4k_dncm',true);}
function getLocalTaskDisplayName(tid){return tid!=null?taskDisplayNames[String(tid)]:null;}
function setLocalTaskDisplayName(tid,name){
  if(tid==null)return;
  var k=String(tid);
  if(name)taskDisplayNames[k]=name;else delete taskDisplayNames[k];
  lss('4k_tdn',taskDisplayNames);
}
async function sbUpdateTask(id,payload){
  var r=await sb.from('tasks').update(prepTaskPayload(payload)).eq('id',id);
  if(r.error&&isDisplayNameColumnError(r.error)){
    markDisplayNameColMissing();
    r=await sb.from('tasks').update(taskPayloadWithoutDisplayName(payload)).eq('id',id);
  }
  if(r.error&&isWorkNotesColumnError(r.error)){
    markWorkNotesColMissing();
    r=await sb.from('tasks').update(taskPayloadWithoutWorkNotes(taskPayloadWithoutDisplayName(payload))).eq('id',id);
  }
  return r;
}
async function sbInsertTasks(rows,opts){
  opts=opts||{};
  var prep=rows.map(function(row){return prepTaskPayload(row);});
  var q=sb.from('tasks').insert(prep);
  if(opts.select)q=q.select();
  var r=await q;
  if(r.error&&isDisplayNameColumnError(r.error)){
    markDisplayNameColMissing();
    var stripped=rows.map(function(row){return taskPayloadWithoutDisplayName(row);});
    q=sb.from('tasks').insert(stripped);
    if(opts.select)q=q.select();
    r=await q;
  }
  return r;
}
function stashLocalDisplayName(tid,name){
  if(!displayNameColMissing||tid==null)return;
  setLocalTaskDisplayName(tid,name||null);
}
function getOverseerId(){
  var oid=overseerId;
  if(oid&&members.some(function(m){return String(m.id)===String(oid);}))return oid;
  if(cu&&cu.isAdmin&&members.some(function(m){return String(m.id)===String(cu.id);}))return cu.id;
  var admin=members.find(function(m){return m.is_admin;});
  return admin?admin.id:null;
}
function isOverseerMember(m){return!!(m&&String(m.id)===String(getOverseerId()));}
function cuIsOverseer(){return!!(cu&&String(cu.id)===String(getOverseerId()));}
function ensureOverseerDefault(){
  if(overseerId&&members.some(function(m){return String(m.id)===String(overseerId);}))return;
  if(cu&&cu.isAdmin){overseerId=cu.id;lss('4k_oid',overseerId);saveAll();return;}
  var admin=members.find(function(m){return m.is_admin;});
  if(admin){overseerId=admin.id;lss('4k_oid',overseerId);saveAll();}
}
function setOverseerId(mid){
  if(!cu||!cu.isAdmin){toast('Only admins can set the overseer','error');return;}
  if(!mid||!members.some(function(m){return String(m.id)===String(mid);})){toast('Member not found','error');return;}
  overseerId=mid;
  lss('4k_oid',overseerId);
  saveAll();
  var nm=(members.find(function(m){return String(m.id)===String(mid);})||{}).name||'Member';
  toast(nm+' is now the agency overseer ✓');
  syncOverseerUI();
  rMembers();genIns();
  if(el('page-roles').classList.contains('active'))rRoles();
}
function claimOverseerRole(){if(!cu||!cu.isAdmin)return;setOverseerId(cu.id);}
function setOverseerFromModal(){var eid=el('meid').value;if(!eid)return;setOverseerId(eid);closeMM();}
function memberFirstName(m){return(m&&m.name)?m.name.split(' ')[0]:'them';}
function memberLogBtnHtml(m){
  if(!cu||!m||isInactiveMember(m))return'';
  var isSelf=String(m.id)===String(cu.id);
  if(cuIsOverseer()){
    if(isOverseerMember(m)||isSelf)return'<button class="btn sm" style="flex:1;justify-content:center" data-log="'+m.id+'">+ Log my task</button>';
    return'<button class="btn sm" style="flex:1;justify-content:center" data-log="'+m.id+'">+ Log for '+memberFirstName(m)+'</button>';
  }
  if(isSelf)return'<button class="btn sm" style="flex:1;justify-content:center" data-log="'+m.id+'">+ Log task</button>';
  return'';
}
function syncOverseerUI(){
  var transfer=el('transferOwnerBtn'),claim=el('claimOverseerBtn');
  if(transfer)transfer.hidden=!cuIsOverseer();
  if(claim)claim.hidden=!cu||!cu.isAdmin||cuIsOverseer();
  if(cu){var ur=el('urole');if(ur)ur.textContent=cuIsOverseer()?'Overseer':(cu.isAdmin?'Admin':'Team member');}
  var ver=el('appVerLbl');if(ver)ver.textContent='v'+APP_VER;
  if(el('page-dailylog')&&el('page-dailylog').classList.contains('active'))renderOverseerTeamBoard();
}
function getActiveMembers(){return members.filter(function(m){return!isInactiveMember(m);});}
function getTrackedTasks(){var ids=getActiveMembers().map(function(m){return m.id;});return tasks.filter(function(t){return ids.indexOf(t.member_id)>=0;});}
function getDayTasksForPulse(forDate){
  var d=forDate||pulseDate||new Date(),ds=d.toDateString(),activeIds={};
  getActiveMembers().forEach(function(m){activeIds[String(m.id)]=1;});
  return tasksForDay(ds).filter(function(t){return activeIds[String(t.member_id)];});
}
function computeDailyPulse(dayTasks){
  var tot=(dayTasks||[]).length;
  if(!tot)return{pct:0,done:0,tot:0,completion:0};
  var done=dayTasks.filter(function(t){return t.status==='done';}).length;
  var completion=Math.round((done/tot)*100);
  return{pct:completion,done:done,tot:tot,completion:completion};
}
function isPulseToday(forDate){var t=new Date(),d=forDate||pulseDate||new Date();return t.toDateString()===d.toDateString();}
function pulseDateLabel(){var d=pulseDate||new Date();return d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});}
function refreshDashboardMetrics(){
  rPulse();rKPIs();genIns();
  if(el('page-dailylog')&&el('page-dailylog').classList.contains('active'))rDailyLog();
  if(el('page-tasks')&&el('page-tasks').classList.contains('active'))rTasksPage();
  if(el('page-mytasks')&&el('page-mytasks').classList.contains('active'))rMyTasksPage();
  if(el('page-worklog')&&el('page-worklog').classList.contains('active'))rWorklog();
}
function chPulseDay(n){pulseDate=pulseDate||new Date();pulseDate=new Date(pulseDate);pulseDate.setDate(pulseDate.getDate()+n);refreshDashboardMetrics();}
function goPulseToday(){pulseDate=new Date();refreshDashboardMetrics();}
function insertDescFormat(kind){
  var ta=el('tname');if(!ta)return;
  var ins={bullet:'• ',check:'[ ] ',checkdone:'[x] ',num:'1. '}[kind]||'';
  var s=ta.selectionStart,e=ta.selectionEnd,v=ta.value;
  if(kind==='num'&&s>0&&v[s-1]!=='\n')ins='\n1. ';
  if(kind==='bullet'&&s>0&&v[s-1]!=='\n')ins='\n• ';
  if(kind==='check'&&s>0&&v[s-1]!=='\n')ins='\n[ ] ';
  if(kind==='checkdone'&&s>0&&v[s-1]!=='\n')ins='\n[x] ';
  ta.value=v.slice(0,s)+ins+v.slice(e);
  ta.selectionStart=ta.selectionEnd=s+ins.length;
  ta.focus();
}
function taskCardHist(tid){var h=getTH(tid);if(!h.length)return'';return'<div class="hist-inline"><div class="hist-inline-title">✏️ Edit history</div>'+h.map(function(x){var c=members.find(function(m){return m.id===x.changed_by;});var fn=FL[x.field_changed]||x.field_changed;return'<div class="hist-change"><strong>'+(c?c.name:'Someone')+'</strong> changed <strong>'+fn+'</strong> from '+histVal(fmtField(x.field_changed,x.old_value))+' to '+histVal(fmtField(x.field_changed,x.new_value))+'<div class="hist-meta">'+fmtDT(x.changed_at||x.created_at)+'</div></div>';}).join('')+'</div>';}
function renderTaskLine(t,withActions){
  var types=parseTT(t.task_type),typeLbl=types.length?types.join(' · '):(t.name||'—');
  var timeMeta=(t.role_area||'')+(t.result_category?' · '+t.result_category:'')+(t.scheduled_start_time?' · Start '+fmtStartTime(t.scheduled_start_time):'');
  var acts=withActions?taskActions(t,{labeled:true}):'';
  return'<div class="ti"><div class="tr1"><span class="tn">'+typeLbl+(t.edited_at?'<span class="ebadge">edited</span>':'')+(t.is_recurring?'<span class="rbadge">🔄 '+t.recur_frequency+'</span>':'')+(t._isOccurrence?'<span class="rbadge">📅 day</span>':'')+'</span>'+stag(t.status)+'</div><div class="tm">'+timeMeta+'</div>'+taskDescLine(t)+ebar(t.eta_minutes,t.actual_minutes)+(t.edited_at?taskCardHist(t.id):'')+acts+'</div>';
}

const PAL=[{n:'Neon Green',h:'#f0b429'},{n:'Electric Blue',h:'#5b9cf6'},{n:'Purple',h:'#a78bfa'},{n:'Hot Pink',h:'#fb7185'},{n:'Teal',h:'#34d399'},{n:'Amber',h:'#ffb830'},{n:'Cyan',h:'#00ffff'},{n:'Gold',h:'#ffd700'},{n:'Lime',h:'#32cd32'},{n:'Orange',h:'#ff9632'},{n:'Red',h:'#ff4444'},{n:'Sky Blue',h:'#64c8ff'},{n:'Violet',h:'#ee82ee'},{n:'Rose',h:'#ff6496'},{n:'Coral',h:'#ff7f50'},{n:'Mint',h:'#98ff98'},{n:'Lavender',h:'#b57bee'},{n:'Peach',h:'#ffb347'},{n:'Steel',h:'#8899dd'},{n:'Ruby',h:'#e0115f'},{n:'Turquoise',h:'#40e0d0'},{n:'Magenta',h:'#ff00ff'},{n:'Indigo',h:'#6366f1'},{n:'Emerald',h:'#10b981'}];

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

const RECUR_FREQ={'Daily':1,'3 days':3,'5 days':5,'1 week':7,'2 weeks':14,'1 month':30};
function pad2(n){return(n<10?'0':'')+n;}
function dsToKey(ds){var d=new Date(ds);return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function dateFromKey(key){var p=(key||'').split('-');if(p.length!==3)return null;return new Date(parseInt(p[0],10),parseInt(p[1],10)-1,parseInt(p[2],10));}
function fmtStartTime(t){if(!t)return'';var p=String(t).split(':'),h=parseInt(p[0],10),m=p[1]||'00';if(isNaN(h))return t;var ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+m+' '+ap;}
function parseStartMinutes(timeStr){
  if(!timeStr)return null;
  var p=String(timeStr).trim().split(':'),h=parseInt(p[0],10),m=parseInt(p[1]||'0',10);
  if(isNaN(h)||h<0||h>23)return null;
  return h*60+(isNaN(m)?0:m);
}
function taskSortKey(t){
  if(t._isOccurrence&&t._occurrenceDate)return t.id+'|'+t._occurrenceDate;
  return String(t.id);
}
function compareTasksSchedule(a,b){
  var am=parseStartMinutes(a.scheduled_start_time),bm=parseStartMinutes(b.scheduled_start_time);
  if(am===null&&bm!==null)return 1;
  if(am!==null&&bm===null)return -1;
  if(am!==null&&bm!==null&&am!==bm)return am-bm;
  var aDone=a.status==='done'?1:0,bDone=b.status==='done'?1:0;
  if(aDone!==bDone)return aDone-bDone;
  return String(a.name||'').localeCompare(String(b.name||''))||taskSortKey(a).localeCompare(taskSortKey(b));
}
function sortTasksBySchedule(list){return list.slice().sort(compareTasksSchedule);}
function applyTaskDayOrder(list,memberId,dateKey){
  if(!list||!list.length)return [];
  var sorted=sortTasksBySchedule(list);
  var order=taskDayOrder&&dateKey&&memberId&&taskDayOrder[dateKey]&&taskDayOrder[dateKey][memberId];
  if(!order||!order.length)return sorted;
  var map={},seen={},out=[];
  sorted.forEach(function(t){map[taskSortKey(t)]=t;});
  order.forEach(function(k){if(map[k]&&!seen[k]){out.push(map[k]);seen[k]=1;}});
  sorted.forEach(function(t){var k=taskSortKey(t);if(!seen[k])out.push(t);});
  return out;
}
function taskDragHandle(){return'<span class="task-drag-handle" title="Drag to reorder">⠿</span>';}
function canReorderTasks(memberId){return!!(cu&&(cu.isAdmin||cu.id===memberId));}
function parseOverrides(t){if(!t||!t.recur_overrides)return{};if(typeof t.recur_overrides==='object')return t.recur_overrides;try{return JSON.parse(t.recur_overrides);}catch(e){return{};}}
function recursOnDate(t,ds){
  if(!t||!t.is_recurring||!t.logged_at||!t.recur_frequency)return false;
  var orig=new Date(t.logged_at),chk=new Date(ds);orig.setHours(0,0,0,0);chk.setHours(0,0,0,0);
  var diff=Math.round((chk-orig)/86400000);if(diff<0)return false;
  var f=RECUR_FREQ[t.recur_frequency];if(!f||diff%f!==0)return false;
  var key=dsToKey(ds),ovs=parseOverrides(t);
  if(ovs._stopAfter&&key>=ovs._stopAfter)return false;
  if(ovs[key]&&ovs[key].skipped)return false;
  return true;
}
function pickOv(ov,key,base){return Object.prototype.hasOwnProperty.call(ov,key)?ov[key]:base;}
function mergeOccurrence(t,dateKey){var ov=parseOverrides(t)[dateKey]||{};return Object.assign({},t,{_occurrenceDate:dateKey,_isOccurrence:true,name:pickOv(ov,'name',t.name),display_name:pickOv(ov,'display_name',t.display_name),notes:pickOv(ov,'notes',t.notes),work_notes:pickOv(ov,'work_notes',t.work_notes),status:pickOv(ov,'status',t.status||'nostart'),eta_minutes:pickOv(ov,'eta_minutes',t.eta_minutes),actual_minutes:pickOv(ov,'actual_minutes',t.actual_minutes),scheduled_start_time:pickOv(ov,'scheduled_start_time',t.scheduled_start_time)});}
function getRecurringVirtualTasks(ds){var key=dsToKey(ds);return tasks.filter(function(t){if(!t.is_recurring||!t.recur_frequency||!t.logged_at)return false;if(new Date(t.logged_at).toDateString()===ds)return false;return recursOnDate(t,ds);}).map(function(t){return mergeOccurrence(t,key);});}
function tasksForDay(ds){var key=dsToKey(ds);var logged=tasks.filter(function(t){return new Date(t.logged_at).toDateString()===ds;}).map(function(t){return t.is_recurring?mergeOccurrence(t,key):t;});return logged.concat(getRecurringVirtualTasks(ds));}
function resolveTaskOccDate(t,occDate){
  if(occDate)return occDate;
  if(t&&t._occurrenceDate)return t._occurrenceDate;
  if(myTasksDate&&((el('page-tasks')&&el('page-tasks').classList.contains('active'))||(el('page-mytasks')&&el('page-mytasks').classList.contains('active'))))return dsToKey(myTasksDate.toDateString());
  if(lineupDate)return dsToKey(lineupDate.toDateString());
  return dsToKey(new Date().toDateString());
}
function listOccurrenceKeys(t,maxDays){var keys=[],start=new Date(t.logged_at);if(isNaN(start))return keys;start.setHours(0,0,0,0);var end=new Date(start);end.setDate(end.getDate()+(maxDays||400));for(var d=new Date(start);d<=end;d.setDate(d.getDate()+1)){var ds=d.toDateString();if(recursOnDate(t,ds))keys.push(dsToKey(ds));}return keys;}
function freezePastOverrides(orig,anchorKey){var ovs=parseOverrides(orig);listOccurrenceKeys(orig).forEach(function(key){if(key>=anchorKey||key.charAt(0)==='_')return;if(Object.prototype.hasOwnProperty.call(ovs,key))return;var m=mergeOccurrence(orig,key);ovs[key]={name:m.name,display_name:m.display_name,notes:m.notes,work_notes:m.work_notes,status:m.status,eta_minutes:m.eta_minutes,actual_minutes:m.actual_minutes,scheduled_start_time:m.scheduled_start_time};});Object.keys(ovs).forEach(function(key){if(key.charAt(0)==='_')return;if(key>=anchorKey)delete ovs[key];});return ovs;}
function stopRecurrenceAfter(orig,anchorKey){var ovs=freezePastOverrides(orig,anchorKey);ovs._stopAfter=anchorKey;return ovs;}
function overrideFieldsFromPatch(patch){
  var fields={name:patch.name,display_name:patch.display_name,notes:patch.notes,work_notes:patch.work_notes,status:patch.status,eta_minutes:patch.eta_minutes,actual_minutes:patch.actual_minutes};
  if(Object.prototype.hasOwnProperty.call(patch,'scheduled_start_time'))fields.scheduled_start_time=patch.scheduled_start_time;
  return fields;
}
function scrubRecurringTemplateStatus(t,payload){
  if(!t||!t.is_recurring||!payload)return payload;
  if(payload.status==='done'||payload.status==='late')payload.status='nostart';
  return payload;
}
function scrubOverrideForSave(o){var c=Object.assign({},o);if(c.status!=='done')delete c._revertStatus;return c;}
function preserveRecurMeta(ovs){var out={};if(ovs._stopAfter)out._stopAfter=ovs._stopAfter;return out;}
function applyFieldsToKey(ovs,key,fields,existing){
  if(existing&&existing.skipped)return;
  if(ovs._stopAfter&&key>=ovs._stopAfter)return;
  ovs[key]=scrubOverrideForSave(Object.assign({},existing||{},fields));
}
function buildSeriesOverrides(orig,anchor,scope,patch){
  var old=parseOverrides(orig),fields=overrideFieldsFromPatch(patch),meta=preserveRecurMeta(old);
  if(scope==='day'){
    var dayO=Object.assign({},old,meta);
    applyFieldsToKey(dayO,anchor,fields,old[anchor]);
    return dayO;
  }
  if(scope==='future'){
    var futO=freezePastOverrides(orig,anchor);
    if(meta._stopAfter)futO._stopAfter=meta._stopAfter;
    return futO;
  }
  var allO=Object.assign({},meta);
  Object.keys(old).forEach(function(k){
    if(k.charAt(0)==='_')return;
    if(old[k]&&old[k].skipped)allO[k]={skipped:true};
  });
  listOccurrenceKeys(orig).forEach(function(key){
    applyFieldsToKey(allO,key,fields,allO[key]);
  });
  return allO;
}
function roleAreaStyle(role){
  var h=0,s=(role||'General');
  for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%360;
  return'background:hsla('+h+',52%,42%,.2);color:hsla('+h+',65%,78%,1);border:1px solid hsla('+h+',52%,42%,.38)';
}
function taskDisplayHead(t){
  var types=parseTT(t.task_type),typeLbl=types.length?types.join(' · '):(t.name||'Task');
  var role=(t.role_area||'').trim();
  var rolePill=role?'<span class="task-role-pill" style="'+roleAreaStyle(role)+'">'+esc(role)+'</span>':'';
  return'<div class="task-id-row">'+rolePill+'<span class="task-type-pill" title="'+esc(typeLbl)+'">'+esc(typeLbl)+'</span></div>';
}
function taskTimingLine(t){
  var bits=[];
  if(t.scheduled_start_time)bits.push('<span class="task-time-chip">Start <strong>'+fmtStartTime(t.scheduled_start_time)+'</strong></span>');
  if(t.eta_minutes)bits.push('<span class="task-time-chip">ETA <strong>'+fm(t.eta_minutes)+'</strong></span>');
  if(t.actual_minutes)bits.push('<span class="task-time-chip act">Actual <strong>'+fm(t.actual_minutes)+'</strong></span>');
  if(t.is_recurring)bits.push('<span class="task-recur-chip">🔄 '+esc(t.recur_frequency||'Recurring')+'</span>');
  return bits.length?'<div class="task-timing-row">'+bits.join('')+'</div>':'';
}
function syncScopeVisibility(defaultScope){
  var sec=el('editScopeSec');if(!sec)return;
  var eid=el('teid').value;
  var orig=eid?tasks.find(function(t){return t.id===eid;}):null;
  if(!eid||!orig||!orig.is_recurring){
    sec.style.display='none';
    editScope='all';
    syncRecurLock();
    return;
  }
  sec.style.display='block';
  sec.classList.remove('edit-scope-hint');
  editOccDate=editOccDate||dsToKey(new Date().toDateString());
  if(defaultScope)editScope=defaultScope;
  qsa('.escope',sec).forEach(function(b){b.style.display='';b.classList.toggle('on',b.dataset.scope===editScope);});
  updateEditScopeNote();
  syncRecurLock();
}
function showEditScope(show,anchorKey,defaultScope){if(!show){var sec=el('editScopeSec');if(sec)sec.style.display='none';editScope='all';return;}if(anchorKey)editOccDate=anchorKey;syncScopeVisibility(defaultScope);}
function resolveEditOccDate(t,occDateKey){
  if(occDateKey)return occDateKey;
  if(t&&t._occurrenceDate)return t._occurrenceDate;
  if(lineupDate)return dsToKey(lineupDate.toDateString());
  if(myTasksDate)return dsToKey(myTasksDate.toDateString());
  return dsToKey(new Date().toDateString());
}
function setEditScope(scope,btn){
  editScope=scope;
  qsa('.escope').forEach(function(b){b.classList.remove('on');});
  if(btn)btn.classList.add('on');
  var eid=el('teid').value,orig=eid?tasks.find(function(t){return t.id===eid;}):null;
  if(orig&&orig.is_recurring&&scope==='day'){
    var anchor=editOccDate||resolveEditOccDate(orig,null);
    fillTaskModalFromTask(mergeOccurrence(orig,anchor),true);
    markTimeBtn('etag',sEta);markTimeBtn('actg',sAct);syncExactTimeInput('eta',sEta);syncExactTimeInput('act',sAct);syncActClearBtn();
  }
  updateEditScopeNote();
  syncScopeVisibility(scope);
  syncRecurLock();
}
function updateEditScopeNote(){
  var note=el('editScopeNote');if(!note)return;
  var d=editOccDate?dateFromKey(editOccDate):null,lbl=d?d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}):'this day';
  if(editScope==='day')note.textContent='Only '+lbl+' changes. Other repeats stay the same.';
  else if(editScope==='future')note.textContent='Updates from '+lbl+' forward. Earlier days keep what they had.';
  else note.textContent='Updates every past and future repeat — including days before today.';
}
function syncRecurUI(){
  var tog=el('rtog'),wrap=el('recwrap');
  if(tog)tog.classList.toggle('on',isRec);
  if(wrap)wrap.style.display=isRec?'block':'none';
}
function syncRecurLock(){
  var eid=el('teid')?el('teid').value:'';
  var orig=eid?tasks.find(function(t){return t.id===eid;}):null;
  var lockSeries=!!(orig&&orig.is_recurring&&isRec&&editScope==='day');
  var row=el('recurrenceBlock');
  if(row){
    var togRow=row.querySelector('.togrow');
    if(togRow){
      togRow.style.pointerEvents=lockSeries?'none':'';
      togRow.style.opacity=lockSeries?'.55':'1';
      togRow.title=lockSeries?'Switch to “Entire series” to change repeat settings':'';
    }
  }
  qsa('#recwrap .rbtn').forEach(function(b){
    b.disabled=lockSeries;
    b.style.opacity=lockSeries?'.55':'1';
    b.style.pointerEvents=lockSeries?'none':'';
  });
}
function fillTaskModalFromTask(t,skipScope){
  var td=el('tdisplay');if(td)td.value=(t.display_name||'').trim();
  el('tname').value=t.name||'';el('tnotes').value=t.notes||'';el('tstat').value=t.status||'done';el('tstart').value=t.scheduled_start_time||'';
  syncStartClearBtn();
  sEta=normMins(t.eta_minutes);sAct=normMins(t.actual_minutes);
  isRec=!!t.is_recurring;recFreq=t.recur_frequency||null;
  syncRecurUI();
  qsa('.rbtn').forEach(function(b){b.classList.toggle('on',recFreq&&b.textContent===recFreq);});
  if(!skipScope)syncScopeVisibility();else syncRecurLock();
}
function normMins(v){if(v==null||v==='')return null;var n=parseInt(v,10);return isNaN(n)?null:n;}
function minsMatch(a,b){return normMins(a)===normMins(b);}
function markTimeBtn(id,mins){var n=normMins(mins);qsa('#'+id+' .tbtn[data-mins]').forEach(function(b){b.classList.toggle('on',n!=null&&normMins(b.dataset.mins)===n);});}
function timeGridBox(vn){return el(vn==='eta'?'etag':'actg');}
function exactTextInput(box){return box?box.querySelector('.time-exact-text'):null;}
function parseTimePhrase(raw){
  if(raw==null)return null;
  var s=String(raw).trim().toLowerCase().replace(/,/g,' ');
  if(!s)return null;
  if(s==='0'||s==='none'||s==='clear')return 0;
  if(/^\d+$/.test(s))return parseInt(s,10);
  var colon=s.match(/^(\d+)\s*:\s*(\d+)$/);
  if(colon){
    var ch=parseInt(colon[1],10),cm=parseInt(colon[2],10);
    if(cm>59||ch>12)return null;
    return ch*60+cm;
  }
  var total=0,found=false,re=/(\d+)\s*(hours?|hrs?|h|minutes?|mins?|m)\b/gi,match;
  while((match=re.exec(s))!==null){
    var n=parseInt(match[1],10),u=match[2].charAt(0);
    if(u==='h')total+=n*60;else total+=n;
    found=true;
  }
  return found?total:null;
}
function formatTimePhrase(mins){
  var n=normMins(mins);
  if(n==null)return'';
  if(n>=720)return'12 hours+';
  var h=Math.floor(n/60),m=n%60;
  if(h&&!m)return h+(h===1?' hour':' hours');
  if(!h&&m)return m+(m===1?' min':' mins');
  return h+(h===1?' hour':' hours')+' '+m+(m===1?' min':' mins');
}
function syncExactTimeInput(vn,mins){
  var box=timeGridBox(vn),inp=exactTextInput(box);
  if(!inp)return;
  var n=normMins(mins);
  inp.value=n==null?'':formatTimePhrase(n);
  box.classList.toggle('exact-on',n!=null);
}
function applyExactTime(vn){
  var box=timeGridBox(vn),inp=exactTextInput(box);
  if(!box||!inp)return;
  var raw=String(inp.value).trim(),id=vn==='eta'?'etag':'actg';
  if(!raw){
    if(vn==='eta')sEta=null;else sAct=null;
    markTimeBtn(id,null);
    syncExactTimeInput(vn,null);
    if(vn==='act')syncActClearBtn();
    return;
  }
  var total=parseTimePhrase(raw);
  if(total==null){toast('Try "17 mins", "1 hour 17 mins", or "45"','error');return;}
  if(total===0){
    if(vn==='eta')sEta=null;else sAct=null;
    markTimeBtn(id,null);
    syncExactTimeInput(vn,null);
    if(vn==='act')syncActClearBtn();
    return;
  }
  if(total>720){toast('Max 12 hours','error');return;}
  if(vn==='eta')sEta=total;else sAct=total;
  markTimeBtn(id,total);
  syncExactTimeInput(vn,total);
  if(vn==='act')syncActClearBtn();
  if(vn==='eta')chkETA();
}
function syncActClearBtn(){
  var none=qsa('#actg .tbtn-none')[0];
  if(none)none.classList.toggle('on',!sAct);
  var b=el('clearActBtn');
  if(b)b.disabled=!sAct;
}
function clearActTime(){sAct=null;markTimeBtn('actg',null);syncExactTimeInput('act',null);syncActClearBtn();}
function syncStartClearBtn(){
  var b=el('clearStartBtn'),inp=el('tstart');
  if(b&&inp)b.disabled=!inp.value;
}
function clearStartTime(){var inp=el('tstart');if(inp){inp.value='';syncStartClearBtn();}}
function taskScheduleLabel(t){if(t._isOccurrence&&t._occurrenceDate){var d=dateFromKey(t._occurrenceDate);return d?d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}):t._occurrenceDate;}var ld=parseDT(t.logged_at);return ld?ld.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}):'—';}
function lastEditSummary(t){if(t._isOccurrence)return'';var h=getTH(t.id);if(h.length){var last=h[0],fn=FL[last.field_changed]||last.field_changed;return'Last edit: '+fn+' · '+fmtDT(last.changed_at||last.created_at);}if(t.edited_at)return'Last updated · '+fmtDT(t.edited_at);return'';}

var RCOLS=ls('4k_rc')||{},customRA=ls('4k_cra')||{},delBase=ls('4k_del')||{tasks:{},rc:[],rcByRole:{}},customRC=ls('4k_crc')||[],customRCByRole=ls('4k_crcr')||{},catMeta=ls('4k_cm')||{},catOrder=ls('4k_co')||null,loginOrder=ls('4k_lo')||null,rolesOrder=ls('4k_ro')||null,memberNavAccess=ls('4k_mna')||{},inactiveMembers=ls('4k_ina')||{},overseerId=ls('4k_oid')||null,taskDayOrder=ls('4k_tdo')||{},daySnapshots=ls('4k_dsn')||{},taskDisplayNames=ls('4k_tdn')||{},taskWorkNotesCache=ls('4k_twn')||{},displayNameColMissing=!!ls('4k_dncm'),workNotesColMissing=!!ls('4k_wncm');

var NAV_TAB_DEFS=[
  {id:'dailylog',label:'Daily Log',group:'Today',tier:'core'},
  {id:'dashboard',label:'Dashboard',group:'More',tier:'archive'},
  {id:'log_task',label:'Log task',group:'More',tier:'archive'},{id:'mytasks',label:'Tasks',group:'More',tier:'archive'},{id:'worklog',label:'Task log',group:'More',tier:'archive'},
  {id:'calendar',label:'Calendar',group:'More',tier:'archive'},{id:'library',label:'Task library',group:'More',tier:'archive'},
  {id:'add_member',label:'Add member',group:'Team',tier:'sidebar',adminDefault:false},{id:'trash',label:'Trash',group:'Team',tier:'sidebar'},
  {id:'performance',label:'Performance',group:'More',tier:'archive'},{id:'compare',label:'Compare',group:'More',tier:'archive'},
  {id:'oversight',label:'Oversight',group:'More',tier:'archive',adminDefault:false},{id:'intelligence',label:'Intelligence',group:'More',tier:'archive',adminDefault:false},
  {id:'results',label:'Results',group:'More',tier:'archive'},{id:'roles',label:'Role guides',group:'Team',tier:'sidebar'},
  {id:'tasks',label:'Daily profiles',group:'More',tier:'archive'}
];
var DEFAULT_MEMBER_NAV={dailylog:true,dashboard:false,log_task:false,mytasks:false,worklog:false,calendar:false,library:false,add_member:false,trash:false,tasks:false,results:false,performance:false,compare:false,oversight:false,intelligence:false,roles:false};
var SIDEBAR_NAV_IDS=['roles','add_member','trash'];
var ARCHIVED_NAV_IDS=['dashboard','log_task','mytasks','worklog','calendar','library','add_member','trash','performance','compare','oversight','intelligence','results','roles','tasks'];
var TOOLS_DRAWER_NAV_IDS=ARCHIVED_NAV_IDS.filter(function(id){return SIDEBAR_NAV_IDS.indexOf(id)<0;});
var TOOL_NAV_META={
  dashboard:{group:'Overview',desc:'Agency pulse, KPIs, and team grid'},
  performance:{group:'Overview',desc:'Charts and performance trends'},
  compare:{group:'Overview',desc:'Head-to-head member stats'},
  results:{group:'Overview',desc:'Logged results with proof'},
  log_task:{group:'Tasks',desc:'Log a new assigned task'},
  mytasks:{group:'Tasks',desc:'Your tasks for today'},
  worklog:{group:'Tasks',desc:'Team task activity feed'},
  tasks:{group:'Tasks',desc:'Daily profiles by person'},
  calendar:{group:'Tasks',desc:'Calendar view of work'},
  library:{group:'Team',desc:'Task library and role bubbles'},
  roles:{group:'Team',desc:'Role guides and who does what'},
  add_member:{group:'Team',desc:'Add or edit team members'},
  oversight:{group:'Team',desc:'Overseer oversight view'},
  intelligence:{group:'Team',desc:'Agency intelligence panel'},
  trash:{group:'Admin',desc:'Restore deleted items'}
};
var TOOL_GROUP_ORDER=['Overview','Tasks','Team','Admin'];
var simpleNavMode=true;
function isSidebarNav(id){return SIDEBAR_NAV_IDS.indexOf(id)>=0;}
function isArchivedNav(id){return TOOLS_DRAWER_NAV_IDS.indexOf(id)>=0;}
function navTier(id){var t=NAV_TAB_DEFS.find(function(x){return x.id===id;});return t?t.tier||'core':'core';}
function hasAnyToolAccess(access){
  return TOOLS_DRAWER_NAV_IDS.some(function(id){return access[id]!==false;});
}
function renderToolsDrawer(){
  var box=el('toolsDrawerGrid');if(!box||!cu)return;
  var access=getNavAccess(cu.id);
  var html='';
  TOOL_GROUP_ORDER.forEach(function(gname){
    var items=TOOLS_DRAWER_NAV_IDS.filter(function(id){
      if(access[id]===false)return false;
      var meta=TOOL_NAV_META[id]||{group:'Other'};
      return meta.group===gname;
    }).map(function(id){
      var def=NAV_TAB_DEFS.find(function(t){return t.id===id;});
      var meta=TOOL_NAV_META[id]||{};
      return{id:id,label:def?def.label:id,desc:meta.desc||''};
    });
    if(!items.length)return;
    html+='<div class="tools-drawer-group"><div class="tools-drawer-group-lbl">'+esc(gname)+'</div><div class="tools-drawer-grid">';
    items.forEach(function(item){
      html+='<button type="button" class="tools-drawer-btn" data-nav="'+esc(item.id)+'" onclick="openToolNav(\''+item.id+'\')"><span class="tools-drawer-btn-label">'+esc(item.label)+'</span>'+(item.desc?'<span class="tools-drawer-btn-desc">'+esc(item.desc)+'</span>':'')+'</button>';
    });
    html+='</div></div>';
  });
  if(cu.isAdmin){
    html+='<div class="tools-drawer-group tools-drawer-group-danger"><div class="tools-drawer-group-lbl">Danger zone</div><div class="tools-drawer-grid"><button type="button" class="tools-drawer-btn tools-drawer-btn-danger" onclick="closeToolsDrawer();openWipeModal()"><span class="tools-drawer-btn-label">Erase all data</span><span class="tools-drawer-btn-desc">Clear tasks & agency data — keeps member accounts</span></button></div></div>';
  }
  box.innerHTML=html||'<div class="tools-drawer-empty">No tools available for your account.</div>';
}
function openToolsDrawer(){renderToolsDrawer();el('ToolsM').classList.add('open');}
function closeToolsDrawer(){el('ToolsM').classList.remove('open');}
function openToolNav(id){
  if(!cu)return;
  var access=getNavAccess(cu.id);
  if(access[id]===false){toast('You don\'t have access to this section','error');return;}
  closeToolsDrawer();
  closeMobileNav();
  if(id==='log_task')openT();
  else if(id==='add_member')openM();
  else gp(id);
}
function syncArchivedPageBanner(page){
  var banner=el('archPageBanner');
  if(!banner)return;
  var show=simpleNavMode&&isArchivedNav(page);
  banner.hidden=!show;
  banner.style.display=show?'':'none';
}

function saveAll(){lss('4k_rc',RCOLS);lss('4k_cra',customRA);lss('4k_del',delBase);lss('4k_crc',customRC);lss('4k_crcr',customRCByRole);lss('4k_cm',catMeta);lss('4k_co',catOrder);lss('4k_lo',loginOrder);lss('4k_ro',rolesOrder);lss('4k_mna',memberNavAccess);lss('4k_ina',inactiveMembers);lss('4k_oid',overseerId);lss('4k_tdo',taskDayOrder);lss('4k_dsn',daySnapshots);lss('4k_tdn',taskDisplayNames);lss('4k_twn',taskWorkNotesCache);lss('4k_atags',activityTags);lss('4k_apresets',activityPresets);lss('4k_dncm',displayNameColMissing);lss('4k_wncm',workNotesColMissing);saveSettings();}

async function saveSettings(){
  if(!sb)return;
  try{
    var data={rcols:RCOLS,cra:customRA,del:delBase,crc:customRC,crcr:customRCByRole,cm:catMeta,co:catOrder,lo:loginOrder,ro:rolesOrder,mna:memberNavAccess,ina:inactiveMembers,oid:overseerId,tdo:taskDayOrder,dsn:daySnapshots,sn:simpleNavMode,atags:activityTags,apresets:activityPresets};
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
      if(v.ina&&typeof v.ina==='object'){inactiveMembers=v.ina;lss('4k_ina',inactiveMembers);}
      if(v.oid){overseerId=v.oid;lss('4k_oid',overseerId);}
      if(v.tdo&&typeof v.tdo==='object'){taskDayOrder=v.tdo;lss('4k_tdo',taskDayOrder);}
      if(v.dsn&&typeof v.dsn==='object'){daySnapshots=v.dsn;lss('4k_dsn',daySnapshots);}
      if(v.atags&&Array.isArray(v.atags)&&v.atags.length){activityTags=v.atags;lss('4k_atags',activityTags);}
      if(v.apresets&&Array.isArray(v.apresets)&&v.apresets.length){activityPresets=v.apresets;lss('4k_apresets',activityPresets);}
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
  base.dailylog=true;
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
  var toolsBtn=el('toolsDrawerBtn');
  if(toolsBtn){
    var showTools=hasAnyToolAccess(access);
    toolsBtn.hidden=!showTools;
    toolsBtn.style.display=showTools?'':'none';
  }
  renderToolsDrawer();
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
  var groups=[],seen={};
  NAV_TAB_DEFS.forEach(function(t){var g=t.group||'Other';if(!seen[g]){seen[g]=true;groups.push(g);}});
  box.innerHTML=groups.map(function(g){
    var items=NAV_TAB_DEFS.filter(function(t){return(t.group||'Other')===g;});
    return'<div class="nav-access-group"><div class="nav-access-group-title">'+g+'</div>'+items.map(function(t){
      var cid='nak-'+t.id;
      return'<div class="nav-access-row"><input type="checkbox" id="'+cid+'" data-navkey="'+t.id+'"'+(access[t.id]!==false?' checked':'')+'><label class="nav-access-lbl" for="'+cid+'">'+t.label+'</label></div>';
    }).join('')+'</div>';
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

function fmtLogTime(m){
  if(!m&&m!==0)return'—';
  if(m>=720)return'12h+';
  if(m<60)return m+' mins';
  var h=Math.floor(m/60),mn=m%60,hPart=h===1?'1 hour':h+' hours';
  if(!mn)return hPart;
  return hPart+' '+mn+' mins';
}
function buildLogTimePresets(){
  var a=[];
  for(var m=10;m<=120;m+=10)a.push({l:fmtLogTime(m),m:m});
  [150,180,240,300,360,480,600,720].forEach(function(m){a.push({l:fmtLogTime(m),m:m});});
  return a;
}
const LOG_TIME_PRESETS=buildLogTimePresets();
const QT=['The agency moves when the team moves.','Consistency beats motivation every time.','What gets measured gets managed.','Every logged task builds a better system.','Data does not lie. Log everything.','Small daily wins compound into agencies.','Accountability is the foundation of growth.'];

var members=[],memberAccountTotal=0,tasks=[],hist=[],charts={},cu=null,calDate=new Date();
var sMids=[],sRoles=[],sTTs=[],sRCs=[],sEta=null,sAct=null,selPin=null,isRec=false,recFreq=null,editOccDate=null,editScope='all',descDetailsOn=ls('4k_desc_on')===true,delTaskId=null,delOccDate=null,delScope='all';
var pickRole=null,editCat=null,editCatNew=false,curDayT=[],lineupDate=new Date(),myTasksDate=new Date(),myTasksViewDate=new Date(),myTasksExpandedId=null,dailyLogDate=new Date(),weekViewOpen=false,pulseDate=new Date(),daySnapMemberId=null,daySnapDateKey=null,dragCat=null,dms=null,loginEditMode=false,profileFilter='all',profileMid=null,dragLoginId=null,dragRoleId=null;
var DEFAULT_ACTIVITY_TAGS=['Recruitment','Content','Networking','Chatting','Admin','Other'];
var activityLog=[],activityTags=ls('4k_atags')||null,activityPresets=ls('4k_apresets')||null,tagMgrOpen=false,activityLogLocalOnly=false,activityLogSupabaseOk=false,activityLogLoadSeq=0,activityLogLastErr=null,activityLogTargetId=null;
var memberPrefs={},actCategories=[],actSelectedMins=null,actTimeIsCustom=false,actTimeChipsBound=false,activityComposerInited=false,selectedPresetIndices=[];
var ACT_TIME_CHIP_MINS=[15,30,60,120,180,240];
var ACCENT_THEMES={
  red:{label:'Bright red',accent:'#ff3333',accent2:'#e61919',rgb:'255,51,51'},
  orange:{label:'Orange',accent:'#ff9632',accent2:'#f97316',rgb:'255,150,50'},
  gold:{label:'Gold',accent:'#f0b429',accent2:'#d99a1a',rgb:'240,180,41'},
  green:{label:'Green',accent:'#22c55e',accent2:'#16a34a',rgb:'34,197,94'},
  lime:{label:'Lime',accent:'#84cc16',accent2:'#65a30d',rgb:'132,204,22'},
  teal:{label:'Teal',accent:'#2dd4bf',accent2:'#14b8a6',rgb:'45,212,191'},
  cyan:{label:'Cyan',accent:'#22d3ee',accent2:'#06b6d4',rgb:'34,211,238'},
  blue:{label:'Electric blue',accent:'#5b9cf6',accent2:'#3b82f6',rgb:'91,156,246'},
  purple:{label:'Purple',accent:'#a78bfa',accent2:'#8b5cf6',rgb:'167,139,250'},
  magenta:{label:'Magenta',accent:'#e879f9',accent2:'#d946ef',rgb:'232,121,249'},
  rose:{label:'Rose',accent:'#fb7185',accent2:'#f43f5e',rgb:'251,113,133'}
};
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
function fm(m){return fmtLogTime(m);}
function ini(n){return(n||'??').slice(0,2).toUpperCase();}
function isC(m){return(m.role_tags||'').toLowerCase().includes('chatter');}
function el(id){return document.getElementById(id);}
function qs(sel,ctx){return(ctx||document).querySelector(sel);}
function qsa(sel,ctx){return(ctx||document).querySelectorAll(sel);}

// LOGIN
function loginVisibleMembers(list){
  return(list||[]).filter(function(m){return !isInactiveMember(m);});
}
async function initLogin(){
  if(!sb){console.error('[4KPI] Cannot load login — Supabase client missing');return;}
  var savedAccent=ls('4k_accent_theme');
  if(savedAccent&&ACCENT_THEMES[savedAccent])applyAccentTheme(savedAccent,false);
  logKPI('initLogin start');
  var r=await sb.from('members').select('*').order('name');
  sbErr('members (login)',r);
  members=r.data||[];
  memberAccountTotal=members.length;
  logKPI('initLogin members loaded',{count:members.length,memberAccountTotal:memberAccountTotal});
  await loadSettings();
  setupLoginSearch();
  renderLG(loginVisibleMembers(members));
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
  loginOrder=ids;saveAll();renderLG(loginVisibleMembers(members));toast('Login order saved');
}
function toggleLoginEdit(){
  if(loginEditMode){loginEditMode=false;el('loginGear').classList.remove('on');renderLG(loginVisibleMembers(members));return;}
  var pin=prompt('Enter any admin PIN to reorder login names:');
  if(!pin)return;
  var ok=members.some(function(m){return m.is_admin&&m.pin===pin;});
  if(!ok){toast('Wrong admin PIN','error');return;}
  loginEditMode=true;el('loginGear').classList.add('on');renderLG(loginVisibleMembers(members));
}

function filterM(){var q=el('msearch').value.toLowerCase();var pool=loginVisibleMembers(members);renderLG(q?pool.filter(function(m){return m.name.toLowerCase().includes(q);}):pool);}

function setupLoginSearch(){
  var ms=el('msearch');if(!ms)return;
  ms.value='';
  ms.setAttribute('autocomplete','off');
  if(ms.dataset.bound)return;
  ms.dataset.bound='1';
  ms.addEventListener('focus',function(){ms.removeAttribute('readonly');});
  ms.addEventListener('blur',function(){if(!ms.value.trim())ms.setAttribute('readonly','readonly');});
}

function syncTaskDescUI(){
  var body=el('descBody'),block=el('taskDescBlock');
  if(body)body.style.display='block';
  if(block)block.classList.remove('collapsed');
}
function togTaskDesc(){syncTaskDescUI();}

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
  syncOverseerUI();
  applyNavAccess();
  var dStr=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});el('today').textContent=dStr;var ins=el('insDate');if(ins)ins.textContent=dStr;
  el('quote').textContent=QT[new Date().getDay()%QT.length];
  var ht=el('humorToggle');if(ht)ht.checked=!humorOff;
  initSidebar();
  if(cu){var mp=ls('4k_mp_'+cu.id);if(mp&&mp.accentTheme)applyAccentTheme(mp.accentTheme,false);}
  try{if(sessionStorage.getItem('4k_alog_ok')==='1')activityLogSupabaseOk=true;}catch(x){}
  syncActivitySetupBanner();
  fetchAndRender(true).then(function(){
    var btn=document.querySelector('[data-nav="dailylog"]');
    gp('dailylog',btn||null);
  });
}

var rtSubscribed=false;
async function fetchAndRender(showLoadErr){
  if(!sb){console.error('[4KPI] fetchAndRender aborted — no Supabase client');if(showLoadErr)toast('App failed to connect to Supabase — refresh the page','error');return;}
  if(!cu){console.warn('[4KPI] fetchAndRender skipped — not logged in');return;}
  logKPI('fetchAndRender start');
  try{
    await loadSettings();

    var mr=await sb.from('members').select('*',{count:'exact'}).order('name');
    sbErr('members',mr);
    if(mr.error){
      if(!members.length)members=[];
    }else{
      members=mr.data||[];
      memberAccountTotal=typeof mr.count==='number'?mr.count:members.length;
      syncInactiveMembersFromSettings();
      ensureOverseerDefault();
    }

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

    logKPI('fetch complete',{memberCount:members.length,memberAccountTotal:memberAccountTotal,taskCount:tasks.length,histCount:hist.length});

    try{await loadRoleNotes();}catch(e){console.error('[4KPI] loadRoleNotes failed',e);}
    try{await loadResultPosts();}catch(e){console.error('[4KPI] loadResultPosts failed',e);}
    try{await loadTrash();}catch(e){console.error('[4KPI] loadTrash failed',e);}
    try{await loadActivityLog();}catch(e){console.error('[4KPI] loadActivityLog failed',e);}
    loadMemberPrefsForCurrentUser();

    render();
    applyNavAccess();
    syncOverseerUI();
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
  activityLogSupabaseOk=false;
  try{sessionStorage.removeItem('4k_alog_ok');}catch(x){}
  syncUserRole();
  el('LS').classList.remove('hidden');
  el('APP').style.display='none';
  el('step2').classList.remove('show');
  el('msearch').value='';
  setupLoginSearch();
  renderLG(loginVisibleMembers(members));
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
function vrd(id){var m=members.find(function(x){return x.id===id;});if(m&&isInactiveMember(m))return{label:'Not tracking yet',cls:'inactive'};var s=mst(id);if(!s.total)return{label:'No data',cls:'nodata'};if(s.late>=2)return{label:'Falling behind',cls:'behind'};if(s.rate>=80)return{label:'Producing',cls:'producing'};if(s.rate>=50)return{label:'Watch',cls:'watch'};return{label:'Falling behind',cls:'behind'};}
function stag(s){var m={done:['Done','done'],prog:['In progress','prog'],late:['Late','late'],pending:['Pending','pending'],nostart:['Not started','nostart']};var p=m[s]||['?','pending'];return'<span class="tag '+p[1]+'">'+p[0]+'</span>';}
function ebar(eta,act){if(!eta)return'';var pct=act?Math.min(Math.round(act/eta*100),150):0,over=act>eta,cls=!act?'b':over?'r':'g';return'<div style="margin-top:4px"><div class="erow"><span>ETA '+fm(eta)+(act?' · '+fm(act):'')+'</span><span>'+(act?(over?'+'+fm(act-eta)+' over':'-'+fm(eta-act)+' under'):'—')+'</span></div><div class="btrack"><div class="bfill '+cls+'" style="width:'+Math.min(pct,100)+'%"></div></div></div>';}
function getTH(tid){return hist.filter(function(h){return h.task_id===tid;});}
function renderH(tid){return taskCardHist(tid)||'<div style="color:var(--text3);font-size:11px">No changes.</div>';}

// INSIGHTS
function genIns(){
  var box=el('ilist');if(!box)return;
  var ins=[],active=getActiveMembers(),tracked=getTrackedTasks(),tod=new Date().toDateString(),todT=tracked.filter(function(t){var dt=parseDT(t.logged_at);return dt&&dt.toDateString()===tod;});
  active.forEach(function(m){
    if(todT.some(function(t){return t.member_id===m.id;}))return;
    if(isOverseerMember(m)){
      if(cuIsOverseer())ins.push({t:'warn',i:'⚠️',txt:'Log <strong>your own tasks</strong> — nothing tracked yet today.',mid:m.id,self:true});
      return;
    }
    if(cuIsOverseer())ins.push({t:'warn',i:'⚠️',txt:'Log tasks for <strong>'+m.name+'</strong> — nothing tracked yet today.',mid:m.id});
  });
  active.forEach(function(m){var mine=mt(m.id).filter(function(t){return t.actual_minutes&&t.eta_minutes;});if(mine.length<2)return;var ae=mine.reduce(function(s,t){return s+t.eta_minutes;},0)/mine.length,aa=mine.reduce(function(s,t){return s+t.actual_minutes;},0)/mine.length,d=Math.round(aa-ae);if(d>20)ins.push({t:'warn',i:'🕐',txt:'<strong>'+m.name+'</strong> averages <strong>+'+fm(d)+'</strong> over ETA.'});if(d<-15)ins.push({t:'good',i:'⚡',txt:'<strong>'+m.name+'</strong> is <strong>'+fm(Math.abs(d))+' under ETA</strong>.'});});
  active.forEach(function(m){var s=mst(m.id);if(s.late>=3)ins.push({t:'bad',i:'🚨',txt:'<strong>'+m.name+'</strong> has <strong>'+s.late+' late tasks</strong>.'});else if(s.late>=1)ins.push({t:'warn',i:'⚠️',txt:'<strong>'+m.name+'</strong> has <strong>'+s.late+' late task'+(s.late>1?'s':'')+'</strong>.'});});
  var inactiveCt=members.length-active.length;
  if(inactiveCt)ins.push({t:'info',i:'💤',txt:'<strong>'+inactiveCt+' member'+(inactiveCt>1?'s are':' is')+' inactive</strong> — not counted in pulse until tracking starts.'});
  var ed=tasks.filter(function(t){return t.edited_at;});if(ed.length)ins.push({t:'info',i:'✏️',txt:'<strong>'+ed.length+' task'+(ed.length>1?'s have':' has')+'</strong> been edited after logging.'});
  var ttR={};tasks.forEach(function(t){if(t.task_type&&t.result_category&&t.result_category!=='No result')ttR[t.task_type]=(ttR[t.task_type]||0)+1;});
  var best=Object.entries(ttR).sort(function(a,b){return b[1]-a[1];})[0];if(best)ins.push({t:'good',i:'🏆',txt:'"<strong>'+best[0]+'</strong>" is top task — <strong>'+best[1]+' results</strong>.'});
  var tot=tracked.length,don=tracked.filter(function(t){return t.status==='done';}).length,rt=tot?Math.round(don/tot*100):0;
  var todDay=getDayTasksForPulse(new Date()),todTot=todDay.length,todDon=todDay.filter(function(t){return t.status==='done';}).length,todRt=todTot?Math.round(todDon/todTot*100):0;
  if(tot>0){if(todTot>0){if(todRt>=80)ins.push({t:'good',i:'✅',txt:'Today\'s lineup is <strong>'+todDon+'/'+todTot+' done</strong> ('+todRt+'% checked off).'});else if(todRt>=50)ins.push({t:'warn',i:'📊',txt:'Today: <strong>'+todDon+'/'+todTot+' tasks done</strong> — checkoffs move the daily pulse.'});else ins.push({t:'bad',i:'🔴',txt:'Today: only <strong>'+todDon+'/'+todTot+' done</strong> — check tasks off to raise the pulse.'});}else if(rt>=80)ins.push({t:'good',i:'✅',txt:'Tracked team completion is <strong>'+rt+'%</strong> (all time).'});else if(rt>=50)ins.push({t:'warn',i:'📊',txt:'Tracked team completion is <strong>'+rt+'%</strong> — room to improve.'});else ins.push({t:'bad',i:'🔴',txt:'Only <strong>'+rt+'%</strong> completion among tracked members.'});}
  var tp=active.map(function(m){return{m:m,s:mst(m.id)};}).filter(function(x){return x.s.total>0;}).sort(function(a,b){return b.s.rate-a.s.rate;})[0];
  if(tp&&tp.s.rate>0)ins.push({t:'good',i:'⭐',txt:'<strong>'+tp.m.name+'</strong> is top performer at <strong>'+tp.s.rate+'%</strong>.'});
  var todRes=resultPosts.filter(function(r){return new Date(r.created_at).toDateString()===tod;});
  todRes.slice(0,6).forEach(function(r){
    var rm=members.find(function(x){return x.id===r.member_id;});
    var rt=r.result_type||'Result';
    ins.unshift({t:'good',i:'🎯',txt:'<strong>'+(rm?rm.name:'Someone')+'</strong> posted <strong>'+(r.title||'a result')+'</strong> · '+rt+' · '+fmtDT(r.created_at).split(', ').pop()});
  });
  box.innerHTML=ins.length?ins.map(function(x){
    return'<div class="ii '+x.t+(x.mid?' ii-action':'')+'"><div style="font-size:13px;flex-shrink:0;margin-top:1px">'+x.i+'</div><div class="ii-body">'+x.txt+(x.mid?'<button type="button" class="ins-log-btn" data-log="'+x.mid+'">'+(x.self?'Log my task →':'Log for them →')+'</button>':'')+'</div></div>';
  }).join(''):'<div style="color:var(--text3);font-size:12px;padding:4px 0">Log tasks for the team to generate insights.</div>';
  qsa('.ins-log-btn',box).forEach(function(btn){btn.onclick=function(e){e.stopPropagation();openTFor(btn.dataset.log);};});
}

function toggleP(bid,iid){var b=el(bid),ic=el(iid);b.classList.toggle('coll');ic.classList.toggle('open',!b.classList.contains('coll'));}

function injectPageHelp(){var map={'page-dailylog':['tasks'],'page-dashboard':['dashboard'],'page-mytasks':['tasks'],'page-worklog':['tasks'],'page-calendar':['calendar'],'page-tasks':['tasks'],'page-performance':['performance'],'page-oversight':['oversight'],'page-intelligence':['intelligence'],'page-library':['library'],'page-results':['results'],'page-roles':['roles'],'page-compare':['compare'],'page-rolenotes':['rolenotes']};Object.keys(map).forEach(function(pid){var pg=el(pid);if(!pg||pg.querySelector('.ph-help'))return;var ph=pg.querySelector('.ph');if(!ph)return;var d=document.createElement('div');d.className='ph-help';d.innerHTML=map[pid].map(function(k){return'<span class="ph-help-item">'+k.charAt(0).toUpperCase()+k.slice(1)+hBtn(k)+'</span>';}).join('');ph.after(d);});injectDashHelp();fillHelpSlots();}
function injectDashHelp(){
  var pt=el('pulseTitle');if(pt&&!pt.querySelector('.help-end'))pt.innerHTML='Agency pulse<span class="help-end">'+hBtn('pulse')+'</span>';
  var st=el('streak');if(st&&!st.querySelector('.help-end')){var n=st.textContent;st.innerHTML=n+'<span class="help-end">'+hBtn('streak')+'</span>';}
}
function render(){
  try{
    logKPI('render start');
    rKPIs();rPulse();genIns();rMembers();injectPageHelp();
    var ap=function(n){return el('page-'+n).classList.contains('active');};
    if(ap('calendar'))renderCal();
    if(ap('dailylog'))rDailyLog();
    if(ap('mytasks'))rMyTasksPage();
    if(ap('worklog'))rWorklog();
    if(ap('tasks'))rTasksPage();
    if(ap('performance'))rCharts();
    if(ap('oversight'))rOversight();
    if(ap('intelligence'))rIntel();
    if(ap('library'))rLib();
    if(ap('results'))rResults();
    if(ap('roles'))rRoles();
    if(ap('compare'))rCompare();
    if(ap('trash'))rTrash();
    qsa('.page.active').forEach(function(p){if(p.id)syncArchivedPageBanner(p.id.replace('page-',''));});
    logKPI('render complete');
  }catch(e){console.error('[4KPI] render failed',e);}
}

function rKPIs(){
  var box=el('krow');
  if(!box)return;
  var dayTasks=getDayTasksForPulse(new Date()),dayTot=dayTasks.length,dayDon=dayTasks.filter(function(t){return t.status==='done';}).length,dayOpen=dayTot-dayDon;
  var dayRt=dayTot?Math.round(dayDon/dayTot*100):0;
  var tracked=getTrackedTasks(),tot=tracked.length,don=tracked.filter(function(t){return t.status==='done';}).length,lat=tracked.filter(function(t){return t.status==='late';}).length;
  var rt=tot?Math.round(don/tot*100):0;
  var cards=[
    {l:'Today',v:dayTot,c:'',s:dayOpen?dayOpen+' open · '+dayDon+' done':(dayTot?'All done ✓':'Nothing scheduled'),d:dayTot?'all':'',h:'kpi_logged'},
    {l:'Completion',v:dayTot?dayRt+'%':(tot?rt+'%':'—'),c:dayTot?(dayRt>=80?'g':dayRt>=50?'a':'r'):(rt>=80?'g':rt>=50?'a':''),s:dayTot?'today\'s pulse':tot?rt+'% all time':'log tasks to start',d:'done',h:'kpi_completed'},
    {l:'Late / missed',v:lat,c:lat>0?'r':'g',s:lat?'needs attention':'none right now',d:'late',h:'kpi_late'}
  ];
  box.innerHTML=cards.map(function(k){return'<div class="kcard"'+(k.d?' data-kd="'+k.d+'"':'')+' style="cursor:'+(k.d?'pointer':'default')+'"><div class="kcard-top"><div class="klbl">'+k.l+'</div><span class="help-slot" data-help="'+k.h+'"></span></div><div class="kval '+k.c+'">'+k.v+'</div><div class="ksub">'+k.s+(k.d?' · tap':'')+'</div></div>';}).join('');
  qsa('.kcard[data-kd]',box).forEach(function(card){card.onclick=function(){dKPI(this.dataset.kd);};});
  fillHelpSlots();
}

function rPulse(){
  var dayTasks=getDayTasksForPulse(pulseDate),p=computeDailyPulse(dayTasks),pct=p.pct;
  var cv=el('orb');
  if(cv){
    var ctx=cv.getContext('2d'),sz=48;
    ctx.clearRect(0,0,sz,sz);
    ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2-3,0,Math.PI*2);ctx.fillStyle='#1a1a1a';ctx.fill();
    if(pct>0){ctx.beginPath();ctx.arc(sz/2,sz/2,sz/2-3,-Math.PI/2,-Math.PI/2+Math.PI*2*(pct/100));ctx.strokeStyle=pct>=80?accentHex():pct>=50?accentHex2():'#ff5c5c';ctx.lineWidth=4;ctx.lineCap='round';ctx.stroke();}
  }
  var op=el('opct');if(op)op.textContent=pct+'%';
  var lbl=el('pulseDateLbl');if(lbl)lbl.textContent=pulseDateLabel();
  var ps=el('psub');
  if(ps){
    if(!p.tot)ps.textContent=isPulseToday()?'No tasks scheduled today — log the lineup to start the pulse':'No tasks scheduled this day';
    else if(isPulseToday())ps.textContent=p.done+'/'+p.tot+' checked off · '+p.completion+'% completion';
    else ps.textContent=p.done+'/'+p.tot+' done ('+p.completion+'%) · browse other days with ‹ ›';
  }
  var bd=el('pulseBreakdown');
  if(bd){
    if(!p.tot){bd.innerHTML='';bd.style.display='none';}
    else{
      bd.style.display='flex';
      var open=p.tot-p.done;
      bd.innerHTML='<span class="pulse-pill pulse-pill-main" title="Tasks checked off today">✓ '+p.done+'/'+p.tot+' done</span>'+(open?'<span class="pulse-pill" title="Still open">'+open+' open</span>':'')+'<span class="pulse-pill pulse-pill-muted" title="Completion rate for this day">'+p.completion+'% pulse</span>';
    }
  }
  var tracked=getTrackedTasks(),str=0;
  for(var d=0;d<30;d++){var day=new Date();day.setDate(day.getDate()-d);if(getDayTasksForPulse(day).length>0)str++;else if(d>0)break;}
  var st=el('streak');if(st)st.innerHTML='🔥 '+str+' day streak<span class="help-end">'+hBtn('streak')+'</span>';
}

function rMembers(){
  var container=el('mgrid2');
  if(!container)return;
  if(!members.length){container.innerHTML='<div style="color:var(--text3);font-size:13px">No members yet.</div>';return;}
  var pool=sortByOrder(members.slice(),'roles');
  var q=(el('tsrch')?el('tsrch').value||'':'').toLowerCase();
  var show=q?pool.filter(function(m){return m.name.toLowerCase().includes(q)||(m.role||'').toLowerCase().includes(q);}):pool;
  if(!show.length){container.innerHTML='<div style="color:var(--text3);font-size:13px;padding:8px 0">'+(q?'No accounts match that search.':'No accounts yet.')+'</div>';return;}
  var html='';
  show.forEach(function(m){
    var c=getMC(m),s=mst(m.id),v=vrd(m.id),mine=mt(m.id).slice(0,2);
    var rc=s.rate>=80?'g':s.rate>=50?'a':'r',lc=s.late===0?'g':s.late<=1?'a':'r';
    var dc=s.avgA&&s.avgE?(s.avgA>s.avgE?'r':'g'):'',dv=s.avgA&&s.avgE?((s.avgA>s.avgE?'+':'')+fm(Math.abs(s.avgA-s.avgE))):'—';
    var tHTML='';
    if(mine.length){mine.forEach(function(t){tHTML+=renderTaskLine(t,true);});}
    else{tHTML='<div style="font-size:12px;color:var(--text3);padding:8px 0;text-align:center">No tasks tracked yet</div>';}
    var editBtn=cu&&cu.isAdmin?'<button class="btn sm" data-edit="'+m.id+'">Edit profile</button>':'';
    var logBtn=memberLogBtnHtml(m);
    html+='<div class="mcard '+v.cls+(isC(m)?' chatter':'')+'" draggable="true" data-mid="'+m.id+'">';
    html+='<div class="mhd"><div style="display:flex;align-items:center;gap:8px"><div class="av" style="background:'+c.bg+';color:'+c.text+'">'+ini(m.name)+'</div>';
    html+='<div><div class="mn">'+m.name+(isOverseerMember(m)?'<span class="overseer-badge">OVERSEER</span>':'')+(m.is_admin?'<span style="font-size:9px;color:var(--amber);margin-left:5px">ADMIN</span>':'')+(isInactiveMember(m)?'<span class="inactive-badge">Inactive</span>':'')+(isC(m)?'<span style="font-size:9px;color:var(--purple);margin-left:5px">CHATTER</span>':'')+'</div><div class="mr">'+m.role+'</div></div></div><span class="vd '+v.cls+'">'+v.label+'</span></div>';
    html+='<div class="mstats"><div class="ms"><div class="msl">Tasks</div><div class="msv">'+s.total+'</div></div><div class="ms"><div class="msl">Done</div><div class="msv '+rc+'">'+s.rate+'%</div></div><div class="ms"><div class="msl">Late</div><div class="msv '+lc+'">'+s.late+'</div></div><div class="ms"><div class="msl">vs ETA</div><div class="msv '+dc+'">'+dv+'</div></div></div>';
    html+='<div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Recent</div>'+tHTML;
    if(logBtn||editBtn)html+='<div style="display:flex;gap:5px;margin-top:8px">'+logBtn+editBtn+'</div>';
    html+='</div>';
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
  qsa('[data-et]',container).forEach(function(btn){bindEditTaskBtn(btn,true);});
  qsa('[data-dup]',container).forEach(function(btn){bindDuplicateTaskBtn(btn,true);});
  qsa('[data-dt]',container).forEach(function(btn){bindDeleteTaskBtn(btn,true);});
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
    var rT=tasks.filter(function(t){return recursOnDate(t,ds);});
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

function daySnapStoreKey(dateKey,memberId){return dateKey+'|'+memberId;}
function memberDayTasks(memberId,dateKey){
  var d=dateFromKey(dateKey);if(!d)return[];
  return tasksForDay(d.toDateString()).filter(function(t){return String(t.member_id)===String(memberId);});
}
function canClearMemberDay(memberId){return!!(cu&&(cu.isAdmin||isSelfMember(memberId)));}
function serializeDayTask(t,dateKey){
  return{
    id:t.id,member_id:t.member_id,name:t.name,display_name:t.display_name,notes:t.notes,status:t.status,role_area:t.role_area,task_type:t.task_type,
    result_category:t.result_category,eta_minutes:t.eta_minutes,actual_minutes:t.actual_minutes,scheduled_start_time:t.scheduled_start_time,
    is_recurring:!!t.is_recurring,recur_frequency:t.recur_frequency,recur_overrides:t.recur_overrides,logged_at:t.logged_at,
    occurrence_date:t._occurrenceDate||null,is_occurrence:!!t._isOccurrence
  };
}
function saveDaySnapshot(memberId,dateKey,reason){
  if(!dateKey||!memberId)return null;
  var memberTasks=memberDayTasks(memberId,dateKey);
  var key=daySnapStoreKey(dateKey,memberId);
  if(!daySnapshots[key])daySnapshots[key]={versions:[]};
  var ver={
    id:'v_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
    saved_at:nowISO(),
    reason:reason||'Saved',
    task_count:memberTasks.length,
    tasks:memberTasks.map(function(t){return serializeDayTask(t,dateKey);})
  };
  daySnapshots[key].versions.unshift(ver);
  if(daySnapshots[key].versions.length>25)daySnapshots[key].versions.length=25;
  lss('4k_dsn',daySnapshots);saveAll();
  return ver;
}
function getDaySnapVersions(memberId,dateKey){
  var store=daySnapshots[daySnapStoreKey(dateKey,memberId)];
  return store&&store.versions?store.versions.slice():[];
}
function dayViewRowActions(memberId,dateKey,mTaskCount){
  if(!canClearMemberDay(memberId))return'';
  var vers=getDaySnapVersions(memberId,dateKey);
  var hasVers=vers.length>0;
  var h='<div class="dayview-row-actions">';
  if(mTaskCount)h+='<button type="button" class="btn sm danger" data-day-clear="'+memberId+'" data-day-key="'+dateKey+'">Clear day</button>';
  h+='<button type="button" class="btn sm" data-day-save="'+memberId+'" data-day-key="'+dateKey+'">Save version</button>';
  if(hasVers)h+='<button type="button" class="btn sm" data-day-revert="'+memberId+'" data-day-key="'+dateKey+'">Revert last</button>';
  h+='<button type="button" class="btn sm" data-day-versions="'+memberId+'" data-day-key="'+dateKey+'">Versions'+(hasVers?' ('+vers.length+')':'')+'</button>';
  h+='</div>';
  return h;
}
async function removeMemberDayTasks(memberId,dateKey){
  var d=dateFromKey(dateKey);if(!d)return;
  var ds=d.toDateString(),list=memberDayTasks(memberId,dateKey);
  for(var i=0;i<list.length;i++){
    var t=list[i],orig=tasks.find(function(x){return x.id===t.id;});
    if(!orig)continue;
    if(t.is_recurring||t._isOccurrence){
      var anchor=t._occurrenceDate||dateKey,ovs=parseOverrides(orig);
      ovs[anchor]=Object.assign({},ovs[anchor]||{},{skipped:true});
      var ru=await sb.from('tasks').update({recur_overrides:ovs}).eq('id',t.id);
      if(ru.error)throw ru.error;
    }else if(tasks.some(function(x){return x.id===t.id;})){
      var ok=await moveToTrash('task',t.id,orig,taskShortLabel(orig));
      if(!ok)throw new Error('trash');
    }
  }
}
function taskPayloadFromSnapshot(st,logDate){
  var p={
    member_id:st.member_id,name:st.name,display_name:st.display_name,notes:st.notes,status:st.status||'nostart',role_area:st.role_area,
    task_type:st.task_type,result_category:st.result_category,eta_minutes:st.eta_minutes,actual_minutes:st.actual_minutes,
    scheduled_start_time:st.scheduled_start_time,is_recurring:!!st.is_recurring,recur_frequency:st.recur_frequency,
    recur_overrides:st.recur_overrides||{},logged_at:st.logged_at||logDate.toISOString()
  };
  return p;
}
async function applySnapshotTask(st,dateKey,logDate){
  if(st.is_occurrence&&st.id){
    var orig=tasks.find(function(x){return x.id===st.id;});
    if(orig){
      var anchor=st.occurrence_date||dateKey,ovs=parseOverrides(orig),fields=overrideFieldsFromPatch(taskPayloadFromSnapshot(st,logDate));
      var next=Object.assign({},ovs[anchor]||{},fields);
      delete next.skipped;
      ovs[anchor]=scrubOverrideForSave(next);
      var ru=await sb.from('tasks').update({recur_overrides:ovs}).eq('id',st.id);
      if(ru.error)throw ru.error;
      return;
    }
  }
  if(st.id&&tasks.some(function(x){return x.id===st.id;}))return;
  var ins=await sbInsertTasks([taskPayloadFromSnapshot(st,logDate)]);
  if(ins.error)throw ins.error;
}
async function restoreDaySnapshot(memberId,dateKey,versionId){
  if(!canClearMemberDay(memberId)){toast('You can only restore your own day','error');return;}
  var vers=getDaySnapVersions(memberId,dateKey);
  if(!vers.length){toast('No saved versions for this day','error');return;}
  var ver=versionId?vers.find(function(v){return v.id===versionId;}):vers[0];
  if(!ver){toast('Version not found','error');return;}
  var cur=memberDayTasks(memberId,dateKey);
  if(cur.length)saveDaySnapshot(memberId,dateKey,'Before restore');
  try{
    await removeMemberDayTasks(memberId,dateKey);
    var logDate=dateFromKey(dateKey)||new Date();
    logDate.setHours(12,0,0,0);
    for(var i=0;i<(ver.tasks||[]).length;i++)await applySnapshotTask(ver.tasks[i],dateKey,logDate);
    toast('Restored '+ver.task_count+' task'+(ver.task_count===1?'':'s')+' from '+fmtDT(ver.saved_at)+' ✓');
    closeDaySnapM();await load();
  }catch(e){toast('Could not restore — try again','error');}
}
async function clearMemberDayTasks(memberId,dateKey){
  if(!canClearMemberDay(memberId)){toast('You can only clear your own day','error');return;}
  var list=memberDayTasks(memberId,dateKey);
  if(!list.length){toast('No tasks to clear for this day','error');return;}
  if(!confirm('Clear all '+list.length+' task'+(list.length===1?'':'s')+' for this day? You can revert from Versions.'))return;
  saveDaySnapshot(memberId,dateKey,'Before clear');
  try{
    await removeMemberDayTasks(memberId,dateKey);
    toast('Day cleared — use Revert or Versions to bring tasks back');
    await load();
  }catch(e){toast('Could not clear day','error');}
}
function openDaySnapM(memberId,dateKey){
  daySnapMemberId=memberId;daySnapDateKey=dateKey;
  var m=members.find(function(x){return String(x.id)===String(memberId);}),vers=getDaySnapVersions(memberId,dateKey);
  el('daySnapTitle').textContent=(m?m.name:'Member')+' — saved versions';
  el('daySnapDesc').textContent=lineupDateLabel()+' · pick a version to restore this person\'s task list';
  var box=el('daySnapList');
  if(!vers.length){box.innerHTML='<div class="day-snap-empty">No saved versions yet. Use Save version or Clear day (auto-saves before clearing).</div>';}
  else{
    box.innerHTML=vers.map(function(v){
      return'<div class="day-snap-item"><div class="day-snap-body"><div class="day-snap-title">'+esc(v.reason||'Saved')+'</div><div class="day-snap-meta">'+fmtDT(v.saved_at)+' · '+v.task_count+' task'+(v.task_count===1?'':'s')+'</div></div><button type="button" class="btn sm p" data-day-restore="'+v.id+'">Restore</button></div>';
    }).join('');
    qsa('[data-day-restore]',box).forEach(function(btn){btn.onclick=function(){restoreDaySnapshot(memberId,dateKey,this.dataset.dayRestore);};});
  }
  el('DaySnapM').classList.add('open');
}
function closeDaySnapM(){daySnapMemberId=null;daySnapDateKey=null;el('DaySnapM').classList.remove('open');}
function bindDayViewActions(root){
  if(!root)return;
  qsa('[data-day-clear]',root).forEach(function(btn){btn.onclick=function(){clearMemberDayTasks(this.dataset.dayClear,this.dataset.dayKey);};});
  qsa('[data-day-save]',root).forEach(function(btn){btn.onclick=function(){
    var mid=this.dataset.daySave,dk=this.dataset.dayKey;
    saveDaySnapshot(mid,dk,'Manual save');
    toast('Version saved ✓');
    rTasksPage();
  };});
  qsa('[data-day-revert]',root).forEach(function(btn){btn.onclick=function(){restoreDaySnapshot(this.dataset.dayRevert,this.dataset.dayKey,null);};});
  qsa('[data-day-versions]',root).forEach(function(btn){btn.onclick=function(){openDaySnapM(this.dataset.dayVersions,this.dataset.dayKey);};});
}
function taskCheckOccKey(t){
  if(t._occurrenceDate)return t._occurrenceDate;
  if(!t.is_recurring&&!t._isOccurrence)return null;
  if(el('page-mytasks')&&el('page-mytasks').classList.contains('active')&&myTasksViewDate)return dsToKey(myTasksViewDate.toDateString());
  if(lineupDate)return dsToKey(lineupDate.toDateString());
  if(myTasksDate)return dsToKey(myTasksDate.toDateString());
  return dsToKey(new Date().toDateString());
}
function dayviewTaskMetaHTML(t){
  var bits=[];
  if(t.scheduled_start_time)bits.push('<span class="dayview-chip start"><span class="dayview-chip-lbl">Start</span> '+fmtStartTime(t.scheduled_start_time)+'</span>');
  if(t.eta_minutes)bits.push('<span class="dayview-chip eta"><span class="dayview-chip-lbl">ETA</span> '+fm(t.eta_minutes)+'</span>');
  if(t.actual_minutes)bits.push('<span class="dayview-chip">Act '+fm(t.actual_minutes)+'</span>');
  if(t.is_recurring)bits.push('<span class="dayview-chip recur">🔄 '+esc(t.recur_frequency||'Recurring')+'</span>');
  return bits.length?'<div class="dayview-task-meta">'+bits.join('')+'</div>':'';
}
function dayviewTaskTitleHTML(t){
  var lbl=taskDisplayLabel(t),ph=esc(taskDisplayPlaceholder(t)),can=canEditTask(t);
  var occ=t._occurrenceDate?' data-occ="'+t._occurrenceDate+'"':'';
  if(!can)return'<span class="dayview-task-title" title="'+esc(lbl)+'">'+esc(lbl)+'</span>';
  return'<textarea rows="2" class="dayview-task-title-input" data-title-id="'+t.id+'"'+occ+' placeholder="'+ph+'" title="Click to rename this task">'+esc(lbl)+'</textarea>';
}
function autoResizeTitleInput(ta){
  if(!ta)return;
  ta.style.height='auto';
  var max=96;
  ta.style.height=Math.min(ta.scrollHeight,max)+'px';
}
function taskDescBtnHTML(t){
  if(!taskDescContent(t)&&!(t.notes||'').trim())return'';
  return'<button type="button" class="btn sm dayview-desc-btn" data-desc-id="'+t.id+'"'+(t._occurrenceDate?' data-occ="'+t._occurrenceDate+'"':'')+' title="View steps & description">📋</button>';
}
function getTaskView(tid,occDate){
  var t=tasks.find(function(x){return x.id===tid;});
  if(!t)return null;
  if(t.is_recurring)return mergeOccurrence(t,resolveTaskOccDate(t,occDate));
  return t;
}
function openTaskDescM(tid,occDate){
  var t=getTaskView(tid,occDate);if(!t)return;
  var title=taskDisplayLabel(t),typeLbl=taskTypeLabel(t);
  el('taskDescTitle').textContent=title;
  var meta=el('taskDescMeta');
  if(meta){
    var bits=[];
    if(typeLbl&&typeLbl!==title)bits.push('<span class="task-desc-view-type">'+esc(typeLbl)+'</span>');
    if(t.role_area)bits.push('<span class="task-desc-view-role">'+esc(t.role_area)+'</span>');
    meta.innerHTML=bits.length?bits.join(' '):'';
    meta.style.display=bits.length?'':'none';
  }
  var body=el('taskDescBody'),desc=taskDescContent(t),notes=(t.notes||'').trim(),html='';
  if(desc)html+='<div class="task-desc-emphasis"><div class="task-desc-emphasis-lbl">Steps & description</div><div class="task-desc-emphasis-body">'+formatTaskDescHTML(desc)+'</div></div>';
  if(notes)html+='<div class="task-desc-view-notes"><div class="task-desc-emphasis-lbl">Blockers / follow-ups</div><div class="task-desc-emphasis-body">'+formatTaskDescHTML(notes)+'</div></div>';
  if(!html)html='<div class="task-desc-view-empty">No description yet — use Edit to add steps and details.</div>';
  body.innerHTML=html;
  el('TaskDescM').classList.add('open');
}
function closeTaskDescM(){el('TaskDescM').classList.remove('open');}
function bindTaskDescBtns(root){
  if(!root)return;
  qsa('[data-desc-id]',root).forEach(function(btn){
    if(btn._descBound)return;
    btn._descBound=true;
    btn.onclick=function(e){
      e.stopPropagation();
      openTaskDescM(this.dataset.descId,this.dataset.occ||null);
    };
  });
}
function bindTaskTitleEdits(root){
  if(!root)return;
  qsa('.dayview-task-title-input',root).forEach(function(inp){
    if(inp._titleBound)return;
    inp._titleBound=true;
    inp.onmousedown=function(e){e.stopPropagation();};
    inp.onclick=function(e){e.stopPropagation();};
    inp.onkeydown=function(e){
      if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();this.blur();}
      if(e.key==='Escape'){this.value=this.dataset.lastVal||this.value;this.blur();}
    };
    inp.oninput=function(){autoResizeTitleInput(this);};
    inp.onfocus=function(){this.dataset.lastVal=this.value;autoResizeTitleInput(this);this.select();};
    autoResizeTitleInput(inp);
    inp.onblur=function(){
      var tid=this.dataset.titleId,val=this.value.trim(),last=(this.dataset.lastVal||'').trim();
      if(val===last)return;
      saveTaskDisplayName(tid,this.dataset.occ||null,val,this);
    };
  });
}
async function saveTaskDisplayName(tid,occDate,rawName,inputEl){
  if(!sb){toast('Not connected','error');return;}
  var t=tasks.find(function(x){return x.id===tid;});
  if(!t||!canEditTask(t)){toast('You can only rename your own tasks','error');return;}
  var name=String(rawName||'').replace(/\s*\n+\s*/g,' ').trim(),store=name||null;
  try{
    if(t.is_recurring){
      var anchor=resolveTaskOccDate(t,occDate),ovs=parseOverrides(t),cur=mergeOccurrence(t,anchor);
      var oldLbl=taskDisplayLabel(cur);
      if(name===oldLbl)return;
      var dayPatch=Object.assign({},ovs[anchor]||{});
      if(store)dayPatch.display_name=store;else delete dayPatch.display_name;
      var keys=Object.keys(dayPatch).filter(function(k){return k!=='skipped'&&!k.startsWith('_');});
      if(!keys.length)delete ovs[anchor];else ovs[anchor]=scrubOverrideForSave(dayPatch);
      var r=await sb.from('tasks').update({recur_overrides:ovs,edited_at:nowISO(),edited_by:cu.id}).eq('id',tid);
      if(r.error)throw r.error;
    }else{
      var r2=await sbUpdateTask(tid,{display_name:store,edited_at:nowISO(),edited_by:cu.id});
      if(r2.error)throw r2.error;
      stashLocalDisplayName(tid,store);
      if(!displayNameColMissing&&store!==((t.display_name||'').trim()||null))await sb.from('task_history').insert([{task_id:tid,changed_by:cu.id,field_changed:'display_name',old_value:String(t.display_name||''),new_value:String(store||''),changed_at:nowISO()}]);
    }
    toast('Task renamed ✓');
    await load();
  }catch(e){
    console.error('[4KPI] saveTaskDisplayName',e);
    toast('Could not save name — run supabase_migration.sql for display_name column','error');
    if(inputEl&&inputEl.dataset.lastVal!=null)inputEl.value=inputEl.dataset.lastVal;
  }
}
function renderDayViewTask(t){
  var chk=taskCheckHTML(t);
  var lbl=taskDisplayLabel(t);
  if(lbl.length>56)lbl=lbl.slice(0,54)+'…';
  var acts=taskActionButtons(t,{compact:true});
  return'<div class="dayview-task task-drag-item'+(t.status==='done'?' done':'')+'" data-task-key="'+taskSortKey(t)+'" data-member-id="'+t.member_id+'" title="'+esc(taskDisplayLabel(t))+'">'+taskDragHandle()+chk+'<div class="dayview-task-body"><div class="dayview-task-title-row">'+dayviewTaskTitleHTML(t)+'</div><div class="dayview-task-head">'+taskDescBtnHTML(t)+stag(t.status)+'</div>'+dayviewTaskMetaHTML(t)+(acts?'<div class="dayview-task-acts">'+acts+'</div>':'')+'</div></div>';
}
function buildDayViewHTML(dT,sq,dateKey){
  var q=(sq||'').toLowerCase().trim(),bM={};
  dT.forEach(function(t){if(!bM[t.member_id])bM[t.member_id]=[];bM[t.member_id].push(t);});
  var pool=sortByOrder(getActiveMembers(),'roles');
  if(q){
    pool=pool.filter(function(m){
      if(memberMatchesQuery(m,q))return true;
      return (bM[m.id]||[]).some(function(t){return taskMatchesQuery(t,q);});
    });
  }
  if(!pool.length)return'<div class="dayview-empty">'+(q?'No tasks or people match your search.':'No active team members yet.')+'</div>';
  var rows=pool.map(function(m){
    var mid=m.id,c=getMC(m),mT=applyTaskDayOrder(bM[mid]||[],mid,dateKey);
    if(q&&!memberMatchesQuery(m,q))mT=mT.filter(function(t){return taskMatchesQuery(t,q);});
    var don=mT.filter(function(t){return t.status==='done';}).length,open=mT.length-don;
    var me=isSelfMember(mid)?' dayview-row-me':'';
    var html='<div class="dayview-row'+me+'" data-member-id="'+mid+'" style="--member-accent:'+(c.bg||'var(--border)')+'">';
    html+='<div class="dayview-row-head"><div class="av dayview-av" style="background:'+c.bg+';color:'+c.text+'">'+ini(m.name)+'</div><div class="dayview-col-id"><div class="dayview-col-name">'+m.name+(isOverseerMember(m)?' <span class="overseer-badge">Overseer</span>':'')+(m.is_admin?' <span class="lineup-admin-badge">Admin</span>':'')+(isSelfMember(mid)?' <span class="lineup-you-badge">You</span>':'')+(isInactiveMember(m)?' <span class="inactive-badge">Inactive</span>':'')+'</div><div class="dayview-col-role">'+esc(m.role||'')+'</div><div class="dayview-col-stats">'+(mT.length?mT.length+' task'+(mT.length!==1?'s':'')+' · '+don+' done'+(open?' · '+open+' open':''):'No tasks this day')+'</div></div>'+dayViewRowActions(mid,dateKey,mT.length)+'</div>';
    html+='<div class="dayview-task-grid">';
    if(mT.length)mT.forEach(function(t){html+=renderDayViewTask(t);});
    else html+='<div class="dayview-col-empty">Nothing scheduled — log tasks or restore a saved version</div>';
    html+='</div></div>';
    return html;
  }).join('');
  if(q&&!rows.replace(/\s/g,'').length)return'<div class="dayview-empty">No tasks match your search.</div>';
  return rows;
}
function lineupDateLabel(){
  var d=lineupDate||new Date();
  return d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
}
function accentHex(){return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#f0b429';}
function accentHex2(){return getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim()||'#d99a1a';}
function accentRgba(a){var rgb=getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim()||'240,180,41';return'rgba('+rgb+','+a+')';}
function applyAccentTheme(key,persist){
  var t=ACCENT_THEMES[key]||ACCENT_THEMES.gold;
  document.documentElement.style.setProperty('--accent',t.accent);
  document.documentElement.style.setProperty('--accent2',t.accent2);
  document.documentElement.style.setProperty('--accent-rgb',t.rgb);
  try{lss('4k_accent_theme',key);}catch(x){}
  if(persist!==false&&cu){memberPrefs.accentTheme=key;saveMemberPrefs();}
  rPulse();
  if(el('page-performance')&&el('page-performance').classList.contains('active'))rCharts();
  if(el('page-compare')&&el('page-compare').classList.contains('active'))rCompare();
  var ts=el('themeSwatches');if(ts)renderThemeSwatches();
}
function getMemberPrefsObj(mid){
  if(!mid)return{};
  var m=members.find(function(x){return String(x.id)===String(mid);});
  var fromDb=(m&&m.prefs&&typeof m.prefs==='object')?m.prefs:null;
  var fromLs=ls('4k_mp_'+mid);
  return Object.assign({},fromLs&&typeof fromLs==='object'?fromLs:{},fromDb||{});
}
function getActivityLogTargetId(){
  if(!cu)return null;
  if(!cuIsOverseer())return cu.id;
  if(activityLogTargetId&&members.some(function(m){return String(m.id)===String(activityLogTargetId);}))return activityLogTargetId;
  return cu.id;
}
function activityLogTargetMember(){
  var mid=getActivityLogTargetId();
  return mid?members.find(function(m){return String(m.id)===String(mid);}):null;
}
function activityLogTargetMembers(){
  var pool=getActiveMembers().slice();
  if(!cu)return pool;
  pool.sort(function(a,b){
    if(isSelfMember(a.id))return -1;
    if(isSelfMember(b.id))return 1;
    return(a.name||'').localeCompare(b.name||'');
  });
  return pool;
}
function activityLogTargetLabel(m){
  if(!m)return'';
  if(isSelfMember(m.id))return'Me';
  return(m.name||'').split(' ')[0];
}
function initActivityLogTarget(){
  if(!cu)return;
  if(!cuIsOverseer()){activityLogTargetId=cu.id;return;}
  if(activityLogTargetId&&members.some(function(m){return String(m.id)===String(activityLogTargetId);}))return;
  activityLogTargetId=cu.id;
}
function setActivityLogTarget(mid,opts){
  opts=opts||{};
  if(!cuIsOverseer()||!mid)return;
  if(!members.some(function(m){return String(m.id)===String(mid);})){toast('Member not found','error');return;}
  activityLogTargetId=mid;
  if(opts.silent){
    renderOverseerTeamBoard();
    renderActivityLogTargetBar();
    renderDailyLogPresets();
    syncComposerTargetLabel();
    return;
  }
  resetActivityComposer(false);
  rDailyLogInner();
}
function loadMemberPrefsForCurrentUser(){
  if(!cu)return;
  memberPrefs=getMemberPrefsObj(cu.id);
  if(!memberPrefs.accentTheme)memberPrefs.accentTheme='gold';
  applyAccentTheme(memberPrefs.accentTheme||'gold',false);
  initActivityLogTarget();
}
async function saveMemberPrefs(){
  if(!cu)return;
  lss('4k_mp_'+cu.id,memberPrefs);
  var m=members.find(function(x){return String(x.id)===String(cu.id);});
  if(m)m.prefs=Object.assign({},getMemberPrefsObj(cu.id),memberPrefs);
  if(!sb)return;
  try{
    var r=await sb.from('members').update({prefs:m?m.prefs:memberPrefs}).eq('id',cu.id);
    if(r.error){
      if(/prefs|column.*does not exist|Could not find|PGRST204/i.test((r.error.message||'')+(r.error.details||''))){console.warn('[4KPI] members.prefs column missing — stored locally. Run supabase_migration.sql');return;}
      console.error('[4KPI] saveMemberPrefs failed',r.error,memberPrefs);
    }
  }catch(e){console.error('[4KPI] saveMemberPrefs exception',e,memberPrefs);}
}
function getDefaultActivityPresets(){
  return[
    {id:'p_recruit',description:'Recruitment',category:'Recruitment',time_mins:60},
    {id:'p_chat',description:'Chat review',category:'Chatting',time_mins:120},
    {id:'p_walls',description:'OF walls',category:'Content',time_mins:60},
    {id:'p_telegram',description:'Telegram',category:'Networking',time_mins:60},
    {id:'p_leads',description:'Lead replies',category:'Recruitment',time_mins:60},
    {id:'p_affiliate',description:'Affiliate outreach',category:'Networking',time_mins:60}
  ];
}
function migrateSharedActivityPresets(){
  if(activityPresets&&activityPresets.length)return;
  var fromLs=ls('4k_apresets');
  if(fromLs&&fromLs.length){activityPresets=fromLs;return;}
  var seen={},merged=[];
  function addList(list){
    (list||[]).forEach(function(p){
      if(!p||!(p.description||'').trim())return;
      var key=String(p.description).trim().toLowerCase();
      if(seen[key])return;
      seen[key]=true;
      merged.push({id:p.id||presetUid(),description:String(p.description).trim(),category:p.category||null,time_mins:p.time_mins!=null?p.time_mins:null});
    });
  }
  members.forEach(function(m){
    var prefs=getMemberPrefsObj(m.id);
    addList(prefs.activity_presets);
  });
  activityPresets=merged.length?merged:getDefaultActivityPresets();
  lss('4k_apresets',activityPresets);
  if(sb)saveSettings();
}
function ensureActivityPresets(){
  if(!activityPresets||!activityPresets.length)migrateSharedActivityPresets();
  if(!activityPresets||!activityPresets.length)activityPresets=getDefaultActivityPresets();
  return activityPresets;
}
function saveActivityPresets(){lss('4k_apresets',activityPresets);saveSettings();}
function filterPresetsBySearch(presets,q){
  q=(q||'').trim().toLowerCase();
  return presets.map(function(p,i){return{p:p,i:i};}).filter(function(x){
    if(!q)return true;
    var hay=((x.p.description||'')+' '+(x.p.category||'')).toLowerCase();
    return hay.indexOf(q)>=0;
  });
}
function onPresetSearchInput(){renderDailyLogPresets();}
function onPresetMgrSearchInput(){renderPresetMgrList();}
function normalizeLogDate(v){
  if(v==null||v==='')return'';
  if(typeof v==='string'){var m=v.match(/^(\d{4}-\d{2}-\d{2})/);if(m)return m[1];}
  var d=new Date(v);if(!isNaN(d))return dateInputStr(d);
  return String(v).slice(0,10);
}
function ensureActivityTags(){if(!activityTags||!activityTags.length)activityTags=DEFAULT_ACTIVITY_TAGS.slice();return activityTags;}
function saveActivityTags(){lss('4k_atags',activityTags);saveSettings();}
function presetUid(){return'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function localActivityKey(){
  if(!cu)return'';
  return cuIsOverseer()?'4k_alog_team':'4k_alog_'+cu.id;
}
function canManageActivityEntry(e){
  if(!cu||!e)return false;
  if(cuIsOverseer())return true;
  return String(e.member_id)===String(cu.id);
}
function selectCopyField(field){
  if(!field)return;
  field.focus({preventScroll:true});
  field.select();
  if(typeof field.setSelectionRange==='function')field.setSelectionRange(0,(field.value||'').length);
}
function execCopyField(field){
  if(!field)return false;
  selectCopyField(field);
  try{return document.execCommand('copy');}catch(e){return false;}
}
async function verifyClipboardText(text){
  if(!navigator.clipboard||!navigator.clipboard.readText)return null;
  try{return(await navigator.clipboard.readText())===text;}catch(e){return null;}
}
function copyTextSync(text){
  var helper=el('copyHelper');
  if(helper){
    helper.value=text;
    return execCopyField(helper);
  }
  if(!text)return false;
  var ta=document.createElement('textarea');
  ta.value=text;
  ta.style.cssText='position:fixed;top:0;left:0;width:2em;height:2em;padding:8px;border:1px solid transparent;background:#fff;color:#000;opacity:0.01;z-index:99999';
  document.body.appendChild(ta);
  var ok=execCopyField(ta);
  document.body.removeChild(ta);
  return ok;
}
async function copyTextToClipboard(text){
  if(!text)return false;
  copyTextSync(text);
  var verified=await verifyClipboardText(text);
  if(verified===true)return true;
  if(verified===false)return false;
  return false;
}
function openDailyLogCopyModal(text){
  var box=el('copyDayText'),modal=el('CopyDayM');
  if(!box||!modal)return;
  box.value=text;
  modal.classList.add('open');
  void box.offsetHeight;
  selectCopyField(box);
}
function closeCopyDayModal(){var m=el('CopyDayM');if(m)m.classList.remove('open');}
function selectDaySummaryText(){
  var box=el('copyDayText');
  if(box)selectCopyField(box);
}
function copyFromDayModal(){
  var box=el('copyDayText');
  if(!box)return;
  var text=box.value||'';
  execCopyField(box);
  verifyClipboardText(text).then(function(verified){
    if(verified===true){toast('Day summary copied ✓');closeCopyDayModal();}
    else toast('Press ⌘C (Mac) or Ctrl+C with the text selected','error');
  });
}
function downloadDaySummary(){
  var box=el('copyDayText');
  var text=box&&(box.value||'').trim();
  if(!text){toast('Nothing to download','error');return;}
  var blob=new Blob([text],{type:'text/plain;charset=utf-8'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='daily-log-'+dateInputStr(dailyLogDate||new Date())+'.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  toast('Downloaded ✓');
}
function genActId(){
  if(typeof crypto!=='undefined'&&crypto.randomUUID)return crypto.randomUUID();
  return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);});
}
function isActivityLogTableMissing(err){
  if(!err)return false;
  var code=String(err.code||'');
  if(code==='PGRST205'||code==='42P01')return true;
  var msg=(err.message||'')+(err.details||'')+(err.hint||'');
  return/relation \"activity_log\" does not exist|Could not find the table 'public\.activity_log'|Could not find the table \"public\"\.\"activity_log\"|schema cache.*activity_log|does not exist.*activity_log/i.test(msg);
}
function loadActivityLogFromLocal(){
  var key=localActivityKey();if(!key){activityLog=[];return;}
  var data=ls(key);activityLog=Array.isArray(data)?data:[];
}
function persistActivityLogLocal(){var key=localActivityKey();if(key)lss(key,activityLog);}
function markActivityLogConnected(){
  activityLogSupabaseOk=true;
  activityLogLocalOnly=false;
  try{sessionStorage.setItem('4k_alog_ok','1');}catch(x){}
  syncActivitySetupBanner();
}
function syncActivitySetupBanner(){
  var b=el('dailyLogSetupBanner');
  if(!b)return;
  var show=activityLogLocalOnly&&!activityLogSupabaseOk;
  b.hidden=!show;
  b.classList.toggle('is-hidden',!show);
  b.style.display=show?'flex':'none';
}
async function probeActivityLogSupabase(){
  if(!sb||!cu)return false;
  if(activityLogSupabaseOk)return true;
  try{
    var q=sb.from('activity_log').select('id').limit(1);
    if(!cuIsOverseer())q=q.eq('member_id',cu.id);
    var r=await q;
    if(!r.error){
      markActivityLogConnected();
      return true;
    }
    activityLogLastErr=r.error.message||'Unknown error';
    if(isActivityLogTableMissing(r.error)){
      activityLogLocalOnly=true;
      syncActivitySetupBanner();
      return false;
    }
  }catch(e){
    activityLogLastErr=e.message||String(e);
  }
  syncActivitySetupBanner();
  return false;
}
var ACTIVITY_LOG_SETUP_SQL="CREATE TABLE IF NOT EXISTS activity_log (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,\n  description TEXT NOT NULL,\n  time_spent TEXT,\n  time_minutes INTEGER,\n  category TEXT,\n  log_date DATE NOT NULL DEFAULT CURRENT_DATE,\n  created_at TIMESTAMPTZ DEFAULT now(),\n  updated_at TIMESTAMPTZ DEFAULT now()\n);\n\nCREATE INDEX IF NOT EXISTS activity_log_member_date ON activity_log (member_id, log_date DESC);\n\nALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS \"activity_log_select\" ON activity_log;\nDROP POLICY IF EXISTS \"activity_log_insert\" ON activity_log;\nDROP POLICY IF EXISTS \"activity_log_update\" ON activity_log;\nDROP POLICY IF EXISTS \"activity_log_delete\" ON activity_log;\n\nCREATE POLICY \"activity_log_select\" ON activity_log FOR SELECT USING (true);\nCREATE POLICY \"activity_log_insert\" ON activity_log FOR INSERT WITH CHECK (true);\nCREATE POLICY \"activity_log_update\" ON activity_log FOR UPDATE USING (true);\nCREATE POLICY \"activity_log_delete\" ON activity_log FOR DELETE USING (true);\n\nGRANT ALL ON TABLE activity_log TO anon, authenticated;";
async function copyActivityLogSetupSQL(){
  try{
    var ok=await copyTextToClipboard(ACTIVITY_LOG_SETUP_SQL);
    if(ok)toast('SQL copied — paste in Supabase SQL Editor & Run');
    else{prompt('Copy this SQL into Supabase → SQL Editor → Run:',ACTIVITY_LOG_SETUP_SQL);}
  }catch(e){
    prompt('Copy this SQL into Supabase → SQL Editor → Run:',ACTIVITY_LOG_SETUP_SQL);
  }
}
async function retryActivityLogSupabase(){
  var btn=el('dailyLogSetupRetryBtn');
  if(btn)btn.disabled=true;
  activityLogLocalOnly=false;
  var probed=await probeActivityLogSupabase();
  var res=probed?{ok:true}:await loadActivityLog();
  syncActivitySetupBanner();
  if(btn)btn.disabled=false;
  if(res.ok||activityLogSupabaseOk||!activityLogLocalOnly){
    markActivityLogConnected();
    toast('Connected to Supabase ✓');
    rDailyLogInner();
  }else{
    toast((res.error||activityLogLastErr||'Could not reach activity_log')+' — try a hard refresh','error');
  }
}
function saveActivityLogLocalRow(payload,eid){
  var now=nowISO(),row;
  if(eid){
    var idx=activityLog.findIndex(function(x){return x.id===eid;});
    var prev=idx>=0?activityLog[idx]:{};
    row=Object.assign({},prev,payload,{id:eid,updated_at:now});
    if(idx>=0)activityLog[idx]=row;
  }else{
    row=Object.assign({},payload,{id:genActId(),created_at:now,updated_at:now});
    activityLog.unshift(row);
  }
  persistActivityLogLocal();
  return row;
}
function clearActivityLogLocalIfSynced(){
  var key=localActivityKey();if(!key)return;
  var local=ls(key);
  if(!local||!local.length){lss(key,[]);return;}
  var remoteIds={};
  activityLog.forEach(function(e){remoteIds[e.id]=true;});
  var remaining=local.filter(function(L){return L&&L.id&&!remoteIds[L.id];});
  if(!remaining.length)lss(key,[]);
  else lss(key,remaining);
}
async function loadActivityLog(){
  if(!cu){activityLog=[];return{ok:false};}
  var seq=++activityLogLoadSeq;
  function stale(){return seq!==activityLogLoadSeq;}
  function apply(fn){if(!stale())fn();}
  if(!sb){
    apply(function(){loadActivityLogFromLocal();activityLogLocalOnly=true;syncActivitySetupBanner();});
    activityLogLastErr='No Supabase client';
    return{ok:false,error:activityLogLastErr};
  }
  try{
    var q=sb.from('activity_log').select('*').order('log_date',{ascending:false}).order('created_at',{ascending:false});
    if(!cuIsOverseer())q=q.eq('member_id',cu.id);
    var r=await q;
    if(stale())return{ok:false,stale:true};
    if(r.error){
      activityLogLastErr=r.error.message||'Unknown error';
      if(isActivityLogTableMissing(r.error)){
        console.warn('[4KPI] activity_log table missing — using local storage',r.error);
        apply(function(){loadActivityLogFromLocal();activityLogLocalOnly=true;syncActivitySetupBanner();});
        return{ok:false,error:activityLogLastErr,missing:true};
      }
      apply(function(){sbErr('activity_log',r);activityLog=[];activityLogLocalOnly=false;syncActivitySetupBanner();});
      return{ok:false,error:activityLogLastErr};
    }
    apply(function(){
      activityLog=r.data||[];
      markActivityLogConnected();
    });
    if(stale())return{ok:true,stale:true};
    var local=ls(localActivityKey());
    if(local&&local.length){
      try{
        var remoteIds={};
        activityLog.forEach(function(e){remoteIds[e.id]=true;});
        var synced=0;
        for(var i=0;i<local.length;i++){
          var L=local[i];
          if(!L||!L.description||!String(L.description).trim())continue;
          if(L.id&&remoteIds[L.id])continue;
          var pl={member_id:L.member_id||cu.id,description:L.description,time_spent:L.time_spent,time_minutes:L.time_minutes,category:L.category,log_date:normalizeLogDate(L.log_date),updated_at:nowISO(),created_at:L.created_at||nowISO()};
          if(L.id)pl.id=L.id;
          var ins=await sb.from('activity_log').insert([pl]);
          if(!ins.error)synced++;
        }
        clearActivityLogLocalIfSynced();
        if(synced>0){
          var q2=sb.from('activity_log').select('*').order('log_date',{ascending:false}).order('created_at',{ascending:false});
          if(!cuIsOverseer())q2=q2.eq('member_id',cu.id);
          var r2=await q2;
          if(!r2.error&&!stale())activityLog=r2.data||[];
          toast('Local entries synced to Supabase ✓');
        }else clearActivityLogLocalIfSynced();
      }catch(syncErr){console.warn('[4KPI] local activity sync failed',syncErr);}
    }else clearActivityLogLocalIfSynced();
    return{ok:true};
  }catch(e){
    if(stale())return{ok:false,stale:true};
    activityLogLastErr=e.message||String(e);
    console.error('[4KPI] loadActivityLog',e);
    apply(function(){loadActivityLogFromLocal();activityLogLocalOnly=true;syncActivitySetupBanner();});
    return{ok:false,error:activityLogLastErr};
  }
}
function dateInputStr(d){var x=new Date(d);if(isNaN(x))x=new Date();return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');}
function parseDateInput(s){if(!s)return new Date();var p=String(s).split('-');if(p.length!==3)return new Date();return new Date(parseInt(p[0],10),parseInt(p[1],10)-1,parseInt(p[2],10));}
function getWeekStartMonday(d){var x=new Date(d);x.setHours(0,0,0,0);var day=x.getDay(),diff=day===0?-6:1-day;x.setDate(x.getDate()+diff);return x;}
function formatTimeShort(mins){
  if(mins==null||mins==='')return'';
  var n=parseInt(mins,10);if(isNaN(n)||n<=0)return'';
  var h=Math.floor(n/60),m=n%60;
  if(h&&!m)return h+(h===1?' hr':' hrs');
  if(!h&&m)return m+(m===1?' min':' mins');
  return h+(h===1?' hr':' hrs')+' '+m+' mins';
}
function activityTimeLabel(e){if(!e)return'';if(e.time_spent&&String(e.time_spent).trim())return String(e.time_spent).trim();return formatTimeShort(e.time_minutes);}
function entryCategories(e){
  if(!e)return[];
  if(e.categories&&Array.isArray(e.categories)&&e.categories.length)return e.categories.map(function(c){return String(c).trim();}).filter(Boolean);
  if(!e.category)return[];
  return String(e.category).split(',').map(function(s){return s.trim();}).filter(Boolean);
}
function stripParens(desc){
  return(desc||'').replace(/\s*\([^)]*\)/g,' ').replace(/\s+/g,' ').trim();
}
function matchPresetHead(desc){
  var s=(desc||'').trim();
  if(!s)return null;
  var presetList=ensureActivityPresets().map(function(p){return(p.description||'').trim();}).filter(Boolean);
  presetList.sort(function(a,b){return b.length-a.length;});
  var firstLine=s.split('\n')[0].trim();
  for(var i=0;i<presetList.length;i++){
    if(firstLine.toLowerCase().indexOf(presetList[i].toLowerCase())===0)return presetList[i];
  }
  return null;
}
function condenseActivityLine(line){
  var preset=matchPresetHead(line);
  if(preset)return preset;
  var s=stripParens(line).split(/\.\s+/)[0].trim();
  if(s.length>100)s=s.slice(0,97).trim()+'…';
  return s;
}
function condenseActivityDescription(desc){
  var lines=(desc||'').trim().split(/\n+/).map(function(l){return l.trim();}).filter(Boolean);
  if(!lines.length)return'';
  if(lines.length===1)return condenseActivityLine(lines[0]);
  return lines.map(condenseActivityLine).filter(Boolean).join(' · ');
}
function formatActivityExportLine(e){
  var desc=condenseActivityDescription(e.description),time=activityTimeLabel(e),cats=entryCategories(e);
  var suffix='';
  if(time)suffix+=' — '+time;
  if(cats.length)suffix+=' ['+cats.join(', ')+']';
  return(desc||'Activity')+suffix;
}
function formatDailyLogExportSummary(entries,refDate){
  var d=refDate||dailyLogDate||new Date();
  var label=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  var totalMins=entries.reduce(function(s,e){return s+(e.time_minutes||0);},0);
  var lines=['Daily log — '+label,entries.length+' entr'+(entries.length===1?'y':'ies')+(totalMins?' · '+formatTimeShort(totalMins)+' total':'')];
  lines.push('');
  entries.slice().reverse().forEach(function(e){
    var desc=condenseActivityDescription(e.description);
    var time=activityTimeLabel(e);
    var cats=entryCategories(e);
    var head=cats.length?cats.join(', '):'Activity';
    var line='• '+head;
    if(time)line+=' ('+time+')';
    if(desc)line+=': '+desc;
    lines.push(line);
  });
  return lines.join('\n');
}
function activityForMemberDay(mid,d){
  if(!mid)return[];
  var key=dateInputStr(d||dailyLogDate||new Date());
  return activityLog.filter(function(e){return String(e.member_id)===String(mid)&&normalizeLogDate(e.log_date)===key;}).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at);});
}
function myActivityForDay(d){
  var mid=getActivityLogTargetId();
  if(!mid&&cu)mid=cu.id;
  return activityForMemberDay(mid,d);
}
function categoryTotalsForEntries(entries){
  var totals={};
  entries.forEach(function(e){
    var cats=entryCategories(e);
    if(!cats.length)cats=['Uncategorized'];
    var mins=e.time_minutes||0,share=cats.length&&mins?Math.round(mins/cats.length):mins;
    cats.forEach(function(cat){
      if(!totals[cat])totals[cat]=0;
      if(share)totals[cat]+=share;
    });
  });
  return totals;
}
function dailyCategoryTotals(refDate){
  return categoryTotalsForEntries(myActivityForDay(refDate||dailyLogDate||new Date()));
}
function weeklyCategoryTotals(refDate){
  var start=getWeekStartMonday(refDate||dailyLogDate||new Date()),end=new Date(start);end.setDate(end.getDate()+7);
  return categoryTotalsForEntries(activityLog.filter(function(e){
    var mid=getActivityLogTargetId();
    if(!mid)return false;
    if(String(e.member_id)!==String(mid))return false;
    var d=parseDateInput(normalizeLogDate(e.log_date));return d>=start&&d<end;
  }));
}
function dailyLogDayLabel(d){
  d=d||dailyLogDate||new Date();
  return dateInputStr(d)===dateInputStr(new Date())?'Today':d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
}
function renderTodayTotals(){
  var box=el('dailyLogToday');if(!box)return;
  var entries=myActivityForDay(dailyLogDate),totals=dailyCategoryTotals(dailyLogDate),cats=Object.keys(totals).sort();
  var totalMins=entries.reduce(function(s,e){return s+(e.time_minutes||0);},0);
  var label=dailyLogDayLabel(dailyLogDate);
  var tm=activityLogTargetMember();
  if(cuIsOverseer()&&tm&&String(tm.id)!==String(cu.id))label=tm.name.split(' ')[0]+' · '+label;
  var meta=!entries.length?'Nothing logged yet':entries.length+' entr'+(entries.length===1?'y':'ies')+(totalMins?' · '+formatTimeShort(totalMins)+' total':'');
  var head='<div class="dailylog-today-head"><div class="dailylog-today-head-main"><span class="dailylog-today-title">'+esc(label)+'</span><span class="dailylog-today-meta">'+esc(meta)+'</span></div><button type="button" class="btn sm dailylog-week-toggle" onclick="toggleWeekView()">'+(weekViewOpen?'Hide week':'This week')+'</button></div>';
  if(!cats.length){box.innerHTML=head+'<div class="dailylog-today-empty">Log time below to see where it went</div>';return;}
  box.innerHTML=head+'<div class="dailylog-today-pills">'+cats.map(function(cat){return'<span class="dailylog-today-pill"><strong>'+esc(cat)+'</strong> '+esc(formatTimeShort(totals[cat]))+'</span>';}).join('')+'</div>';
}
function renderWeeklyTotals(){
  var box=el('dailyLogWeek');if(!box)return;
  var totals=weeklyCategoryTotals(dailyLogDate),cats=Object.keys(totals).sort();
  if(!cats.length){box.innerHTML='<div class="dailylog-week-empty">This week — log time to see where it goes</div>';return;}
  var start=getWeekStartMonday(dailyLogDate),end=new Date(start);end.setDate(end.getDate()+6);
  box.innerHTML='<div class="dailylog-week-title">This week · '+start.toLocaleDateString(undefined,{month:'short',day:'numeric'})+' – '+end.toLocaleDateString(undefined,{month:'short',day:'numeric'})+'</div><div class="dailylog-week-pills">'+cats.map(function(cat){return'<span class="dailylog-week-pill"><strong>'+esc(cat)+'</strong> '+esc(formatTimeShort(totals[cat]))+'</span>';}).join('')+'</div>';
}
function toggleWeekView(){
  weekViewOpen=!weekViewOpen;
  var wrap=el('dailyLogWeekWrap');
  if(wrap)wrap.hidden=!weekViewOpen;
  renderTodayTotals();
  if(weekViewOpen)renderWeeklyTotals();
}
function renderActCatBubbles(){
  var tags=ensureActivityTags(),wrap=el('actCatWrap');if(!wrap)return;
  wrap.innerHTML=tags.map(function(t){
    return'<span class="sb'+(actCategories.indexOf(t)>=0?' on':'')+'" data-act-cat="'+esc(t)+'">'+esc(t)+'</span>';
  }).join('');
  qsa('[data-act-cat]',wrap).forEach(function(b){b.onclick=function(){toggleActCategory(this.dataset.actCat);};});
}
function toggleActCategory(cat){
  if(!cat)return;
  var i=actCategories.indexOf(cat);
  if(i>=0)actCategories.splice(i,1);else actCategories.push(cat);
  renderActCatBubbles();
}
function setActCategories(cats){
  actCategories=(cats||[]).filter(Boolean).slice();
  renderActCatBubbles();
}
function renderEntryCategoryTags(e){
  return entryCategories(e).map(function(c){return'<span class="dailylog-tag">'+esc(c)+'</span>';}).join('');
}
function bindActTimeChips(){
  if(actTimeChipsBound)return;
  var box=el('actTimeChips');if(!box)return;
  actTimeChipsBound=true;
  box.addEventListener('click',function(e){
    var btn=e.target.closest('[data-act-mins]');if(!btn)return;
    var v=btn.dataset.actMins;
    if(v==='custom')setActTimeMins(null,true);
    else setActTimeMins(parseInt(v,10),false);
  });
}
function setActTimeMins(mins,isCustom){
  actSelectedMins=isCustom?null:(mins==null?null:mins);
  actTimeIsCustom=!!isCustom;
  qsa('#actTimeChips .tchip').forEach(function(b){
    var m=b.dataset.actMins;
    if(m==='custom')b.classList.toggle('on',isCustom);
    else b.classList.toggle('on',!isCustom&&actSelectedMins!=null&&parseInt(m,10)===actSelectedMins);
  });
  var cust=el('actTimeCustom');
  if(cust){cust.hidden=!isCustom;if(isCustom)setTimeout(function(){cust.focus();},50);else cust.value='';}
}
function applyActivityTimeFromRow(row){
  if(!row){setActTimeMins(null,false);return;}
  if(row.time_minutes&&ACT_TIME_CHIP_MINS.indexOf(row.time_minutes)>=0){setActTimeMins(row.time_minutes,false);return;}
  if(row.time_spent){
    var parsed=parseTimePhrase(row.time_spent);
    if(parsed&&ACT_TIME_CHIP_MINS.indexOf(parsed)>=0){setActTimeMins(parsed,false);return;}
    setActTimeMins(null,true);
    var cust=el('actTimeCustom');if(cust)cust.value=row.time_spent;
    return;
  }
  if(row.time_minutes){setActTimeMins(null,true);var c=el('actTimeCustom');if(c)c.value=formatTimeShort(row.time_minutes);return;}
  setActTimeMins(null,false);
}
function presetTimeIsCustom(mins){
  return mins!=null&&ACT_TIME_CHIP_MINS.indexOf(mins)<0;
}
function presetTimeSelectValue(mins){
  if(mins==null||mins==='')return'';
  if(ACT_TIME_CHIP_MINS.indexOf(mins)>=0)return String(mins);
  return'custom';
}
function presetCustomTimeLabel(mins){
  if(mins==null||ACT_TIME_CHIP_MINS.indexOf(mins)>=0)return'';
  return formatTimeShort(mins)||'';
}
function applyPresetTimeMins(mins){
  if(mins==null){setActTimeMins(null,false);return;}
  if(ACT_TIME_CHIP_MINS.indexOf(mins)>=0)setActTimeMins(mins,false);
  else{setActTimeMins(null,true);var c=el('actTimeCustom');if(c)c.value=formatTimeShort(mins);}
}
function renderDailyLogPresets(){
  var box=el('dailyLogPresets');if(!box)return;
  var presets=ensureActivityPresets();
  var prev=el('dailyLogPresetSearch');
  var q=prev?prev.value:'';
  var filtered=filterPresetsBySearch(presets,q);
  var gridHtml=filtered.length?filtered.map(function(x){
    var p=x.p,i=x.i;
    var pcats=entryCategories(p).length?entryCategories(p):[p.category].filter(Boolean);
    var on=selectedPresetIndices.indexOf(i)>=0;
    return'<button type="button" class="dailylog-preset-btn'+(on?' on':'')+'" onclick="togglePreset('+i+')" title="'+(pcats.length?esc(pcats.join(', '))+' · ':'')+(p.time_mins?esc(formatTimeShort(p.time_mins)):'' )+'">'+esc(p.description)+'</button>';
  }).join(''):'<div class="dailylog-presets-empty">'+(q?'No presets match your search.':'No presets yet — open Manage presets.')+'</div>';
  box.innerHTML='<div class="dailylog-presets-head"><span class="dailylog-presets-lbl">Quick start</span><span class="dailylog-presets-hint">Shared · tap to combine</span><button type="button" class="btn sm" onclick="openPresetManager()">Manage presets</button></div><input type="search" id="dailyLogPresetSearch" class="dailylog-preset-search" placeholder="Search presets…" value="'+esc(q)+'" oninput="onPresetSearchInput()" autocomplete="off"><div class="dailylog-presets-grid">'+gridHtml+'</div>';
}
function clearPresetSelection(){selectedPresetIndices=[];renderDailyLogPresets();}
function applySelectedPresetsToComposer(){
  initActivityComposer();
  var presets=ensureActivityPresets();
  var selected=selectedPresetIndices.map(function(i){return presets[i];}).filter(Boolean);
  if(!selected.length){
    if(el('actDesc'))el('actDesc').value='';
    setActCategories([]);
    setActTimeMins(null,false);
    renderActCatBubbles();
    return;
  }
  if(el('actDesc'))el('actDesc').value=selected.map(function(p){return(p.description||'').trim();}).filter(Boolean).join('\n');
  var allCats=[];
  selected.forEach(function(p){
    entryCategories(p).forEach(function(cat){if(allCats.indexOf(cat)<0)allCats.push(cat);});
  });
  setActCategories(allCats);
  var totalMins=0,hasTime=false;
  selected.forEach(function(p){if(p.time_mins){totalMins+=p.time_mins;hasTime=true;}});
  if(hasTime){
    if(ACT_TIME_CHIP_MINS.indexOf(totalMins)>=0)setActTimeMins(totalMins,false);
    else{setActTimeMins(null,true);var c=el('actTimeCustom');if(c)c.value=formatTimeShort(totalMins);}
  }else setActTimeMins(null,false);
  renderActCatBubbles();
}
function togglePreset(idx){
  var presets=ensureActivityPresets();if(!presets[idx])return;
  var pos=selectedPresetIndices.indexOf(idx);
  if(pos>=0)selectedPresetIndices.splice(pos,1);
  else selectedPresetIndices.push(idx);
  applySelectedPresetsToComposer();
  renderDailyLogPresets();
  var comp=el('dailyLogComposer');if(comp)comp.scrollIntoView({behavior:'smooth',block:'nearest'});
  setTimeout(function(){var ta=el('actDesc');if(ta)ta.focus();},50);
}
function startFromPreset(idx){togglePreset(idx);}
function syncComposerUI(){
  var editing=!!(el('actEid')&&el('actEid').value);
  var saveBtn=el('actSaveBtn'),delBtn=el('actDelBtn'),cancelBtn=el('actCancelBtn'),badge=el('activityComposerEditing'),comp=el('dailyLogComposer');
  syncComposerTargetLabel();
  if(saveBtn)saveBtn.textContent=editing?'Update':'Save & next';
  if(delBtn)delBtn.style.display=editing?'':'none';
  if(cancelBtn)cancelBtn.hidden=!editing;
  if(badge)badge.hidden=!editing;
  if(comp)comp.classList.toggle('editing',editing);
}
function resetActivityComposer(focusDesc){
  if(el('actEid'))el('actEid').value='';
  if(el('actDesc'))el('actDesc').value='';
  setActTimeMins(null,false);
  setActCategories([]);
  clearPresetSelection();
  if(el('actDate'))el('actDate').value=dateInputStr(dailyLogDate);
  syncComposerUI();
  renderActCatBubbles();
  if(focusDesc){setTimeout(function(){var ta=el('actDesc');if(ta)ta.focus();},40);}
}
function focusActivityComposer(preset){
  if(!cu)return;
  initActivityComposer();
  var comp=el('dailyLogComposer');
  if(comp)comp.scrollIntoView({behavior:'smooth',block:'start'});
  resetActivityComposer(false);
  if(preset){
    clearPresetSelection();
    if(el('actDesc'))el('actDesc').value=preset.description||'';
    var pcats=entryCategories(preset).length?entryCategories(preset):[preset.category].filter(Boolean);
    setActCategories(pcats);
    if(preset.time_mins)applyPresetTimeMins(preset.time_mins);
    renderActCatBubbles();
  }
  setTimeout(function(){var ta=el('actDesc');if(ta)ta.focus();},80);
}
function loadActivityForEdit(id){
  if(!cu)return;
  var row=activityLog.find(function(x){return x.id===id;});
  if(!row||!canManageActivityEntry(row)){toast('Entry not found','error');return;}
  if(cuIsOverseer()&&String(row.member_id)!==String(getActivityLogTargetId()))setActivityLogTarget(row.member_id,{silent:true});
  initActivityComposer();
  clearPresetSelection();
  el('actEid').value=row.id;
  el('actDesc').value=row.description||'';
  applyActivityTimeFromRow(row);
  setActCategories(entryCategories(row));
  el('actDate').value=normalizeLogDate(row.log_date)||dateInputStr(dailyLogDate);
  syncComposerUI();
  renderActCatBubbles();
  var comp=el('dailyLogComposer');
  if(comp)comp.scrollIntoView({behavior:'smooth',block:'nearest'});
  setTimeout(function(){var ta=el('actDesc');if(ta)ta.focus();},60);
}
function initActivityComposer(){
  if(activityComposerInited)return;
  activityComposerInited=true;
  bindActTimeChips();
  ensureActivityTags();
  renderActCatBubbles();
  if(el('actDate'))el('actDate').value=dateInputStr(dailyLogDate);
  syncComposerUI();
}
function cancelActivityEdit(){resetActivityComposer(true);}
function openPresetManager(){
  renderPresetMgrList();
  var title=el('presetMgrTitle');
  if(title)title.textContent='Team presets';
  var desc=el('presetMgrDesc');
  if(desc)desc.textContent='One shared list for everyone — rename, set default time/category, or delete. Changes sync for the whole team.';
  el('PresetM').classList.add('open');
}
function closePresetManager(){el('PresetM').classList.remove('open');renderDailyLogPresets();}
function renderPresetMgrList(){
  var box=el('presetMgrList');if(!box)return;
  var presets=ensureActivityPresets(),tags=ensureActivityTags();
  var prev=el('presetMgrSearch');
  var q=prev?prev.value:'';
  var filtered=filterPresetsBySearch(presets,q);
  if(!presets.length){box.innerHTML='<div class="preset-mgr-empty">No presets yet — add one below.</div>';return;}
  var rows=filtered.length?filtered.map(function(x){
    var p=x.p,i=x.i;
    var tagOpts=tags.map(function(t){return'<option value="'+esc(t)+'"'+(p.category===t?' selected':'')+'>'+esc(t)+'</option>';}).join('');
    var timeOpts=ACT_TIME_CHIP_MINS.map(function(m){return'<option value="'+m+'"'+(p.time_mins===m?' selected':'')+'>'+esc(formatTimeShort(m))+'</option>';}).join('');
    var isCustom=presetTimeIsCustom(p.time_mins);
    var selVal=presetTimeSelectValue(p.time_mins);
    return'<div class="preset-mgr-row" data-preset-idx="'+i+'"><div class="preset-mgr-row-top"><div class="preset-mgr-name-wrap"><label class="preset-mgr-lbl">Preset name</label><input type="text" value="'+esc(p.description)+'" placeholder="e.g. Recruitment" oninput="updatePresetField('+i+',\'description\',this.value)"></div><button type="button" class="btn sm danger preset-mgr-del" onclick="deletePreset('+i+')" title="Delete preset">Delete</button></div><div class="preset-mgr-row-meta"><label class="preset-mgr-lbl">Category</label><select onchange="updatePresetField('+i+',\'category\',this.value)">'+tagOpts+'</select><label class="preset-mgr-lbl">Default time</label><select id="presetTimeSel_'+i+'" onchange="onPresetTimeSelect('+i+',this)"><option value="">—</option>'+timeOpts+'<option value="custom"'+(selVal==='custom'?' selected':'')+'>Custom</option></select><input type="text" id="presetTimeCustom_'+i+'" class="preset-time-custom" placeholder="e.g. 45 mins, 1 hr 30 mins"'+(isCustom?' value="'+esc(presetCustomTimeLabel(p.time_mins))+'"':' hidden')+' onchange="updatePresetCustomTime('+i+',this.value)" onkeydown="if(event.key===\'Enter\'){event.preventDefault();updatePresetCustomTime('+i+',this.value);}"></div></div>';
  }).join(''):'<div class="preset-mgr-empty">No presets match your search.</div>';
  box.innerHTML='<input type="search" id="presetMgrSearch" class="dailylog-preset-search preset-mgr-search" placeholder="Search presets…" value="'+esc(q)+'" oninput="onPresetMgrSearchInput()" autocomplete="off">'+rows;
}
function onPresetTimeSelect(idx,sel){
  var custom=el('presetTimeCustom_'+idx);
  if(sel.value==='custom'){
    if(custom){custom.hidden=false;custom.focus();var p=ensureActivityPresets()[idx];if(!custom.value&&p&&p.time_mins)custom.value=presetCustomTimeLabel(p.time_mins);}
    return;
  }
  if(custom)custom.hidden=true;
  updatePresetField(idx,'time_mins',sel.value?parseInt(sel.value,10):null);
}
function updatePresetCustomTime(idx,raw){
  var rawStr=(raw||'').trim();
  if(!rawStr){updatePresetField(idx,'time_mins',null);return;}
  var mins=parseTimePhrase(rawStr);
  if(mins==null){toast('Try "45 mins", "1 hour 30 mins", etc.','error');return;}
  updatePresetField(idx,'time_mins',mins);
  var sel=el('presetTimeSel_'+idx);
  if(sel)sel.value='custom';
}
function updatePresetField(idx,field,val){
  var presets=ensureActivityPresets();if(!presets[idx])return;
  if(field==='description')presets[idx].description=String(val||'').trim()||'Untitled preset';
  else if(field==='category')presets[idx].category=val||null;
  else if(field==='time_mins')presets[idx].time_mins=val||null;
  saveActivityPresets();
  if(field==='description')renderDailyLogPresets();
}
function deletePreset(idx){
  var presets=ensureActivityPresets();
  if(!presets[idx])return;
  if(!confirm('Delete preset “'+(presets[idx].description||'Untitled')+'”?'))return;
  presets.splice(idx,1);
  selectedPresetIndices=selectedPresetIndices.filter(function(i){return i!==idx;}).map(function(i){return i>idx?i-1:i;});
  saveActivityPresets();
  renderPresetMgrList();
  renderDailyLogPresets();
  applySelectedPresetsToComposer();
  toast('Preset deleted ✓');
}
function addPresetRow(){
  var presets=ensureActivityPresets(),tags=ensureActivityTags();
  presets.push({id:presetUid(),description:'New preset',category:tags[0]||'Other',time_mins:60});
  saveActivityPresets();
  renderPresetMgrList();
  renderDailyLogPresets();
  var box=el('presetMgrList');if(box){var inp=box.querySelector('.preset-mgr-row:last-child input');if(inp){inp.focus();inp.select();}}
}
function openThemeModal(){renderThemeSwatches();el('ThemeM').classList.add('open');}
function closeThemeModal(){el('ThemeM').classList.remove('open');}
function renderThemeSwatches(){
  var box=el('themeSwatches');if(!box)return;
  var cur=memberPrefs.accentTheme||'gold';
  box.innerHTML=Object.keys(ACCENT_THEMES).map(function(k){
    var t=ACCENT_THEMES[k];
    return'<button type="button" class="theme-swatch'+(cur===k?' on':'')+'" style="background:'+t.accent+';color:'+t.accent+'" title="'+esc(t.label)+'" onclick="pickAccentTheme(\''+k+'\')"><span class="theme-swatch-lbl">'+esc(t.label)+'</span></button>';
  }).join('');
}
function pickAccentTheme(key){applyAccentTheme(key,true);toast('Accent updated ✓');}
function renderTagManagerPanel(){
  var panel=el('dailyLogTagMgr');if(!panel||panel.hidden)return;
  var tags=ensureActivityTags();
  panel.innerHTML='<div class="dailylog-tagmgr-inner"><div class="dailylog-tagmgr-list">'+tags.map(function(t,i){return'<span class="dailylog-tag-chip">'+esc(t)+(tags.length>1?'<button type="button" onclick="removeActivityTag('+i+')" title="Remove">×</button>':'')+'</span>';}).join('')+'</div><div class="dailylog-tagmgr-add"><input id="dailyLogTagNew" placeholder="New tag name…"><button type="button" class="btn sm" onclick="addActivityTagFromMgr()">Add tag</button></div></div>';
}
function toggleTagManager(){tagMgrOpen=!tagMgrOpen;var panel=el('dailyLogTagMgr');if(panel){panel.hidden=!tagMgrOpen;if(tagMgrOpen)renderTagManagerPanel();}}
function addActivityTagFromMgr(){var inp=el('dailyLogTagNew');if(!inp)return;var name=inp.value.trim();if(!name)return;ensureActivityTags();if(activityTags.some(function(t){return t.toLowerCase()===name.toLowerCase();})){toast('Tag already exists','error');return;}activityTags.push(name);saveActivityTags();inp.value='';renderActCatBubbles();renderTagManagerPanel();toast('Tag added ✓');}
function addActivityTagFromModal(){var inp=el('actCatNew');if(!inp)return;var name=inp.value.trim();if(!name)return;ensureActivityTags();if(!activityTags.some(function(t){return t.toLowerCase()===name.toLowerCase();})){activityTags.push(name);saveActivityTags();}toggleActCategory(name);inp.value='';toast('Tag added ✓');}
function removeActivityTag(idx){ensureActivityTags();if(activityTags.length<=1){toast('Keep at least one tag','error');return;}var removed=activityTags[idx];activityTags.splice(idx,1);saveActivityTags();actCategories=actCategories.filter(function(c){return c!==removed;});renderActCatBubbles();renderTagManagerPanel();rDailyLog();}
function rDailyLog(){
  if(!cu)return;
  rDailyLogInner();
  if(!activityLogSupabaseOk&&sb)probeActivityLogSupabase().then(function(ok){if(ok)rDailyLogInner();});
}
function renderActivityLogTargetBar(){
  var wrap=el('activityLogTargetWrap');if(!wrap)return;
  if(!cuIsOverseer()){wrap.hidden=true;wrap.innerHTML='';return;}
  wrap.hidden=false;
  var target=getActivityLogTargetId();
  var pills=activityLogTargetMembers().map(function(m){
    return'<button type="button" class="otb-logfor-pill'+(String(m.id)===String(target)?' on':'')+'" onclick="setActivityLogTarget(\''+m.id+'\')">'+esc(activityLogTargetLabel(m))+'</button>';
  }).join('');
  wrap.innerHTML='<div class="otb-logfor"><span class="otb-logfor-lbl">Logging for</span><div class="otb-logfor-pills">'+pills+'</div></div>';
}
function renderOverseerTeamBoard(){
  var box=el('overseerTeamBoard');if(!box)return;
  if(!cuIsOverseer()){box.hidden=true;box.innerHTML='';return;}
  box.hidden=false;
  var day=dailyLogDate||new Date();
  var team=activityLogTargetMembers();
  var totalTeamMins=0,target=getActivityLogTargetId();
  var cards=team.map(function(m){
    var entries=activityForMemberDay(m.id,day);
    var mins=entries.reduce(function(s,e){return s+(e.time_minutes||0);},0);
    totalTeamMins+=mins;
    var c=getMC(m),active=String(m.id)===String(target)?' otb-card-active':'';
    var youBadge=isSelfMember(m.id)?' <span class="otb-you-badge">You</span>':'';
    var lines=entries.slice(0,5).map(function(e){
      return'<li>'+esc(condenseActivityDescription(e.description))+(activityTimeLabel(e)?' <span class="otb-time">'+esc(activityTimeLabel(e))+'</span>':'')+'</li>';
    }).join('');
    var more=entries.length>5?'<li class="otb-more">+'+(entries.length-5)+' more</li>':'';
    return'<button type="button" class="otb-card'+active+'" onclick="setActivityLogTarget(\''+m.id+'\')"><div class="otb-card-head"><div class="otb-av" style="background:'+c.bg+';color:'+c.text+'">'+ini(m.name)+'</div><div class="otb-card-id"><div class="otb-name">'+esc(m.name)+youBadge+'</div><div class="otb-role">'+esc(m.role||'')+'</div></div><div class="otb-hours">'+(mins?esc(formatTimeShort(mins)):'—')+'</div></div>'+(entries.length?'<ul class="otb-entries">'+lines+more+'</ul>':'<div class="otb-empty">Nothing logged yet</div>')+'</button>';
  }).join('');
  box.innerHTML='<div class="otb-head"><div><div class="otb-title">Everyone\'s log</div><div class="otb-sub">'+esc(dailyLogDayLabel(day))+' · '+esc(formatTimeShort(totalTeamMins)||'0 min')+' total</div></div></div><div class="otb-grid">'+(cards||'<div class="otb-empty-all">No active team members yet.</div>')+'</div>';
}
function syncComposerTargetLabel(){
  var title=el('activityComposerTitle');
  if(!title)return;
  var editing=!!(el('actEid')&&el('actEid').value);
  if(editing){title.textContent='Edit entry';return;}
  var tm=activityLogTargetMember();
  if(cuIsOverseer()&&tm&&String(tm.id)!==String(cu.id))title.textContent='Log for '+tm.name.split(' ')[0];
  else title.textContent='Log entry';
}
function rDailyLogInner(){
  if(!cu)return;
  var list=el('dailyLogList'),lbl=el('dailyLogDateLbl'),pick=el('dailyLogDatePick');
  if(!list)return;
  if(!dailyLogDate)dailyLogDate=new Date();
  if(lbl)lbl.textContent=dailyLogDate.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  if(pick)pick.value=dateInputStr(dailyLogDate);
  initActivityComposer();
  if(el('actEid')&&!el('actEid').value&&el('actDate'))el('actDate').value=dateInputStr(dailyLogDate);
  renderOverseerTeamBoard();
  renderActivityLogTargetBar();
  renderTodayTotals();
  if(weekViewOpen)renderWeeklyTotals();
  renderDailyLogPresets();
  syncActivitySetupBanner();
  syncComposerTargetLabel();
  if(tagMgrOpen)renderTagManagerPanel();
  var entries=myActivityForDay(dailyLogDate);
  var tm=activityLogTargetMember();
  var listHead='Your log';
  if(cuIsOverseer()&&tm&&!isSelfMember(tm.id))listHead=tm.name.split(' ')[0]+'\'s log';
  if(!entries.length){list.innerHTML='<div class="dailylog-empty">No entries yet for '+esc(listHead.toLowerCase())+' — use the form below.</div>';return;}
  list.innerHTML='<div class="dailylog-list-head">'+listHead+' · '+esc(dailyLogDayLabel(dailyLogDate))+' ('+entries.length+')</div>'+entries.map(function(e){
    return'<div class="dailylog-entry"><div class="dailylog-entry-main dailylog-entry-tap" onclick="loadActivityForEdit(\''+e.id+'\')" title="Tap to edit"><div class="dailylog-entry-desc">'+esc(e.description)+'</div><div class="dailylog-entry-meta">'+renderEntryCategoryTags(e)+(activityTimeLabel(e)?'<span class="dailylog-time">'+esc(activityTimeLabel(e))+'</span>':'')+'</div></div><div class="dailylog-entry-actions"><button type="button" class="btn sm" onclick="event.stopPropagation();loadActivityForEdit(\''+e.id+'\')">Edit</button><button type="button" class="btn sm danger" onclick="event.stopPropagation();deleteActivity(\''+e.id+'\')">Delete</button></div></div>';
  }).join('');
}
function chDailyLogDay(n){dailyLogDate=dailyLogDate||new Date();dailyLogDate=new Date(dailyLogDate);dailyLogDate.setDate(dailyLogDate.getDate()+n);rDailyLog();}
function goDailyLogToday(){dailyLogDate=new Date();rDailyLog();}
function pickDailyLogDate(val){dailyLogDate=parseDateInput(val);rDailyLog();}
function openActivityModal(id,preset){
  if(typeof id==='object'&&!preset){preset=id;id=null;}
  if(id)loadActivityForEdit(id);
  else focusActivityComposer(preset);
}
function closeActivityModal(){focusActivityComposer();}
async function saveActivity(){
  if(!sb||!cu){console.error('[4KPI] saveActivity: no Supabase client or user');toast('Not connected — refresh and try again','error');return;}
  var desc=(el('actDesc').value||'').trim();
  if(!desc){toast('Describe what you did','error');return;}
  var timeMins=null,timeSpent=null;
  if(actTimeIsCustom){
    var timeRaw=(el('actTimeCustom').value||'').trim();
    if(timeRaw){
      timeMins=parseTimePhrase(timeRaw);
      if(timeMins==null){toast('Try "4 hrs", "15 mins", or "1 hour 30 mins"','error');return;}
      timeSpent=timeRaw;
    }
  }else if(actSelectedMins!=null){
    timeMins=actSelectedMins;
    timeSpent=formatTimeShort(timeMins);
  }
  var cats=actCategories.slice().filter(Boolean);
  var category=cats.length?cats.join(', '):null;
  var logDate=normalizeLogDate(el('actDate').value)||dateInputStr(dailyLogDate);
  var eid=el('actEid').value;
  var wasEdit=!!eid;
  var logMemberId=getActivityLogTargetId()||cu.id;
  var payload={member_id:logMemberId,description:desc,time_spent:timeSpent,time_minutes:timeMins,category:category,log_date:logDate,updated_at:nowISO()};
  console.log('[4KPI] saveActivity',eid?'update':'insert',payload);
  try{
    var row=null;
    if(!sb){
      row=saveActivityLogLocalRow(payload,eid||null);
    }else{
      var r;
      if(eid)r=await sb.from('activity_log').update(payload).eq('id',eid).select();
      else r=await sb.from('activity_log').insert([Object.assign({},payload,{created_at:nowISO()})]).select();
      if(r.error){
        console.error('[4KPI] saveActivity failed',r.error,payload);
        if(isActivityLogTableMissing(r.error)){
          activityLogLocalOnly=true;
          syncActivitySetupBanner();
          row=saveActivityLogLocalRow(payload,eid||null);
        }else{
          toast('Could not save — '+r.error.message,'error');
          return;
        }
      }else{
        markActivityLogConnected();
        row=Array.isArray(r.data)?r.data[0]:r.data;
      }
    }
    if(row){
      var idx=activityLog.findIndex(function(x){return x.id===row.id;});
      if(idx>=0)activityLog[idx]=row;else activityLog.unshift(row);
      if(activityLogLocalOnly)persistActivityLogLocal();
    }else await loadActivityLog();
    toast(wasEdit?'Updated ✓':(activityLogLocalOnly?'Logged locally ✓':'Logged ✓'));
    dailyLogDate=parseDateInput(logDate);
    rDailyLog();
    resetActivityComposer(true);
  }catch(e){
    console.error('[4KPI] saveActivity exception',e,payload);
    toast('Could not save — see console for details','error');
  }
}
async function deleteActivity(id){
  if(!cu||!id)return;
  var row=activityLog.find(function(x){return x.id===id;});
  if(row&&!canManageActivityEntry(row)){toast('You can\'t delete this entry','error');return;}
  if(!confirm('Delete this entry?'))return;
  if(!sb){
    activityLog=activityLog.filter(function(x){return x.id!==id;});
    persistActivityLogLocal();
  }else{
    var r=await sb.from('activity_log').delete().eq('id',id);
    if(r.error){
      if(isActivityLogTableMissing(r.error)){
        activityLogLocalOnly=true;
        syncActivitySetupBanner();
        activityLog=activityLog.filter(function(x){return x.id!==id;});
        persistActivityLogLocal();
      }else{toast('Could not delete','error');return;}
    }else{
      markActivityLogConnected();
    }
  }
  if(el('actEid')&&el('actEid').value===id)resetActivityComposer(false);
  toast('Deleted ✓');
  if(!activityLogLocalOnly&&sb)await loadActivityLog();
  rDailyLog();
}
async function deleteActivityFromComposer(){
  var id=el('actEid').value;if(!id)return;
  await deleteActivity(id);
}
async function deleteActivityFromModal(){await deleteActivityFromComposer();}
function copyDailyLogDay(){
  if(!cu){toast('Please log in first','error');return;}
  var entries=myActivityForDay(dailyLogDate);
  if(!entries.length){toast('Nothing to copy for this day','error');return;}
  var text=formatDailyLogExportSummary(entries,dailyLogDate);
  openDailyLogCopyModal(text);
  execCopyField(el('copyDayText'));
  verifyClipboardText(text).then(function(verified){
    if(verified===true){toast('Day summary copied ✓');closeCopyDayModal();}
    else toast('Summary ready — press ⌘C to copy');
  });
}
function myTasksDateLabel(){
  var d=myTasksViewDate||new Date();
  return d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
}
function myTasksForUser(){
  if(!cu)return [];
  var d=myTasksViewDate||new Date();
  var ds=d.toDateString(),dateKey=dsToKey(ds);
  return applyTaskDayOrder(tasksForDay(ds).filter(function(t){return String(t.member_id)===String(cu.id);}),cu.id,dateKey);
}
function mytaskMetaCompact(t){
  var bits=[];
  if(t.scheduled_start_time)bits.push('<span class="mytask-chip start">'+fmtStartTime(t.scheduled_start_time)+'</span>');
  if(t.eta_minutes)bits.push('<span class="mytask-chip eta">'+fm(t.eta_minutes)+'</span>');
  if(t.is_recurring)bits.push('<span class="mytask-chip">🔄</span>');
  return bits.join('');
}
function renderMyTaskRow(t){
  var chk=taskCheckHTML(t);
  var lbl=esc(taskDisplayLabel(t));
  var wn=getTaskWorkNotes(t);
  var preview=wn?(esc(wn.length>72?wn.slice(0,70)+'…':wn)):'';
  var occ=t._occurrenceDate?' data-occ="'+t._occurrenceDate+'"':'';
  var acts=taskActionButtons(t,{compact:true});
  var rowKey=t.id+(t._occurrenceDate||'');
  var expanded=myTasksExpandedId===rowKey;
  return'<div class="mytask-row'+(t.status==='done'?' done':'')+(expanded?' expanded':'')+'" data-mytask-id="'+t.id+'"'+occ+'>'+
    chk+
    '<div class="mytask-body">'+
      '<div class="mytask-top">'+
        '<button type="button" class="mytask-open" data-mytask-open="'+t.id+'"'+occ+' title="Tap to add notes"><span class="mytask-title">'+lbl+'</span></button>'+
        '<span class="mytask-meta">'+mytaskMetaCompact(t)+stag(t.status)+'</span>'+
      '</div>'+
      (preview&&!expanded?'<div class="mytask-note-preview">'+preview+'</div>':'')+
      '<div class="mytask-note-wrap">'+
        '<textarea class="mytask-note-input" data-worknote-id="'+t.id+'"'+occ+' placeholder="What actually happened? e.g. sent 40 DMs, 3 replied, 1 booked…" rows="2">'+esc(wn)+'</textarea>'+
      '</div>'+
      (acts?'<div class="mytask-acts">'+acts+'</div>':'')+
    '</div></div>';
}
function rMyTasksPage(){
  var list=el('mytasksList'),sum=el('mytasksSummary'),lbl=el('mytasksDateLbl');
  if(!list)return;
  if(!myTasksViewDate)myTasksViewDate=new Date();
  myTasksDate=new Date(myTasksViewDate);
  if(lbl)lbl.textContent=myTasksDateLabel();
  var mT=myTasksForUser();
  var don=mT.filter(function(t){return t.status==='done';}).length;
  if(sum)sum.innerHTML=mT.length?'<span class="mytasks-stat">'+don+' / '+mT.length+' done</span>':'<span class="mytasks-stat empty">No tasks today — tap Log task above</span>';
  if(!mT.length){list.innerHTML='<div class="mytasks-empty">Nothing scheduled. <button type="button" class="btn p sm" onclick="openT()">+ Log task</button></div>';return;}
  list.innerHTML=mT.map(renderMyTaskRow).join('');
  bindMyTaskActions(list);
  bindCompleteChecks(list);
  qsa('[data-et]',list).forEach(function(btn){bindEditTaskBtn(btn);});
  qsa('[data-dup]',list).forEach(function(btn){bindDuplicateTaskBtn(btn);});
  qsa('[data-dt]',list).forEach(function(btn){bindDeleteTaskBtn(btn);});
  if(myTasksExpandedId){
    var ta=list.querySelector('.mytask-row.expanded .mytask-note-input');
    if(ta&&!ta.dataset.focused){ta.dataset.focused='1';ta.focus();var len=ta.value.length;try{ta.setSelectionRange(len,len);}catch(e){}}
  }
}
function chMyTasksDay(n){myTasksViewDate=myTasksViewDate||new Date();myTasksViewDate=new Date(myTasksViewDate);myTasksViewDate.setDate(myTasksViewDate.getDate()+n);myTasksExpandedId=null;rMyTasksPage();}
function goMyTasksToday(){myTasksViewDate=new Date();myTasksExpandedId=null;rMyTasksPage();}
function bindMyTaskActions(root){
  qsa('.mytask-note-preview',root).forEach(function(prev){
    if(prev._mtPrevBound)return;
    prev._mtPrevBound=true;
    prev.onclick=function(e){
      e.stopPropagation();
      var row=this.closest('.mytask-row');
      if(!row)return;
      myTasksExpandedId=(row.dataset.mytaskId||'')+(row.dataset.occ||'');
      rMyTasksPage();
    };
  });
  qsa('.mytask-open',root).forEach(function(btn){
    if(btn._mtOpenBound)return;
    btn._mtOpenBound=true;
    btn.onclick=function(e){
      e.stopPropagation();
      var tid=this.dataset.mytaskOpen,occ=this.dataset.occ||'';
      myTasksExpandedId=tid+occ;
      rMyTasksPage();
    };
  });
  qsa('.mytask-note-input',root).forEach(function(ta){
    if(ta._wnBound)return;
    ta._wnBound=true;
    ta.onmousedown=function(e){e.stopPropagation();};
    ta.onclick=function(e){e.stopPropagation();};
    var saveTimer=null;
    ta.oninput=function(){
      clearTimeout(saveTimer);
      var node=ta;
      saveTimer=setTimeout(function(){saveTaskWorkNotes(node.dataset.worknoteId,node.dataset.occ||null,node.value,node);},650);
    };
    ta.onblur=function(){
      clearTimeout(saveTimer);
      saveTaskWorkNotes(this.dataset.worknoteId,this.dataset.occ||null,this.value,this);
    };
  });
}
async function saveTaskWorkNotes(tid,occDate,raw,inputEl){
  if(!sb||!cu)return;
  var t=tasks.find(function(x){return x.id===tid;});
  if(!t||!canEditTask(t)){toast('You can only edit your own tasks','error');return;}
  var store=String(raw||'').trim()||null;
  var view=t.is_recurring?mergeOccurrence(t,resolveTaskOccDate(t,occDate)):t;
  var cur=getTaskWorkNotes(view);
  if((store||'')===(cur||''))return;
  try{
    if(t.is_recurring){
      var anchor=resolveTaskOccDate(t,occDate),ovs=parseOverrides(t);
      var dayPatch=Object.assign({},ovs[anchor]||{});
      if(store)dayPatch.work_notes=store;else delete dayPatch.work_notes;
      var keys=Object.keys(dayPatch).filter(function(k){return k!=='skipped'&&!k.startsWith('_');});
      if(!keys.length)delete ovs[anchor];else ovs[anchor]=scrubOverrideForSave(dayPatch);
      var r=await sb.from('tasks').update({recur_overrides:ovs,edited_at:nowISO(),edited_by:cu.id}).eq('id',tid);
      if(r.error)throw r.error;
      t.recur_overrides=ovs;
      setLocalWorkNotes(tid,occDate,store);
    }else{
      var r2=await sbUpdateTask(tid,{work_notes:store,edited_at:nowISO(),edited_by:cu.id});
      if(r2.error)throw r2.error;
      t.work_notes=store;
      setLocalWorkNotes(tid,null,store);
      if(!workNotesColMissing&&store!==(cur||null))await sb.from('task_history').insert([{task_id:tid,changed_by:cu.id,field_changed:'work_notes',old_value:String(cur||''),new_value:String(store||''),changed_at:nowISO()}]);
    }
    if(inputEl){inputEl.dataset.saved='1';setTimeout(function(){if(inputEl.dataset.saved)delete inputEl.dataset.saved;},800);}
  }catch(e){
    console.error('[4KPI] saveTaskWorkNotes',e);
    setLocalWorkNotes(tid,occDate,store);
    toast('Note saved locally — run supabase_migration.sql for work_notes column','error');
  }
}
function collectMyCompletedTasks(){
  if(!cu)return [];
  var out=[],seen={};
  tasks.filter(function(t){return String(t.member_id)===String(cu.id);}).forEach(function(t){
    if(t.is_recurring){
      var ovs=parseOverrides(t);
      Object.keys(ovs).forEach(function(key){
        if(key.charAt(0)==='_')return;
        if(ovs[key].status!=='done')return;
        var m=mergeOccurrence(t,key);m.status='done';
        var sid=t.id+'|'+key;
        if(seen[sid])return;
        seen[sid]=true;
        out.push({task:m,sortAt:t.edited_at||t.logged_at,dayKey:key});
      });
    }else if(t.status==='done'){
      out.push({task:t,sortAt:t.edited_at||t.logged_at,dayKey:null});
    }
  });
  out.sort(function(a,b){return new Date(b.sortAt||0)-new Date(a.sortAt||0);});
  return out;
}
function rWorklog(){
  var feed=el('worklogFeed');if(!feed)return;
  var q=(el('worklogSrch')?el('worklogSrch').value:'').toLowerCase().trim();
  var items=collectMyCompletedTasks();
  if(q)items=items.filter(function(it){
    var t=it.task,hay=[taskDisplayLabel(t),getTaskWorkNotes(t),t.notes,t.task_type,t.role_area].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  });
  if(!items.length){feed.innerHTML='<div class="worklog-empty">'+(q?'No matches.':'Nothing completed yet — check off tasks on Tasks and add notes about what happened.')+'</div>';return;}
  feed.innerHTML=items.map(function(it){
    var t=it.task,wn=getTaskWorkNotes(t);
    var dayD=it.dayKey?dateFromKey(it.dayKey):null;
    var dayLbl=dayD?dayD.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}):(t.logged_at?new Date(t.logged_at).toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}):'—');
    var timeLbl=it.sortAt?new Date(it.sortAt).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'';
    return'<div class="worklog-item"><div class="worklog-item-head"><span class="worklog-task">'+esc(taskDisplayLabel(t))+'</span><span class="worklog-date">'+dayLbl+(timeLbl?' · '+timeLbl:'')+'</span></div>'+
      (wn?'<div class="worklog-note">'+esc(wn)+'</div>':'<div class="worklog-note empty">No note — open this task on Tasks to write what happened</div>')+
      '</div>';
  }).join('');
}
function rTasksPage(){
  var board=el('tasksBoard'),lbl=el('tasksDateLbl');if(!board)return;
  var d=lineupDate||new Date();myTasksDate=new Date(d);
  var ds=d.toDateString(),dateKey=dsToKey(ds),dT=tasksForDay(ds);
  curDayT=dT;
  if(lbl)lbl.textContent=lineupDateLabel();
  var sq=el('tasksSrch')?el('tasksSrch').value:'';
  if(!getActiveMembers().length)board.innerHTML='<div class="dayview-empty">No active team members yet.</div>';
  else board.innerHTML=buildDayViewHTML(dT,sq,dateKey);
  bindLineupActions(board);
  bindDayViewActions(board);
  bindTaskTitleEdits(board);
  bindTaskDescBtns(board);
  qsa('.dayview-row',board).forEach(function(block){
    var grid=block.querySelector('.dayview-task-grid');
    if(grid)bindTaskDrag(grid,block.dataset.memberId,dateKey);
  });
}
function filterTasks(){rTasksPage();}
function chTasksDay(n){lineupDate=lineupDate||new Date();lineupDate=new Date(lineupDate);lineupDate.setDate(lineupDate.getDate()+n);myTasksDate=new Date(lineupDate);rTasksPage();}
function goTasksToday(){lineupDate=new Date();myTasksDate=new Date(lineupDate);rTasksPage();}
function taskCheckHTML(t){
  if(!canEditTask(t))return'';
  var done=t.status==='done';
  if(!done&&t.status!=='prog'&&t.status!=='pending'&&t.status!=='late'&&t.status!=='nostart')return'';
  var occ='',dk=taskCheckOccKey(t);
  if(dk)occ=' data-occ="'+dk+'"';
  return'<label class="tchk-wrap" onclick="event.stopPropagation()"><input type="checkbox" class="tchk" data-complete="'+t.id+'"'+occ+(done?' checked':'')+'><span class="tchk-box"></span></label>';
}

function renderCalTaskRow(t,extra,withActions){
  var chk=taskCheckHTML(t);
  var acts=withActions?taskActions(t,{labeled:true}):'';
  return'<div class="cal-task task-drag-item'+(t.status==='done'?' done':'')+'" data-task-key="'+taskSortKey(t)+'" data-member-id="'+t.member_id+'"'+(extra||'')+'>'+taskDragHandle()+chk+'<div class="cal-task-body"><div class="cal-task-top">'+taskDisplayHead(t)+stag(t.status)+'</div>'+taskDescBlockHTML(t)+taskTimingLine(t)+acts+'</div></div>';
}

function memberMatchesQuery(m,q){
  if(!q||!m)return false;
  return(m.name||'').toLowerCase().includes(q)||(m.role||'').toLowerCase().includes(q);
}
function taskMatchesQuery(t,q){
  if(!q)return true;
  var hay=[t.display_name,t.name,t.task_type,t.notes,t.work_notes,t.role_area,t.result_category].filter(Boolean).join(' ').toLowerCase();
  return hay.includes(q);
}

function openDD(ds){
  lineupDate=new Date(ds);
  myTasksDate=new Date(ds);
  var btn=document.querySelector('[data-nav="tasks"]');
  gp('tasks',btn||null);
}

function bindLineupActions(ctx){
  var root=ctx||el('tasksBoard')||document;
  qsa('[data-et]',root).forEach(function(btn){bindEditTaskBtn(btn);});
  qsa('[data-dup]',root).forEach(function(btn){bindDuplicateTaskBtn(btn);});
  qsa('[data-dt]',root).forEach(function(btn){bindDeleteTaskBtn(btn);});
  bindCompleteChecks(root);
}
var dragTaskKey=null;
function bindTaskDrag(container,memberId,dateKey){
  if(!container||!canReorderTasks(memberId))return;
  qsa('.task-drag-item',container).forEach(function(row){
    if(row._tdragBound)return;
    row._tdragBound=true;
    row.draggable=true;
    row.ondragstart=function(e){
      if(e.target.closest('button')||e.target.closest('.tchk-wrap')||e.target.closest('input')){e.preventDefault();return;}
      dragTaskKey=row.dataset.taskKey;
      row.classList.add('task-dragging');
      if(e.dataTransfer){e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',dragTaskKey);}
    };
    row.ondragend=function(){
      row.classList.remove('task-dragging');
      qsa('.task-drag-over',container).forEach(function(x){x.classList.remove('task-drag-over');});
      dragTaskKey=null;
    };
    row.ondragover=function(e){e.preventDefault();if(dragTaskKey&&row.dataset.taskKey!==dragTaskKey)row.classList.add('task-drag-over');};
    row.ondragleave=function(){row.classList.remove('task-drag-over');};
    row.ondrop=function(e){
      e.preventDefault();
      row.classList.remove('task-drag-over');
      dropTaskOrder(memberId,dateKey,dragTaskKey,row.dataset.taskKey);
    };
  });
}
function dropTaskOrder(memberId,dateKey,fromKey,toKey){
  if(!fromKey||!toKey||fromKey===toKey||!canReorderTasks(memberId)||!dateKey)return;
  var dayDate=dateFromKey(dateKey);
  if(!dayDate)return;
  var dayTasks=tasksForDay(dayDate.toDateString()).filter(function(t){return t.member_id===memberId;});
  var keys=applyTaskDayOrder(dayTasks,memberId,dateKey).map(taskSortKey);
  var fi=keys.indexOf(fromKey),ti=keys.indexOf(toKey);
  if(fi<0||ti<0)return;
  keys.splice(fi,1);
  keys.splice(ti,0,fromKey);
  if(!taskDayOrder[dateKey])taskDayOrder[dateKey]={};
  taskDayOrder[dateKey][memberId]=keys;
  saveAll();
  rTasksPage();
}
function bindDayActions(){bindLineupActions();}

function bindCompleteChecks(ctx){
  qsa('[data-complete]',ctx||document).forEach(function(chk){
    if(chk._tchkBound)return;
    chk._tchkBound=true;
    chk.onchange=function(){
      toggleTaskComplete(this.dataset.complete,this.dataset.occ||null,this.checked,this);
    };
  });
}

async function toggleTaskComplete(tid,occDate,checked,chkEl){
  if(chkEl)chkEl.checked=checked;
  if(checked)await completeTask(tid,occDate,chkEl);
  else await uncompleteTask(tid,occDate,chkEl);
}

async function completeTask(tid,occDate,chkEl){
  var t=tasks.find(function(x){return x.id===tid;});
  if(!t||!canEditTask(t)){toast('You can only complete your own tasks','error');if(chkEl)chkEl.checked=false;return;}
  if(t.is_recurring){
    var anchor=resolveTaskOccDate(t,occDate);
    var ovs=parseOverrides(t),prev=mergeOccurrence(t,anchor).status;
    if(prev==='done'){if(chkEl)chkEl.checked=true;return;}
    ovs[anchor]=scrubOverrideForSave(Object.assign({},ovs[anchor]||{},{status:'done',_revertStatus:prev}));
    var payload={recur_overrides:ovs};
    if(t.status==='done'||t.status==='late'){payload.status='nostart';t.status='nostart';}
    var r=await sb.from('tasks').update(payload).eq('id',tid);
    if(r.error){toast('Could not update task','error');if(chkEl)chkEl.checked=false;return;}
    t.recur_overrides=ovs;
    toast('This day marked done ✓');refreshDashboardMetrics();await load();return;
  }
  if(t.status==='done')return;
  var old=t.status;
  await sb.from('task_history').insert([{task_id:tid,changed_by:cu.id,field_changed:'status',old_value:old,new_value:'done',changed_at:nowISO()}]);
  var r2=await sb.from('tasks').update({status:'done',edited_at:nowISO(),edited_by:cu.id}).eq('id',tid);
  if(r2.error){toast('Could not update task','error');if(chkEl)chkEl.checked=false;return;}
  t.status='done';t.edited_at=nowISO();t.edited_by=cu.id;
  toast('Task marked done ✓');
  refreshDashboardMetrics();await load();
}

async function uncompleteTask(tid,occDate,chkEl){
  var t=tasks.find(function(x){return x.id===tid;});
  if(!t||!canEditTask(t)){toast('You can only update your own tasks','error');if(chkEl)chkEl.checked=true;return;}
  if(t.is_recurring){
    var anchor=resolveTaskOccDate(t,occDate);
    var ovs=parseOverrides(t),existing=ovs[anchor]||{};
    var revert=existing._revertStatus;
    if(!revert||revert==='done')revert=mergeOccurrence(t,anchor).status;
    if(revert==='done')revert='nostart';
    var next=Object.assign({},existing);
    if(revert==='nostart'){delete next.status;delete next._revertStatus;}
    else{next.status=revert;delete next._revertStatus;}
    if(Object.keys(next).length)ovs[anchor]=scrubOverrideForSave(next);
    else delete ovs[anchor];
    var payload={recur_overrides:ovs};
    if(t.status==='done'||t.status==='late'){payload.status='nostart';t.status='nostart';}
    var r=await sb.from('tasks').update(payload).eq('id',tid);
    if(r.error){toast('Could not update task','error');if(chkEl)chkEl.checked=true;return;}
    t.recur_overrides=ovs;
    toast('This day unchecked ✓');refreshDashboardMetrics();await load();return;
  }
  if(t.status!=='done')return;
  var revert2='nostart';
  var h=getTH(tid).find(function(x){return x.field_changed==='status'&&x.new_value==='done';});
  if(h&&h.old_value)revert2=h.old_value;
  await sb.from('task_history').insert([{task_id:tid,changed_by:cu.id,field_changed:'status',old_value:'done',new_value:revert2,changed_at:nowISO()}]);
  var r2=await sb.from('tasks').update({status:revert2,edited_at:nowISO(),edited_by:cu.id}).eq('id',tid);
  if(r2.error){toast('Could not update task','error');if(chkEl)chkEl.checked=true;return;}
  t.status=revert2;t.edited_at=nowISO();t.edited_by=cu.id;
  toast('Task unchecked ✓');
  refreshDashboardMetrics();await load();
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
function openNewCat(){editCat=null;editCatNew=true;el('ecmtitle').textContent='New role category';el('ecmname').value='';el('ecmdesc').value='';el('ecmicon').value='📌';el('ecmcolor').value='#f0b429';renderSwatches('ecmcolorgrid','ecmcolor','#f0b429');el('ecmdel').style.display='none';el('ECM').classList.add('open');}
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
  var ah=accentHex(),ah2=accentHex2(),ara=accentRgba(.08);
  var lbl=members.map(function(m){return m.name;}),rates=members.map(function(m){return mst(m.id).rate;}),bc=rates.map(function(r){return r>=80?ah:r>=50?ah2:'#ff5c5c';});
  var aA=members.map(function(m){var s=mst(m.id);return s.avgA?+(s.avgA/60).toFixed(1):0;}),aE=members.map(function(m){var s=mst(m.id);return s.avgE?+(s.avgE/60).toFixed(1):0;}),lts=members.map(function(m){return mst(m.id).late;});
  var cd={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#444',font:{size:10}},grid:{display:false},border:{display:false}},y:{ticks:{color:'#444',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'},border:{display:false}}}};
  if(charts.c)charts.c.destroy();charts.c=new Chart(el('cc'),{type:'bar',data:{labels:lbl,datasets:[{data:rates,backgroundColor:bc,borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{min:0,max:100,ticks:Object.assign({},cd.scales.y.ticks,{callback:function(v){return v+'%';}})})})})});
  if(charts.t)charts.t.destroy();charts.t=new Chart(el('ct'),{type:'bar',data:{labels:lbl,datasets:[{label:'Actual',data:aA,backgroundColor:'#5b9cf6',borderRadius:4,borderSkipped:false},{label:'ETA',data:aE,backgroundColor:'#a78bfa',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{callback:function(v){return v+'h';}})})})})}); 
  var sc=[tasks.filter(function(t){return t.status==='done';}).length,tasks.filter(function(t){return t.status==='prog';}).length,tasks.filter(function(t){return t.status==='nostart';}).length,tasks.filter(function(t){return t.status==='pending';}).length,tasks.filter(function(t){return t.status==='late';}).length];
  if(charts.s)charts.s.destroy();charts.s=new Chart(el('cs'),{type:'doughnut',data:{labels:['Done','In progress','Not started','Pending','Late'],datasets:[{data:sc,backgroundColor:[ah,'#5b9cf6','#888','#ffb830','#ff5c5c'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true,position:'right',labels:{color:'#888',font:{size:10},boxWidth:10}}},cutout:'60%'}});
  if(charts.l)charts.l.destroy();charts.l=new Chart(el('cl'),{type:'bar',data:{labels:lbl,datasets:[{data:lts,backgroundColor:'#ff5c5c',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{stepSize:1})})})})});
  var rc={};tasks.forEach(function(t){if(t.result_category)rc[t.result_category]=(rc[t.result_category]||0)+1;});var rl=Object.keys(rc).slice(0,8),rd=rl.map(function(l){return rc[l];});
  if(charts.r)charts.r.destroy();charts.r=new Chart(el('cr'),{type:'bar',data:{labels:rl,datasets:[{data:rd,backgroundColor:'#34d399',borderRadius:4,borderSkipped:false}]},options:Object.assign({},cd,{indexAxis:'y',scales:{x:cd.scales.x,y:{ticks:{color:'#888',font:{size:9}},grid:{display:false},border:{display:false}}}})});
  var days=[],cnts=[];for(var d=13;d>=0;d--){var day=new Date();day.setDate(day.getDate()-d);var ds=day.toLocaleDateString('en-US',{month:'short',day:'numeric'});days.push(ds);cnts.push(tasks.filter(function(t){return new Date(t.logged_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})===ds;}).length);}
  if(charts.tr)charts.tr.destroy();charts.tr=new Chart(el('ctr'),{type:'line',data:{labels:days,datasets:[{data:cnts,borderColor:ah,backgroundColor:ara,tension:.4,fill:true,pointRadius:3,pointBackgroundColor:ah}]},options:Object.assign({},cd,{scales:Object.assign({},cd.scales,{y:Object.assign({},cd.scales.y,{ticks:Object.assign({},cd.scales.y.ticks,{stepSize:1})})})})});
  var chHelp={cc:'chart_completion',ct:'chart_time',cs:'chart_status',cl:'chart_late',cr:'chart_results',ctr:'chart_trend'};
  Object.keys(chHelp).forEach(function(cid){var cv=el(cid);if(!cv)return;var card=cv.closest('.chcard');if(!card)return;var title=card.querySelector('.chtitle');if(!title||title.querySelector('.help-slot'))return;var hint=title.querySelector('.chhint'),label=title.textContent.replace('click','').trim();title.innerHTML='<span>'+label+'</span><span class="help-slot" data-help="'+chHelp[cid]+'"></span>'+(hint?' <span class="chhint">click</span>':'');});
  fillHelpSlots();
}

function tbl(list){
  if(!list.length)return'<div style="color:var(--text3);font-size:12px;padding:12px 0">No tasks found.</div>';
  var showActCol=cu&&(cu.isAdmin||list.some(function(t){return canEditTask(t);}));var h='<div style="overflow-x:auto"><table class="dtbl"><thead><tr><th>Member</th><th>Task</th><th>Role</th><th>Status</th><th>ETA</th><th>Actual</th><th>Result</th><th>Edited?</th><th>Notes</th><th>Date</th>'+(showActCol?'<th>Actions</th>':'')+'</tr></thead><tbody>';
  var cols=showActCol?11:10;
  list.slice(0,60).forEach(function(t){var m=members.find(function(x){return x.id===t.member_id;});var ld=parseDT(t.logged_at);var taskLbl=(t.task_type||t.name||'—')+(t.is_recurring?' 🔄':'');h+='<tr><td>'+(m?m.name:'—')+'</td><td class="col-task">'+truncCell(taskLbl,2)+'</td><td>'+truncCell(t.role_area,2)+'</td><td>'+stag(t.status)+'</td><td>'+fm(t.eta_minutes)+'</td><td>'+fm(t.actual_minutes)+'</td><td class="col-result">'+truncCell(t.result_category,2)+'</td><td>'+(t.edited_at?'<span class="ebadge">✏️</span>':'—')+'</td><td class="col-notes">'+truncCell(t.notes,3)+'</td><td>'+(ld?ld.toLocaleDateString():'—')+'</td>'+(showActCol?'<td>'+taskActions(t,{compact:true})+'</td>':'')+'</tr>';if(t.edited_at)h+='<tr class="hist-row"><td colspan="'+cols+'">'+taskCardHist(t.id)+'</td></tr>';});
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
  var map={all:{t:'All tasks',l:tasks},done:{t:'Completed',l:tasks.filter(function(t){return t.status==='done';})},late:{t:'Late / missed',l:tasks.filter(function(t){return t.status==='late';})},timed:{t:'Tasks with actual time',l:tasks.filter(function(t){return t.actual_minutes;})},etaacc:{t:'ETA vs actual',l:tasks.filter(function(t){return t.actual_minutes&&t.eta_minutes;})},rk:{t:'Results produced',l:tasks.filter(function(t){return t.result_category&&t.result_category!=='No result'&&t.result_category!=='Needs review';})}};
  var cfg=map[type]||{t:'Tasks',l:tasks};
  el('ddt2').textContent=cfg.t;el('dstats').innerHTML='';el('dcontent').innerHTML=tbl(cfg.l);
  bindDrillActions();
}

function bindDrillActions(){qsa('[data-et]').forEach(function(btn){bindEditTaskBtn(btn);});qsa('[data-dup]').forEach(function(btn){bindDuplicateTaskBtn(btn);});qsa('[data-dt]').forEach(function(btn){bindDeleteTaskBtn(btn);});}
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
  var active=getActiveMembers(),tracked=getTrackedTasks(),tod=new Date().toDateString(),todT=tracked.filter(function(t){return new Date(t.logged_at).toDateString()===tod;}),zero=active.filter(function(m){return!todT.some(function(t){return t.member_id===m.id;});}),latM=active.filter(function(m){return mst(m.id).late>0;}),overE=active.filter(function(m){var s=mst(m.id);return s.avgA&&s.avgE&&s.avgA>s.avgE+15;}),stk=tracked.filter(function(t){return t.status==='prog';}),noR=tracked.filter(function(t){return t.result_category==='No result';}),fu=tracked.filter(function(t){return t.result_category==='Needs review'||(t.notes||'').toLowerCase().includes('follow');}),ed=tracked.filter(function(t){return t.edited_at;});
  var mn=function(t){return(members.find(function(x){return x.id===t.member_id;})||{name:'?'}).name;};
  el('ogrid').innerHTML='<div class="ocard"><div class="otitle"><span>Nothing tracked today</span><span class="help-slot" data-help="os_notlogged"></span></div>'+(zero.length?zero.map(function(m){return'<div class="oitem"><span>'+m.name+'</span><span class="oval r">Log tasks</span></div>';}).join(''):'<div class="oitem"><span>Full lineup tracked</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>Has late tasks</span><span class="help-slot" data-help="os_late"></span></div>'+(latM.length?latM.map(function(m){return'<div class="oitem"><span>'+m.name+'</span><span class="oval r">'+mst(m.id).late+' late</span></div>';}).join(''):'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>Over avg ETA</span><span class="help-slot" data-help="os_overeta"></span></div>'+(overE.length?overE.map(function(m){var s=mst(m.id);return'<div class="oitem"><span>'+m.name+'</span><span class="oval a">+'+fm(s.avgA-s.avgE)+'</span></div>';}).join(''):'<div class="oitem"><span>All within ETA</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>In progress ('+stk.length+')</span><span class="help-slot" data-help="os_inprogress"></span></div>'+(stk.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'Task')+'</span><span class="oval a">Active</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>Edited ('+ed.length+')</span><span class="help-slot" data-help="os_edited"></span></div>'+(ed.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'?')+'</span><span class="oval a">Edited</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div><div class="ocard"><div class="otitle"><span>Follow-up needed ('+fu.length+')</span><span class="help-slot" data-help="os_followup"></span></div>'+(fu.slice(0,4).map(function(t){return'<div class="oitem"><span>'+mn(t)+' — '+(t.task_type||'?')+'</span><span class="oval a">Follow up</span></div>';}).join('')||'<div class="oitem"><span>None</span><span class="oval g">✓</span></div>')+'</div>';
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
    return'<div class="role-card'+(isInactiveMember(m)?' role-card-inactive':'')+'" draggable="true" data-rid="'+m.id+'" style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--rlg);padding:15px;margin-bottom:9px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><div style="display:flex;align-items:center;gap:9px"><div class="av" style="background:'+c.bg+';color:'+c.text+';width:30px;height:30px;font-size:10px;border-radius:7px">'+ini(m.name)+'</div><div><div style="font-size:13px;font-weight:600">'+m.name+(isOverseerMember(m)?' <span class="overseer-badge">Overseer</span>':'')+(isInactiveMember(m)?' <span class="inactive-badge">Inactive</span>':'')+'</div><div style="font-size:11px;color:var(--text2)">'+m.role+'</div></div></div>'+(cu&&cu.isAdmin?'<button class="btn sm" data-edit="'+m.id+'">Edit</button>':'')+'</div><div style="font-size:12px;color:var(--text2);line-height:1.7;margin-bottom:7px">'+desc+'</div>'+(isInactiveMember(m)?'<div class="inactive-note">Not included in agency pulse or “nothing tracked today” nudges until you start logging their work.</div>':'')+(isOverseerMember(m)?'<div class="overseer-note">Logs tasks for the team and keeps the agency scorecard. Everyone else gets tasks logged for them.</div>':'')+(tags.length?'<div style="display:flex;flex-wrap:wrap;gap:5px">'+tags.map(function(t){return'<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--bg3);color:var(--text2)">'+t.trim()+'</span>';}).join('')+'</div>':'')+'</div>';
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

function chkETA(){var tt=sTTs[0],mid=sMids[0];if(!tt||!mid)return;var sim=tasks.filter(function(t){return parseTT(t.task_type).includes(tt)&&t.actual_minutes&&t.member_id===mid;});var e=el('etas');if(sim.length>=2){var avg=Math.round(sim.reduce(function(s,t){return s+t.actual_minutes;},0)/sim.length);e.textContent='💡 Typical: '+fmtLogTime(avg)+' (from '+sim.length+' past logs)';e.classList.add('show');}else e.classList.remove('show');}

function timeGridSections(list){
  return[
    {t:'Under 1 hour',items:list.filter(function(x){return x.m<60;})},
    {t:'1–2 hours',items:list.filter(function(x){return x.m>=60&&x.m<=120;})},
    {t:'2 hours & up',items:list.filter(function(x){return x.m>120;})}
  ].filter(function(g){return g.items.length;});
}
function bTimeG(id,vn,presets){
  var list=presets||LOG_TIME_PRESETS,box=el(id);
  if(!box)return;
  box.classList.add('tgrid-sectioned');
  var html='';
  if(vn==='act'){
    html+='<div class="tgrid-section tgrid-act-none"><div class="tgrid-section-btns tgrid-section-btns-wide"><button type="button" class="tbtn tbtn-none" data-act-clear="1">None — no actual time</button></div></div>';
  }
  var exactLbl=vn==='eta'?'Exact ETA':'Exact actual time';
  var exactPh=vn==='eta'?'e.g. 17 mins, 1 hour 17 mins, 3 mins':'e.g. 15 mins, 1 hour 5 mins, 2 mins';
  html+='<div class="tgrid-section tgrid-exact-time"><div class="tgrid-section-lbl">'+exactLbl+'</div><input type="text" class="time-exact-text" placeholder="'+exactPh+'" autocomplete="off" spellcheck="false"></div>';
  timeGridSections(list).forEach(function(g){
    html+='<div class="tgrid-section"><div class="tgrid-section-lbl">'+g.t+'</div><div class="tgrid-section-btns'+(g.t.indexOf('1–2')>=0?' tgrid-section-btns-wide':'')+'">';
    g.items.forEach(function(t){html+='<button type="button" class="tbtn" data-mins="'+t.m+'" data-vn="'+vn+'" data-gid="'+id+'">'+t.l+'</button>';});
    html+='</div></div>';
  });
  box.innerHTML=html;
  qsa('[data-act-clear]',box).forEach(function(btn){bindBubble(btn,clearActTime);});
  qsa('.tbtn[data-mins]',box).forEach(function(btn){bindBubble(btn,function(){selT(this.dataset.gid,this.dataset.vn,normMins(this.dataset.mins),this);});});
  var tinp=exactTextInput(box);
  if(tinp){
    tinp.addEventListener('blur',function(){applyExactTime(vn);});
    tinp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();applyExactTime(vn);}});
  }
}
function selT(id,v,mins){
  mins=normMins(mins);
  var cur=v==='eta'?sEta:sAct;
  if(minsMatch(cur,mins)){
    if(v==='eta')sEta=null;else sAct=null;
    markTimeBtn(id,null);
    syncExactTimeInput(v,null);
    if(v==='act')syncActClearBtn();
    return;
  }
  if(v==='eta')sEta=mins;else sAct=mins;
  markTimeBtn(id,mins);
  syncExactTimeInput(v,mins);
  if(v==='act')syncActClearBtn();
}
function togRec(e){
  if(e&&e.target&&e.target.closest('#recwrap'))return;
  var eid=el('teid')?el('teid').value:'';
  if(eid){
    var orig=tasks.find(function(t){return t.id===eid;});
    if(orig&&orig.is_recurring&&editScope==='day'){
      toast('Switch “Apply changes to” to Entire series to change repeat settings','error');
      return;
    }
  }
  isRec=!isRec;
  if(isRec&&!recFreq){
    recFreq='Daily';
    qsa('.rbtn').forEach(function(b){b.classList.toggle('on',b.textContent==='Daily');});
  }
  if(!isRec){
    recFreq=null;
    qsa('.rbtn').forEach(function(b){b.classList.remove('on');});
  }
  syncRecurUI();
  syncScopeVisibility();
  syncRecurLock();
}
function setRec(f,btn){
  var eid=el('teid')?el('teid').value:'';
  if(eid){
    var orig=tasks.find(function(t){return t.id===eid;});
    if(orig&&orig.is_recurring&&editScope==='day')return;
  }
  recFreq=f;
  if(!isRec){isRec=true;syncRecurUI();}
  qsa('.rbtn').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  syncScopeVisibility();
  syncRecurLock();
}

// TASK MODAL
function openT(){
  closeMobileNav();
  if(cu&&getNavAccess(cu.id).log_task===false){toast('You don\'t have access to log tasks','error');return;}
  editOccDate=null;editScope='all';
  el('tmtitle').textContent='Log task';el('tsave').textContent='Save task';el('teid').value='';if(el('tdisplay'))el('tdisplay').value='';el('tname').value='';el('tnotes').value='';el('tstat').value='nostart';el('tstart').value='';syncStartClearBtn();
  sMids=cu?[cu.id]:[];
  var me=cu?members.find(function(x){return x.id===cu.id;}):null;
  sRoles=me?parseMemberRoles(me):[];
  sTTs=[];sRCs=[];sEta=null;sAct=null;isRec=false;recFreq=null;
  if(el('massignsrch'))el('massignsrch').value='';
  syncRecurUI();
  var row=el('recurrenceBlock');if(row){var tr=row.querySelector('.togrow');if(tr){tr.style.pointerEvents='';tr.style.opacity='';tr.title='';}}
  qsa('.rbtn').forEach(function(b){b.classList.remove('on');b.disabled=false;b.style.opacity='';b.style.pointerEvents='';});
  ['brad','bttad','brcad'].forEach(function(id){el(id).classList.remove('show');});
  bMembers();bRoles();bTTs();bRCs();bTimeG('etag','eta');bTimeG('actg','act');syncExactTimeInput('eta',sEta);syncExactTimeInput('act',sAct);syncActClearBtn();
  var al=el('TM').querySelector('.assign-help');if(!al){var lbl=el('TM').querySelector('.bsel .bsel-lbl');if(lbl&&!lbl.querySelector('.help-wrap'))lbl.insertAdjacentHTML('beforeend',' '+hBtn('assign'));}
  var tl=el('TM').querySelectorAll('.bsel .bsel-lbl')[2];if(tl&&!tl.querySelector('.help-wrap'))tl.insertAdjacentHTML('beforeend',' '+hBtn('tasktype'));
  syncScopeVisibility();
  syncTaskDescUI();
  el('TM').classList.add('open');
}
function openTFor(mid){openT();sMids=[mid];var m=members.find(function(x){return x.id===mid;});if(m)sRoles=parseMemberRoles(m);bMembers();bRoles();bTTs();bRCs();}
function openEditSelf(){openEM(cu.id);}

function openTransferM(){
  if(!cuIsOverseer()){toast('Only the current overseer can transfer ownership','error');return;}
  var sel=el('transferPick'),opts=members.filter(function(m){return m.id!==cu.id&&!isInactiveMember(m);});
  if(!opts.length){toast('No one else to transfer to yet','error');return;}
  sel.innerHTML=opts.map(function(m){return'<option value="'+m.id+'">'+esc(m.name)+(m.role?' — '+esc(m.role):'')+'</option>';}).join('');
  el('TransferM').classList.add('open');
}
function closeTransferM(){el('TransferM').classList.remove('open');}
function confirmTransferOwnership(){
  if(!cuIsOverseer())return;
  var pick=el('transferPick').value;
  if(!pick||pick===overseerId){toast('Pick someone else','error');return;}
  var nm=(members.find(function(m){return m.id===pick;})||{}).name||'New overseer';
  overseerId=pick;
  lss('4k_oid',overseerId);
  saveAll();
  closeTransferM();
  toast('Overseer role transferred to '+nm+' ✓');
  syncOverseerUI();
  rMembers();
  genIns();
  if(el('page-roles').classList.contains('active'))rRoles();
}
function closeTM(){editOccDate=null;editScope='all';el('TM').classList.remove('open');closeDrill();}

function openET(tid){
  var t=tasks.find(function(x){return x.id===tid;});if(!t)return;if(!canEditTask(t)){toast('You can only edit your own tasks','error');return;}
  editOccDate=t.is_recurring?resolveEditOccDate(t,null):null;
  editScope='all';
  el('tmtitle').textContent='Edit task';el('tsave').textContent='Update task';el('teid').value=tid;
  sMids=[t.member_id];sRoles=t.role_area?[t.role_area]:[];sTTs=parseTT(t.task_type);
  sRCs=t.result_category?t.result_category.split(',').map(function(s){return s.trim();}).filter(Boolean):[];
  fillTaskModalFromTask(t,true);
  ['brad','bttad','brcad'].forEach(function(id){el(id).classList.remove('show');});
  bMembers();bRoles();bTTs();bRCs();bTimeG('etag','eta');bTimeG('actg','act');syncExactTimeInput('eta',sEta);syncExactTimeInput('act',sAct);syncActClearBtn();
  markTimeBtn('etag',sEta);markTimeBtn('actg',sAct);syncExactTimeInput('eta',sEta);syncExactTimeInput('act',sAct);syncActClearBtn();
  if(recFreq)qsa('.rbtn').forEach(function(b){if(b.textContent===recFreq)b.classList.add('on');});
  syncScopeVisibility(t.is_recurring?'all':'all');
  syncTaskDescUI(true);
  el('TM').classList.add('open');
}

function openETOcc(tid,dateKey){
  var t=tasks.find(function(x){return x.id===tid;});if(!t||!t.is_recurring)return;if(!canEditTask(t)){toast('You can only edit your own tasks','error');return;}
  editOccDate=dateKey;editScope='day';
  var merged=mergeOccurrence(t,dateKey);
  el('tmtitle').textContent='Edit recurring task';el('tsave').textContent='Save changes';el('teid').value=tid;
  sMids=[t.member_id];sRoles=t.role_area?[t.role_area]:[];sTTs=parseTT(t.task_type);
  sRCs=t.result_category?t.result_category.split(',').map(function(s){return s.trim();}).filter(Boolean):[];
  fillTaskModalFromTask(merged,true);
  ['brad','bttad','brcad'].forEach(function(id){el(id).classList.remove('show');});
  bMembers();bRoles();bTTs();bRCs();bTimeG('etag','eta');bTimeG('actg','act');syncExactTimeInput('eta',sEta);syncExactTimeInput('act',sAct);syncActClearBtn();
  markTimeBtn('etag',sEta);markTimeBtn('actg',sAct);syncExactTimeInput('eta',sEta);syncExactTimeInput('act',sAct);syncActClearBtn();
  if(recFreq)qsa('.rbtn').forEach(function(b){if(b.textContent===recFreq)b.classList.add('on');});
  syncScopeVisibility('day');
  syncTaskDescUI(true);
  el('TM').classList.add('open');
}

async function saveT(){
  var eid=el('teid').value;
  if(!sMids.length){toast('Select at least one member','error');return;}
  if(!sTTs.length){toast('Select at least one task type','error');return;}
  var name=el('tname').value.trim(),status=el('tstat').value||'nostart',notes=el('tnotes').value.trim(),resultStr=sRCs.join(', ');
  var startRaw=el('tstart').value,startTime=startRaw?startRaw:null;
  var displayName=el('tdisplay')?el('tdisplay').value.trim():'';
  if(!name){toast('Task description is required — add who/what this covers','error');el('tname').focus();return;}
  if(isRec&&!recFreq){toast('Pick how often this task repeats','error');return;}
  var ttStr=taskTypesStr(),baseName=name||sTTs[0];
  var patch={name:baseName,display_name:displayName||null,notes:notes,status:status,eta_minutes:sEta||null,actual_minutes:sAct||null,scheduled_start_time:startTime};

  if(eid){
    var orig=tasks.find(function(t){return t.id===eid;});
    if(!orig){toast('Task not found','error');return;}
    if(orig.is_recurring){
      var anchor=editOccDate||resolveEditOccDate(orig,null),scope=editScope||'day';
      var ovs=buildSeriesOverrides(orig,anchor,scope,patch);
      if(scope==='day'){
        var rd=await sbUpdateTask(eid,{recur_overrides:ovs});
        if(rd.error){toast('Error saving this day','error');return;}
        stashLocalDisplayName(eid,displayName||null);
        toast('This day updated ✓');closeTM();await load();return;
      }
      if(scope==='future'){
        var pf=Object.assign({},patch,{name:baseName,display_name:displayName||null,status:status,role_area:sRoles[0]||null,task_type:ttStr,result_category:resultStr||null,notes:notes,eta_minutes:sEta||null,actual_minutes:sAct||null,is_recurring:isRec,recur_frequency:recFreq||null,scheduled_start_time:startTime,member_id:sMids[0],edited_at:nowISO(),edited_by:cu.id,recur_overrides:ovs});
        var rf=await sbUpdateTask(eid,pf);
        if(rf.error){console.error('[4KPI] future scope save',rf.error);toast('Error updating future tasks — '+((rf.error&&rf.error.message)||'try again'),'error');return;}
        stashLocalDisplayName(eid,displayName||null);
        toast('This & future updated ✓');closeTM();await load();return;
      }
      var ra=await sbUpdateTask(eid,Object.assign({},patch,{name:baseName,display_name:displayName||null,status:status,role_area:sRoles[0]||null,task_type:ttStr,result_category:resultStr||null,notes:notes,eta_minutes:sEta||null,actual_minutes:sAct||null,is_recurring:isRec,recur_frequency:recFreq||null,scheduled_start_time:startTime,member_id:sMids[0],edited_at:nowISO(),edited_by:cu.id,recur_overrides:ovs}));
      if(ra.error){toast('Error updating series','error');return;}
      stashLocalDisplayName(eid,displayName||null);
      toast('Entire series updated ✓');closeTM();await load();return;
    }
  }

  var payload={name:baseName,display_name:displayName||null,status:status,role_area:sRoles[0]||null,task_type:ttStr,result_category:resultStr||null,notes:notes,eta_minutes:sEta||null,actual_minutes:sAct||null,is_recurring:isRec,recur_frequency:recFreq||null,scheduled_start_time:startTime};
  if(eid){
    payload.member_id=sMids[0];
    var orig2=tasks.find(function(t){return t.id===eid;});
    if(orig2){var fields=['status','role_area','task_type','result_category','eta_minutes','actual_minutes','notes','member_id','name','display_name','scheduled_start_time'];for(var i=0;i<fields.length;i++){var f=fields[i];if(String(orig2[f]||'')!==String(payload[f]||''))await sb.from('task_history').insert([{task_id:eid,changed_by:cu.id,field_changed:f,old_value:String(orig2[f]||''),new_value:String(payload[f]||''),changed_at:nowISO()}]);}}
    payload.edited_at=nowISO();payload.edited_by=cu.id;
    var r=await sbUpdateTask(eid,payload);if(r.error){toast('Error updating','error');return;}
    stashLocalDisplayName(eid,displayName||null);
    toast('Task updated ✓');
  }else{
    var rows=sMids.map(function(mid){var p=Object.assign({},payload);p.member_id=mid;return p;});
    var r2=await sbInsertTasks(rows);if(r2.error){toast('Error saving','error');return;}
    if(r2.data&&r2.data.length)r2.data.forEach(function(row){stashLocalDisplayName(row.id,displayName||null);});
    toast(rows.length>1?rows.length+' tasks logged ✓':'Task logged ✓');
  }
  closeTM();await load();
}

function delT(tid,btn){openDeleteTask(tid,btn&&btn.dataset?btn.dataset.occ||null:null);}

function updateDelScopeNote(){
  var note=el('delScopeNote');if(!note)return;
  var d=delOccDate?dateFromKey(delOccDate):null,lbl=d?d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}):'this day';
  if(delScope==='day')note.textContent='Removes only '+lbl+'. Other repeats stay on the schedule.';
  else if(delScope==='future')note.textContent='Stops this task from '+lbl+' forward. Earlier days stay.';
  else note.textContent='Deletes the entire recurring series — all past and future repeats.';
}
function setDelScope(scope,btn){
  delScope=scope;qsa('#delScopeSec .escope').forEach(function(b){b.classList.remove('on');});if(btn)btn.classList.add('on');
  updateDelScopeNote();
}
function openDeleteTask(tid,occDate){
  var t=tasks.find(function(x){return x.id===tid;});
  if(!t||!canDelTask(t)){toast('You can only delete your own tasks','error');return;}
  delTaskId=tid;delOccDate=occDate||null;
  if(t.is_recurring){
    if(!delOccDate)delOccDate=dsToKey(new Date().toDateString());
    delScope=occDate?'day':'all';
    el('delScopeSec').style.display='block';
    qsa('#delScopeSec .escope').forEach(function(b){b.classList.toggle('on',b.dataset.dscope===delScope);});
    updateDelScopeNote();
    el('dmdesc').textContent='Choose what to remove from this recurring task.';
  }else{
    delScope='all';
    el('delScopeSec').style.display='none';
    el('dmdesc').textContent='Move this task to Trash? You can restore it from the Trash page.';
  }
  el('DM').classList.add('open');
}
function closeDeleteModal(){delTaskId=null;delOccDate=null;delScope='all';el('DM').classList.remove('open');}
async function confirmDeleteTask(){
  if(!delTaskId)return;
  var t=tasks.find(function(x){return x.id===delTaskId;});
  if(!t){toast('Task not found','error');closeDeleteModal();return;}
  if(t.is_recurring){
    var anchor=delOccDate||dsToKey(new Date().toDateString()),ovs=parseOverrides(t);
    if(delScope==='day'){
      ovs[anchor]=Object.assign({},ovs[anchor]||{},{skipped:true});
      var rd=await sb.from('tasks').update({recur_overrides:ovs}).eq('id',delTaskId);
      if(rd.error){toast('Could not remove this day','error');return;}
      toast('This day removed ✓');
    }else if(delScope==='future'){
      ovs=stopRecurrenceAfter(t,anchor);
      var rf=await sb.from('tasks').update({recur_overrides:ovs}).eq('id',delTaskId);
      if(rf.error){toast('Could not update series','error');return;}
      toast('This & future removed ✓');
    }else{
      var ok=await moveToTrash('task',delTaskId,t,(parseTT(t.task_type)[0]||t.name||'Task'));
      if(!ok){toast('Could not move to trash','error');return;}
      toast('Entire series moved to trash ✓');
    }
  }else{
    var ok2=await moveToTrash('task',delTaskId,t,(parseTT(t.task_type)[0]||t.name||'Task'));
    if(!ok2){toast('Could not move to trash','error');return;}
    toast('Moved to trash ✓');
  }
  closeDeleteModal();closeDrill();await load();
}

// MEMBER MODAL
function openM(){if(!cu||!cu.isAdmin||getNavAccess(cu.id).add_member===false){toast('You don\'t have access to add members','error');return;}closeMobileNav();el('mmtitle').textContent='Add team member';el('meid').value='';el('mdel').style.display='none';var oBtn=el('msetoverseer');if(oBtn)oBtn.style.display='none';['mname','mrole','mtags','mdesc','mpin'].forEach(function(id){el(id).value='';});el('madmin').value='false';el('minactive').value='false';el('mcolor').value='#34d399';renderSwatches('mcolorgrid','mcolor','#34d399');syncMAccessSec();el('MM').classList.add('open');}
function openEM(mid){var m=members.find(function(x){return x.id===mid;});if(!m)return;var col=(m.color&&m.color.charAt(0)==='#')?m.color:(getMC(m).text);el('mmtitle').textContent='Edit member';el('meid').value=mid;el('mdel').style.display='flex';el('mname').value=m.name||'';el('mrole').value=m.role||'';el('mtags').value=m.role_tags||'';el('mdesc').value=m.description||'';el('mpin').value=m.pin||'';el('madmin').value=m.is_admin?'true':'false';el('minactive').value=isInactiveMember(m)?'true':'false';el('mcolor').value=col;renderSwatches('mcolorgrid','mcolor',col);syncMAccessSec();var oBtn=el('msetoverseer');if(oBtn){oBtn.style.display=(cu&&cu.isAdmin)?'inline-flex':'none';oBtn.textContent=isOverseerMember(m)?'Agency overseer ✓':'Set as agency overseer';oBtn.disabled=!!isOverseerMember(m);}el('MM').classList.add('open');}
function closeMM(){el('MM').classList.remove('open');}

async function saveM(){
  var eid=el('meid').value,name=el('mname').value.trim(),role=el('mrole').value.trim(),description=el('mdesc').value.trim(),color=el('mcolor').value,role_tags=el('mtags').value.trim(),pin=el('mpin').value.trim(),is_admin=el('madmin').value==='true',is_inactive=el('minactive').value==='true';
  if(!name||!role){toast('Name and role required','error');return;}
  var payload={name:name,role:role,description:description,color:color,role_tags:role_tags,pin:pin,is_admin:is_admin,is_inactive:is_inactive};
  var r=eid?await sb.from('members').update(payload).eq('id',eid):await sb.from('members').insert([payload]).select();
  if(r.error&&isInactiveColumnError(r.error)){
    console.warn('[4KPI] is_inactive column missing — saving inactive flag in settings instead');
    r=eid?await sb.from('members').update(memberPayloadWithoutInactive(payload)).eq('id',eid):await sb.from('members').insert([memberPayloadWithoutInactive(payload)]).select();
  }
  if(r.error){console.error('[4KPI] saveM failed',r.error);toast('Error saving: '+(r.error.message||'check console'),'error');return;}
  var savedId=eid||(r.data&&r.data[0]?r.data[0].id:null);
  if(savedId){
    if(is_inactive)inactiveMembers[savedId]=true;
    else delete inactiveMembers[savedId];
    var local=members.find(function(x){return x.id===savedId;});
    if(local)local.is_inactive=is_inactive;
  }
  if(cu&&cu.isAdmin&&savedId){
    if(is_admin)delete memberNavAccess[savedId];
    else if(el('mAccessSec').style.display!=='none')readMemberNavAccess(savedId);
    else if(!memberNavAccess[savedId])memberNavAccess[savedId]=Object.assign({},DEFAULT_MEMBER_NAV);
    saveAll();
  }else if(savedId)saveAll();
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
  var lbl=ranked.map(function(x){return x.m.name;}),rates=ranked.map(function(x){return x.s.rate;}),bc=rates.map(function(r){return r>=80?accentHex():r>=50?accentHex2():'#ff5c5c';});
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
  try{
    closeMobileNav();
    if(!cu){toast('Please log in first','error');return;}
    var access=cu?getNavAccess(cu.id):{};
    if(page!=='dailylog'&&access[page]===false){toast('You don\'t have access to this section','error');return;}
    syncArchivedPageBanner(page);
    var pageEl=el('page-'+page);
    if(!pageEl){console.error('[4KPI] gp: page not found',page);toast('Page not found — try refreshing','error');return;}
    qsa('.page').forEach(function(p){p.classList.remove('active');});
    qsa('.ni').forEach(function(b){b.classList.remove('active');});
    qsa('.btn-log-task').forEach(function(b){b.classList.remove('active');});
    pageEl.classList.add('active');
    if(btn&&btn.classList&&(btn.classList.contains('ni')||btn.classList.contains('btn-log-task')))btn.classList.add('active');
    if(page==='dailylog'){
      rDailyLog();
      setTimeout(function(){
        var comp=el('dailyLogComposer');
        if(comp)comp.scrollIntoView({behavior:'smooth',block:'start'});
        else pageEl.scrollIntoView({behavior:'smooth',block:'start'});
      },50);
    }
    if(page==='mytasks')rMyTasksPage();
    if(page==='worklog')rWorklog();
    if(page==='calendar')renderCal();
    if(page==='tasks')rTasksPage();
    if(page==='performance')rCharts();
    if(page==='oversight')rOversight();
    if(page==='intelligence')rIntel();
    if(page==='library')rLib();
    if(page==='results'){refreshResFilters();rResults();}
    if(page==='trash')rTrash();
    if(page==='roles')rRoles();
    if(page==='compare')rCompare();
  }catch(e){
    console.error('[4KPI] gp failed',page,e);
    toast('Navigation error — refresh the page','error');
  }
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
  var ctx=c.getContext('2d'),colors=[accentHex(),accentHex2(),'#5b9cf6','#fb7185','#a78bfa','#34d399'],parts=[];
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
  RCOLS={};customRA={};delBase={tasks:{},rc:[],rcByRole:{}};customRC=[];customRCByRole={};catMeta={};catOrder=null;loginOrder=null;rolesOrder=null;memberNavAccess={};inactiveMembers={};overseerId=null;taskDayOrder={};daySnapshots={};
  ['4k_rc','4k_cra','4k_del','4k_crc','4k_crcr','4k_cm','4k_co','4k_lo','4k_ro','4k_mna','4k_ina','4k_oid','4k_tdo','4k_trash','4k_dsn'].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
}

function subscribeRealtime(){
  if(!sb||!cu)return;
  sb.channel('kpi').on('postgres_changes',{event:'*',schema:'public',table:'tasks'},function(){if(cu)fetchAndRender(false);}).on('postgres_changes',{event:'*',schema:'public',table:'members'},function(){if(cu)fetchAndRender(false);}).on('postgres_changes',{event:'*',schema:'public',table:'task_history'},function(){if(cu)fetchAndRender(false);}).on('postgres_changes',{event:'*',schema:'public',table:'activity_log'},function(){if(!cu)return;loadActivityLog().then(function(){if(el('page-dailylog')&&el('page-dailylog').classList.contains('active'))rDailyLog();});}).on('postgres_changes',{event:'*',schema:'public',table:'role_notes'},function(){if(cu)loadRoleNotes();}).on('postgres_changes',{event:'*',schema:'public',table:'result_posts'},function(){if(!cu)return;loadResultPosts().then(function(){if(el('page-results').classList.contains('active'))rResults();if(el('page-dashboard').classList.contains('active'))genIns();});}).on('postgres_changes',{event:'*',schema:'public',table:'trash_bin'},function(){if(!cu)return;loadTrash().then(function(){if(el('page-trash').classList.contains('active'))rTrash();});}).subscribe();
}

function toast(msg,type){type=type||'success';var t=el('toast');if(!t)return;t.textContent=msg;t.className='toast '+type+' show';setTimeout(function(){t.className='toast';},2600);}

// MODAL CLOSE ON BACKDROP
['TM','MM','ECM','FBM','RM','WPM','DM','TransferM','DaySnapM','PresetM','ThemeM'].forEach(function(id){var node=el(id);if(node)node.addEventListener('click',function(e){if(e.target===node){if(id==='DM')closeDeleteModal();else if(id==='TransferM')closeTransferM();else if(id==='DaySnapM')closeDaySnapM();else if(id==='PresetM')closePresetManager();else if(id==='ThemeM')closeThemeModal();else node.classList.remove('open');}});});
var ddOv=el('DD');if(ddOv)ddOv.addEventListener('click',function(e){if(e.target===ddOv)closeDrill();});

console.log('[4KPI] app version',APP_VER);
if(typeof window!=='undefined'&&window.__4K_EXPECTED_VER&&window.__4K_EXPECTED_VER!==APP_VER){
  try{
    var mk='4k_js_mismatch_'+window.__4K_EXPECTED_VER;
    if(!sessionStorage.getItem(mk)){sessionStorage.setItem(mk,'1');location.reload();}
  }catch(e){}
}
window.gp=gp;
window.openT=openT;
window.logout=logout;
window.openM=openM;
window.toggleHelp=toggleHelp;
window.toggleP=toggleP;
window.openFeedback=openFeedback;
window.closeFeedback=closeFeedback;
window.saveFeedback=saveFeedback;
window.setStar=setStar;
window.closeMobileNav=closeMobileNav;
window.toggleMobileNav=toggleMobileNav;
window.clearActTime=clearActTime;
window.clearStartTime=clearStartTime;
window.syncStartClearBtn=syncStartClearBtn;
window.closeDaySnapM=closeDaySnapM;
window.openToolsDrawer=openToolsDrawer;
window.setActivityLogTarget=setActivityLogTarget;
window.closeToolsDrawer=closeToolsDrawer;
window.openToolNav=openToolNav;
window.openActivityModal=openActivityModal;
window.closeActivityModal=closeActivityModal;
window.focusActivityComposer=focusActivityComposer;
window.loadActivityForEdit=loadActivityForEdit;
window.cancelActivityEdit=cancelActivityEdit;
window.deleteActivityFromComposer=deleteActivityFromComposer;
window.saveActivity=saveActivity;
window.deleteActivity=deleteActivity;
window.deleteActivityFromModal=deleteActivityFromModal;
window.copyDailyLogDay=copyDailyLogDay;
window.closeCopyDayModal=closeCopyDayModal;
window.copyFromDayModal=copyFromDayModal;
window.selectDaySummaryText=selectDaySummaryText;
window.downloadDaySummary=downloadDaySummary;
window.chDailyLogDay=chDailyLogDay;
window.goDailyLogToday=goDailyLogToday;
window.pickDailyLogDate=pickDailyLogDate;
window.toggleTagManager=toggleTagManager;
window.addActivityTagFromModal=addActivityTagFromModal;
window.addActivityTagFromMgr=addActivityTagFromMgr;
window.removeActivityTag=removeActivityTag;
window.copyActivityLogSetupSQL=copyActivityLogSetupSQL;
window.retryActivityLogSupabase=retryActivityLogSupabase;
window.toggleWeekView=toggleWeekView;
window.togglePreset=togglePreset;
window.startFromPreset=startFromPreset;
window.openPresetManager=openPresetManager;
window.onPresetSearchInput=onPresetSearchInput;
window.onPresetMgrSearchInput=onPresetMgrSearchInput;
window.closePresetManager=closePresetManager;
window.onPresetTimeSelect=onPresetTimeSelect;
window.updatePresetCustomTime=updatePresetCustomTime;
window.updatePresetField=updatePresetField;
window.deletePreset=deletePreset;
window.addPresetRow=addPresetRow;
window.openThemeModal=openThemeModal;
window.closeThemeModal=closeThemeModal;
window.pickAccentTheme=pickAccentTheme;
try{var _bootAccent=ls('4k_accent_theme');if(_bootAccent&&ACCENT_THEMES[_bootAccent])applyAccentTheme(_bootAccent,false);}catch(e){}
initLogin();
initSidebar();
