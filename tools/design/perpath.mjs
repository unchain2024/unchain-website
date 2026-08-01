import fs from 'node:fs';
const numRe=/-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
function bbox(d){const cmds=d.match(/[a-zA-Z][^a-zA-Z]*/g)||[];let cx=0,cy=0,mnx=1/0,mny=1/0,mxx=-1/0,mxy=-1/0;
for(const c of cmds){const op=c[0];const v=(c.slice(1).match(numRe)||[]).map(Number);const rel=op===op.toLowerCase();
const step={M:2,L:2,C:6,S:4,Q:4,T:2,A:7,H:1,V:1,Z:0}[op.toUpperCase()]??2;if(!step)continue;
for(let i=0;i+step<=v.length;i+=step){const s=v.slice(i,i+step);let pts=[];
const U=op.toUpperCase();
if(U==='H')pts=[[rel?cx+s[0]:s[0],cy]];else if(U==='V')pts=[[cx,rel?cy+s[0]:s[0]]];
else if(U==='A')pts=[[rel?cx+s[5]:s[5],rel?cy+s[6]:s[6]]];
else for(let k=0;k+1<s.length;k+=2)pts.push([rel?cx+s[k]:s[k],rel?cy+s[k+1]:s[k+1]]);
for(const[x,y]of pts){if(x<mnx)mnx=x;if(x>mxx)mxx=x;if(y<mny)mny=y;if(y>mxy)mxy=y;}
if(pts.length){cx=pts[pts.length-1][0];cy=pts[pts.length-1][1];}}}
return[mnx,mny,mxx,mxy];}
const r=n=>Math.round(n*10)/10;
const src=fs.readFileSync(process.argv[2],'utf8').replace(/(xlink:href|href)="data:[^"]*"/g,'$1="X"').replace(/<defs>[\s\S]*?<\/defs>/g,'');
let i=0;
for(const m of src.matchAll(/<path\b[^>]*?\/>/g)){
  const d=(m[0].match(/\sd="([^"]*)"/)||[,''])[1]; if(!d) continue;
  const b=bbox(d); const fill=(m[0].match(/fill="([^"]*)"/)||[,''])[1];
  console.log(`${i++} fill=${fill} box=[${r(b[0])},${r(b[1])} → ${r(b[2])},${r(b[3])}] size=${r(b[2]-b[0])}x${r(b[3]-b[1])}`);
}
