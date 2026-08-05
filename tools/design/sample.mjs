import fs from 'node:fs'; import sharp from 'sharp';
const PAGE='tools/design/.work/shots/home-full.png';
const pts=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const off=Object.fromEntries(JSON.parse(fs.readFileSync('tools/design/.work/shots/home-measure.json','utf8')).filter(([,b])=>b).map(([n,b])=>[n,Math.round(b.y)]));
const hex=(p)=>'#'+[p[0],p[1],p[2]].map(v=>v.toString(16).padStart(2,'0')).join('');
for(const p of pts){
  const dy=off[p.section];
  const d=await sharp(fs.readFileSync(p.design),{unlimited:true}).resize({width:1440}).flatten({background:'#ffffff'})
    .extract({left:p.x,top:p.y,width:1,height:1}).raw().toBuffer();
  const m=await sharp(PAGE).extract({left:p.x,top:p.y+dy,width:1,height:1}).raw().toBuffer();
  const dd=Math.max(Math.abs(d[0]-m[0]),Math.abs(d[1]-m[1]),Math.abs(d[2]-m[2]));
  console.log(`${p.name.padEnd(22)} design ${hex(d)}  build ${hex(m)}  maxΔ ${dd}`);
}
