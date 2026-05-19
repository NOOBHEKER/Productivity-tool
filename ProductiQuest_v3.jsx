// ProductiQuest v5 — retro aesthetic · theme pets · sin villains · shader renames
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
  {min:0,   label:'IRON',     color:'#6b7280', sub:{batman:'Year One',       spiderman:'High School Peter'}},
  {min:10,  label:'BRONZE',   color:'#b45309', sub:{batman:'Classic Era',    spiderman:'Amazing Spider-Man'}},
  {min:25,  label:'SILVER',   color:'#94a3b8', sub:{batman:'Dark Knight',    spiderman:'Black Suit Era'}},
  {min:50,  label:'GOLD',     color:'#f59e0b', sub:{batman:'No Man\'s Land', spiderman:'Iron Spider'}},
  {min:75,  label:'PLATINUM', color:'#e2e8f0', sub:{batman:'Knightfall',     spiderman:'Superior Spidey'}},
  {min:100, label:'CHAMPION', color:'#fbbf24', sub:{batman:'Endgame',        spiderman:'Ultimate Superior'}},
];
const getRank = lv => [...RANKS].reverse().find(r=>lv>=r.min)||RANKS[0];

// ── Weapons ──
const BATMAN_WEAPONS = [
  {id:'bw1',name:'Batarang',       cost:50,   def:5,   color:'#6b7280',desc:'Iconic bat-shaped boomerang'},
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
  {id:'sw10',name:'Nerve Hacking Tech',cost:3000, def:300, color:'#7c3aed',desc:'Neural interface — Supreme tech'},
];

// ── Theme-specific Pets ──
const BATMAN_PETS = [
  {id:'bp1',name:'Bathound',  cost:75,  isPet:true,color:'#94a3b8',desc:'Loyal canine crime-fighter'},
  {id:'bp2',name:'Goloth',    cost:150, isPet:true,color:'#f59e0b',desc:'Ancient gargoyle guardian'},
  {id:'bp3',name:'Batco',     cost:350, isPet:true,color:'#6366f1',desc:'Rare mystic bat companion'},
];
const SPIDERMAN_PETS = [
  {id:'sp1',name:'Spider-Cat',  cost:75,  isPet:true,color:'#f97316',desc:'Tiny feline web-slinger'},
  {id:'sp2',name:'Spider-Dino', cost:150, isPet:true,color:'#22c55e',desc:'Prehistoric spider beast'},
  {id:'sp3',name:'Spider-Fish', cost:350, isPet:true,color:'#3b82f6',desc:'Deep-sea arachnid marvel'},
];

// ── Consumables ──
const SHOP_CONSUMABLES = [
  {id:'f1',name:'Health Ration',cost:15, hp:10, xp:0,  color:'#22c55e',desc:'+10 HP'},
  {id:'f2',name:'Field Pizza',  cost:30, hp:25, xp:0,  color:'#f97316',desc:'+25 HP'},
  {id:'f3',name:'XP Serum',     cost:60, hp:0,  xp:50, color:'#a855f7',desc:'+50 XP'},
  {id:'f4',name:'Gold Elixir',  cost:80, hp:40, xp:20, color:'#f59e0b',desc:'+40 HP & +20 XP'},
];

// ── Prestige ──
const PRESTIGE_ITEMS = [
  {id:'l1',name:'Excalibur',          cost:1000,def:300,        color:'#fbbf24',desc:'+300 DEF — Legendary Weapon'},
  {id:'l2',name:'Void Cloak',         cost:800, def:200,        color:'#6366f1',desc:'+200 DEF — Cosmic Artifact'},
  {id:'l3',name:'Celestial Mount',    cost:700, isPet:true,     color:'#22c55e',desc:'Mythical Companion'},
  {id:'l4',name:"Philosopher's Stone",cost:1500,maxHpBoost:100, color:'#3b82f6',desc:'+100 Max HP Permanent'},
  {id:'l5',name:'Crown of Eternity',  cost:500, isCrown:true,   color:'#f59e0b',desc:'Eternal Champion Mark'},
];

// ── Villains — 7 Deadly Sins, all 100 HP ──
const BATMAN_VILLAINS = [
  {id:'bv1',name:'The Riddler',   sin:'Pride',    maxHp:100,hp:100,xp:120,gold:60, color:'#22c55e',desc:'His ego is the greatest puzzle of all.'},
  {id:'bv2',name:'The Penguin',   sin:'Greed',    maxHp:100,hp:100,xp:120,gold:60, color:'#94a3b8',desc:'Hoards Gotham\'s wealth behind a monocle.'},
  {id:'bv3',name:'Catwoman',      sin:'Lust',     maxHp:100,hp:100,xp:120,gold:60, color:'#a855f7',desc:'Desire is her sharpest weapon.'},
  {id:'bv4',name:'Two-Face',      sin:'Jealousy', maxHp:100,hp:100,xp:120,gold:60, color:'#6366f1',desc:'Torn between what was and what could be.'},
  {id:'bv5',name:'Killer Croc',   sin:'Gluttony', maxHp:100,hp:100,xp:120,gold:60, color:'#16a34a',desc:'Consumes everything in his path.'},
  {id:'bv6',name:'The Joker',     sin:'Anger',    maxHp:100,hp:100,xp:120,gold:60, color:'#ef4444',desc:'Rage dressed up as a punchline.'},
  {id:'bv7',name:'Mr. Freeze',    sin:'Sloth',    maxHp:100,hp:100,xp:120,gold:60, color:'#7dd3fc',desc:'Cold indifference to the world around him.'},
];
const SPIDERMAN_VILLAINS = [
  {id:'sv1',name:'Doctor Octopus', sin:'Pride',   maxHp:100,hp:100,xp:120,gold:60, color:'#dc2626',desc:'Brilliance twisted into superiority.'},
  {id:'sv2',name:'Kingpin',        sin:'Greed',   maxHp:100,hp:100,xp:120,gold:60, color:'#78716c',desc:'Empire built on Manhattan\'s suffering.'},
  {id:'sv3',name:'Black Cat',      sin:'Lust',    maxHp:100,hp:100,xp:120,gold:60, color:'#e2e8f0',desc:'Charm is her most dangerous tool.'},
  {id:'sv4',name:'Venom',          sin:'Envy',    maxHp:100,hp:100,xp:120,gold:60, color:'#1d4ed8',desc:'Everything Peter has — it wants it all.'},
  {id:'sv5',name:'Lizard',         sin:'Gluttony',maxHp:100,hp:100,xp:120,gold:60, color:'#15803d',desc:'Primal hunger consumes Dr. Connors.'},
  {id:'sv6',name:'Green Goblin',   sin:'Wrath',   maxHp:100,hp:100,xp:120,gold:60, color:'#65a30d',desc:'Madness and fury on a glider.'},
  {id:'sv7',name:'Mysterio',       sin:'Sloth',   maxHp:100,hp:100,xp:120,gold:60, color:'#7c3aed',desc:'Illusions are easier than real effort.'},
];

const DIFF={
  easy:  {label:'Easy',  xp:10,gold:5,  dmg:5,  color:'#22c55e'},
  medium:{label:'Med',   xp:25,gold:15, dmg:15, color:'#f97316'},
  hard:  {label:'Hard',  xp:50,gold:30, dmg:30, color:'#ef4444'},
};

const THEMES = {
  batman:{
    id:'batman',name:'Absolute Batman',city:'Gotham City',
    bg:'#07080a',surface:'#0d0f12',card:'#131619',border:'#252a2f',
    accent:'#c8a000',accent2:'#4488aa',text:'#e8e0d0',textSub:'#55504a',muted:'#1a1d20',
    xpColor:'#c8a000',hpColor:'#cc3300',
    font:'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
    scanline:'rgba(0,0,0,0.15)',
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
    id:'spiderman',name:'Superior Spider-Man',city:'New York City',
    bg:'#07050f',surface:'#0e0018',card:'#130020',border:'#2a0048',
    accent:'#ff2244',accent2:'#2255ee',text:'#f5e8f0',textSub:'#774455',muted:'#1a0018',
    xpColor:'#ff2244',hpColor:'#2255ee',
    font:'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
    scanline:'rgba(255,0,30,0.03)',
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
    champBadge: {label:'SUPERIOR SPIDER-MAN',bg:'#08001a',border:'#ff2244',color:'#ffaacc'},
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
    @keyframes pulseGlow{0%,100%{opacity:1}50%{opacity:.6}}
    @keyframes scanRoll{from{background-position:0 0}to{background-position:0 4px}}
    @keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.88}96%{opacity:1}97%{opacity:.94}}
    .pq-slide{animation:slideUp .2s ease forwards}
    .pq-pop{animation:popIn .16s ease forwards}
    .pq-pulse{animation:pulseGlow 2s ease-in-out infinite}
    .pq-hover{transition:filter .12s,transform .12s}
    .pq-hover:hover{filter:brightness(1.15);transform:translateY(-1px)}
    .pq-btn:hover{filter:brightness(1.25)}
    .pq-btn:active{transform:scale(.96)}
    .retro-flicker{animation:flicker 8s ease-in-out infinite}
    .scanlines{
      background-image:repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.08) 2px,
        rgba(0,0,0,0.08) 4px
      );
      pointer-events:none;
    }
  `}</style>
);

const FormRow = ({children}) => (
  <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>{children}</div>
);

const ProgressBar = ({val,max,color,h=6}) => (
  <div style={{background:'#ffffff10',borderRadius:2,height:h,overflow:'hidden',flex:1,border:'1px solid #ffffff0a'}}>
    <div style={{
      width:`${Math.min(100,Math.round(val/Math.max(max,1)*100))}%`,
      background:`repeating-linear-gradient(90deg,${color},${color} 6px,${color}cc 6px,${color}cc 8px)`,
      height:'100%',borderRadius:1,transition:'width .5s'
    }}/>
  </div>
);

// ── Braille art Batman logo ──
const BAT_GRID = [
  '⠤⣤⣤⣤⣤⣤⠀⠀⣄⣠⠀⠀⣠⣤⣤⣤⣤⠤',
  '⠀⠈⣿⣿⣿⣿⣷⣶⣿⣿⣶⣾⣿⣿⣿⣿⠁⠀',
  '⠀⠀⠈⠉⠉⠛⠻⢿⣿⣿⡿⠟⠛⠉⠉⠁⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠀⠙⠋⠀⠀⠀⠀⠀⠀⠀⠀',
];
const EmojiToken = ({ color='#c8a000', size=32 }) => {
  const CELL=8,COLS=18,ROWS=BAT_GRID.length;
  const naturalW=COLS*CELL,naturalH=ROWS*CELL,scale=size/naturalW;
  return (
    <div style={{position:'relative',width:size,height:naturalH*scale,display:'inline-block',flexShrink:0}}>
      <div style={{position:'absolute',top:0,left:0,transform:`scale(${scale})`,transformOrigin:'top left',
        lineHeight:`${CELL}px`,fontSize:CELL*0.9,fontFamily:'monospace',color,
        userSelect:'none',pointerEvents:'none',whiteSpace:'pre',filter:`drop-shadow(0 0 3px ${color}99)`}}>
        {BAT_GRID.map((row,ri)=><div key={ri}>{row}</div>)}
      </div>
    </div>
  );
};

// ── Braille art Spider-Man logo ──
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
  const CELL=7,COLS=20,ROWS=SPIDER_GRID.length;
  const naturalW=COLS*CELL,naturalH=ROWS*CELL,scale=size/naturalW;
  return (
    <div style={{position:'relative',width:size,height:naturalH*scale,display:'inline-block',flexShrink:0}}>
      <div style={{position:'absolute',top:0,left:0,transform:`scale(${scale})`,transformOrigin:'top left',
        lineHeight:`${CELL}px`,fontSize:CELL*0.95,fontFamily:'monospace',color,
        userSelect:'none',pointerEvents:'none',whiteSpace:'pre',filter:`drop-shadow(0 0 3px ${color}99)`}}>
        {SPIDER_GRID.map((row,ri)=><div key={ri}>{row}</div>)}
      </div>
    </div>
  );
};

const TaskToken = ({themeId,color,size=28}) =>
  themeId==='batman' ? <EmojiToken color={color} size={size}/> : <SpiderToken color={color} size={size}/>;

const BatRankIcon   = ({color,size=30}) => <EmojiToken color={color} size={size}/>;
const SpiderRankIcon= ({color,size=30}) => <SpiderToken color={color} size={size}/>;

// Hex radar
const HexRadar = ({data,T,size=270}) => {
  const cx=size/2,cy=size/2,R=size*.36;
  const angles=ATTRS.map((_,i)=>(i*60-90)*Math.PI/180);
  const pt=(a,r)=>({x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)});
  const dataPts=ATTRS.map((attr,i)=>{const v=(data[attr.key]||0)/100;return pt(angles[i],R*v);});
  const poly=dataPts.map(p=>`${p.x},${p.y}`).join(' ');
  const overall=Math.round(ATTRS.reduce((s,a)=>s+(data[a.key]||0),0)/ATTRS.length);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:'visible'}}>
      {[.2,.4,.6,.8,1].map(lv=>{
        const pts=angles.map(a=>{const p=pt(a,R*lv);return`${p.x},${p.y}`;}).join(' ');
        return <polygon key={lv} points={pts} fill="none" stroke={lv===1?'#ffffff22':'#ffffff0f'} strokeWidth={lv===1?1.5:.7} strokeDasharray={lv===1?'none':'3 3'}/>;
      })}
      {ATTRS.map((attr,i)=>{const e=pt(angles[i],R);return <line key={attr.key} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="#ffffff0d" strokeWidth={.7}/>;} )}
      <polygon points={poly} fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.8)" strokeWidth={1.5} style={{filter:'drop-shadow(0 0 8px rgba(255,255,255,.35))',transition:'all .5s'}}/>
      {ATTRS.map((attr,i)=>{
        const lp=pt(angles[i],R+22);
        return <text key={attr.key} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill={attr.color} fontSize={10} fontFamily="monospace" fontWeight={700}>{attr.name}</text>;
      })}
      <text x={cx} y={cy-12} textAnchor="middle" fill="white" fontSize={32} fontWeight={900} fontFamily="monospace" style={{filter:'drop-shadow(0 0 10px rgba(255,255,255,.4))'}}>{overall}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="#555" fontSize={8} fontFamily="monospace" letterSpacing={3}>OVR RATING</text>
    </svg>
  );
};

const AchievementCard = ({def,unlocked}) => {
  const RC={common:'#22c55e',uncommon:'#3b82f6',rare:'#a855f7',legendary:'#f59e0b',secret:'#ef4444'};
  const c=unlocked?(RC[def.rarity]||def.color):'#2a2a2a';
  return (
    <div style={{textAlign:'center',opacity:unlocked?1:.3}}>
      <svg viewBox="0 0 56 66" width={52} height={61} style={{display:'block',margin:'0 auto 5px'}}>
        <path d="M28,2 L52,12 L52,38 Q52,56 28,64 Q4,56 4,38 L4,12 Z" fill={c+'18'} stroke={c} strokeWidth={unlocked?2:1} strokeDasharray={unlocked?'none':'4 2'} style={unlocked&&def.rarity==='legendary'?{filter:`drop-shadow(0 0 6px ${c})`}:{}}/>
        {def.rarity==='legendary'&&[20,28,36].map(x=><text key={x} x={x} y={17} textAnchor="middle" fontSize={7} fill={c}>★</text>)}
        {def.rarity==='rare'&&[24,32].map(x=><text key={x} x={x} y={17} textAnchor="middle" fontSize={7} fill={c}>★</text>)}
        {unlocked?<text x={28} y={42} textAnchor="middle" fontSize={18} fill={c}>✓</text>:<text x={28} y={42} textAnchor="middle" fontSize={16} fill="#333">?</text>}
      </svg>
      <div style={{fontSize:8,color:unlocked?c:'#333',fontWeight:700,letterSpacing:'.5px',lineHeight:1.3,fontFamily:'monospace'}}>{def.name}</div>
      {unlocked&&<div style={{fontSize:7,color:'#555',marginTop:2,textTransform:'uppercase',fontFamily:'monospace'}}>{def.rarity}</div>}
    </div>
  );
};

// SIN color map
const SIN_COLOR = {
  Pride:'#f59e0b', Greed:'#22c55e', Lust:'#ec4899', Jealousy:'#6366f1',
  Envy:'#6366f1',  Gluttony:'#f97316', Anger:'#ef4444', Wrath:'#ef4444', Sloth:'#94a3b8',
};

// ── TaskRow — OUTSIDE main component (prevents remount/logo-reset bug) ──
const TaskRow = ({t,T,themeId,editingTask,editForm,setEditForm,setEditingTask,saveTask,completeTask,setTasks,startEdit,inp,sel,btnP,btnG,card}) => {
  const color=CAT_COLOR(t.cat);
  if(editingTask===t.id) return (
    <div className="pq-slide" style={card({borderColor:T.accent,marginBottom:10})}>
      <div style={{fontSize:12,fontWeight:700,color:T.accent,marginBottom:10,fontFamily:'monospace',letterSpacing:1}}>// EDIT TASK</div>
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
    <div className="pq-hover" style={{...card({marginBottom:8,display:'flex',alignItems:'center',gap:12,opacity:t.done?.4:1,borderColor:color+'44',boxShadow:`inset 2px 0 0 ${color}`,paddingLeft:18})}}>
      <TaskToken themeId={themeId} color={t.done?'#333':color} size={24}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:13,textDecoration:t.done?'line-through':'none',fontFamily:'monospace'}}>{t.title}</div>
        <div style={{fontSize:10,color:T.textSub,marginTop:2,fontFamily:'monospace'}}>{t.cat} · {DIFF[t.diff].label} · +{DIFF[t.diff].xp}XP · +{DIFF[t.diff].gold}G</div>
      </div>
      <div style={{display:'flex',gap:5,alignItems:'center',flexShrink:0}}>
        <button onClick={()=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,focus:!x.focus}:x))} style={{background:t.focus?color+'22':'transparent',border:`1px solid ${t.focus?color:T.border}`,borderRadius:4,padding:'3px 7px',cursor:'pointer',color:t.focus?color:T.textSub,fontSize:11,fontFamily:'monospace'}}>◎</button>
        <button onClick={()=>startEdit(t)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:4,padding:'3px 7px',cursor:'pointer',color:T.accent,fontSize:11}}>✏</button>
        <button onClick={()=>completeTask(t.id)} className="pq-btn" style={{background:t.done?'#1a3a1a':color+'22',border:`1px solid ${t.done?'#22cc44':color}`,borderRadius:4,padding:'4px 10px',cursor:'pointer',color:t.done?'#22cc44':color,fontSize:12,fontWeight:700,boxShadow:'none',fontFamily:'monospace'}}>{t.done?'[✓]':'[›]'}</button>
        <button onClick={()=>setTasks(ts=>ts.filter(x=>x.id!==t.id))} style={{background:'none',border:'none',color:'#661100',cursor:'pointer',fontSize:13}}>✕</button>
      </div>
    </div>
  );
};

// ═══ MAIN COMPONENT ═══
export default function ProductiQuest() {
  const [themeId,      setThemeId]      = useState('batman');
  const T = THEMES[themeId];
  const weapons   = themeId==='batman' ? BATMAN_WEAPONS   : SPIDERMAN_WEAPONS;
  const pets      = themeId==='batman' ? BATMAN_PETS      : SPIDERMAN_PETS;
  const villains  = themeId==='batman' ? BATMAN_VILLAINS  : SPIDERMAN_VILLAINS;

  const [tab,          setTab]          = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [landmarkIdx,  setLandmarkIdx]  = useState(0);
  const [sideOpen,     setSideOpen]     = useState(true);
  const [shopCat,      setShopCat]      = useState('weapons');

  const [char,         setChar]         = useState({level:1,xp:0,xpNext:100,gold:0,hp:0,maxHp:100,def:0,pet:null,crown:null});
  const [ownedItemIds, setOwnedItemIds] = useState([]);

  const [tasks,  setTasks]  = useState([]);
  const [habits, setHabits] = useState([]);
  const [notes,  setNotes]  = useState([]);
  // Each theme has its own villain state — stored as two separate arrays
  const [batVillains, setBatVillains]   = useState(BATMAN_VILLAINS.map(v=>({...v})));
  const [spdVillains, setSpdVillains]   = useState(SPIDERMAN_VILLAINS.map(v=>({...v})));
  const bosses    = themeId==='batman' ? batVillains : spdVillains;
  const setBosses = themeId==='batman' ? setBatVillains : setSpdVillains;

  const [notif,        setNotif]        = useState(null);
  const [prestigeUnlocked,setPrestigeUnlocked]=useState(false);
  const [hackerTitle,  setHackerTitle]  = useState(false);
  const [championTitle,setChampionTitle]=useState(false);
  const [cheatInput,   setCheatInput]   = useState('');
  const [showCheat,    setShowCheat]    = useState(false);
  const [cheatMsg,     setCheatMsg]     = useState('');

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
      else if(nl>c.level)setTimeout(()=>toast(`Level Up! Now ${nl}!`,'level'),150);
      return{...c,xp:nx,xpNext:nn,level:nl,gold:c.gold+gold};
    });
  };

  const damageBoss=(dmg)=>{
    setBosses(bs=>{
      const idx=bs.findIndex(b=>b.hp>0);
      if(idx===-1)return bs;
      const arr=[...bs];
      const b={...arr[idx],hp:Math.max(0,arr[idx].hp-dmg)};
      if(b.hp===0&&arr[idx].hp>0)setTimeout(()=>{toast(`${b.name} defeated! +${b.xp}XP +${b.gold}G`,'level');gainReward(b.xp,b.gold);},400);
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
    if(char.gold<item.cost){toast('Insufficient funds.','err');return;}
    setChar(c=>{
      const u={gold:c.gold-item.cost};
      if(item.hp)u.hp=Math.min(c.maxHp,c.hp+item.hp);
      if(item.def)u.def=c.def+item.def;
      if(item.isPet)u.pet=item;
      if(item.maxHpBoost){u.maxHp=c.maxHp+item.maxHpBoost;u.hp=Math.min(c.maxHp+item.maxHpBoost,c.hp+item.maxHpBoost);}
      if(item.isCrown)u.crown=item;
      return{...c,...u};
    });
    if(item.def||item.isCrown)setOwnedItemIds(ids=>[...ids,item.id]);
    if(item.xp)gainReward(item.xp,0);
    toast(`Acquired: ${item.name}!`);
  };

  const switchTheme=(id)=>{setThemeId(id);setLandmarkIdx(0);setShopCat('weapons');};

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
    }else{setCheatMsg('ACCESS DENIED.');setTimeout(()=>setCheatMsg(''),2000);}
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
    physical:   tasks.length        ? Math.round(tasks.filter(t=>t.done).length/tasks.length*100)                    : 0,
    discipline: habits.length       ? Math.round(habits.filter(h=>h.done).length/habits.length*100)                  : 0,
    mental:     allFocusTasks.length? Math.round(allFocusTasks.filter(t=>t.done).length/allFocusTasks.length*100)    : 0,
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
    {id:'challenges',label:'Villains',icon:'⚡'},
    {id:'profile',   label:'Profile', icon:'☆'},
    ...(prestigeUnlocked?[{id:'vault',label:'Vault',icon:'✦'}]:[]),
  ];

  // ── Retro style helpers ──
  const FONT = T.font;
  const card  = (x={})=>({background:T.card,border:`1px solid ${T.border}`,borderRadius:6,padding:14,marginBottom:10,...x});
  const inp   = {width:'100%',background:T.surface,border:`1px solid ${T.border}`,borderRadius:4,padding:'8px 12px',color:T.text,fontSize:13,boxSizing:'border-box',outline:'none',fontFamily:FONT};
  const sel   = {background:T.surface,border:`1px solid ${T.border}`,borderRadius:4,padding:'7px 10px',color:T.text,fontSize:12,outline:'none',fontFamily:FONT};
  const btnP  = {background:T.accent,border:'none',color:'#000',padding:'8px 18px',borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:800,fontFamily:FONT,letterSpacing:.5,boxShadow:`0 2px 12px ${T.accent}55`};
  const btnG  = {background:T.surface,border:`1px solid ${T.border}`,color:T.textSub,padding:'7px 14px',borderRadius:4,cursor:'pointer',fontSize:12,fontFamily:FONT};
  const h1    = {fontSize:24,fontWeight:900,color:T.text,marginBottom:4,fontFamily:FONT,letterSpacing:1};
  const h2    = {fontSize:14,fontWeight:700,color:T.text,marginBottom:12,fontFamily:FONT,letterSpacing:.5};
  const taskRowProps = {T,themeId,editingTask,editForm,setEditForm,setEditingTask,saveTask,completeTask,setTasks,startEdit,inp,sel,btnP,btnG,card};

  return (
    <div style={{fontFamily:FONT,background:T.bg,color:T.text,minHeight:'100vh',display:'flex',flexDirection:'column',position:'relative'}}>
      <GlobalStyles/>
      {/* Scanline overlay */}
      <div className="scanlines" style={{position:'fixed',inset:0,zIndex:9998,pointerEvents:'none',opacity:.6}}/>

      {/* Toast */}
      {notif&&(
        <div className="pq-pop" style={{position:'fixed',top:14,right:14,zIndex:10000,
          background:notif.type==='err'?'#200000':notif.type==='level'?T.card:'#001a00',
          border:`1px solid ${notif.type==='err'?'#cc2200':notif.type==='level'?T.accent:'#22cc44'}`,
          color:T.text,padding:'10px 18px',borderRadius:6,boxShadow:'0 6px 28px rgba(0,0,0,.9)',maxWidth:320,fontSize:12,lineHeight:1.5,fontFamily:FONT}}>
          {notif.msg}
        </div>
      )}

      {/* Settings Modal */}
      {showSettings&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.92)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setShowSettings(false)}>
          <div className="pq-pop" style={{...card(),maxWidth:460,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,.95)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <div style={h2}>[ SHADER SELECT ]</div>
              <button onClick={()=>setShowSettings(false)} style={{background:'none',border:'none',color:T.textSub,cursor:'pointer',fontSize:20}}>✕</button>
            </div>
            <p style={{color:T.textSub,fontSize:11,marginBottom:16,fontFamily:FONT}}>Switch city. Transforms atmosphere, logos, weapons, villains & pets.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {Object.values(THEMES).map(th=>{
                const active=themeId===th.id;
                return(
                  <button key={th.id} onClick={()=>switchTheme(th.id)} className="pq-hover"
                    style={{background:active?th.accent+'18':th.surface,border:`2px solid ${active?th.accent:th.border}`,borderRadius:6,padding:16,cursor:'pointer',textAlign:'left',boxShadow:active?`0 0 18px ${th.accent}44`:'none'}}>
                    <div style={{marginBottom:10}}>
                      {th.id==='batman'?<EmojiToken color={th.accent} size={40}/>:<SpiderToken color={th.accent} size={40}/>}
                    </div>
                    <div style={{fontSize:13,fontWeight:800,color:th.accent,marginBottom:2,fontFamily:FONT}}>{th.name}</div>
                    <div style={{fontSize:10,color:th.textSub,marginBottom:6,fontFamily:FONT}}>{th.city}</div>
                    <div style={{display:'flex',gap:5,marginBottom:6}}>
                      {[th.accent,th.accent2,'#555'].map(c=><span key={c} style={{display:'inline-block',width:10,height:10,borderRadius:2,background:c}}/>)}
                    </div>
                    {active&&<div style={{fontSize:10,fontWeight:800,color:th.accent,fontFamily:FONT}}>▶ ACTIVE</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'8px 16px',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',boxShadow:'0 2px 16px rgba(0,0,0,.7)'}}>
        <button onClick={()=>setSideOpen(o=>!o)} style={{background:'none',border:'none',color:T.textSub,cursor:'pointer',fontSize:16,padding:0,fontFamily:FONT}}>☰</button>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {themeId==='batman'?<EmojiToken color={T.accent} size={24}/>:<SpiderToken color={T.accent} size={24}/>}
          <span className="retro-flicker" style={{fontSize:14,fontWeight:900,color:T.accent,letterSpacing:2,fontFamily:FONT}}>PRODUCTIQUEST</span>
        </div>
        {titleBadge&&<span style={{fontSize:9,fontWeight:800,padding:'2px 8px',borderRadius:3,background:titleBadge.bg,border:`1px solid ${titleBadge.border}`,color:titleBadge.color,fontFamily:FONT,letterSpacing:1}}>{titleBadge.label}</span>}
        <div style={{flex:1}}/>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{display:'flex',flexDirection:'column',gap:3,minWidth:130}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:10,color:T.accent,fontWeight:700,width:48,fontFamily:FONT}}>{isMax?'MAX':('LV.'+char.level)}</span>
              <ProgressBar val={char.xp} max={char.xpNext} color={T.xpColor}/>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:10,color:'#ef4444',fontWeight:700,width:48,fontFamily:FONT}}>{char.hp}/{char.maxHp}</span>
              <ProgressBar val={char.hp} max={char.maxHp} color={T.hpColor}/>
            </div>
          </div>
          <span style={{color:'#f59e0b',fontWeight:700,fontSize:12,fontFamily:FONT}}>🪙{char.gold.toLocaleString()}</span>
          <span style={{color:T.accent2,fontSize:11,fontFamily:FONT}}>🛡{char.def}</span>
          {char.pet&&<span style={{fontSize:10,padding:'2px 7px',background:T.muted,borderRadius:3,color:T.textSub,fontFamily:FONT,border:`1px solid ${T.border}`}}>{char.pet.name}</span>}
          <button onClick={()=>setShowSettings(true)} className="pq-btn" style={{...btnG,fontSize:11,padding:'5px 10px'}}>⚙</button>
        </div>
      </div>

      {/* Body */}
      <div style={{display:'flex',flex:1,overflow:'hidden',minHeight:0}}>

        {/* Sidebar */}
        {sideOpen&&(
          <div style={{width:148,background:T.surface,borderRight:`1px solid ${T.border}`,padding:'8px 0',display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
            {navItems.map(n=>(
              <button key={n.id} onClick={()=>setTab(n.id)} className="pq-hover"
                style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',background:tab===n.id?T.accent+'18':'transparent',
                  border:'none',borderLeft:`2px solid ${tab===n.id?T.accent:'transparent'}`,
                  color:tab===n.id?T.accent:T.textSub,cursor:'pointer',fontSize:11,fontWeight:tab===n.id?700:400,
                  textAlign:'left',width:'100%',fontFamily:FONT}}>
                <span style={{fontSize:12}}>{n.icon}</span>{n.label}
              </button>
            ))}
            <div style={{flex:1}}/>
            {/* Landmark */}
            <div style={{margin:'6px 8px',padding:10,background:T.card,borderRadius:4,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:8,color:T.textSub,letterSpacing:'2px',marginBottom:4,fontFamily:FONT}}>📍 {T.city.toUpperCase()}</div>
              <div style={{fontSize:10,fontWeight:700,color:T.accent,marginBottom:2,fontFamily:FONT}}>{landmark.name}</div>
              <div style={{fontSize:9,color:T.textSub,lineHeight:1.4,marginBottom:6,fontFamily:FONT}}>{landmark.desc}</div>
              <button onClick={()=>setLandmarkIdx(i=>(i+1)%T.landmarks.length)} style={{...btnG,fontSize:9,padding:'3px 0',width:'100%',textAlign:'center',borderRadius:3}}>next →</button>
            </div>
            {/* Cheat */}
            <div style={{padding:'6px 10px',borderTop:`1px solid ${T.border}`}}>
              <button onClick={()=>setShowCheat(v=>!v)} style={{background:'none',border:'none',color:T.border,cursor:'pointer',fontSize:9,fontFamily:FONT}}>🔑 {showCheat?'hide':'enter code'}</button>
              {showCheat&&(
                <div style={{marginTop:5}}>
                  <input value={cheatInput} onChange={e=>setCheatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submitCheat()} placeholder="code..." style={{...inp,fontSize:10,padding:'5px 7px',marginBottom:4,letterSpacing:'2px'}}/>
                  {cheatMsg&&<div style={{fontSize:9,color:'#ff4444',marginBottom:3,fontFamily:FONT}}>{cheatMsg}</div>}
                  <button onClick={submitCheat} className="pq-btn" style={{...btnP,fontSize:10,padding:'5px 0',width:'100%',display:'block',textAlign:'center'}}>Unlock</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{flex:1,overflowY:'auto',backgroundImage:`radial-gradient(ellipse at 50% 20%, ${landmark.tint} 0%, transparent 60%)`}}>

          {/* HOME */}
          {tab==='home'&&(
            <div style={{padding:18}}>
              <div style={{...h1}}>// PROGRESS</div>
              <div style={{fontSize:11,color:T.textSub,marginBottom:18,fontFamily:FONT}}>{T.city} · {rank.label} · {rank.sub[themeId]} · LV.{char.level}</div>
              <div style={{display:'flex',justifyContent:'center',marginBottom:14}}>
                <HexRadar data={radarData} T={T} size={260}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:8,marginBottom:14}}>
                {ATTRS.map(attr=>(
                  <div key={attr.key} className="pq-hover" style={{...card({marginBottom:0,display:'flex',alignItems:'center',gap:10,borderColor:attr.color+'33'})}}>
                    <TaskToken themeId={themeId} color={attr.color} size={22}/>
                    <div>
                      <div style={{fontSize:20,fontWeight:800,color:'white',lineHeight:1,fontFamily:FONT}}>{radarData[attr.key]}</div>
                      <div style={{fontSize:10,color:attr.color,fontWeight:700,marginTop:2,fontFamily:FONT}}>{attr.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              {activeBoss&&(
                <div style={{...card({borderColor:'#ef444433',background:'#150806'})}}>
                  <div style={{fontSize:10,color:'#ef4444',fontWeight:700,marginBottom:3,fontFamily:FONT,letterSpacing:1}}>⚡ ACTIVE VILLAIN — {activeBoss.sin.toUpperCase()}</div>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:6,fontFamily:FONT}}>{activeBoss.name}</div>
                  <ProgressBar val={activeBoss.hp} max={activeBoss.maxHp} color='#ef4444' h={8}/>
                  <div style={{fontSize:10,color:T.textSub,marginTop:3,fontFamily:FONT}}>{activeBoss.hp}/{activeBoss.maxHp} HP · Complete tasks to deal damage</div>
                </div>
              )}
            </div>
          )}

          {/* DAILY */}
          {tab==='daily'&&(
            <div style={{padding:18}}>
              <div style={{textAlign:'center',marginBottom:20}}>
                <div style={{fontSize:10,color:T.textSub,fontWeight:700,letterSpacing:'3px',marginBottom:3,fontFamily:FONT}}>// TODAY</div>
                <div style={{fontSize:48,fontWeight:900,lineHeight:1,fontFamily:FONT}}>Day 1</div>
                <div style={{fontSize:11,color:T.textSub,marginTop:4,fontFamily:FONT}}>{T.city} Operations</div>
              </div>
              <div style={{display:'flex',gap:6,marginBottom:18,overflowX:'auto',paddingBottom:4}}>
                {['Week 1','Week 2','Week 3','Week 4'].map((w,i)=>(
                  <button key={w} style={{...btnG,borderRadius:3,whiteSpace:'nowrap',background:i===0?T.accent:'transparent',color:i===0?'#000':T.textSub,border:`1px solid ${i===0?T.accent:T.border}`,fontWeight:i===0?800:400,fontSize:11,padding:'5px 14px'}}>{w}</button>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:12,color:T.textSub,fontFamily:FONT}}>{tasks.filter(t=>!t.done).length} remaining / {tasks.length}</div>
                <button onClick={()=>setShowAddTask(true)} className="pq-btn" style={btnP}>+ Add</button>
              </div>
              {showAddTask&&(
                <div className="pq-slide" style={card({borderColor:T.accent,marginBottom:12})}>
                  <input value={tForm.title} onChange={e=>setTForm(f=>({...f,title:e.target.value}))} placeholder="Task title..." style={{...inp,marginBottom:8}}/>
                  <FormRow>
                    <select value={tForm.diff} onChange={e=>setTForm(f=>({...f,diff:e.target.value}))} style={sel}>
                      <option value="easy">Easy (+10 XP)</option><option value="medium">Medium (+25 XP)</option><option value="hard">Hard (+50 XP)</option>
                    </select>
                    <input value={tForm.cat} onChange={e=>{const v=e.target.value;setTForm(f=>({...f,cat:v}));}} onFocus={e=>e.target.select()} placeholder="Category" style={{...sel,flex:1,minWidth:80}}/>
                  </FormRow>
                  <div style={{display:'flex',gap:7}}><button onClick={submitTask} className="pq-btn" style={btnP}>Add</button><button onClick={()=>setShowAddTask(false)} style={btnG}>Cancel</button></div>
                </div>
              )}
              {tasks.length===0&&!showAddTask&&<div style={{...card({textAlign:'center',padding:40}),color:T.textSub,fontFamily:FONT,fontSize:12}}>[ No tasks. Tap + Add to begin. ]</div>}
              {tasks.map(t=><TaskRow key={t.id} t={t} {...taskRowProps}/>)}
            </div>
          )}

          {/* FOCUS */}
          {tab==='focus'&&(
            <div style={{padding:18}}>
              <div style={h1}>// FOCUS</div>
              <p style={{color:T.textSub,fontSize:11,marginBottom:16,fontFamily:FONT}}>Pinned priorities. Tap ◎ in Daily to pin tasks here.</p>
              {focusTasks.length===0?<div style={{...card({textAlign:'center',padding:40}),color:T.textSub,fontFamily:FONT,fontSize:12}}>[ No pinned tasks. Go to Daily → tap ◎ ]</div>:focusTasks.map(t=><TaskRow key={t.id} t={t} {...taskRowProps}/>)}
            </div>
          )}

          {/* HABITS */}
          {tab==='habits'&&(
            <div style={{padding:18}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={h1}>// HABITS</div>
                <button onClick={()=>setShowAddHabit(true)} className="pq-btn" style={btnP}>+ Add</button>
              </div>
              {showAddHabit&&(
                <div className="pq-slide" style={card({borderColor:T.accent,marginBottom:12})}>
                  <input value={hForm} onChange={e=>setHForm(e.target.value)} placeholder="Habit name..." style={{...inp,marginBottom:8}}/>
                  <div style={{display:'flex',gap:7}}><button onClick={submitHabit} className="pq-btn" style={btnP}>Add</button><button onClick={()=>setShowAddHabit(false)} style={btnG}>Cancel</button></div>
                </div>
              )}
              {habits.length===0&&!showAddHabit&&<div style={{...card({textAlign:'center',padding:40}),color:T.textSub,fontFamily:FONT,fontSize:12}}>[ No habits yet. Build your streak! ]</div>}
              {habits.map(h=>{
                const color=CAT_COLOR(h.cat);
                if(editingHabit===h.id)return(
                  <div key={h.id} className="pq-slide" style={card({borderColor:T.accent})}>
                    <div style={{fontSize:11,fontWeight:700,color:T.accent,marginBottom:8,fontFamily:FONT}}>// EDIT HABIT</div>
                    <input value={hEditForm} onChange={e=>setHEditForm(e.target.value)} onFocus={e=>e.target.select()} placeholder="Habit name" style={{...inp,marginBottom:8}}/>
                    <div style={{display:'flex',gap:7}}><button onClick={saveHabit} className="pq-btn" style={btnP}>Save</button><button onClick={()=>setEditingHabit(null)} style={btnG}>Cancel</button></div>
                  </div>
                );
                return(
                  <div key={h.id} className="pq-hover" style={card({display:'flex',alignItems:'center',gap:12,borderColor:color+'44',boxShadow:`inset 2px 0 0 ${color}`,paddingLeft:16})}>
                    <TaskToken themeId={themeId} color={h.done?'#22cc44':color} size={22}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13,fontFamily:FONT}}>{h.title}</div>
                      <div style={{fontSize:10,color:T.textSub,marginTop:2,fontFamily:FONT}}>Streak: {h.streak} days · Bonus: +{Math.min(h.streak,10)*2} XP</div>
                    </div>
                    <div style={{display:'flex',gap:5,alignItems:'center',flexShrink:0}}>
                      <div style={{background:'#1a0800',border:'1px solid #f9731633',borderRadius:3,padding:'3px 8px',color:'#f97316',fontSize:11,fontWeight:700,fontFamily:FONT}}>🔥{h.streak}</div>
                      <button onClick={()=>startEditHabit(h)} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:4,padding:'3px 7px',cursor:'pointer',color:T.accent,fontSize:11}}>✏</button>
                      <button onClick={()=>completeHabit(h.id)} className="pq-btn" style={{background:h.done?'#1a3a1a':color+'22',border:`1px solid ${h.done?'#22cc44':color}`,borderRadius:4,padding:'4px 10px',cursor:'pointer',color:h.done?'#22cc44':color,fontSize:12,fontWeight:700,boxShadow:'none',fontFamily:FONT}}>{h.done?'[✓]':'[›]'}</button>
                      <button onClick={()=>setHabits(hs=>hs.filter(x=>x.id!==h.id))} style={{background:'none',border:'none',color:'#661100',cursor:'pointer',fontSize:13}}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* NOTES */}
          {tab==='notes'&&(
            <div style={{padding:18}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={h1}>// NOTES</div>
                <button onClick={()=>{setNForm({title:'',body:''});setNoteMode('add');}} className="pq-btn" style={btnP}>+ New</button>
              </div>
              {noteMode!==null&&(
                <div className="pq-slide" style={card({borderColor:T.accent,marginBottom:12})}>
                  <input value={nForm.title} onChange={e=>setNForm(f=>({...f,title:e.target.value}))} placeholder="Title..." style={{...inp,marginBottom:8}}/>
                  <textarea value={nForm.body} onChange={e=>setNForm(f=>({...f,body:e.target.value}))} placeholder="Write your note..." rows={4} style={{...inp,marginBottom:8,resize:'vertical',lineHeight:1.6}}/>
                  <div style={{display:'flex',gap:7}}><button onClick={submitNote} className="pq-btn" style={btnP}>{noteMode==='add'?'Save':'Update'}</button><button onClick={()=>setNoteMode(null)} style={btnG}>Cancel</button></div>
                </div>
              )}
              {notes.length===0&&!noteMode&&<div style={{...card({textAlign:'center',padding:40}),color:T.textSub,fontFamily:FONT,fontSize:12}}>[ No notes yet. Start logging your thoughts. ]</div>}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:10}}>
                {notes.map(n=>(
                  <div key={n.id} className="pq-hover" style={card({marginBottom:0})}>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:5,fontFamily:FONT}}>{n.title}</div>
                    <div style={{color:T.textSub,fontSize:12,marginBottom:10,lineHeight:1.5,fontFamily:FONT}}>{n.body.slice(0,100)}{n.body.length>100?'…':''}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:10,color:T.muted,fontFamily:FONT}}>{n.ts}</span>
                      <div style={{display:'flex',gap:5}}>
                        <button onClick={()=>{setNForm({title:n.title,body:n.body});setNoteMode(n.id);}} style={{background:'transparent',border:`1px solid ${T.border}`,borderRadius:4,padding:'2px 8px',cursor:'pointer',color:T.accent,fontSize:11,fontFamily:FONT}}>Edit</button>
                        <button onClick={()=>setNotes(ns=>ns.filter(x=>x.id!==n.id))} style={{background:'none',border:'none',color:'#661100',cursor:'pointer',fontSize:13}}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHOP */}
          {tab==='shop'&&(
            <div style={{padding:18}}>
              <div style={h1}>// SHOP</div>
              <p style={{color:T.textSub,fontSize:11,marginBottom:14,fontFamily:FONT}}>Balance: <strong style={{color:'#f59e0b'}}>🪙 {char.gold.toLocaleString()} Gold</strong></p>
              <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
                {[['weapons',themeId==='batman'?'⚔ Arsenal':'🕸 Arsenal'],['consumables','🧪 Consumables'],['companions','🐾 Pets']].map(([cat,lbl])=>(
                  <button key={cat} onClick={()=>setShopCat(cat)} className="pq-btn" style={shopCat===cat?{...btnP,fontSize:12}:{...btnG,fontSize:12}}>{lbl}</button>
                ))}
              </div>

              {shopCat==='weapons'&&(
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10}}>
                  {weapons.map(item=>{
                    const owned=ownedItemIds.includes(item.id),ok=char.gold>=item.cost;
                    return(
                      <div key={item.id} className="pq-hover" style={card({marginBottom:0,borderColor:owned?item.color+'66':T.border,background:owned?item.color+'0a':T.card})}>
                        <div style={{display:'flex',justifyContent:'center',margin:'6px auto 8px'}}>
                          <TaskToken themeId={themeId} color={owned?item.color:T.textSub} size={26}/>
                        </div>
                        <div style={{fontWeight:700,fontSize:12,marginBottom:2,color:owned?item.color:T.text,fontFamily:FONT}}>{item.name}</div>
                        <div style={{fontSize:10,color:T.textSub,marginBottom:4,fontFamily:FONT}}>{item.desc}</div>
                        <div style={{fontSize:10,color:item.color,fontWeight:700,marginBottom:10,fontFamily:FONT}}>+{item.def} DEF</div>
                        {owned
                          ?<div style={{color:'#22cc44',fontSize:10,fontWeight:700,textAlign:'center',fontFamily:FONT}}>[✓ Equipped]</div>
                          :<button onClick={()=>buyItem(item)} className="pq-btn" style={{...ok?{...btnP,background:item.color}:btnG,fontSize:10,width:'100%',opacity:ok?1:.5,cursor:ok?'pointer':'not-allowed',borderRadius:3,padding:'6px 0'}}>
                            🪙 {item.cost.toLocaleString()}
                          </button>
                        }
                      </div>
                    );
                  })}
                </div>
              )}

              {shopCat==='consumables'&&(
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10}}>
                  {SHOP_CONSUMABLES.map(item=>{
                    const ok=char.gold>=item.cost;
                    return(
                      <div key={item.id} className="pq-hover" style={card({marginBottom:0,textAlign:'center'})}>
                        <div style={{display:'flex',justifyContent:'center',margin:'6px auto 10px'}}>
                          <TaskToken themeId={themeId} color={item.color} size={26}/>
                        </div>
                        <div style={{fontWeight:700,fontSize:13,marginBottom:2,fontFamily:FONT}}>{item.name}</div>
                        <div style={{fontSize:11,color:T.textSub,marginBottom:12,fontFamily:FONT}}>{item.desc}</div>
                        <button onClick={()=>buyItem(item)} className="pq-btn" style={{...ok?btnP:btnG,fontSize:11,width:'100%',opacity:ok?1:.5,cursor:ok?'pointer':'not-allowed',borderRadius:3}}>🪙 {item.cost}</button>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopCat==='companions'&&(
                <>
                  <div style={{fontSize:11,color:T.textSub,marginBottom:12,fontFamily:FONT}}>
                    {themeId==='batman'?'Batman\'s legendary animal companions':'Spider-Man\'s unique creature companions'}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10}}>
                    {pets.map(item=>{
                      const active=char.pet?.id===item.id,ok=char.gold>=item.cost;
                      return(
                        <div key={item.id} className="pq-hover" style={card({marginBottom:0,textAlign:'center',borderColor:active?item.color+'66':T.border,background:active?item.color+'0a':T.card})}>
                          <div style={{display:'flex',justifyContent:'center',margin:'6px auto 10px'}}>
                            <TaskToken themeId={themeId} color={active?item.color:T.textSub} size={26}/>
                          </div>
                          <div style={{fontWeight:700,fontSize:13,marginBottom:2,color:active?item.color:T.text,fontFamily:FONT}}>{item.name}</div>
                          <div style={{fontSize:11,color:T.textSub,marginBottom:12,fontFamily:FONT}}>{item.desc}</div>
                          {active
                            ?<div style={{color:'#22cc44',fontSize:11,fontWeight:700,fontFamily:FONT}}>[✓ Active]</div>
                            :<button onClick={()=>buyItem(item)} className="pq-btn" style={{...ok?btnP:btnG,fontSize:11,width:'100%',opacity:ok?1:.5,cursor:ok?'pointer':'not-allowed',borderRadius:3}}>🪙 {item.cost}</button>
                          }
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* VILLAINS */}
          {tab==='challenges'&&(
            <div style={{padding:18}}>
              <div style={h1}>// VILLAINS</div>
              <p style={{color:T.textSub,fontSize:11,marginBottom:18,fontFamily:FONT}}>Seven deadly sins. Each villain has 100 HP. Complete tasks to deal damage.</p>
              {bosses.map((b,i)=>{
                const isActive=i===activeBossIdx,isDefeated=b.hp===0,isLocked=!isDefeated&&!isActive;
                const sinColor=SIN_COLOR[b.sin]||b.color;
                return(
                  <div key={b.id} className="pq-hover" style={card({borderColor:isDefeated?'#22cc4433':isActive?b.color+'55':T.border,opacity:isLocked?.3:1,marginBottom:12})}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                          <span style={{fontSize:9,color:sinColor,fontWeight:700,fontFamily:FONT,letterSpacing:1,background:sinColor+'18',border:`1px solid ${sinColor}44`,padding:'1px 6px',borderRadius:2}}>
                            {b.sin.toUpperCase()}
                          </span>
                          <span style={{fontSize:9,color:isDefeated?'#22cc44':isActive?b.color:T.textSub,fontWeight:700,fontFamily:FONT}}>
                            {isDefeated?'✓ DEFEATED':isLocked?'🔒 LOCKED':'⚡ ACTIVE'}
                          </span>
                        </div>
                        <div style={{fontWeight:800,fontSize:15,color:isDefeated?'#22cc44':isActive?b.color:T.textSub,fontFamily:FONT}}>{b.name}</div>
                        <div style={{fontSize:11,color:T.textSub,marginTop:2,fontFamily:FONT,fontStyle:'italic'}}>{b.desc}</div>
                        {isLocked&&<div style={{fontSize:10,color:T.muted,marginTop:3,fontFamily:FONT}}>Defeat previous villain to unlock.</div>}
                      </div>
                      <div style={{textAlign:'right',flexShrink:0,marginLeft:12,fontFamily:FONT}}>
                        <div style={{color:'#f59e0b',fontWeight:700,fontSize:12}}>🪙{b.gold}</div>
                        <div style={{color:T.accent,fontWeight:700,fontSize:12}}>+{b.xp}XP</div>
                      </div>
                    </div>
                    <ProgressBar val={b.hp} max={b.maxHp} color={isDefeated?'#22cc44':b.color} h={8}/>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:5,fontSize:10,color:T.textSub,fontFamily:FONT}}>
                      <span>{isDefeated?'Eliminated.':isActive?'Easy -5 · Med -15 · Hard -30 · Habit -10':''}</span>
                      <span>{b.hp}/{b.maxHp} HP</span>
                    </div>
                  </div>
                );
              })}
              {activeBossIdx===-1&&<div style={{...card({textAlign:'center',padding:40}),color:'#22cc44',fontWeight:700,fontSize:14,fontFamily:FONT}}>[All villains defeated! {T.city} is secure. 🏆]</div>}
            </div>
          )}

          {/* PROFILE */}
          {tab==='profile'&&(
            <div style={{padding:18}}>
              <div style={h1}>// PROFILE</div>
              <div style={{textAlign:'center',marginBottom:24}}>
                <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:90,height:90,borderRadius:6,background:T.accent+'12',border:`1px solid ${T.accent}44`,marginBottom:12,boxShadow:`0 0 24px ${T.accent}22`}}>
                  {themeId==='batman'?<EmojiToken color={T.accent} size={58}/>:<SpiderToken color={T.accent} size={56}/>}
                </div>
                <div style={{fontSize:20,fontWeight:900,marginBottom:3,fontFamily:FONT}}>Hero</div>
                <div style={{fontSize:11,color:T.textSub,marginBottom:3,fontFamily:FONT}}>{rank.label} · {rank.sub[themeId]}</div>
                <div style={{fontSize:10,color:T.muted,marginBottom:12,fontFamily:FONT}}>@productiquest · {T.city}</div>
                <button className="pq-btn pq-pulse" style={{...btnP,padding:'8px 24px',borderRadius:4,letterSpacing:1,fontSize:11}} onClick={()=>setTab('home')}>
                  VIEW PROGRESS CARD
                </button>
              </div>

              {/* Rank progress */}
              <div style={card({marginBottom:12})}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <div style={h2}>Rank Progress</div>
                  <div style={{fontSize:11,color:T.textSub,fontFamily:FONT}}>LV.{char.level}</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:5,overflowX:'auto',paddingBottom:6}}>
                  {RANKS.map(r=>{
                    const isActive=rank.label===r.label,isPast=char.level>=r.min;
                    return(
                      <div key={r.label} style={{textAlign:'center',flex:1,minWidth:46,opacity:(!isPast&&!isActive)?.2:1}}>
                        <div style={{position:'relative',width:46,height:54,margin:'0 auto 4px'}}>
                          <svg viewBox="0 0 52 60" width={46} height={54} style={{position:'absolute',top:0,left:0}}>
                            <path d="M26,2 L48,12 L48,36 Q48,52 26,60 Q4,52 4,36 L4,12 Z"
                              fill={isPast||isActive?r.color+'18':'#0a0a0a'}
                              stroke={isPast||isActive?r.color:'#222'}
                              strokeWidth={isActive?2:1}
                              strokeDasharray={isPast||isActive?'none':'4 3'}
                              style={isActive?{filter:`drop-shadow(0 0 6px ${r.color})`}:{}}/>
                          </svg>
                          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>
                            {isPast||isActive
                              ?(themeId==='batman'?<BatRankIcon color={r.color} size={24}/>:<SpiderRankIcon color={r.color} size={22}/>)
                              :<span style={{fontSize:12,color:'#2a2a2a'}}>?</span>
                            }
                          </div>
                        </div>
                        <div style={{fontSize:7,color:isPast||isActive?r.color:'#2a2a2a',fontWeight:700,fontFamily:FONT}}>{r.label}</div>
                        {isActive&&<div style={{fontSize:6,color:T.textSub,marginTop:1,fontFamily:FONT}}>NOW</div>}
                      </div>
                    );
                  })}
                </div>
                {nextRank&&(
                  <div style={{marginTop:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:11,fontFamily:FONT}}>
                      <span style={{color:rank.color,fontWeight:700}}>{rank.label}</span>
                      <span style={{color:T.textSub}}>{nextRank.min-char.level} levels to {nextRank.label}</span>
                    </div>
                    <ProgressBar val={char.level-rank.min} max={nextRank.min-rank.min} color={rank.color} h={5}/>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div style={card()}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <div style={h2}>Achievements</div>
                  <div style={{fontSize:11,color:T.textSub,fontFamily:FONT}}>{unlockedAchvs.size}/{ACHV_DEFS.length}</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(68px,1fr))',gap:12}}>
                  {ACHV_DEFS.map(a=><AchievementCard key={a.id} def={a} unlocked={unlockedAchvs.has(a.id)}/>)}
                </div>
              </div>
            </div>
          )}

          {/* VAULT */}
          {tab==='vault'&&prestigeUnlocked&&(
            <div style={{padding:18}}>
              <div style={h1}>{T.vaultName.toUpperCase()}</div>
              <div style={card({borderColor:hackerTitle?'#cc2200':T.accent,background:hackerTitle?'#1a0000':T.surface,marginBottom:18})}>
                <div style={{fontSize:12,color:T.textSub,lineHeight:1.8,fontFamily:FONT}}>
                  {hackerTitle
                    ?<><strong style={{color:'#ff4444'}}>GHOST PROTOCOL.</strong> Code <span style={{color:'#ff4444',fontFamily:FONT,letterSpacing:'3px'}}>KLEOS</span> bypassed the grind. Prestige items unlocked early.</>
                    :<><strong style={{color:T.accent}}>{T.champBadge.label}.</strong> Level 100 achieved. These legendary items are yours alone.</>
                  }
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
                {PRESTIGE_ITEMS.map(item=>{
                  const owned=ownedItemIds.includes(item.id)||(item.isPet&&char.pet?.id===item.id)||(item.isCrown&&char.crown?.id===item.id);
                  const active=(item.isPet&&char.pet?.id===item.id)||(item.isCrown&&char.crown?.id===item.id);
                  const ok=char.gold>=item.cost;
                  return(
                    <div key={item.id} className="pq-hover" style={{...card({marginBottom:0,textAlign:'center',borderColor:owned?T.accent:T.accent+'33',background:T.surface}),boxShadow:`0 0 14px ${T.accent}0d`}}>
                      <div style={{fontSize:8,color:T.accent,letterSpacing:'2px',marginTop:3,marginBottom:6,fontFamily:FONT,textTransform:'uppercase'}}>{hackerTitle?'Shadow Access':'Prestige Only'}</div>
                      <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>
                        <TaskToken themeId={themeId} color={item.color||T.accent} size={30}/>
                      </div>
                      <div style={{fontWeight:800,fontSize:13,marginBottom:3,color:T.accent,fontFamily:FONT}}>{item.name}</div>
                      <div style={{fontSize:11,color:T.textSub,marginBottom:14,fontFamily:FONT}}>{item.desc}</div>
                      {active?<div style={{color:T.accent,fontSize:11,fontWeight:700,fontFamily:FONT}}>[✓ Active]</div>
                        :owned&&item.isPet?<button onClick={()=>buyItem(item)} className="pq-btn" style={{...btnG,fontSize:11,width:'100%',borderRadius:3,color:item.color,fontFamily:FONT}}>Equip</button>
                        :owned?<div style={{color:T.accent,fontSize:11,fontWeight:700,fontFamily:FONT}}>[✓ Owned]</div>
                        :<button onClick={()=>buyItem(item)} className="pq-btn" style={{...ok?btnP:btnG,fontSize:11,width:'100%',opacity:ok?1:.5,cursor:ok?'pointer':'not-allowed',borderRadius:3}}>🪙 {item.cost.toLocaleString()}</button>}
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
