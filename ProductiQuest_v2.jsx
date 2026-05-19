// ProductiQuest v4 — braille Batman + braille Spider-Man logos, TaskRow hotfix
import { useState } from "react";

// ═══ GAME DATA ═══
const ATTRS = [
  {key:'physical',   name:'Physical',   color:'#22c55e'},
  {key:'social',     name:'Social',     color:'#3b82f6'},
  {key:'discipline', name:'Discipline', color:'#ef4444'},
  {key:'mental',     name:'Mental',     color:'#eab308'},
  {key:'intellect',  name:'Intellect',  color:'#f97316'},
  {key:'ambition',   name:'Ambition',   color:'#a855f7'},
];

const CAT_COLOR = cat => {
  const c=(cat||'').toUpperCase();
  if(/HEALTH|PHYSIC|FIT/.test(c)) return '#22c55e';
  if(/WORK|CAREER|DISC/.test(c))  return '#ef4444';
  if(/LEARN|STUDY|READ/.test(c))  return '#f97316';
  if(/SOCIAL|FRIEND/.test(c))     return '#3b82f6';
  if(/MENTAL|MIND|MED/.test(c))   return '#eab308';
  return '#a855f7';
};

const RANKS = [
  {min:0,   label:'IRON',     color:'#6b7280', sub:{batman:'Year One',          spiderman:'High School Peter'}},
  {min:10,  label:'BRONZE',   color:'#b45309', sub:{batman:'Classic Era',        spiderman:'Amazing Spider-Man'}},
  {min:25,  label:'SILVER',   color:'#94a3b8', sub:{batman:'The Dark Knight',    spiderman:'Black Suit Era'}},
  {min:50,  label:'GOLD',     color:'#f59e0b', sub:{batman:'No Man\'s Land',     spiderman:'Iron Spider'}},
  {min:75,  label:'PLATINUM', color:'#e2e8f0', sub:{batman:'Knightfall',         spiderman:'Superior Spider-Man'}},
  {min:100, label:'CHAMPION', color:'#fbbf24', sub:{batman:'Endgame',            spiderman:'Ultimate Superior'}},
];
const getRank = lv => [...RANKS].reverse().find(r=>lv>=r.min)||RANKS[0];

const BATMAN_WEAPONS = [
  {id:'bw1',name:'Batarang',       cost:50,   def:5,   color:'#6b7280',desc:'The iconic bat-shaped boomerang'},
  {id:'bw2',name:'Smoke Pellets',  cost:80,   def:8,   color:'#9ca3af',desc:'Tactical stealth smoke grenades'},
  {id:'bw3',name:'Batclaw',        cost:120,  def:12,  color:'#4b5563',desc:'Grappling hook traversal system'},
  {id:'bw4',name:'Explosive Gel',  cost:180,  def:18,  color:'#dc2626',desc:'Remotely detonated demolitions'},
  {id:'bw5',name:'Bat Bolos',      cost:250,  def:25,  color:'#78716c',desc:'Entanglement capture cables'},
  {id:'bw6',name:'Disruptor',      cost:350,  def:35,  color:'#3b82f6',desc:'Electronic jamming device'},
  {id:'bw7',name:'Sonic Batarang', cost:500,  def:50,  color:'#8b5cf6',desc:'Sonic crowd-control emitter'},
  {id:'bw8',name:'EMP Gun',        cost:750,  def:75,  color:'#06b6d4',desc:'Electromagnetic pulse weapon'},
  {id:'bw9',name:'Batmobile',      cost:3000, def:300, color:'#1d4ed8',desc:'The ultimate crime-fighting vehicle'},
];

const SPIDERMAN_WEAPONS = [
  {id:'sw1', name:'Web Shooters',      cost:50,   def:5,   color:'#ef4444',desc:'Standard web projectile system'},
  {id:'sw2', name:'Impact Webbing',    cost:80,   def:8,   color:'#dc2626',desc:'Concussive burst web grenades'},
  {id:'sw3', name:'Retractable Talons',cost:120,  def:12,  color:'#6b7280',desc:'Vibranium-alloy retractable claws'},
  {id:'sw4', name:'Arachnid Arms',     cost:200,  def:22,  color:'#7c3aed',desc:'Four mechanical Otto-tech arms'},
  {id:'sw5', name:'Nano Tracers',      cost:280,  def:30,  color:'#0891b2',desc:'Nano-scale tracking network'},
  {id:'sw6', name:'Wrist Gauntlet',    cost:380,  def:42,  color:'#b45309',desc:'Specialized advanced tech gauntlet'},
  {id:'sw7', name:'Octo-Bots',         cost:500,  def:55,  color:'#059669',desc:'Swarm of autonomous micro-robots'},
  {id:'sw8', name:'Web-Wing',          cost:700,  def:80,  color:'#2563eb',desc:'Retractable gliding wing membrane'},
  {id:'sw9', name:'Flamethrower',      cost:1000, def:110, color:'#d97706',desc:'Incendiary web compound thrower'},
  {id:'sw10',name:'Nerve Hacking Tech',cost:3000, def:300, color:'#7c3aed',desc:'Neural network interface — Supreme tech'},
];

const SHOP_CONSUMABLES = [
  {id:'f1',name:'Health Ration',cost:15, hp:10, xp:0,  color:'#22c55e',desc:'+10 HP'},
  {id:'f2',name:'Field Pizza',  cost:30, hp:25, xp:0,  color:'#f97316',desc:'+25 HP'},
  {id:'f3',name:'XP Serum',     cost:60, hp:0,  xp:50, color:'#a855f7',desc:'+50 XP'},
  {id:'f4',name:'Gold Elixir',  cost:80, hp:40, xp:20, color:'#f59e0b',desc:'+40 HP & +20 XP'},
];
const SHOP_COMPANIONS = [
  {id:'p1',name:'Dragon',  cost:100,isPet:true,color:'#ef4444',desc:'Dragon companion'},
  {id:'p2',name:'Wolf',    cost:75, isPet:true,color:'#6b7280',desc:'Loyal companion'},
  {id:'p3',name:'Phoenix', cost:200,isPet:true,color:'#f97316',desc:'Revival power'},
  {id:'p4',name:'Slime',   cost:40, isPet:true,color:'#22c55e',desc:'Scout unit'},
];

const PRESTIGE_ITEMS = [
  {id:'l1',name:'Excalibur',          cost:1000,def:300,        color:'#fbbf24',desc:'+300 DEF — Legendary Weapon'},
  {id:'l2',name:'Void Cloak',         cost:800, def:200,        color:'#6366f1',desc:'+200 DEF — Cosmic Artifact'},
  {id:'l3',name:'Celestial Mount',    cost:700, isPet:true,     color:'#22c55e',desc:'Mythical Companion'},
  {id:'l4',name:"Philosopher's Stone",cost:1500,maxHpBoost:100, color:'#3b82f6',desc:'+100 Max HP Permanent'},
  {id:'l5',name:'Crown of Eternity',  cost:500, isCrown:true,   color:'#f59e0b',desc:'Eternal Champion Mark'},
];

const BOSSES_INIT = [
  {id:'b1',name:'Procrastination Goblin',maxHp:100,hp:100,xp:200, gold:100,color:'#22c55e',desc:'Steals your time and energy'},
  {id:'b2',name:'Distraction Dragon',   maxHp:300,hp:300,xp:500, gold:250,color:'#f97316',desc:'Burns focus with endless noise'},
  {id:'b3',name:'Burnout Basilisk',     maxHp:600,hp:600,xp:1000,gold:500,color:'#ef4444',desc:'The legendary beast of exhaustion'},
];

const DIFF={
  easy:  {label:'Easy',  xp:10,gold:5,  dmg:5,  color:'#22c55e'},
  medium:{label:'Med',   xp:25,gold:15, dmg:15, color:'#f97316'},
  hard:  {label:'Hard',  xp:50,gold:30, dmg:30, color:'#ef4444'},
};

const THEMES = {
  batman:{
    id:'batman',name:'Gotham Terminal',city:'Gotham City',
    bg:'#080808',surface:'#111',card:'#171717',border:'#2a2a2a',
    accent:'#c8a000',accent2:'#4488aa',text:'#f0f0f0',textSub:'#666',muted:'#222',
    xpColor:'#c8a000',hpColor:'#cc3300',
    landmarks:[
      {name:'Arkham Asylum',   desc:'Where villains are never truly cured',   tint:'rgba(0,70,0,.05)'},
      {name:'Wayne Tower',     desc:'Bruce Wayne\'s corporate stronghold',     tint:'rgba(200,160,0,.04)'},
      {name:'Gotham Cathedral',desc:'Gothic spires piercing the eternal smog', tint:'rgba(40,40,80,.05)'},
      {name:'Crime Alley',     desc:'Origin point. Where the oath was sworn.',  tint:'rgba(70,0,0,.05)'},
      {name:'Ace Chemicals',   desc:'Birthplace of Gotham\'s worst nightmares', tint:'rgba(0,120,20,.04)'},
      {name:'Blackgate Prison',desc:'Maximum security at Gotham\'s edge',       tint:'rgba(20,10,10,.06)'},
      {name:'GCPD HQ',         desc:'Commissioner Gordon holds the line',        tint:'rgba(20,40,80,.05)'},
      {name:'Iceberg Lounge',  desc:'Cobblepot\'s criminal empire HQ',          tint:'rgba(0,40,100,.05)'},
    ],
    msgs:['Justice delivered.','Darkness retreats.','Gotham secured.','The Knight prevails.'],
    hackerBadge:{label:'GHOST PROTOCOL',  bg:'#1a0000',border:'#cc2200',color:'#ff4444'},
    champBadge: {label:'THE DARK KNIGHT', bg:'#1a1200',border:'#c8a000',color:'#d4b840'},
    vaultName:'Batcave Armory',
  },
  spiderman:{
    id:'spiderman',name:'NYC Broadcast',city:'New York City',
    bg:'#07050f',surface:'#0e0018',card:'#130020',border:'#2a0048',
    accent:'#ff2244',accent2:'#2255ee',text:'#f5e8f0',textSub:'#774455',muted:'#1a0018',
    xpColor:'#ff2244',hpColor:'#2255ee',
    landmarks:[
      {name:'Daily Bugle',      desc:'J.J. Jameson\'s propaganda machine',      tint:'rgba(200,180,80,.04)'},
      {name:'Oscorp Tower',     desc:'Where science crosses every ethical line', tint:'rgba(0,160,60,.04)'},
      {name:'Fisk Tower',       desc:'The Kingpin\'s empire of shadows',          tint:'rgba(100,40,0,.05)'},
      {name:'ESU Campus',       desc:'Peter Parker\'s alma mater',                tint:'rgba(0,60,160,.04)'},
      {name:'F.E.A.S.T Center', desc:'Aunt May\'s mission of community hope',     tint:'rgba(200,40,40,.04)'},
      {name:'The Raft',         desc:'Supervillain maximum-security prison',       tint:'rgba(0,30,80,.05)'},
      {name:'Avengers Tower',   desc:'Earth\'s Mightiest Heroes — Manhattan HQ',  tint:'rgba(80,80,200,.04)'},
      {name:'Midtown High',     desc:'Where the greatest hero\'s story began',    tint:'rgba(200,120,0,.04)'},
    ],
    msgs:['With great power.','Neighborhood secured.','Queens is proud.','Web-slinger!'],
    hackerBadge:{label:'GHOST PROTOCOL',     bg:'#1a0000',border:'#cc2200',color:'#ff4444'},
    champBadge: {label:'AMAZING SPIDER-MAN', bg:'#08001a',border:'#ff2244',color:'#ffaacc'},
    vaultName:'Spider-Lair',
  },
};

const ACHV_DEFS = [
  {id:'first',  name:'First Strike',  rarity:'common',   color:'#22c55e',check:s=>s.tasks.some(t=>t.done)},
  {id:'str3',   name:'Streak III',    rarity:'uncommon', color:'#f97316',check:s=>s.habits.some(h=>h.streak>=3)},
  {id:'str7',   name:'Iron Will',     rarity:'rare',     color:'#ef4444',check:s=>s.habits.some(h=>h.streak>=7)},
  {id:'boss1',  name:'First Blood',   rarity:'uncommon', color:'#ef4444',check:s=>s.bosses.some(b=>b.hp===0)},
  {id:'lv10',   name:'Rising Hero',   rarity:'uncommon', color:'#eab308',check:s=>s.char.level>=10},
  {id:'g1k',    name:'Wealthy Mind',  rarity:'rare',     color:'#f59e0b',check:s=>s.char.gold>=1000},
  {id:'vault',  name:'The Prestige',  rarity:'legendary',color:'#a855f7',check:s=>s.prestigeUnlocked},
  {id:'ghost',  name:'Ghost Protocol',rarity:'secret',   color:'#6366f1',check:s=>s.hackerTitle},
  {id:'agrph',  name:'Agraphon',      rarity:'secret',   color:'#fbbf24',check:s=>s.char.gold>=100000},
  {id:'champ',  name:'The Champion',  rarity:'legendary',color:'#fbbf24',check:s=>s.char.level>=100},
];

// ═══ STATIC COMPONENTS ═══

const GlobalStyles = () => (
  <style>{`
    @keyframes slideUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes popIn{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
    @keyframes pulseGlow{0%,100%{opacity:1}50%{opacity:.7}}
    .pq-slide{animation:slideUp .22s ease forwards}
    .pq-pop{animation:popIn .18s ease forwards}
    .pq-pulse{animation:pulseGlow 2.5s ease-in-out infinite}
    .pq-hover{transition:filter .15s,transform .15s}
    .pq-hover:hover{filter:brightness(1.12);transform:translateY(-1px)}
    .pq-btn:hover{filter:brightness(1.2)}
    .pq-btn:active{transform:scale(.97)}
  `}</style>
);

const FormRow = ({children}) => (
  <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>{children}</div>
);

const ProgressBar = ({val,max,color,h=6}) => (
  <div style={{background:'#ffffff12',borderRadius:3,height:h,overflow:'hidden',flex:1}}>
    <div style={{width:`${Math.min(100,Math.round(val/Math.max(max,1)*100))}%`,background:color,height:'100%',borderRadius:3,transition:'width .5s'}}/>
  </div>
);

// ── Braille art Batman logo (from user's design) ──
const BAT_GRID = [
  '⠤⣤⣤⣤⣤⣤⠀⠀⣄⣠⠀⠀⣠⣤⣤⣤⣤⠤',
  '⠀⠈⣿⣿⣿⣿⣷⣶⣿⣿⣶⣾⣿⣿⣿⣿⠁⠀',
  '⠀⠀⠈⠉⠉⠛⠻⢿⣿⣿⡿⠟⠛⠉⠉⠁⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠀⠙⠋⠀⠀⠀⠀⠀⠀⠀⠀',
];

const EmojiToken = ({ color='#c8a000', size=32 }) => {
  const CELL = 8;
  const COLS = 18;
  const ROWS = BAT_GRID.length;
  const naturalW = COLS * CELL;
  const naturalH = ROWS * CELL;
  const scale = size / naturalW;
  return (
    <div style={{
      position:'relative',
      width: size,
      height: naturalH * scale,
      display:'inline-block',
      flexShrink:0,
    }}>
      <div style={{
        position:'absolute',
        top:0, left:0,
        transform:`scale(${scale})`,
        transformOrigin:'top left',
        lineHeight:`${CELL}px`,
        fontSize: CELL * 0.9,
        fontFamily:'monospace',
        color: color,
        userSelect:'none',
        pointerEvents:'none',
        whiteSpace:'pre',
        filter:`drop-shadow(0 0 2px ${color}88)`,
      }}>
        {BAT_GRID.map((row, ri) => (
          <div key={ri}>{row}</div>
        ))}
      </div>
    </div>
  );
};

// ── Spider-Man braille art token ──
const SPIDER_GRID = [
  '⠀⠀⠀⡠⠀⡌⠀⠀⠀⠀⠀⠀⠀⠀⢡⠀⢄⠀⠀⠀',
  '⠀⠀⣰⠃⣸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⣇⠘⣆⠀⠀',
  '⠀⢀⡏⢠⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⢹⡀⠀',
  '⠀⣸⡇⠘⠷⢖⣒⡲⣤⣤⣤⣤⢖⣒⡲⠾⠃⢸⣇⠀',
  '⠀⠻⠷⠚⠋⣩⡭⢭⣿⣿⣿⣿⡭⢭⣍⠙⠓⠾⠟⠀',
  '⠀⠀⢀⣠⠞⢉⣴⠏⣽⣿⣿⣯⠹⣦⡍⠳⣄⡀⠀⠀',
  '⣤⡴⠋⠁⠀⢸⣿⠀⢸⣿⣿⡏⠀⣿⡇⠀⠈⠙⢶⣤',
  '⢹⡇⠀⠀⠀⢸⣿⠀⠈⣿⣿⠁⠀⣿⡇⠀⠀⠀⢸⡟',
  '⠸⡇⠀⠀⠀⠀⣿⠀⠀⠘⠃⠀⠀⣿⠁⠀⠀⠀⢸⡇',
  '⠀⢷⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⡾⠀',
  '⠀⠘⡄⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⢠⠃⠀',
  '⠀⠀⠐⠀⠀⠀⠈⠇⠀⠀⠀⠀⢸⠁⠀⠀⠀⠂⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠘⠄⠀⠀⠠⠃⠀⠀⠀⠀⠀⠀⠀',
];

const SpiderToken = ({color='#ff2244', size=32}) => {
  const CELL = 7;
  const COLS = 20;
  const ROWS = SPIDER_GRID.length;
  const naturalW = COLS * CELL;
  const naturalH = ROWS * CELL;
  const scale = size / naturalW;
  return (
    <div style={{
      position:'relative',
      width: size,
      height: naturalH * scale,
      display:'inline-block',
      flexShrink:0,
    }}>
      <div style={{
        position:'absolute',
        top:0, left:0,
        transform:`scale(${scale})`,
        transformOrigin:'top left',
        lineHeight:`${CELL}px`,
        fontSize: CELL * 0.95,
        fontFamily:'monospace',
        color: color,
        userSelect:'none',
        pointerEvents:'none',
        whiteSpace:'pre',
        filter:`drop-shadow(0 0 2px ${color}88)`,
      }}>
        {SPIDER_GRID.map((row, ri) => (
          <div key={ri}>{row}</div>
        ))}
      </div>
    </div>
  );
};

// TaskToken: emoji bat for batman, spider for spiderman
const TaskToken = ({themeId, color, size=28}) =>
  themeId==='batman'
    ? <EmojiToken color={color} size={size}/>
    : <SpiderToken color={color} size={size}/>;

// ── Batman rank icons now use the emoji grid, scaled small ──
const BatRankIcon = ({rankLabel, color, size=30}) => (
  <EmojiToken color={color} size={size}/>
);

// ── Spider-Man rank icons — reuse braille SpiderToken ──
const SpiderRankIcon = ({rankLabel, color, size=30}) => (
  <SpiderToken color={color} size={size}/>
);

// Hex radar chart
const HexRadar = ({data,T,size=270}) => {
  const cx=size/2, cy=size/2, R=size*.36;
  const angles=ATTRS.map((_,i)=>(i*60-90)*Math.PI/180);
  const pt=(a,r)=>({x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)});
  const dataPts=ATTRS.map((attr,i)=>{const v=(data[attr.key]||0)/100;return pt(angles[i],R*v);});
  const poly=dataPts.map(p=>`${p.x},${p.y}`).join(' ');
  const overall=Math.round(ATTRS.reduce((s,a)=>s+(data[a.key]||0),0)/ATTRS.length);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:'visible'}}>
      {[.2,.4,.6,.8,1].map(lv=>{
        const pts=angles.map(a=>{const p=pt(a,R*lv);return`${p.x},${p.y}`;}).join(' ');
        return <polygon key={lv} points={pts} fill="none" stroke={lv===1?'#ffffff22':'#ffffff0f'} strokeWidth={lv===1?1.5:.7}/>;
      })}
      {ATTRS.map((attr,i)=>{const e=pt(angles[i],R);return <line key={attr.key} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="#ffffff0d" strokeWidth={.7}/>;} )}
      <polygon points={poly} fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.85)" strokeWidth={2} style={{filter:'drop-shadow(0 0 10px rgba(255,255,255,.4))',transition:'all .5s'}}/>
      {ATTRS.map((attr,i)=>{
        const lp=pt(angles[i],R+20);
        return <text key={attr.key} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill={attr.color} fontSize={11} fontFamily="system-ui" fontWeight={700}>{attr.name}</text>;
      })}
      <text x={cx} y={cy-12} textAnchor="middle" fill="white" fontSize={34} fontWeight={900} fontFamily="system-ui" style={{filter:'drop-shadow(0 0 12px rgba(255,255,255,.5))'}}>{overall}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="#888" fontSize={9} fontFamily="monospace" letterSpacing={2}>OVR RATING</text>
    </svg>
  );
};

const AchievementCard = ({def,unlocked}) => {
  const RC={common:'#22c55e',uncommon:'#3b82f6',rare:'#a855f7',legendary:'#f59e0b',secret:'#ef4444'};
  const c=unlocked?(RC[def.rarity]||def.color):'#2a2a2a';
  return (
    <div style={{textAlign:'center',opacity:unlocked?1:.3}}>
      <svg viewBox="0 0 56 66" width={52} height={61} style={{display:'block',margin:'0 auto 5px'}}>
        <path d="M28,2 L52,12 L52,38 Q52,56 28,64 Q4,56 4,38 L4,12 Z" fill={c+'1a'} stroke={c} strokeWidth={unlocked?2:1} style={unlocked&&def.rarity==='legendary'?{filter:`drop-shadow(0 0 6px ${c})`}:{}}/>
        {def.rarity==='legendary'&&[20,28,36].map(x=><text key={x} x={x} y={17} textAnchor="middle" fontSize={7} fill={c}>★</text>)}
        {def.rarity==='rare'&&[24,32].map(x=><text key={x} x={x} y={17} textAnchor="middle" fontSize={7} fill={c}>★</text>)}
        {unlocked?<text x={28} y={42} textAnchor="middle" fontSize={18} fill={c}>✓</text>:<text x={28} y={42} textAnchor="middle" fontSize={16} fill="#333">?</text>}
      </svg>
      <div style={{fontSize:8,color:unlocked?c:'#333',fontWeight:700,letterSpacing:'.5px',lineHeight:1.3}}>{def.name}</div>
      {unlocked&&<div style={{fontSize:7,color:'#555',marginTop:2,textTransform:'uppercase'}}>{def.rarity}</div>}
    </div>
  );
};

// ── TaskRow must live OUTSIDE the main component to prevent remount bug ──
// If defined inside, every state change creates a new component type → React unmounts it → logos reset
const TaskRow = ({ t, T, themeId, editingTask, editForm, setEditForm, setEditingTask, saveTask, completeTask, setTasks, startEdit, inp, sel, btnP, btnG, card }) => {
  const color = CAT_COLOR(t.cat);
  if (editingTask === t.id) return (
    <div className="pq-slide" style={card({borderColor:T.accent,marginBottom:10})}>
      <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:10}}>Edit Task</div>
      <input value={editForm.title} onChange={e=>{const v=e.target.value;setEditForm(f=>({...f,title:v}));}} placeholder="Task title" style={{...inp,marginBottom:10}}/>
      <FormRow>
        <select value={editForm.diff} onChange={e=>setEditForm(f=>({...f,diff:e.target.value}))} style={sel}>
          <option value="easy">Easy (+10 XP)</option><option value="medium">Medium (+25 XP)</option><option value="hard">Hard (+50 XP)</option>
        </select>
        <input value={editForm.cat} onChange={e=>{const v=e.target.value;setEditForm(f=>({...f,cat:v}));}} onFocus={e=>e.target.select()} placeholder="Category" style={{...sel,flex:1,minWidth:80}}/>
      </FormRow>
      <div style={{display:'flex',gap:8}}><button onClick={saveTask} className="pq-btn" style={btnP}>Save</button><button onClick={()=>setEditingTask(null)} style={btnG}>Cancel</button></div>
    </div>
  );
  return (
    <div className="pq-hover" style={{...card({marginBottom:10,display:'flex',alignItems:'center',gap:14,opacity:t.done?.45:1,borderColor:color+'44',boxShadow:`inset 3px 0 0 ${color}`,paddingLeft:20})}}>
      <TaskToken themeId={themeId} color={t.done?'#333':color} size={26}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:14,textDecoration:t.done?'line-through':'none'}}>{t.title}</div>
        <div style={{fontSize:11,color:T.textSub,marginTop:2}}>{t.cat} · {DIFF[t.diff].label} · +{DIFF[t.diff].xp} XP · +{DIFF[t.diff].gold} G</div>
      </div>
      <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
        <button onClick={()=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,focus:!x.focus}:x))} style={{background:t.focus?color+'22':'transparent',border:`1px solid ${t.focus?color:T.border}`,borderRadius:8,padding:'3px 8px',cursor:'pointer',color:t.focus?color:T.textSub,fontSize:12}}>◎</button>
        <button onClick={()=>startEdit(t)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:8,padding:'3px 8px',cursor:'pointer',color:T.accent,fontSize:12}}>✏</button>
        <button onClick={()=>completeTask(t.id)} className="pq-btn" style={{background:t.done?'#1a3a1a':color+'22',border:`1px solid ${t.done?'#22cc44':color}`,borderRadius:8,padding:'5px 12px',cursor:'pointer',color:t.done?'#22cc44':color,fontSize:13,fontWeight:700,boxShadow:'none'}}>{t.done?'✓':'›'}</button>
        <button onClick={()=>setTasks(ts=>ts.filter(x=>x.id!==t.id))} style={{background:'none',border:'none',color:'#661100',cursor:'pointer',fontSize:14}}>✕</button>
      </div>
    </div>
  );
};

// ═══ MAIN COMPONENT ═══
export default function ProductiQuest() {
  const [themeId,      setThemeId]      = useState('batman');
  const T = THEMES[themeId];
  const weapons = themeId==='batman' ? BATMAN_WEAPONS : SPIDERMAN_WEAPONS;

  const [tab,          setTab]          = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [landmarkIdx,  setLandmarkIdx]  = useState(0);
  const [sideOpen,     setSideOpen]     = useState(true);
  const [shopCat,      setShopCat]      = useState('weapons');

  const [char, setChar] = useState({level:1,xp:0,xpNext:100,gold:0,hp:0,maxHp:100,def:0,pet:null,crown:null});
  const [ownedItemIds, setOwnedItemIds] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [habits,setHabits]= useState([]);
  const [notes, setNotes] = useState([]);
  const [bosses,setBosses]= useState(BOSSES_INIT);
  const [notif, setNotif] = useState(null);

  const [prestigeUnlocked,setPrestigeUnlocked] = useState(false);
  const [hackerTitle,     setHackerTitle]      = useState(false);
  const [championTitle,   setChampionTitle]    = useState(false);
  const [cheatInput,      setCheatInput]       = useState('');
  const [showCheat,       setShowCheat]        = useState(false);
  const [cheatMsg,        setCheatMsg]         = useState('');

  const [showAddTask,  setShowAddTask]  = useState(false);
  const [tForm,        setTForm]        = useState({title:'',diff:'easy',cat:'GENERAL'});
  const [editingTask,  setEditingTask]  = useState(null);
  const [editForm,     setEditForm]     = useState({title:'',diff:'easy',cat:'GENERAL'});
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [hForm,        setHForm]        = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [hEditForm,    setHEditForm]    = useState('');
  const [noteMode,     setNoteMode]     = useState(null);
  const [nForm,        setNForm]        = useState({title:'',body:''});

  const toast=(msg,type='ok')=>{setNotif({msg,type});setTimeout(()=>setNotif(null),3500);};

  const gainReward=(xp,gold)=>{
    setChar(c=>{
      if(c.level>=100)return{...c,gold:c.gold+gold};
      let nx=c.xp+xp,nl=c.level,nn=c.xpNext;
      while(nx>=nn&&nl<100){nx-=nn;nl++;nn=Math.floor(nn*1.5);}
      if(nl>=100){nl=100;nx=nn;setTimeout(()=>{setPrestigeUnlocked(true);setChampionTitle(true);toast(`Level 100! ${T.vaultName} unlocked!`,'level');},200);}
      else if(nl>c.level)setTimeout(()=>toast(`Level Up! Now Level ${nl}!`,'level'),150);
      return{...c,xp:nx,xpNext:nn,level:nl,gold:c.gold+gold};
    });
  };

  const damageBoss=(dmg)=>{
    setBosses(bs=>{
      const idx=bs.findIndex(b=>b.hp>0);
      if(idx===-1)return bs;
      const arr=[...bs];
      const b={...arr[idx],hp:Math.max(0,arr[idx].hp-dmg)};
      if(b.hp===0&&arr[idx].hp>0)setTimeout(()=>{toast(`Boss defeated: ${b.name}! +${b.xp}XP +${b.gold}G`,'level');gainReward(b.xp,b.gold);},400);
      arr[idx]=b;return arr;
    });
  };

  const completeTask=(id)=>{
    const t=tasks.find(x=>x.id===id);
    if(!t||t.done)return;
    const d=DIFF[t.diff];
    setTasks(ts=>ts.map(x=>x.id===id?{...x,done:true}:x));
    gainReward(d.xp,d.gold);damageBoss(d.dmg);
    const m=T.msgs;
    toast(`+${d.xp} XP  +${d.gold} G — ${m[Math.floor(Math.random()*m.length)]}`);
  };

  const completeHabit=(id)=>{
    const h=habits.find(x=>x.id===id);
    if(!h||h.done)return;
    const bonus=Math.min(h.streak,10),xp=15+bonus*2,gold=8+bonus;
    setHabits(hs=>hs.map(x=>x.id===id?{...x,done:true,streak:x.streak+1}:x));
    gainReward(xp,gold);damageBoss(10);
    toast(`${h.streak+1}-day streak! +${xp} XP +${gold} G`);
  };

  const buyItem=(item)=>{
    if(char.gold<item.cost){toast('Not enough Gold!','err');return;}
    setChar(c=>{
      const u={gold:c.gold-item.cost};
      if(item.hp)u.hp=Math.min(c.maxHp,c.hp+item.hp);
      if(item.def)u.def=c.def+item.def;
      if(item.isPet&&!c.pet)u.pet=item;
      if(item.maxHpBoost){u.maxHp=c.maxHp+item.maxHpBoost;u.hp=Math.min(c.maxHp+item.maxHpBoost,c.hp+item.maxHpBoost);}
      if(item.isCrown)u.crown=item;
      return{...c,...u};
    });
    if(item.def||item.isCrown)setOwnedItemIds(ids=>[...ids,item.id]);
    if(item.xp)gainReward(item.xp,0);
    toast(`Acquired: ${item.name}!`);
  };

  const submitCheat=()=>{
    const code=cheatInput.trim().toUpperCase();
    if(code==='KLEOS'){
      setPrestigeUnlocked(true);setHackerTitle(true);
      setCheatInput('');setShowCheat(false);setCheatMsg('');
      setTimeout(()=>{setTab('vault');toast('GHOST PROTOCOL — Vault access granted!','level');},100);
    }else if(code==='AGRAPHON'){
      setChar(c=>({...c,gold:c.gold+100000}));
      setCheatInput('');setShowCheat(false);setCheatMsg('');
      toast('AGRAPHON — +100,000 Gold deposited!','level');
    }else{setCheatMsg('Access denied.');setTimeout(()=>setCheatMsg(''),2000);}
  };

  const submitTask=()=>{if(!tForm.title.trim())return;setTasks(ts=>[...ts,{...tForm,id:Date.now(),done:false,focus:false}]);setTForm({title:'',diff:'easy',cat:'GENERAL'});setShowAddTask(false);};
  const startEdit=(t)=>{setEditingTask(t.id);setEditForm({title:t.title,diff:t.diff,cat:t.cat});};
  const saveTask=()=>{if(!editForm.title.trim())return;setTasks(ts=>ts.map(t=>t.id===editingTask?{...t,...editForm}:t));setEditingTask(null);};
  const submitHabit=()=>{if(!hForm.trim())return;setHabits(hs=>[...hs,{id:Date.now(),title:hForm,streak:0,done:false,cat:'GENERAL'}]);setHForm('');setShowAddHabit(false);};
  const startEditHabit=(h)=>{setEditingHabit(h.id);setHEditForm(h.title);};
  const saveHabit=()=>{if(!hEditForm.trim())return;setHabits(hs=>hs.map(h=>h.id===editingHabit?{...h,title:hEditForm}:h));setEditingHabit(null);};
  const submitNote=()=>{
    if(!nForm.title.trim())return;
    noteMode==='add'?setNotes(ns=>[...ns,{...nForm,id:Date.now(),ts:'just now'}]):setNotes(ns=>ns.map(n=>n.id===noteMode?{...n,...nForm,ts:'just now'}:n));
    setNForm({title:'',body:''});setNoteMode(null);
  };

  const isMax         = char.level>=100;
  const rank          = getRank(char.level);
  const nextRank      = RANKS[RANKS.findIndex(r=>r.label===rank.label)+1];
  const landmark      = T.landmarks[landmarkIdx%T.landmarks.length];
  const activeBossIdx = bosses.findIndex(b=>b.hp>0);
  const activeBoss    = bosses[activeBossIdx];
  const focusTasks    = tasks.filter(t=>t.focus&&!t.done);
  const allFocusTasks = tasks.filter(t=>t.focus);
  const titleBadge    = hackerTitle?T.hackerBadge:championTitle?T.champBadge:null;
  const gameState     = {tasks,habits,bosses,char,prestigeUnlocked,hackerTitle};
  const unlockedAchvs = new Set(ACHV_DEFS.filter(a=>a.check(gameState)).map(a=>a.id));

  const radarData = {
    physical:   tasks.length   ? Math.round(tasks.filter(t=>t.done).length/tasks.length*100)              : 0,
    discipline: habits.length  ? Math.round(habits.filter(h=>h.done).length/habits.length*100)            : 0,
    mental:     allFocusTasks.length ? Math.round(allFocusTasks.filter(t=>t.done).length/allFocusTasks.length*100) : 0,
    social:     Math.min(100,Math.round(char.gold/30)),
    intellect:  Math.min(100,notes.length*20),
    ambition:   Math.max(0,Math.round((char.level-1)/99*100)),
  };

  const navItems=[
    {id:'home',      label:'Home',    icon:'◈'},
    {id:'daily',     label:'Daily',   icon:'◉'},
    {id:'focus',     label:'Focus',   icon:'◎'},
    {id:'habits',    label:'Habits',  icon:'↻'},
    {id:'notes',     label:'Notes',   icon:'▤'},
    {id:'shop',      label:'Shop',    icon:'◆'},
    {id:'challenges',label:'Boss',    icon:'⚡'},
    {id:'profile',   label:'Profile', icon:'☆'},
    ...(prestigeUnlocked?[{id:'vault',label:'Vault',icon:'✦'}]:[]),
  ];

  const card  = (x={})=>({background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:16,marginBottom:12,...x});
  const inp   = {width:'100%',background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:'10px 14px',color:T.text,fontSize:14,boxSizing:'border-box',outline:'none',fontFamily:'system-ui'};
  const sel   = {background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:'8px 12px',color:T.text,fontSize:13,outline:'none'};
  const btnP  = {background:T.accent,border:'none',color:'#000',padding:'10px 20px',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:800,boxShadow:`0 4px 18px ${T.accent}55`};
  const btnG  = {background:T.surface,border:`1px solid ${T.border}`,color:T.textSub,padding:'8px 16px',borderRadius:10,cursor:'pointer',fontSize:13};
  const h1    = {fontSize:28,fontWeight:900,color:T.text,marginBottom:4};
  const h2    = {fontSize:16,fontWeight:700,color:T.text,marginBottom:14};

  // Pass all needed values as props so TaskRow stays a stable top-level component
  const taskRowProps = { T, themeId, editingTask, editForm, setEditForm, setEditingTask, saveTask, completeTask, setTasks, startEdit, inp, sel, btnP, btnG, card };

  return (
    <div style={{fontFamily:'system-ui,-apple-system,sans-serif',background:T.bg,color:T.text,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <GlobalStyles/>

      {notif&&(
        <div className="pq-pop" style={{position:'fixed',top:16,right:16,zIndex:9999,background:notif.type==='err'?'#2a0000':notif.type==='level'?T.card:'#0a1a0a',border:`1px solid ${notif.type==='err'?'#cc2200':notif.type==='level'?T.accent:'#22cc44'}`,color:T.text,padding:'12px 20px',borderRadius:14,boxShadow:'0 8px 32px rgba(0,0,0,.8)',maxWidth:340,fontSize:13,lineHeight:1.5}}>
          {notif.msg}
        </div>
      )}

      {showSettings&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.88)',zIndex:8888,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setShowSettings(false)}>
          <div className="pq-pop" style={{...card(),maxWidth:480,width:'100%',boxShadow:'0 24px 64px rgba(0,0,0,.9)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div style={h2}>⚙ Shader Select</div>
              <button onClick={()=>setShowSettings(false)} style={{background:'none',border:'none',color:T.textSub,cursor:'pointer',fontSize:22}}>✕</button>
            </div>
            <p style={{color:T.textSub,fontSize:13,marginBottom:20}}>Choose your city. Transforms atmosphere, tokens, weapons, and rank icons.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {Object.values(THEMES).map(th=>{
                const active=themeId===th.id;
                return(
                  <button key={th.id} onClick={()=>{setThemeId(th.id);setLandmarkIdx(0);setShopCat('weapons');}} className="pq-hover"
                    style={{background:active?th.accent+'18':th.surface,border:`2px solid ${active?th.accent:th.border}`,borderRadius:16,padding:20,cursor:'pointer',textAlign:'left',boxShadow:active?`0 0 24px ${th.accent}44`:'none'}}>
                    <div style={{marginBottom:12}}>
                      {th.id==='batman'?<EmojiToken color={th.accent} size={44}/>:<SpiderToken color={th.accent} size={44}/>}
                    </div>
                    <div style={{fontSize:15,fontWeight:800,color:th.accent,marginBottom:3}}>{th.name}</div>
                    <div style={{fontSize:11,color:th.textSub,marginBottom:8}}>{th.city}</div>
                    <div style={{display:'flex',gap:6,marginBottom:8}}>
                      {[th.accent,th.accent2,'#888'].map(c=><span key={c} style={{display:'inline-block',width:14,height:14,borderRadius:'50%',background:c,boxShadow:`0 0 5px ${c}`}}/>)}
                    </div>
                    {active&&<div style={{fontSize:11,fontWeight:800,color:th.accent}}>✓ ACTIVE</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'10px 20px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',boxShadow:'0 2px 20px rgba(0,0,0,.5)'}}>
        <button onClick={()=>setSideOpen(o=>!o)} style={{background:'none',border:'none',color:T.textSub,cursor:'pointer',fontSize:18,padding:0}}>☰</button>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {themeId==='batman'?<EmojiToken color={T.accent} size={26}/>:<SpiderToken color={T.accent} size={26}/>}
          <span style={{fontSize:16,fontWeight:900,color:T.text,letterSpacing:-.5}}>ProductiQuest</span>
        </div>
        {titleBadge&&<span style={{fontSize:10,fontWeight:800,padding:'3px 10px',borderRadius:20,background:titleBadge.bg,border:`1px solid ${titleBadge.border}`,color:titleBadge.color}}>{titleBadge.label}</span>}
        <div style={{flex:1}}/>
        <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div style={{display:'flex',flexDirection:'column',gap:3,minWidth:140}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:11,color:T.accent,fontWeight:700,width:52}}>{isMax?'MAX':('Lv.'+char.level)}</span>
              <ProgressBar val={char.xp} max={char.xpNext} color={T.xpColor}/>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:11,color:'#ef4444',fontWeight:700,width:52}}>{char.hp}/{char.maxHp}</span>
              <ProgressBar val={char.hp} max={char.maxHp} color={T.hpColor}/>
            </div>
          </div>
          <span style={{color:'#f59e0b',fontWeight:700,fontSize:13}}>🪙 {char.gold.toLocaleString()}</span>
          <span style={{color:T.accent2,fontSize:12}}>🛡 {char.def}</span>
          {char.pet&&<span style={{fontSize:11,padding:'2px 8px',background:T.muted,borderRadius:8,color:T.textSub}}>{char.pet.name}</span>}
          <button onClick={()=>setShowSettings(true)} className="pq-btn" style={{...btnG,fontSize:12,padding:'6px 12px'}}>⚙</button>
        </div>
      </div>

      {/* Body */}
      <div style={{display:'flex',flex:1,overflow:'hidden',minHeight:0}}>

        {/* Sidebar */}
        {sideOpen&&(
          <div style={{width:154,background:T.surface,borderRight:`1px solid ${T.border}`,padding:'10px 0',display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
            {navItems.map(n=>(
              <button key={n.id} onClick={()=>setTab(n.id)} className="pq-hover"
                style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:tab===n.id?T.accent+'18':'transparent',border:'none',borderLeft:`3px solid ${tab===n.id?T.accent:'transparent'}`,color:tab===n.id?T.accent:T.textSub,cursor:'pointer',fontSize:12,fontWeight:tab===n.id?700:400,textAlign:'left',width:'100%'}}>
                <span style={{fontSize:13}}>{n.icon}</span>{n.label}
              </button>
            ))}
            <div style={{flex:1}}/>
            <div style={{margin:'8px 10px',padding:12,background:T.card,borderRadius:12,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:9,color:T.textSub,letterSpacing:'1px',marginBottom:5}}>📍 {T.city.toUpperCase()}</div>
              <div style={{fontSize:11,fontWeight:700,color:T.accent,marginBottom:3}}>{landmark.name}</div>
              <div style={{fontSize:10,color:T.textSub,lineHeight:1.4,marginBottom:8}}>{landmark.desc}</div>
              <button onClick={()=>setLandmarkIdx(i=>(i+1)%T.landmarks.length)} style={{...btnG,fontSize:10,padding:'4px 0',width:'100%',textAlign:'center',borderRadius:8}}>Next →</button>
            </div>
            <div style={{padding:'8px 12px',borderTop:`1px solid ${T.border}`}}>
              <button onClick={()=>setShowCheat(v=>!v)} style={{background:'none',border:'none',color:T.muted,cursor:'pointer',fontSize:10}}>🔑 {showCheat?'hide':'enter code'}</button>
              {showCheat&&(
                <div style={{marginTop:6}}>
                  <input value={cheatInput} onChange={e=>setCheatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submitCheat()} placeholder="code..." style={{...inp,fontSize:11,padding:'6px 8px',marginBottom:5,fontFamily:'monospace',letterSpacing:'2px'}}/>
                  {cheatMsg&&<div style={{fontSize:10,color:'#ff4444',marginBottom:4}}>{cheatMsg}</div>}
                  <button onClick={submitCheat} className="pq-btn" style={{...btnP,fontSize:11,padding:'6px 0',width:'100%',display:'block',textAlign:'center'}}>Unlock</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{flex:1,overflowY:'auto',backgroundImage:`radial-gradient(ellipse at 50% 20%, ${landmark.tint} 0%, transparent 60%)`}}>

          {tab==='home'&&(
            <div style={{padding:20}}>
              <div style={{...h1,fontFamily:'Georgia,serif'}}>Progress.</div>
              <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>{T.city} · {rank.label} · {rank.sub[themeId]} · Level {char.level}</div>
              <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
                <HexRadar data={radarData} T={T} size={270}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10,marginBottom:16}}>
                {ATTRS.map(attr=>(
                  <div key={attr.key} className="pq-hover" style={{...card({marginBottom:0,display:'flex',alignItems:'center',gap:12,borderColor:attr.color+'33',boxShadow:`0 0 18px ${attr.color}0f`})}}>
                    <TaskToken themeId={themeId} color={attr.color} size={26}/>
                    <div>
                      <div style={{fontSize:22,fontWeight:800,color:'white',lineHeight:1}}>{radarData[attr.key]}</div>
                      <div style={{fontSize:11,color:attr.color,fontWeight:700,marginTop:2}}>{attr.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              {activeBoss&&(
                <div style={{...card({borderColor:'#ef444433',background:'#180a08'})}}>
                  <div style={{fontSize:11,color:'#ef4444',fontWeight:700,marginBottom:4}}>⚡ ACTIVE BOSS</div>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>{activeBoss.name}</div>
                  <ProgressBar val={activeBoss.hp} max={activeBoss.maxHp} color='#ef4444' h={8}/>
                  <div style={{fontSize:11,color:T.textSub,marginTop:4}}>{activeBoss.hp}/{activeBoss.maxHp} HP · Complete tasks to deal damage</div>
                </div>
              )}
            </div>
          )}

          {tab==='daily'&&(
            <div style={{padding:20}}>
              <div style={{textAlign:'center',marginBottom:22}}>
                <div style={{fontSize:11,color:T.textSub,fontWeight:700,letterSpacing:'2px',marginBottom:4}}>TODAY</div>
                <div style={{fontSize:54,fontWeight:900,lineHeight:1}}>Day 1</div>
                <div style={{fontSize:13,color:T.textSub,marginTop:6}}>{T.city} Operations</div>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:20,overflowX:'auto',paddingBottom:4}}>
                {['Week 1','Week 2','Week 3','Week 4'].map((w,i)=>(
                  <button key={w} style={{...btnG,borderRadius:20,whiteSpace:'nowrap',background:i===0?T.accent:'transparent',color:i===0?'#000':T.textSub,border:`1px solid ${i===0?T.accent:T.border}`,fontWeight:i===0?800:400,fontSize:12,padding:'6px 16px'}}>{w}</button>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:14,color:T.textSub}}>{tasks.filter(t=>!t.done).length} remaining of {tasks.length}</div>
                <button onClick={()=>setShowAddTask(true)} className="pq-btn" style={btnP}>+ Add</button>
              </div>
              {showAddTask&&(
                <div className="pq-slide" style={card({borderColor:T.accent,marginBottom:14})}>
                  <input value={tForm.title} onChange={e=>setTForm(f=>({...f,title:e.target.value}))} placeholder="Task title..." style={{...inp,marginBottom:10}}/>
                  <FormRow>
                    <select value={tForm.diff} onChange={e=>setTForm(f=>({...f,diff:e.target.value}))} style={sel}>
                      <option value="easy">Easy (+10 XP)</option><option value="medium">Medium (+25 XP)</option><option value="hard">Hard (+50 XP)</option>
                    </select>
                    <input value={tForm.cat} onChange={e=>{const v=e.target.value;setTForm(f=>({...f,cat:v}));}} onFocus={e=>e.target.select()} placeholder="Category" style={{...sel,flex:1,minWidth:80}}/>
                  </FormRow>
                  <div style={{display:'flex',gap:8}}><button onClick={submitTask} className="pq-btn" style={btnP}>Add</button><button onClick={()=>setShowAddTask(false)} style={btnG}>Cancel</button></div>
                </div>
              )}
              {tasks.length===0&&!showAddTask&&<div style={{...card({textAlign:'center',padding:48}),color:T.textSub}}>No tasks yet. Tap + Add to begin your journey.</div>}
              {tasks.map(t=><TaskRow key={t.id} t={t} {...taskRowProps}/>)}
            </div>
          )}

          {tab==='focus'&&(
            <div style={{padding:20}}>
              <div style={h1}>Focus</div>
              <p style={{color:T.textSub,fontSize:13,marginBottom:18}}>Pinned priorities. Tap ◎ in Daily to pin tasks here.</p>
              {focusTasks.length===0?<div style={{...card({textAlign:'center',padding:48}),color:T.textSub}}>No tasks pinned. Go to Daily → tap ◎.</div>:focusTasks.map(t=><TaskRow key={t.id} t={t} {...taskRowProps}/>)}
            </div>
          )}

          {tab==='habits'&&(
            <div style={{padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <div style={h1}>Habits</div>
                <button onClick={()=>setShowAddHabit(true)} className="pq-btn" style={btnP}>+ Add</button>
              </div>
              {showAddHabit&&(
                <div className="pq-slide" style={card({borderColor:T.accent,marginBottom:14})}>
                  <input value={hForm} onChange={e=>setHForm(e.target.value)} placeholder="Habit name..." style={{...inp,marginBottom:10}}/>
                  <div style={{display:'flex',gap:8}}><button onClick={submitHabit} className="pq-btn" style={btnP}>Add</button><button onClick={()=>setShowAddHabit(false)} style={btnG}>Cancel</button></div>
                </div>
              )}
              {habits.length===0&&!showAddHabit&&<div style={{...card({textAlign:'center',padding:48}),color:T.textSub}}>No habits yet. Build your streak!</div>}
              {habits.map(h=>{
                const color=CAT_COLOR(h.cat);
                if(editingHabit===h.id)return(
                  <div key={h.id} className="pq-slide" style={card({borderColor:T.accent})}>
                    <div style={{fontSize:13,fontWeight:700,color:T.accent,marginBottom:10}}>Edit Habit</div>
                    <input value={hEditForm} onChange={e=>setHEditForm(e.target.value)} onFocus={e=>e.target.select()} placeholder="Habit name" style={{...inp,marginBottom:10}}/>
                    <div style={{display:'flex',gap:8}}><button onClick={saveHabit} className="pq-btn" style={btnP}>Save</button><button onClick={()=>setEditingHabit(null)} style={btnG}>Cancel</button></div>
                  </div>
                );
                return(
                  <div key={h.id} className="pq-hover" style={card({display:'flex',alignItems:'center',gap:14,borderColor:color+'44',boxShadow:`inset 3px 0 0 ${color}`,paddingLeft:20})}>
                    <TaskToken themeId={themeId} color={h.done?'#22cc44':color} size={26}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:14}}>{h.title}</div>
                      <div style={{fontSize:11,color:T.textSub,marginTop:2}}>Streak: {h.streak} days · Bonus: +{Math.min(h.streak,10)*2} XP</div>
                    </div>
                    <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
                      <div style={{background:'#1a0800',border:'1px solid #f9731633',borderRadius:20,padding:'4px 10px',color:'#f97316',fontSize:12,fontWeight:700}}>🔥 {h.streak}</div>
                      <button onClick={()=>startEditHabit(h)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:8,padding:'3px 8px',cursor:'pointer',color:T.accent,fontSize:12}}>✏</button>
                      <button onClick={()=>completeHabit(h.id)} className="pq-btn" style={{background:h.done?'#1a3a1a':color+'22',border:`1px solid ${h.done?'#22cc44':color}`,borderRadius:8,padding:'5px 12px',cursor:'pointer',color:h.done?'#22cc44':color,fontSize:13,fontWeight:700,boxShadow:'none'}}>{h.done?'✓':'›'}</button>
                      <button onClick={()=>setHabits(hs=>hs.filter(x=>x.id!==h.id))} style={{background:'none',border:'none',color:'#661100',cursor:'pointer',fontSize:14}}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab==='notes'&&(
            <div style={{padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <div style={h1}>Notes</div>
                <button onClick={()=>{setNForm({title:'',body:''});setNoteMode('add');}} className="pq-btn" style={btnP}>+ New</button>
              </div>
              {noteMode!==null&&(
                <div className="pq-slide" style={card({borderColor:T.accent,marginBottom:14})}>
                  <input value={nForm.title} onChange={e=>setNForm(f=>({...f,title:e.target.value}))} placeholder="Title..." style={{...inp,marginBottom:10}}/>
                  <textarea value={nForm.body} onChange={e=>setNForm(f=>({...f,body:e.target.value}))} placeholder="Write your note..." rows={5} style={{...inp,marginBottom:10,resize:'vertical',lineHeight:1.6}}/>
                  <div style={{display:'flex',gap:8}}><button onClick={submitNote} className="pq-btn" style={btnP}>{noteMode==='add'?'Save':'Update'}</button><button onClick={()=>setNoteMode(null)} style={btnG}>Cancel</button></div>
                </div>
              )}
              {notes.length===0&&!noteMode&&<div style={{...card({textAlign:'center',padding:48}),color:T.textSub}}>No notes yet. Start logging your thoughts!</div>}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
                {notes.map(n=>(
                  <div key={n.id} className="pq-hover" style={card({marginBottom:0})}>
                    <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>{n.title}</div>
                    <div style={{color:T.textSub,fontSize:13,marginBottom:12,lineHeight:1.5}}>{n.body.slice(0,100)}{n.body.length>100?'…':''}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:11,color:T.muted}}>{n.ts}</span>
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>{setNForm({title:n.title,body:n.body});setNoteMode(n.id);}} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:8,padding:'3px 10px',cursor:'pointer',color:T.accent,fontSize:12}}>Edit</button>
                        <button onClick={()=>setNotes(ns=>ns.filter(x=>x.id!==n.id))} style={{background:'none',border:'none',color:'#661100',cursor:'pointer',fontSize:14}}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==='shop'&&(
            <div style={{padding:20}}>
              <div style={h1}>Shop</div>
              <p style={{color:T.textSub,fontSize:13,marginBottom:16}}>Balance: <strong style={{color:'#f59e0b'}}>🪙 {char.gold.toLocaleString()} Gold</strong></p>
              <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
                {[['weapons',themeId==='batman'?'⚔ Arsenal':'🕸 Arsenal'],['consumables','🧪 Consumables'],['companions','🐾 Companions']].map(([cat,lbl])=>(
                  <button key={cat} onClick={()=>setShopCat(cat)} className="pq-btn" style={shopCat===cat?{...btnP,borderRadius:20,fontSize:13}:{...btnG,borderRadius:20,fontSize:13}}>{lbl}</button>
                ))}
              </div>
              {shopCat==='weapons'&&(
                <>
                  <div style={{fontSize:12,color:T.textSub,marginBottom:12}}>
                    {themeId==='batman'?'Batman\'s complete gadget arsenal — from Batarang to Batmobile':'Superior Spider-Man\'s tech suite — from Web Shooters to Nerve Hacking Technology'}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:12}}>
                    {weapons.map(item=>{
                      const owned=ownedItemIds.includes(item.id),ok=char.gold>=item.cost;
                      return(
                        <div key={item.id} className="pq-hover" style={card({marginBottom:0,borderColor:owned?item.color+'66':T.border,background:owned?item.color+'0a':T.card})}>
                          <div style={{display:'flex',justifyContent:'center',margin:'8px auto 10px'}}>
                            <TaskToken themeId={themeId} color={owned?item.color:T.textSub} size={28}/>
                          </div>
                          <div style={{fontWeight:700,fontSize:13,marginBottom:3,color:owned?item.color:T.text}}>{item.name}</div>
                          <div style={{fontSize:11,color:T.textSub,marginBottom:4}}>{item.desc}</div>
                          <div style={{fontSize:11,color:item.color,fontWeight:700,marginBottom:12}}>+{item.def} DEF</div>
                          {owned
                            ?<div style={{color:'#22cc44',fontSize:11,fontWeight:700,textAlign:'center'}}>✓ Equipped</div>
                            :<button onClick={()=>buyItem(item)} className="pq-btn" style={{...ok?{...btnP,background:item.color}:btnG,fontSize:11,width:'100%',opacity:ok?1:.5,cursor:ok?'pointer':'not-allowed',borderRadius:8,padding:'7px 0'}}>
                              🪙 {item.cost.toLocaleString()}
                            </button>
                          }
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {shopCat==='consumables'&&(
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
                  {SHOP_CONSUMABLES.map(item=>{
                    const ok=char.gold>=item.cost;
                    return(
                      <div key={item.id} className="pq-hover" style={card({marginBottom:0,textAlign:'center'})}>
                        <div style={{display:'flex',justifyContent:'center',margin:'8px auto 12px'}}>
                          <TaskToken themeId={themeId} color={item.color} size={28}/>
                        </div>
                        <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{item.name}</div>
                        <div style={{fontSize:12,color:T.textSub,marginBottom:14}}>{item.desc}</div>
                        <button onClick={()=>buyItem(item)} className="pq-btn" style={{...ok?btnP:btnG,fontSize:12,width:'100%',opacity:ok?1:.5,cursor:ok?'pointer':'not-allowed',borderRadius:8}}>🪙 {item.cost}</button>
                      </div>
                    );
                  })}
                </div>
              )}
              {shopCat==='companions'&&(
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
                  {SHOP_COMPANIONS.map(item=>{
                    const owned=char.pet?.id===item.id,ok=char.gold>=item.cost;
                    return(
                      <div key={item.id} className="pq-hover" style={card({marginBottom:0,textAlign:'center',borderColor:owned?'#22cc4444':T.border})}>
                        <div style={{display:'flex',justifyContent:'center',margin:'8px auto 12px'}}>
                          <TaskToken themeId={themeId} color={item.color} size={28}/>
                        </div>
                        <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{item.name}</div>
                        <div style={{fontSize:12,color:T.textSub,marginBottom:14}}>{item.desc}</div>
                        {owned?<div style={{color:'#22cc44',fontSize:12,fontWeight:700}}>✓ Active</div>
                          :<button onClick={()=>buyItem(item)} className="pq-btn" style={{...ok?btnP:btnG,fontSize:12,width:'100%',opacity:ok?1:.5,cursor:ok?'pointer':'not-allowed',borderRadius:8}}>🪙 {item.cost}</button>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab==='challenges'&&(
            <div style={{padding:20}}>
              <div style={h1}>Challenges</div>
              <p style={{color:T.textSub,fontSize:13,marginBottom:20}}>Complete tasks & habits to damage bosses. Sequential unlock.</p>
              {bosses.map((b,i)=>{
                const isActive=i===activeBossIdx,isDefeated=b.hp===0,isLocked=!isDefeated&&!isActive;
                return(
                  <div key={b.id} className="pq-hover" style={card({borderColor:isDefeated?'#22cc4433':isActive?b.color+'44':T.border,opacity:isLocked?.35:1,marginBottom:14})}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:isDefeated?'#22cc44':isActive?b.color:T.textSub,fontWeight:700,letterSpacing:'1px',marginBottom:4}}>{isDefeated?'✓ DEFEATED':isLocked?'🔒 LOCKED':'⚡ ACTIVE TARGET'}</div>
                        <div style={{fontWeight:800,fontSize:17,color:isDefeated?'#22cc44':isActive?b.color:T.textSub}}>{b.name}</div>
                        <div style={{fontSize:13,color:T.textSub,marginTop:3}}>{b.desc}</div>
                        {isLocked&&<div style={{fontSize:12,color:T.muted,marginTop:4}}>Defeat previous boss to unlock</div>}
                      </div>
                      <div style={{textAlign:'right',flexShrink:0,marginLeft:12}}>
                        <div style={{color:'#f59e0b',fontWeight:700}}>🪙 {b.gold}</div>
                        <div style={{color:T.accent,fontWeight:700}}>+{b.xp} XP</div>
                      </div>
                    </div>
                    <ProgressBar val={b.hp} max={b.maxHp} color={isDefeated?'#22cc44':b.color} h={10}/>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:12,color:T.textSub}}>
                      <span>{isDefeated?'Eliminated!':isActive?'Easy -5 · Med -15 · Hard -30 · Habit -10':''}</span>
                      <span>{b.hp}/{b.maxHp} HP</span>
                    </div>
                  </div>
                );
              })}
              {activeBossIdx===-1&&<div style={{...card({textAlign:'center',padding:48}),color:'#22cc44',fontWeight:700,fontSize:16}}>All bosses defeated! {T.city} is secure. 🏆</div>}
            </div>
          )}

          {tab==='profile'&&(
            <div style={{padding:20}}>
              <div style={{...h1,fontFamily:'Georgia,serif'}}>Profile.</div>
              <div style={{textAlign:'center',marginBottom:28}}>
                <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:100,height:100,borderRadius:'50%',background:T.accent+'18',border:`2px solid ${T.accent}44`,marginBottom:14,boxShadow:`0 0 30px ${T.accent}33`}}>
                  {themeId==='batman'?<EmojiToken color={T.accent} size={64}/>:<SpiderToken color={T.accent} size={60}/>}
                </div>
                <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Hero</div>
                <div style={{fontSize:13,color:T.textSub,marginBottom:4}}>{rank.label} · {rank.sub[themeId]}</div>
                <div style={{fontSize:12,color:T.muted,marginBottom:14}}>@productiquest · {T.city}</div>
                <button className="pq-btn pq-pulse" style={{...btnP,padding:'10px 28px',borderRadius:24,letterSpacing:'1px',fontSize:12}} onClick={()=>setTab('home')}>
                  VIEW PROGRESS CARD
                </button>
              </div>

              <div style={card({marginBottom:14})}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div style={h2}>Rank Progress</div>
                  <div style={{fontSize:12,color:T.textSub}}>Level {char.level}</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:6,overflowX:'auto',paddingBottom:8}}>
                  {RANKS.map(r=>{
                    const isActive=rank.label===r.label;
                    const isPast  =char.level>=r.min;
                    return(
                      <div key={r.label} style={{textAlign:'center',flex:1,minWidth:50,opacity:(!isPast&&!isActive)?.25:1}}>
                        <div style={{position:'relative',width:52,height:60,margin:'0 auto 5px'}}>
                          <svg viewBox="0 0 52 60" width={52} height={60} style={{position:'absolute',top:0,left:0}}>
                            <path d="M26,2 L48,12 L48,36 Q48,52 26,60 Q4,52 4,36 L4,12 Z"
                              fill={isPast||isActive?r.color+'20':'#111'}
                              stroke={isPast||isActive?r.color:'#2a2a2a'}
                              strokeWidth={isActive?2.5:1}
                              style={isActive?{filter:`drop-shadow(0 0 8px ${r.color})`}:{}}/>
                          </svg>
                          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>
                            {isPast||isActive
                              ? (themeId==='batman'
                                  ? <BatRankIcon rankLabel={r.label} color={r.color} size={28}/>
                                  : <SpiderRankIcon rankLabel={r.label} color={r.color} size={26}/>)
                              : <span style={{fontSize:14,color:'#333'}}>?</span>
                            }
                          </div>
                        </div>
                        <div style={{fontSize:8,color:isPast||isActive?r.color:'#333',fontWeight:700,letterSpacing:'.5px'}}>{r.label}</div>
                        <div style={{fontSize:7,color:isPast||isActive?r.color+'aa':'#222',marginTop:1}}>{r.sub[themeId].split(' ')[0]}</div>
                        {isActive&&<div style={{fontSize:7,color:T.textSub,marginTop:2}}>NOW</div>}
                      </div>
                    );
                  })}
                </div>
                {nextRank&&(
                  <div style={{marginTop:10}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:12}}>
                      <span style={{color:rank.color,fontWeight:700}}>{rank.label}</span>
                      <span style={{color:T.textSub}}>{nextRank.min-char.level} levels to {nextRank.label}</span>
                    </div>
                    <ProgressBar val={char.level-rank.min} max={nextRank.min-rank.min} color={rank.color} h={6}/>
                  </div>
                )}
              </div>

              <div style={card()}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div style={h2}>Achievements</div>
                  <div style={{fontSize:12,color:T.textSub}}>{unlockedAchvs.size}/{ACHV_DEFS.length} unlocked</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))',gap:14}}>
                  {ACHV_DEFS.map(a=><AchievementCard key={a.id} def={a} unlocked={unlockedAchvs.has(a.id)}/>)}
                </div>
              </div>
            </div>
          )}

          {tab==='vault'&&prestigeUnlocked&&(
            <div style={{padding:20}}>
              <div style={h1}>{T.vaultName}</div>
              <div style={card({borderColor:hackerTitle?'#cc2200':T.accent,background:hackerTitle?'#1a0000':T.surface,marginBottom:20})}>
                <div style={{fontSize:13,color:T.textSub,lineHeight:1.8}}>
                  {hackerTitle
                    ?<><strong style={{color:'#ff4444'}}>GHOST PROTOCOL.</strong> Code <span style={{color:'#ff4444',fontFamily:'monospace',letterSpacing:'2px'}}>KLEOS</span> bypassed the grind. Prestige items unlocked early.</>
                    :<><strong style={{color:T.accent}}>{T.champBadge.label}.</strong> Level 100 achieved. These legendary items are yours alone.</>
                  }
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(168px,1fr))',gap:14}}>
                {PRESTIGE_ITEMS.map(item=>{
                  const owned=(item.isPet&&char.pet?.id===item.id)||(item.isCrown&&char.crown?.id===item.id),ok=char.gold>=item.cost;
                  return(
                    <div key={item.id} className="pq-hover" style={{...card({marginBottom:0,textAlign:'center',borderColor:owned?T.accent:T.accent+'33',background:T.surface}),boxShadow:`0 0 20px ${T.accent}0f`}}>
                      <div style={{fontSize:8,color:T.accent,letterSpacing:'1.5px',marginTop:4,marginBottom:8,fontFamily:'monospace',textTransform:'uppercase'}}>{hackerTitle?'Shadow Access':'Prestige Only'}</div>
                      <div style={{display:'flex',justifyContent:'center',marginBottom:12}}>
                        <TaskToken themeId={themeId} color={item.color||T.accent} size={34}/>
                      </div>
                      <div style={{fontWeight:800,fontSize:14,marginBottom:4,color:T.accent}}>{item.name}</div>
                      <div style={{fontSize:12,color:T.textSub,marginBottom:16}}>{item.desc}</div>
                      {owned?<div style={{color:T.accent,fontSize:12,fontWeight:700}}>✓ Owned</div>
                        :<button onClick={()=>buyItem(item)} className="pq-btn" style={{...ok?btnP:btnG,fontSize:12,width:'100%',opacity:ok?1:.5,cursor:ok?'pointer':'not-allowed',borderRadius:8}}>🪙 {item.cost.toLocaleString()}</button>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
