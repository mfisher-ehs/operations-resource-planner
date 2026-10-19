'use client';
import { useMemo, useState } from 'react';
import { validateAssignment, type Assignment, type SchedulingData } from '../src/scheduling';

type DemoJob = { id: string; title: string; client: string; location: string; time: string; duration: string; category: string; status: 'pending' | 'ready'; accent: string };
const days = ['Mon 02','Tue 03','Wed 04','Thu 05','Fri 06'];
const employees = [{ id: 'E1', name: 'Jordan Lee', initials: 'JL', role: 'Field Lead', tone: 'violet' },{ id: 'E2', name: 'Morgan Reed', initials: 'MR', role: 'Operator', tone: 'cyan' },{ id: 'E3', name: 'Casey Park', initials: 'CP', role: 'Field Specialist', tone: 'amber' },{ id: 'E4', name: 'Taylor Brooks', initials: 'TB', role: 'Operator', tone: 'pink' }];
const jobs: DemoJob[] = [
  { id:'JOB-1042', title:'Site inspection', client:'Northstar Facilities', location:'East District', time:'08:00–11:00', duration:'3h', category:'Inspection', status:'ready', accent:'cyan' },
  { id:'JOB-1043', title:'Equipment relocation', client:'Cedar Logistics', location:'Central Yard', time:'09:00–14:00', duration:'5h', category:'Logistics', status:'ready', accent:'violet' },
  { id:'JOB-1044', title:'Preventive service', client:'Pioneer Works', location:'West Campus', time:'13:00–16:00', duration:'3h', category:'Service', status:'ready', accent:'amber' },
  { id:'JOB-1045', title:'Materials pickup', client:'Summit Operations', location:'South Terminal', time:'10:00–13:00', duration:'3h', category:'Transport', status:'pending', accent:'pink' },
  { id:'JOB-1046', title:'Facility walkthrough', client:'Harborline Group', location:'North Site', time:'08:00–12:00', duration:'4h', category:'Inspection', status:'ready', accent:'cyan' }
];
type DriverMessage = { id: string; driverId: string; jobId: string; body: string; sentAt: string; acknowledged: boolean };
type Booking = { id: string; employeeId: string; jobId: string; day: number; start: number; end: number; equipmentId: string };
const initial: Booking[] = [
  {id:'A1',employeeId:'E1',jobId:'JOB-1042',day:0,start:8,end:11,equipmentId:'V1'},
  {id:'A2',employeeId:'E2',jobId:'JOB-1043',day:1,start:9,end:14,equipmentId:'V2'},
  {id:'A3',employeeId:'E3',jobId:'JOB-1044',day:2,start:13,end:16,equipmentId:'V1'},
  {id:'A4',employeeId:'E4',jobId:'JOB-1046',day:3,start:8,end:12,equipmentId:'V2'}
];
const iso = (day: number, hour: number) => `2026-11-${String(day + 2).padStart(2,'0')}T${String(hour).padStart(2,'0')}:00:00Z`;
function toAssignment(b: Booking): Assignment { return {id:b.id,jobId:b.jobId,employeeIds:[b.employeeId],equipmentIds:[b.equipmentId],window:{start:iso(b.day,b.start),end:iso(b.day,b.end)},state:'confirmed'}; }
function model(bookings: Booking[]): SchedulingData {
  return {
    employees:employees.map(e=>({id:e.id,qualifications:[{code:'FIELD',status:'verified' as const,validUntil:'2027-01-01T00:00:00Z'}],unavailable:[]})),
    equipment:[{id:'V1',type:'vehicle',maintenance:[]},{id:'V2',type:'vehicle',maintenance:[]}],
    jobs:jobs.map(j=>({id:j.id,status:j.status,requiredQualifications:['FIELD'],requiredEquipmentTypes:['vehicle'],requiredDocumentNames:['work-order'],documentNames:j.status==='ready'?['work-order']:[]})),
    assignments:bookings.map(toAssignment)
  };
}
export default function Dashboard() {
  const [bookings,setBookings] = useState<Booking[]>(initial);
  const [messages,setMessages] = useState<DriverMessage[]>([]);
  const [recipient,setRecipient] = useState('E1');
  const [messageJob,setMessageJob] = useState('JOB-1042');
  const [messageBody,setMessageBody] = useState('');
  const [driverView,setDriverView] = useState(false);
  const [selectedJob,setSelectedJob] = useState(jobs[3]!.id);
  const [employeeId,setEmployeeId] = useState('E1');
  const [day,setDay] = useState(4);
  const [equipmentId,setEquipmentId] = useState('V1');
  const [notice,setNotice] = useState('');
  const [filter,setFilter] = useState<'all'|'ready'|'pending'>('all');
  const selected = jobs.find(j=>j.id===selectedJob)!;
  const scheduled = new Set(bookings.map(b=>b.jobId));
  const visible = jobs.filter(j=>!scheduled.has(j.id) && (filter==='all'||j.status===filter));
  const candidate: Booking = {id:'NEW',jobId:selected.id,employeeId,day,start:selected.id==='JOB-1045'?10:8,end:selected.id==='JOB-1045'?13:12,equipmentId};
  const findings = useMemo(()=>validateAssignment(toAssignment(candidate),model(bookings)),[bookings,selectedJob,employeeId,day,equipmentId]);
  const blockers = findings.filter(f=>f.severity==='blocker');
  function assign() {
    if(scheduled.has(selected.id)){setNotice('This job is already on the board.');return;}
    if(blockers.length){setNotice('Assignment blocked: '+blockers.map(f=>f.code.replaceAll('_',' ').toLowerCase()).join(', '));return;}
    setBookings(prev=>[...prev,{...candidate,id:'A'+(Date.now())}]);
    setNotice('Assignment confirmed for '+selected.title+'.');
  }
  function sendMessage() {
    const body=messageBody.trim();
    if(!body){setNotice('Enter an update before sending.');return;}
    if(!bookings.some(b=>b.employeeId===recipient && b.jobId===messageJob)){setNotice('Select a job assigned to this driver.');return;}
    setMessages(prev=>[{id:'MSG-'+(prev.length+1),driverId:recipient,jobId:messageJob,body,sentAt:new Date().toLocaleString(),acknowledged:false},...prev]);
    setMessageBody('');
    setNotice('Demo update sent to '+employees.find(e=>e.id===recipient)?.name+'. No real SMS was sent.');
  }
  function reset(){setBookings(initial);setSelectedJob('JOB-1045');setMessages([]);setMessageBody('');setNotice('Demo schedule restored.');}
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon">◈</span><div><strong>OPERATIONS</strong><small>RESOURCE PLANNER</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav><a className="active">▦ <span>Schedule Board</span></a><a href="#queue">◫ <span>Job Queue</span></a><a href="#resources">♧ <span>Resources</span></a><a href="#activity">◷ <span>Activity</span></a><a href="#messages">✉ <span>Driver updates</span></a></nav>
      <div className="side-bottom"><span className="live-dot"/> DEMO WORKSPACE <p>Fictional records · Local preview</p></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <b>Schedule Board</b></div><div className="top-actions"><span className="demo-tag">● DEMO MODE</span><div className="avatar">OP</div></div></header>
      <div className="content">
        <div className="heading"><div><div className="eyebrow">OPERATIONS OVERVIEW <span> / WEEK 45</span></div><h1>Resource scheduling <span className="heading-star">✳</span></h1><p>Plan assignments, monitor availability, and resolve conflicts before dispatch.</p></div><button className="outline" onClick={reset}>↻ Reset demo</button></div>
        <section className="stats">
          <div className="stat"><span>Scheduled jobs</span><strong>{bookings.length}<em> / {jobs.length}</em></strong><small>Across this workweek</small><div className="stat-line cyan-line"/></div>
          <div className="stat"><span>Available personnel</span><strong>{employees.length}<em> / {employees.length}</em></strong><small>Qualified in demo dataset</small><div className="stat-line violet-line"/></div>
          <div className="stat"><span>Unscheduled jobs</span><strong>{jobs.length-scheduled.size}</strong><small>Awaiting an assignment</small><div className="stat-line amber-line"/></div>
          <div className="stat"><span>Fleet resources</span><strong>2<em> units</em></strong><small>Shared across assignments</small><div className="stat-line pink-line"/></div>
        </section>
        <section className="board-card">
          <div className="section-head"><div><div className="eyebrow">WEEKLY PLANNING</div><h2>Assignment board</h2></div><div className="week-nav"><span>◀</span> Nov 2 – 6, 2026 <span>▶</span></div></div>
          <div className="board-scroll"><div className="board-grid">
            <div className="corner"><span>TEAM MEMBERS</span><small>4 active resources</small></div>
            {days.map((d,i)=><div className="dayhead" key={d}><span>{d.split(' ')[0].toUpperCase()}</span><strong>{d.split(' ')[1]}</strong>{i===0&&<i>WEEK START</i>}</div>)}
            {employees.map(e=><div className="resource-row" key={e.id}>
              <div className="person" id="resources"><div className={'person-icon '+e.tone}>{e.initials}</div><div><b>{e.name}</b><small>{e.role}</small></div></div>
              {days.map((d,i)=>{const entries=bookings.filter(b=>b.employeeId===e.id&&b.day===i);return <div className="cell" key={d}>{entries.map(b=>{const j=jobs.find(x=>x.id===b.jobId)!;return <button key={b.id} className={'booking '+j.accent} title={j.client+' — '+j.location} onClick={()=>setNotice(j.id+' · '+j.title+' · '+j.client+' · '+j.location+' · '+j.time)}><small>{String(b.start).padStart(2,'0')}:00–{String(b.end).padStart(2,'0')}:00</small><b>{j.title}</b><span>{j.id}</span></button>})}</div>})}
            </div>)}
          </div></div><div className="board-footer"><span><i className="legend cyan-bg"/> Inspection</span><span><i className="legend violet-bg"/> Logistics</span><span><i className="legend amber-bg"/> Service</span><span><i className="legend pink-bg"/> Transport</span><small>Click a booking to inspect details</small></div>
        </section>
        <div className="bottom-grid">
          <section className="panel" id="queue"><div className="section-head"><div><div className="eyebrow">WORK INTAKE</div><h2>Unscheduled jobs <span className="count">{jobs.length-scheduled.size}</span></h2></div><div className="filters">{(['all','ready','pending'] as const).map(f=><button className={filter===f?'chosen':''} key={f} onClick={()=>setFilter(f)}>{f}</button>)}</div></div>
            <div className="queue">{visible.length===0?<div className="empty">No jobs match this filter.</div>:visible.map(j=><button key={j.id} onClick={()=>{setSelectedJob(j.id);setNotice('')}} className={'queue-item '+(selectedJob===j.id?'selected':'')}><span className={'queue-mark '+j.accent}/><div><strong>{j.title}</strong><small>{j.id} · {j.client}</small></div><span className={'status '+j.status}>{j.status}</span><span className="chevron">›</span></button>)}</div>
          </section>
          <section className="panel assignment-panel" id="activity"><div className="section-head"><div><div className="eyebrow">ASSIGNMENT CHECK</div><h2>Plan a job</h2></div><span className="micro">VALIDATION ACTIVE</span></div>
            <p className="form-description">Select an unscheduled job, employee, day, and vehicle. Conflicts are checked against the live demo board.</p>
            <div className="form-grid"><label>Job<select value={selectedJob} onChange={e=>setSelectedJob(e.target.value)}>{jobs.map(j=><option key={j.id} value={j.id}>{j.id} — {j.title}</option>)}</select></label><label>Employee<select value={employeeId} onChange={e=>setEmployeeId(e.target.value)}>{employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></label><label>Day<select value={day} onChange={e=>setDay(Number(e.target.value))}>{days.map((d,i)=><option key={d} value={i}>{d}</option>)}</select></label><label>Vehicle<select value={equipmentId} onChange={e=>setEquipmentId(e.target.value)}><option value="V1">Vehicle 01</option><option value="V2">Vehicle 02</option></select></label></div>
            <div className={'validation '+(blockers.length?'blocked':'clear')}><strong>{blockers.length?'⚠ '+blockers.length+' scheduling blocker(s)':'✓ No blocking conflicts'}</strong><small>{findings.length?findings.map(f=>f.code.replaceAll('_',' ').toLowerCase()).join(' · '):'Qualification, equipment and booking checks passed'}</small></div>
            <button className="primary" onClick={assign} disabled={blockers.length>0||scheduled.has(selected.id)}>Confirm assignment <span>→</span></button>
            {notice&&<div className="notice" role="status">{notice}</div>}
          </section>
        </div>
        <section className="panel" id="messages" style={{marginTop:18}}>
          <div className="section-head"><div><div className="eyebrow">INDIVIDUAL DRIVER COMMUNICATION</div><h2>Driver updates</h2></div><span className="micro">SIMULATED DELIVERY · NO SMS</span></div>
          <p className="form-description">Send an assignment-specific update to one driver. Open the phone preview to acknowledge it as that driver.</p>
          <div className="form-grid">
            <label>Recipient<select value={recipient} onChange={e=>{const id=e.target.value;setRecipient(id);setMessageJob(bookings.find(b=>b.employeeId===id)?.jobId||'');}}>{employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></label>
            <label>Assigned job<select value={messageJob} onChange={e=>setMessageJob(e.target.value)}>{bookings.filter(b=>b.employeeId===recipient).map(b=>{const j=jobs.find(x=>x.id===b.jobId)!;return <option key={b.id} value={j.id}>{j.id} — {j.title}</option>})}</select></label>
          </div>
          <label style={{display:'block',marginTop:12}}>Update for this driver<textarea style={{display:'block',width:'100%',minHeight:90,marginTop:8,background:'#0c1a2e',color:'#e9f0ff',border:'1px solid #30445c',borderRadius:6,padding:12}} value={messageBody} onChange={e=>setMessageBody(e.target.value)} placeholder="Example: Pickup gate changed to entrance B. Call dispatch on arrival." /></label>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:12}}>
            <button className="primary" style={{maxWidth:270}} onClick={sendMessage}>Send individual update →</button>
            <button className="outline" onClick={()=>setDriverView(v=>!v)}>{driverView?'Hide':'Show'} driver phone preview</button>
          </div>
          {driverView&&<div style={{maxWidth:370,marginTop:20,padding:16,border:'2px solid #536779',borderRadius:24,background:'#101b29'}}>
            <div className="eyebrow">DRIVER PHONE · {employees.find(e=>e.id===recipient)?.name}</div>
            <h2>My updates</h2>
            {messages.filter(m=>m.driverId===recipient).length===0?<p>No updates for this driver.</p>:messages.filter(m=>m.driverId===recipient).map(m=>{const j=jobs.find(x=>x.id===m.jobId);return <article key={m.id} style={{padding:12,marginTop:12,border:'1px solid #40566c',borderRadius:8}}>
              <strong>{j?.client} · {j?.title}</strong><p>{j?.location}</p><p>{m.body}</p><small>{m.sentAt} · {m.acknowledged?'Acknowledged':'Awaiting acknowledgment'}</small>
              {!m.acknowledged&&<button className="outline" style={{display:'block',marginTop:10}} onClick={()=>setMessages(prev=>prev.map(x=>x.id===m.id?{...x,acknowledged:true}:x))}>✓ Received</button>}
            </article>})}
          </div>}
          <div style={{marginTop:18}}><div className="eyebrow">MESSAGE HISTORY</div>{messages.length===0?<p className="form-description">No updates sent yet.</p>:messages.map(m=><div key={m.id} style={{padding:'12px 0',borderBottom:'1px solid #27384b'}}><strong>{employees.find(e=>e.id===m.driverId)?.name}</strong> · {m.jobId} · {m.acknowledged?'✓ Acknowledged':'◷ Awaiting acknowledgment'}<p style={{margin:'6px 0'}}>{m.body}</p><small>{m.sentAt}</small></div>)}</div>
        </section>
        <footer>OPERATIONS RESOURCE PLANNER <span>·</span> SYNTHETIC DATA ONLY <span>·</span> PORTFOLIO PROTOTYPE v0.2</footer>
      </div>
    </main>
  </div>;
}
