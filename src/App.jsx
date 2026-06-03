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
  "Casing":["Available in HQ/HQ Lining","Available in Core Type","Casing Installation","Casing Removal"],
  "Cementing":["Cementing Volumes (m3 x Sacks)","Cementing Intervals","Cement Mix"],
  "Cuttings Control":["Cutting Control","Cuttings Disposal"],
  "Directional":["Directional - Casing","Directional - Drilling","Directional - Survey","Directional - Wedge"],
  "Drilling":["Core Drilling","Rotary Drilling","DTH Drilling","RC Drilling","Air Core Drilling","Percussion Drilling"],
  "Fishing":["Impression Block","Fishing - Back off","Fishing - Junk Basket","Fishing - Mill","Fishing - Overshot","Fishing - Washpipe","Trying to Recover Tool"],
  "Haul Water":["Haul Water - Drill","Haul Water - Camp","Haul Water - Other"],
  "Hole Conditioning":["Condition Hole/Circulation","Condition Hole/Mix Mud/Lost Circulation","Condition Hole/Overshot Pump","Mud Treatment"],
  "Hole Reducing":["Hole Reducing","Reaming to Reduce Hole Size"],
  "Hydraulic Test":["Hydraulic Test","Pressure Test","Water Pressure Test"],
  "Installations":["Casing Installation","Pump Installation","Equipment Setup","Rig Up","Rig Down"],
  "Moving":["Moving Drill","Moving Camp","Rigging Down","Rigging Up","Site Preparation"],
  "Other":["Other Activity","Miscellaneous"],
  "Reaming":["Reaming Up","Reaming Down","Reaming - Lost Circulation"],
  "Repair":["Breakdown - Generator","Breakdown - Hydraulics","Breakdown - Rig/Motor","Breakdown - Wireline","Breakdown - TDI","Breakdown - Pump","Breakdown - Vehicle"],
  "Roads":["Road Construction","Road Maintenance","Road Clearing","Access Road"],
  "Safety":["Safety Meeting/Training","Pre-start Inspection","Risk Assessment","HSE Observation","Safety Inspection","Toolbox Talk"],
  "Service":["Service - Rig","Service - Vehicle","Service - Equipment","Maintenance"],
  "Standby":["Waiting - General","Weather Delay","Environmental Hold"],
  "Standby - Client":["Client directed waiting","Waiting for decision/instruction","Waiting for client","Waiting on weather","Waiting for Geologist"],
  "Standby - Contractor":["Waiting for Tool/Equipment/Survey","Waiting for Water","Waiting on drill bit/parts","Lunch and dinner break","Pre-shift meeting","Post-shift meeting","Waiting on accommodation"],
  "Stuck Rods":["Stuck Rods - Rotation","Stuck Rods - Pull","Stuck Rods - Jarring","Freed Rods"],
  "Survey":["Multi Shot Survey","Single Shot Survey","Gyro Survey","Down Hole Survey","Wireline Survey"],
  "Travel":["Travel to Site","Travel from Site","Personnel Transfer"],
  "Trip Rods":["Tripping In","Tripping Out","Trip In/Out with Reaming","Wash & Ream"],
  "Water Line":["Water Line Installation","Water Line Maintenance","Water Pump Setup","Water Source Development"],
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

// ── DSR CREATE PAGE ───────────────────────────────────────────────────────────
const calcHours=(s,e)=>{
  if(!s||!e)return 0;
  const[sh,sm]=s.split(':').map(Number);
  const[eh,em]=e.split(':').map(Number);
  const d=(eh*60+em)-(sh*60+sm);
  return d>0?Math.round(d/60*100)/100:0;
};

const DSRCreatePage=({nav,params})=>{
  const isEdit=!!params?.dsrId;
  const dsrId=params?.dsrId||null;

  const [drills,setDrills]=useState([]);
  const [holes,setHoles]=useState([]);
  const [employees,setEmployees]=useState([]);

  // Basic info
  const [date,setDate]=useState(new Date().toISOString().split('T')[0]);
  const [shift,setShift]=useState('DAY');
  const [drillId,setDrillId]=useState('');
  const [holeId,setHoleId]=useState('');
  const [holeInfo,setHoleInfo]=useState(null);

  // Seçili tarih + rig için hangi vardiyalar dolu?
  const [usedShifts,setUsedShifts]=useState([]);
  useEffect(()=>{
    if(!date||!drillId){setUsedShifts([]);return;}
    supabase.from('daily_shift_reports')
      .select('shift').eq('report_date',date).eq('drill_id',drillId)
      .then(({data})=>setUsedShifts((data||[]).map(r=>r.shift)));
  },[date,drillId]);

  // Rows
  const [workers,setWorkers]=useState([{_k:1,empId:'',empName:'',role:'',start:'06:30',end:'18:30'}]);
  const [activities,setActivities]=useState([{_k:1,cat:'',act:'',start:'06:30',end:'07:00'}]);
  const [drillRecs,setDrillRecs]=useState([{_k:1,holeId:'',holeName:'',from:'',to:''}]);

  // Accordion
  const [open,setOpen]=useState({basic:true,workers:false,activities:false,drilling:false});
  const toggleSection=s=>setOpen(p=>({...p,[s]:!p[s]}));

  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(''),2500);};

  useEffect(()=>{
    Promise.all([
      supabase.from('drills').select('id,name').eq('status','Active').order('name'),
      supabase.from('holes').select('id,name,client_id,contract_id,project_id,clients(name),contracts(name),projects(name)').order('name'),
      supabase.from('employees').select('id,first_name,last_name').eq('status','Active').order('first_name'),
    ]).then(([d,h,em])=>{
      setDrills(d.data||[]);setHoles(h.data||[]);setEmployees(em.data||[]);
      // Edit modunda mevcut veriyi yükle
      if(isEdit&&dsrId){
        Promise.all([
          supabase.from('daily_shift_reports').select('*').eq('id',dsrId).single(),
          supabase.from('dsr_workers').select('*').eq('dsr_id',dsrId),
          supabase.from('dsr_activities').select('*').eq('dsr_id',dsrId),
          supabase.from('dsr_drilling_records').select('*').eq('dsr_id',dsrId),
        ]).then(([dsr,w,a,dr])=>{
          if(dsr.data){
            setDate(dsr.data.report_date);
            setShift(dsr.data.shift);
            setDrillId(dsr.data.drill_id||'');
            // Hole bilgisi
            if(dsr.data.project_id){
              const hole=h.data?.find(x=>x.project_id===dsr.data.project_id);
              if(hole){
                setHoleId(hole.id);
                setHoleInfo({
                  clientId:hole.client_id,clientName:hole.clients?.name||'—',
                  contractId:hole.contract_id,contractName:hole.contracts?.name||'—',
                  projectId:hole.project_id,projectName:hole.projects?.name||'—',
                  holeName:hole.name,
                });
              }
            }
          }
          if(w.data?.length)setWorkers(w.data.map(r=>({
            _k:r.id,empId:r.employee_id||'',empName:r.employee_name||'',
            role:r.role||'',start:r.start_time?.slice(0,5)||'06:30',end:r.end_time?.slice(0,5)||'18:30',
            id:r.id,
          })));
          if(a.data?.length)setActivities(a.data.map(r=>({
            _k:r.id,cat:r.category||'',act:r.activity||'',
            start:r.start_time?.slice(0,5)||'',end:r.end_time?.slice(0,5)||'',
            id:r.id,
          })));
          if(dr.data?.length)setDrillRecs(dr.data.map(r=>({
            _k:r.id,holeId:r.hole_id||'',holeName:r.hole_name||'',
            from:r.depth_from||'',to:r.depth_to||'',id:r.id,
          })));
        });
      }
    });
  },[]);

  // Kuyu seçilince müşteri/proje/kontrat otomatik doldur
  const handleHoleSelect=(id)=>{
    setHoleId(id);
    const h=holes.find(h=>h.id===id);
    if(h){
      setHoleInfo({
        clientId:h.client_id,clientName:h.clients?.name||'—',
        contractId:h.contract_id,contractName:h.contracts?.name||'—',
        projectId:h.project_id,projectName:h.projects?.name||'—',
        holeName:h.name,
      });
      // Sondaj kaydına da kuyu adını yaz
      setDrillRecs(p=>p.map((r,i)=>i===0?{...r,holeId:id,holeName:h.name}:r));
    } else {
      setHoleInfo(null);
    }
  };

  // Helpers
  const addWorker=()=>setWorkers(p=>[...p,{_k:Date.now(),empId:'',empName:'',role:'',start:'06:30',end:'18:30'}]);
  const updateWorker=(k,f,v)=>setWorkers(p=>p.map(r=>r._k===k?{...r,[f]:v}:r));
  const removeWorker=k=>setWorkers(p=>p.filter(r=>r._k!==k));

  const addActivity=()=>setActivities(p=>[...p,{_k:Date.now(),cat:'',act:'',start:'',end:''}]);
  const updateActivity=(k,f,v)=>setActivities(p=>p.map(r=>r._k===k?{...r,[f]:v}:r));
  const removeActivity=k=>setActivities(p=>p.filter(r=>r._k!==k));

  const addDrillRec=()=>setDrillRecs(p=>[...p,{_k:Date.now(),holeId:holeId,holeName:holeInfo?.holeName||'',from:'',to:''}]);
  const updateDrillRec=(k,f,v)=>setDrillRecs(p=>p.map(r=>r._k===k?{...r,[f]:v}:r));
  const removeDrillRec=k=>setDrillRecs(p=>p.filter(r=>r._k!==k));

  // Kuyu seçilince son derinliği çek
  const [holeLastDepths,setHoleLastDepths]=useState({}); // holeId → lastDepth
  const fetchLastDepth=useCallback(async(hId,rowKey)=>{
    const{data}=await supabase.from('dsr_drilling_records')
      .select('depth_to').eq('hole_id',hId).order('depth_to',{ascending:false}).limit(1);
    const lastDepth=data?.[0]?.depth_to??0;
    setHoleLastDepths(p=>({...p,[hId]:lastDepth}));
    // depth_from'u otomatik doldur
    updateDrillRec(rowKey,'from',String(lastDepth));
  },[]);
  // Totals
  const totalManHrs=useMemo(()=>workers.reduce((s,r)=>s+calcHours(r.start,r.end),0),[workers]);
  const totalActHrs=useMemo(()=>activities.reduce((s,r)=>s+calcHours(r.start,r.end),0),[activities]);
  const totalDist=useMemo(()=>drillRecs.reduce((s,r)=>{
    const d=(parseFloat(r.to)||0)-(parseFloat(r.from)||0);
    return s+(d>0?d:0);
  },0),[drillRecs]);

  // ROP otomatik: Drilling kategorisi saatleri topla, mesafeye böl
  const drillingHrs=useMemo(()=>activities.filter(r=>r.cat==='Drilling').reduce((s,r)=>s+calcHours(r.start,r.end),0),[activities]);
  const rop=useMemo(()=>drillingHrs>0?(totalDist/drillingHrs).toFixed(2):null,[totalDist,drillingHrs]);

  const handleSave=async()=>{
    if(!date||!shift||!drillId){doToast('Tarih, Vardiya ve Rig ID zorunlu!');return;}
    if(!isEdit&&usedShifts.includes(shift)){doToast('Bu vardiya zaten girilmiş!');return;}
    setSaving(true);
    let savedDsrId=dsrId;
    const payload={
      report_date:date,shift,
      drill_id:drillId||null,
      client_id:holeInfo?.clientId||null,
      contract_id:holeInfo?.contractId||null,
      project_id:holeInfo?.projectId||null,
      total_man_hours:totalManHrs,
      total_activity_hours:totalActHrs,
      total_distance_drilled:totalDist,
    };
    if(isEdit){
      const{error}=await supabase.from('daily_shift_reports').update(payload).eq('id',dsrId);
      if(error){setSaving(false);doToast('Hata: '+error.message);return;}
      // Mevcut satırları sil, yeniden ekle
      await Promise.all([
        supabase.from('dsr_workers').delete().eq('dsr_id',dsrId),
        supabase.from('dsr_activities').delete().eq('dsr_id',dsrId),
        supabase.from('dsr_drilling_records').delete().eq('dsr_id',dsrId),
      ]);
    } else {
      const{data:dsr,error}=await supabase.from('daily_shift_reports')
        .insert({...payload,status:'PENDING APPROVAL'}).select('id').single();
      if(error){setSaving(false);doToast('Hata: '+error.message);return;}
      savedDsrId=dsr.id;
    }
    const wRows=workers.filter(r=>r.empId||r.empName).map(r=>({
      dsr_id:savedDsrId,employee_id:r.empId||null,
      employee_name:r.empName||employees.find(e=>e.id===r.empId)?.first_name||'',
      role:r.role||null,start_time:r.start||null,end_time:r.end||null,
      man_hours:calcHours(r.start,r.end),
    }));
    if(wRows.length)await supabase.from('dsr_workers').insert(wRows);
    const aRows=activities.filter(r=>r.act||r.cat).map(r=>({
      dsr_id:savedDsrId,category:r.cat||null,activity:r.act||null,
      start_time:r.start||null,end_time:r.end||null,
      duration_hours:calcHours(r.start,r.end),
    }));
    if(aRows.length)await supabase.from('dsr_activities').insert(aRows);
    const dRows=drillRecs.filter(r=>r.to!==''&&r.from!=='').map(r=>({
      dsr_id:savedDsrId,hole_id:r.holeId||null,hole_name:r.holeName||null,
      depth_from:parseFloat(r.from)||0,depth_to:parseFloat(r.to)||0,
      rop:rop?parseFloat(rop):null,
    }));
    if(dRows.length)await supabase.from('dsr_drilling_records').insert(dRows);
    setSaving(false);
    doToast(isEdit?'✓ DSR güncellendi!':'✓ DSR kaydedildi!');
    setTimeout(()=>nav('dsr'),1200);
  };

  const inp={width:'100%',padding:'7px 10px',fontSize:12,border:'1px solid #e2e8f0',borderRadius:6,boxSizing:'border-box',outline:'none',background:'#fff',color:'#0f172a'};
  const sel={...inp,appearance:'none'};
  const lbl={display:'block',fontSize:10,fontWeight:700,color:'#64748b',marginBottom:4,textTransform:'uppercase',letterSpacing:.5};

  const SectionHeader=({id,title,badge,num})=>(
    <div onClick={()=>toggleSection(id)}
      style={{padding:'10px 14px',display:'flex',alignItems:'center',gap:8,cursor:'pointer',
        background:open[id]?'#f0f9ff':'#f8fafc',
        borderBottom:open[id]?`1px solid ${C.border}`:'none',transition:'background .15s'}}>
      <div style={{width:22,height:22,borderRadius:'50%',
        background:open[id]?C.blue:'#cbd5e1',
        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        <span style={{fontSize:11,fontWeight:700,color:'#fff'}}>{num}</span>
      </div>
      <span style={{flex:1,fontSize:13,fontWeight:600,color:C.textPri}}>{title}</span>
      {badge&&<span style={{fontSize:11,background:C.blue,color:'#fff',padding:'2px 8px',borderRadius:10,fontWeight:600}}>{badge}</span>}
      <span style={{color:C.textMut,fontSize:10}}>{open[id]?'▲':'▼'}</span>
    </div>);

  return(
    <div style={{maxWidth:880,margin:'0 auto'}}>
      <Toast msg={toast}/>
      <Crumb items={[{label:'Home',page:'home'},{label:'Daily Shift Report',page:'dsr'},{label:isEdit?'Edit DSR':'New DSR'}]} nav={nav}/>

      {/* KPI Bar */}
      <div style={{display:'flex',gap:10,marginBottom:14}}>
        {[
          {label:'Man Hours',val:`${totalManHrs.toFixed(1)} h`,color:C.blue},
          {label:'Activity Hours',val:`${totalActHrs.toFixed(1)} h`,color:C.teal},
          {label:'Distance Drilled',val:`${totalDist.toFixed(2)} m`,color:C.green},
          {label:'ROP',val:rop?`${rop} m/h`:'—',color:C.orange},
        ].map(s=>(
          <div key={s.label} style={{flex:1,background:C.white,border:`1px solid ${C.border}`,
            borderRadius:8,padding:'10px 12px',textAlign:'center',boxShadow:C.shadow}}>
            <div style={{fontSize:18,fontWeight:800,color:s.color,lineHeight:1.2}}>{s.val}</div>
            <div style={{fontSize:10,color:C.textMut,marginTop:3,fontWeight:500,textTransform:'uppercase',letterSpacing:.4}}>{s.label}</div>
          </div>))}
      </div>

      {/* SECTION 1: Temel Bilgi */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:8,overflow:'hidden',boxShadow:C.shadow}}>
        <SectionHeader id="basic" title="Temel Bilgi" num="1"/>
        {open.basic&&(
          <div style={{padding:16}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12,marginBottom:12}}>
              <div>
                <label style={lbl}>Tarih *</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
              </div>
              <div>
                <label style={lbl}>Vardiya *</label>
                <select value={shift} onChange={e=>setShift(e.target.value)} style={sel}>
                  {[
                    {val:'DAY',label:'☀️ DAY — Gündüz'},
                    {val:'NIGHT',label:'🌙 NIGHT — Gece'},
                  ].map(o=>(
                    <option key={o.val} value={o.val} disabled={usedShifts.includes(o.val)}>
                      {o.label}{usedShifts.includes(o.val)?' ✗ Girilmiş':''}
                    </option>))}
                </select>
                {usedShifts.includes(shift)&&(
                  <div style={{fontSize:10,color:C.red,marginTop:3,fontWeight:600}}>
                    Bu vardiya zaten girilmiş
                  </div>)}
              </div>
              <div>
                <label style={lbl}>Rig ID *</label>
                <select value={drillId} onChange={e=>setDrillId(e.target.value)} style={sel}>
                  <option value="">Seç...</option>
                  {drills.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Kuyu Adı</label>
                <select value={holeId} onChange={e=>handleHoleSelect(e.target.value)} style={sel}>
                  <option value="">Seç...</option>
                  {holes.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
            </div>
            {/* Otomatik dolan bilgiler */}
            {holeInfo&&(
              <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:8,padding:'10px 14px',
                display:'flex',gap:24,fontSize:12}}>
                <span style={{color:C.textMut}}>Otomatik dolduruldu:</span>
                <span><strong style={{color:C.textSec}}>Müşteri:</strong> <span style={{color:C.green,fontWeight:600}}>{holeInfo.clientName}</span></span>
                <span><strong style={{color:C.textSec}}>Proje:</strong> <span style={{color:C.green,fontWeight:600}}>{holeInfo.projectName}</span></span>
                <span><strong style={{color:C.textSec}}>Kontrat:</strong> <span style={{color:C.green,fontWeight:600}}>{holeInfo.contractName}</span></span>
              </div>)}
          </div>)}
      </div>

      {/* SECTION 2: Çalışanlar */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:8,overflow:'hidden',boxShadow:C.shadow}}>
        <SectionHeader id="workers" title="Çalışanlar" num="2"
          badge={workers.filter(r=>r.empId).length?`${totalManHrs.toFixed(1)}h`:null}/>
        {open.workers&&(
          <div style={{padding:16}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  {['Çalışan','Rol','Başlangıç','Bitiş','Saat',''].map(h=>(
                    <th key={h} style={{padding:'6px 8px',fontSize:10,fontWeight:700,color:C.textMut,textAlign:'left',textTransform:'uppercase',letterSpacing:.5}}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {workers.map(row=>{
                  const hrs=calcHours(row.start,row.end);
                  return(
                    <tr key={row._k} style={{borderBottom:`1px solid #f1f5f9`}}>
                      <td style={{padding:'5px 6px',minWidth:170}}>
                        <select value={row.empId} onChange={e=>{
                          const emp=employees.find(em=>em.id===e.target.value);
                          updateWorker(row._k,'empId',e.target.value);
                          if(emp)updateWorker(row._k,'empName',`${emp.first_name} ${emp.last_name||''}`);
                        }} style={{...sel,fontSize:11}}>
                          <option value="">Çalışan seç...</option>
                          {employees.map(e=><option key={e.id} value={e.id}>{e.first_name} {e.last_name||''}</option>)}
                        </select>
                      </td>
                      <td style={{padding:'5px 6px',minWidth:120}}>
                        <select value={row.role} onChange={e=>updateWorker(row._k,'role',e.target.value)} style={{...sel,fontSize:11}}>
                          <option value="">Rol...</option>
                          {['Driller','Offsider','Helper','Supervisor','Geologist','Other'].map(r=><option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td style={{padding:'5px 6px'}}>
                        <input type="time" value={row.start} onChange={e=>updateWorker(row._k,'start',e.target.value)} style={{...inp,width:95,fontSize:11}}/>
                      </td>
                      <td style={{padding:'5px 6px'}}>
                        <input type="time" value={row.end} onChange={e=>updateWorker(row._k,'end',e.target.value)} style={{...inp,width:95,fontSize:11}}/>
                      </td>
                      <td style={{padding:'5px 8px',textAlign:'center'}}>
                        <span style={{fontWeight:700,color:hrs>0?C.blue:C.textMut,fontSize:13}}>{hrs>0?`${hrs}h`:'-'}</span>
                      </td>
                      <td style={{padding:'5px 4px'}}>
                        <button onClick={()=>removeWorker(row._k)} style={{background:'none',border:'none',cursor:'pointer',color:C.red,fontSize:16,lineHeight:1,padding:'0 4px'}}>×</button>
                      </td>
                    </tr>);})}
              </tbody>
            </table>
            <button onClick={addWorker} style={{marginTop:8,background:'none',border:'none',color:C.blue,fontSize:12,cursor:'pointer',padding:'4px 0',display:'flex',alignItems:'center',gap:4,fontWeight:600}}>
              + Çalışan Ekle
            </button>
          </div>)}
      </div>

      {/* SECTION 3: Aktiviteler */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:8,overflow:'hidden',boxShadow:C.shadow}}>
        <SectionHeader id="activities" title="Aktiviteler" num="3"
          badge={activities.filter(r=>r.cat).length?`${totalActHrs.toFixed(1)}h`:null}/>
        {open.activities&&(
          <div style={{padding:16}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  {['Kategori','Aktivite','Başlangıç','Bitiş','Süre',''].map(h=>(
                    <th key={h} style={{padding:'6px 8px',fontSize:10,fontWeight:700,color:C.textMut,textAlign:'left',textTransform:'uppercase',letterSpacing:.5}}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {activities.map(row=>{
                  const hrs=calcHours(row.start,row.end);
                  const actOpts=row.cat&&REPORT_SETUP[row.cat]?REPORT_SETUP[row.cat]:[];
                  return(
                    <tr key={row._k} style={{borderBottom:`1px solid #f1f5f9`}}>
                      <td style={{padding:'5px 6px',minWidth:140}}>
                        <select value={row.cat} onChange={e=>{updateActivity(row._k,'cat',e.target.value);updateActivity(row._k,'act','');}} style={{...sel,fontSize:11}}>
                          <option value="">Kategori...</option>
                          {Object.keys(REPORT_SETUP).map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td style={{padding:'5px 6px',minWidth:170}}>
                        <select value={row.act} onChange={e=>updateActivity(row._k,'act',e.target.value)} style={{...sel,fontSize:11}} disabled={!row.cat}>
                          <option value="">Aktivite...</option>
                          {actOpts.map(a=><option key={a} value={a}>{a}</option>)}
                        </select>
                      </td>
                      <td style={{padding:'5px 6px'}}>
                        <input type="time" value={row.start} onChange={e=>updateActivity(row._k,'start',e.target.value)} style={{...inp,width:95,fontSize:11}}/>
                      </td>
                      <td style={{padding:'5px 6px'}}>
                        <input type="time" value={row.end} onChange={e=>updateActivity(row._k,'end',e.target.value)} style={{...inp,width:95,fontSize:11}}/>
                      </td>
                      <td style={{padding:'5px 8px',textAlign:'center'}}>
                        <span style={{fontWeight:700,color:hrs>0?C.teal:C.textMut,fontSize:13}}>{hrs>0?`${hrs}h`:'-'}</span>
                      </td>
                      <td style={{padding:'5px 4px'}}>
                        <button onClick={()=>removeActivity(row._k)} style={{background:'none',border:'none',cursor:'pointer',color:C.red,fontSize:16,lineHeight:1,padding:'0 4px'}}>×</button>
                      </td>
                    </tr>);})}
              </tbody>
            </table>
            <button onClick={addActivity} style={{marginTop:8,background:'none',border:'none',color:C.blue,fontSize:12,cursor:'pointer',padding:'4px 0',display:'flex',alignItems:'center',gap:4,fontWeight:600}}>
              + Aktivite Ekle
            </button>
          </div>)}
      </div>

      {/* SECTION 4: Sondaj Verisi */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:16,overflow:'hidden',boxShadow:C.shadow}}>
        <SectionHeader id="drilling" title="Sondaj Verisi" num="4"
          badge={totalDist>0?`${totalDist.toFixed(1)}m`:null}/>
        {open.drilling&&(
          <div style={{padding:16}}>
            {rop&&(
              <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:8,padding:'8px 14px',marginBottom:12,fontSize:12,display:'flex',gap:16,alignItems:'center'}}>
                <span style={{color:C.textMut}}>Otomatik hesaplama:</span>
                <span><strong style={{color:C.blue}}>ROP = {rop} m/saat</strong></span>
                <span style={{color:C.textMut,fontSize:11}}>{totalDist.toFixed(1)}m ÷ {drillingHrs}h drilling</span>
              </div>)}
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  {['Kuyu','Derinlik Başlangıç (m)','Derinlik Bitiş (m)','Mesafe',''].map(h=>(
                    <th key={h} style={{padding:'6px 8px',fontSize:10,fontWeight:700,color:C.textMut,textAlign:'left',textTransform:'uppercase',letterSpacing:.5}}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {drillRecs.map(row=>{
                  const dist=Math.max(0,(parseFloat(row.to)||0)-(parseFloat(row.from)||0));
                  const lastDepth=row.holeId!==''?holeLastDepths[row.holeId]:undefined;
                  const fromLocked=row.holeId!==''&&lastDepth!==undefined;
                  return(
                    <tr key={row._k} style={{borderBottom:`1px solid #f1f5f9`}}>
                      <td style={{padding:'5px 6px',minWidth:150}}>
                        <select value={row.holeId} onChange={e=>{
                          const h=holes.find(h=>h.id===e.target.value);
                          updateDrillRec(row._k,'holeId',e.target.value);
                          if(h){
                            updateDrillRec(row._k,'holeName',h.name);
                            fetchLastDepth(e.target.value,row._k);
                          }
                        }} style={{...sel,fontSize:11}}>
                          <option value="">Kuyu seç...</option>
                          {holes.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                      </td>
                      <td style={{padding:'5px 6px'}}>
                        <input type="number" value={row.from}
                          readOnly={fromLocked}
                          style={{...inp,width:100,fontSize:11,
                            background:fromLocked?'#f0fdf4':'#fff',
                            color:fromLocked?C.green:'#0f172a',
                            fontWeight:fromLocked?700:400}}
                          onChange={e=>!fromLocked&&updateDrillRec(row._k,'from',e.target.value)}
                          placeholder="0"/>
                        {fromLocked&&<div style={{fontSize:9,color:C.green,marginTop:2,fontWeight:600}}>✓ Son kayıt: {lastDepth}m</div>}
                      </td>
                      <td style={{padding:'5px 6px'}}>
                        <input type="number" value={row.to}
                          onChange={e=>updateDrillRec(row._k,'to',e.target.value)}
                          style={{...inp,width:100,fontSize:11}} placeholder="0"/>
                      </td>
                      <td style={{padding:'5px 8px'}}>
                        <span style={{fontWeight:700,color:dist>0?C.green:C.textMut,fontSize:14}}>
                          {dist>0?`${dist.toFixed(1)} m`:'—'}
                        </span>
                      </td>
                      <td style={{padding:'5px 4px'}}>
                        <button onClick={()=>removeDrillRec(row._k)} style={{background:'none',border:'none',cursor:'pointer',color:C.red,fontSize:16,lineHeight:1,padding:'0 4px'}}>×</button>
                      </td>
                    </tr>);})}
              </tbody>
            </table>
            <button onClick={addDrillRec} style={{marginTop:8,background:'none',border:'none',color:C.blue,fontSize:12,cursor:'pointer',padding:'4px 0',display:'flex',alignItems:'center',gap:4,fontWeight:600}}>
              + Sondaj Kaydı Ekle
            </button>
          </div>)}
      </div>

      {/* Footer */}
      <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingBottom:24}}>
        <Btn ch="İptal" onClick={()=>nav('dsr')}/>
        <Btn ch={saving?"Kaydediliyor...":"Gönder →"} variant="primary" onClick={handleSave}/>
      </div>
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
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <Btn ch="+ New DSR" variant="primary" onClick={()=>nav("dsr-create")}/>
          <Btn ch="Bulk Export" sm icon={Ic.dl}/>
        </div>
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
                <Td ch={
                  <div style={{display:'flex',gap:4,alignItems:'center'}}>
                    {r.status==='PENDING APPROVAL'
                      ?<IBtn icon={Ic.edit} color={C.teal} title="Düzenle"
                          onClick={e=>{e.stopPropagation();nav("dsr-create",{dsrId:r.id});}}/>
                      :<span title="Kilitli" style={{fontSize:12,color:C.textMut}}>🔒</span>}
                    <IBtn icon={Ic.dl} color={C.textMut} onClick={e=>e.stopPropagation()}/>
                  </div>}/>
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
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>+ Add</button>
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
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>+ Add</button>
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
          + Add
        </button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};

// ── BIT MODAL (with usage records) ───────────────────────────────────────────
const BitModal=({open,onClose,onSaved,initialData,clients,contracts,projects,holes})=>{
  const [serial,setSerial]=useState("");
  const [status,setStatus]=useState("Active");
  const [model,setModel]=useState("");
  const [bitSize,setBitSize]=useState("");
  const [clientId,setClientId]=useState("");
  const [contractId,setContractId]=useState("");
  const [projectId,setProjectId]=useState("");
  const [records,setRecords]=useState([]);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");

  // Toplam mesafe otomatik hesapla
  const totalDist=useMemo(()=>records.reduce((sum,r)=>{
    const d=(parseFloat(r.depth_to)||0)-(parseFloat(r.depth_from)||0);
    return sum+(d>0?d:0);
  },0),[records]);

  useEffect(()=>{
    if(open){
      setSerial(initialData?.serial_number||"");
      setStatus(initialData?.status||"Active");
      setModel(initialData?.model||"");
      setBitSize(initialData?.bit_size||"");
      setClientId(initialData?.client_id||"");
      setContractId(initialData?.contract_id||"");
      setProjectId(initialData?.project_id||"");
      setError("");
      // Mevcut kayıtları çek
      if(initialData?.id){
        supabase.from('bit_usage_records').select('*').eq('bit_id',initialData.id).order('created_at')
          .then(({data})=>setRecords((data||[]).map(r=>({...r,_key:r.id}))));
      } else {
        setRecords([]);
      }
    }
  },[open,initialData]);

  const addRow=()=>setRecords(p=>[...p,{_key:Date.now(),hole_id:"",hole_name:"",depth_from:"",depth_to:""}]);

  const updateRow=(key,field,val)=>setRecords(p=>p.map(r=>r._key===key?{...r,[field]:val}:r));

  const removeRow=async(row)=>{
    if(row.id){
      await supabase.from('bit_usage_records').delete().eq('id',row.id);
    }
    setRecords(p=>p.filter(r=>r._key!==row._key));
  };

  const handleSave=async()=>{
    if(!serial.trim()){setError("Serial number zorunlu!");return;}
    setSaving(true);
    // Bit kaydet
    const payload={
      serial_number:serial.trim(),status,model:model||null,bit_size:bitSize||null,
      client_id:clientId||null,contract_id:contractId||null,project_id:projectId||null,
      total_distance:totalDist
    };
    let bitId=initialData?.id;
    if(bitId){
      const r=await supabase.from('bits').update(payload).eq('id',bitId);
      if(r.error){setSaving(false);setError(r.error.message);return;}
    } else {
      const r=await supabase.from('bits').insert(payload).select('id').single();
      if(r.error){setSaving(false);setError(r.error.message);return;}
      bitId=r.data.id;
    }
    // Usage records kaydet
    for(const row of records){
      if(!row.depth_from&&!row.depth_to&&!row.hole_name)continue;
      const rec={bit_id:bitId,hole_id:row.hole_id||null,hole_name:row.hole_name||null,depth_from:parseFloat(row.depth_from)||0,depth_to:parseFloat(row.depth_to)||0};
      if(row.id){
        await supabase.from('bit_usage_records').update(rec).eq('id',row.id);
      } else {
        await supabase.from('bit_usage_records').insert(rec);
      }
    }
    // Total distance güncelle
    await supabase.from('bits').update({total_distance:totalDist}).eq('id',bitId);
    setSaving(false);
    onSaved();onClose();
  };

  if(!open)return null;
  const inp={padding:"7px 10px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:6,boxSizing:"border-box",outline:"none"};
  const lbl={display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:4,textTransform:"uppercase",letterSpacing:.5};
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:24,width:640,maxHeight:"90vh",overflow:"auto",boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Bit":"Add Bit"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:12}}>{error}</div>}

        {/* Temel bilgiler */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={lbl}>Serial Number *</label><input value={serial} onChange={e=>setSerial(e.target.value)} style={{...inp,width:"100%"}} placeholder="e.g. BIT-2024-001"/></div>
          <div><label style={lbl}>Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={{...inp,width:"100%",appearance:"none"}}>
              <option>Active</option><option>Complete-Damaged</option><option>Complete-Worn Flat</option><option>Complete-Left in Hole</option><option>Complete-Worn Inner</option>
            </select></div>
          <div><label style={lbl}>Model</label><input value={model} onChange={e=>setModel(e.target.value)} style={{...inp,width:"100%"}} placeholder="e.g. HQ3"/></div>
          <div><label style={lbl}>Bit Size</label><input value={bitSize} onChange={e=>setBitSize(e.target.value)} style={{...inp,width:"100%"}} placeholder="e.g. HQ"/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:18}}>
          <div><label style={lbl}>Client</label>
            <select value={clientId} onChange={e=>setClientId(e.target.value)} style={{...inp,width:"100%",appearance:"none"}}>
              <option value="">Select...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
          <div><label style={lbl}>Contract</label>
            <select value={contractId} onChange={e=>setContractId(e.target.value)} style={{...inp,width:"100%",appearance:"none"}}>
              <option value="">Select...</option>{contracts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
          <div><label style={lbl}>Project</label>
            <select value={projectId} onChange={e=>setProjectId(e.target.value)} style={{...inp,width:"100%",appearance:"none"}}>
              <option value="">Select...</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>
        </div>

        {/* Kuyu / Derinlik kayıtları */}
        <div style={{background:"#f8fafc",borderRadius:8,padding:14,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>Kuyu Kullanım Kayıtları</span>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:12,color:"#64748b"}}>
                Toplam: <strong style={{color:"#2563eb"}}>{totalDist.toFixed(2)} m</strong>
              </span>
              <button onClick={addRow}
                style={{padding:"4px 12px",fontSize:12,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:5,cursor:"pointer"}}>
                + Ekle
              </button>
            </div>
          </div>
          {records.length===0?(
            <div style={{textAlign:"center",padding:"16px 0",color:"#94a3b8",fontSize:13}}>
              Henüz kayıt yok — "+ Ekle" ile kuyu ve derinlik bilgisi gir
            </div>
          ):(
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr>
                  {["Kuyu Adı","Derinlik (m)","Kadar (m)","Mesafe",""].map(h=>(
                    <th key={h} style={{padding:"6px 8px",fontSize:11,fontWeight:700,color:"#475569",
                      background:"#f1f5f9",borderBottom:"1px solid #e2e8f0",textAlign:"left",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {records.map(row=>{
                  const dist=Math.max(0,(parseFloat(row.depth_to)||0)-(parseFloat(row.depth_from)||0));
                  return(
                    <tr key={row._key}>
                      <td style={{padding:"5px 6px"}}>
                        {holes.length>0
                          ?<select value={row.hole_id||""} onChange={e=>{
                              const h=holes.find(h=>h.id===e.target.value);
                              updateRow(row._key,"hole_id",e.target.value);
                              if(h)updateRow(row._key,"hole_name",h.name);
                            }} style={{...inp,width:"100%",appearance:"none",fontSize:12}}>
                              <option value="">Seç veya yaz...</option>
                              {holes.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                          :<input value={row.hole_name||""} onChange={e=>updateRow(row._key,"hole_name",e.target.value)}
                              style={{...inp,width:"100%",fontSize:12}} placeholder="Kuyu adı"/>}
                      </td>
                      <td style={{padding:"5px 6px"}}>
                        <input type="number" value={row.depth_from||""} onChange={e=>updateRow(row._key,"depth_from",e.target.value)}
                          style={{...inp,width:80,fontSize:12}} placeholder="0"/>
                      </td>
                      <td style={{padding:"5px 6px"}}>
                        <input type="number" value={row.depth_to||""} onChange={e=>updateRow(row._key,"depth_to",e.target.value)}
                          style={{...inp,width:80,fontSize:12}} placeholder="0"/>
                      </td>
                      <td style={{padding:"5px 8px",fontSize:13,fontWeight:700,color:dist>0?"#16a34a":"#94a3b8"}}>
                        {dist>0?`${dist.toFixed(1)} m`:"—"}
                      </td>
                      <td style={{padding:"5px 4px"}}>
                        <button onClick={()=>removeRow(row)}
                          style={{background:"none",border:"none",cursor:"pointer",color:"#ef4444",fontSize:16,lineHeight:1}}>×</button>
                      </td>
                    </tr>);
                })}
              </tbody>
            </table>)}
        </div>

        {/* Footer */}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>
            {saving?"Saving...":"Save"}
          </button>
        </div>
      </div>
    </div>);
};

const BitsPage=({nav})=>{
  const [bits,setBits]=useState([]);
  const [clients,setClients]=useState([]);
  const [contracts,setContracts]=useState([]);
  const [projects,setProjects]=useState([]);
  const [holes,setHoles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all"),[fSize,setFSize]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const fetchAll=useCallback(async()=>{
    setLoading(true);
    const [b,cl,co,pr,h]=await Promise.all([
      supabase.from('bits').select('*, clients(name), contracts(name), projects(name)').order('serial_number'),
      supabase.from('clients').select('id,name').order('name'),
      supabase.from('contracts').select('id,name').order('name'),
      supabase.from('projects').select('id,name').order('name'),
      supabase.from('holes').select('id,name').order('name'),
    ]);
    setBits(b.data||[]);setClients(cl.data||[]);setContracts(co.data||[]);
    setProjects(pr.data||[]);setHoles(h.data||[]);
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
      <BitModal open={modalOpen} onClose={()=>setModalOpen(false)} onSaved={()=>{fetchAll();doToast("✓ Kaydedildi");}}
        initialData={editData} clients={clients} contracts={contracts} projects={projects} holes={holes}/>
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
                <Td ch={<strong style={{color:C.green}}>{r.total_distance?`${r.total_distance} m`:"—"}</strong>}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"} variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>+ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:10}}><Btn ch="Import Bits" sm icon={Ic.ul}/></div>
    </div>);
};

// ── CONSUMABLE MODAL ─────────────────────────────────────────────────────────
const ConsumableModal=({open,onClose,onSaved,initialData,cats})=>{
  const [name,setName]=useState("");
  const [catId,setCatId]=useState("");
  const [rate,setRate]=useState("");
  const [rateType,setRateType]=useState("");
  const [currency,setCurrency]=useState("USD");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(open){
      setName(initialData?.name||"");
      setCatId(initialData?.category_id||"");
      setRate(initialData?.rate||"");
      setRateType(initialData?.rate_type||"");
      setCurrency(initialData?.currency||"USD");
      setError("");
    }
  },[open,initialData]);
  const handleSave=async()=>{
    if(!name.trim()){setError("İsim zorunlu!");return;}
    setSaving(true);
    const payload={
      name:name.trim(),category_id:catId||null,
      rate:rate?parseFloat(rate):null,
      rate_type:rateType||null,
      currency:currency||"USD"
    };
    const r=initialData?.id
      ?await supabase.from('consumables').update(payload).eq('id',initialData.id)
      :await supabase.from('consumables').insert({...payload,status:'Active'});
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
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Consumable":"Add Consumable"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:14}}>{error}</div>}
        <div style={{marginBottom:14}}><label style={l}>Consumable Name *</label>
          <input value={name} onChange={e=>setName(e.target.value)} style={s} placeholder="e.g. HQ INNERTUBE 3M"/></div>
        <div style={{marginBottom:14}}><label style={l}>Category</label>
          <select value={catId} onChange={e=>setCatId(e.target.value)} style={{...s,appearance:"none"}}>
            <option value="">Select category...</option>
            {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
          <div><label style={l}>Rate</label>
            <input type="number" value={rate} onChange={e=>setRate(e.target.value)} style={s} placeholder="0.00"/></div>
          <div><label style={l}>Rate Type</label>
            <input value={rateType} onChange={e=>setRateType(e.target.value)} style={s} placeholder="e.g. Per Unit"/></div>
          <div><label style={l}>Currency</label>
            <select value={currency} onChange={e=>setCurrency(e.target.value)} style={{...s,appearance:"none"}}>
              <option>USD</option><option>SAR</option><option>EUR</option><option>AUD</option>
            </select></div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

// ── CATEGORY MODAL ────────────────────────────────────────────────────────────
const CategoryModal=({open,onClose,onSaved,initialData})=>{
  const [name,setName]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{if(open){setName(initialData?.name||"");setError("");}},[open,initialData]);
  const handleSave=async()=>{
    if(!name.trim()){setError("İsim zorunlu!");return;}
    setSaving(true);
    const r=initialData?.id
      ?await supabase.from('consumable_categories').update({name:name.trim()}).eq('id',initialData.id)
      :await supabase.from('consumable_categories').insert({name:name.trim(),status:'Active'});
    setSaving(false);
    if(r.error){setError(r.error.message);return;}
    onSaved();onClose();
  };
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:24,width:380,boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <strong style={{fontSize:15,fontWeight:700}}>{initialData?.id?"Edit Category":"Add Category"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:12}}>{error}</div>}
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Category Name *</label>
          <input value={name} onChange={e=>setName(e.target.value)}
            style={{width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"}}
            placeholder="e.g. HQ"/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#7c3aed",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

// ── CONSUMABLES (Supabase) ────────────────────────────────────────────────────
const ConsumablesPage=({nav})=>{
  const [consumables,setConsumables]=useState([]);
  const [cats,setCats]=useState([]);
  const [loading,setLoading]=useState(true);
  const [q,setQ]=useState(""),[fCat,setFCat]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [showCats,setShowCats]=useState(false);
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const [catModalOpen,setCatModalOpen]=useState(false),[catEditData,setCatEditData]=useState(null);
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
  const handleCatToggle=async(cat)=>{
    const s=cat.status==="Active"?"InActive":"Active";
    await supabase.from('consumable_categories').update({status:s}).eq('id',cat.id);
    doToast(`✓ ${cat.name} → ${s}`);fetchAll();
  };
  const handleCatDelete=async(cat)=>{
    if(!window.confirm(`"${cat.name}" silinsin mi?`))return;
    const {error}=await supabase.from('consumable_categories').delete().eq('id',cat.id);
    if(error)doToast("Hata: "+error.message);else{doToast("✓ Silindi");fetchAll();}
  };
  const filtered=useMemo(()=>consumables.filter(r=>{
    const okC=fCat==="all"||(r.consumable_categories?.name===fCat);
    const okQ=!q||r.name?.toLowerCase().includes(q.toLowerCase());
    return okC&&okQ;
  }),[consumables,fCat,q]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <ConsumableModal open={modalOpen} onClose={()=>setModalOpen(false)}
        onSaved={()=>{fetchAll();doToast("✓ Kaydedildi");}} initialData={editData} cats={cats}/>
      <CategoryModal open={catModalOpen} onClose={()=>setCatModalOpen(false)}
        onSaved={()=>{fetchAll();doToast("✓ Kategori kaydedildi");}} initialData={catEditData}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Consumables"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <FSel label="Category" opts={cats.map(c=>c.name)} val={fCat} onChange={v=>{setFCat(v);setPage(1);}} w={170}/>
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
                <Td ch={<>
                  <IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setEditData(r);setModalOpen(true);}}/>
                  <IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/>
                </>}/>
                <Td ch={<strong>{r.name}</strong>}/>
                <Td ch={r.consumable_categories?.name||"—"}/>
                <Td ch={r.rate?`${r.rate} ${r.currency||""}`:"—"}/>
                <Td ch={r.rate_type||"—"}/>
                <Td ch={r.currency||"—"}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"}
                  variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",
            color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>+ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{marginTop:10}}><Btn ch="Import Consumables" sm icon={Ic.ul}/></div>

      {/* Manage Categories Modal */}
      <Modal open={showCats} onClose={()=>setShowCats(false)} title="Manage Categories" w={520}>
        <Card p={0} mb={12}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              <Th ch="" w={60}/><Th ch="Category Name"/><Th ch="Status"/>
              <th style={{width:100,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
            </tr></thead>
            <tbody>
              {cats.length===0?<NoRows/>:cats.map(cat=>(
                <tr key={cat.id}>
                  <Td ch={<>
                    <IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setCatEditData(cat);setCatModalOpen(true);}}/>
                    <IBtn icon={Ic.trash} color={C.red} onClick={()=>handleCatDelete(cat)}/>
                  </>}/>
                  <Td ch={<strong>{cat.name}</strong>}/>
                  <Td ch={<Badge s={cat.status} sm/>}/>
                  <Td ch={<Btn ch={cat.status==="Active"?"Deactivate":"Activate"}
                    variant={cat.status==="Active"?"gray":"teal"} sm onClick={()=>handleCatToggle(cat)}/>}/>
                </tr>))}
            </tbody>
          </table>
        </Card>
        <button onClick={()=>{setCatEditData(null);setCatModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",
            color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>+ Add Category</button>
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
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>+ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};


// ── EQUIPMENT UNIT MODAL ─────────────────────────────────────────────────────
const EquipmentUnitModal=({open,onClose,onSaved,initialData})=>{
  const [equip,setEquip]=useState("");
  const [unitNum,setUnitNum]=useState("");
  const [equipType,setEquipType]=useState("");
  const [year,setYear]=useState("");
  const [make,setMake]=useState("");
  const [model,setModel]=useState("");
  const [vin,setVin]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(open){
      setEquip(initialData?.equip||"");setUnitNum(initialData?.unit_number||"");
      setEquipType(initialData?.equipment_type_name||"");setYear(initialData?.year||"");
      setMake(initialData?.make||"");setModel(initialData?.model||"");
      setVin(initialData?.vin||"");setError("");
    }
  },[open,initialData]);
  const handleSave=async()=>{
    if(!equip.trim()){setError("Equipment adı zorunlu!");return;}
    setSaving(true);
    const payload={
      equip:equip.trim(),unit_number:parseInt(unitNum)||1,
      equipment_type_name:equipType||null,year:parseInt(year)||null,
      make:make||null,model:model||null,vin:vin||null,status:'Active'
    };
    const r=initialData?.id
      ?await supabase.from('equipment_units').update(payload).eq('id',initialData.id)
      :await supabase.from('equipment_units').insert(payload);
    setSaving(false);
    if(r.error){setError(r.error.message);return;}
    onSaved();onClose();
  };
  if(!open)return null;
  const s={width:"100%",padding:"9px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"};
  const l={display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5};
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(15,23,42,.5)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:500,boxShadow:"0 24px 48px rgba(15,23,42,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <strong style={{fontSize:16,fontWeight:700}}>{initialData?.id?"Edit Equipment Unit":"Add Equipment Unit"}</strong>
          <button onClick={onClose} style={{background:"#f1f5f9",border:"none",cursor:"pointer",width:28,height:28,borderRadius:6,fontSize:16,color:"#64748b"}}>×</button>
        </div>
        {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"8px 12px",borderRadius:6,fontSize:12,marginBottom:14}}>{error}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><label style={l}>Equipment Name *</label>
            <select value={equip} onChange={e=>setEquip(e.target.value)} style={{...s,appearance:"none"}}>
              <option value="">Select type...</option>
              {EQUIP_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
            </select></div>
          <div><label style={l}>Unit Number</label>
            <input type="number" value={unitNum} onChange={e=>setUnitNum(e.target.value)} style={s} placeholder="e.g. 1"/></div>
          <div><label style={l}>Equipment Type</label>
            <input value={equipType} onChange={e=>setEquipType(e.target.value)} style={s} placeholder="e.g. Transportation"/></div>
          <div><label style={l}>Year</label>
            <input type="number" value={year} onChange={e=>setYear(e.target.value)} style={s} placeholder="e.g. 2022"/></div>
          <div><label style={l}>Make</label>
            <input value={make} onChange={e=>setMake(e.target.value)} style={s} placeholder="e.g. MITSUBISHI"/></div>
          <div><label style={l}>Model</label>
            <input value={model} onChange={e=>setModel(e.target.value)} style={s} placeholder="e.g. L200Pickup"/></div>
          <div style={{gridColumn:"span 2"}}><label style={l}>VIN / Serial Number</label>
            <input value={vin} onChange={e=>setVin(e.target.value)} style={s} placeholder="e.g. 4906 XXB"/></div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
          <button onClick={onClose} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#f1f5f9",color:"#334155",border:"1px solid #e2e8f0",borderRadius:6,cursor:"pointer"}}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{padding:"7px 16px",fontSize:13,fontWeight:600,background:"#2563eb",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:saving?.6:1}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>);
};

// ── EQUIPMENT (Supabase) ──────────────────────────────────────────────────────
const EquipmentPage=({nav})=>{
  const [units,setUnits]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selType,setSelType]=useState("");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const [modalOpen,setModalOpen]=useState(false),[editData,setEditData]=useState(null);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};

  const fetchUnits=useCallback(async()=>{
    setLoading(true);
    const {data}=await supabase.from('equipment_units').select('*').order('equip');
    setUnits(data||[]);setLoading(false);
  },[]);
  useEffect(()=>{fetchUnits();},[fetchUnits]);

  const handleDelete=async(r)=>{
    if(!window.confirm(`Unit ${r.unit_number} silinsin mi?`))return;
    const {error}=await supabase.from('equipment_units').delete().eq('id',r.id);
    if(error)doToast("Hata: "+error.message);else{doToast("✓ Silindi");fetchUnits();}
  };
  const handleToggle=async(r)=>{
    const s=r.status==="Active"?"InActive":"Active";
    await supabase.from('equipment_units').update({status:s}).eq('id',r.id);
    doToast(`✓ Unit ${r.unit_number} → ${s}`);fetchUnits();
  };

  // Type tileleri için unique equipment names
  const equipNames=useMemo(()=>[...new Set(units.map(u=>u.equip).filter(Boolean))],[units]);
  const filtered=useMemo(()=>selType?units.filter(u=>u.equip===selType):units,[units,selType]);
  const {items,total}=pg(filtered,page,10);

  return(
    <div>
      <Toast msg={toast}/>
      <EquipmentUnitModal open={modalOpen} onClose={()=>setModalOpen(false)}
        onSaved={()=>{fetchUnits();doToast("✓ Kaydedildi");}} initialData={editData}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Equipment"}]} nav={nav}/>

      {/* Equipment type tiles */}
      <Card mb={16}>
        <SH title="Equipment Types" action={
          <span style={{fontSize:12,color:C.textMut}}>
            {selType&&<button onClick={()=>setSelType("")}
              style={{background:"none",border:"none",cursor:"pointer",color:C.blue,fontSize:12,fontWeight:600}}>
              Tümünü göster ×
            </button>}
          </span>}/>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {EQUIP_TYPES.map(t=>{
            const count=units.filter(u=>u.equip===t).length;
            return(
              <div key={t} onClick={()=>setSelType(selType===t?"":t)}
                style={{padding:"10px 16px",border:`1.5px solid ${selType===t?C.blue:C.border}`,
                  borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,
                  background:selType===t?"#eff6ff":C.white,color:selType===t?C.blue:C.textSec,
                  transition:"all .15s",boxShadow:C.shadow,display:"flex",alignItems:"center",gap:8}}>
                {t}
                {count>0&&<span style={{fontSize:11,background:selType===t?"#dbeafe":"#f1f5f9",
                  color:selType===t?C.blue:C.textMut,padding:"1px 6px",borderRadius:10}}>
                  {count}
                </span>}
              </div>);})}
        </div>
      </Card>

      <div style={{fontWeight:700,fontSize:15,color:C.textPri,marginBottom:10}}>
        Equipment Units {selType&&<span style={{color:C.textMut,fontWeight:400,fontSize:13}}>— {selType}</span>}
      </div>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/><Th ch="Equipment"/><Th ch="Unit #"/><Th ch="Type"/>
            <Th ch="Year"/><Th ch="Make"/><Th ch="Model"/><Th ch="VIN"/><Th ch="Status"/>
            <th style={{width:110,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={10} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<>
                  <IBtn icon={Ic.edit} color={C.teal} onClick={()=>{setEditData(r);setModalOpen(true);}}/>
                  <IBtn icon={Ic.trash} color={C.red} onClick={()=>handleDelete(r)}/>
                </>}/>
                <Td ch={<strong>{r.equip}</strong>}/>
                <Td ch={r.unit_number}/>
                <Td ch={r.equipment_type_name||"—"}/>
                <Td ch={r.year||"—"}/><Td ch={r.make||"—"}/><Td ch={r.model||"—"}/><Td ch={r.vin||"—"}/>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"}
                  variant={r.status==="Active"?"gray":"teal"} sm onClick={()=>handleToggle(r)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={()=>{setEditData(null);setModalOpen(true);}}
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",
            color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>+ Add</button>
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
                  + Add
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
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>+ Add</button>
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
          style={{padding:"7px 14px",fontSize:13,background:"none",border:"none",cursor:"pointer",color:C.blue,fontWeight:600,display:"flex",alignItems:"center",gap:4,marginTop:8}}>+ Add</button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};


// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
const LoginPage=()=>{
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const handleLogin=async(e)=>{
    e.preventDefault();setLoading(true);setError("");
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setError(error.message);setLoading(false);}
  };
  return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:12,padding:36,width:380,boxShadow:"0 24px 48px rgba(0,0,0,.4)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <img src="/logo.png" alt="AEB" style={{width:44,height:44,objectFit:"contain"}} onError={e=>{e.target.style.display="none";}}/>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#2563eb",letterSpacing:.3,lineHeight:1.3}}>AEB Operations</div>
            <div style={{fontSize:14,fontWeight:800,color:"#2563eb",letterSpacing:.3}}>Intelligence™</div>
          </div>
        </div>
        <h1 style={{fontSize:18,fontWeight:700,color:"#0f172a",marginBottom:4}}>Giriş Yap</h1>
        <p style={{fontSize:13,color:"#64748b",marginBottom:24}}>Hesabınızla devam edin</p>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@sirket.com" required
              style={{width:"100%",padding:"10px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"}}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:"#334155",marginBottom:5,textTransform:"uppercase",letterSpacing:.5}}>Şifre</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required
              style={{width:"100%",padding:"10px 12px",fontSize:13,border:"1px solid #e2e8f0",borderRadius:7,boxSizing:"border-box",outline:"none"}}/>
          </div>
          {error&&<div style={{background:"#fff1f2",color:"#be123c",padding:"10px 12px",borderRadius:6,fontSize:12,marginBottom:14,border:"1px solid #fecdd3"}}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{width:"100%",padding:11,fontSize:14,fontWeight:700,background:loading?"#93c5fd":"#2563eb",color:"#fff",border:"none",borderRadius:7,cursor:loading?"default":"pointer"}}>
            {loading?"Giriş yapılıyor...":"Giriş Yap"}
          </button>
        </form>
        <p style={{marginTop:20,textAlign:"center",fontSize:11,color:"#94a3b8"}}>© 2026 AEB Operations Intelligence™</p>
      </div>
    </div>);
};

// ── USER MANAGEMENT PAGE ──────────────────────────────────────────────────────
const UsersPage=({nav,currentUser})=>{
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const fetchUsers=useCallback(async()=>{
    setLoading(true);
    const {data}=await supabase.from('user_profiles').select('*').order('email');
    setUsers(data||[]);setLoading(false);
  },[]);
  useEffect(()=>{fetchUsers();},[fetchUsers]);
  const handleRoleChange=async(id,role)=>{
    const {error}=await supabase.from('user_profiles').update({role}).eq('id',id);
    if(error)doToast("Hata: "+error.message);
    else{doToast(`✓ Rol → ${role}`);fetchUsers();}
  };
  const handleToggle=async(u)=>{
    await supabase.from('user_profiles').update({is_active:!u.is_active}).eq('id',u.id);
    doToast(`✓ ${u.email} güncellendi`);fetchUsers();
  };
  const rc={Admin:C.purple,Supervisor:C.blue,Viewer:C.teal};
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"User Management"}]} nav={nav}/>
      <Card p={0}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="Email"/><Th ch="Full Name"/><Th ch="Role"/><Th ch="Status"/><Th ch="Created"/>
            <th style={{width:100,background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}/>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={6} style={{textAlign:"center",padding:32,color:C.textMut}}>Loading...</td></tr>
            :users.length===0?<NoRows/>:users.map(u=>(
              <tr key={u.id}>
                <Td ch={<strong>{u.email}</strong>}/>
                <Td ch={u.full_name||"—"}/>
                <Td ch={
                  <select value={u.role} onChange={e=>handleRoleChange(u.id,e.target.value)}
                    disabled={u.id===currentUser?.id}
                    style={{padding:"4px 10px",fontSize:12,fontWeight:700,border:`1.5px solid ${rc[u.role]||C.border}`,
                      borderRadius:5,color:rc[u.role],background:"#fff",cursor:"pointer",appearance:"none"}}>
                    {["Admin","Supervisor","Viewer"].map(r=><option key={r} value={r}>{r}</option>)}
                  </select>}/>
                <Td ch={<span style={{fontSize:11,background:u.is_active?"#f0fdf4":"#f8fafc",
                  color:u.is_active?C.green:C.textMut,padding:"2px 8px",borderRadius:10,fontWeight:600}}>
                  {u.is_active?"Active":"Inactive"}</span>}/>
                <Td ch={u.created_at?.split("T")[0]||"—"}/>
                <Td ch={u.id!==currentUser?.id&&(
                  <Btn ch={u.is_active?"Deactivate":"Activate"} variant={u.is_active?"gray":"teal"} sm onClick={()=>handleToggle(u)}/>)}/>
              </tr>))}
          </tbody>
        </table>
      </Card>
      <div style={{marginTop:12,padding:12,background:"#fffbeb",borderRadius:8,border:"1px solid #fde68a",fontSize:12,color:"#92400e"}}>
        💡 <strong>Yeni kullanıcı eklemek için:</strong> Supabase Dashboard → Authentication → Users → Invite user
      </div>
    </div>);
};

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const Sidebar=({page,nav,user,role,onLogout,isOpen,onClose})=>{
  const [mgmtOpen,setMgmtOpen]=useState(true);
  const [presetsOpen,setPresetsOpen]=useState(true);
  const isActive=p=>p===page;
  const rc={Admin:C.purple,Supervisor:C.blue,Viewer:C.teal};
  const NavItem=({label,p,badge,indent})=>{
    const active=isActive(p);
    return(
      <div onClick={()=>{nav(p);onClose&&onClose();}}
        style={{display:"flex",alignItems:"center",padding:"8px 16px 8px "+(indent?36:16)+"px",
          cursor:"pointer",borderRadius:6,margin:"1px 8px",
          background:active?C.sidebarActive:"transparent",transition:"background .15s"}}>
        {indent&&<span style={{width:6,height:6,borderRadius:"50%",
          background:active?C.sidebarActiveText:C.sidebarText,flexShrink:0,marginRight:10}}/>}
        <span style={{flex:1,fontSize:13,fontWeight:active?700:500,
          color:active?C.sidebarActiveText:C.sidebarText,letterSpacing:.1}}>{label}</span>
        {badge&&<span style={{background:C.orange,color:"#fff",fontSize:10,fontWeight:800,
          padding:"2px 7px",borderRadius:20,minWidth:20,textAlign:"center"}}>{badge}</span>}
      </div>);
  };
  const GroupHeader=({label,open,setOpen})=>(
    <div onClick={()=>setOpen(o=>!o)}
      style={{display:"flex",alignItems:"center",padding:"7px 16px",cursor:"pointer",margin:"4px 8px 2px"}}>
      <span style={{flex:1,fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1.2}}>{label}</span>
      <span style={{color:"#64748b",fontSize:9,transition:"transform .2s",transform:open?"rotate(180deg)":"rotate(0)"}}>{Ic.chD}</span>
    </div>);
  return(
    <div style={{width:260,minWidth:260,background:C.sidebarBg,display:"flex",flexDirection:"column",
      height:"100vh",position:"sticky",top:0,flexShrink:0,borderRight:"1px solid rgba(255,255,255,.06)"}}>
      <div style={{padding:"16px 16px 14px",borderBottom:`1px solid ${C.sidebarBorder}`,display:"flex",alignItems:"center",gap:12}}>
        <img src="/logo.png" alt="AEB Logo" style={{width:36,height:36,objectFit:"contain",flexShrink:0,filter:"drop-shadow(0 2px 4px rgba(0,0,0,.3))"}}
          onError={e=>{e.target.style.display="none";}}/>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:800,color:"#f1f5f9",letterSpacing:.3,lineHeight:1.3}}>AEB Operations</div>
          <div style={{fontSize:12,fontWeight:800,color:"#60a5fa",letterSpacing:.3}}>Intelligence™</div>
        </div>
        {onClose&&<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:18,padding:2}}>×</button>}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"10px 0"}}>
        <NavItem label="Home" p="home"/>
        <NavItem label="Daily Shift Report" p="dsr"/>
        <NavItem label="Timesheet" p="timesheet"/>
        <GroupHeader label="Management" open={mgmtOpen} setOpen={setMgmtOpen}/>
        {mgmtOpen&&<>
          <NavItem label="Clients" p="clients" indent/>
          <NavItem label="Contracts" p="contracts" indent/>
          <NavItem label="Projects" p="projects" indent/>
          <NavItem label="Holes" p="holes" indent/>
          <NavItem label="Bits" p="bits" indent/>
          {role==="Admin"&&<NavItem label="Users" p="users" indent/>}
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
      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.sidebarBorder}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,background:rc[role]||C.blue,borderRadius:"50%",
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{user?.email?.[0]?.toUpperCase()||"U"}</span>
        </div>
        <div style={{flex:1,overflow:"hidden"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#f1f5f9",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email||"—"}</div>
          <div style={{fontSize:10,color:rc[role]||"#60a5fa",fontWeight:600,marginTop:1}}>{role||"Viewer"}</div>
        </div>
        <button onClick={onLogout} title="Çıkış Yap"
          style={{background:"rgba(255,255,255,.08)",border:"none",cursor:"pointer",
            color:"#94a3b8",display:"flex",alignItems:"center",padding:6,borderRadius:6}}>
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
  "consumables":"Consumables","employees":"Employees","equipment":"Equipment",
  "report-setup":"Report Setup","users":"User Management","dsr-create":"New Daily Shift Report",
};

const Topbar=({page,role,onMenuClick})=>{
  const rc={Admin:C.purple,Supervisor:C.blue,Viewer:C.teal};
  const rbc={Admin:"#faf5ff",Supervisor:"#eff6ff",Viewer:"#f0fdfa"};
  return(
    <div style={{height:52,background:C.white,borderBottom:`1px solid ${C.border}`,
      display:"flex",alignItems:"center",paddingRight:16,flexShrink:0,
      position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 2px rgba(0,0,0,.04)"}}>
      {/* Hamburger — sadece mobilde */}
      <button onClick={onMenuClick}
        style={{display:"none",background:"none",border:"none",cursor:"pointer",
          padding:"8px 14px",color:C.textSec,fontSize:20,lineHeight:1,
          id:"hamburger"}}
        className="mobile-menu-btn">
        ☰
      </button>
      <div style={{flex:1,padding:"0 16px"}}>
        <span style={{fontSize:14,fontWeight:700,color:C.textPri}}>
          {PAGE_TITLES[page]||"AEB Operations Intelligence™"}
        </span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {role&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,
          background:rbc[role]||"#f0fdfa",color:rc[role]||C.teal}}>{role}</span>}
        <button style={{width:28,height:28,borderRadius:"50%",background:"#1d4ed8",color:"#fff",
          border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>?</button>
      </div>
    </div>);
};

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("home");
  const [params,setParams]=useState({});
  const [authState,setAuthState]=useState("loading");
  const [user,setUser]=useState(null);
  const [role,setRole]=useState("Viewer");
  const [sidebarOpen,setSidebarOpen]=useState(false);

  // Mobil mi kontrol
  const [isMobile,setIsMobile]=useState(window.innerWidth<768);
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener('resize',check);
    return()=>window.removeEventListener('resize',check);
  },[]);

  const loadRole=useCallback(async(userId)=>{
    const {data}=await supabase.from('user_profiles').select('role,is_active').eq('id',userId).single();
    if(data){
      if(!data.is_active){await supabase.auth.signOut();setAuthState("unauthed");return;}
      setRole(data.role||"Viewer");
    }
    setAuthState("authed");
  },[]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session){setUser(session.user);loadRole(session.user.id);}
      else setAuthState("unauthed");
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session){setUser(session.user);loadRole(session.user.id);}
      else{setUser(null);setRole("Viewer");setAuthState("unauthed");}
    });
    return()=>subscription.unsubscribe();
  },[loadRole]);

  const handleLogout=async()=>{
    await supabase.auth.signOut();
    setPage("home");
  };

  const nav=(p,pr={})=>{
    setPage(p);setParams(pr);
    setSidebarOpen(false);
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const isAdmin=role==="Admin";

  const renderPage=()=>{
    if(page==="users"&&!isAdmin)return(
      <div style={{textAlign:"center",padding:60,color:C.textMut}}>
        <div style={{fontSize:32,marginBottom:12}}>🔒</div>
        <div style={{fontSize:15,fontWeight:600}}>Bu sayfaya erişim yetkiniz yok.</div>
      </div>);
    switch(page){
      case "home":         return <HomePage nav={nav}/>;
      case "dsr":          return <DSRPage nav={nav}/>;
      case "dsr-create":   return <DSRCreatePage nav={nav} params={params}/>;
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
      case "users":        return <UsersPage nav={nav} currentUser={user}/>;
      default:             return <HomePage nav={nav}/>;
    }
  };

  if(authState==="loading")return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",
      justifyContent:"center",flexDirection:"column",gap:12}}>
      <img src="/logo.png" alt="AEB" style={{width:56,height:56,objectFit:"contain",opacity:.8}}
        onError={e=>{e.target.style.display="none";}}/>
      <div style={{color:"#60a5fa",fontSize:14,fontWeight:600}}>AEB Operations Intelligence™</div>
      <div style={{color:"#475569",fontSize:12}}>Yükleniyor...</div>
    </div>);

  if(authState==="unauthed")return <LoginPage/>;

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,
      fontFamily:"'Inter','Segoe UI',system-ui,sans-serif"}}>

      {/* Mobil overlay */}
      {isMobile&&sidebarOpen&&(
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:998}}/>)}

      {/* Sidebar */}
      <div style={{
        position:isMobile?"fixed":"sticky",
        left:0,top:0,
        transform:isMobile?(sidebarOpen?"translateX(0)":"translateX(-100%)"):"translateX(0)",
        transition:"transform .25s ease",
        zIndex:999,
        height:"100vh",
        display:isMobile&&!sidebarOpen?"none":"flex",
        flexShrink:0,
      }}>
        <Sidebar page={page} nav={nav} user={user} role={role} onLogout={handleLogout}
          isOpen={sidebarOpen} onClose={isMobile?()=>setSidebarOpen(false):null}/>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{height:52,background:C.white,borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",paddingRight:16,flexShrink:0,
          position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 2px rgba(0,0,0,.04)"}}>
          {/* Hamburger — sadece mobilde */}
          {isMobile&&(
            <button onClick={()=>setSidebarOpen(true)}
              style={{background:"none",border:"none",cursor:"pointer",
                padding:"8px 14px",color:C.textSec,fontSize:22,lineHeight:1}}>
              ☰
            </button>)}
          <div style={{flex:1,padding:isMobile?"0 8px":"0 24px"}}>
            <span style={{fontSize:isMobile?13:14,fontWeight:700,color:C.textPri}}>
              {PAGE_TITLES[page]||"AEB Operations Intelligence™"}
            </span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {role&&!isMobile&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,
              background:role==="Admin"?"#faf5ff":role==="Supervisor"?"#eff6ff":"#f0fdfa",
              color:role==="Admin"?C.purple:role==="Supervisor"?C.blue:C.teal}}>{role}</span>}
            <button style={{width:28,height:28,borderRadius:"50%",background:"#1d4ed8",color:"#fff",
              border:"none",cursor:"pointer",fontWeight:700,fontSize:13}}>?</button>
          </div>
        </div>
        <main style={{flex:1,padding:isMobile?12:24,boxSizing:"border-box",overflowX:"hidden"}}>
          {renderPage()}
        </main>
        {!isMobile&&(
          <footer style={{borderTop:`1px solid ${C.border}`,padding:"10px 24px",background:C.white,
            display:"flex",justifyContent:"flex-end",alignItems:"center",
            fontSize:11,color:C.textMut,fontWeight:500}}>
            © 2026 AEB Operations Intelligence™ · Powered by Anıl Enis BALCI All Rights Reserved.
            <span style={{marginLeft:8,fontWeight:800,color:C.purple,fontSize:13}}>NS</span>
          </footer>)}
      </div>
    </div>);
}
