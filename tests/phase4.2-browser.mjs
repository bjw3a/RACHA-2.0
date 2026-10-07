import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {cardsFor} from '../js/flashcards-data.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!pathname.startsWith('/racha/'))throw Error();const file=path.join(root,pathname.slice(7)||'index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(await readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/racha/`;
const browser=await chromium.launch({headless:true});const errors=[];
const screens=process.env.RACHA_SCREENSHOTS;if(screens)await mkdir(screens,{recursive:true});
try{
 for(const [width,height] of [[320,568],[390,844],[768,1024],[1366,768]])for(const c of [1,2]){
  const page=await browser.newPage({viewport:{width,height}});
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
  await page.goto(url);assert.equal(await page.locator('.curriculum').count(),0);
  if(screens&&c===1)await page.screenshot({path:path.join(screens,`home-${width}.png`),fullPage:true,animations:'disabled'});
  await page.click(`[data-course="${c}"]`);assert(await page.locator('#choose-learn').isVisible());await page.click('#choose-flashcards');
  await page.click('#fc-all');assert.equal(await page.locator('#fc-count').textContent(),`1 / 30`);
  const firstReview=await page.evaluate(()=>{const fronts=[];for(let i=0;i<30;i++){fronts.push(document.querySelector('#fc-text').textContent);document.querySelector('#fc-card').click();document.querySelector(i<2?'#fc-again':'#fc-known').click();}return fronts;});
  assert.equal(await page.locator('#fc-practice').textContent(),'PRACTICE MISSED CARDS');
  assert.equal(await page.locator('#fc-restart').textContent(),'NEW 30-CARD REVIEW');
  assert((await page.locator('.fc-summary').textContent()).includes('28 / 30 known'));
  for(const selector of ['#fc-practice','#fc-restart']){const b=await page.locator(selector).boundingBox();assert(b.x>=0&&b.x+b.width<=width&&b.y+b.height<=height);}
  if(screens)await page.screenshot({path:path.join(screens,`cumulative-results-${c}-${width}.png`),fullPage:true,animations:'disabled'});
  await page.click('#fc-practice');assert.equal(await page.locator('#fc-count').textContent(),'1 / 2');
  for(let i=0;i<2;i++){assert.equal(await page.locator('#fc-text').textContent(),firstReview[i]);await page.click('#fc-card');await page.click('#fc-known');}
  assert.equal(await page.locator('#fc-restart').textContent(),'NEW 30-CARD REVIEW');
  await page.click('#fc-restart');assert.equal(await page.locator('#fc-count').textContent(),'1 / 30');

  await page.click('#fc-back');
  await page.click(`[data-fc-unit="s${c}-u${c===1?2:1}"]`);await page.click('#fc-unit-review');assert(await page.locator('#fc-card').isVisible());await page.click('#fc-back');
  const topic=c===1?'days':'ser';await page.click(`[data-fc-topic="${topic}"]`);
  for(const light of [false,true]){
   if(light)await page.click('#theme');
   for(const selector of ['#fc-card','#fc-known','#fc-again','#fc-shuffle']){
    const b=await page.locator(selector).boundingBox();assert(b.y>=0&&b.y+b.height<=height,`${selector} in viewport ${width} / course ${c}`);assert(b.height>=44);
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#fc-card').focus();await page.keyboard.press('Space');assert.equal(await page.locator('#fc-card').getAttribute('aria-expanded'),'true');
   if(screens)await page.screenshot({path:path.join(screens,`flashcards-${c}-${width}-${light?'light':'dark'}.png`),fullPage:true,animations:'disabled'});
   await page.keyboard.press('Enter');assert.equal(await page.locator('#fc-card').getAttribute('aria-expanded'),'false');
  }
  // Exercise the longest actual prompts/answers with the longest topic heading.
  const overflow=await page.evaluate(cards=>{
   const text=document.querySelector('#fc-text'),heading=document.querySelector('.fc-heading h2');
   const original=text.textContent,oldHeading=heading.textContent;
   heading.textContent='School subjects and vocabulary';
   const failures=[];
   for(const card of cards)for(const value of [card.front,card.back]){
    text.textContent=value;
    const a=text.getBoundingClientRect(),b=document.querySelector('#fc-card').getBoundingClientRect();
    const hint=document.querySelector('#fc-hint').getBoundingClientRect();
    if(a.top<b.top||hint.bottom>b.bottom||a.left<b.left||a.right>b.right||document.querySelector('#fc-again').getBoundingClientRect().bottom>innerHeight)failures.push(value);
   }
   text.textContent=original;heading.textContent=oldHeading;return failures;
  },cardsFor(c));
  assert.deepEqual(overflow,[],`All card content fits at ${width}`);
  const before=await page.evaluate(()=>localStorage.getItem('racha-progress-v1'));
  const total=cardsFor(c,topic).length,missed=[];
  for(let i=0;i<total;i++){
   if(i<2)missed.push(await page.locator('#fc-text').textContent());
   await page.click('#fc-card');await page.click(i<2?'#fc-again':'#fc-known');
   if(i===2)await page.click('#fc-shuffle');
  }
  assert.equal(await page.locator('#fc-practice').textContent(),'PRACTICE MISSED CARDS');assert.equal(await page.locator('#fc-restart').textContent(),'START OVER');assert((await page.locator('.fc-summary').textContent()).includes(`${total-2} / ${total} known`));await page.click('#fc-practice');
  for(const front of missed){assert.equal(await page.locator('#fc-text').textContent(),front);await page.click('#fc-card');await page.click('#fc-known');}
  assert((await page.locator('.fc-summary').textContent()).includes('2 / 2 known'));assert.equal(await page.locator('#fc-practice').count(),0);
  await page.click('#fc-restart');assert.equal(await page.locator('#fc-count').textContent(),`1 / ${total}`);
  assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),before);
  await page.reload();assert(await page.locator('[data-course="1"]').isVisible());assert.equal(await page.evaluate(()=>localStorage.getItem('racha-progress-v1')),before);
  await page.close();
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: Flashcards in Chromium at 320×568, 390×844, 768×1024, 1366×768; both courses and themes, keyboard reveal, above-fold touch controls, no overflow, topics/unit/all review, shuffle, missed-card rounds, refresh and local progress isolation, relative /racha/ deployment paths, no resource or browser errors.');
}finally{await browser.close();server.close();}
