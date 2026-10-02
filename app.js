import {categories, items, equip, score, isComplete} from './game.js';
import {clothingSVG, avatarSVG, portraitSVG} from './art.js?v=shoulders-20261002';
const $=selector=>document.querySelector(selector);
const soundIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 5 9H2v6h3l6 5ZM15 8q4 4 0 8m3-11q7 7 0 14"/></svg>';
const mutedIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 5 9H2v6h3l6 5ZM16 9l6 6m0-6-6 6"/></svg>';
const shirtIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4q-4 5-8 0Z"/></svg>';
const pantsIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l2 18h-6l-2-11-2 11H4ZM6 7h12"/></svg>';
const coatIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 3-4 3-3 12 4 1 2-8v10h10V11l2 8 4-1-3-12-4-3-4 5ZM12 8v13"/></svg>';
let character='boy';
let outfit={}, categoryIndex=0, sound=true, control='drag', message='옷을 끌어 입혀요', mood='neutral', drag=null, completed=false, demoTimer;
try {const prefs=JSON.parse(localStorage.getItem('autumn-preferences')||'{}'); sound=prefs.sound!==false;control=prefs.control==='tap'?'tap':'drag';$('#show-score').checked=prefs.showScore!==false;}catch{}
function savePrefs(){try{localStorage.setItem('autumn-preferences',JSON.stringify({sound,control,showScore:$('#show-score').checked}));}catch{}}
function speak(text){if(!sound||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='ko-KR';utterance.rate=.85;window.speechSynthesis.speak(utterance);}
function feedback(text,icon='↗'){message=text;$('#feedback-text').textContent=text;$('#feedback-icon').textContent=icon;speak(text);}
function updatePrefs(){document.body.classList.toggle('score-hidden',!$('#show-score').checked);$('#sound').innerHTML=sound?soundIcon:mutedIcon;$('#sound').setAttribute('aria-label',sound?'소리 끄기':'소리 켜기');$('#sound').setAttribute('aria-pressed',String(sound));$(`input[name=control][value=${control}]`).checked=true;$('#instruction-hint').textContent=control==='drag'?'캐릭터에게 끌어 주세요':'옷을 눌러 주세요';$('#demo').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></svg> 방법 보기';}
function displayName(item){if(item.id==='jacket')return character==='boy'?'가벼운 니트':'가벼운 집업';if(item.id==='long-shirt')return '긴팔 셔츠';return item.name;}
function render(){
 const category=categories[categoryIndex];
 document.querySelectorAll('[data-character]').forEach(button=>{const id=button.dataset.character;button.innerHTML=portraitSVG(id)+`<span>${id==='boy'?'남자':'여자'}</span>`;button.setAttribute('aria-pressed',String(character===id));});
 $('#avatar').innerHTML=avatarSVG(outfit,items,mood,character);
 $('#score').textContent=score(outfit);
 $('#step-count').textContent=`${categoryIndex+1} / 3`;
 $('#instruction').textContent=`${category.name}을 골라요`;
 document.querySelectorAll('[role=tab]').forEach((tab,i)=>{const selected=i===categoryIndex;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;tab.innerHTML=[shirtIcon,pantsIcon,coatIcon][i]+categories[i].name+(outfit[categories[i].id]?'<span class="tab-done" aria-label="선택함">•</span>':'');});
 $('#clothes').innerHTML=items.filter(item=>item.category===category.id).map(item=>`<button class="clothing-card" data-id="${item.id}" aria-label="${displayName(item)} 입히기" aria-pressed="${outfit[item.category]===item.id}">${outfit[item.category]===item.id?'<span class="wearing-label">입었어요</span>':''}${clothingSVG(item.kind,character)}<span class="item-name">${displayName(item)}</span></button>`).join('');
 $('#next').disabled=!outfit[category.id];
 $('#next').innerHTML=categoryIndex===2?'옷차림 확인 <span aria-hidden="true">✓</span>':'다음 <span aria-hidden="true">→</span>';
 updatePrefs();
}
function selectCategory(index){categoryIndex=index;mood='neutral';render();feedback(`${categories[index].name}을 골라요`);}
function wear(id){const item=items.find(item=>item.id===id);if(!item)return;stopDemo();outfit=equip(outfit,id);mood=item.suitable?'neutral':item.feedback.includes('추워')?'cold':'hot';render();feedback(item.suitable?'좋아요!':item.feedback,item.suitable?'✓':'↔');if(isComplete(outfit)&&!completed){completed=true;$('#complete').showModal();speak('잘했어요! 가을 준비 끝!');}if(!isComplete(outfit))completed=false;}
function reset(){cancelDrag();stopDemo();if($('#complete').open)$('#complete').close();outfit={};categoryIndex=0;mood='neutral';completed=false;render();feedback(control==='drag'?'옷을 끌어 입혀요':'옷을 눌러 입혀요');}
function stopDemo(){clearTimeout(demoTimer);$('.scene-panel').classList.remove('demo-active');}
function showDemo(){stopDemo();void $('.scene-panel').offsetWidth;$('.scene-panel').classList.add('demo-active');feedback(control==='drag'?'옷을 끌어 입혀요':'옷을 눌러 입혀요');demoTimer=setTimeout(stopDemo,4200);}
document.querySelectorAll('[data-character]').forEach(button=>button.onclick=()=>{character=button.dataset.character;reset();});
$('#repeat').innerHTML=soundIcon;
$('#settings-open').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 3 1-1h4l1 3 3 1 3 1-1 4v2l1 4-3 1-3 1-1 3h-4l-1-3-3-1-3-1 1-4v-2L3 7l3-1 3-1Z"/><circle cx="12" cy="12" r="3"/></svg>';
$('#sound').onclick=()=>{sound=!sound;if(!sound&&'speechSynthesis'in window)window.speechSynthesis.cancel();updatePrefs();savePrefs();if(sound)speak(message);};
$('#repeat').onclick=()=>speak(message);
$('#settings-open').onclick=()=>{cancelDrag();$('#settings').showModal();};
$('#settings').addEventListener('change',()=>{control=$('input[name=control]:checked').value;savePrefs();updatePrefs();feedback(control==='drag'?'옷을 끌어 입혀요':'옷을 눌러 입혀요');});
$('#demo').onclick=showDemo;
$('#restart').onclick=reset;$('#again').onclick=reset;$('#look').onclick=()=>$('#complete').close();
$('.tabs').addEventListener('click',event=>{const tab=event.target.closest('[role=tab]');if(tab)selectCategory(categories.findIndex(c=>c.id===tab.dataset.category));});
$('.tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const index=event.key==='Home'?0:event.key==='End'?2:(categoryIndex+(event.key==='ArrowRight'?1:2))%3;selectCategory(index);document.querySelectorAll('[role=tab]')[index].focus();});
$('#next').onclick=()=>{if(categoryIndex<2){selectCategory(categoryIndex+1);return;}if(isComplete(outfit)){$('#complete').showModal();return;}const next=categories.findIndex(c=>!items.find(item=>item.id===outfit[c.id])?.suitable);selectCategory(next);feedback('다른 옷으로 바꿔 볼까요?','↔');};
$('#clothes').addEventListener('click',event=>{const card=event.target.closest('.clothing-card');if(!card)return;if(control==='tap'||event.detail===0)wear(card.dataset.id);});
function inZone(x,y){const rect=$('#drop-zone').getBoundingClientRect();return x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;}
function cancelDrag(){if(!drag)return;const {source,pointerId,ghost}=drag;drag=null;ghost?.remove();source.classList.remove('drag-source');document.body.classList.remove('dragging');$('#drop-zone').classList.remove('over');if(source.hasPointerCapture(pointerId))source.releasePointerCapture(pointerId);}
$('#clothes').addEventListener('pointerdown',event=>{const card=event.target.closest('.clothing-card');if(!card||control!=='drag'||event.button!==0||drag)return;stopDemo();card.setPointerCapture(event.pointerId);drag={id:card.dataset.id,source:card,pointerId:event.pointerId,x:event.clientX,y:event.clientY,ghost:null};});
$('#clothes').addEventListener('pointermove',event=>{if(!drag||drag.pointerId!==event.pointerId)return;const {x,y}=drag;if(!drag.ghost&&Math.hypot(event.clientX-x,event.clientY-y)<7)return;if(!drag.ghost){drag.ghost=document.createElement('div');drag.ghost.className='drag-ghost';drag.ghost.setAttribute('aria-hidden','true');drag.ghost.innerHTML=clothingSVG(items.find(i=>i.id===drag.id).kind,character);document.body.append(drag.ghost);drag.source.classList.add('drag-source');document.body.classList.add('dragging');}drag.ghost.style.left=`${event.clientX}px`;drag.ghost.style.top=`${event.clientY}px`;$('#drop-zone').classList.toggle('over',inZone(event.clientX,event.clientY));});
$('#clothes').addEventListener('pointerup',event=>{if(!drag||drag.pointerId!==event.pointerId)return;const {id,ghost}=drag;const valid=ghost&&inZone(event.clientX,event.clientY);cancelDrag();if(valid)wear(id);else if(ghost)feedback('다시 끌어 볼까요?','↗');});
$('#clothes').addEventListener('pointercancel',cancelDrag);$('#clothes').addEventListener('lostpointercapture',cancelDrag);window.addEventListener('blur',cancelDrag);document.addEventListener('keydown',e=>{if(e.key==='Escape')cancelDrag();});
render();
// Audio starts only after an intentional gesture. The visible demonstration needs no reading.
showDemo();
