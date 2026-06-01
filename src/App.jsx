import { useState, useMemo, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from './supabase.js';

// ── DATA ─────────────────────────────────────────────────────────────────────

const DSR_DATA=[
  {id:1,shift:"DAY",date:"2026-05-27",status:"PENDING APPROVAL",drill:"BT-15",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:0},
  {id:2,shift:"DAY",date:"2026-05-27",status:"PENDING APPROVAL",drill:"BT-10",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:0},
  {id:3,shift:"DAY",date:"2026-05-27",status:"PENDING APPROVAL",drill:"BT-06",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:0},
  {id:4,shift:"DAY",date:"2026-05-27",status:"PENDING APPROVAL",drill:"BT-20",contract:"BM-NM Drilling Program 2024-2026 DD",project:"Massarah North DD 2026 Conversion",client:"Maaden BMNM",dist:0},
  {id:5,shift:"DAY",date:"2026-05-27",status:"PENDING APPROVAL",drill:"BT-18",contract:"BM-NM Drilling Program 2024-2026 DD",project:"Massarah North DD 2026 Conversion",client:"Maaden BMNM",dist:0},
  {id:6,shift:"NIGHT",date:"2026-05-26",status:"PENDING APPROVAL",drill:"BT-10",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:0},
  {id:7,shift:"NIGHT",date:"2026-05-26",status:"PENDING APPROVAL",drill:"BT-15",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:0},
  {id:8,shift:"DAY",date:"2026-05-26",status:"PENDING APPROVAL",drill:"BT-06",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:0},
  {id:9,shift:"DAY",date:"2026-05-26",status:"PENDING APPROVAL",drill:"BT-19",contract:"BM-NM Drilling Program 2024-2026 DD",project:"Massarah North DD 2026",client:"Maaden BMNM",dist:0},
  {id:10,shift:"NIGHT",date:"2026-05-25",status:"APPROVED",drill:"BT-15",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:15.0},
  {id:11,shift:"DAY",date:"2026-05-25",status:"APPROVED",drill:"BT-15",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:0},
  {id:12,shift:"DAY",date:"2026-05-24",status:"VALIDATED",drill:"BT-03",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:8.5},
  {id:13,shift:"NIGHT",date:"2026-05-24",status:"VALIDATED",drill:"BT-03",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:12},
  {id:14,shift:"DAY",date:"2026-05-23",status:"APPROVED",drill:"BT-04",contract:"ERD Drilling Program 2026 DD",project:"Mansourah GC",client:"Maaden Exploration",dist:20.5},
  {id:15,shift:"NIGHT",date:"2026-05-23",status:"APPROVED",drill:"BT-04",contract:"ERD Drilling Program 2026 DD",project:"Mansourah GC",client:"Maaden Exploration",dist:18},
];

const PROJECTS_DATA=[
  {id:1,status:"InActive",name:"ADW RCGC_2025",client:"Maaden BMNM",contract:"Drilling Exploration RC",location:"Ad Duwayhi",holes:641},
  {id:2,status:"InActive",name:"Al Amar UG 2025",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 - UG",location:"Al Amar",holes:71},
  {id:3,status:"InActive",name:"Amana East Scout RC",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",location:"Uruq 12",holes:3},
  {id:4,status:"InActive",name:"Amana RC Scout",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",location:"Uruq 11",holes:9},
  {id:5,status:"InActive",name:"Ar Rjum RCGC",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",location:"Ar Rjum",holes:1378},
  {id:6,status:"Active",name:"Mansourah GC",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",location:"Mansourah Massarah",holes:1281},
  {id:7,status:"Active",name:"MM Cluster",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",location:"MM Area",holes:204},
  {id:8,status:"Active",name:"Massarah North DD 2026 Conversion",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",location:"Mansourah Massarah",holes:52},
];

const HOLES_DATA=[
  {id:1,status:"Active",hole:"MN_RC_825_219",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",maxDepth:"46 m",lastActivity:"2025-03-07"},
  {id:2,status:"Active",hole:"MN_RC_825_237",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",maxDepth:"46 m",lastActivity:"2025-01-17"},
  {id:3,status:"Active",hole:"MN_RC_825_238",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",maxDepth:"46 m",lastActivity:"2025-01-17"},
  {id:4,status:"Complete",hole:"UQ_GT26_004_R1",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",maxDepth:"120 m",lastActivity:"2026-05-22"},
  {id:5,status:"Active",hole:"AA25-001",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 - UG",project:"Al Amar UG 2025",maxDepth:"204 m",lastActivity:"2025-03-04"},
  {id:6,status:"Active",hole:"BN_DD_001",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",maxDepth:"350 m",lastActivity:"2026-05-15"},
  {id:7,status:"Abandoned",hole:"TEST_HOLE_001",client:"Maaden BMNM",contract:"Drilling Exploration RC",project:"ADW RCGC_2025",maxDepth:"20 m",lastActivity:"2024-11-10"},
];

const DRILLS_DATA=[
  {id:1,status:"Active",name:"BT-01",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2020,serial:"BT2500/2020-03"},
  {id:2,status:"Active",name:"BT-02",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2020,serial:"BT2500/2020-02"},
  {id:3,status:"Active",name:"BT-03",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2020,serial:"BT2500/2020-01"},
  {id:4,status:"Active",name:"BT-04",type:"Surface - Coring",make:"Boretech",model:"BT1500",year:2016,serial:"BT1500-02/2016"},
  {id:5,status:"Active",name:"BT-05",type:"Surface - Coring",make:"Boretech",model:"BT1500",year:2020,serial:"BT1500-0105"},
  {id:6,status:"Active",name:"BT-06",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2020,serial:"BT2500/2020-05"},
  {id:7,status:"Active",name:"BT-10",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2021,serial:"BT2500/2021-01"},
  {id:8,status:"Active",name:"BT-15",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2022,serial:"BT2500/2022-01"},
  {id:9,status:"Active",name:"BT-20",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2023,serial:"BT2500/2023-01"},
  {id:10,status:"Active",name:"UG-04",type:"Underground - Coring",make:"Boretech",model:"BT2500",year:2023,serial:"BT2500/2023-04"},
];

const BITS_DATA=[
  {id:1,status:"Active",serial:"BIT-2024-001",model:"HQ3",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",size:"HQ3",type:"Diamond Core Bit",totalDist:"60 m"},
  {id:2,status:"Active",serial:"BIT-2024-002",model:"NQ",contract:"BM-NM Drilling Program 2024-2026 DD",project:"Al Amar UG 2025",client:"Maaden BMNM",size:"NQ",type:"Diamond Core Bit",totalDist:"204 m"},
  {id:3,status:"Complete-Damaged",serial:"BIT-2023-003",model:"HQ",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",client:"Maaden BMNM",size:"HQ",type:"Diamond Core Bit",totalDist:"180 m"},
  {id:4,status:"Active",serial:"BIT-2025-004",model:"HQ3",contract:"ERD Drilling Program 2026 DD",project:"Mansourah GC",client:"Maaden Exploration",size:"HQ3",type:"RC Hammer Bit",totalDist:"45 m"},
  {id:5,status:"Complete-Worn Flat",serial:"BIT-2024-005",model:"BT2500",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",size:"BQ",type:"Diamond Core Bit",totalDist:"320 m"},
];

const CONSUMABLES_DATA=[
  {id:1,name:"ADAPTER INNER TUBE",category:"RC-MATERIAL",rate:"",rateType:"",currency:""},
  {id:2,name:"HQ 1.5M/5'OUTERTUBE",category:"HQ",rate:"",rateType:"",currency:""},
  {id:3,name:"HQ 3M/10'OUTERTUBE",category:"HQ",rate:"",rateType:"",currency:""},
  {id:4,name:"HQ ADAPTER COUPLING",category:"HQ",rate:"",rateType:"",currency:""},
  {id:5,name:"HQ CORE BOXES",category:"CORE BOX",rate:"",rateType:"",currency:""},
  {id:6,name:"HQ CORELIFTER (FLUTED)",category:"HQ",rate:"",rateType:"",currency:""},
  {id:7,name:"HQ FULLHOLE OUTERTUBE 3M",category:"HQ",rate:"",rateType:"",currency:""},
  {id:8,name:"HQ IINNERTUBE HEAD",category:"HQ",rate:"",rateType:"",currency:""},
  {id:9,name:"HQ INNERTUBE 1.5M",category:"HQ",rate:"",rateType:"",currency:""},
  {id:10,name:"HQ INNERTUBE 3M",category:"HQ",rate:"",rateType:"",currency:""},
];

const CONSUMABLE_CATS=[{id:1,name:"CORE BOX"},{id:2,name:"HQ"},{id:3,name:"PQ"},{id:4,name:"RC-MATERIAL"}];

const EMPLOYEES_DATA=[
  {id:1,empId:233,first:"Abdulnaim",last:"-",type:"Office",payroll:""},
  {id:2,empId:42,first:"ANTHER",last:"-",type:"Field",payroll:""},
  {id:3,empId:302,first:"Al Amin",last:"Ab Awal",type:"Field",payroll:""},
  {id:4,empId:75,first:"GHULAM",last:"ABBAS BIRHAMANI",type:"Field",payroll:""},
  {id:5,empId:385,first:"ELRASHEED OSMAN",last:"ABDALLA DAFAALLA",type:"Field",payroll:""},
  {id:6,empId:132,first:"MOHAMMED",last:"ABDALRHMAN ISMAEL",type:"Field",payroll:""},
  {id:7,empId:13,first:"ABDULLA",last:"ABDELGAYOUM BAKHIT",type:"Field",payroll:""},
  {id:8,empId:373,first:"HASSAN ABDELSALAM",last:"ABDELLATEF SOLIMAN",type:"Field",payroll:""},
  {id:9,empId:90,first:"IBRAHIM",last:"ABDELMALIK",type:"Field",payroll:""},
  {id:10,empId:166,first:"NABEEL",last:"ABDELRAZIG HAMID",type:"Field",payroll:""},
];

const EQUIP_TYPES=["4x4 Truck","Compressor","Fuel Truck","Gyro","Lowbed Trailer","Mini Bus","Reflex EZ-Trac","Water Pump","Water Truck"];
const EQUIP_UNITS=[
  {id:1,equip:"4x4 Truck",unit:1,type:"Transportation",year:2022,make:"MITSUBISHI",model:"PICKUP",vin:"4906 XXB"},
  {id:2,equip:"4x4 Truck",unit:18,type:"Transportation",year:2022,make:"MITSUBISHI",model:"L200Pickup",vin:"4898 BXB"},
  {id:3,equip:"Compressor",unit:1,type:"Drilling Support",year:2020,make:"ATLAS COPCO",model:"XAS375",vin:"AC375-001"},
];

const FLAGS_DATA=[
  {type:"Hole",name:"MM-GT-2025-01",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"MM-GT-2025-02",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"MM-GT-2025-03 / GT_004",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"SUK SRKGT 010",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"SUK SRKGT007",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
];
const KPI_DATA=[
  {client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",kpi:"Distance per Shift",actual:14.40,target:20.00,diff:-5.60},
  {client:"Maaden Exploration",contract:"ERD Drilling Program 2026 DD",kpi:"Distance per Shift",actual:17.50,target:20.00,diff:-2.50},
];

const REPORT_SETUP={
  "Casing":["Available in HQ/HQ Lining","Available in Core Type"],
  "Cementing":["Cementing Volumes (m3 x Sacks)","Cementing Intervals"],
  "Cuttings Control":["Cutting Control"],
  "Directional Drilling":["Directional - Casing","Directional - Drilling","Directional - Survey"],
  "Drilling":["Core Drilling","Rotary Drilling","DTH Drilling","RC Drilling","Air Core Drilling"],
  "Fishing":["Impression Block","Fishing - Back off","Fishing - Junk Basket","Fishing - Mill","Fishing - Overshot"],
  "Fluid Motion":["Fluid Motion"],
  "Hole Conditioning":["Condition Hole/Circulation","Condition Hole/Mix Mud/Lost Circulation"],
  "Hole Monitoring":["Logging Tag","Plumb Bob"],
  "Jarring":["Bumper Jar","Bumper Sub","Jars","Motor Jar (Closed)","Star Fish"],
  "Reaming":["Reaming Up","Reaming Down"],
  "Repair":["Breakdown - Generator","Breakdown - Hydraulics","Breakdown - Rig/Motor","Breakdown - Wireline"],
  "Safety":["Safety Meeting/Training","Pre-start Inspection","Risk Assessment","HSE Observation"],
  "Standby - Client":["Client directed waiting","Waiting for decision/instruction","Waiting on weather"],
  "Standby - Contractor":["Waiting for Tool/Equipment/Survey","Lunch and dinner break","Pre-shift meeting","Waiting for Water"],
  "Tripping":["Tripping In","Tripping Out","Trip In/Out with Reaming","Wash & Ream"],
  "Wireline Ops":["Core Recovery","Drop Off Inner Tube","Trip In Wireline","Trip Out Wireline"],
};

// ── UTILS ─────────────────────────────────────────────────────────────────────
const pg=(data,page,per)=>({items:data.slice((page-1)*per,page*per),total:data.length});
const filt=(data,filters,keys,q)=>data.filter(r=>{
  const fOk=Object.entries(filters).every(([k,v])=>!v||v==="all"||String(r[k])===v);
  const sOk=!q||keys.some(k=>String(r[k]||"").toLowerCase().includes(q.toLowerCase()));
  return fOk&&sOk;
});
const uniq=(arr,k)=>[...new Set(arr.map(r=>r[k]).filter(Boolean))];

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C={
  // Brand
  blue:"#2563eb",teal:"#0d9488",green:"#16a34a",
  orange:"#f59e0b",purple:"#7c3aed",red:"#ef4444",
  // Sidebar
  sidebarBg:"#0f172a",sidebarText:"#94a3b8",
  sidebarHover:"rgba(255,255,255,0.06)",sidebarActive:"rgba(37,99,235,0.2)",
  sidebarActiveText:"#60a5fa",sidebarBorder:"rgba(255,255,255,0.08)",
  // Content
  bg:"#f1f5f9",white:"#ffffff",
  border:"#e2e8f0",borderHover:"#cbd5e1",
  textPri:"#0f172a",textSec:"#334155",textMut:"#64748b",
  // Shadows
  shadow:"0 1px 3px rgba(0,0,0,0.08)",shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
};

// ── STATUS BADGE ──────────────────────────────────────────────────────────────
const STATUS_MAP={
  "PENDING APPROVAL":{bg:"#eff6ff",color:"#1d4ed8",bd:"#bfdbfe",dot:"#3b82f6"},
  "APPROVED":{bg:"#f0fdf4",color:"#15803d",bd:"#bbf7d0",dot:"#22c55e",icon:"✓"},
  "VALIDATED":{bg:"#f0f9ff",color:"#0369a1",bd:"#bae6fd",dot:"#0ea5e9"},
  "REJECTED":{bg:"#fff1f2",color:"#be123c",bd:"#fecdd3",dot:"#f43f5e"},
  "Active":{bg:"#f0fdf4",color:"#15803d",bd:"#bbf7d0",dot:"#22c55e"},
  "InActive":{bg:"#f8fafc",color:"#64748b",bd:"#e2e8f0",dot:"#94a3b8"},
  "Complete":{bg:"#f0f9ff",color:"#0369a1",bd:"#bae6fd",dot:"#0ea5e9"},
  "Abandoned":{bg:"#fff7ed",color:"#c2410c",bd:"#fed7aa",dot:"#f97316"},
  "Planned":{bg:"#faf5ff",color:"#7e22ce",bd:"#e9d5ff",dot:"#a855f7"},
  "Complete-Damaged":{bg:"#fff1f2",color:"#be123c",bd:"#fecdd3",dot:"#f43f5e"},
  "Complete-Worn Flat":{bg:"#fff7ed",color:"#c2410c",bd:"#fed7aa",dot:"#f97316"},
  "Complete-Left in Hole":{bg:"#fff1f2",color:"#be123c",bd:"#fecdd3",dot:"#f43f5e"},
};
const Badge=({s,sm})=>{
  const c=STATUS_MAP[s]||STATUS_MAP["InActive"];
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,
      padding:sm?"1px 8px":"2px 10px",fontSize:sm?10:11,fontWeight:600,
      background:c.bg,color:c.color,border:`1px solid ${c.bd}`,
      borderRadius:20,whiteSpace:"nowrap",letterSpacing:.2}}>
      <span style={{width:5,height:5,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {c.icon&&<span style={{fontSize:9}}>{c.icon}</span>}{s}
    </span>);
};

// ── TABLE ─────────────────────────────────────────────────────────────────────
const Th=({ch,w})=>(
  <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,
    color:C.textMut,background:"#f8fafc",borderBottom:"1px solid "+C.border,
    whiteSpace:"nowrap",width:w,textTransform:"uppercase",letterSpacing:.6}}>
    {ch}{ch&&<span style={{opacity:.3,fontSize:9,marginLeft:3}}>⇅</span>}
  </th>);
const Td=({ch,s})=>(
  <td style={{padding:"10px 14px",fontSize:13,color:C.textSec,
    borderBottom:"1px solid #f1f5f9",...s}}>{ch}</td>);
const NoRows=({cols})=>(
  <tr><td colSpan={cols||20} style={{textAlign:"center",padding:32,
    color:C.textMut,fontSize:13,fontStyle:"italic"}}>
    No records available.
  </td></tr>);

// ── FILTER SELECT ─────────────────────────────────────────────────────────────
const FSel=({label,opts,val,onChange,w})=>(
  <div style={{position:"relative",display:"inline-block"}}>
    <select value={val} onChange={e=>onChange(e.target.value)}
      style={{padding:"6px 30px 6px 12px",fontSize:12,fontWeight:500,
        color:val&&val!=="all"?C.blue:C.textSec,
        border:`1px solid ${val&&val!=="all"?C.blue:C.border}`,
        borderRadius:6,cursor:"pointer",appearance:"none",
        minWidth:w||130,background:val&&val!=="all"?"#eff6ff":C.white,
        boxShadow:C.shadow,transition:"all .15s"}}>
      <option value="all">{label}</option>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
    <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
      pointerEvents:"none",fontSize:10,color:C.textMut}}>▾</span>
  </div>);

// ── PAGINATION ────────────────────────────────────────────────────────────────
const Pager=({page,setPage,per,total})=>{
  const tp=Math.max(1,Math.ceil(total/per));
  const pages=[];
  for(let i=1;i<=tp;i++){
    if(i===1||i===tp||Math.abs(i-page)<=1)pages.push(i);
    else if(pages[pages.length-1]!=="...")pages.push("...");
  }
  const Pb=({ch,onClick,disabled,active})=>(
    <button onClick={onClick} disabled={disabled}
      style={{padding:"4px 10px",border:`1px solid ${active?C.blue:C.border}`,
        borderRadius:5,cursor:disabled?"default":"pointer",fontSize:12,fontWeight:active?600:400,
        background:active?C.blue:C.white,color:active?"#fff":disabled?C.border:C.textSec,
        transition:"all .15s"}}>
      {ch}
    </button>);
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"12px 0",fontSize:12}}>
      <span style={{color:C.textMut,fontSize:12}}>
        Showing <strong>{total===0?0:Math.min((page-1)*per+1,total)}</strong>–<strong>{Math.min(page*per,total)}</strong> of <strong>{total}</strong> entries
      </span>
      <div style={{display:"flex",gap:4,alignItems:"center"}}>
        <Pb ch="←" onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1}/>
        {pages.map((s,i)=>s==="..."
          ?<span key={i} style={{padding:"4px 6px",color:C.textMut}}>…</span>
          :<Pb key={i} ch={s} onClick={()=>setPage(s)} active={s===page}/>)}
        <Pb ch="→" onClick={()=>setPage(Math.min(tp,page+1))} disabled={page===tp}/>
        <select style={{marginLeft:8,padding:"4px 8px",border:"1px solid "+C.border,
          borderRadius:5,fontSize:12,color:C.textSec,background:C.white}}>
          <option>10</option><option>25</option><option>50</option>
        </select>
        <span style={{color:C.textMut}}>per page</span>
      </div>
    </div>);
};

// ── BUTTON ────────────────────────────────────────────────────────────────────
const BVARS={
  default:{bg:C.white,color:C.textSec,bd:`1px solid ${C.border}`},
  primary:{bg:C.blue,color:"#fff",bd:"none"},
  purple:{bg:C.purple,color:"#fff",bd:"none"},
  gray:{bg:"#475569",color:"#fff",bd:"none"},
  teal:{bg:C.teal,color:"#fff",bd:"none"},
  green:{bg:C.green,color:"#fff",bd:"none"},
  danger:{bg:C.red,color:"#fff",bd:"none"},
  outline:{bg:C.white,color:C.textSec,bd:`1px solid ${C.border}`},
};
const Btn=({ch,onClick,variant="default",sm,icon})=>{
  const v=BVARS[variant];
  return(
    <button onClick={onClick}
      style={{padding:sm?"4px 12px":"7px 16px",fontSize:sm?11:13,fontWeight:600,
        background:v.bg,color:v.color,border:v.bd,borderRadius:6,cursor:"pointer",
        display:"inline-flex",alignItems:"center",gap:5,letterSpacing:.2,
        boxShadow:variant==="default"||variant==="outline"?C.shadow:"none",
        transition:"opacity .15s"}}>
      {icon}{ch}
    </button>);
};

// ── MODAL ─────────────────────────────────────────────────────────────────────
const Modal=({open,onClose,title,children,w})=>{
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",
      display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(2px)"}}
      onClick={onClose}>
      <div style={{background:C.white,borderRadius:12,padding:28,width:w||500,
        maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 48px rgba(15,23,42,.2)",
        border:`1px solid ${C.border}`}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,color:C.textPri,fontWeight:700}}>{title}</strong>
          <button onClick={onClose}
            style={{background:"#f1f5f9",border:"none",cursor:"pointer",
              width:28,height:28,borderRadius:6,fontSize:16,color:C.textMut,
              display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {children}
      </div>
    </div>);
};

// ── FORM ──────────────────────────────────────────────────────────────────────
const FRow=({label,children})=>(
  <div style={{marginBottom:16}}>
    <label style={{display:"block",fontSize:12,fontWeight:600,color:C.textSec,
      marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>{label}</label>
    {children}
  </div>);
const FInput=({value,onChange,placeholder,type="text"})=>(
  <input type={type} value={value||""} onChange={e=>onChange(e.target.value)}
    placeholder={placeholder}
    style={{width:"100%",padding:"9px 12px",fontSize:13,border:`1px solid ${C.border}`,
      borderRadius:7,boxSizing:"border-box",outline:"none",color:C.textPri,
      transition:"border .15s"}}/>);
const FSelect=({value,onChange,opts})=>(
  <select value={value||""} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",padding:"9px 12px",fontSize:13,border:`1px solid ${C.border}`,
      borderRadius:7,boxSizing:"border-box",appearance:"none",color:C.textPri}}>
    <option value="">Select...</option>
    {opts.map(o=><option key={o} value={o}>{o}</option>)}
  </select>);

// ── MISC ──────────────────────────────────────────────────────────────────────
const Crumb=({items,nav})=>(
  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16,
    fontSize:12,color:C.textMut,fontWeight:500}}>
    {items.map((it,i)=>(
      <span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
        {i>0&&<span style={{color:C.border,fontSize:10}}>›</span>}
        {it.page
          ?<span style={{cursor:"pointer",color:C.blue,fontWeight:600}}
            onClick={()=>nav(it.page)}>{it.label}</span>
          :<span style={{color:C.textSec}}>{it.label}</span>}
      </span>))}
  </div>);

const SH=({title,action})=>(
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
    marginBottom:12,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
    <span style={{fontSize:13,fontWeight:700,color:C.textPri,letterSpacing:.1}}>{title}</span>
    {action}
  </div>);

const Card=({children,p,mb})=>(
  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,
    padding:p||18,marginBottom:mb||14,boxShadow:C.shadow}}>
    {children}
  </div>);

const SearchBar=({value,onChange,placeholder})=>(
  <div style={{position:"relative",display:"inline-block"}}>
    <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
      fontSize:12,color:C.textMut}}>🔍</span>
    <input value={value} onChange={e=>onChange(e.target.value)}
      placeholder={placeholder||"Search..."}
      style={{padding:"7px 12px 7px 28px",fontSize:12,border:`1px solid ${C.border}`,
        borderRadius:7,width:200,color:C.textPri,outline:"none",background:C.white}}/>
  </div>);

const IBtn=({onClick,icon,color,title})=>(
  <button onClick={onClick} title={title}
    style={{background:"none",border:"none",cursor:"pointer",padding:4,
      color,display:"inline-flex",alignItems:"center",borderRadius:4,
      transition:"background .15s"}}>
    {icon}
  </button>);

const Toast=({msg})=>{
  if(!msg)return null;
  return(
    <div style={{position:"fixed",bottom:24,right:24,background:"#1e293b",color:"#fff",
      padding:"12px 20px",borderRadius:8,fontSize:13,fontWeight:500,zIndex:9999,
      boxShadow:"0 8px 24px rgba(0,0,0,.3)",border:"1px solid #334155",
      display:"flex",alignItems:"center",gap:8}}>
      <span style={{color:"#4ade80"}}>✓</span>{msg}
    </div>);
};

// ── ICONS (SVG) ───────────────────────────────────────────────────────────────
const Ic={
  edit:<svg width={13} height={13} fill="none" stroke="#0d9488" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  trash:<svg width={13} height={13} fill="none" stroke="#ef4444" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  dl:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  ul:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>,
  filt:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>,
  chD:<svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>,
  chR:<svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>,
  chL:<svg width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>,
  logout:<svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  check:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
};


// ── HOME PAGE ─────────────────────────────────────────────────────────────────
const HomePage=({nav})=>{
  const [period,setPeriod]=useState("month");
  const [kpiPage,setKpiPage]=useState(1);
  const [flagPage,setFlagPage]=useState(1);
  const {items:kpiItems,total:kpiTotal}=pg(KPI_DATA,kpiPage,10);
  const {items:flagItems,total:flagTotal}=pg(FLAGS_DATA,flagPage,10);
  const MetricCard=({val,label,color,isLarge})=>(
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",
      justifyContent:"center",borderLeft:`1px solid ${C.border}`}}>
      <div style={{fontSize:isLarge?28:22,fontWeight:700,color:color||C.textPri,lineHeight:1}}>{val}</div>
      <div style={{fontSize:11,color:C.textMut,marginTop:4,fontWeight:500}}>{label}</div>
    </div>);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h1 style={{fontSize:20,fontWeight:700,color:C.textPri}}>Dashboard</h1>
        <div style={{display:"flex",gap:6}}>
          {["month","year"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)}
              style={{padding:"6px 16px",fontSize:12,fontWeight:600,borderRadius:7,
                border:`1px solid ${period===p?C.purple:C.border}`,
                background:period===p?C.purple:C.white,
                color:period===p?"#fff":C.textSec,cursor:"pointer",transition:"all .15s"}}>
              Last {p==="month"?"Month":"Year"}
            </button>))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        {[{title:"DSRs",val:"76",label:"Pending Validation",bg:C.orange,isReal:true},
          {title:"Timesheets",val:"—",label:"Pending Validation",bg:"#94a3b8",isReal:false}
        ].map(sec=>(
          <Card key={sec.title} p={0}>
            <div style={{display:"flex"}}>
              <div style={{background:sec.bg,padding:"20px 24px",minWidth:140,display:"flex",
                flexDirection:"column",alignItems:"center",justifyContent:"center",
                borderRadius:"10px 0 0 10px"}}>
                <div style={{fontSize:52,fontWeight:800,color:"#fff",lineHeight:1}}>{sec.val}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.85)",marginTop:5,fontWeight:600,textAlign:"center"}}>{sec.label}</div>
              </div>
              <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                <MetricCard val={sec.isReal?"0.3":"—"} label="Days to Validate (All)" color={sec.isReal?C.blue:undefined}/>
                <MetricCard val={sec.isReal?"0.4":"—"} label="Days to Validate (Me)" color={sec.isReal?C.blue:undefined}/>
                <MetricCard val={sec.isReal?"0.2":"—"} label="% Reports Rejected"/>
                <MetricCard val={sec.isReal?"4.4":"—"} label="Days to Submit"/>
              </div>
            </div>
          </Card>))}
      </div>
      <Card mb={16}>
        <SH title="Off-Target KPIs"/>
        <div style={{marginBottom:10}}><SearchBar value="" onChange={()=>{}}/></div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="Client"/><Th ch="Contract"/><Th ch="KPI"/>
            <Th ch="Actual"/><Th ch="Target"/><Th ch="Difference"/>
          </tr></thead>
          <tbody>
            {kpiItems.map((r,i)=>(
              <tr key={i} style={{transition:"background .1s"}}>
                <Td ch={<span style={{color:C.blue,fontWeight:600,cursor:"pointer"}}>{r.client}</span>}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.contract}</span>}/>
                <Td ch={r.kpi}/>
                <Td ch={<span style={{color:C.red,fontWeight:700}}>↓ {r.actual.toFixed(2)} m</span>}/>
                <Td ch={<span style={{color:C.textSec,fontWeight:600}}>{r.target.toFixed(2)} m</span>}/>
                <Td ch={<span style={{color:C.red,fontWeight:600}}>{r.diff.toFixed(2)} m</span>}/>
              </tr>))}
          </tbody>
        </table>
        <Pager page={kpiPage} setPage={setKpiPage} per={10} total={kpiTotal}/>
      </Card>
      <Card>
        <SH title="Flags"/>
        <div style={{marginBottom:10}}><SearchBar value="" onChange={()=>{}}/></div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><Th ch="Record Type"/><Th ch="Name"/><Th ch="Flag"/></tr></thead>
          <tbody>
            {flagItems.map((r,i)=>(
              <tr key={i}>
                <Td ch={<span style={{background:"#fef3c7",color:"#92400e",padding:"2px 8px",
                  borderRadius:4,fontSize:11,fontWeight:600}}>{r.type}</span>}/>
                <Td ch={<span style={{color:C.blue,fontWeight:600,cursor:"pointer"}}>{r.name}</span>}/>
                <Td ch={r.flag}/>
              </tr>))}
          </tbody>
        </table>
        <Pager page={flagPage} setPage={setFlagPage} per={10} total={flagTotal}/>
      </Card>
    </div>);
};

// ── DSR LIST (Supabase) ───────────────────────────────────────────────────────
const DSRPage=({nav})=>{
  const [dsrs,setDsrs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all");
  const [fDrill,setFDrill]=useState("all"),[page,setPage]=useState(1),[toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  const fetchDsrs=useCallback(async()=>{
    setLoading(true);
    const {data,error}=await supabase.from('daily_shift_reports')
      .select('*, drills(name), contracts(name), projects(name), clients(name)')
      .order('report_date',{ascending:false});
    if(error)doToast("Hata: "+error.message);
    else setDsrs(data||[]);
    setLoading(false);
  },[]);

  useEffect(()=>{fetchDsrs();},[fetchDsrs]);

  const drillNames=useMemo(()=>[...new Set(dsrs.map(r=>r.drills?.name).filter(Boolean))],[dsrs]);
  const filtered=useMemo(()=>dsrs.filter(r=>{
    const okS=fStatus==="all"||r.status===fStatus;
    const okD=fDrill==="all"||(r.drills?.name===fDrill);
    const okQ=!q||r.drills?.name?.toLowerCase().includes(q.toLowerCase())||r.projects?.name?.toLowerCase().includes(q.toLowerCase());
    return okS&&okD&&okQ;
  }),[dsrs,fStatus,fDrill,q]);
  const {items,total}=pg(filtered,page,10);

  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Daily Shift Report"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Status" opts={["PENDING APPROVAL","APPROVED","VALIDATED","REJECTED"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}} w={160}/>
        <FSel label="Drill Name" opts={drillNames} val={fDrill} onChange={v=>{setFDrill(v);setPage(1);}} w={120}/>
        <Btn ch="Reset" onClick={()=>{setQ("");setFStatus("all");setFDrill("all");setPage(1);}} sm/>
        <div style={{marginLeft:"auto"}}><Btn ch="Bulk Export" sm icon={Ic.dl}/></div>
      </div>
      <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{fontSize:12,color:C.textMut}}>{loading?"Loading...":total+" entries"}</span>
      </div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={{width:36,padding:"10px 14px",background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}><input type="checkbox"/></th>
            <Th ch="Shift"/><Th ch="Report Date"/><Th ch="Status"/><Th ch="Drill"/>
            <Th ch="Contract"/><Th ch="Project"/><Th ch="Client"/><Th ch="Distance"/>
            <th style={{width:40,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={10} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id} style={{cursor:"pointer"}}
                onClick={()=>nav("dsr-summary",{id:r.id,drill:r.drills?.name||"—",date:r.report_date})}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background=""}>
                <Td ch={<input type="checkbox" onClick={e=>e.stopPropagation()}/>}/>
                <Td ch={<span style={{background:r.shift==="DAY"?"#fef9c3":"#dbeafe",color:r.shift==="DAY"?"#713f12":"#1e40af",padding:"3px 10px",borderRadius:12,fontSize:11,fontWeight:700}}>{r.shift}</span>}/>
                <Td ch={<span style={{fontWeight:500}}>{r.report_date}</span>}/>
                <Td ch={<Badge s={r.status}/>}/>
                <Td ch={<span style={{color:C.blue,fontWeight:700}}>{r.drills?.name||"—"}</span>}/>
                <Td ch={<span style={{color:C.blue,fontSize:12}}>{r.contracts?.name||"—"}</span>}/>
                <Td ch={<span style={{color:C.blue}}>{r.projects?.name||"—"}</span>}/>
                <Td ch={r.clients?.name||"—"}/>
                <Td ch={r.total_distance_drilled||0}/>
                <Td ch={<IBtn icon={Ic.dl} color={C.textMut} onClick={e=>e.stopPropagation()}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <Pager page={page} setPage={setPage} per={10} total={total}/>
    </div>);
};

// ── DSR SUMMARY ───────────────────────────────────────────────────────────────
const DSRSummaryPage=({nav,params})=>{
  const drill=params?.drill||"BT-15";
  const actData=[
    {name:"Drilling",day:0,night:15.0},
    {name:"Standby",day:9.0,night:0.5},
    {name:"Hole Cond.",day:1.0,night:0},
    {name:"Safety",day:0.5,night:0},
  ];
  const shifts=[
    {id:"DAY",time:"06:30 – 18:30",dur:"12 hours",sup:"MUHAMMAD FAROOQ, DANISH FAROOQ",driller:"ELGAILI MAHDI ALL MAHDI"},
    {id:"NIGHT",time:"18:30 – 06:30",dur:"12 hours",sup:"MUHAMMAD FAROOQ, DANISH FAROOQ",driller:"DAFALLA ELIMAM MUSTAFA, FATH"},
  ];
  return(
    <div>
      <Crumb items={[{label:"Home",page:"home"},{label:"Daily Shift Report",page:"dsr"},{label:`${drill} · 2026-05-22`}]} nav={nav}/>
      <div style={{display:"grid",gridTemplateColumns:"420px 1fr",gap:16}}>
        <div>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:17,fontWeight:700,color:C.textPri}}>2026-05-22</div>
                <div style={{fontSize:13,color:C.textMut,marginTop:2}}>⚙ <strong style={{color:C.textSec}}>{drill}</strong></div>
              </div>
              <Badge s="APPROVED"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"5px 14px",fontSize:13}}>
              <span style={{color:C.textMut,fontWeight:500}}>Contract</span><span>BM-NM Drilling Program 2024-2026 DD</span>
              <span style={{color:C.textMut,fontWeight:500}}>Project</span><span style={{color:C.blue,fontWeight:600}}>MM Cluster</span>
              <span style={{color:C.textMut,fontWeight:500}}>Client</span><span>Maaden BMNM</span>
              <span style={{color:C.textMut,fontWeight:500}}>Hole(s)</span><span style={{color:C.blue,fontWeight:600}}>UQ_GT26_004_R1</span>
            </div>
            <div style={{marginTop:10,fontSize:13,fontWeight:500}}>Expected Shifts <strong>2</strong></div>
          </Card>
          {shifts.map(s=>(
            <Card key={s.id} p={14} mb={10} style={{borderLeft:`3px solid ${s.id==="DAY"?C.orange:C.blue}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontWeight:800,fontSize:14,
                    color:s.id==="DAY"?"#92400e":"#1e40af"}}>{s.id}</span>
                  <span style={{fontSize:12,color:C.textMut}}>{s.time} <em>({s.dur})</em></span>
                </div>
                <Badge s="APPROVED" sm/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 10px",fontSize:12}}>
                <span style={{color:C.textMut,fontWeight:500}}>Supervisor</span><span>{s.sup}</span>
                <span style={{color:C.textMut,fontWeight:500}}>Driller</span>
                <span style={{color:C.orange,fontWeight:600}}>{s.driller}</span>
              </div>
              <div style={{marginTop:10,display:"flex",gap:14,fontSize:12}}>
                <span style={{color:C.textMut,textDecoration:"underline",cursor:"pointer"}}>See Status History</span>
                <span style={{color:C.blue,fontWeight:600,cursor:"pointer"}}
                  onClick={()=>nav("shift-detail",{shift:s.id,drill})}>
                  Go to Shift Details →</span>
              </div>
            </Card>))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textMut,marginTop:6}}>
            <span style={{cursor:"pointer"}}>‹ Prev DSR<br/><span style={{color:C.blue,fontWeight:600}}>2026-05-21</span></span>
            <span style={{textAlign:"right",cursor:"pointer"}}>Next DSR<br/><span style={{color:C.blue,fontWeight:600}}>2026-05-23</span> ›</span>
          </div>
        </div>
        <div>
          <Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
              {[["72","Total Man Hours"],["24","Total Activity Hours"],["15.00 m","Total Distance"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center",padding:"8px 0"}}>
                  <div style={{fontSize:30,fontWeight:800,color:C.textPri}}>{v}</div>
                  <div style={{fontSize:11,color:C.textMut,fontWeight:500,marginTop:3}}>{l}</div>
                </div>))}
            </div>
          </Card>
          <Card>
            <SH title="Comments & Attachments"/>
            {["DAY","NIGHT"].map(s=>(
              <div key={s} style={{fontSize:12,color:"#94a3b8",marginBottom:5,display:"flex",gap:8}}>
                <span style={{fontWeight:600,color:C.textMut}}>✏ {s}</span>
                <span>no comments or attachments entered for this shift</span>
              </div>))}
          </Card>
          <Card>
            <SH title="Activities Breakdown"/>
            <div style={{display:"flex",gap:14,fontSize:11,marginBottom:10,flexWrap:"wrap"}}>
              {[["#fde68a","Day (non-billable)"],[C.teal,"Night"]].map(([col,label])=>(
                <span key={label} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:10,height:10,background:col,borderRadius:3,flexShrink:0}}/>
                  <span style={{color:C.textMut}}>{label}</span>
                </span>))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={actData} layout="vertical" margin={{left:90,right:20,top:0,bottom:20}}>
                <XAxis type="number" tick={{fontSize:10,fill:C.textMut}} tickLine={false} axisLine={false}
                  label={{value:"Hours",position:"insideBottom",offset:-12,fontSize:10,fill:C.textMut}}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:C.textSec}} width={88} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{fontSize:11,borderRadius:6,border:`1px solid ${C.border}`}}/>
                <Bar dataKey="day" name="Day" stackId="a" fill="#fde68a"/>
                <Bar dataKey="night" name="Night" stackId="a" fill={C.teal} radius={[0,4,4,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <SH title="Activities Sequence"/>
            <div style={{display:"flex",gap:10,fontSize:10,marginBottom:8,flexWrap:"wrap"}}>
              {[["#fde68a","Safety"],["#f59e0b","Hole Cond."],[C.orange,"Standby"],[C.teal,"Drilling"]].map(([col,l])=>(
                <span key={l} style={{display:"flex",alignItems:"center",gap:3}}>
                  <span style={{width:10,height:10,background:col,borderRadius:2,flexShrink:0}}/>
                  <span style={{color:C.textMut}}>{l}</span>
                </span>))}
            </div>
            <div style={{position:"relative",height:44,background:"#f1f5f9",borderRadius:6,overflow:"hidden"}}>
              <div style={{position:"absolute",left:"0",top:5,bottom:5,width:"4%",background:"#fde68a",borderRadius:2}}/>
              <div style={{position:"absolute",left:"4%",top:5,bottom:5,width:"4%",background:"#f59e0b",borderRadius:2}}/>
              <div style={{position:"absolute",left:"8%",top:5,bottom:5,width:"43%",background:C.orange,opacity:.7}}/>
              <div style={{position:"absolute",left:"50%",top:5,bottom:5,width:"42%",background:C.teal,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:10,fontWeight:700,color:"#fff"}}>15.00 m</span>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#94a3b8",marginTop:5}}>
              <span>6:30 AM</span><span>6:30 PM</span><span>6:30 AM</span>
            </div>
          </Card>
        </div>
      </div>
    </div>);
};

// ── SHIFT DETAIL ──────────────────────────────────────────────────────────────
const ShiftDetailPage=({nav,params})=>{
  const shift=params?.shift||"DAY";
  const drill=params?.drill||"BT-15";
  const [expanded,setExpanded]=useState([0,2]);
  const toggle=i=>setExpanded(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
  const activities=[
    {code:"UQ_GT26_004_R1",cat:"Safety",name:"Safety Meeting/Training",time:"06:30–07:00",dur:"0 hrs 30 min",actHrs:"0 hrs 30 min",bill:"Non-Billable"},
    {code:"UQ_GT26_004_R1",cat:"Safety",name:"Pre-start Inspection",time:"07:00–07:30",dur:"0 hrs 30 min",actHrs:"0 hrs 30 min",bill:"Non-Billable"},
    {code:"UQ_GT26_004_R1",cat:"Hole Conditioning",name:"Condition Hole/Mix Mud",time:"07:30–08:30",dur:"1 hour",actHrs:"1 hrs 0 min",bill:"Non-Billable"},
    {code:"UQ_GT26_004_R1",cat:"Standby - Contractor",name:"Waiting for Tool/Equipment/Survey",time:"08:30–17:30",dur:"9 hours",actHrs:"9 hrs 0 min",bill:"Non-Billable"},
    {code:"UQ_GT26_004_R1",cat:"Standby - Contractor",name:"Lunch and dinner break",time:"17:30–18:30",dur:"1 hour",actHrs:"1 hrs 0 min",bill:"Non-Billable"},
  ];
  const workers=[
    {name:"AHMAD MUHAMMAD, BILAL",role:"Helper",start:"2026-05-22 06:30",end:"2026-05-22 18:30",pay:12,man:12,bill:"Non-Billable"},
    {name:"ELGAILI MAHDI ALL MAHDI",role:"Driller",start:"2026-05-22 06:30",end:"2026-05-22 18:30",pay:12,man:12,bill:"Non-Billable"},
    {name:"HUSSAIN SHAH, AYAZ",role:"Helper",start:"2026-05-22 06:30",end:"2026-05-22 18:30",pay:12,man:12,bill:"Non-Billable"},
  ];
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
        <Btn ch="Back to Summary" icon={Ic.chL} sm onClick={()=>nav("dsr-summary",{drill,date:"2026-05-22"})}/>
      </div>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <span style={{fontWeight:800,fontSize:15,color:shift==="DAY"?"#92400e":"#1e40af",
                background:shift==="DAY"?"#fef9c3":"#dbeafe",padding:"2px 10px",borderRadius:6}}>{shift}</span>
              <span style={{fontSize:13,color:C.textMut}}>{shift==="DAY"?"06:30 – 18:30":"18:30 – 06:30"} · 12 hours</span>
              <Badge s="APPROVED"/>
            </div>
            <div style={{fontSize:11,color:"#94a3b8"}}>Validated by: Validation, Data &nbsp;·&nbsp; Approved by: Kamal, Sami</div>
          </div>
          <div style={{display:"flex",gap:8,fontSize:11,color:C.textMut}}>
            <span style={{cursor:"pointer"}}>‹ 2026-05-21</span>
            <span style={{cursor:"pointer"}}>2026-05-23 ›</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:15,fontWeight:700}}>2026-05-22</span><Badge s="APPROVED" sm/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"5px 12px",fontSize:13}}>
              <span style={{color:C.textMut,fontWeight:500}}>Drill</span><span style={{fontWeight:700}}>{drill}</span>
              <span style={{color:C.textMut,fontWeight:500}}>Contract</span><span>BM-NM Drilling Program 2024-2026 DD</span>
              <span style={{color:C.textMut,fontWeight:500}}>Project</span><span>MM Cluster</span>
              <span style={{color:C.textMut,fontWeight:500}}>Client</span><span>Maaden BMNM</span>
              <span style={{color:C.textMut,fontWeight:500}}>Supervisor</span><span>MUHAMMAD FAROOQ, DANISH FAROOQ</span>
              <span style={{color:C.textMut,fontWeight:500}}>Driller</span><span>ELGAILI MAHDI ALL MAHDI</span>
            </div>
          </div>
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
              {[["36","Man Hours"],["12","Activity Hours"],["0.00","Distance (m)"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center",background:"#f8fafc",borderRadius:8,padding:"10px 6px"}}>
                  <div style={{fontSize:22,fontWeight:800,color:C.textPri}}>{v}</div>
                  <div style={{fontSize:10,color:C.textMut,fontWeight:500,marginTop:2}}>{l}</div>
                </div>))}
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <SH title="Status History"/>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><Th ch="Date/Time"/><Th ch="Name"/><Th ch="Status"/><Th ch="Comments"/></tr></thead>
          <tbody>
            {[{dt:"2026-05-23 06:55",name:"Kamal, Sami",s:"Approved"},
              {dt:"2026-05-23 05:17",name:"Validation, Data",s:"Validated"}].map((r,i)=>(
              <tr key={i}><Td ch={r.dt}/><Td ch={r.name}/><Td ch={r.s}/><Td ch="—"/></tr>))}
          </tbody>
        </table>
      </Card>
      <Card>
        <SH title="Workers"/>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={{width:36,padding:"10px 14px",background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
            <Th ch="Worker"/><Th ch="Role"/><Th ch="Start"/><Th ch="End"/>
            <Th ch="Payroll Hrs"/><Th ch="Man Hrs"/><Th ch="Billable"/>
          </tr></thead>
          <tbody>
            {workers.map((w,i)=>(
              <tr key={i}>
                <Td ch={<input type="checkbox"/>}/>
                <Td ch={<span style={{fontWeight:600}}>{w.name}</span>}/>
                <Td ch={w.role}/><Td ch={w.start}/><Td ch={w.end}/>
                <Td ch={w.pay}/><Td ch={w.man}/>
                <Td ch={<span style={{fontSize:11,color:C.textMut}}>{w.bill}</span>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <Card>
        <SH title="Activities"/>
        {activities.map((a,i)=>(
          <div key={i} style={{border:`1px solid ${C.border}`,borderRadius:8,marginBottom:8,overflow:"hidden"}}>
            <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",
              alignItems:"center",cursor:"pointer",background:"#f8fafc",
              borderBottom:expanded.includes(i)?`1px solid ${C.border}`:"none"}}
              onClick={()=>toggle(i)}>
              <div>
                <span style={{fontSize:11,color:C.blue,fontWeight:700,marginRight:8}}>{a.code}</span>
                <span style={{fontSize:12,color:C.textMut,marginRight:8}}>{a.cat}</span>
                <span style={{fontSize:13,fontWeight:600,color:C.textPri}}>{a.name}</span>
                <span style={{fontSize:11,background:"#e0f2fe",color:"#0369a1",
                  padding:"1px 8px",borderRadius:10,marginLeft:8}}>{a.time} · {a.dur}</span>
              </div>
              <span>{expanded.includes(i)?Ic.chD:Ic.chR}</span>
            </div>
            {expanded.includes(i)&&(
              <div style={{padding:"10px 14px"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>
                    <Th ch="Activity Hours"/><Th ch="Billable Selection"/><Th ch="Billable"/>
                  </tr></thead>
                  <tbody><tr><Td ch={a.actHrs}/><Td ch="Per Contract"/><Td ch={a.bill}/></tr></tbody>
                </table>
              </div>)}
          </div>))}
      </Card>
      {[{t:"Equipment",cols:["Hole","Equipment","Quantity","Hours","Billable"]},
        {t:"Consumables",cols:["Hole","Category","Consumable","Quantity","Billable"]},
        {t:"Fluids",cols:["Fluid","Fluid Type","Volume","Cost/Unit"]},
        {t:"Additional Charges",cols:["Hole","Description","Category","Quantity","Rate"]},
        {t:"Submitted Forms",cols:["File Name","Form","Worker","Notes"]},
      ].map(sec=>(
        <Card key={sec.t}>
          <SH title={sec.t}/>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{sec.cols.map(c=><Th key={c} ch={c}/>)}</tr></thead>
            <tbody><NoRows cols={sec.cols.length}/></tbody>
          </table>
        </Card>))}
    </div>);
};

// ── TIMESHEET ─────────────────────────────────────────────────────────────────
const TimesheetPage=({nav})=>{
  const [page,setPage]=useState(1);
  const rows=[
    {id:1,period:"2026-05-01 / 2026-05-15",status:"APPROVED",drill:"BT-15",supervisor:"MUHAMMAD FAROOQ",totalHrs:360,billable:360},
    {id:2,period:"2026-05-16 / 2026-05-31",status:"PENDING APPROVAL",drill:"BT-15",supervisor:"MUHAMMAD FAROOQ",totalHrs:288,billable:288},
    {id:3,period:"2026-05-01 / 2026-05-15",status:"VALIDATED",drill:"BT-10",supervisor:"DANISH FAROOQ",totalHrs:336,billable:300},
  ];
  const {items,total}=pg(rows,page,10);
  return(
    <div>
      <Crumb items={[{label:"Home",page:"home"},{label:"Timesheet"}]} nav={nav}/>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={{width:36,padding:"10px 14px",background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}><input type="checkbox"/></th>
            <Th ch="Period"/><Th ch="Status"/><Th ch="Drill"/><Th ch="Supervisor"/>
            <Th ch="Total Hours"/><Th ch="Billable Hours"/>
          </tr></thead>
          <tbody>
            {items.map(r=>(
              <tr key={r.id}>
                <Td ch={<input type="checkbox"/>}/>
                <Td ch={<span style={{fontWeight:500}}>{r.period}</span>}/>
                <Td ch={<Badge s={r.status}/>}/>
                <Td ch={<span style={{color:C.blue,fontWeight:700}}>{r.drill}</span>}/>
                <Td ch={r.supervisor}/>
                <Td ch={<strong>{r.totalHrs}</strong>}/>
                <Td ch={r.billable}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <Pager page={page} setPage={setPage} per={10} total={total}/>
    </div>);
};


// ── PROJECT MODAL ─────────────────────────────────────────────────────────────
const ProjectModal=({open,onClose,onSaved,initialData,clients,contracts})=>{
  const [name,setName]=useState("");
  const [status,setStatus]=useState("Active");
  const [clientId,setClientId]=useState("");
  const [contractId,setContractId]=useState("");
  const [location,setLocation]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(open){
      setName(initialData?.name||"");setStatus(initialData?.status||"Active");
      setClientId(initialData?.client_id||"");setContractId(initialData?.contract_id||"");
      setLocation(initialData?.location||"");setError("");
    }
  },[open,initialData]);
  const handleSave=async()=>{
    if(!name.trim()){setError("Project name zorunlu!");return;}
    setSaving(true);
    const payload={name:name.trim(),status,client_id:clientId||null,contract_id:contractId||null,location:location||null};
    const r=initialData?.id
      ?await supabase.from('projects').update(payload).eq('id',initialData.id)
      :await supabase.from('projects').insert(payload);
    setSaving(false);
    if(r.error){setError(r.error.message);return;}
    onSaved();onClose();
  };
  if(!open)return null;
  const inpStyle={width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"};
  const lblStyle={display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5};
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:500,boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Project":"Add Project"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:14}}>{error}</div>}
        <div style={{marginBottom:14}}><label style={lblStyle}>Project Name *</label><input value={name} onChange={e=>setName(e.target.value)} style={inpStyle} placeholder="e.g. MM Cluster"/></div>
        <div style={{marginBottom:14}}><label style={lblStyle}>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{...inpStyle,appearance:"none"}}>
            <option>Active</option><option>InActive</option>
          </select></div>
        <div style={{marginBottom:14}}><label style={lblStyle}>Client</label>
          <select value={clientId} onChange={e=>setClientId(e.target.value)} style={{...inpStyle,appearance:"none"}}>
            <option value="">Select client...</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select></div>
        <div style={{marginBottom:14}}><label style={lblStyle}>Contract</label>
          <select value={contractId} onChange={e=>setContractId(e.target.value)} style={{...inpStyle,appearance:"none"}}>
            <option value="">Select contract...</option>
            {contracts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select></div>
        <div style={{marginBottom:20}}><label style={lblStyle}>Location</label><input value={location} onChange={e=>setLocation(e.target.value)} style={inpStyle} placeholder="e.g. MM Area"/></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

// ── PROJECTS (Supabase) ───────────────────────────────────────────────────────
const ProjectsPage=({nav})=>{
  const [projects,setProjects]=useState([]);
  const [clients,setClients]=useState([]);
  const [contracts,setContracts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all");
  const [fClient,setFClient]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  const fetchAll=useCallback(async()=>{
    setLoading(true);
    const [pr,cl,co]=await Promise.all([
      supabase.from('projects').select('*, clients(name), contracts(name)').order('name'),
      supabase.from('clients').select('id,name').order('name'),
      supabase.from('contracts').select('id,name').order('name'),
    ]);
    setProjects(pr.data||[]);setClients(cl.data||[]);setContracts(co.data||[]);
    setLoading(false);
  },[]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const handleDelete=async(r)=>{
    if(!window.confirm(`"${r.name}" silinsin mi?`))return;
    const {error}=await supabase.from('projects').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);
    else{doToast(`✓ ${r.name} silindi`);fetchAll();}
  };

  const handleToggle=async(r)=>{
    const s=r.status==='Active'?'InActive':'Active';
    await supabase.from('projects').update({status:s}).eq('id',r.id);
    doToast(`✓ ${r.name} → ${s}`);fetchAll();
  };

  const clientNames=useMemo(()=>uniq(projects.map(p=>({client:p.clients?.name})),"client").filter(Boolean),[projects]);
  const filtered=useMemo(()=>projects.filter(r=>{
    const okS=fStatus==="all"||r.status===fStatus;
    const okC=fClient==="all"||(r.clients?.name===fClient);
    const okQ=!q||r.name?.toLowerCase().includes(q.toLowerCase())||r.location?.toLowerCase().includes(q.toLowerCase());
    return okS&&okC&&okQ;
  }),[projects,fStatus,fClient,q]);
  const {items,total}=pg(filtered,page,10);

  return(
    <div>
      <Toast msg={toast}/>
      <ProjectModal open={modalOpen} onClose={()=>setModalOpen(false)} onSaved={()=>{fetchAll();doToast("✓ Kaydedildi");}} initialData={editData} clients={clients} contracts={contracts}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Projects"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Status" opts={["Active","InActive"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <FSel label="Client" opts={clientNames} val={fClient} onChange={v=>{setFClient(v);setPage(1);}} w={160}/>
        <Btn ch="Clear" onClick={()=>{setQ("");setFStatus("all");setFClient("all");setPage(1);}} sm/>
      </div>
      <div style={{marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{fontSize:12,color:C.textMut}}>{loading?"Loading...":total+" entries"}</span>
      </div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="Status"/><Th ch="Project Name"/><Th ch="Client"/><Th ch="Contract"/><Th ch="Location"/>
            <th style={{width:110,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={7} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setEditData(r);setModalOpen(true);}}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/></>}/>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<span style={{color:C.blue,fontWeight:700,cursor:"pointer"}} onClick={()=>nav("holes")}>{r.name}</span>}/>
                <Td ch={r.clients?.name||"—"}/>
                <Td ch={<span style={{color:C.blue,fontSize:12}}>{r.contracts?.name||"—"}</span>}/>
                <Td ch={r.location||"—"}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"} variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>⊕ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};

// ── HOLE MODAL ────────────────────────────────────────────────────────────────
const HoleModal=({open,onClose,onSaved,initialData,clients,contracts,projects})=>{
  const [name,setName]=useState("");
  const [status,setStatus]=useState("Active");
  const [clientId,setClientId]=useState("");
  const [contractId,setContractId]=useState("");
  const [projectId,setProjectId]=useState("");
  const [maxDepth,setMaxDepth]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(open){
      setName(initialData?.name||"");setStatus(initialData?.status||"Active");
      setClientId(initialData?.client_id||"");setContractId(initialData?.contract_id||"");
      setProjectId(initialData?.project_id||"");setMaxDepth(initialData?.max_depth||"");setError("");
    }
  },[open,initialData]);
  const handleSave=async()=>{
    if(!name.trim()){setError("ID zorunlu!");return;}
    setSaving(true);
    const payload={name:name.trim(),status,client_id:clientId||null,contract_id:contractId||null,project_id:projectId||null,max_depth:maxDepth||null};
    const r=initialData?.id?await supabase.from('holes').update(payload).eq('id',initialData.id):await supabase.from('holes').insert(payload);
    setSaving(false);
    if(r.error){setError(r.error.message);return;}
    onSaved();onClose();
  };
  if(!open)return null;
  const s={width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"};
  const l={display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5};
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:500,maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Hole":"Add Hole"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:14}}>{error}</div>}
        <div style={{marginBottom:14}}><label style={l}>Hole ID *</label><input value={name} onChange={e=>setName(e.target.value)} style={s} placeholder="e.g. UQ_GT26_004_R1"/></div>
        <div style={{marginBottom:14}}><label style={l}>Status</label><select value={status} onChange={e=>setStatus(e.target.value)} style={{...s,appearance:"none"}}><option>Active</option><option>Complete</option><option>Abandoned</option><option>Planned</option><option>Cancelled</option></select></div>
        <div style={{marginBottom:14}}><label style={l}>Client</label><select value={clientId} onChange={e=>setClientId(e.target.value)} style={{...s,appearance:"none"}}><option value="">Select...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div style={{marginBottom:14}}><label style={l}>Contract</label><select value={contractId} onChange={e=>setContractId(e.target.value)} style={{...s,appearance:"none"}}><option value="">Select...</option>{contracts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div style={{marginBottom:14}}><label style={l}>Project</label><select value={projectId} onChange={e=>setProjectId(e.target.value)} style={{...s,appearance:"none"}}><option value="">Select...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <div style={{marginBottom:20}}><label style={l}>Max Depth (m)</label><input type="number" value={maxDepth} onChange={e=>setMaxDepth(e.target.value)} style={s} placeholder="e.g. 204"/></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

// ── HOLES (Supabase) ──────────────────────────────────────────────────────────
const HolesPage=({nav})=>{
  const [holes,setHoles]=useState([]);
  const [clients,setClients]=useState([]);
  const [contracts,setContracts]=useState([]);
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  const fetchAll=useCallback(async()=>{
    setLoading(true);
    const [h,cl,co,pr]=await Promise.all([
      supabase.from('holes').select('*, clients(name), contracts(name), projects(name)').order('name'),
      supabase.from('clients').select('id,name').order('name'),
      supabase.from('contracts').select('id,name').order('name'),
      supabase.from('projects').select('id,name').order('name'),
    ]);
    setHoles(h.data||[]);setClients(cl.data||[]);setContracts(co.data||[]);setProjects(pr.data||[]);
    setLoading(false);
  },[]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const handleDelete=async(r)=>{
    if(!window.confirm(`"${r.name}" silinsin mi?`))return;
    const {error}=await supabase.from('holes').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);
    else{doToast(`✓ ${r.name} silindi`);fetchAll();}
  };

  const handleToggle=async(r)=>{
    const s=r.status==='Active'?'Complete':'Active';
    await supabase.from('holes').update({status:s}).eq('id',r.id);
    doToast(`✓ ${r.name} → ${s}`);fetchAll();
  };

  const filtered=useMemo(()=>holes.filter(r=>{
    const okS=fStatus==="all"||r.status===fStatus;
    const okQ=!q||r.name?.toLowerCase().includes(q.toLowerCase());
    return okS&&okQ;
  }),[holes,fStatus,q]);
  const {items,total}=pg(filtered,page,10);

  return(
    <div>
      <Toast msg={toast}/>
      <HoleModal open={modalOpen} onClose={()=>setModalOpen(false)} onSaved={()=>{fetchAll();doToast("✓ Kaydedildi");}} initialData={editData} clients={clients} contracts={contracts} projects={projects}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Holes"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Status" opts={["Active","Complete","Abandoned","Planned","Cancelled"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <Btn ch="Clear" onClick={()=>{setQ("");setFStatus("all");setPage(1);}} sm/>
      </div>
      <div style={{marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}} placeholder="Search holes..."/>
        <span style={{fontSize:12,color:C.textMut}}>{loading?"Loading...":total+" entries"}</span>
      </div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="Status"/><Th ch="ID"/>
            <Th ch="Client"/><Th ch="Contract"/><Th ch="Project"/>
            <Th ch="Max Depth"/><Th ch="Last Activity"/>
            <th style={{width:110,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={9} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setEditData(r);setModalOpen(true);}}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/></>}/>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<span style={{color:C.blue,fontWeight:700,cursor:"pointer"}} onClick={()=>nav("hole-detail",{hole:r.name})}>{r.name}</span>}/>
                <Td ch={r.clients?.name||"—"}/>
                <Td ch={<span style={{color:C.blue,fontSize:12}}>{r.contracts?.name||"—"}</span>}/>
                <Td ch={r.projects?.name||"—"}/>
                <Td ch={r.max_depth?`${r.max_depth} m`:"—"}/>
                <Td ch={r.last_activity_date||"—"}/>
                <Td ch={<Btn ch={r.status==="Active"?"Complete":"Reactivate"} variant={r.status==="Active"?"teal":"gray"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>⊕ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <Btn ch="Import Holes" sm icon={Ic.ul}/>
        <Btn ch="Export Holes" sm icon={Ic.dl}/>
      </div>
    </div>);
};

// ── HOLE DETAIL ───────────────────────────────────────────────────────────────
const HoleDetailPage=({nav,params})=>{
  const holeName=params?.hole||"AA25-001";
  const [tab,setTab]=useState("drilling");
  const drillingRecs=[
    {drill:"UG-04",date:"2025-02-27",type:"DD",bit:"NQ Diamond Core Bit",from:"0 m",to:"35.6 m",dist:"35.6 m",rate:"2.97 m"},
    {drill:"UG-04",date:"2025-02-28",type:"DD",bit:"NQ Diamond Core Bit",from:"35.6 m",to:"71.35 m",dist:"35.75 m",rate:"2.23 m"},
    {drill:"UG-04",date:"2025-03-01",type:"DD",bit:"NQ Diamond Core Bit",from:"71.35 m",to:"115.05 m",dist:"43.7 m",rate:"3.12 m"},
    {drill:"UG-04",date:"2025-03-02",type:"DD",bit:"NQ Diamond Core Bit",from:"115.05 m",to:"147.6 m",dist:"32.55 m",rate:"2.96 m"},
    {drill:"UG-04",date:"2025-03-03",type:"DD",bit:"NQ Diamond Core Bit",from:"147.6 m",to:"180.95 m",dist:"33.35 m",rate:"2.57 m"},
  ];
  const Tab=({k,label})=>(
    <button onClick={()=>setTab(k)}
      style={{padding:"9px 20px",fontSize:13,fontWeight:tab===k?700:500,cursor:"pointer",
        background:"none",border:"none",borderBottom:tab===k?`2px solid ${C.blue}`:"2px solid transparent",
        color:tab===k?C.blue:C.textMut,transition:"all .15s"}}>
      {label}
    </button>);
  return(
    <div>
      <Crumb items={[{label:"Home",page:"home"},{label:"Holes",page:"holes"},{label:holeName}]} nav={nav}/>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:14}}>
          <IBtn icon={Ic.edit} color={C.teal}/>
          <IBtn icon={Ic.trash} color={C.red}/>
          <div style={{background:"#f1f5f9",padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:600,color:C.textMut}}>Complete</div>
          <div><span style={{fontSize:16,fontWeight:800,color:C.textPri}}>{holeName}</span> <span style={{fontSize:11,color:C.textMut}}>Hole</span></div>
          <div><span style={{fontWeight:600}}>Maaden BMNM</span> <span style={{fontSize:11,color:C.textMut}}>Client</span></div>
          <div style={{flex:1}}/>
          <Btn ch="Re-Activate" variant="gray" sm/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,auto)",gap:"6px 28px",fontSize:13}}>
          <span style={{color:C.textMut,fontWeight:500}}>Planned Name</span><strong>{holeName}</strong>
          <span style={{color:C.textMut,fontWeight:500}}>Planned Depth</span><strong>204 m</strong>
          <span style={{color:C.textMut,fontWeight:500}}>Planned Azimuth</span><strong>196.29°</strong>
          <span style={{color:C.textMut,fontWeight:500}}>Planned Dip</span><strong>—</strong>
        </div>
      </Card>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:16}}>
        <Tab k="drilling" label="Drilling"/><Tab k="holepath" label="Hole Path"/><Tab k="charges" label="Charges"/>
      </div>
      {tab==="drilling"&&(
        <Card p={0}>
          <div style={{padding:"14px 14px 0",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:700,color:C.textPri}}>Drilling Records</span>
            <span style={{fontSize:12,color:C.textMut}}>Showing {drillingRecs.length} entries</span>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <Th ch="Drill"/><Th ch="Date"/><Th ch="Type"/><Th ch="Bit Size and Type"/>
              <Th ch="From"/><Th ch="To"/><Th ch="Distance"/><Th ch="Penetration Rate"/>
            </tr></thead>
            <tbody>
              {drillingRecs.map((r,i)=>(
                <tr key={i}>
                  <Td ch={<strong>{r.drill}</strong>}/><Td ch={r.date}/><Td ch={r.type}/>
                  <Td ch={r.bit}/><Td ch={r.from}/><Td ch={r.to}/>
                  <Td ch={<strong>{r.dist}</strong>}/><Td ch={r.rate}/>
                </tr>))}
            </tbody>
          </table>
        </Card>)}
      {tab==="holepath"&&(
        <Card><div style={{textAlign:"center",padding:24,color:C.textMut}}>No survey data available.</div></Card>)}
      {tab==="charges"&&(
        <Card><div style={{textAlign:"center",padding:24,color:C.textMut}}>No charges recorded.</div></Card>)}
    </div>);
};

// ── DRILL MODAL (standalone — kendi state'i var, focus sorunu olmaz) ──────────
const DrillModal=({open,onClose,onSaved,initialData})=>{
  const [name,setName]=useState("");
  const [type,setType]=useState("");
  const [make,setMake]=useState("");
  const [model,setModel]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{
    if(open){
      setName(initialData?.name||"");
      setType(initialData?.drill_type||"");
      setMake(initialData?.make||"");
      setModel(initialData?.model||"");
      setError("");
    }
  },[open,initialData]);

  const handleSave=async()=>{
    if(!name.trim()){setError("ID zorunlu!");return;}
    setSaving(true);
    let err;
    if(initialData?.id){
      const r=await supabase.from('drills').update({
        name:name.trim(),drill_type:type||null,make:make||null,model:model||null
      }).eq('id',initialData.id);
      err=r.error;
    } else {
      const r=await supabase.from('drills').insert({
        name:name.trim(),drill_type:type||null,make:make||null,model:model||null,status:'Active'
      });
      err=r.error;
    }
    setSaving(false);
    if(err){setError(err.message);return;}
    onSaved();
    onClose();
  };

  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",
      display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(2px)"}}
      onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:480,
        boxShadow:"0 24px 48px rgba(15,23,42,.2)",border:"1px solid #e2e8f0"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>
            {initialData?.id?"Edit Drilling Rig":"Add Drilling Rig"}
          </strong>
          <button onClick={onClose}
            style={{background:"#f1f5f9",border:"none",cursor:"pointer",
              width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",
          borderRadius:6,fontSize:12,marginBottom:14,border:"1px solid #fecdd3"}}>{error}</div>}
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#334155",
            marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>ID *</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. BT-25"
            style={{width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",
              borderRadius:7,boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#334155",
            marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Type</label>
          <select value={type} onChange={e=>setType(e.target.value)}
            style={{width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",
              borderRadius:7,boxSizing:"border-box",appearance:"none"}}>
            <option value="">Select...</option>
            <option>Surface - Coring</option>
            <option>Underground - Coring</option>
            <option>Reverse Circulation</option>
          </select>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#334155",
            marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Brand</label>
          <input value={make} onChange={e=>setMake(e.target.value)} placeholder="e.g. Boretech"
            style={{width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",
              borderRadius:7,boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#334155",
            marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Made By</label>
          <input value={model} onChange={e=>setModel(e.target.value)} placeholder="e.g. BT2500"
            style={{width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",
              borderRadius:7,boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose}
            style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",
              color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",
              color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>
            {saving?"Saving...":"Save"}
          </button>
        </div>
      </div>
    </div>);
};

// ── DRILLING RIGS (Supabase connected) ───────────────────────────────────────
const DrillsPage=({nav})=>{
  const [drills,setDrills]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all");
  const [fType,setFType]=useState("all"),[fMake,setFMake]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false);
  const [editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  const fetchDrills=useCallback(async()=>{
    setLoading(true);
    const {data,error}=await supabase.from('drills').select('*').order('name');
    if(error)doToast("Hata: "+error.message);
    else setDrills(data||[]);
    setLoading(false);
  },[]);

  useEffect(()=>{fetchDrills();},[fetchDrills]);

  const handleDelete=async(r)=>{
    if(!window.confirm(`"${r.name}" silinsin mi?`))return;
    const {error}=await supabase.from('drills').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);
    else{doToast(`✓ ${r.name} silindi`);fetchDrills();}
  };

  const handleToggle=async(r)=>{
    const newStatus=r.status==='Active'?'InActive':'Active';
    const {error}=await supabase.from('drills').update({status:newStatus}).eq('id',r.id);
    if(error)doToast("Hata: "+error.message);
    else{doToast(`✓ ${r.name} → ${newStatus}`);fetchDrills();}
  };

  const openAdd=()=>{setEditData(null);setModalOpen(true);};
  const openEdit=(r)=>{setEditData(r);setModalOpen(true);};
  const onSaved=()=>{doToast("✓ Kaydedildi");fetchDrills();};

  const reset=()=>{setQ("");setFStatus("all");setFType("all");setFMake("all");setPage(1);};
  const filtered=useMemo(()=>filt(drills,{status:fStatus,drill_type:fType,make:fMake},["name","drill_type","make","model"],q),[drills,q,fStatus,fType,fMake]);
  const {items,total}=pg(filtered,page,10);
  const brands=useMemo(()=>uniq(drills,"make").filter(Boolean),[drills]);

  return(
    <div>
      <Toast msg={toast}/>
      <DrillModal open={modalOpen} onClose={()=>setModalOpen(false)} onSaved={onSaved} initialData={editData}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Drilling Rigs"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Status" opts={["Active","InActive"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <FSel label="Type" opts={["Reverse Circulation","Surface - Coring","Underground - Coring"]} val={fType} onChange={v=>{setFType(v);setPage(1);}} w={180}/>
        <FSel label="Brand" opts={brands} val={fMake} onChange={v=>{setFMake(v);setPage(1);}}/>
        <Btn ch="Clear" onClick={reset} sm/>
      </div>
      <div style={{marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{fontSize:12,color:C.textMut}}>{loading?"Loading...":total+" entries"}</span>
      </div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="ID"/><Th ch="Type"/><Th ch="Brand"/><Th ch="Made By"/><Th ch="Status"/>
            <th style={{width:110,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?(
              <tr><td colSpan={7} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            ):items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<>
                  <IBtn icon={Ic.edit} color={C.teal} onClick={()=>openEdit(r)}/>
                  <IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/>
                </>}/>
                <Td ch={<strong>{r.name}</strong>}/>
                <Td ch={r.drill_type||"—"}/>
                <Td ch={r.make||"—"}/>
                <Td ch={r.model||"—"}/>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"}
                  variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={openAdd}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",
            color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>
          ⊕ Add
        </button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};

// ── BIT MODAL ─────────────────────────────────────────────────────────────────
const BitModal=({open,onClose,onSaved,initialData,clients,contracts,projects})=>{
  const [serial,setSerial]=useState("");
  const [status,setStatus]=useState("Active");
  const [model,setModel]=useState("");
  const [bitSize,setBitSize]=useState("");
  const [clientId,setClientId]=useState("");
  const [contractId,setContractId]=useState("");
  const [projectId,setProjectId]=useState("");
  const [totalDist,setTotalDist]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(open){
      setSerial(initialData?.serial_number||"");setStatus(initialData?.status||"Active");
      setModel(initialData?.model||"");setBitSize(initialData?.bit_size||"");
      setClientId(initialData?.client_id||"");setContractId(initialData?.contract_id||"");
      setProjectId(initialData?.project_id||"");setTotalDist(initialData?.total_distance||"");
      setError("");
    }
  },[open,initialData]);
  const handleSave=async()=>{
    if(!serial.trim()){setError("Serial number zorunlu!");return;}
    setSaving(true);
    const payload={
      serial_number:serial.trim(),status,model:model||null,bit_size:bitSize||null,
      client_id:clientId||null,contract_id:contractId||null,project_id:projectId||null,
      total_distance:totalDist?parseFloat(totalDist):0
    };
    const r=initialData?.id
      ?await supabase.from('bits').update(payload).eq('id',initialData.id)
      :await supabase.from('bits').insert(payload);
    setSaving(false);
    if(r.error){setError(r.error.message);return;}
    onSaved();onClose();
  };
  if(!open)return null;
  const s={width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"};
  const l={display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5};
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:500,maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Bit":"Add Bit"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:14}}>{error}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><label style={l}>Serial Number *</label><input value={serial} onChange={e=>setSerial(e.target.value)} style={s} placeholder="e.g. BIT-2024-001"/></div>
          <div><label style={l}>Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={{...s,appearance:"none"}}>
              <option>Active</option><option>Complete-Damaged</option><option>Complete-Worn Flat</option><option>Complete-Left in Hole</option><option>Complete-Worn Inner</option>
            </select></div>
          <div><label style={l}>Model</label><input value={model} onChange={e=>setModel(e.target.value)} style={s} placeholder="e.g. HQ3"/></div>
          <div><label style={l}>Bit Size</label><input value={bitSize} onChange={e=>setBitSize(e.target.value)} style={s} placeholder="e.g. HQ3"/></div>
          <div><label style={l}>Total Distance (m)</label><input type="number" value={totalDist} onChange={e=>setTotalDist(e.target.value)} style={s} placeholder="0"/></div>
        </div>
        <div style={{marginTop:12}}><label style={l}>Client</label>
          <select value={clientId} onChange={e=>setClientId(e.target.value)} style={{...s,appearance:"none"}}>
            <option value="">Select...</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select></div>
        <div style={{marginTop:12}}><label style={l}>Contract</label>
          <select value={contractId} onChange={e=>setContractId(e.target.value)} style={{...s,appearance:"none"}}>
            <option value="">Select...</option>
            {contracts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select></div>
        <div style={{marginTop:12,marginBottom:20}}><label style={l}>Project</label>
          <select value={projectId} onChange={e=>setProjectId(e.target.value)} style={{...s,appearance:"none"}}>
            <option value="">Select...</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

// ── BITS (Supabase) ───────────────────────────────────────────────────────────
const BitsPage=({nav})=>{
  const [bits,setBits]=useState([]);
  const [clients,setClients]=useState([]);
  const [contracts,setContracts]=useState([]);
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all"),[fSize,setFSize]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const fetchAll=useCallback(async()=>{
    setLoading(true);
    const [b,cl,co,pr]=await Promise.all([
      supabase.from('bits').select('*, clients(name), contracts(name), projects(name)').order('serial_number'),
      supabase.from('clients').select('id,name').order('name'),
      supabase.from('contracts').select('id,name').order('name'),
      supabase.from('projects').select('id,name').order('name'),
    ]);
    setBits(b.data||[]);setClients(cl.data||[]);setContracts(co.data||[]);setProjects(pr.data||[]);
    setLoading(false);
  },[]);
  useEffect(()=>{fetchAll();},[fetchAll]);
  const handleDelete=async(r)=>{
    if(!window.confirm(`"${r.serial_number}" silinsin mi?`))return;
    const {error}=await supabase.from('bits').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);else{doToast("✓ Silindi");fetchAll();}
  };
  const handleToggle=async(r)=>{
    const s=r.status==="Active"?"Complete-Damaged":"Active";
    await supabase.from('bits').update({status:s}).eq('id',r.id);
    doToast(`✓ ${r.serial_number} güncellendi`);fetchAll();
  };
  const sizes=useMemo(()=>uniq(bits,"bit_size").filter(Boolean),[bits]);
  const filtered=useMemo(()=>bits.filter(r=>{
    const okS=fStatus==="all"||r.status===fStatus;
    const okSz=fSize==="all"||r.bit_size===fSize;
    const okQ=!q||r.serial_number?.toLowerCase().includes(q.toLowerCase())||r.model?.toLowerCase().includes(q.toLowerCase());
    return okS&&okSz&&okQ;
  }),[bits,fStatus,fSize,q]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <BitModal open={modalOpen} onClose={()=>setModalOpen(false)} onSaved={()=>{fetchAll();doToast("✓ Kaydedildi");}} initialData={editData} clients={clients} contracts={contracts} projects={projects}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Bits"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Status" opts={["Active","Complete-Damaged","Complete-Worn Flat","Complete-Left in Hole","Complete-Worn Inner"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}} w={155}/>
        <FSel label="Size" opts={sizes} val={fSize} onChange={v=>{setFSize(v);setPage(1);}} w={110}/>
        <Btn ch="Clear" onClick={()=>{setQ("");setFStatus("all");setFSize("all");setPage(1);}} sm/>
      </div>
      <div style={{marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{fontSize:12,color:C.textMut}}>{loading?"Loading...":total+" entries"}</span>
      </div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="Status"/><Th ch="Serial #"/><Th ch="Model"/>
            <Th ch="Client"/><Th ch="Contract"/><Th ch="Project"/><Th ch="Size"/><Th ch="Total Distance"/>
            <th style={{width:110,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={10} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setEditData(r);setModalOpen(true);}}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/></>}/>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<strong>{r.serial_number}</strong>}/>
                <Td ch={r.model||"—"}/>
                <Td ch={r.clients?.name||"—"}/>
                <Td ch={<span style={{color:C.blue,fontSize:12}}>{r.contracts?.name||"—"}</span>}/>
                <Td ch={r.projects?.name||"—"}/>
                <Td ch={r.bit_size||"—"}/>
                <Td ch={r.total_distance?`${r.total_distance} m`:"—"}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"} variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>⊕ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:10}}><Btn ch="Import Bits" sm icon={Ic.ul}/></div>
    </div>);
};

// ── CONSUMABLES (Supabase) ────────────────────────────────────────────────────
const ConsumablesPage=({nav})=>{
  const [consumables,setConsumables]=useState([]);
  const [cats,setCats]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fCat,setFCat]=useState("all");
  const [page,setPage]=useState(1),[showCats,setShowCats]=useState(false),[toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const fetchAll=useCallback(async()=>{
    setLoading(true);
    const [c,ca]=await Promise.all([
      supabase.from('consumables').select('*, consumable_categories(name)').order('name'),
      supabase.from('consumable_categories').select('id,name,status').order('name'),
    ]);
    setConsumables(c.data||[]);setCats(ca.data||[]);setLoading(false);
  },[]);
  useEffect(()=>{fetchAll();},[fetchAll]);
  const handleDelete=async(r)=>{
    if(!window.confirm(`"${r.name}" silinsin mi?`))return;
    const {error}=await supabase.from('consumables').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);else{doToast("✓ Silindi");fetchAll();}
  };
  const handleToggle=async(r)=>{
    const s=r.status==="Active"?"InActive":"Active";
    await supabase.from('consumables').update({status:s}).eq('id',r.id);
    doToast(`✓ ${r.name} → ${s}`);fetchAll();
  };
  const catNames=useMemo(()=>cats.map(c=>c.name),[cats]);
  const filtered=useMemo(()=>consumables.filter(r=>{
    const okC=fCat==="all"||(r.consumable_categories?.name===fCat);
    const okQ=!q||r.name?.toLowerCase().includes(q.toLowerCase());
    return okC&&okQ;
  }),[consumables,fCat,q]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Consumables"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Category" opts={catNames} val={fCat} onChange={v=>{setFCat(v);setPage(1);}} w={170}/>
        <Btn ch="Clear" onClick={()=>{setFCat("all");setPage(1);}} sm/>
        <div style={{marginLeft:"auto"}}><Btn ch="Manage Categories" variant="purple" onClick={()=>setShowCats(true)}/></div>
      </div>
      <div style={{marginBottom:10}}><SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/></div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="Consumable"/><Th ch="Category"/>
            <Th ch="Rate"/><Th ch="Rate Type"/><Th ch="Currency"/>
            <th style={{width:100,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={7} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing ${r.name}`)}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/></>}/>
                <Td ch={<strong>{r.name}</strong>}/>
                <Td ch={r.consumable_categories?.name||"—"}/>
                <Td ch={r.rate||"—"}/><Td ch={r.rate_type||"—"}/><Td ch={r.currency||"—"}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"} variant="gray" sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>doToast("Add consumable")}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>⊕ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{marginTop:10}}><Btn ch="Import Consumables" sm icon={Ic.ul}/></div>
      <Modal open={showCats} onClose={()=>setShowCats(false)} title="Manage Categories" w={500}>
        <Card p={0} mb={12}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><Th ch="Category"/><th style={{background:"#f8fafc",borderBottom:`1px solid ${C.border}`,width:110}}/></tr></thead>
            <tbody>
              {cats.map(cat=>(
                <tr key={cat.id}>
                  <Td ch={<span style={{fontWeight:600}}>{cat.name}</span>}/>
                  <Td ch={<Btn ch={cat.status==="Active"?"Deactivate":"Activate"} sm onClick={()=>doToast(`${cat.name} güncellendi`)}/>}/>
                </tr>))}
            </tbody>
          </table>
        </Card>
        <button onClick={()=>doToast("Add category")}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>⊕ Add</button>
      </Modal>
    </div>);
};

// ── EMPLOYEE MODAL ────────────────────────────────────────────────────────────
const EmployeeModal=({open,onClose,onSaved,initialData})=>{
  const [empId,setEmpId]=useState("");
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [empType,setEmpType]=useState("Field");
  const [payroll,setPayroll]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(open){
      setEmpId(initialData?.employee_id||"");setFirstName(initialData?.first_name||"");
      setLastName(initialData?.last_name||"");setEmpType(initialData?.employee_type||"Field");
      setPayroll(initialData?.payroll_category||"");setError("");
    }
  },[open,initialData]);
  const handleSave=async()=>{
    if(!firstName.trim()){setError("First name zorunlu!");return;}
    setSaving(true);
    const payload={first_name:firstName.trim(),last_name:lastName||null,employee_type:empType,payroll_category:payroll||null,status:'Active'};
    if(empId)payload.employee_id=parseInt(empId)||null;
    const r=initialData?.id?await supabase.from('employees').update(payload).eq('id',initialData.id):await supabase.from('employees').insert(payload);
    setSaving(false);
    if(r.error){setError(r.error.message);return;}
    onSaved();onClose();
  };
  if(!open)return null;
  const s={width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"};
  const l={display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5};
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:480,boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Employee":"Add Employee"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:14}}>{error}</div>}
        <div style={{marginBottom:14}}><label style={l}>Employee ID</label><input type="number" value={empId} onChange={e=>setEmpId(e.target.value)} style={s} placeholder="e.g. 302"/></div>
        <div style={{marginBottom:14}}><label style={l}>First Name *</label><input value={firstName} onChange={e=>setFirstName(e.target.value)} style={s} placeholder="e.g. GHULAM"/></div>
        <div style={{marginBottom:14}}><label style={l}>Last Name</label><input value={lastName} onChange={e=>setLastName(e.target.value)} style={s} placeholder="e.g. ABBAS BIRHAMANI"/></div>
        <div style={{marginBottom:14}}><label style={l}>Employee Type</label>
          <select value={empType} onChange={e=>setEmpType(e.target.value)} style={{...s,appearance:"none"}}>
            <option>Field</option><option>Office</option>
          </select></div>
        <div style={{marginBottom:20}}><label style={l}>Payroll Category</label><input value={payroll} onChange={e=>setPayroll(e.target.value)} style={s} placeholder="Optional"/></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

// ── EMPLOYEES (Supabase) ──────────────────────────────────────────────────────
const EmployeesPage=({nav})=>{
  const [employees,setEmployees]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fType,setFType]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const fetchEmployees=useCallback(async()=>{
    setLoading(true);
    const {data}=await supabase.from('employees').select('*').order('first_name');
    setEmployees(data||[]);setLoading(false);
  },[]);
  useEffect(()=>{fetchEmployees();},[fetchEmployees]);
  const handleDelete=async(r)=>{
    if(!window.confirm(`"${r.first_name}" silinsin mi?`))return;
    const {error}=await supabase.from('employees').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);else{doToast("✓ Silindi");fetchEmployees();}
  };
  const handleToggle=async(r)=>{
    const s=r.status==="Active"?"InActive":"Active";
    await supabase.from('employees').update({status:s}).eq('id',r.id);
    doToast(`✓ ${r.first_name} → ${s}`);fetchEmployees();
  };
  const filtered=useMemo(()=>employees.filter(r=>{
    const okT=fType==="all"||r.employee_type===fType;
    const okQ=!q||r.first_name?.toLowerCase().includes(q.toLowerCase())||r.last_name?.toLowerCase().includes(q.toLowerCase())||String(r.employee_id||"").includes(q);
    return okT&&okQ;
  }),[employees,fType,q]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <EmployeeModal open={modalOpen} onClose={()=>setModalOpen(false)} onSaved={()=>{fetchEmployees();doToast("✓ Kaydedildi");}} initialData={editData}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Employees"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Type" opts={["Field","Office"]} val={fType} onChange={v=>{setFType(v);setPage(1);}} w={140}/>
        <Btn ch="Clear" onClick={()=>{setFType("all");setPage(1);}} sm/>
        <div style={{marginLeft:"auto"}}><Btn ch="Manage Payroll Categories" variant="purple" onClick={()=>doToast("Yakında")}/></div>
      </div>
      <div style={{marginBottom:10}}><SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/></div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="ID"/><Th ch="Name"/><Th ch="Type"/><Th ch="Payroll Category"/>
            <th style={{width:110,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={6} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setEditData(r);setModalOpen(true);}}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/></>}/>
                <Td ch={r.employee_id||"—"}/>
                <Td ch={<strong>{r.first_name} {r.last_name||""}</strong>}/>
                <Td ch={<span style={{fontSize:11,background:r.employee_type==="Field"?"#eff6ff":"#f0fdf4",
                  color:r.employee_type==="Field"?C.blue:C.green,padding:"2px 8px",borderRadius:10,fontWeight:600}}>
                  {r.employee_type}</span>}/>
                <Td ch={r.payroll_category||"—"}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"} variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>⊕ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};


// ── EQUIPMENT ─────────────────────────────────────────────────────────────────
const EquipmentPage=({nav})=>{
  const [selType,setSelType]=useState(""),[page,setPage]=useState(1),[toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const {items,total}=pg(EQUIP_UNITS,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Equipment"}]} nav={nav}/>
      <Card mb={16}>
        <SH title="Equipment Types"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
          {EQUIP_TYPES.map(t=>(
            <div key={t} onClick={()=>setSelType(selType===t?"":t)}
              style={{padding:"10px 16px",border:`1.5px solid ${selType===t?C.blue:C.border}`,
                borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,
                background:selType===t?"#eff6ff":C.white,color:selType===t?C.blue:C.textSec,
                transition:"all .15s",boxShadow:C.shadow}}>
              {t}
            </div>))}
        </div>
      </Card>
      <div style={{fontWeight:700,fontSize:15,color:C.textPri,marginBottom:10}}>Equipment Units</div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="Equipment"/><Th ch="Unit #"/><Th ch="Type"/>
            <Th ch="Year"/><Th ch="Make"/><Th ch="Model"/><Th ch="VIN"/>
            <th style={{width:100,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing unit ${r.unit}`)}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>doToast(`Deleted unit ${r.unit}`)}/></>}/>
                <Td ch={<strong>{r.equip}</strong>}/><Td ch={r.unit}/><Td ch={r.type}/>
                <Td ch={r.year}/><Td ch={r.make}/><Td ch={r.model}/><Td ch={r.vin}/>
                <Td ch={<Btn ch="Deactivate" variant="gray" sm onClick={()=>doToast(`Unit ${r.unit} deactivated`)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>doToast("Add equipment unit")}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",
            color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>⊕ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};

// ── REPORT SETUP ──────────────────────────────────────────────────────────────
const ReportSetupPage=({nav})=>{
  const [search,setSearch]=useState(""),[collapsed,setCollapsed]=useState({});
  const [toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const toggle=k=>setCollapsed(p=>({...p,[k]:!p[k]}));
  const cats=Object.keys(REPORT_SETUP).filter(cat=>{
    if(!search)return true;
    return cat.toLowerCase().includes(search.toLowerCase())||
      REPORT_SETUP[cat].some(a=>a.toLowerCase().includes(search.toLowerCase()));
  });
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Report Setup"}]} nav={nav}/>
      <div style={{marginBottom:14}}><SearchBar value={search} onChange={setSearch} placeholder="Search activities..."/></div>
      {cats.map(cat=>{
        const acts=REPORT_SETUP[cat].filter(a=>!search||a.toLowerCase().includes(search.toLowerCase())||cat.toLowerCase().includes(search.toLowerCase()));
        if(!acts.length&&search)return null;
        const isCol=collapsed[cat];
        return(
          <div key={cat} style={{border:`1px solid ${C.border}`,borderRadius:8,marginBottom:6,overflow:"hidden",background:C.white}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"10px 16px",cursor:"pointer",background:"#f8fafc",
              borderBottom:isCol?"none":`1px solid ${C.border}`}} onClick={()=>toggle(cat)}>
              <span style={{fontSize:13,fontWeight:700,color:C.textPri}}>{cat}</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:C.textMut}}>{acts.length} items</span>
                <span style={{color:C.textMut}}>{isCol?Ic.chR:Ic.chD}</span>
              </div>
            </div>
            {!isCol&&(
              <div>
                {acts.map((a,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"8px 16px",borderBottom:i<acts.length-1?`1px solid #f1f5f9`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing: ${a}`)}/>
                      <IBtn icon={Ic.trash} color={C.red} onClick={()=>doToast(`Deleted: ${a}`)}/>
                      <span style={{fontSize:13,color:C.textSec}}>{a}</span>
                    </div>
                    <Btn ch="Activate" sm onClick={()=>doToast(`${a} activated`)}/>
                  </div>))}
                <button onClick={()=>doToast(`Add to ${cat}`)}
                  style={{padding:"8px 16px",fontSize:13,background:"none",border:"none",
                    cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
                  ⊕ Add
                </button>
              </div>)}
          </div>);
      })}
    </div>);
};

// ── CLIENTS PAGE (Supabase) ───────────────────────────────────────────────────
const ClientModal=({open,onClose,onSaved,initialData})=>{
  const [name,setName]=useState("");
  const [status,setStatus]=useState("Active");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(open){setName(initialData?.name||"");setStatus(initialData?.status||"Active");setError("");}
  },[open,initialData]);
  const handleSave=async()=>{
    if(!name.trim()){setError("Client name zorunlu!");return;}
    setSaving(true);
    const payload={name:name.trim(),status};
    const r=initialData?.id?await supabase.from('clients').update(payload).eq('id',initialData.id):await supabase.from('clients').insert(payload);
    setSaving(false);
    if(r.error){setError(r.error.message);return;}
    onSaved();onClose();
  };
  if(!open)return null;
  const s={width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"};
  const l={display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5};
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:440,boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Client":"Add Client"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:14}}>{error}</div>}
        <div style={{marginBottom:14}}><label style={l}>Client Name *</label><input value={name} onChange={e=>setName(e.target.value)} style={s} placeholder="e.g. Maaden BMNM"/></div>
        <div style={{marginBottom:20}}><label style={l}>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{...s,appearance:"none"}}><option>Active</option><option>InActive</option></select></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

const ClientsPage=({nav})=>{
  const [clients,setClients]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const fetchClients=useCallback(async()=>{
    setLoading(true);
    const {data}=await supabase.from('clients').select('*').order('name');
    setClients(data||[]);setLoading(false);
  },[]);
  useEffect(()=>{fetchClients();},[fetchClients]);
  const handleDelete=async(r)=>{
    if(!window.confirm(`"${r.name}" silinsin mi? Bu client'a bağlı tüm veriler etkilenebilir.`))return;
    const {error}=await supabase.from('clients').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);else{doToast("✓ Silindi");fetchClients();}
  };
  const handleToggle=async(r)=>{
    const s=r.status==="Active"?"InActive":"Active";
    await supabase.from('clients').update({status:s}).eq('id',r.id);
    doToast(`✓ ${r.name} → ${s}`);fetchClients();
  };
  const filtered=useMemo(()=>clients.filter(r=>!q||r.name?.toLowerCase().includes(q.toLowerCase())),[clients,q]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <ClientModal open={modalOpen} onClose={()=>setModalOpen(false)} onSaved={()=>{fetchClients();doToast("✓ Kaydedildi");}} initialData={editData}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Clients"}]} nav={nav}/>
      <div style={{marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{fontSize:12,color:C.textMut}}>{loading?"Loading...":total+" entries"}</span>
      </div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="Client Name"/><Th ch="Status"/>
            <th style={{width:110,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={4} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setEditData(r);setModalOpen(true);}}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/></>}/>
                <Td ch={<strong>{r.name}</strong>}/>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"} variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>⊕ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};

// ── CONTRACTS PAGE (Supabase) ─────────────────────────────────────────────────
const ContractModal=({open,onClose,onSaved,initialData,clients})=>{
  const [name,setName]=useState("");
  const [clientId,setClientId]=useState("");
  const [status,setStatus]=useState("Active");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(open){setName(initialData?.name||"");setClientId(initialData?.client_id||"");setStatus(initialData?.status||"Active");setError("");}
  },[open,initialData]);
  const handleSave=async()=>{
    if(!name.trim()){setError("Contract name zorunlu!");return;}
    if(!clientId){setError("Client seçilmeli!");return;}
    setSaving(true);
    const payload={name:name.trim(),client_id:clientId,status};
    const r=initialData?.id?await supabase.from('contracts').update(payload).eq('id',initialData.id):await supabase.from('contracts').insert(payload);
    setSaving(false);
    if(r.error){setError(r.error.message);return;}
    onSaved();onClose();
  };
  if(!open)return null;
  const s={width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"};
  const l={display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5};
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:480,boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Contract":"Add Contract"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:14}}>{error}</div>}
        <div style={{marginBottom:14}}><label style={l}>Contract Name *</label><input value={name} onChange={e=>setName(e.target.value)} style={s} placeholder="e.g. BM-NM Drilling Program 2024-2026 DD"/></div>
        <div style={{marginBottom:14}}><label style={l}>Client *</label>
          <select value={clientId} onChange={e=>setClientId(e.target.value)} style={{...s,appearance:"none"}}>
            <option value="">Select client...</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select></div>
        <div style={{marginBottom:20}}><label style={l}>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{...s,appearance:"none"}}><option>Active</option><option>InActive</option></select></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

const ContractsPage=({nav})=>{
  const [contracts,setContracts]=useState([]);
  const [clients,setClients]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fClient,setFClient]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const fetchAll=useCallback(async()=>{
    setLoading(true);
    const [co,cl]=await Promise.all([
      supabase.from('contracts').select('*, clients(name)').order('name'),
      supabase.from('clients').select('id,name').order('name'),
    ]);
    setContracts(co.data||[]);setClients(cl.data||[]);setLoading(false);
  },[]);
  useEffect(()=>{fetchAll();},[fetchAll]);
  const handleDelete=async(r)=>{
    if(!window.confirm(`"${r.name}" silinsin mi?`))return;
    const {error}=await supabase.from('contracts').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);else{doToast("✓ Silindi");fetchAll();}
  };
  const handleToggle=async(r)=>{
    const s=r.status==="Active"?"InActive":"Active";
    await supabase.from('contracts').update({status:s}).eq('id',r.id);
    doToast(`✓ ${r.name} → ${s}`);fetchAll();
  };
  const clientNames=useMemo(()=>clients.map(c=>c.name),[clients]);
  const filtered=useMemo(()=>contracts.filter(r=>{
    const okC=fClient==="all"||(r.clients?.name===fClient);
    const okQ=!q||r.name?.toLowerCase().includes(q.toLowerCase());
    return okC&&okQ;
  }),[contracts,fClient,q]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <ContractModal open={modalOpen} onClose={()=>setModalOpen(false)} onSaved={()=>{fetchAll();doToast("✓ Kaydedildi");}} initialData={editData} clients={clients}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Contracts"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Client" opts={clientNames} val={fClient} onChange={v=>{setFClient(v);setPage(1);}} w={160}/>
        <Btn ch="Clear" onClick={()=>{setFClient("all");setPage(1);}} sm/>
      </div>
      <div style={{marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{fontSize:12,color:C.textMut}}>{loading?"Loading...":total+" entries"}</span>
      </div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="Contract Name"/><Th ch="Client"/><Th ch="Status"/>
            <th style={{width:110,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={5} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setEditData(r);setModalOpen(true);}}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/></>}/>
                <Td ch={<strong>{r.name}</strong>}/>
                <Td ch={r.clients?.name||"—"}/>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"} variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>⊕ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const Sidebar=({page,nav})=>{
  const [mgmtOpen,setMgmtOpen]=useState(true);
  const [presetsOpen,setPresetsOpen]=useState(true);
  const isActive=p=>p===page;

  const NavItem=({label,p,badge,indent,dot})=>{
    const active=isActive(p);
    return(
      <div onClick={()=>nav(p)}
        style={{display:"flex",alignItems:"center",padding:"8px 16px 8px "+(indent?36:16)+"px",
          cursor:"pointer",borderRadius:6,margin:"1px 8px",
          background:active?C.sidebarActive:"transparent",
          transition:"background .15s"}}>
        {indent&&<span style={{width:6,height:6,borderRadius:"50%",
          background:active?C.sidebarActiveText:C.sidebarText,
          flexShrink:0,marginRight:10}}/>}
        <span style={{flex:1,fontSize:13,fontWeight:active?700:500,
          color:active?C.sidebarActiveText:C.sidebarText,letterSpacing:.1}}>
          {label}
        </span>
        {badge&&<span style={{background:C.orange,color:"#fff",fontSize:10,fontWeight:800,
          padding:"2px 7px",borderRadius:20,minWidth:20,textAlign:"center",
          boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}>
          {badge}
        </span>}
      </div>);
  };

  const GroupHeader=({label,open,setOpen})=>(
    <div onClick={()=>setOpen(o=>!o)}
      style={{display:"flex",alignItems:"center",padding:"7px 16px",cursor:"pointer",
        margin:"4px 8px 2px"}}>
      <span style={{flex:1,fontSize:10,fontWeight:700,color:"#64748b",
        textTransform:"uppercase",letterSpacing:1.2}}>{label}</span>
      <span style={{color:"#64748b",fontSize:9,transition:"transform .2s",
        transform:open?"rotate(180deg)":"rotate(0)"}}>{Ic.chD}</span>
    </div>);

  return(
    <div style={{width:260,minWidth:260,background:C.sidebarBg,display:"flex",
      flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0,
      borderRight:"1px solid rgba(255,255,255,.06)"}}>
      {/* Logo */}
      <div style={{padding:"20px 16px 18px",borderBottom:`1px solid ${C.sidebarBorder}`,
        display:"flex",alignItems:"center",gap:12}}>
        <img src="/logo.png" alt="AEB Logo"
          style={{width:42,height:42,objectFit:"contain",flexShrink:0,
            filter:"drop-shadow(0 2px 4px rgba(0,0,0,.3))"}}/>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:"#f1f5f9",letterSpacing:.3,lineHeight:1.3}}>AEB Operations</div>
          <div style={{fontSize:13,fontWeight:800,color:"#60a5fa",letterSpacing:.3}}>Intelligence™</div>
        </div>
      </div>
      {/* Nav */}
      <div style={{flex:1,overflowY:"auto",padding:"10px 0"}}>
        <NavItem label="Home" p="home"/>
        <NavItem label="Daily Shift Report" p="dsr" badge={76}/>
        <NavItem label="Timesheet" p="timesheet"/>
        <GroupHeader label="Management" open={mgmtOpen} setOpen={setMgmtOpen}/>
        {mgmtOpen&&<>
          <NavItem label="Clients" p="clients" indent/>
          <NavItem label="Contracts" p="contracts" indent/>
          <NavItem label="Projects" p="projects" indent/>
          <NavItem label="Holes" p="holes" indent/>
          <NavItem label="Bits" p="bits" indent/>
        </>}
        <GroupHeader label="Presets" open={presetsOpen} setOpen={setPresetsOpen}/>
        {presetsOpen&&<>
          <NavItem label="Drilling Rigs" p="drills" indent/>
          <NavItem label="Consumables" p="consumables" indent/>
          <NavItem label="Employees" p="employees" indent/>
          <NavItem label="Equipment" p="equipment" indent/>
          <NavItem label="Report Setup" p="report-setup" indent/>
        </>}
      </div>
      {/* User footer */}
      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.sidebarBorder}`,
        display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,background:"#2563eb",borderRadius:"50%",
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:12,fontWeight:700,color:"#fff"}}>S</span>
        </div>
        <div style={{flex:1,overflow:"hidden"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#f1f5f9",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            supervisor@drillexp.com
          </div>
        </div>
        <button style={{background:"none",border:"none",cursor:"pointer",
          color:"#64748b",display:"flex",alignItems:"center"}}>
          {Ic.logout}
        </button>
      </div>
    </div>);
};

// ── TOPBAR ────────────────────────────────────────────────────────────────────
const PAGE_TITLES={
  "home":"Home","dsr":"Daily Shift Report","dsr-summary":"Daily Report Summary",
  "shift-detail":"Shift Detail","timesheet":"Timesheet",
  "clients":"Clients","contracts":"Contracts","projects":"Projects",
  "holes":"Holes","hole-detail":"Hole Detail","bits":"Bits","drills":"Drilling Rigs",
  "consumables":"Consumables","employees":"Employees","equipment":"Equipment","report-setup":"Report Setup",
};

const Topbar=({page})=>(
  <div style={{height:52,background:C.white,borderBottom:`1px solid ${C.border}`,
    display:"flex",alignItems:"center",paddingRight:20,flexShrink:0,
    position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 2px rgba(0,0,0,.04)"}}>
    <div style={{flex:1,padding:"0 24px"}}>
      <span style={{fontSize:14,fontWeight:700,color:C.textPri}}>
        {PAGE_TITLES[page]||"AEB Operations Intelligence™"}
      </span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <button style={{width:28,height:28,borderRadius:"50%",background:"#1d4ed8",color:"#fff",
        border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>?</button>
    </div>
  </div>);

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("home");
  const [params,setParams]=useState({});
  const nav=(p,pr={})=>{setPage(p);setParams(pr);window.scrollTo({top:0,behavior:"smooth"});};
  const renderPage=()=>{
    switch(page){
      case "home":         return <HomePage nav={nav}/>;
      case "dsr":          return <DSRPage nav={nav}/>;
      case "dsr-summary":  return <DSRSummaryPage nav={nav} params={params}/>;
      case "shift-detail": return <ShiftDetailPage nav={nav} params={params}/>;
      case "timesheet":    return <TimesheetPage nav={nav}/>;
      case "clients":      return <ClientsPage nav={nav}/>;
      case "contracts":    return <ContractsPage nav={nav}/>;
      case "projects":     return <ProjectsPage nav={nav}/>;
      case "holes":        return <HolesPage nav={nav}/>;
      case "hole-detail":  return <HoleDetailPage nav={nav} params={params}/>;
      case "bits":         return <BitsPage nav={nav}/>;
      case "drills":       return <DrillsPage nav={nav}/>;
      case "consumables":  return <ConsumablesPage nav={nav}/>;
      case "employees":    return <EmployeesPage nav={nav}/>;
      case "equipment":    return <EquipmentPage nav={nav}/>;
      case "report-setup": return <ReportSetupPage nav={nav}/>;
      default:             return <HomePage nav={nav}/>;
    }
  };
  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,
      fontFamily:"'Inter','Segoe UI',system-ui,sans-serif"}}>
      <Sidebar page={page} nav={nav}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <Topbar page={page}/>
        <main style={{flex:1,padding:24,boxSizing:"border-box"}}>
          {renderPage()}
        </main>
        <footer style={{borderTop:`1px solid ${C.border}`,padding:"10px 24px",background:C.white,
          display:"flex",justifyContent:"flex-end",alignItems:"center",
          fontSize:11,color:C.textMut,fontWeight:500}}>
          © 2026 AEB Operations Intelligence™ · Powered by Anıl Enis BALCI All Rights Reserved.
          <span style={{marginLeft:8,fontWeight:800,color:C.purple,fontSize:13}}>NS</span>
        </footer>
      </div>
    </div>);
}
