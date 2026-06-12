// icons.jsx — lucide-style inline SVG icons. All 1.75 stroke, currentColor.
const Icon = ({ d, size = 18, fill = 'none', strokeWidth = 1.75, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

const Icons = {
  home: (p) => <Icon {...p}><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z"/></Icon>,
  tag:  (p) => <Icon {...p}><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82z"/><circle cx="7.5" cy="7.5" r="1.5"/></Icon>,
  percent: (p) => <Icon {...p}><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></Icon>,
  receipt: (p) => <Icon {...p}><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 2V2"/><path d="M7 7h10M7 11h10M7 15h6"/></Icon>,
  users: (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></Icon>,
  store: (p) => <Icon {...p}><path d="M3 9l1-5h16l1 5"/><path d="M5 9v11h14V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M10 20v-5h4v5"/></Icon>,
  chart: (p) => <Icon {...p}><path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-6"/></Icon>,
  scale: (p) => <Icon {...p}><path d="M12 3v18M5 7h14M6 7l-3 7a4 4 0 0 0 6 0zM18 7l-3 7a4 4 0 0 0 6 0z"/></Icon>,
  cog: (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.27 16.96l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.27l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>,
  shieldlock: (p) => <Icon {...p}><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10 11V9a2 2 0 0 1 4 0v2"/></Icon>,
  clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  search: (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>,
  bell:   (p) => <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></Icon>,
  bank:   (p) => <Icon {...p}><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3 2 9h20z"/></Icon>,
  cmd:    (p) => <Icon {...p}><path d="M15 6V4.5a2.5 2.5 0 1 1 2.5 2.5H15zM9 18v1.5A2.5 2.5 0 1 1 6.5 17H9zM18 9h1.5a2.5 2.5 0 1 1-2.5 2.5V9zM6 15H4.5A2.5 2.5 0 1 1 7 12.5V15zM9 9h6v6H9z"/></Icon>,
  chevron:(p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>,
  chevronR:(p)=> <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>,
  calendar:(p)=> <Icon {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Icon>,
  download:(p)=> <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></Icon>,
  filter: (p) => <Icon {...p}><path d="M22 3H2l8 9.46V19l4 2v-8.54z"/></Icon>,
  x:      (p) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12"/></Icon>,
  copy:   (p) => <Icon {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>,
  check:  (p) => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>,
  alert:  (p) => <Icon {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></Icon>,
  trendup:(p) => <Icon {...p}><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></Icon>,
  trenddn:(p) => <Icon {...p}><path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/></Icon>,
  arrowR: (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>,
  phone:  (p) => <Icon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></Icon>,
  bolt:   (p) => <Icon {...p}><path d="m13 2-9 12h7l-1 8 9-12h-7z"/></Icon>,
  wifi:   (p) => <Icon {...p}><path d="M5 12.55a11 11 0 0 1 14 0M2 8.82a15 15 0 0 1 20 0M8.5 16.43a6 6 0 0 1 7 0"/><circle cx="12" cy="20" r="0.5" fill="currentColor"/></Icon>,
  shield: (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>,
  game:   (p) => <Icon {...p}><path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><rect x="2" y="6" width="20" height="12" rx="6"/></Icon>,
  wallet: (p) => <Icon {...p}><path d="M20 12V8H4v12h16v-4"/><path d="M16 12h4v4h-4z"/></Icon>,
  drop:   (p) => <Icon {...p}><path d="M12 2.5s-6 6-6 11a6 6 0 0 0 12 0c0-5-6-11-6-11z"/></Icon>,
  card:   (p) => <Icon {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></Icon>,
  refresh:(p)=>  <Icon {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></Icon>,
  more:   (p) => <Icon {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></Icon>,
  megaphone: (p) => <Icon {...p}><path d="m3 11 18-5v12L3 13z"/><path d="M11.6 16.8a3 3 0 0 1-5.8-1.4"/></Icon>,
  send:   (p) => <Icon {...p}><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></Icon>,
  help:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.3 2-2.3 3.5"/><path d="M12 17.5h.01"/></Icon>,
  image:  (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></Icon>,
  arrowUp: (p) => <Icon {...p}><path d="M12 19V5M5 12l7-7 7 7"/></Icon>,
  arrowDown: (p) => <Icon {...p}><path d="M12 5v14M19 12l-7 7-7-7"/></Icon>,
};

window.Icons = Icons;
