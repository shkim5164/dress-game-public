// Original vector paths extracted from licensed macrovector / Freepik EPS files.
// Each character has an independent fit; card and equipped art use the same SVG.
const root='./assets/characters/';
const fits={
 boy:{
  body:['boy-body',190,128,71,271],
  long:['boy-long',190,198.5,70,91.5], tank:['boy-tank',202,207,47,71],
  pants:['boy-pants',200,265,49,123], shorts:['boy-shorts',201,264,49,60],
  jacket:['knit',189,203.5,73,83.5], puffer:['puffer',189,200,73,86],
 },
 girl:{
  body:['girl-body',194,142,62,256],
  long:['girl-long',193,209.5,64,77.5], tank:['girl-tank',202,216,46,67],
  pants:['girl-pants',202.5,270,45,118], shorts:['girl-shorts',202.5,269,45,32],
  jacket:['girl-jacket',190.5,206,70,89], puffer:['puffer',190,209,70,82],
 },
};
const imageTag=(fit)=>`<image href="${root+fit[0]}.svg" x="${fit[1]}" y="${fit[2]}" width="${fit[3]}" height="${fit[4]}" preserveAspectRatio="none"/>`;
export function clothingSVG(kind,character='boy') {
 const fit=fits[character][kind];
 return `<svg viewBox="0 0 ${fit[3]} ${fit[4]}" aria-hidden="true"><image href="${root+fit[0]}.svg" width="${fit[3]}" height="${fit[4]}" preserveAspectRatio="none"/></svg>`;
}
export function portraitSVG(character){return `<svg viewBox="195 ${character==='boy'?127:140} 60 80" aria-hidden="true">${imageTag(fits[character].body)}</svg>`;}
export function avatarSVG(outfit,items,mood='neutral',character='boy') {
 const selected=category=>items.find(item=>item.id===outfit[category])?.kind;
 const top=selected('top'),bottom=selected('bottom'),outer=selected('outer');
 // The source girl's white vest is a separate vector shape. Hide it only
 // when a top covers the torso, so its straps cannot leak through a new top.
 const body=[...fits[character].body];
 if(character==='girl'&&(top||outer))body[0]='girl-body-dressed';
 const bottomLayer=bottom?imageTag(fits[character][bottom]):'';
 let topLayer=top?imageTag(fits[character][top]):'';
 // Closed outerwear covers the shirt. Only a shirt collar is visible in the
 // boy's V-neck knit; crop to that neckline, not the shirt's full rectangle.
 if(outer)topLayer=character==='boy'&&outer==='jacket'&&top==='long'
  ? `<svg x="211" y="198" width="29" height="32" viewBox="211 198 29 32" overflow="hidden">${topLayer}</svg>`:'';
 const outerLayer=outer?imageTag(fits[character][outer]):'';
 // Fit each shoe to its own ankle instead of stretching a two-shoe sheet.
 const shoeFits=character==='boy'
  ? [['boy-shoe-left',209.5,382.5,12,17],['boy-shoe-right',229,382.5,12,17]]
  : [['girl-shoe-left',212.8,385,11.4,14.5],['girl-shoe-right',226.5,385,11.4,14.5]];
 const shoes=shoeFits.map(imageTag).join('');
 // The foot inside a closed shoe must not peek out alongside its outline.
 const shodBody=`<svg x="165" y="116" width="120" height="273" viewBox="165 116 120 273" overflow="hidden">${imageTag(body)}</svg>`;
 return `<svg viewBox="165 116 120 295" role="img" aria-label="선택한 옷을 입은 ${character==='boy'?'남자':'여자'} 캐릭터"><ellipse cx="225" cy="401" rx="39" ry="5" fill="var(--color-shadow)"/>${shodBody}${shoes}${bottomLayer}${topLayer}${outerLayer}</svg>`;
}
