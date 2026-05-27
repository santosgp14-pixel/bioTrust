import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const DARK = {
  bg:       "#0f1117",
  surface:  "#161b27",
  card:     "#1c2333",
  cardHov:  "#212a3e",
  border:   "#2a3349",
  borderSub:"#1e2a3f",
  text:     "#e8edf5",
  textSub:  "#8b97b0",
  textMut:  "#4f5e78",
  accent:   "#4f7cff",
  accentSub:"#1e2e52",
  accentHov:"#6690ff",
  green:    "#22c55e",
  greenBg:  "#0d2318",
  greenTxt: "#4ade80",
  red:      "#ef4444",
  redBg:    "#2d1010",
  redTxt:   "#f87171",
  amber:    "#f59e0b",
  amberBg:  "#2a1c00",
  amberTxt: "#fbbf24",
  blue:     "#38bdf8",
  blueBg:   "#0a1e2e",
  blueTxt:  "#7dd3fc",
  purple:   "#a78bfa",
  purpleBg: "#1e1432",
  purpleTxt:"#c4b5fd",
};

const LIGHT = {
  bg:       "#f0f4f9",
  surface:  "#ffffff",
  card:     "#ffffff",
  cardHov:  "#eef2fa",
  border:   "#d1d9e6",
  borderSub:"#e5eaf4",
  text:     "#0f172a",
  textSub:  "#475569",
  textMut:  "#94a3b8",
  accent:   "#2563eb",
  accentSub:"#dbeafe",
  accentHov:"#1d4ed8",
  green:    "#16a34a",
  greenBg:  "#dcfce7",
  greenTxt: "#15803d",
  red:      "#dc2626",
  redBg:    "#fee2e2",
  redTxt:   "#b91c1c",
  amber:    "#d97706",
  amberBg:  "#fef3c7",
  amberTxt: "#b45309",
  blue:     "#0284c7",
  blueBg:   "#e0f2fe",
  blueTxt:  "#0369a1",
  purple:   "#7c3aed",
  purpleBg: "#ede9fe",
  purpleTxt:"#6d28d9",
};

const ThemeCtx  = createContext(DARK);
const useT      = () => useContext(ThemeCtx);
const ClientCtx = createContext(null);
const useClient = () => useContext(ClientCtx);

/* ── Data ──────────────────────────────────────────────────────────────────── */
const CLIENTS = [
  { id:"CLI-001", name:"Hospital Italiano",    city:"Buenos Aires", contact:"Dr. Marcos Pini",   phone:"011 4959-0200", plan:"Abono Premium",    color:"#4f7cff", initials:"HI", services:["UCI","Lab Central","Quirófano 3","Cardiología"],   equipCount:3, tickets:2, certsExpiring:1 },
  { id:"CLI-002", name:"Sanatorio Güemes",     city:"Buenos Aires", contact:"Lic. Paula Romero", phone:"011 4827-8200", plan:"Abono Estándar",   color:"#22c55e", initials:"SG", services:["Cardiología","Cirugía","Laboratorio"],              equipCount:3, tickets:2, certsExpiring:2 },
  { id:"CLI-003", name:"Hospital Alemán",      city:"Buenos Aires", contact:"Ing. Claudia Ríos", phone:"011 4827-7000", plan:"Abono Premium",    color:"#f59e0b", initials:"HA", services:["Diagnóstico","UTI","Imágenes","Taller"],           equipCount:2, tickets:1, certsExpiring:0 },
  { id:"CLI-004", name:"Clínica Santa Isabel", city:"Córdoba",      contact:"Sr. Felipe Gauna",  phone:"0351 423-1100", plan:"Servicio Técnico", color:"#a78bfa", initials:"CS", services:["Laboratorio","Urgencias","Guardia"],                equipCount:2, tickets:1, certsExpiring:1 },
];

const EQUIPMENT = [
  { id:"EQ-001", clientId:"CLI-001", manufacturer:"Philips",      model:"IntelliVue MX800",   serial:"PH-2024-0081", service:"UCI",         type:"Monitor",          status:"operational", cert:"valid",    location:"UCI",         lastService:"2024-11-12", nextCert:"2025-06-15", hospital:"Hospital Italiano"    },
  { id:"EQ-002", clientId:"CLI-002", manufacturer:"GE Healthcare",model:"Vivid E9",           serial:"GE-2022-1134", service:"Cardiología", type:"Ecógrafo",         status:"critical",    cert:"expiring", location:"Cardiología", lastService:"2024-09-03", nextCert:"2025-03-01", hospital:"Sanatorio Güemes"     },
  { id:"EQ-003", clientId:"CLI-003", manufacturer:"Siemens",      model:"SOMATOM Drive",      serial:"SI-2021-0445", service:"Diagnóstico", type:"Tomógrafo",        status:"in-repair",   cert:"valid",    location:"Diagnóstico", lastService:"2024-08-20", nextCert:"2025-09-10", hospital:"Hospital Alemán"      },
  { id:"EQ-004", clientId:"CLI-004", manufacturer:"Mindray",      model:"BC-6800 Plus",       serial:"MR-2023-2201", service:"Laboratorio", type:"Analizador",       status:"operational", cert:"expired",  location:"Laboratorio", lastService:"2024-12-01", nextCert:"2024-12-31", hospital:"Clínica Santa Isabel" },
  { id:"EQ-005", clientId:"CLI-001", manufacturer:"Dräger",       model:"Fabius GS Premium",  serial:"DR-2020-0892", service:"Quirófano 3", type:"Anestesia",        status:"operational", cert:"valid",    location:"Quirófano 3", lastService:"2024-10-15", nextCert:"2025-08-22", hospital:"Hospital Italiano"    },
  { id:"EQ-006", clientId:"CLI-002", manufacturer:"Baxter",       model:"Sigma Spectrum 8.0", serial:"BX-2023-0567", service:"Cirugía",     type:"Bomba Inf.",       status:"in-transit",  cert:"valid",    location:"En tránsito", lastService:"2024-11-30", nextCert:"2025-07-18", hospital:"Sanatorio Güemes"     },
  { id:"EQ-007", clientId:"CLI-003", manufacturer:"Medtronic",    model:"Puritan Bennett 980", serial:"MD-2022-3312", service:"UTI",         type:"Respirador",       status:"operational", cert:"valid",    location:"UTI",         lastService:"2024-12-10", nextCert:"2025-10-05", hospital:"Hospital Alemán"      },
  { id:"EQ-008", clientId:"CLI-001", manufacturer:"Roche",        model:"cobas e 801",        serial:"RO-2021-1098", service:"Lab Central",  type:"Inmunoanalizador", status:"critical",    cert:"expiring", location:"Lab Central",  lastService:"2024-07-22", nextCert:"2025-02-14", hospital:"Hospital Italiano"    },
  { id:"EQ-009", clientId:"CLI-004", manufacturer:"Nihon Kohden", model:"TEC-5531K",          serial:"NK-2023-0341", service:"Urgencias",   type:"Desfibrilador",    status:"operational", cert:"valid",    location:"Urgencias",   lastService:"2024-11-05", nextCert:"2025-11-05", hospital:"Clínica Santa Isabel" },
  { id:"EQ-010", clientId:"CLI-002", manufacturer:"Olympus",      model:"EVIS X1",            serial:"OL-2022-0789", service:"Laboratorio",  type:"Endoscopio",       status:"in-repair",   cert:"valid",    location:"Taller",      lastService:"2024-10-28", nextCert:"2025-05-20", hospital:"Sanatorio Güemes"     },
];

const TICKETS = [
  { id:"TK-2401", clientId:"CLI-003", equipment:"EQ-003", model:"SOMATOM Drive",     hospital:"Hospital Alemán",      technician:"Ing. Lucas Ferreyra",  avatar:"LF", priority:"high",     status:"repairing",       created:"01/12/2024", notes:"Falla en detector del canal B. Reemplazo en curso.", parts:"DAS Module SI-A4422" },
  { id:"TK-2402", clientId:"CLI-002", equipment:"EQ-002", model:"Vivid E9",          hospital:"Sanatorio Güemes",     technician:"Téc. María Solano",    avatar:"MS", priority:"critical",  status:"waiting-parts",   created:"05/12/2024", notes:"Transductor M4S deteriorado. Aguardando entrega del proveedor.", parts:"Transductor M4S-RS" },
  { id:"TK-2403", clientId:"CLI-001", equipment:"EQ-008", model:"cobas e 801",       hospital:"Hospital Italiano",    technician:"Ing. Diego Paredes",   avatar:"DP", priority:"high",     status:"diagnosing",      created:"10/12/2024", notes:"Error E-4402 intermitente. Realizando diagnóstico de módulo fluídico.", parts:"—" },
  { id:"TK-2404", clientId:"CLI-002", equipment:"EQ-010", model:"EVIS X1",           hospital:"Sanatorio Güemes",     technician:"Téc. Ana Villalba",    avatar:"AV", priority:"medium",   status:"budget-approval", created:"28/11/2024", notes:"Canal de luz roto. Presupuesto enviado al cliente.", parts:"Light Guide OL-LG200" },
  { id:"TK-2405", clientId:"CLI-001", equipment:"EQ-001", model:"IntelliVue MX800",  hospital:"Hospital Italiano",    technician:"Ing. Lucas Ferreyra",  avatar:"LF", priority:"low",      status:"ready",           created:"20/11/2024", notes:"Cambio preventivo de batería y calibración anual completados.", parts:"Battery Kit PH-BAT2" },
  { id:"TK-2406", clientId:"CLI-004", equipment:"EQ-009", model:"TEC-5531K",         hospital:"Clínica Santa Isabel", technician:"Téc. María Solano",    avatar:"MS", priority:"medium",   status:"delivered",       created:"10/11/2024", notes:"Revisión periódica y prueba de descarga. Equipo entregado conforme.", parts:"—" },
];

const CERTS = [
  // ── Por vencer (expiring) ────────────────────────────────────────────────
  { id:"CV-001", clientId:"CLI-002", model:"INFINITY VISTA XL", serial:"6000355376", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-05", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"14 de mayo" },
  { id:"CV-002", clientId:"CLI-002", model:"INFINITY VISTA XL", serial:"6000866968", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-10", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"18 de mayo" },
  { id:"CV-003", clientId:"CLI-002", model:"INFINITY VISTA XL", serial:"6001252283", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-05", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"18 de mayo" },
  { id:"CV-004", clientId:"CLI-002", model:"INFINITY VISTA XL", serial:"6002535677", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-05", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-005", clientId:"CLI-002", model:"INFINITY VISTA XL", serial:"6002731174", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-05", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"14 de mayo" },
  { id:"CV-006", clientId:"CLI-002", model:"INFINITY VISTA XL", serial:"6002751179", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-05", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"18 de mayo" },
  { id:"CV-007", clientId:"CLI-002", model:"INFINITY VISTA XL", serial:"3396191663", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-05", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"14 de mayo" },
  { id:"CV-008", clientId:"CLI-004", model:"QUBE",              serial:"1390-120217", hospital:"Clínica Santa Isabel",type:"Performance",    expiry:"2026-06-10", status:"expiring", issuer:"ANMAT",          mtrLoaded:true,  doneDate:"19 de mayo" },
  { id:"CV-009", clientId:"CLI-004", model:"QUBE",              serial:"1390-120216", hospital:"Clínica Santa Isabel",type:"Performance",    expiry:"2026-06-02", status:"expiring", issuer:"ANMAT",          mtrLoaded:false, doneDate:null },
  { id:"CV-010", clientId:"CLI-002", model:"XPREZZON",          serial:"1393-100491", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-15", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"5 de mayo" },
  { id:"CV-011", clientId:"CLI-002", model:"XPREZZON",          serial:"1393-100495", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-06-02", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"6 de mayo" },
  { id:"CV-012", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103606", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-12", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-013", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103608", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-03", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-014", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103610", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-05-25", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-015", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103611", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-15", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"24 de abril" },
  { id:"CV-016", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103612", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-05-25", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-017", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103613", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-15", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"24 de abril" },
  { id:"CV-018", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103647", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-04", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-019", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103664", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-03", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-020", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103665", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-12", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-021", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103669", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-12", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-022", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103670", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-03", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"14 de mayo" },
  { id:"CV-023", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103759", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-06-04", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-024", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103765", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-05-21", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-025", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-106026", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-06-15", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-026", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-106054", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-06-11", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"8 de mayo" },
  { id:"CV-027", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-106056", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-06-02", status:"expiring", issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CV-028", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-110893", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-06-15", status:"expiring", issuer:"INTI",           mtrLoaded:true,  doneDate:"29 de abril" },
  { id:"CV-029", clientId:"CLI-001", model:"MEC1200",           serial:"CC-1C120948", hospital:"Hospital Italiano",   type:"Performance",    expiry:"2026-06-12", status:"expiring", issuer:"ANMAT",          mtrLoaded:true,  doneDate:"30 de abril" },
  // ── No vigentes (expired) ────────────────────────────────────────────────
  { id:"CE-001", clientId:"CLI-002", model:"XPREZZON",          serial:"1393-100484", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-04-30", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-002", clientId:"CLI-002", model:"XPREZZON",          serial:"1393-100490", hospital:"Sanatorio Güemes",    type:"Seg. Eléctrica", expiry:"2026-04-30", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-003", clientId:"CLI-004", model:"INFINITY GATEWAY",  serial:"5513043468",  hospital:"Clínica Santa Isabel",type:"Seg. Eléctrica", expiry:"2026-04-15", status:"expired",  issuer:"Bureau Veritas",  mtrLoaded:false, doneDate:null },
  { id:"CE-004", clientId:"CLI-004", model:"INFINITY GATEWAY",  serial:"5514303578",  hospital:"Clínica Santa Isabel",type:"Seg. Eléctrica", expiry:"2026-04-15", status:"expired",  issuer:"Bureau Veritas",  mtrLoaded:true,  doneDate:null },
  { id:"CE-005", clientId:"CLI-003", model:"MP5",               serial:"DE50189583",  hospital:"Hospital Alemán",     type:"Performance",    expiry:"2026-04-20", status:"expired",  issuer:"ANMAT",          mtrLoaded:false, doneDate:null },
  { id:"CE-006", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103634", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-04-25", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-007", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103638", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-04-25", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-008", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103646", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-04-25", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-009", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103671", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-04-25", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-010", clientId:"CLI-003", model:"XPREZZON",          serial:"1393-103758", hospital:"Hospital Alemán",     type:"Seg. Eléctrica", expiry:"2026-04-25", status:"expired",  issuer:"INTI",           mtrLoaded:true,  doneDate:null },
  { id:"CE-011", clientId:"CLI-001", model:"VS-800",            serial:"BY-17129649", hospital:"Hospital Italiano",   type:"Performance",    expiry:"2026-04-10", status:"expired",  issuer:"ANMAT",          mtrLoaded:false, doneDate:null },
  { id:"CE-012", clientId:"CLI-001", model:"MP20",              serial:"DE54013117",  hospital:"Hospital Italiano",   type:"Performance",    expiry:"2026-04-18", status:"expired",  issuer:"ANMAT",          mtrLoaded:true,  doneDate:null },
  { id:"CE-013", clientId:"CLI-001", model:"MP20",              serial:"DE54013126",  hospital:"Hospital Italiano",   type:"Performance",    expiry:"2026-04-18", status:"expired",  issuer:"ANMAT",          mtrLoaded:true,  doneDate:null },
  { id:"CE-014", clientId:"CLI-001", model:"MP40",              serial:"DE82017003",  hospital:"Hospital Italiano",   type:"Performance",    expiry:"2026-04-22", status:"expired",  issuer:"ANMAT",          mtrLoaded:false, doneDate:null },
  { id:"CE-015", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-103639", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-04-25", status:"expired",  issuer:"INTI",           mtrLoaded:true,  doneDate:null },
  { id:"CE-016", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-103762", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-04-25", status:"expired",  issuer:"INTI",           mtrLoaded:true,  doneDate:null },
  { id:"CE-017", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-103770", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-04-25", status:"expired",  issuer:"INTI",           mtrLoaded:true,  doneDate:null },
  { id:"CE-018", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-106031", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-04-30", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-019", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-106053", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-04-30", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-020", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-110869", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-05-05", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
  { id:"CE-021", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-110885", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-05-05", status:"expired",  issuer:"INTI",           mtrLoaded:true,  doneDate:null },
  { id:"CE-022", clientId:"CLI-001", model:"XPREZZON",          serial:"1393-110889", hospital:"Hospital Italiano",   type:"Seg. Eléctrica", expiry:"2026-05-05", status:"expired",  issuer:"INTI",           mtrLoaded:false, doneDate:null },
];

const ACTIVITY = [
  { time:"Hace 12 min", event:"Ticket TK-2403 creado",           sub:"cobas e 801 — Hospital Italiano",            type:"ticket" },
  { time:"Hace 1 h",    event:"Certificado próximo a vencer",    sub:"Vivid E9 — Sanatorio Güemes (32 días)",      type:"alert" },
  { time:"Hace 2 h",    event:"EQ-005 despachado desde taller",  sub:"Fabius GS Premium → Hospital Italiano",      type:"transit" },
  { time:"Hace 4 h",    event:"TK-2405 marcado como listo",      sub:"IntelliVue MX800 — Ing. Ferreyra",           type:"done" },
  { time:"Ayer 17:30",  event:"MTR cargado",                     sub:"SOMATOM Drive — Certificado ARN 2025",       type:"cert" },
  { time:"Ayer 14:00",  event:"Equipo crítico registrado",       sub:"cobas e 801 — Error E-4402",                 type:"critical" },
];

const HISTORY = {
  "EQ-003": [
    { date:"Dic 01, 2024", type:"ticket",  title:"TK-2401 abierto",       desc:"Falla en detector canal B. Asignado a Ing. Ferreyra." },
    { date:"Nov 15, 2024", type:"cert",    title:"MTR cargado",           desc:"Dosimetría ARN renovada. Válida hasta Sep 2025." },
    { date:"Ago 20, 2024", type:"service", title:"Servicio preventivo",   desc:"Cambio de filtros, limpieza de gantry, calibración HU." },
    { date:"Mar 12, 2024", type:"failure", title:"Falla de software",     desc:"Error en consola de reconstrucción. Resuelto con actualización firmware v4.2." },
    { date:"Sep 05, 2023", type:"service", title:"Puesta en servicio",    desc:"Equipo instalado y puesto en servicio. Capacitación al personal técnico y clínico." },
  ],
  "EQ-002": [
    { date:"Dic 05, 2024", type:"ticket",  title:"TK-2402 abierto",       desc:"Transductor M4S deteriorado. Esperando repuesto de proveedor." },
    { date:"Oct 10, 2024", type:"cert",    title:"Certificación próxima a vencer", desc:"Seguridad Eléctrica Bureau Veritas — vence 01/03/2025." },
    { date:"Jul 15, 2024", type:"service", title:"Servicio preventivo",   desc:"Limpieza de cabezales, actualización firmware." },
  ],
};

const TICKET_STEPS = [
  { key:"diagnosing",       label:"Diagnóstico" },
  { key:"waiting-parts",    label:"Esp. repuestos" },
  { key:"budget-approval",  label:"Aprob. presupuesto" },
  { key:"repairing",        label:"Reparando" },
  { key:"ready",            label:"Listo" },
  { key:"delivered",        label:"Entregado" },
];

const MONTHS      = ["Jul","Ago","Sep","Oct","Nov","Dic"];
const REPAIRS_DATA= [4,6,5,8,7,9];
const CERTS_DATA  = [2,3,4,3,5,4];

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function filterEquipment(search, filter) {
  const q = search.toLowerCase();
  return EQUIPMENT.filter(e =>
    (filter === "all" || e.status === filter) &&
    `${e.model}${e.hospital}${e.serial}${e.manufacturer}`.toLowerCase().includes(q)
  );
}

function groupTicketsByDelivery() {
  return {
    active: TICKETS.filter(t => t.status !== "delivered"),
    finished: TICKETS.filter(t => t.status === "delivered"),
  };
}

function getCertStatusSummary() {
  const expired = CERTS.filter(c => c.status === "expired").length;
  const expiring = CERTS.filter(c => c.status === "expiring").length;
  const valid = CERTS.length - expired - expiring;
  return { expired, expiring, valid };
}

function sortCertsByStatus(certs) {
  const order = { expired:0, expiring:1, valid:2 };
  return [...certs].sort((a,b) => (order[a.status]||3) - (order[b.status]||3));
}

/* ── Cfg makers (theme-aware) ─────────────────────────────────────────────── */
const mkStatus  = T => ({
  operational: { label:"Operativo",    dot:T.green,  bg:T.greenBg,  text:T.greenTxt },
  critical:    { label:"Crítico",      dot:T.red,    bg:T.redBg,    text:T.redTxt   },
  "in-repair": { label:"En reparación",dot:T.amber,  bg:T.amberBg,  text:T.amberTxt },
  "in-transit":{ label:"En tránsito",  dot:T.blue,   bg:T.blueBg,   text:T.blueTxt  },
});
const mkCertCfg = T => ({
  valid:    { label:"Vigente",    bg:T.greenBg, text:T.greenTxt },
  expiring: { label:"Por vencer", bg:T.amberBg, text:T.amberTxt },
  expired:  { label:"Vencido",    bg:T.redBg,   text:T.redTxt   },
});
const mkTkCfg   = T => ({
  diagnosing:       { label:"Diagnóstico",   bg:T.purpleBg, text:T.purpleTxt },
  "waiting-parts":  { label:"Esp. repuestos",bg:T.amberBg,  text:T.amberTxt  },
  "budget-approval":{ label:"Aprob. pres.",  bg:T.amberBg,  text:T.amberTxt  },
  repairing:        { label:"Reparando",     bg:T.blueBg,   text:T.blueTxt   },
  ready:            { label:"Listo",         bg:T.greenBg,  text:T.greenTxt  },
  delivered:        { label:"Entregado",     bg:T.greenBg,  text:T.greenTxt  },
});
const mkPriCfg  = T => ({
  critical: { label:"Crítica", color:T.red },
  high:     { label:"Alta",    color:T.amber },
  medium:   { label:"Media",   color:T.blue },
  low:      { label:"Baja",    color:T.textMut },
});

/* ── Tiny shared components ─────────────────────────────────────────────────── */

function Pill({ cfg, dot }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:99, fontSize:11, fontWeight:500, background:cfg.bg, color:cfg.text, letterSpacing:"0.01em" }}>
      {dot && <span style={{ width:5, height:5, borderRadius:"50%", background:cfg.text, flexShrink:0 }} />}
      {cfg.label}
    </span>
  );
}

function Avatar({ initials, color="#4f7cff" }) {
  return (
    <div style={{ width:28, height:28, borderRadius:"50%", background:color+"22", border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color, flexShrink:0, letterSpacing:"0.05em" }}>
      {initials}
    </div>
  );
}

function SectionHeader({ title, sub, action }) {
  const T = useT();
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
      <div>
        <h1 style={{ fontSize:20, fontWeight:600, color:T.text, margin:0, letterSpacing:"-0.02em" }}>{title}</h1>
        {sub && <p style={{ fontSize:12, color:T.textMut, margin:"3px 0 0" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, style={}, hover=false, onClick }) {
  const T = useT();
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{ background: hov ? T.cardHov : T.card, border:`1px solid ${hov ? T.border : T.borderSub}`, borderRadius:12, transition:"background .15s, border .15s", ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, variant="ghost", onClick, style={} }) {
  const T = useT();
  const [hov, setHov] = useState(false);
  const base = { display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer", border:"none", transition:"all .15s", letterSpacing:"0.01em" };
  const variants = {
    primary: { background: hov ? T.accentHov : T.accent, color:"#fff" },
    ghost:   { background: hov ? T.surface : "transparent", color: hov ? T.text : T.textSub, border:`1px solid ${T.border}` },
    danger:  { background: hov ? "#7f1d1d" : T.redBg, color:T.redTxt, border:`1px solid ${T.redBg}` },
  };
  return <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

/* ── Bar Chart ─────────────────────────────────────────────────────────────── */
function BarChart() {
  const T = useT();
  const max = 12;
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:88 }}>
      {MONTHS.map((m, i) => (
        <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end", height:64 }}>
            <div style={{ flex:1, background:T.accent, borderRadius:"3px 3px 0 0", height:`${(REPAIRS_DATA[i]/max)*100}%`, opacity:0.8, transition:"height .3s" }} />
            <div style={{ flex:1, background:T.blue,   borderRadius:"3px 3px 0 0", height:`${(CERTS_DATA[i]/max)*100}%`, opacity:0.65, transition:"height .3s" }} />
          </div>
          <span style={{ fontSize:10, color:T.textMut }}>{m}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut ─────────────────────────────────────────────────────────────────── */
function Donut({ data }) {
  const T = useT();
  const total = data.reduce((a,b) => a+b.v, 0);
  const r = 36, circ = 2*Math.PI*r;
  let off = 0;
  const slices = data.map(d => { const s = { ...d, dash:(d.v/total)*circ, off: off*circ }; off += d.v/total; return s; });
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={44} cy={44} r={r} fill="none" stroke={T.border} strokeWidth={13} />
      {slices.map((s,i) => (
        <circle key={i} cx={44} cy={44} r={r} fill="none" stroke={s.c} strokeWidth={13}
          strokeDasharray={`${s.dash} ${circ-s.dash}`} strokeDashoffset={-s.off}
          style={{ transform:"rotate(-90deg)", transformOrigin:"50% 50%", opacity:.9 }} />
      ))}
      <text x={44} y={42} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill={T.text}>{total}</text>
      <text x={44} y={56} textAnchor="middle" dominantBaseline="central" fontSize={8} fill={T.textMut}>total</text>
    </svg>
  );
}

/* ── Ticket progress bar ───────────────────────────────────────────────────── */
function StepBar({ status }) {
  const T = useT();
  const idx = TICKET_STEPS.findIndex(s => s.key === status);
  return (
    <div style={{ display:"flex", alignItems:"center", marginTop:12, gap:0 }}>
      {TICKET_STEPS.map((s, i) => {
        const done   = i <  idx;
        const active = i === idx;
        const pct    = (idx / (TICKET_STEPS.length - 1)) * 100;
        return (
          <div key={s.key} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
            {i > 0 && <div style={{ position:"absolute", top:6, right:"50%", left:"-50%", height:1.5, background: i <= idx ? T.accent : T.border }} />}
            <div style={{ width:13, height:13, borderRadius:"50%", background: active ? T.accent : done ? T.accent : T.border, position:"relative", zIndex:1, boxShadow: active ? `0 0 0 3px ${T.accentSub}` : "none", transition:"all .2s" }}>
              {done && <svg style={{ position:"absolute", inset:0, margin:"auto" }} width={7} height={7} viewBox="0 0 8 8"><polyline points="1,4 3,6.5 7,1.5" stroke="#fff" strokeWidth={1.5} fill="none" strokeLinecap="round"/></svg>}
            </div>
            <div style={{ fontSize:8.5, color: active ? T.accent : done ? T.textSub : T.textMut, marginTop:4, textAlign:"center", fontWeight: active ? 600 : 400, maxWidth:52, lineHeight:1.3 }}>{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGES
═══════════════════════════════════════════════════════════════════════════ */

/* ── Dashboard ─────────────────────────────────────────────────────────────── */
function Dashboard({ nav }) {
  const T = useT();
  const { clientId } = useClient();
  const myEquip   = EQUIPMENT.filter(e => e.clientId === clientId);
  const myTickets = TICKETS.filter(t => t.clientId === clientId);
  const myCerts   = CERTS.filter(c => c.clientId === clientId);
  const kpis = [
    { label:"Equipos totales",           value:myEquip.length,                                    trend:"",     icon:"📦", color:T.accent,  bg:T.accentSub },
    { label:"Reparaciones activas",      value:myTickets.filter(t=>t.status!=="delivered").length, trend:"",     icon:"🔧", color:T.amber,   bg:T.amberBg  },
    { label:"Equipos críticos",          value:myEquip.filter(e=>e.status==="critical").length,    trend:"",     icon:"⚡", color:T.red,     bg:T.redBg    },
    { label:"Certs. por vencer/vencidas",value:myCerts.filter(c=>c.status!=="valid").length,       trend:"<60d", icon:"📋", color:T.blue,    bg:T.blueBg   },
    { label:"En tránsito",               value:myEquip.filter(e=>e.status==="in-transit").length,  trend:"",     icon:"🚚", color:T.purple,  bg:T.purpleBg },
  ];
  const opCount  = myEquip.filter(e=>e.status==="operational").length;
  const criCount = myEquip.filter(e=>e.status==="critical").length;
  const repCount = myEquip.filter(e=>e.status==="in-repair").length;
  const donutData = [
    { v: opCount||0,  c:T.green, label:"Operativos" },
    { v: criCount||0, c:T.red,   label:"Críticos" },
    { v: repCount||0, c:T.amber, label:"En reparación" },
  ].filter(d=>d.v>0);
  if(donutData.length===0) donutData.push({ v:1, c:T.border, label:"Sin equipos" });
  const myActivity = ACTIVITY;

  return (
    <div>
      <SectionHeader title="Dashboard" sub="Resumen operativo · Diciembre 2024" />

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20 }}>
        {kpis.map(k => (
          <Card key={k.label} hover style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:k.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{k.icon}</div>
              {k.trend && <span style={{ fontSize:10, fontWeight:600, color:k.color, background:k.bg, padding:"2px 7px", borderRadius:99 }}>{k.trend}</span>}
            </div>
            <div style={{ fontSize:28, fontWeight:700, color:T.text, lineHeight:1, letterSpacing:"-0.03em" }}>{k.value}</div>
            <div style={{ fontSize:11, color:T.textMut, marginTop:4 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts + Feed */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1.1fr", gap:14, marginBottom:14 }}>
        {/* Bar chart */}
        <Card style={{ padding:"20px 22px", gridColumn:"span 1" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:T.text }}>Actividad mensual</div>
              <div style={{ fontSize:11, color:T.textMut }}>Últimos 6 meses</div>
            </div>
            <div style={{ display:"flex", gap:12, fontSize:10, color:T.textMut }}>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:8, height:2, borderRadius:99, background:T.accent, display:"inline-block" }} />Reparaciones</span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:8, height:2, borderRadius:99, background:T.blue, display:"inline-block" }} />Certs.</span>
            </div>
          </div>
          <BarChart />
        </Card>

        {/* Donut */}
        <Card style={{ padding:"20px 22px" }}>
          <div style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:4 }}>Estado del parque</div>
          <div style={{ fontSize:11, color:T.textMut, marginBottom:14 }}>{myEquip.length} equipos gestionados</div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <Donut data={donutData} />
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {donutData.map(d => (
                <div key={d.label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11 }}>
                  <span style={{ width:8, height:8, borderRadius:2, background:d.c, flexShrink:0 }} />
                  <span style={{ color:T.textSub }}>{d.label}</span>
                  <span style={{ marginLeft:"auto", fontWeight:600, color:T.text, paddingLeft:8 }}>{d.v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick access */}
        <Card style={{ padding:"20px 22px" }}>
          <div style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:14 }}>Accesos rápidos</div>
          {[
            { label:"2 equipos críticos requieren atención", color:T.red,   page:"alerts",    cta:"Ver alertas" },
            { label:"BC-6800 Plus · certificación vencida",  color:T.amber, page:"certs",     cta:"Ver certs." },
            { label:"TK-2402 esperando repuesto urgente",    color:T.amber, page:"repairs",   cta:"Ver ticket" },
          ].map((a,i) => (
            <div key={i} onClick={() => nav(a.page)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, background:T.surface, border:`1px solid ${T.borderSub}`, marginBottom:7, cursor:"pointer", transition:"border .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor=T.border}
              onMouseLeave={e => e.currentTarget.style.borderColor=T.borderSub}>
              <span style={{ width:3, height:32, borderRadius:99, background:a.color, flexShrink:0 }} />
              <span style={{ flex:1, fontSize:11, color:T.textSub }}>{a.label}</span>
              <span style={{ fontSize:10, color:a.color, fontWeight:600, whiteSpace:"nowrap" }}>{a.cta} →</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Activity feed */}
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:14 }}>Actividad reciente</div>
        <div>
          {ACTIVITY.map((a, i) => {
            const dotC = { ticket:T.accent, alert:T.amber, transit:T.blue, done:T.green, cert:T.purple, critical:T.red };
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom: i < ACTIVITY.length-1 ? `1px solid ${T.borderSub}` : "none" }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:dotC[a.type]||T.textMut, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:12, color:T.text, fontWeight:500 }}>{a.event}</span>
                  <span style={{ fontSize:11, color:T.textMut, marginLeft:8 }}>{a.sub}</span>
                </div>
                <span style={{ fontSize:11, color:T.textMut, whiteSpace:"nowrap" }}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ── Inventory ─────────────────────────────────────────────────────────────── */
function Inventory() {
  const T = useT();
  const STATUS_CFG = mkStatus(T);
  const CERT_CFG = mkCertCfg(T);
  const { clientId } = useClient();
  const [search, setSearch] = useState("");
  const myEquip = EQUIPMENT.filter(e => e.clientId === clientId);
  const [filter, setFilter] = useState("all");
  const [hoverRow, setHoverRow] = useState(null);

  const filters = ["all","operational","critical","in-repair","in-transit"];
  const q = search.toLowerCase();
  const filtered = myEquip.filter(e =>
    (filter === "all" || e.status === filter) &&
    `${e.model}${e.hospital}${e.serial}${e.manufacturer}`.toLowerCase().includes(q)
  );

  return (
    <div>
      <SectionHeader title="Inventario de equipos" sub={`${filtered.length} equipos`}
        action={<Btn variant="primary">+ Agregar equipo</Btn>} />

      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:220 }}>
          <svg style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", opacity:.4 }} width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={2} strokeLinecap="round"><circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar modelo, hospital, serie..."
            style={{ width:"100%", padding:"8px 12px 8px 32px", background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, fontSize:12, color:T.text, outline:"none", boxSizing:"border-box" }} />
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:"6px 13px", borderRadius:8, border:`1px solid ${filter===f ? T.accent : T.border}`, background: filter===f ? T.accentSub : "transparent", color: filter===f ? T.accent : T.textSub, fontSize:11, fontWeight:500, cursor:"pointer", transition:"all .15s" }}>
              {f==="all" ? "Todos" : STATUS_CFG[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      <Card style={{ overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["ID","Fabricante / Modelo","Serie","Servicio","Ubicación","Estado","Certificación","Último servicio"].map(h => (
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10, fontWeight:600, color:T.textMut, textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((eq, i) => (
              <tr key={eq.id}
                onMouseEnter={() => setHoverRow(i)} onMouseLeave={() => setHoverRow(null)}
                style={{ borderBottom:`1px solid ${T.borderSub}`, background: hoverRow===i ? T.surface : "transparent", transition:"background .1s", cursor:"pointer" }}>
                <td style={{ padding:"13px 16px", fontFamily:"monospace", fontSize:11, color:T.accent, fontWeight:600 }}>{eq.id}</td>
                <td style={{ padding:"13px 16px" }}>
                  <div style={{ fontWeight:500, color:T.text, marginBottom:1 }}>{eq.model}</div>
                  <div style={{ fontSize:10, color:T.textMut }}>{eq.manufacturer} · {eq.type}</div>
                </td>
                <td style={{ padding:"13px 16px", fontFamily:"monospace", fontSize:10, color:T.textSub }}>{eq.serial}</td>
                <td style={{ padding:"13px 16px", color:T.textSub }}>{eq.service}</td>
                <td style={{ padding:"13px 16px", color:T.textMut, fontSize:11 }}>{eq.location}</td>
                <td style={{ padding:"13px 16px" }}><Pill cfg={STATUS_CFG[eq.status]} dot /></td>
                <td style={{ padding:"13px 16px" }}><Pill cfg={CERT_CFG[eq.cert]} /></td>
                <td style={{ padding:"13px 16px", color:T.textMut, fontSize:11 }}>{eq.lastService}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:48, textAlign:"center", color:T.textMut, fontSize:13 }}>Sin resultados para la búsqueda actual</div>
        )}
      </Card>
    </div>
  );
}

/* ── Repairs ───────────────────────────────────────────────────────────────── */
function Repairs() {
  const T = useT();
  const TK_CFG = mkTkCfg(T);
  const PRI_CFG = mkPriCfg(T);
  const { clientId } = useClient();
  const myTickets = TICKETS.filter(t => t.clientId === clientId);
  const [selected, setSelected] = useState(null);
  const selId = selected || (myTickets[0]?.id ?? null);
  const tk = myTickets.find(t => t.id === selId);
  const active   = myTickets.filter(t => t.status !== "delivered");
  const finished = myTickets.filter(t => t.status === "delivered");

  if(myTickets.length === 0) return (
    <div>
      <SectionHeader title="Taller &amp; Reparaciones" sub="Sin tickets para este cliente" />
      <div style={{ textAlign:"center", padding:60, color:T.textMut }}>📭 Sin tickets activos</div>
    </div>
  );

  return (
    <div>
      <SectionHeader title="Taller & Reparaciones" sub={`${active.length} tickets activos · ${finished.length} entregados`}
        action={<Btn variant="primary">+ Nuevo ticket</Btn>} />

      <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:14 }}>
        {/* Left: ticket list */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {myTickets.map(t => {
            const pri = PRI_CFG[t.priority] || {};
            const isSel = t.id === selId;
            return (
              <div key={t.id} onClick={() => setSelected(t.id)}
                style={{ background: isSel ? T.card : T.surface, border:`1px solid ${isSel ? T.accent : T.borderSub}`, borderRadius:10, padding:"14px 16px", cursor:"pointer", transition:"all .15s", position:"relative", overflow:"hidden" }}
                onMouseEnter={e => { if(!isSel) e.currentTarget.style.borderColor=T.border; }}
                onMouseLeave={e => { if(!isSel) e.currentTarget.style.borderColor=T.borderSub; }}>
                {/* priority stripe */}
                <div style={{ position:"absolute", top:0, left:0, width:3, bottom:0, background:pri.color, borderRadius:"10px 0 0 10px" }} />
                <div style={{ paddingLeft:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, color: isSel ? T.accent : T.textMut, fontWeight:600 }}>{t.id}</span>
                    <Pill cfg={TK_CFG[t.status] || { label:t.status, bg:T.border, text:T.textSub }} />
                  </div>
                  <div style={{ fontWeight:500, fontSize:13, color: isSel ? T.text : T.textSub, marginBottom:2 }}>{t.model}</div>
                  <div style={{ fontSize:11, color:T.textMut }}>{t.hospital}</div>
                  <StepBar status={t.status} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: ticket detail */}
        {tk && (
          <Card style={{ padding:"24px 26px", alignSelf:"start" }}>
            {/* header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:18, borderBottom:`1px solid ${T.borderSub}` }}>
              <div>
                <div style={{ fontFamily:"monospace", fontSize:12, color:T.accent, fontWeight:600, marginBottom:5 }}>{tk.id}</div>
                <div style={{ fontSize:20, fontWeight:600, color:T.text, letterSpacing:"-0.02em" }}>{tk.model}</div>
                <div style={{ fontSize:12, color:T.textMut, marginTop:3 }}>{tk.hospital} · Abierto {tk.created}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:7 }}>
                <Pill cfg={TK_CFG[tk.status] || { label:tk.status, bg:T.border, text:T.textSub }} />
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Avatar initials={tk.avatar} color={T.accent} />
                  <span style={{ fontSize:11, color:T.textSub }}>{tk.technician}</span>
                </div>
              </div>
            </div>

            <StepBar status={tk.status} />

            <div style={{ marginTop:22, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ background:T.surface, borderRadius:8, padding:"12px 14px", border:`1px solid ${T.borderSub}` }}>
                <div style={{ fontSize:10, color:T.textMut, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Notas técnicas</div>
                <div style={{ fontSize:12, color:T.textSub, lineHeight:1.7 }}>{tk.notes}</div>
              </div>
              <div style={{ background:T.surface, borderRadius:8, padding:"12px 14px", border:`1px solid ${T.borderSub}` }}>
                <div style={{ fontSize:10, color:T.textMut, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Repuestos</div>
                <div style={{ fontSize:12, color:tk.parts==="—" ? T.textMut : T.textSub }}>{tk.parts}</div>
                <div style={{ fontSize:10, color:T.textMut, marginTop:10, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>Prioridad</div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:PRI_CFG[tk.priority]?.color }} />
                  <span style={{ fontSize:12, color:PRI_CFG[tk.priority]?.color }}>{PRI_CFG[tk.priority]?.label}</span>
                </div>
              </div>
            </div>

            {/* Attachments drop zone */}
            <div style={{ marginTop:10, border:`1px dashed ${T.border}`, borderRadius:8, padding:"14px", display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:T.textMut, fontSize:12, cursor:"pointer", transition:"background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background=T.surface}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1={12} y1={3} x2={12} y2={15}/></svg>
              Adjuntar archivo, foto o informe
            </div>

            <div style={{ marginTop:14, display:"flex", gap:8 }}>
              <Btn variant="ghost" style={{ flex:1 }}>Actualizar estado</Btn>
              <Btn variant="primary" style={{ flex:1 }}>Generar informe PDF</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ── Certifications ─────────────────────────────────────────────────────────── */
function Certs() {
  const T = useT();
  const { clientId } = useClient();
  const clientCerts = CERTS.filter(c => c.clientId === clientId);
  const [mtrStatus, setMtrStatus] = useState(() => {
    const s = {};
    CERTS.forEach(c => { s[c.id] = c.mtrLoaded; });
    return s;
  });
  const [tab,       setTab]       = useState("expiring");
  const [uploading, setUploading] = useState(null);
  const [generating,setGenerating]= useState(null);

  const handleUploadMTR = id => {
    setUploading(id);
    setTimeout(() => { setMtrStatus(prev => ({ ...prev, [id]: true })); setUploading(null); }, 1500);
  };

  const certsForTab = clientCerts.filter(c => c.status === tab);
  const pending = [...certsForTab.filter(c => !mtrStatus[c.id])].sort((a,b) => a.expiry.localeCompare(b.expiry));
  const done    = certsForTab.filter(c =>  mtrStatus[c.id]);

  const allNonValid      = clientCerts.filter(c => c.status !== "valid");
  const totalPendingReal = allNonValid.filter(c => !mtrStatus[c.id]).length;
  const totalDone        = allNonValid.filter(c =>  mtrStatus[c.id]).length;
  const expiringPending  = clientCerts.filter(c => c.status === "expiring" && !mtrStatus[c.id]).length;
  const expiredPending   = clientCerts.filter(c => c.status === "expired"  && !mtrStatus[c.id]).length;
  const showDoneCol      = tab === "expiring";
  const HEADERS = ["SI/NO", "Modelo / N° Serie", "Sanatorio", "Tipo", "Vencimiento", ...(showDoneCol ? ["Realizado el"] : []), "Acción"];

  const renderRow = (c, isDone) => {
    const isExpiredTab = tab === "expired";
    const rowBg = isDone ? T.greenBg : (isExpiredTab ? T.redBg : T.amberBg);
    return (
      <tr key={c.id} style={{ borderBottom:`1px solid ${T.borderSub}`, background:rowBg, transition:"background .4s" }}>
        <td style={{ padding:"10px 14px" }}>
          <div style={{ width:30, height:20, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:10, fontWeight:800, background: isDone ? T.greenBg : T.redBg,
            color: isDone ? T.greenTxt : T.redTxt, border:`1px solid ${isDone ? T.green+"33" : T.red+"33"}` }}>
            {isDone ? "SI" : "NO"}
          </div>
        </td>
        <td style={{ padding:"10px 14px" }}>
          <div style={{ fontWeight:500, color:T.text, fontSize:12 }}>{c.model}</div>
          <div style={{ fontSize:10, color:T.textMut }}>{c.serial}</div>
        </td>
        <td style={{ padding:"10px 14px", color:T.textSub, fontSize:11 }}>{c.hospital}</td>
        <td style={{ padding:"10px 14px", color:T.textSub, fontSize:11 }}>{c.type}</td>
        <td style={{ padding:"10px 14px", fontSize:11, fontWeight: isDone?400:600,
          color: isDone ? T.textMut : (isExpiredTab ? T.redTxt : T.amberTxt) }}>
          {c.expiry.split("-").reverse().join("/")}
        </td>
        {showDoneCol && (
          <td style={{ padding:"10px 14px", fontSize:11 }}>
            {isDone
              ? <span style={{ color:T.greenTxt }}>✓ se realizó el {c.doneDate || "—"}</span>
              : <span style={{ color:T.textMut }}>—</span>}
          </td>
        )}
        <td style={{ padding:"10px 14px" }}>
          {!isDone ? (
            <button onClick={() => handleUploadMTR(c.id)} style={{
              padding:"4px 11px", background: uploading===c.id ? T.accentSub : T.surface,
              border:`1px solid ${uploading===c.id ? T.accent : T.border}`,
              borderRadius:6, fontSize:10, cursor:"pointer",
              color: uploading===c.id ? T.accent : T.textSub,
              transition:"all .15s", whiteSpace:"nowrap" }}>
              {uploading===c.id ? "⟳ Cargando..." : "↑ Cargar MTR"}
            </button>
          ) : (
            <button onClick={() => { setGenerating(c.id); setTimeout(()=>setGenerating(null),2000); }} style={{
              padding:"4px 11px", background: generating===c.id ? T.greenBg : T.surface,
              border:`1px solid ${generating===c.id ? T.green : T.border}`,
              borderRadius:6, fontSize:10, cursor:"pointer",
              color: generating===c.id ? T.greenTxt : T.textMut,
              transition:"all .15s" }}>
              {generating===c.id ? "⟳ Generando..." : "↓ PDF"}
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div>
      <SectionHeader
        title="Certificaciones — Trazabilidad SGEM"
        sub={`${totalPendingReal} pendientes reales · ${totalDone} con MTR cargado este ciclo`}
        action={<Btn variant="primary">+ Nueva certificación</Btn>}
      />

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
        {[
          { count:totalPendingReal, label:"Pendientes reales",      color:T.red,   sub:"Sin MTR cargado" },
          { count:totalDone,        label:"Realizados este ciclo",  color:T.green, sub:"MTR registrado" },
          { count:expiredPending,   label:"No vigentes pend.",      color:T.red,   sub:"Vencidas sin renovar" },
          { count:expiringPending,  label:"Por vencer pend.",       color:T.amber, sub:"Próximas sin MTR" },
        ].map(s => (
          <Card key={s.label} style={{ padding:"16px 18px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ fontSize:30, fontWeight:700, color:s.color, letterSpacing:"-0.04em", lineHeight:1 }}>{s.count}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{s.label}</div>
              <div style={{ fontSize:10, color:T.textMut, marginTop:2 }}>{s.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Trazabilidad problem callout */}
      <div style={{ background:T.amberBg, border:`1px solid ${T.amber}55`, borderRadius:10,
        padding:"12px 16px", marginBottom:18, display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:T.amberTxt, marginBottom:3 }}>
            Problema de trazabilidad: {totalDone} equipos ya certificados aún figuran en las listas de pendientes
          </div>
          <div style={{ fontSize:11, color:T.textSub, lineHeight:1.6 }}>
            Tienen MTR cargado (columna <span style={{color:T.greenTxt,fontWeight:700}}>"SI"</span>) pero el sistema externo no los sincroniza.
            Esto provoca <strong style={{color:T.amberTxt}}>certificaciones repetidas, envíos innecesarios de personal y errores de facturación</strong>.
            Cargar el MTR aquí actualiza el estado en tiempo real.
          </div>
        </div>
      </div>

      {/* Tabs + export bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", gap:0, background:T.surface, borderRadius:10, padding:4, border:`1px solid ${T.border}` }}>
          {[
            { key:"expiring", label:"Por Vencer",  pend:expiringPending },
            { key:"expired",  label:"No Vigentes", pend:expiredPending  },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding:"6px 18px", borderRadius:8, border:"none", cursor:"pointer",
              background: tab===t.key ? T.card : "transparent",
              color: tab===t.key ? T.text : T.textMut,
              fontSize:12, fontWeight: tab===t.key ? 600 : 400,
              transition:"all .15s", display:"flex", alignItems:"center", gap:7,
              boxShadow: tab===t.key ? "0 1px 3px #0005" : "none" }}>
              {t.label}
              <span style={{ fontSize:10, padding:"1px 7px", borderRadius:99, fontWeight:700,
                background: t.pend>0 ? T.redBg : T.greenBg,
                color: t.pend>0 ? T.redTxt : T.greenTxt }}>
                {t.pend > 0 ? `${t.pend} pend.` : "✓ ok"}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn>↓ Exportar pendientes</Btn>
          <Btn>🖨 Imprimir planilla</Btn>
        </div>
      </div>

      {/* Single table with section dividers */}
      <Card style={{ overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {HEADERS.map(h => (
                <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:10, fontWeight:600,
                  color:T.textMut, textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pending.length > 0 && (
              <>
                <tr>
                  <td colSpan={HEADERS.length} style={{ padding:"7px 14px",
                    background: tab==="expired" ? T.redBg : T.amberBg,
                    fontSize:10, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                    color: tab==="expired" ? T.redTxt : T.amberTxt }}>
                    🔴 Pendientes reales — {pending.length} sin MTR · Requieren certificación
                  </td>
                </tr>
                {pending.map(c => renderRow(c, false))}
              </>
            )}
            {done.length > 0 && (
              <>
                <tr>
                  <td colSpan={HEADERS.length} style={{ padding:"7px 14px", background:T.greenBg,
                    fontSize:10, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
                    color:T.greenTxt }}>
                    ✅ Ya realizados — {done.length} con MTR cargado · Pendientes de sincronizar en sistema
                  </td>
                </tr>
                {done.map(c => renderRow(c, true))}
              </>
            )}
            {pending.length === 0 && done.length === 0 && (
              <tr><td colSpan={HEADERS.length} style={{ padding:"40px", textAlign:"center", color:T.textMut }}>Sin registros</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {pending.length === 0 && done.length > 0 && (
        <div style={{ textAlign:"center", padding:"14px", marginTop:6 }}>
          <span style={{ color:T.greenTxt, fontSize:12, fontWeight:600 }}>✅ Sin pendientes reales en esta lista — todos los equipos tienen MTR cargado</span>
        </div>
      )}
    </div>
  );
}

/* ── Alerts ─────────────────────────────────────────────────────────────────── */
function Alerts({ nav }) {
  const T = useT();
  const STATUS_CFG = mkStatus(T);
  const { clientId } = useClient();
  const critical = EQUIPMENT.filter(e => e.clientId === clientId && e.status === "critical");
  const notifs = [
    { pri:"critical", title:"cobas e 801 — Error E-4402 activo",          body:"Hospital Italiano · Lab Central · TK-2403 en diagnóstico",    time:"Hace 2 h",  page:"repairs" },
    { pri:"critical", title:"Vivid E9 — Transductor deteriorado",          body:"Sanatorio Güemes · Cardiología · TK-2402 esperando repuesto", time:"Hace 5 h",  page:"repairs" },
    { pri:"high",     title:"Certificación por vencer: Vivid E9",          body:"Seguridad Eléctrica · Bureau Veritas · vence 01/03/2025",      time:"Ayer",      page:"certs"   },
    { pri:"high",     title:"Certificación por vencer: cobas e 801",       body:"Trazabilidad Metrológica · INTI · vence 14/02/2025",          time:"Ayer",      page:"certs"   },
    { pri:"medium",   title:"BC-6800 Plus — Certificación VENCIDA",       body:"Clínica Santa Isabel · renovación requerida",                 time:"Hace 3 d",  page:"certs"   },
    { pri:"low",      title:"Sigma Spectrum 8.0 en tránsito",              body:"Sanatorio Güemes · estimado 2 días",                          time:"Hace 6 h",  page:"inventory"},
  ];

  const priStyle = {
    critical: { label:"CRÍTICA", dot:T.red,    bg:T.redBg,    border:"#7f1d1d" },
    high:     { label:"ALTA",    dot:T.amber,  bg:T.amberBg,  border:"#713f12" },
    medium:   { label:"MEDIA",   dot:T.blue,   bg:T.blueBg,   border:"#0c3052" },
    low:      { label:"BAJA",    dot:T.textMut,bg:T.surface,  border:T.border  },
  };

  return (
    <div>
      <SectionHeader title="Alertas" sub={`${notifs.filter(n=>n.pri==="critical").length} críticas · ${notifs.filter(n=>n.pri==="high").length} altas`} />

      {/* Critical equipment */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:12, fontWeight:600, color:T.textMut, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Equipos críticos</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {critical.map(eq => (
            <div key={eq.id} style={{ background:T.redBg, border:`1px solid #7f1d1d`, borderRadius:12, padding:"18px 20px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:T.red }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:15, color:T.text }}>{eq.model}</div>
                  <div style={{ fontSize:11, color:T.textMut, marginTop:2 }}>{eq.manufacturer} · {eq.serial}</div>
                </div>
                <Pill cfg={STATUS_CFG.critical} dot />
              </div>
              <div style={{ display:"flex", gap:14, fontSize:11, color:T.textSub, marginBottom:14 }}>
                <span>🏥 {eq.hospital}</span>
                <span>📍 {eq.location}</span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn variant="danger">Ticket urgente</Btn>
                <Btn variant="ghost">Ver historial</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification list */}
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:T.textMut, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Centro de notificaciones</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {notifs.map((n,i) => {
            const s = priStyle[n.pri];
            return (
              <div key={i} onClick={() => nav(n.page)}
                style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:10, padding:"13px 16px", display:"flex", gap:12, alignItems:"center", cursor:"pointer", transition:"opacity .15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity=".85"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:s.dot, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:T.text }}>{n.title}</div>
                  <div style={{ fontSize:11, color:T.textMut, marginTop:2 }}>{n.body}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                  <span style={{ fontSize:10, color:T.textMut }}>{n.time}</span>
                  <span style={{ fontSize:9, fontWeight:700, color:s.dot, letterSpacing:"0.08em" }}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── History ─────────────────────────────────────────────────────────────────── */
function History() {
  const T = useT();
  const STATUS_CFG = mkStatus(T);
  const CERT_CFG = mkCertCfg(T);
  const { clientId } = useClient();
  const myEquip = EQUIPMENT.filter(e => e.clientId === clientId);
  const [eqId, setEqId] = useState(() => myEquip[0]?.id ?? "EQ-003");
  const eq    = EQUIPMENT.find(e => e.id === eqId);
  const items = HISTORY[eqId] || [];

  const typeCfg = {
    ticket:  { icon:<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, label:"Ticket",          c:T.accent, bg:T.accentSub },
    cert:    { icon:<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, label:"Certificación",  c:T.blue,   bg:T.blueBg  },
    service: { icon:<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={3}/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>, label:"Mantenimiento",  c:T.green,  bg:T.greenBg },
    failure: { icon:<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1={12} y1={9} x2={12} y2={13}/><line x1={12} y1={17} x2="12.01" y2={17}/></svg>, label:"Falla",           c:T.red,    bg:T.redBg   },
  };

  return (
    <div>
      <SectionHeader title="Historial técnico" sub="Línea de tiempo completa por equipo" />

      {/* Equipment picker */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:22 }}>
        {myEquip.map(e => (
          <button key={e.id} onClick={() => setEqId(e.id)}
            style={{ padding:"5px 12px", borderRadius:7, border:`1px solid ${eqId===e.id ? T.accent : T.border}`, background: eqId===e.id ? T.accentSub : "transparent", color: eqId===e.id ? T.accent : T.textMut, fontSize:11, fontWeight: eqId===e.id ? 600 : 400, cursor:"pointer", transition:"all .15s" }}>
            {e.id}
          </button>
        ))}
      </div>

      {/* Equipment card */}
      {eq && (
        <Card style={{ padding:"20px 22px", marginBottom:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontFamily:"monospace", fontSize:11, color:T.accent, marginBottom:4 }}>{eq.id} · {eq.serial}</div>
              <div style={{ fontSize:19, fontWeight:600, color:T.text, letterSpacing:"-0.02em" }}>{eq.model}</div>
              <div style={{ fontSize:12, color:T.textMut, marginTop:2 }}>{eq.manufacturer} · {eq.type}</div>
            </div>
            <div style={{ display:"flex", gap:7 }}>
              <Pill cfg={STATUS_CFG[eq.status]} dot />
              <Pill cfg={CERT_CFG[eq.cert]} />
            </div>
          </div>
          <div style={{ marginTop:16, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {[["Hospital",eq.hospital],["Ubicación",eq.location],["Último servicio",eq.lastService],["Próx. certificación",eq.nextCert]].map(([l,v]) => (
              <div key={l} style={{ background:T.surface, borderRadius:8, padding:"9px 12px", border:`1px solid ${T.borderSub}` }}>
                <div style={{ fontSize:9.5, color:T.textMut, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:12, color:T.textSub, fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      {items.length > 0 ? (
        <div style={{ position:"relative", paddingLeft:28 }}>
          <div style={{ position:"absolute", left:10, top:0, bottom:0, width:1.5, background:T.border }} />
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {items.map((item,i) => {
              const c = typeCfg[item.type] || typeCfg.service;
              return (
                <div key={i} style={{ position:"relative" }}>
                  <div style={{ position:"absolute", left:-24, top:14, width:22, height:22, borderRadius:"50%", background:c.bg, border:`1.5px solid ${c.c}44`, display:"flex", alignItems:"center", justifyContent:"center", color:c.c, zIndex:1 }}>
                    {c.icon}
                  </div>
                  <Card hover style={{ padding:"14px 18px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:10, fontWeight:600, color:c.c, background:c.bg, padding:"2px 8px", borderRadius:99 }}>{c.label}</span>
                        <span style={{ fontSize:13, fontWeight:500, color:T.text }}>{item.title}</span>
                      </div>
                      <span style={{ fontSize:11, color:T.textMut }}>{item.date}</span>
                    </div>
                    <p style={{ fontSize:12, color:T.textSub, margin:0, lineHeight:1.65 }}>{item.desc}</p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:56, color:T.textMut, fontSize:13 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>📭</div>
          Sin historial para este equipo
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
const NAV = [
  { id:"dashboard", label:"Dashboard",          shortcut:"D" },
  { id:"inventory", label:"Inventario",          shortcut:"I" },
  { id:"repairs",   label:"Taller",              shortcut:"T" },
  { id:"certs",     label:"Certificaciones",     shortcut:"C" },
  { id:"alerts",    label:"Alertas",             shortcut:"A" },
  { id:"history",   label:"Historial",           shortcut:"H" },
];

const NAV_ICONS = {
  dashboard: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><rect x={3} y={3} width={7} height={7} rx={1}/><rect x={14} y={3} width={7} height={7} rx={1}/><rect x={3} y={14} width={7} height={7} rx={1}/><rect x={14} y={14} width={7} height={7} rx={1}/></svg>,
  inventory: <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1={12} y1={22.08} x2={12} y2={12}/></svg>,
  repairs:   <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  certs:     <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1={16} y1={13} x2={8} y2={13}/><line x1={16} y1={17} x2={8} y2={17}/></svg>,
  alerts:    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  history:   <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/></svg>,
};

function Sidebar({ page, setPage, hoverNav, setHoverNav, dark, onToggle }) {
  const T = useT();
  return (
    <div style={{ width:216, background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>

      {/* Logo */}
      <div style={{ padding:"18px 18px 14px", borderBottom:`1px solid ${T.borderSub}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:T.accentSub, border:`1px solid ${T.accent}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={2} strokeLinecap="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.text, letterSpacing:"-0.02em" }}>BioEquip</div>
            <div style={{ fontSize:9.5, color:T.textMut, letterSpacing:"0.02em" }}>Platform v2.4</div>
          </div>
        </div>
      </div>

      {/* Search shortcut */}
      <div style={{ padding:"10px 12px 6px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", background:T.bg, borderRadius:7, border:`1px solid ${T.borderSub}`, cursor:"text" }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={T.textMut} strokeWidth={2} strokeLinecap="round"><circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/></svg>
          <span style={{ fontSize:11, color:T.textMut, flex:1 }}>Buscar...</span>
          <span style={{ fontSize:9.5, color:T.textMut, background:T.border, padding:"1px 5px", borderRadius:4 }}>⌘K</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding:"6px 10px", flex:1 }}>
        <div style={{ fontSize:9.5, color:T.textMut, textTransform:"uppercase", letterSpacing:"0.1em", padding:"8px 6px 6px", fontWeight:600 }}>Módulos</div>
        {NAV.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id}
              onClick={() => setPage(item.id)}
              onMouseEnter={() => setHoverNav(item.id)}
              onMouseLeave={() => setHoverNav(null)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"7px 10px", borderRadius:7, border:"none", background: active ? T.accentSub : hoverNav===item.id ? T.bg : "transparent", color: active ? T.accent : hoverNav===item.id ? T.textSub : T.textMut, fontSize:12.5, fontWeight: active ? 600 : 400, cursor:"pointer", marginBottom:1, textAlign:"left", transition:"all .1s" }}>
              <span style={{ color:"inherit", display:"flex", flexShrink:0 }}>{NAV_ICONS[item.id]}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.id === "alerts" && (
                <span style={{ fontSize:9.5, fontWeight:700, background:T.red, color:"#fff", borderRadius:99, padding:"1px 6px", minWidth:16, textAlign:"center" }}>3</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div style={{ padding:"8px 14px", borderTop:`1px solid ${T.borderSub}` }}>
        <button onClick={onToggle} style={{
          width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"7px 10px", borderRadius:8, border:`1px solid ${T.border}`,
          background:"transparent", color:T.textMut, cursor:"pointer", fontSize:11,
          transition:"all .15s" }}>
          <span style={{ display:"flex", alignItems:"center", gap:7 }}>
            <span>{dark ? "🌙" : "☀️"}</span>
            <span>{dark ? "Modo oscuro" : "Modo claro"}</span>
          </span>
          <div style={{ width:32, height:18, borderRadius:99, position:"relative",
            background: dark ? T.accent : T.border, transition:"background .2s",
            flexShrink:0 }}>
            <div style={{ position:"absolute", top:2, left: dark ? 14 : 2, width:14, height:14,
              borderRadius:"50%", background:"#fff", transition:"left .2s",
              boxShadow:"0 1px 2px #0004" }} />
          </div>
        </button>
      </div>

      {/* User */}
      <div style={{ padding:"12px 14px", borderTop:`1px solid ${T.borderSub}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 8px", borderRadius:8, cursor:"pointer", transition:"background .1s" }}
          onMouseEnter={e => e.currentTarget.style.background=T.bg}
          onMouseLeave={e => e.currentTarget.style.background="transparent"}>
          <Avatar initials="DF" color={T.accent} />
          <div style={{ flex:1, overflow:"hidden" }}>
            <div style={{ fontSize:12, fontWeight:500, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Diego Ferreyra</div>
            <div style={{ fontSize:10, color:T.textMut }}>Ing. Biomédico</div>
          </div>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={T.textMut} strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={1}/><circle cx={19} cy={12} r={1}/><circle cx={5} cy={12} r={1}/></svg>
        </div>
      </div>
    </div>
  );
}

function Topbar({ onChangeClient }) {
  const T = useT();
  const { clientId } = useClient();
  const client = CLIENTS.find(c => c.id === clientId);
  return (
    <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"0 28px", height:48, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, color:T.textMut }}>
        <span>Bioingeniería Clínica Argentina</span>
        {client && <>
          <span style={{ color:T.border }}>·</span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:client.color, flexShrink:0 }} />
            <span style={{ fontWeight:600, color:T.textSub }}>{client.name}</span>
          </span>
        </>}
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.textMut }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:T.green, boxShadow:`0 0 6px ${T.green}88` }} />
          Sistema operativo
        </div>
        <div style={{ width:1, height:16, background:T.border, margin:"0 4px" }} />
        <Btn variant="ghost" style={{ fontSize:11, padding:"5px 12px" }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={12} cy={12} r={3}/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
          Configuración
        </Btn>
        <Btn variant="primary" style={{ fontSize:11, padding:"5px 14px" }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/></svg>
          Nuevo ticket
        </Btn>
      </div>
    </div>
  );
}

function PageContainer({ page, pages, onChangeClient }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <Topbar onChangeClient={onChangeClient} />
      <div style={{ flex:1, overflow:"auto", padding:"28px 32px" }}>
        <div style={{ maxWidth:1100 }}>
          {pages[page]}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page,     setPage]     = useState("dashboard");
  const [hoverNav, setHoverNav] = useState(null);
  const [dark,     setDark]     = useState(true);
  const [clientId, setClientId] = useState(null);
  const theme = dark ? DARK : LIGHT;

  const handleSelectClient = id => { setClientId(id); setPage("dashboard"); };
  const handleChangeClient = ()  => setClientId(null);

  const PAGES = {
    dashboard: <Dashboard nav={setPage} />,
    inventory: <Inventory />,
    repairs:   <Repairs />,
    certs:     <Certs />,
    alerts:    <Alerts nav={setPage} />,
    history:   <History />,
  };

  return (
    <ThemeCtx.Provider value={theme}>
      <ClientCtx.Provider value={{ clientId }}>
        {!clientId ? (
          <ClientPicker onSelect={handleSelectClient} />
        ) : (
          <div style={{ display:"flex", height:"100vh", fontFamily:"-apple-system, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif", background:theme.bg, color:theme.text, fontSize:14, overflow:"hidden" }}>
            <Sidebar page={page} setPage={setPage} hoverNav={hoverNav} setHoverNav={setHoverNav} dark={dark} onToggle={() => setDark(d => !d)} onChangeClient={handleChangeClient} />
            <PageContainer page={page} pages={PAGES} onChangeClient={handleChangeClient} />
          </div>
        )}
      </ClientCtx.Provider>
    </ThemeCtx.Provider>
  );
}
