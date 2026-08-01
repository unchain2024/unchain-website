import fs from 'node:fs'; import sharp from 'sharp';
// crop.mjs <svg> <x> <y> <w> <h> <scale> <out> [bg]
const [svg,x,y,w,h,scale,out,bg='#ffffff'] = process.argv.slice(2);
const S=Number(scale);
const png = await sharp(fs.readFileSync(svg),{unlimited:true,density:Math.round(72*S)})
  .resize({width:Math.round(1440*S)}).flatten({background:bg}).png().toBuffer();
await sharp(png).extract({left:Math.round(x*S),top:Math.round(y*S),width:Math.round(w*S),height:Math.round(h*S)})
  .png().toFile(out);
console.log('wrote',out);
