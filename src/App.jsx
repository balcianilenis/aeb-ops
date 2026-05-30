import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
  {id:9,shift:"DAY",date:"2026-05-26",status:"PENDING APPROVAL",drill:"BT-19",contract:"BM-NM Drilling Program 2024-2026 DD",project:"Massarah North DD 2026 Conversion",client:"Maaden BMNM",dist:0},
  {id:10,shift:"NIGHT",date:"2026-05-25",status:"APPROVED",drill:"BT-15",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:15.0},
  {id:11,shift:"DAY",date:"2026-05-25",status:"APPROVED",drill:"BT-15",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:0},
  {id:12,shift:"DAY",date:"2026-05-24",status:"VALIDATED",drill:"BT-03",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:8.5},
  {id:13,shift:"NIGHT",date:"2026-05-24",status:"VALIDATED",drill:"BT-03",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",dist:12},
  {id:14,shift:"DAY",date:"2026-05-23",status:"APPROVED",drill:"BT-04",contract:"ERD Drilling Program 2026 DD",project:"Mansourah GC",client:"Maaden Exploration",dist:20.5},
  {id:15,shift:"NIGHT",date:"2026-05-23",status:"APPROVED",drill:"BT-04",contract:"ERD Drilling Program 2026 DD",project:"Mansourah GC",client:"Maaden Exploration",dist:18},
];

const PROJECTS_DATA=[
  {id:1,status:"InActive",name:"ADW RCGC_2025",po:"",client:"Maaden BMNM",contract:"Drilling Exploration RC",location:"Ad Duwayhi",holes:641},
  {id:2,status:"InActive",name:"Al Amar UG 2025",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 - UG",location:"Al Amar",holes:71},
  {id:3,status:"InActive",name:"Amana East Scout RC",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",location:"Uruq 12",holes:3},
  {id:4,status:"InActive",name:"Amana RC Scout",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",location:"Uruq 11",holes:9},
  {id:5,status:"InActive",name:"Ar Rjum RCGC",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",location:"Ar Rjum",holes:1378},
  {id:6,status:"InActive",name:"Bulghah/Sukhaybarat Geotech",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",location:"",holes:0},
  {id:7,status:"InActive",name:"Mahd UG",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 - UG",location:"Mahd",holes:47},
  {id:8,status:"Active",name:"Mansourah GC",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",location:"Mansourah Massarah",holes:1281},
  {id:9,status:"Active",name:"MM Cluster",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",location:"MM Area",holes:204},
  {id:10,status:"Active",name:"Massarah North DD 2026 Conversion",po:"",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",location:"Mansourah Massarah",holes:52},
];

const HOLES_DATA=[
  {id:1,status:"Active",hole:"MN_RC_825_219",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",maxDepth:"46 m",lastActivity:"2025-03-07"},
  {id:2,status:"Active",hole:"MN_RC_825_237",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",maxDepth:"46 m",lastActivity:"2025-01-17"},
  {id:3,status:"Active",hole:"MN_RC_825_238",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",maxDepth:"46 m",lastActivity:"2025-01-17"},
  {id:4,status:"Active",hole:"MN_RC_825_241",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",maxDepth:"46 m",lastActivity:"2025-01-17"},
  {id:5,status:"Complete",hole:"UQ_GT26_004_R1",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",maxDepth:"120 m",lastActivity:"2026-05-22"},
  {id:6,status:"Active",hole:"AA25-001",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 - UG",project:"Al Amar UG 2025",maxDepth:"204 m",lastActivity:"2025-03-04"},
  {id:7,status:"Active",hole:"BN_DD_001",client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",maxDepth:"350 m",lastActivity:"2026-05-15"},
  {id:8,status:"Abandoned",hole:"TEST_HOLE_001",client:"Maaden BMNM",contract:"Drilling Exploration RC",project:"ADW RCGC_2025",maxDepth:"20 m",lastActivity:"2024-11-10"},
];

const DRILLS_DATA=[
  {id:1,status:"Active",name:"BT-01",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2020,purchDate:"2020-10-30",serial:"BT2500/2020-03"},
  {id:2,status:"Active",name:"BT-016",type:"Surface - Coring",make:"",model:"",year:null,purchDate:"",serial:""},
  {id:3,status:"Active",name:"BT-02",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2020,purchDate:"2020-10-30",serial:"BT2500/2020-02"},
  {id:4,status:"Active",name:"BT-021",type:"Surface - Coring",make:"",model:"",year:null,purchDate:"",serial:""},
  {id:5,status:"Active",name:"BT-03",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2020,purchDate:"2020-10-30",serial:"BT2500/2020-01"},
  {id:6,status:"Active",name:"BT-04",type:"Surface - Coring",make:"Boretech",model:"BT1500",year:2016,purchDate:"2016-10-30",serial:"BT1500-02/2016"},
  {id:7,status:"Active",name:"BT-05",type:"Surface - Coring",make:"Boretech",model:"BT1500",year:2020,purchDate:"2015-10-30",serial:"BT1500-0105"},
  {id:8,status:"Active",name:"BT-06",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2020,purchDate:"2020-10-30",serial:"BT2500/2020-05"},
  {id:9,status:"Active",name:"BT-10",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2021,purchDate:"2021-03-15",serial:"BT2500/2021-01"},
  {id:10,status:"Active",name:"BT-15",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2022,purchDate:"2022-06-01",serial:"BT2500/2022-01"},
  {id:11,status:"Active",name:"BT-20",type:"Surface - Coring",make:"Boretech",model:"BT2500",year:2023,purchDate:"2023-04-20",serial:"BT2500/2023-01"},
  {id:12,status:"Active",name:"UG-04",type:"Underground - Coring",make:"Boretech",model:"BT2500",year:2023,purchDate:"2023-01-15",serial:"BT2500/2023-04"},
];

const BITS_DATA=[
  {id:1,status:"Active",serial:"BIT-2024-001",make:"Boretech",model:"HQ3",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",size:"HQ3",type:"Diamond Core Bit",totalDist:"60 m",rate:""},
  {id:2,status:"Active",serial:"BIT-2024-002",make:"Boretech",model:"NQ",contract:"BM-NM Drilling Program 2024-2026 DD",project:"Al Amar UG 2025",client:"Maaden BMNM",size:"NQ",type:"Diamond Core Bit",totalDist:"204 m",rate:""},
  {id:3,status:"Complete-Damaged",serial:"BIT-2023-003",make:"Boart Longyear",model:"HQ",contract:"BM-NM Drilling Program 2024-2026 RC",project:"Mansourah GC",client:"Maaden BMNM",size:"HQ",type:"Diamond Core Bit",totalDist:"180 m",rate:""},
  {id:4,status:"Active",serial:"BIT-2025-004",make:"Atlas",model:"HQ3",contract:"ERD Drilling Program 2026 DD",project:"Mansourah GC",client:"Maaden Exploration",size:"HQ3",type:"RC Hammer Bit",totalDist:"45 m",rate:"1.2"},
  {id:5,status:"Complete-Worn Flat",serial:"BIT-2024-005",make:"Boretech",model:"BT2500",contract:"BM-NM Drilling Program 2024-2026 DD",project:"MM Cluster",client:"Maaden BMNM",size:"BQ",type:"Diamond Core Bit",totalDist:"320 m",rate:"2.5"},
];

const CONSUMABLES_DATA=[
  {id:1,name:"ADAPTER INNER TUBE",rateDate:"",category:"RC-MATERIAL",rate:"",rateType:"",currency:""},
  {id:2,name:"HQ 1.5M/5'OUTERTUBE",rateDate:"",category:"HQ",rate:"",rateType:"",currency:""},
  {id:3,name:"HQ 3M/10'OUTERTUBE",rateDate:"",category:"HQ",rate:"",rateType:"",currency:""},
  {id:4,name:"HQ ADAPTER COUPLING",rateDate:"",category:"HQ",rate:"",rateType:"",currency:""},
  {id:5,name:"HQ CORE BOXES",rateDate:"",category:"CORE BOX",rate:"",rateType:"",currency:""},
  {id:6,name:"HQ CORELIFTER (FLUTED)",rateDate:"",category:"HQ",rate:"",rateType:"",currency:""},
  {id:7,name:"HQ FULLHOLE OUTERTUBE 3M",rateDate:"",category:"HQ",rate:"",rateType:"",currency:""},
  {id:8,name:"HQ IINNERTUBE HEAD",rateDate:"",category:"HQ",rate:"",rateType:"",currency:""},
  {id:9,name:"HQ INNERTUBE 1.5M",rateDate:"",category:"HQ",rate:"",rateType:"",currency:""},
  {id:10,name:"HQ INNERTUBE 3M",rateDate:"",category:"HQ",rate:"",rateType:"",currency:""},
];

const CONSUMABLE_CATS=[{id:1,name:"CORE BOX"},{id:2,name:"HQ"},{id:3,name:"PQ"},{id:4,name:"RC-MATERIAL"}];

const EMPLOYEES_DATA=[
  {id:1,empId:233,first:"Abdulnaim",last:"-",type:"Office",payroll:"",lastWork:""},
  {id:2,empId:42,first:"ANTHER",last:"-",type:"Field",payroll:"",lastWork:""},
  {id:3,empId:302,first:"Al Amin",last:"Ab Awal",type:"Field",payroll:"",lastWork:"2026-05-20"},
  {id:4,empId:75,first:"GHULAM",last:"ABBAS BIRHAMANI K. BIRHAMANI",type:"Field",payroll:"",lastWork:"2026-05-27"},
  {id:5,empId:385,first:"ELRASHEED OSMAN",last:"ABDALLA DAFAALLA",type:"Field",payroll:"",lastWork:"2026-02-28"},
  {id:6,empId:132,first:"MOHAMMED",last:"ABDALRHMAN ISMAEL AHMED",type:"Field",payroll:"",lastWork:""},
  {id:7,empId:13,first:"ABDULLA",last:"ABDELGAYOUM ABDULLA BAKHIT",type:"Field",payroll:"",lastWork:"2026-04-14"},
  {id:8,empId:373,first:"HASSAN ABDELSALAM",last:"ABDELLATEF SOLIMAN",type:"Field",payroll:"",lastWork:"2026-05-16"},
  {id:9,empId:90,first:"IBRAHIM",last:"ABDELMALIK",type:"Field",payroll:"",lastWork:"2025-11-14"},
  {id:10,empId:166,first:"NABEEL",last:"ABDELRAZIG HAMID MOHAMED",type:"Field",payroll:"",lastWork:"2026-01-02"},
];

const EQUIP_TYPES=["4x4 Truck","Compressor","Fuel Truck","Gyro","Lowbed Trailer","Mini Bus","Reflex EZ-Trac Single / Multi Shot Orientation","Water Pump","Water Truck"];
const EQUIP_UNITS=[
  {id:1,equip:"4x4 Truck",unit:1,type:"Transportation",year:2022,make:"MITSUBISHI",model:"PICKUP",vin:"4906 XXB",purchDate:""},
  {id:2,equip:"4x4 Truck",unit:18,type:"Transportation",year:2022,make:"MITSUBISHI",model:"L200Pickup",vin:"4898 BXB",purchDate:""},
  {id:3,equip:"Compressor",unit:1,type:"Drilling Support",year:2020,make:"ATLAS COPCO",model:"XAS375",vin:"AC375-001",purchDate:"2020-06-15"},
];

const FLAGS_DATA=[
  {type:"Hole",name:"MM-GT-2025-01",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"MM-GT-2025-02",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"MM-GT-2025-02 / GT_005",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"MM-GT-2025-03 / GT_004",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"MM-GT-2025-05 / GT_007",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"SUK SRKGT 010",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"SUK SRKGT007",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
  {type:"Hole",name:"SUK SRKGT008",flag:"Hole has been inactive for 30 days, should be marked Complete?"},
];
const KPI_DATA=[
  {client:"Maaden BMNM",contract:"BM-NM Drilling Program 2024-2026 DD",kpi:"Distance per Shift",actual:14.40,target:20.00,diff:-5.60},
  {client:"Maaden Exploration",contract:"ERD Drilling Program 2026 DD",kpi:"Distance per Shift",actual:17.50,target:20.00,diff:-2.50},
];

const REPORT_SETUP={
  "Casing":["Available in HQ/HQ Lining","Available in HQ/HQ Lining Type 2","Available in Core Type"],
  "Cementing":["Cementing Volumes (m3 x Sacks)","Cementing Intervals"],
  "Cuttings Control":["Cutting Control"],
  "Directional Drilling":["Directional - Casing","Directional - Drilling","Directional - Survey"],
  "Drilling":["Core Drilling","Rotary Drilling","DTH Drilling","RC Drilling","Air Core Drilling"],
  "Fishing":["Impression Block","Fishing - Back off","Fishing - Junk Basket","Fishing - Mill","Fishing - Overshot","Fishing - Washpipe","Trying - Side Door Exiting","Trying to Recover Tool/Pull all drill"],
  "Fluid Motion":["Fluid Motion"],
  "Hole Conditioning":["Condition Hole/Circulation","Condition Hole/Mud - Lost","Condition Hole/Overshot Pump"],
  "Hole Monitoring":["Logging Tag","Plumb Bob"],
  "Jarring":["Bumper Jar","Bumper Sub","Jars","Motor Jar (Closed)","Motor Jar (Fluid)","Neyrfor/WES/Jar","Small Fishing Tool","Star Fish"],
  "Jetting":["Jetting","Jetting Testing"],
  "Reaming":["Reaming Up","Reaming Down"],
  "Repair":["Breakdown - Generator","Breakdown - Hydraulics","Breakdown - Rig/Motor","Breakdown - Wireline","Breakdown - TDI"],
  "Safety":["Safety/Safety Meeting","Pre-start Inspection","Risk Assessment","Safety Meeting/Training","Safety Inspection","HSE Observation"],
  "Standby - Client":["Client directed waiting","Waiting for decision/instruction","Waiting for client","Waiting on weather"],
  "Standby - Contractor":["Waiting for Tool/Equipment/Survey","Waiting for Water","Waiting on drill bit/parts","Lunch and dinner break","Pre-shift meeting","Post-shift meeting","Waiting on accommodation","Waiting on camp catering"],
  "Tripping":["Tripping In","Tripping Out","Trip In/Out with Reaming","Wash & Ream","Backwash"],
  "Wireline Ops":["Core Recovery","Drop Off Inner Tube","Pump Down","Trip In Wireline","Trip Out Wireline","Wireline Logging"],
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

const C={green:"#16a34a",orange:"#f59e0b",blue:"#2563eb",purple:"#7c3aed",
  teal:"#0d9488",red:"#ef4444",gray:"#6b7280",border:"#e5e7eb",
  bg:"#f8fafc",white:"#fff",textPri:"#111827",textSec:"#374151",textMut:"#6b7280"};

// ── STATUS BADGE ──────────────────────────────────────────────────────────────

const STATUS_MAP={
  "PENDING APPROVAL":{bg:"#eff6ff",color:"#1d4ed8",bd:"#93c5fd",dot:"#3b82f6"},
  "APPROVED":{bg:"#f0fdf4",color:"#15803d",bd:"#86efac",dot:"#22c55e",icon:"✓"},
  "VALIDATED":{bg:"#f0f9ff",color:"#0369a1",bd:"#7dd3fc",dot:"#38bdf8"},
  "REJECTED":{bg:"#fef2f2",color:"#b91c1c",bd:"#fca5a5",dot:"#ef4444"},
  "Active":{bg:"#f0fdf4",color:"#15803d",bd:"#86efac",dot:"#22c55e"},
  "InActive":{bg:"#f9fafb",color:"#6b7280",bd:"#d1d5db",dot:"#9ca3af"},
  "Complete":{bg:"#f0f9ff",color:"#0369a1",bd:"#7dd3fc",dot:"#38bdf8"},
  "Abandoned":{bg:"#fff7ed",color:"#c2410c",bd:"#fdba74",dot:"#f97316"},
  "Planned":{bg:"#faf5ff",color:"#7e22ce",bd:"#d8b4fe",dot:"#a855f7"},
  "Complete-Damaged":{bg:"#fef2f2",color:"#b91c1c",bd:"#fca5a5",dot:"#ef4444"},
  "Complete-Worn Flat":{bg:"#fff7ed",color:"#c2410c",bd:"#fdba74",dot:"#f97316"},
  "Complete-Left in Hole":{bg:"#fef2f2",color:"#b91c1c",bd:"#fca5a5",dot:"#ef4444"},
  "Complete-Worn Inner":{bg:"#fff7ed",color:"#c2410c",bd:"#fdba74",dot:"#f97316"},
};

const Badge=({s,sm})=>{
  const c=STATUS_MAP[s]||STATUS_MAP["InActive"];
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:4,
      padding:sm?"1px 6px":"2px 8px",fontSize:sm?10:11,fontWeight:500,
      background:c.bg,color:c.color,border:`1px solid ${c.bd}`,borderRadius:20,whiteSpace:"nowrap"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>
      {c.icon&&<span style={{fontSize:10}}>{c.icon}</span>}{s}
    </span>);
};

// ── TABLE CELLS ───────────────────────────────────────────────────────────────

const Th=({ch,w})=>(
  <th style={{padding:"8px 10px",textAlign:"left",fontSize:11,fontWeight:600,
    color:C.textSec,background:"#f9fafb",borderBottom:"1px solid "+C.border,
    whiteSpace:"nowrap",width:w}}>
    {ch}<span style={{opacity:.35,fontSize:9,marginLeft:2}}>⇅</span>
  </th>);

const Td=({ch,s})=>(
  <td style={{padding:"7px 10px",fontSize:12,color:C.textSec,
    borderBottom:"1px solid #f3f4f6",...s}}>{ch}</td>);

const NoRows=({cols})=>(
  <tr><td colSpan={cols||20} style={{textAlign:"center",padding:24,color:"#9ca3af",fontSize:13}}>
    No records available.
  </td></tr>);

// ── FILTER SELECT ─────────────────────────────────────────────────────────────

const FSel=({label,opts,val,onChange,w})=>(
  <div style={{position:"relative",display:"inline-block"}}>
    <select value={val} onChange={e=>onChange(e.target.value)}
      style={{padding:"5px 26px 5px 10px",fontSize:12,color:C.textSec,
        border:"1px solid #d1d5db",borderRadius:4,cursor:"pointer",
        appearance:"none",minWidth:w||130,background:C.white}}>
      <option value="all">{label}</option>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
    <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
      pointerEvents:"none",fontSize:10,color:"#9ca3af"}}>▾</span>
  </div>);

// ── PAGINATION ────────────────────────────────────────────────────────────────

const Pager=({page,setPage,per,total})=>{
  const tp=Math.max(1,Math.ceil(total/per));
  const makePages=()=>{
    const p=[];
    for(let i=1;i<=tp;i++){
      if(i===1||i===tp||Math.abs(i-page)<=1)p.push(i);
      else if(p[p.length-1]!=="...")p.push("...");
    }
    return p;
  };
  const Pb=({ch,onClick,disabled,active})=>(
    <button onClick={onClick} disabled={disabled}
      style={{padding:"3px 8px",border:"1px solid #d1d5db",borderRadius:3,
        cursor:disabled?"default":"pointer",fontSize:12,
        background:active?"#2563eb":C.white,color:active?"#fff":disabled?"#d1d5db":C.textSec}}>
      {ch}
    </button>);
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",fontSize:12}}>
      <span style={{color:C.textMut}}>
        Showing {total===0?0:Math.min((page-1)*per+1,total)} to {Math.min(page*per,total)} of {total} entries
      </span>
      <div style={{display:"flex",gap:3,alignItems:"center"}}>
        <Pb ch="Previous" onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1}/>
        {makePages().map((s,i)=>s==="..."
          ?<span key={i} style={{padding:"3px 4px",fontSize:12}}>…</span>
          :<Pb key={i} ch={s} onClick={()=>setPage(s)} active={s===page}/>)}
        <Pb ch="Next" onClick={()=>setPage(Math.min(tp,page+1))} disabled={page===tp}/>
        <select style={{marginLeft:8,padding:"3px 6px",border:"1px solid #d1d5db",borderRadius:3,fontSize:12}}>
          <option>10</option><option>25</option><option>50</option>
        </select>
        <span style={{color:C.textMut}}>records per page</span>
      </div>
    </div>);
};

// ── BUTTON ────────────────────────────────────────────────────────────────────

const BVARS={
  default:{bg:"#f9fafb",color:C.textSec,bd:"1px solid #d1d5db"},
  primary:{bg:C.blue,color:"#fff",bd:"none"},
  purple:{bg:C.purple,color:"#fff",bd:"none"},
  gray:{bg:C.gray,color:"#fff",bd:"none"},
  teal:{bg:C.teal,color:"#fff",bd:"none"},
  green:{bg:C.green,color:"#fff",bd:"none"},
  danger:{bg:C.red,color:"#fff",bd:"none"},
  outline:{bg:"#fff",color:C.textSec,bd:"1px solid #d1d5db"},
};
const Btn=({ch,onClick,variant="default",sm,icon,style:sx})=>{
  const v=BVARS[variant];
  return(
    <button onClick={onClick}
      style={{padding:sm?"4px 10px":"6px 14px",fontSize:sm?11:12,fontWeight:500,
        background:v.bg,color:v.color,border:v.bd,borderRadius:4,cursor:"pointer",
        display:"inline-flex",alignItems:"center",gap:4,...sx}}>
      {icon}{ch}
    </button>);
};

// ── MODAL ─────────────────────────────────────────────────────────────────────

const Modal=({open,onClose,title,children,w})=>{
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.4)",
      display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:C.white,borderRadius:8,padding:24,width:w||480,
        maxHeight:"85vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <strong style={{fontSize:15,color:C.textPri}}>{title}</strong>
          <button onClick={onClose}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#9ca3af",lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>);
};

// ── FORM INPUTS ───────────────────────────────────────────────────────────────

const FRow=({label,children})=>(
  <div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:11,fontWeight:600,color:C.textSec,marginBottom:4}}>{label}</label>
    {children}
  </div>);
const FInput=({value,onChange,placeholder,type="text"})=>(
  <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{width:"100%",padding:"7px 10px",fontSize:13,border:"1px solid #d1d5db",
      borderRadius:4,boxSizing:"border-box"}}/>);
const FSelect=({value,onChange,opts})=>(
  <select value={value||""} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",padding:"7px 10px",fontSize:13,border:"1px solid #d1d5db",
      borderRadius:4,boxSizing:"border-box",appearance:"none"}}>
    <option value="">Select...</option>
    {opts.map(o=><option key={o} value={o}>{o}</option>)}
  </select>);

// ── MISC UI ───────────────────────────────────────────────────────────────────

const Crumb=({items,nav})=>(
  <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:14,fontSize:12,color:C.textMut}}>
    {items.map((it,i)=>(
      <span key={i} style={{display:"flex",alignItems:"center",gap:4}}>
        {i>0&&<span style={{color:"#d1d5db"}}>›</span>}
        {it.page
          ?<span style={{cursor:"pointer",color:C.blue}} onClick={()=>nav(it.page)}>{it.label}</span>
          :<span style={{color:C.textSec}}>{it.label}</span>}
      </span>))}
  </div>);

const SH=({icon,title})=>(
  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,
    paddingBottom:6,borderBottom:"1px solid "+C.border}}>
    {icon&&<span>{icon}</span>}
    <span style={{fontSize:13,fontWeight:700,color:C.textPri}}>{title}</span>
  </div>);

const SearchBar=({value,onChange})=>(
  <input value={value} onChange={e=>onChange(e.target.value)} placeholder="Search:"
    style={{padding:"5px 10px",fontSize:12,border:"1px solid #d1d5db",
      borderRadius:4,width:200}}/>);

const IBtn=({onClick,icon,color,title})=>(
  <button onClick={onClick} title={title}
    style={{background:"none",border:"none",cursor:"pointer",padding:"3px",
      color,display:"inline-flex",alignItems:"center"}}>
    {icon}
  </button>);

// ── SVG ICONS ─────────────────────────────────────────────────────────────────

const Ic={
  edit:<svg width={13} height={13} fill="none" stroke={C.teal} strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  trash:<svg width={13} height={13} fill="none" stroke={C.red} strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  plus:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>,
  dl:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  ul:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>,
  filt:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>,
  chL:<svg width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>,
  chR:<svg width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>,
  chD:<svg width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>,
  menu:<svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  logout:<svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  help:<svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  user:<svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  x:<svg width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  check:<svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
};

// ── TOAST ─────────────────────────────────────────────────────────────────────

const Toast=({msg})=>{
  if(!msg)return null;
  return(
    <div style={{position:"fixed",bottom:24,right:24,background:"#1f2937",color:"#fff",
      padding:"10px 18px",borderRadius:6,fontSize:13,zIndex:9999,
      boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
      ✓ {msg}
    </div>);
};


// ── HOME PAGE ─────────────────────────────────────────────────────────────────

const HomePage=({nav})=>{
  const [period,setPeriod]=useState("month");
  const [kpiPage,setKpiPage]=useState(1);
  const [flagPage,setFlagPage]=useState(1);
  const {items:kpiItems,total:kpiTotal}=pg(KPI_DATA,kpiPage,10);
  const {items:flagItems,total:flagTotal}=pg(FLAGS_DATA,flagPage,10);
  const card=(bg,val,label)=>(
    <div style={{background:bg,padding:"18px 22px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontSize:46,fontWeight:700,color:"#fff",lineHeight:1}}>{val}</span>
      <span style={{fontSize:11,color:"#fff",marginTop:4,fontWeight:500}}>{label}</span>
    </div>);
  const metric=(icon,val,label,last)=>(
    <div style={{padding:"14px 16px",borderLeft:"1px solid "+C.border,borderBottom:last?"none":"1px solid "+C.border}}>
      {icon&&<div style={{fontSize:15,marginBottom:3}}>{icon}</div>}
      <div style={{fontSize:24,fontWeight:600,color:val==="—"?"#9ca3af":C.textPri}}>{val}</div>
      <div style={{fontSize:10,color:C.textMut}}>{label}</div>
    </div>);

  return(
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:18}}>
        {["month","year"].map(p=>(
          <button key={p} onClick={()=>setPeriod(p)}
            style={{padding:"6px 14px",fontSize:12,borderRadius:4,border:"1px solid #d1d5db",
              background:period===p?C.purple:C.white,color:period===p?"#fff":C.textSec,cursor:"pointer"}}>
            Over the last {p==="month"?"Month":"Year"}
          </button>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        {[{title:"DSRs",val:"76",label:"Pending Validation",bg:C.orange,isReal:true},
          {title:"Timesheets",val:"—",label:"Pending Validation",bg:"#9ca3af",isReal:false}
        ].map(sec=>(
          <div key={sec.title}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>{sec.title}</div>
            <div style={{display:"flex",border:"1px solid "+C.border,borderRadius:6,overflow:"hidden",background:C.white}}>
              {card(sec.bg,sec.val,sec.label)}
              <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr"}}>
                {metric("👥",sec.isReal?"0.3":"—","Days to Validate",false)}
                {metric("👤",sec.isReal?"0.4":"—","Days to Validate",false)}
                {metric(null,sec.isReal?"0.2":"—","% of Reports Rejected",true)}
                {metric(null,sec.isReal?"4.4":"—","Days to Submit",true)}
              </div>
            </div>
          </div>))}
      </div>
      <div style={{fontSize:12,color:C.textMut,marginBottom:20}}>
        <span style={{marginRight:14}}>👥 For all users</span><span>👤 For Logged-in user</span>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16,marginBottom:16}}>
        <SH icon="" title="Off-Target KPIs"/>
        <div style={{marginBottom:8}}><SearchBar value="" onChange={()=>{}}/></div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><Th ch="Client"/><Th ch="Contract"/><Th ch="KPI"/><Th ch="Actual"/><Th ch="Target"/><Th ch="Difference"/></tr></thead>
          <tbody>
            {kpiItems.map((r,i)=>(
              <tr key={i}>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.client}</span>}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.contract}</span>}/>
                <Td ch={r.kpi}/>
                <Td ch={<span style={{color:C.red,fontWeight:600}}>↓{r.actual.toFixed(2)} m</span>}/>
                <Td ch={`${r.target.toFixed(2)} m`}/>
                <Td ch={<span style={{color:C.red,fontWeight:500}}>{r.diff.toFixed(2)} m</span>}/>
              </tr>))}
          </tbody>
        </table>
        <Pager page={kpiPage} setPage={setKpiPage} per={10} total={kpiTotal}/>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16}}>
        <SH icon="" title="Flags"/>
        <div style={{marginBottom:8}}><SearchBar value="" onChange={()=>{}}/></div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><Th ch="Record Type"/><Th ch="Name"/><Th ch="Flag"/></tr></thead>
          <tbody>
            {flagItems.map((r,i)=>(
              <tr key={i}>
                <Td ch={r.type}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.name}</span>}/>
                <Td ch={r.flag}/>
              </tr>))}
          </tbody>
        </table>
        <Pager page={flagPage} setPage={setFlagPage} per={10} total={flagTotal}/>
      </div>
    </div>);
};

// ── DSR LIST PAGE ─────────────────────────────────────────────────────────────

const DSRPage=({nav})=>{
  const [q,setQ]=useState(""),[ fStatus,setFStatus]=useState("all");
  const [fDrill,setFDrill]=useState("all"),[fProject,setFProject]=useState("all");
  const [fClient,setFClient]=useState("all"),[page,setPage]=useState(1);
  const reset=()=>{setQ("");setFStatus("all");setFDrill("all");setFProject("all");setFClient("all");setPage(1);};
  const filtered=useMemo(()=>filt(DSR_DATA,{status:fStatus,drill:fDrill,project:fProject,client:fClient},["drill","project","client","contract"],q),[q,fStatus,fDrill,fProject,fClient]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Crumb items={[{label:"Home",page:"home"},{label:"Daily Shift Report"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <Btn ch="Clear All Filters" onClick={reset} sm/>
        <div style={{marginLeft:"auto"}}><Btn ch="Bulk Export" variant="outline" sm icon={Ic.dl}/></div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{color:C.textMut}}>{Ic.filt}</span>
        <FSel label="Status" opts={uniq(DSR_DATA,"status")} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}} w={155}/>
        <FSel label="Drill Name" opts={uniq(DSR_DATA,"drill")} val={fDrill} onChange={v=>{setFDrill(v);setPage(1);}} w={120}/>
        <FSel label="Project" opts={uniq(DSR_DATA,"project")} val={fProject} onChange={v=>{setFProject(v);setPage(1);}} w={215}/>
        <FSel label="Client" opts={uniq(DSR_DATA,"client")} val={fClient} onChange={v=>{setFClient(v);setPage(1);}} w={155}/>
        <Btn ch="Reset to defaults" onClick={reset} sm/>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={{width:36,padding:"8px 10px",background:"#f9fafb",borderBottom:"1px solid "+C.border}}>
              <input type="checkbox"/>
            </th>
            <Th ch="Shift"/><Th ch="Report Date"/><Th ch="Status"/><Th ch="Drill Name"/>
            <Th ch="Contract"/><Th ch="Project"/><Th ch="Client"/><Th ch="Distance"/>
            <th style={{width:40,background:"#f9fafb",borderBottom:"1px solid "+C.border}}/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id} style={{cursor:"pointer"}}
                onClick={()=>nav("dsr-summary",{id:r.id,drill:r.drill,date:r.date})}>
                <Td ch={<input type="checkbox" onClick={e=>e.stopPropagation()}/>}/>
                <Td ch={<span style={{background:r.shift==="DAY"?"#fef9c3":"#e0f2fe",
                  color:r.shift==="DAY"?"#854d0e":"#075985",
                  padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:500}}>{r.shift}</span>}/>
                <Td ch={r.date}/>
                <Td ch={<Badge s={r.status}/>}/>
                <Td ch={<span style={{color:C.blue,fontWeight:500}}>{r.drill}</span>}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.contract}</span>}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.project}</span>}/>
                <Td ch={r.client}/>
                <Td ch={r.dist}/>
                <Td ch={<IBtn icon={Ic.dl} color={C.textMut} onClick={e=>e.stopPropagation()}/>}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <Pager page={page} setPage={setPage} per={10} total={total}/>
    </div>);
};

// ── DSR SUMMARY PAGE ──────────────────────────────────────────────────────────

const DSRSummaryPage=({nav,params})=>{
  const drill=params?.drill||"BT-15";
  const actBreakdown=[
    {name:"Drilling",day:0,night:15.0},
    {name:"Standby-Contractor",day:9.0,night:0.5},
    {name:"Hole Conditioning",day:1.0,night:0},
    {name:"Safety",day:0.5,night:0},
  ];
  const shifts=[
    {id:"DAY",time:"06:30 – 18:30",dur:"12 hours",sup:"MUHAMMAD FAROOQ, DANISH FAROOQ",driller:"ELGAILI MAHDI ALL MAHDI"},
    {id:"NIGHT",time:"18:30 – 06:30",dur:"12 hours",sup:"MUHAMMAD FAROOQ, DANISH FAROOQ",driller:"DAFALLA ELIMAM MUSTAFA, FATH"},
  ];
  return(
    <div>
      <Crumb items={[{label:"Home",page:"home"},{label:"Daily Shift Report",page:"dsr"},{label:`MM Cluster · ${drill} · 2026-05-22`}]} nav={nav}/>
      <div style={{display:"grid",gridTemplateColumns:"420px 1fr",gap:20}}>
        {/* left panel */}
        <div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:700}}>{params?.date||"2026-05-22"}</div>
                <div style={{fontSize:12,color:C.textMut}}>⚙️ <strong>{drill}</strong></div>
              </div>
              <Badge s="APPROVED"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 12px",fontSize:12}}>
              <span style={{color:C.textMut}}>Contract</span><span>BM-NM Drilling Program 2024-2026 DD</span>
              <span style={{color:C.textMut}}>Project</span><span style={{color:C.blue}}>MM Cluster</span>
              <span style={{color:C.textMut}}>Client</span><span>Maaden BMNM</span>
              <span style={{color:C.textMut}}>Hole(s)</span><span style={{color:C.blue}}>UQ_GT26_004_R1</span>
            </div>
            <div style={{marginTop:8,fontSize:12}}>Expected Shifts <strong>2</strong></div>
          </div>
          {shifts.map(s=>(
            <div key={s.id} style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14,
              marginBottom:10,borderLeft:`3px solid ${s.id==="DAY"?C.orange:C.blue}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div>
                  <span style={{fontWeight:700,fontSize:13,color:s.id==="DAY"?"#92400e":"#1e40af"}}>{s.id}</span>
                  <span style={{fontSize:12,color:C.textMut,marginLeft:8}}>{s.time}</span>
                  <span style={{fontSize:11,color:"#9ca3af",marginLeft:4}}>({s.dur})</span>
                </div>
                <Badge s="APPROVED" sm/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"3px 10px",fontSize:12}}>
                <span style={{color:C.textMut}}>Supervisor</span><span>{s.sup}</span>
                <span style={{color:C.textMut}}>Driller</span><span style={{color:C.orange,fontWeight:500}}>{s.driller}</span>
              </div>
              <div style={{marginTop:8,display:"flex",gap:12,fontSize:12}}>
                <span style={{color:C.textMut,textDecoration:"underline",cursor:"pointer"}}>See Status History</span>
                <span style={{color:C.blue,cursor:"pointer"}}
                  onClick={()=>nav("shift-detail",{shift:s.id,drill})}>Go to Shift Details →</span>
              </div>
            </div>))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textMut,marginTop:8}}>
            <span style={{cursor:"pointer"}}>‹ Previous DSR<br/><span style={{color:C.blue}}>2026-05-21</span></span>
            <span style={{textAlign:"right",cursor:"pointer"}}>Next DSR<br/><span style={{color:C.blue}}>2026-05-23</span> ›</span>
          </div>
          <div style={{marginTop:14,background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14}}>
            <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Drilling Data</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr>
                  {["Shift","Hole","Type","Bit Size","From","To","Dist","ROP","Core Rec %"].map(h=>(
                    <th key={h} style={{padding:"5px 8px",background:"#f9fafb",borderBottom:"1px solid "+C.border,
                      textAlign:"left",fontWeight:600,color:C.textSec,whiteSpace:"nowrap"}}>{h}</th>))}
                </tr></thead>
                <tbody>
                  <tr>
                    {["Night","UQ_GT26_004_R1","DD","HQ3 Diamond Core Bit","45m","60m","15m","1.67 m/hr","—"].map((v,i)=>(
                      <td key={i} style={{padding:"5px 8px",borderBottom:"1px solid #f3f4f6",fontSize:11,
                        color:i===1?C.blue:C.textSec}}>{v}</td>))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* right panel */}
        <div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16,marginBottom:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
              {[["72","Total Man Hours"],["24","Total Activity Hours"],["15.00 m","Total Distance Drilled"]].map(([v,l])=>(
                <div key={l}>
                  <div style={{fontSize:28,fontWeight:700,color:C.textPri}}>{v}</div>
                  <div style={{fontSize:11,color:C.textMut}}>{l}</div>
                </div>))}
            </div>
          </div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16,marginBottom:14}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>Comments & Attachments</div>
            {["DAY","NIGHT"].map(s=>(
              <div key={s} style={{fontSize:12,color:"#9ca3af",marginBottom:4}}>
                ✏️ {s} &nbsp; no comments or attachments entered for this shift
              </div>))}
          </div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16,marginBottom:14}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>Activities Breakdown</div>
            <div style={{display:"flex",gap:14,fontSize:11,marginBottom:8,color:C.textMut}}>
              <span>⚡ Day (non-billable)</span><span>◈ Night (non-billable)</span>
              <span style={{color:C.teal}}>● Night</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={actBreakdown} layout="vertical" margin={{left:130,right:20,top:0,bottom:20}}>
                <XAxis type="number" tick={{fontSize:10}} tickLine={false} axisLine={false} label={{value:"Hours",position:"insideBottom",offset:-10,fontSize:10}}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:10}} width={128} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{fontSize:11}}/>
                <Bar dataKey="day" name="Day" stackId="a" fill="#fde68a"/>
                <Bar dataKey="night" name="Night" stackId="a" fill={C.teal} radius={[0,3,3,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>Activities Sequence</div>
            <div style={{display:"flex",gap:10,fontSize:10,marginBottom:8,flexWrap:"wrap"}}>
              {[["#fde68a","Safety"],["#f59e0b","Hole Conditioning"],["#fbbf24","Standby - Contractor"],[C.teal,"Drilling"]].map(([col,label])=>(
                <span key={label} style={{display:"flex",alignItems:"center",gap:3}}>
                  <span style={{width:10,height:10,background:col,borderRadius:2,flexShrink:0}}/>
                  <span style={{color:C.textMut}}>{label}</span>
                </span>))}
              <span style={{color:"#9ca3af"}}>| Shift Change</span>
            </div>
            <div style={{position:"relative",height:52,background:"#f9fafb",borderRadius:4,overflow:"hidden",marginBottom:4}}>
              <div style={{position:"absolute",left:"0%",top:5,bottom:5,width:"4.2%",background:"#fde68a"}}/>
              <div style={{position:"absolute",left:"4.2%",top:5,bottom:5,width:"4.2%",background:"#f59e0b"}}/>
              <div style={{position:"absolute",left:"8.4%",top:5,bottom:5,width:"67%",background:"#fbbf24"}}/>
              <div style={{position:"absolute",left:"50%",top:5,bottom:5,width:"42%",background:C.teal,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:10,fontWeight:600,color:"#fff"}}>15.00 m</span>
              </div>
              <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:1.5,background:"#374151",opacity:.8}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#9ca3af"}}>
              <span>6:30 AM</span><span>6:30 PM</span><span>6:30 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>);
};

// ── SHIFT DETAIL PAGE ─────────────────────────────────────────────────────────

const ShiftDetailPage=({nav,params})=>{
  const shift=params?.shift||"DAY";
  const drill=params?.drill||"BT-15";
  const [expanded,setExpanded]=useState([0,2]);
  const toggle=i=>setExpanded(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
  const activities=[
    {code:"UQ_GT26_004_R1",cat:"Safety",name:"Safety Meeting/Training",time:"06:30 – 07:00",dur:"0 hrs 30 min",actHrs:"0 hrs 30 min",billSel:"Per Contract",billable:"Non-Billable"},
    {code:"UQ_GT26_004_R1",cat:"Safety",name:"Pre-start Inspection",time:"07:00 – 07:30",dur:"0 hrs 30 min",actHrs:"0 hrs 30 min",billSel:"Per Contract",billable:"Non-Billable"},
    {code:"UQ_GT26_004_R1",cat:"Hole Conditioning",name:"Condition Hole/Mix Mud/Lost Circulation",time:"07:30 – 08:30",dur:"1 hours",actHrs:"1 hrs 0 min",billSel:"Per Contract",billable:"Non-Billable"},
    {code:"UQ_GT26_004_R1",cat:"Standby - Contractor",name:"Waiting for Tool/Equipment/Survey",time:"08:30 – 17:30",dur:"9 hours",actHrs:"9 hrs 0 min",billSel:"Per Contract",billable:"Non-Billable"},
    {code:"UQ_GT26_004_R1",cat:"Standby - Contractor",name:"Lunch and dinner break",time:"17:30 – 18:30",dur:"1 hours",actHrs:"1 hrs 0 min",billSel:"Per Contract",billable:"Non-Billable"},
  ];
  const workers=[
    {name:"AHMAD MUHAMMAD, BILAL",role:"Helper",start:"2026-05-22 06:30",end:"2026-05-22 18:30",pay:12,man:12,bill:"Non-Billable"},
    {name:"ELGAILI MAHDI ALL MAHDI",role:"Driller",start:"2026-05-22 06:30",end:"2026-05-22 18:30",pay:12,man:12,bill:"Non-Billable"},
    {name:"HUSSAIN SHAH, AYAZ",role:"Helper",start:"2026-05-22 06:30",end:"2026-05-22 18:30",pay:12,man:12,bill:"Non-Billable"},
  ];
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <Btn ch="back to Summary" variant="outline" sm icon={Ic.chL}
          onClick={()=>nav("dsr-summary",{drill,date:"2026-05-22"})}/>
        <IBtn icon={Ic.ul} color={C.textMut}/>
      </div>
      {/* header bar */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontWeight:700,fontSize:14,color:shift==="DAY"?"#92400e":"#1e40af"}}>{shift}</span>
              <span style={{fontSize:13,color:C.textMut}}>{shift==="DAY"?"06:30 – 18:30":"18:30 – 06:30"} (12 hours)</span>
              <Badge s="APPROVED"/>
            </div>
            <div style={{fontSize:11,color:"#9ca3af"}}>Validated by: Validation, Data &nbsp;&nbsp; Approved by: Kamal, Sami</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",fontSize:11,color:C.textMut}}>
            <span style={{cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>{Ic.chL} Previous DSR<br/><span style={{color:C.blue}}>2026-05-21</span></span>
            <div style={{display:"flex",gap:3}}>
              <div style={{width:14,height:14,background:C.orange,borderRadius:2}}/>
              <div style={{width:14,height:14,background:C.teal,borderRadius:2}}/>
            </div>
            <span style={{cursor:"pointer"}}>Next DSR<br/><span style={{color:C.blue}}>2026-05-23</span> {Ic.chR}</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:15,fontWeight:700}}>2026-05-22</span><Badge s="APPROVED" sm/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"5px 12px",fontSize:12}}>
              <span style={{color:C.textMut}}>⚙️</span><span style={{fontWeight:600}}>{drill}</span>
              <span style={{color:C.textMut}}>Contract</span><span>BM-NM Drilling Program 2024-2026 DD</span>
              <span style={{color:C.textMut}}>Project</span><span>MM Cluster</span>
              <span style={{color:C.textMut}}>Client</span><span>Maaden BMNM</span>
              <span style={{color:C.textMut}}>Supervisor</span><span>MUHAMMAD FAROOQ, DANISH FAROOQ</span>
              <span style={{color:C.textMut}}>Driller</span><span>ELGAILI MAHDI ALL MAHDI</span>
              <span style={{color:C.textMut}}>Drill Engine Hours</span><span style={{color:"#9ca3af"}}>—</span>
            </div>
          </div>
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              {[["36","Total Man Hours"],["12","Total Activity Hours"],["0.00","Total Distance Drilled"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:700,color:C.textPri}}>{v}</div>
                  <div style={{fontSize:10,color:C.textMut}}>{l}</div>
                </div>))}
            </div>
            <div style={{marginTop:12,fontSize:12,color:"#9ca3af"}}>
              ✏️ DAY &nbsp; no comments or attachments entered for this shift
            </div>
          </div>
        </div>
      </div>
      {/* status history */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14,marginBottom:12}}>
        <SH icon="📋" title="Status History"/>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><Th ch="Date/Time"/><Th ch="Name"/><Th ch="Status"/><Th ch="Comments"/></tr></thead>
          <tbody>
            {[{dt:"2026-05-23 06:55",name:"Kamal, Sami",s:"Approved"},
              {dt:"2026-05-23 05:17",name:"Validation, Data",s:"Validated"}].map((r,i)=>(
              <tr key={i}><Td ch={r.dt}/><Td ch={r.name}/><Td ch={r.s}/><Td ch="—"/></tr>))}
          </tbody>
        </table>
      </div>
      {/* validations */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14,marginBottom:12}}>
        <SH icon="⚠️" title="Validations"/>
        <div style={{fontSize:12,color:C.textMut,marginBottom:6}}>Description</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}><tbody><NoRows/></tbody></table>
      </div>
      {/* workers */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14,marginBottom:12}}>
        <SH icon="👷" title="Workers"/>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={{width:36,padding:"8px 10px",background:"#f9fafb",borderBottom:"1px solid "+C.border}}/>
            <Th ch="Worker"/><Th ch="Role"/><Th ch="Start"/><Th ch="End"/>
            <Th ch="Payroll Hours"/><Th ch="Man Hours"/><Th ch="Billable"/>
          </tr></thead>
          <tbody>
            {workers.map((w,i)=>(
              <tr key={i}>
                <Td ch={<input type="checkbox"/>}/>
                <Td ch={w.name}/><Td ch={w.role}/>
                <Td ch={w.start}/><Td ch={w.end}/>
                <Td ch={w.pay}/><Td ch={w.man}/><Td ch={w.bill}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      {/* activities */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14,marginBottom:12}}>
        <SH icon="📊" title="Activities"/>
        {activities.map((a,i)=>(
          <div key={i} style={{border:"1px solid "+C.border,borderRadius:4,marginBottom:8}}>
            <div style={{padding:"8px 12px",display:"flex",justifyContent:"space-between",
              alignItems:"center",cursor:"pointer",background:"#fafafa"}} onClick={()=>toggle(i)}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:C.blue,fontWeight:500,marginBottom:2}}>{a.code} R1</div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:C.textMut}}>{a.cat}</span>
                  <span style={{fontSize:11,fontWeight:500}}>{a.name}</span>
                  <span style={{fontSize:11,background:"#f3f4f6",padding:"1px 8px",borderRadius:10,color:C.textSec}}>
                    {a.time} ({a.dur})
                  </span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#9ca3af"}}>
                <span>3 ⚒ 0</span>
                <span style={{marginLeft:6}}>{expanded.includes(i)?Ic.chD:Ic.chR}</span>
              </div>
            </div>
            {expanded.includes(i)&&(
              <div style={{padding:"8px 12px 12px",borderTop:"1px solid "+C.border}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr>
                    <th style={{padding:"5px 10px",fontSize:11,fontWeight:600,color:C.textSec,background:"#f9fafb",borderBottom:"1px solid "+C.border,textAlign:"left"}}>Activity Hours</th>
                    <th style={{padding:"5px 10px",fontSize:11,fontWeight:600,color:C.textSec,background:"#f9fafb",borderBottom:"1px solid "+C.border,textAlign:"left"}}>Billable Selection</th>
                    <th style={{padding:"5px 10px",fontSize:11,fontWeight:600,color:C.textSec,background:"#f9fafb",borderBottom:"1px solid "+C.border,textAlign:"left"}}>Billable</th>
                  </tr></thead>
                  <tbody><tr><Td ch={a.actHrs}/><Td ch={a.billSel}/><Td ch={a.billable}/></tr></tbody>
                </table>
              </div>)}
          </div>))}
      </div>
      {/* equipment / consumables / fluids / charges / forms */}
      {[{t:"Equipment",icon:"🚗",cols:["Hole","Equipment","Quantity","Hours","Billable"]},
        {t:"Consumables",icon:"🔧",cols:["Hole","Category","Consumable","Quantity","Billable"]},
        {t:"Fluids",icon:"💧",cols:["Fluid","Fluid Type","Volume","Cost/Unit"]},
        {t:"Additional Charges",icon:"💰",cols:["Hole","Description","Category","Quantity","Rate"]},
        {t:"Submitted Forms",icon:"📎",cols:["File Name","Form","Worker","Notes"]},
      ].map(sec=>(
        <div key={sec.t} style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14,marginBottom:12}}>
          <SH icon={sec.icon} title={sec.t}/>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{sec.cols.map(c=><Th key={c} ch={c}/>)}</tr></thead>
            <tbody><NoRows cols={sec.cols.length}/></tbody>
          </table>
        </div>))}
    </div>);
};


// ── TIMESHEET PAGE ────────────────────────────────────────────────────────────

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
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={{width:36,padding:"8px 10px",background:"#f9fafb",borderBottom:"1px solid "+C.border}}><input type="checkbox"/></th>
            <Th ch="Period"/><Th ch="Status"/><Th ch="Drill Name"/><Th ch="Supervisor"/>
            <Th ch="Total Hours"/><Th ch="Billable Hours"/>
            <th style={{width:40,background:"#f9fafb",borderBottom:"1px solid "+C.border}}/>
          </tr></thead>
          <tbody>
            {items.map(r=>(
              <tr key={r.id}>
                <Td ch={<input type="checkbox"/>}/>
                <Td ch={r.period}/><Td ch={<Badge s={r.status}/>}/>
                <Td ch={<span style={{color:C.blue,fontWeight:500}}>{r.drill}</span>}/>
                <Td ch={r.supervisor}/><Td ch={r.totalHrs}/><Td ch={r.billable}/>
                <Td ch={<IBtn icon={Ic.dl} color={C.textMut}/>}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <Pager page={page} setPage={setPage} per={10} total={total}/>
    </div>);
};

// ── PROJECTS PAGE ─────────────────────────────────────────────────────────────

const ProjectsPage=({nav})=>{
  const [q,setQ]=useState(""),[ fStatus,setFStatus]=useState("all");
  const [fClient,setFClient]=useState("all"),[fContract,setFContract]=useState("all");
  const [fLoc,setFLoc]=useState("all"),[page,setPage]=useState(1);
  const reset=()=>{setQ("");setFStatus("all");setFClient("all");setFContract("all");setFLoc("all");setPage(1);};
  const filtered=useMemo(()=>filt(PROJECTS_DATA,{status:fStatus,client:fClient,contract:fContract,location:fLoc},["name","client","contract","location"],q),[q,fStatus,fClient,fContract,fLoc]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Crumb items={[{label:"Home",page:"home"},{label:"Projects"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{color:C.textMut}}>{Ic.filt}</span>
        <FSel label="Filter by Status" opts={uniq(PROJECTS_DATA,"status")} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <FSel label="Filter by Client" opts={uniq(PROJECTS_DATA,"client")} val={fClient} onChange={v=>{setFClient(v);setPage(1);}} w={150}/>
        <FSel label="Filter by Contract" opts={uniq(PROJECTS_DATA,"contract")} val={fContract} onChange={v=>{setFContract(v);setPage(1);}} w={260}/>
        <FSel label="Filter by Location" opts={uniq(PROJECTS_DATA,"location").filter(Boolean)} val={fLoc} onChange={v=>{setFLoc(v);setPage(1);}} w={170}/>
        <Btn ch="Clear" onClick={reset} sm/>
      </div>
      <div style={{marginBottom:8}}><SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/></div>
      <div style={{fontSize:12,color:C.textMut,marginBottom:6,textAlign:"right"}}>Showing 1 to {Math.min(10,total)} of {total} entries</div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="Status"/><Th ch="ID"/><Th ch="Client"/>
            <Th ch="Contract"/><Th ch="Location"/><Th ch="# of Holes"/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}} onClick={()=>nav("holes")}>{r.name}</span>}/>
                <Td ch={r.client}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.contract}</span>}/>
                <Td ch={r.location||"—"}/><Td ch={r.holes}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <Pager page={page} setPage={setPage} per={10} total={total}/>
    </div>);
};

// ── HOLES PAGE ────────────────────────────────────────────────────────────────

const HolesPage=({nav})=>{
  const [q,setQ]=useState(""),[ fStatus,setFStatus]=useState("all");
  const [fContract,setFContract]=useState("all"),[fClient,setFClient]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const reset=()=>{setQ("");setFStatus("all");setFContract("all");setFClient("all");setPage(1);};
  const filtered=useMemo(()=>filt(HOLES_DATA,{status:fStatus,contract:fContract,client:fClient},["hole","client","contract","project"],q),[q,fStatus,fContract,fClient]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Holes"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{color:C.textMut}}>{Ic.filt}</span>
        <FSel label="Filter by Status" opts={["Abandoned","Active","Cancelled","Complete","Planned"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <FSel label="Filter by Contract" opts={uniq(HOLES_DATA,"contract")} val={fContract} onChange={v=>{setFContract(v);setPage(1);}} w={260}/>
        <FSel label="Filter by Project Name" opts={uniq(HOLES_DATA,"project")} val={fStatus} onChange={()=>{}} w={180}/>
        <FSel label="Filter by Client" opts={uniq(HOLES_DATA,"client")} val={fClient} onChange={v=>{setFClient(v);setPage(1);}} w={150}/>
        <Btn ch="Clear" onClick={reset} sm/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
        <input placeholder="Type to search..." value={q} onChange={e=>{setQ(e.target.value);setPage(1);}}
          style={{padding:"5px 10px",fontSize:12,border:"1px solid #d1d5db",borderRadius:4,width:200}}/>
        <div style={{fontSize:12,color:C.textMut,marginLeft:"auto"}}>
          Reset To Defaults &nbsp; Showing 1 to {Math.min(10,total)} of {total} entries
        </div>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/>
            <Th ch="Status"/><Th ch="ID"/><Th ch="Client"/>
            <Th ch="Contract"/><Th ch="Project"/><Th ch="Depth"/><Th ch="Last Activity Date"/>
            <th style={{width:120,background:"#f9fafb",borderBottom:"1px solid "+C.border}}/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<>
                  <IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing ${r.hole}`)}/>
                  <IBtn icon={Ic.trash} color={C.red} onClick={()=>doToast(`Deleted ${r.hole}`)}/>
                </>}/>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}} onClick={()=>nav("hole-detail",{hole:r.hole})}>{r.hole}</span>}/>
                <Td ch={r.client}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.contract}</span>}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer"}}>{r.project}</span>}/>
                <Td ch={r.maxDepth}/><Td ch={r.lastActivity}/>
                <Td ch={<Btn ch="Reactivate" variant="teal" sm onClick={()=>doToast(`Hole ${r.hole} reactivated`)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <Btn ch="Add" variant="outline" sm icon={<span style={{fontSize:14,color:C.blue}}>⊕</span>}/>
        </div>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <Btn ch="Import Holes" variant="gray" sm icon={Ic.ul}/>
        <Btn ch="Combine Holes" variant="green" sm/>
        <Btn ch="Export Holes" variant="gray" sm icon={Ic.dl}/>
      </div>
    </div>);
};

// ── HOLE DETAIL PAGE ──────────────────────────────────────────────────────────

const HoleDetailPage=({nav,params})=>{
  const holeName=params?.hole||"AA25-001";
  const [tab,setTab]=useState("drilling");
  const drillingRecs=[
    {drill:"UG-04",date:"2025-02-27",type:"DD",bit:"NQ Diamond Core Bit",from:"0 m",to:"35.6 m",dist:"35.6 m",pen:"35.6 m",rate:"2.97 m"},
    {drill:"UG-04",date:"2025-02-28",type:"DD",bit:"NQ Diamond Core Bit",from:"35.6 m",to:"71.35 m",dist:"35.75 m",pen:"35.75 m",rate:"2.23 m"},
    {drill:"UG-04",date:"2025-03-01",type:"DD",bit:"NQ Diamond Core Bit",from:"71.35 m",to:"115.05 m",dist:"43.7 m",pen:"43.7 m",rate:"3.12 m"},
    {drill:"UG-04",date:"2025-03-02",type:"DD",bit:"NQ Diamond Core Bit",from:"115.05 m",to:"147.6 m",dist:"32.55 m",pen:"32.55 m",rate:"2.96 m"},
    {drill:"UG-04",date:"2025-03-03",type:"DD",bit:"NQ Diamond Core Bit",from:"147.6 m",to:"180.95 m",dist:"33.35 m",pen:"33.35 m",rate:"2.57 m"},
    {drill:"UG-04",date:"2025-03-04",type:"DD",bit:"NQ Diamond Core Bit",from:"180.95 m",to:"211.05 m",dist:"30.1 m",pen:"30.1 m",rate:"2.74 m"},
  ];
  const tabStyle=active=>({padding:"8px 18px",fontSize:13,fontWeight:active?600:400,cursor:"pointer",
    background:"none",border:"none",borderBottom:active?"2px solid "+C.blue:"2px solid transparent",
    color:active?C.blue:C.textMut});
  return(
    <div>
      <Crumb items={[{label:"Home",page:"home"},{label:"Holes",page:"holes"},{label:`Hole Detail`}]} nav={nav}/>
      <button onClick={()=>nav("holes")}
        style={{background:"none",border:"none",cursor:"pointer",color:C.blue,fontSize:13,marginBottom:12,display:"flex",alignItems:"center",gap:4}}>
        {Ic.chL} Go Back
      </button>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <IBtn icon={Ic.edit} color={C.teal}/><IBtn icon={Ic.trash} color={C.red}/>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:12,color:C.textMut}}>Complete</span>
            <span style={{fontSize:11,color:C.gray}}>Status</span>
          </div>
          <div><span style={{fontSize:15,fontWeight:700}}>{holeName}</span><br/><span style={{fontSize:11,color:C.textMut}}>Hole</span></div>
          <div><span style={{fontSize:13}}>Maaden BMNM</span><br/><span style={{fontSize:11,color:C.textMut}}>Client</span></div>
          <div><span style={{fontSize:13}}>BM-NM Drilling Program 2024-2026 - UG</span><br/><span style={{fontSize:11,color:C.textMut}}>Contract</span></div>
          <div><span style={{fontSize:13}}>Al Amar UG 2025</span><br/><span style={{fontSize:11,color:C.textMut}}>Project</span></div>
          <div style={{marginLeft:"auto"}}>
            <Btn ch="Re-Activate" variant="gray" sm/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,auto)",gap:"6px 24px",marginTop:12,fontSize:12}}>
          <span style={{color:C.textMut}}>Planned Hole Name</span><strong>{holeName}</strong>
          <span style={{color:C.textMut}}>Planned Depth</span><strong>204 m</strong>
          <span style={{color:C.textMut}}>Planned Azimuth</span><strong>196.29°</strong>
          <span style={{color:C.textMut}}>Planned Dip</span><strong>—</strong>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid "+C.border,marginBottom:16}}>
        {[["drilling","Drilling"],["holepath","Hole Path"],["charges","Charges"]].map(([k,label])=>(
          <button key={k} style={tabStyle(tab===k)} onClick={()=>setTab(k)}>{label}</button>))}
      </div>
      {tab==="drilling"&&(
        <div>
          <SH icon="📊" title="Drilling Records"/>
          <div style={{fontSize:12,color:C.textMut,marginBottom:6}}>
            <SearchBar value="" onChange={()=>{}}/>&nbsp;
            <span style={{float:"right"}}>Showing 1 to {drillingRecs.length} of {drillingRecs.length} entries</span>
          </div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <Th ch="Drill"/><Th ch="Date"/><Th ch="Type"/><Th ch="BitSize and Type"/>
                <Th ch="From"/><Th ch="To"/><Th ch="Distance Drilled"/>
                <Th ch="Penetration"/><Th ch="Penetration Rate"/><Th ch="Comments"/>
              </tr></thead>
              <tbody>
                {drillingRecs.map((r,i)=>(
                  <tr key={i}>
                    <Td ch={r.drill}/><Td ch={r.date}/><Td ch={r.type}/><Td ch={r.bit}/>
                    <Td ch={r.from}/><Td ch={r.to}/><Td ch={r.dist}/><Td ch={r.pen}/><Td ch={r.rate}/><Td ch="—"/>
                  </tr>))}
              </tbody>
            </table>
          </div>
          <Pager page={1} setPage={()=>{}} per={10} total={drillingRecs.length}/>
        </div>)}
      {tab==="holepath"&&(
        <div>
          <SH icon="🧭" title="Surveys"/>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
            <FSel label="Filter by Survey Category" opts={["Multi shot","Single shot"]} val="all" onChange={()=>{}}/>
            <FSel label="Filter by Survey Tool" opts={["Reflex EZ-Trac Single / Multi Shot Orientation"]} val="all" onChange={()=>{}} w={260}/>
            <FSel label="Filter by Measurement Type" opts={["Magnetic","Gyro"]} val="all" onChange={()=>{}} w={180}/>
            <FSel label="Filter by Survey Direction" opts={["Downhole","Uphole"]} val="all" onChange={()=>{}}/>
            <Btn ch="Clear" sm/>
          </div>
          <div style={{display:"flex",gap:16,marginBottom:8}}>
            {["Survey View","Data View"].map(v=>(
              <span key={v} style={{fontSize:13,cursor:"pointer",color:v==="Survey View"?C.blue:C.textMut,
                borderBottom:v==="Survey View"?"2px solid "+C.blue:"none",paddingBottom:4}}>{v}</span>))}
          </div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <Th ch="" w={70}/><Th ch="Survey Category"/><Th ch="Survey Tool"/>
                <Th ch="Survey Date/Time (UTC)"/><Th ch="Survey Label"/>
                <Th ch="Drill"/><Th ch="Operator"/><Th ch="Declination"/><Th ch="Description"/>
              </tr></thead>
              <tbody>
                <tr>
                  <Td ch={<><IBtn icon={Ic.edit} color={C.teal}/><IBtn icon={Ic.trash} color={C.red}/></>}/>
                  <Td ch="Multi shot"/>
                  <Td ch="Reflex EZ-Trac Single / Multi Shot Orientation"/>
                  <Td ch="3/5/2025 12:00:00 AM"/><Td ch=""/><Td ch="UG-04"/>
                  <Td ch=""/><Td ch=""/><Td ch=""/>
                </tr>
              </tbody>
            </table>
          </div>
        </div>)}
      {tab==="charges"&&(
        <div>
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:14}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}><tbody><NoRows/></tbody></table>
          </div>
        </div>)}
    </div>);
};


// ── DRILLS PAGE ───────────────────────────────────────────────────────────────

const DrillsPage=({nav})=>{
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all");
  const [fType,setFType]=useState("all"),[fMake,setFMake]=useState("all"),[fModel,setFModel]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState(""),[showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({});
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const reset=()=>{setQ("");setFStatus("all");setFType("all");setFMake("all");setFModel("all");setPage(1);};
  const filtered=useMemo(()=>filt(DRILLS_DATA,{status:fStatus,type:fType,make:fMake,model:fModel},["name","type","make","model","serial"],q),[q,fStatus,fType,fMake,fModel]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Drilling Rigs"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{color:C.textMut}}>{Ic.filt}</span>
        <FSel label="Filter by Status" opts={["Active","InActive"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <FSel label="Filter by Type" opts={["Reverse Circulation","Surface - Coring","Underground - Coring"]} val={fType} onChange={v=>{setFType(v);setPage(1);}} w={180}/>
        <FSel label="Filter by Brand" opts={uniq(DRILLS_DATA,"make").filter(Boolean)} val={fMake} onChange={v=>{setFMake(v);setPage(1);}}/>
        <Btn ch="Clear" onClick={reset} sm/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{marginLeft:"auto",fontSize:12,color:C.textMut}}>Showing 1 to {Math.min(10,total)} of {total} entries</span>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/>
            <Th ch="ID"/><Th ch="Type"/><Th ch="Brand"/><Th ch="Made By"/>
            <th style={{width:110,background:"#f9fafb",borderBottom:"1px solid "+C.border}}/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing ${r.name}`)}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>doToast(`Deleted ${r.name}`)}/></>}/>
                <Td ch={<span style={{fontWeight:500}}>{r.name}</span>}/>
                <Td ch={r.type}/>
                <Td ch={r.make||"—"}/>
                <Td ch={r.model||"—"}/>
                <Td ch={<Btn ch={r.status==="Active"?"Deactivate":"Activate"} variant="gray" sm onClick={()=>doToast(`${r.name} ${r.status==="Active"?"deactivated":"activated"}`)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={()=>setShowAdd(true)}
          style={{padding:"6px 12px",fontSize:12,background:"none",border:"none",cursor:"pointer",
            color:C.blue,display:"flex",alignItems:"center",gap:4,marginTop:8}}>
          <span style={{fontSize:16,fontWeight:700}}>⊕</span> Add
        </button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add New Drilling Rig">
        <FRow label="ID"><FInput value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="e.g. BT-25"/></FRow>
        <FRow label="Type"><FSelect value={form.type} onChange={v=>setForm({...form,type:v})} opts={["Surface - Coring","Underground - Coring","Reverse Circulation"]}/></FRow>
        <FRow label="Brand"><FInput value={form.make} onChange={v=>setForm({...form,make:v})} placeholder="e.g. Boretech"/></FRow>
        <FRow label="Made By"><FInput value={form.model} onChange={v=>setForm({...form,model:v})} placeholder="e.g. BT2500"/></FRow>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
          <Btn ch="Cancel" onClick={()=>setShowAdd(false)} sm/>
          <Btn ch="Save" variant="primary" sm onClick={()=>{setShowAdd(false);doToast("Drill saved successfully");setForm({});}}/>
        </div>
      </Modal>
    </div>);
};

// ── BITS PAGE ─────────────────────────────────────────────────────────────────

const BitsPage=({nav})=>{
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all");
  const [fMake,setFMake]=useState("all"),[fModel,setFModel]=useState("all");
  const [fSize,setFSize]=useState("all"),[fType,setFType]=useState("all");
  const [page,setPage]=useState(1),[toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const reset=()=>{setQ("");setFStatus("all");setFMake("all");setFModel("all");setFSize("all");setFType("all");setPage(1);};
  const filtered=useMemo(()=>filt(BITS_DATA,{status:fStatus,make:fMake,model:fModel,size:fSize,type:fType},["serial","make","model","project","client"],q),[q,fStatus,fMake,fModel,fSize,fType]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Bits"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{color:C.textMut}}>{Ic.filt}</span>
        <FSel label="Filter by Status" opts={["Active","Complete-Damaged","Complete-Worn Flat","Complete-Left in Hole","Complete-Worn Inner"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}} w={155}/>
        <FSel label="Filter by Model" opts={uniq(BITS_DATA,"model").filter(Boolean)} val={fModel} onChange={v=>{setFModel(v);setPage(1);}}/>
        <FSel label="Filter by Client" opts={uniq(BITS_DATA,"client")} val="all" onChange={()=>{}} w={150}/>
        <FSel label="Filter by Contract" opts={uniq(BITS_DATA,"contract")} val="all" onChange={()=>{}} w={240}/>
        <FSel label="Filter by Project" opts={uniq(BITS_DATA,"project")} val="all" onChange={()=>{}} w={160}/>
        <FSel label="Filter by Size" opts={uniq(BITS_DATA,"size")} val={fSize} onChange={v=>{setFSize(v);setPage(1);}} w={130}/>
        <Btn ch="Clear" onClick={reset} sm/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{marginLeft:"auto",fontSize:12,color:C.textMut}}>Showing {total===0?0:1} to {Math.min(10,total)} of {total} entries</span>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="Status"/><Th ch="Serial #"/><Th ch="Model"/>
            <Th ch="Client"/><Th ch="Contract"/><Th ch="Project"/>
            <Th ch="Size"/><Th ch="Total Distance"/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<Badge s={r.status} sm/>}/>
                <Td ch={r.serial}/><Td ch={r.model}/>
                <Td ch={r.client}/>
                <Td ch={<span style={{color:C.blue,cursor:"pointer",fontSize:11}}>{r.contract}</span>}/>
                <Td ch={r.project}/>
                <Td ch={r.size}/><Td ch={r.totalDist}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={()=>doToast("Add Bit form opened")}
          style={{padding:"6px 12px",fontSize:12,background:"none",border:"none",cursor:"pointer",
            color:C.blue,display:"flex",alignItems:"center",gap:4,marginTop:8}}>
          <span style={{fontSize:16,fontWeight:700}}>⊕</span> Add
        </button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <Btn ch="Show Multiselect" variant="gray" sm icon={Ic.check}/>
        <Btn ch="Import Bits" variant="gray" sm icon={Ic.ul}/>
      </div>
    </div>);
};

// ── CONSUMABLES PAGE ──────────────────────────────────────────────────────────

const ConsumablesPage=({nav})=>{
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all");
  const [fCat,setFCat]=useState("all"),[page,setPage]=useState(1);
  const [showCats,setShowCats]=useState(false),[toast,setToast]=useState("");
  const [cats,setCats]=useState(CONSUMABLE_CATS);
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const reset=()=>{setQ("");setFStatus("all");setFCat("all");setPage(1);};
  const filtered=useMemo(()=>filt(CONSUMABLES_DATA,{category:fCat},["name","category"],q),[q,fStatus,fCat]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Consumables"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{color:C.textMut}}>{Ic.filt}</span>
        <FSel label="Filter by Status" opts={["Active","InActive"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <FSel label="Filter by Category" opts={cats.map(c=>c.name)} val={fCat} onChange={v=>{setFCat(v);setPage(1);}} w={170}/>
        <Btn ch="Clear" onClick={reset} sm/>
        <div style={{marginLeft:"auto"}}>
          <Btn ch="Manage Categories" variant="purple" onClick={()=>setShowCats(true)}/>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{marginLeft:"auto",fontSize:12,color:C.textMut}}>Showing 1 to {Math.min(10,total)} of {total} entries</span>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/>
            <Th ch="Consumable"/><Th ch="Rate Entered Date"/><Th ch="Category"/>
            <Th ch="Rate"/><Th ch="Rate Type"/><Th ch="Currency"/>
            <th style={{width:100,background:"#f9fafb",borderBottom:"1px solid "+C.border}}/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing ${r.name}`)}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>doToast(`Deleted ${r.name}`)}/></>}/>
                <Td ch={r.name}/><Td ch={r.rateDate||"—"}/><Td ch={r.category}/>
                <Td ch={r.rate||"—"}/><Td ch={r.rateType||"—"}/><Td ch={r.currency||"—"}/>
                <Td ch={<Btn ch="Deactivate" variant="gray" sm onClick={()=>doToast(`${r.name} deactivated`)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={()=>doToast("Add consumable")}
          style={{padding:"6px 12px",fontSize:12,background:"none",border:"none",cursor:"pointer",
            color:C.blue,display:"flex",alignItems:"center",gap:4,marginTop:8}}>
          <span style={{fontSize:16,fontWeight:700}}>⊕</span> Add
        </button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{marginTop:10}}><Btn ch="Import Consumables" variant="gray" sm icon={Ic.ul}/></div>
      <Modal open={showCats} onClose={()=>setShowCats(false)} title="Categories" w={560}>
        <SH icon="👥" title="Categories"/>
        <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden",marginBottom:12}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><Th ch="Category"/><th style={{background:"#f9fafb",borderBottom:"1px solid "+C.border,width:110}}/></tr></thead>
            <tbody>
              {cats.map(cat=>(
                <tr key={cat.id}>
                  <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing ${cat.name}`)}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>{setCats(p=>p.filter(c=>c.id!==cat.id));doToast(`${cat.name} deleted`);}}/> {cat.name}</>}/>
                  <Td ch={<Btn ch="Activate" variant="outline" sm onClick={()=>doToast(`${cat.name} activated`)}/>}/>
                </tr>))}
            </tbody>
          </table>
        </div>
        <button style={{padding:"6px 12px",fontSize:12,background:"none",border:"none",cursor:"pointer",color:C.blue,display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:16,fontWeight:700}}>⊕</span> Add
        </button>
        <Pager page={1} setPage={()=>{}} per={10} total={cats.length}/>
      </Modal>
    </div>);
};

// ── EMPLOYEES PAGE ────────────────────────────────────────────────────────────

const EmployeesPage=({nav})=>{
  const [q,setQ]=useState(""),[fStatus,setFStatus]=useState("all");
  const [fType,setFType]=useState("all"),[page,setPage]=useState(1),[toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const reset=()=>{setQ("");setFStatus("all");setFType("all");setPage(1);};
  const filtered=useMemo(()=>filt(EMPLOYEES_DATA,{type:fType},["first","last","empId"],q),[q,fStatus,fType]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Employees"}]} nav={nav}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{color:C.textMut}}>{Ic.filt}</span>
        <FSel label="Filter by Status" opts={["Active","InActive"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <FSel label="Filter by Type" opts={["Field","Office"]} val={fType} onChange={v=>{setFType(v);setPage(1);}} w={155}/>
        <Btn ch="Clear" onClick={reset} sm/>
        <div style={{marginLeft:"auto"}}>
          <Btn ch="Manage Payroll Categories" variant="purple" onClick={()=>doToast("Payroll categories opened")}/>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
        <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}}/>
        <span style={{marginLeft:"auto",fontSize:12,color:C.textMut}}>Showing 1 to {Math.min(10,total)} of {total} entries</span>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/>
            <Th ch="ID"/><Th ch="Name"/><Th ch="Type"/><Th ch="Payroll Category"/>
            <th style={{width:100,background:"#f9fafb",borderBottom:"1px solid "+C.border}}/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing ${r.first}`)}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>doToast(`Deleted ${r.first}`)}/></>}/>
                <Td ch={r.empId}/>
                <Td ch={<span style={{fontWeight:500}}>{r.first} {r.last!=="-"?r.last:""}</span>}/>
                <Td ch={r.type}/>
                <Td ch={r.payroll||"—"}/>
                <Td ch={<Btn ch="Deactivate" variant="gray" sm onClick={()=>doToast(`${r.first} deactivated`)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={()=>doToast("Add employee")}
          style={{padding:"6px 12px",fontSize:12,background:"none",border:"none",cursor:"pointer",
            color:C.blue,display:"flex",alignItems:"center",gap:4,marginTop:8}}>
          <span style={{fontSize:16,fontWeight:700}}>⊕</span> Add
        </button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
      <div style={{marginTop:10}}><Btn ch="Show Multiselect" variant="gray" sm icon={Ic.check}/></div>
    </div>);
};


// ── EQUIPMENT PAGE ────────────────────────────────────────────────────────────

const EquipmentPage=({nav})=>{
  const [selType,setSelType]=useState(""),[selEquip,setSelEquip]=useState("");
  const [fStatus,setFStatus]=useState("all"),[fEquip,setFEquip]=useState("all");
  const [fEqType,setFEqType]=useState("all"),[fMake,setFMake]=useState("all");
  const [fModel,setFModel]=useState("all"),[page,setPage]=useState(1),[toast,setToast]=useState("");
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const reset=()=>{setFStatus("all");setFEquip("all");setFEqType("all");setFMake("all");setFModel("all");setPage(1);};
  const filtered=useMemo(()=>filt(EQUIP_UNITS,{equip:fEquip==="all"?undefined:fEquip,type:fEqType==="all"?undefined:fEqType,make:fMake==="all"?undefined:fMake},["equip","type","make","model","vin"],""
  ),[fEquip,fEqType,fMake,fModel]);
  const {items,total}=pg(filtered,page,10);
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Equipment"}]} nav={nav}/>
      {/* equipment type tiles */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:16,marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Equipment List</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16}}>
          {EQUIP_TYPES.map(t=>(
            <div key={t}
              onClick={()=>setSelType(selType===t?"":t)}
              style={{padding:"14px 20px",border:"1px solid #d1d5db",borderRadius:6,cursor:"pointer",
                minWidth:110,textAlign:"center",fontSize:12,fontWeight:500,position:"relative",
                background:selType===t?"#eff6ff":C.white,
                borderColor:selType===t?C.blue:"#d1d5db",
                color:selType===t?C.blue:C.textSec}}>
              <span style={{position:"absolute",top:4,right:6,color:C.red,fontSize:14,cursor:"pointer"}}
                onClick={e=>{e.stopPropagation();doToast(`Removed ${t}`);}}>×</span>
              {t}
            </div>))}
        </div>
        <div style={{display:"flex",gap:12,alignItems:"flex-end",flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:C.textSec,marginBottom:4}}>Equipment Type</div>
            <FSel label="Select options" opts={EQUIP_TYPES} val={selType||"all"} onChange={v=>setSelType(v==="all"?"":v)} w={180}/>
          </div>
          <div style={{flex:1,maxWidth:420}}>
            <div style={{fontSize:11,fontWeight:600,color:C.textSec,marginBottom:4}}>Select Equipment</div>
            <FSel label="Select options" opts={["Unit 1","Unit 2","Unit 3","Unit 4","Unit 5"]} val={selEquip||"all"} onChange={v=>setSelEquip(v==="all"?"":v)} w={320}/>
          </div>
          <Btn ch="Select" variant="purple" onClick={()=>doToast(`Equipment selected: ${selType||"none"} – ${selEquip||"none"}`)}/>
        </div>
      </div>
      {/* equipment units table */}
      <div style={{fontWeight:700,fontSize:14,marginBottom:10}}>Equipment Units</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{color:C.textMut}}>{Ic.filt}</span>
        <FSel label="Filter by Status" opts={["Active","InActive"]} val={fStatus} onChange={v=>{setFStatus(v);setPage(1);}}/>
        <FSel label="Filter by Equipment" opts={uniq(EQUIP_UNITS,"equip")} val={fEquip} onChange={v=>{setFEquip(v);setPage(1);}} w={160}/>
        <FSel label="Filter by Equipment Type" opts={uniq(EQUIP_UNITS,"type")} val={fEqType} onChange={v=>{setFEqType(v);setPage(1);}} w={185}/>
        <FSel label="Filter by Make" opts={uniq(EQUIP_UNITS,"make")} val={fMake} onChange={v=>{setFMake(v);setPage(1);}}/>
        <FSel label="Filter by Model" opts={uniq(EQUIP_UNITS,"model")} val={fModel} onChange={v=>{setFModel(v);setPage(1);}}/>
        <Btn ch="Clear" onClick={reset} sm/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <SearchBar value="" onChange={()=>{}}/>
        <span style={{marginLeft:"auto",fontSize:12,color:C.textMut}}>Showing 1 to {Math.min(10,total)} of {total} entries</span>
      </div>
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <Th ch="" w={70}/>
            <Th ch="Equipment"/><Th ch="Unit Number"/><Th ch="Equipment Type"/>
            <Th ch="Year"/><Th ch="Make"/><Th ch="Model"/><Th ch="VIN (Serial Number)"/><Th ch="Purchase Date"/>
            <th style={{width:100,background:"#f9fafb",borderBottom:"1px solid "+C.border}}/>
          </tr></thead>
          <tbody>
            {items.length===0?<NoRows/>:items.map(r=>(
              <tr key={r.id}>
                <Td ch={<><IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing unit ${r.unit}`)}/><IBtn icon={Ic.trash} color={C.red} onClick={()=>doToast(`Deleted unit ${r.unit}`)}/></>}/>
                <Td ch={r.equip}/><Td ch={r.unit}/><Td ch={r.type}/>
                <Td ch={r.year}/><Td ch={r.make}/><Td ch={r.model}/><Td ch={r.vin}/><Td ch={r.purchDate||"—"}/>
                <Td ch={<Btn ch="Deactivate" variant="gray" sm onClick={()=>doToast(`Unit ${r.unit} deactivated`)}/>}/>
              </tr>))}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <button onClick={()=>doToast("Add equipment unit")}
          style={{padding:"6px 12px",fontSize:12,background:"none",border:"none",cursor:"pointer",
            color:C.blue,display:"flex",alignItems:"center",gap:4,marginTop:8}}>
          <span style={{fontSize:16,fontWeight:700}}>⊕</span> Add
        </button>
        <Pager page={page} setPage={setPage} per={10} total={total}/>
      </div>
    </div>);
};

// ── REPORT SETUP PAGE ─────────────────────────────────────────────────────────

const ReportSetupPage=({nav})=>{
  const [activeTab,setActiveTab]=useState("Activities");
  const [search,setSearch]=useState("");
  const [collapsed,setCollapsed]=useState({});
  const [toast,setToast]=useState(""),[form,setForm]=useState({});
  const doToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const toggle=k=>setCollapsed(p=>({...p,[k]:!p[k]}));
  const ALL_TABS=["Activities","Drilling","Consumables","Employees","Equipment","Report Setup"];
  const actCategories=Object.keys(REPORT_SETUP);
  const filteredCats=actCategories.filter(cat=>{
    if(!search)return true;
    return cat.toLowerCase().includes(search.toLowerCase())||
      REPORT_SETUP[cat].some(a=>a.toLowerCase().includes(search.toLowerCase()));
  });
  return(
    <div>
      <Toast msg={toast}/>
      <Crumb items={[{label:"Home",page:"home"},{label:"Report Setup"}]} nav={nav}/>
      {/* tab selector */}
      <div style={{display:"flex",gap:0,marginBottom:16,borderBottom:"1px solid "+C.border,overflowX:"auto"}}>
        {ALL_TABS.map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            style={{padding:"8px 16px",fontSize:12,fontWeight:activeTab===t?600:400,
              border:"none",borderBottom:activeTab===t?"2px solid "+C.blue:"2px solid transparent",
              background:"none",cursor:"pointer",color:activeTab===t?C.blue:C.textMut,
              whiteSpace:"nowrap"}}>
            {t}
          </button>))}
      </div>

      {activeTab==="Activities"&&(
        <div>
          {/* drill / contract selector row */}
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:12,marginBottom:14,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:11,color:C.textMut,marginBottom:3}}>Select Drill</div>
              <FSel label="Select Drill" opts={DRILLS_DATA.map(d=>d.name)} val={form.drill||"all"} onChange={v=>setForm({...form,drill:v})} w={140}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.textMut,marginBottom:3}}>Select Contract</div>
              <FSel label="Select Contract" opts={["BM-NM Drilling Program 2024-2026 DD","BM-NM Drilling Program 2024-2026 RC","ERD Drilling Program 2026 DD"]} val={form.contract||"all"} onChange={v=>setForm({...form,contract:v})} w={270}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.textMut,marginBottom:3}}>Select Category</div>
              <FSel label="All" opts={actCategories} val={form.cat||"all"} onChange={v=>setForm({...form,cat:v})} w={180}/>
            </div>
            <div>
              <div style={{fontSize:11,color:C.textMut,marginBottom:3}}>Select Activity</div>
              <FSel label="All" opts={form.cat&&form.cat!=="all"?REPORT_SETUP[form.cat]:[]} val={form.activity||"all"} onChange={v=>setForm({...form,activity:v})} w={240}/>
            </div>
          </div>
          {/* tabs within Activities */}
          <div style={{display:"flex",gap:8,marginBottom:12,overflowX:"auto"}}>
            {["Activities","Coring","Downtime","Cuttings Control","Directional","Drilling","Fishing",
              "Fluid Motion","Hole Conditioning","Hole Monitoring","Installations","Jetting","Other",
              "Reaming","Repair","Safety","Standby","Standby - Contractor","Stand Ends","Startup","Transit","Trubhai","Wireline Ops"].map(t=>(
              <button key={t} onClick={()=>{}}
                style={{padding:"4px 10px",fontSize:11,borderRadius:12,border:"1px solid #d1d5db",
                  background:t==="Activities"?"#dbeafe":C.white,color:t==="Activities"?C.blue:C.textSec,
                  cursor:"pointer",whiteSpace:"nowrap",fontWeight:t==="Activities"?600:400}}>
                {t}
              </button>))}
          </div>
          {/* search */}
          <div style={{marginBottom:12}}>
            <SearchBar value={search} onChange={setSearch}/>
          </div>
          {/* activity sections */}
          {filteredCats.map(cat=>{
            const acts=REPORT_SETUP[cat].filter(a=>!search||a.toLowerCase().includes(search.toLowerCase())||cat.toLowerCase().includes(search.toLowerCase()));
            if(!acts.length&&search)return null;
            const isCollapsed=collapsed[cat];
            return(
              <div key={cat} style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,marginBottom:8,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"8px 14px",cursor:"pointer",background:"#f9fafb",
                  borderBottom:isCollapsed?"none":"1px solid "+C.border}} onClick={()=>toggle(cat)}>
                  <span style={{fontSize:12,fontWeight:600,color:C.textPri}}>{cat}</span>
                  <span style={{fontSize:12,color:C.textMut,display:"flex",alignItems:"center",gap:4}}>
                    {isCollapsed?Ic.chR:Ic.chD}
                  </span>
                </div>
                {!isCollapsed&&(
                  <div style={{padding:"6px 0"}}>
                    {acts.map((a,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                        padding:"6px 14px",borderBottom:i<acts.length-1?"1px solid #f9fafb":"none"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <IBtn icon={Ic.edit} color={C.teal} onClick={()=>doToast(`Editing: ${a}`)}/>
                          <IBtn icon={Ic.trash} color={C.red} onClick={()=>doToast(`Deleted: ${a}`)}/>
                          <span style={{fontSize:12,color:C.textSec}}>{a}</span>
                        </div>
                        <Btn ch="Activate" variant="outline" sm onClick={()=>doToast(`${a} activated`)}/>
                      </div>))}
                    <button onClick={()=>doToast(`Add new ${cat} activity`)}
                      style={{padding:"6px 14px",fontSize:12,background:"none",border:"none",
                        cursor:"pointer",color:C.blue,display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:15}}>⊕</span> Add
                    </button>
                  </div>)}
              </div>);
          })}
        </div>)}

      {activeTab!=="Activities"&&(
        <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:6,padding:24,textAlign:"center"}}>
          <div style={{color:"#9ca3af",fontSize:13}}>
            {activeTab} setup configuration — select from the tabs above to configure report settings.
          </div>
        </div>)}
    </div>);
};


// ── SIDEBAR ───────────────────────────────────────────────────────────────────

const SIDEBAR_W=260;

const Sidebar=({page,nav})=>{
  const [mgmtOpen,setMgmtOpen]=useState(true);
  const [presetsOpen,setPresetsOpen]=useState(true);
  const isActive=p=>p===page;
  const Item=({icon,label,p,badge,indent})=>(
    <div onClick={()=>nav(p)}
      style={{display:"flex",alignItems:"center",gap:0,padding:"7px 12px",
        cursor:"pointer",borderRadius:4,margin:"1px 6px",
        background:isActive(p)?"#e0f2fe":"transparent",
        color:isActive(p)?C.blue:C.textSec,
        fontSize:13,fontWeight:isActive(p)?600:400}}>
      <span style={{width:20,flexShrink:0,marginLeft:indent?18:0}}/>
      <span style={{width:22,flexShrink:0,fontSize:15,textAlign:"center"}}>{icon}</span>
      <span style={{flex:1,marginLeft:8}}>{label}</span>
      {badge&&<span style={{background:C.orange,color:"#fff",fontSize:10,fontWeight:700,
        padding:"1px 6px",borderRadius:10,minWidth:18,textAlign:"center"}}>{badge}</span>}
    </div>);
  const Group=({icon,label,open,setOpen,children})=>(
    <div>
      <div onClick={()=>setOpen(o=>!o)}
        style={{display:"flex",alignItems:"center",gap:0,padding:"7px 12px",
          cursor:"pointer",color:C.textSec,fontSize:13,fontWeight:500}}>
        <span style={{width:20,flexShrink:0}}/>
        <span style={{width:22,flexShrink:0,fontSize:15,textAlign:"center"}}>{icon}</span>
        <span style={{flex:1,marginLeft:8}}>{label}</span>
        <span style={{fontSize:10,transition:"transform .2s",
          transform:open?"rotate(180deg)":"rotate(0)"}}>{Ic.chD}</span>
      </div>
      {open&&<div>{children}</div>}
    </div>);
  return(
    <div style={{width:SIDEBAR_W,minWidth:SIDEBAR_W,background:C.white,
      borderRight:"1px solid "+C.border,display:"flex",flexDirection:"column",
      height:"100vh",position:"sticky",top:0,flexShrink:0}}>
      {/* logo */}
      <div style={{padding:"20px 16px 16px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",gap:12}}>
        <img src="/logo.png" alt="AEB Logo" style={{width:48,height:48,objectFit:"contain",flexShrink:0}}/>
        <div>
          <div style={{fontSize:14,fontWeight:900,color:C.blue,letterSpacing:.3,lineHeight:1.3}}>AEB Operations</div>
          <div style={{fontSize:14,fontWeight:900,color:C.blue,letterSpacing:.3,lineHeight:1.3}}>Intelligence™</div>
        </div>
      </div>
      {/* nav items */}
      <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
        <Item icon="🏠" label="Home" p="home"/>
        <Item icon="📋" label="Daily Shift Report" p="dsr" badge={76}/>
        <Item icon="⏱" label="Timesheet" p="timesheet"/>
        <Group icon="🏗" label="Management" open={mgmtOpen} setOpen={setMgmtOpen}>
          <Item icon="📂" label="Projects" p="projects" indent/>
          <Item icon="⊙" label="Holes" p="holes" indent/>
          <Item icon="💎" label="Bits" p="bits" indent/>
        </Group>
        <Group icon="⚙️" label="Presets" open={presetsOpen} setOpen={setPresetsOpen}>
          <Item icon="⚙" label="Drilling Rigs" p="drills" indent/>
          <Item icon="🔧" label="Consumables" p="consumables" indent/>
          <Item icon="👷" label="Employees" p="employees" indent/>
          <Item icon="🚗" label="Equipment" p="equipment" indent/>
          <Item icon="📄" label="Report Setup" p="report-setup" indent/>
        </Group>
      </div>
    </div>);
};

// ── TOPBAR ────────────────────────────────────────────────────────────────────

const PAGE_TITLES={
  "home":"Home","dsr":"Daily Shift Report","dsr-summary":"Daily Report Summary",
  "shift-detail":"Shift Detail","timesheet":"Timesheet","projects":"Projects",
  "holes":"Holes","hole-detail":"Hole Detail","bits":"Bits","drills":"Drilling Rigs",
  "consumables":"Consumables","employees":"Employees","equipment":"Equipment","report-setup":"Report Setup",
};
const PAGE_ICONS={
  "home":"🏠","dsr":"📋","dsr-summary":"📋","shift-detail":"📋","timesheet":"⏱",
  "projects":"🗂","holes":"⊙","hole-detail":"⊙","bits":"💎","drills":"⚙️",
  "consumables":"🔧","employees":"👷","equipment":"🚗","report-setup":"📄",
};

const Topbar=({page})=>(
  <div style={{display:"flex",alignItems:"center",padding:"0 20px",height:52,
    background:C.white,borderBottom:"1px solid "+C.border,flexShrink:0,position:"sticky",top:0,zIndex:50}}>
    <span style={{flex:1,textAlign:"center",fontSize:13,fontWeight:600,color:C.textSec}}>
      {PAGE_ICONS[page]} {PAGE_TITLES[page]||"AEB Operations Intelligence™"}
    </span>
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textMut}}>
        <div style={{width:22,height:22,background:C.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:10,fontWeight:700,color:"#fff"}}>A</span>
        </div>
        <span>supervisor@drillexp.com</span>
      </div>
      <button style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",
        cursor:"pointer",color:C.textMut,fontSize:12}}>
        {Ic.logout} Logout
      </button>
      <button style={{width:26,height:26,borderRadius:"50%",background:C.blue,color:"#fff",
        border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:13,fontWeight:700}}>
        ?
      </button>
    </div>
  </div>);

// ── ROUTER / APP ROOT ─────────────────────────────────────────────────────────

export default function App(){
  const [page,setPage]=useState("home");
  const [params,setParams]=useState({});

  const nav=(p,pr={})=>{setPage(p);setParams(pr);window.scrollTo({top:0,behavior:"smooth"});};

  const renderPage=()=>{
    switch(page){
      case "home":          return <HomePage nav={nav}/>;
      case "dsr":           return <DSRPage nav={nav}/>;
      case "dsr-summary":   return <DSRSummaryPage nav={nav} params={params}/>;
      case "shift-detail":  return <ShiftDetailPage nav={nav} params={params}/>;
      case "timesheet":     return <TimesheetPage nav={nav}/>;
      case "projects":      return <ProjectsPage nav={nav}/>;
      case "holes":         return <HolesPage nav={nav}/>;
      case "hole-detail":   return <HoleDetailPage nav={nav} params={params}/>;
      case "bits":          return <BitsPage nav={nav}/>;
      case "drills":        return <DrillsPage nav={nav}/>;
      case "consumables":   return <ConsumablesPage nav={nav}/>;
      case "employees":     return <EmployeesPage nav={nav}/>;
      case "equipment":     return <EquipmentPage nav={nav}/>;
      case "report-setup":  return <ReportSetupPage nav={nav}/>;
      default:              return <HomePage nav={nav}/>;
    }
  };

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <Sidebar page={page} nav={nav}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <Topbar page={page}/>
        <div style={{flex:1,padding:20,width:"100%",boxSizing:"border-box"}}>
          {renderPage()}
        </div>
        <div style={{borderTop:"1px solid "+C.border,padding:"10px 20px",
          display:"flex",justifyContent:"flex-end",alignItems:"center",gap:8,
          background:C.white,fontSize:11,color:C.textMut}}>
          <span>© 2026 AEB Operations Intelligence™ · Powered by Anıl Enis BALCI All Rights Reserved.</span>
          <span style={{fontWeight:700,color:C.purple,fontSize:13}}>NS</span>
        </div>
      </div>
    </div>);
}
