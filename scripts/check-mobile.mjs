import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts/mobile', {recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
const errors=[];
try {
for (const width of process.env.MOBILE_WIDTH ? [Number(process.env.MOBILE_WIDTH)] : [320,390,768]) {
 const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true});
 page.on('pageerror',e=>errors.push(e.message));
 for (const route of ['','play/weeding','play/snacks','play/training','play/memory','photo']) {
  await page.goto('http://127.0.0.1:3000/'+route,{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('main').waitFor();
  await page.waitForTimeout(500);
  await page.screenshot({path:`artifacts/mobile/${width}-${route.replaceAll('/','-')||'home'}.png`,fullPage:true});
  const inspect=()=>({overflow:document.documentElement.scrollWidth>innerWidth, elements:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+2||r.left < -2)}).slice(0,8).map(e=>({tag:e.tagName,cls:e.className?.baseVal??e.className}))});
  console.log(width,route||'home',JSON.stringify(await page.evaluate(inspect)));
  if(route.startsWith('play/')) {
   const start = page.getByRole('button',{name:'놀이 시작하기'});
   for (let attempt=0; attempt<5 && await start.isVisible(); attempt++) {
    await start.click();
    await page.waitForTimeout(800);
   }
   await page.getByRole('button',{name:'놀이 시작하기'}).waitFor({state:'hidden'});
   await page.waitForTimeout(250);
   await page.screenshot({path:`artifacts/mobile/${width}-${route.replaceAll('/','-')}-playing.png`,fullPage:true});
   console.log(width,route,'playing',JSON.stringify(await page.evaluate(inspect)));
  }
 }
 await page.close();
}
console.log('Errors:',JSON.stringify(errors));
} finally {await browser.close();}
