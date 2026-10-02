// Original vector paths extracted from licensed macrovector / Freepik EPS files.
// Each character has an independent fit; card and equipped art use the same SVG.
const root='./assets/characters/';
const fits={
 boy:{
  body:['boy-body',190,128,71,271],
  long:['boy-long',191,201,68,89], tank:['boy-tank',202,207,47,71],
  pants:['boy-pants',200,269,49,130], shorts:['boy-shorts',202,267,47,58],
  jacket:['knit',190,207,71,80], puffer:['puffer',189,200,73,86],
 },
 girl:{
  body:['girl-body',194,142,62,256],
  long:['girl-long',194,213,62,74], tank:['girl-tank',202,216,46,67],
  pants:['girl-pants',204,273,42,126], shorts:['girl-shorts',204,272,43,28],
  jacket:['girl-jacket',193,211,65,83], puffer:['puffer',190,209,70,82],
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
 const layers=['bottom','top','outer'].map(category=>{const kind=selected(category);return kind?imageTag(fits[character][kind]):'';}).join('');
 return `<svg viewBox="165 116 120 295" role="img" aria-label="선택한 옷을 입은 ${character==='boy'?'남자':'여자'} 캐릭터"><ellipse cx="225" cy="401" rx="39" ry="5" fill="var(--color-shadow)"/>${imageTag(fits[character].body)}${imageTag(character==='boy'?['boy-shoes',202,390,47,20]:['girl-shoes',206,391,38,20])}${layers}</svg>`;
}
