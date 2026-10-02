export const categories = [
 { id: 'top', name: '윗옷', points: 40 },
 { id: 'bottom', name: '아랫옷', points: 30 },
 { id: 'outer', name: '겉옷', points: 30 },
];
export const items = [
 {id:'long-shirt', category:'top', name:'긴팔 티셔츠', suitable:true, kind:'long'},
 {id:'tank', category:'top', name:'민소매', suitable:false, kind:'tank', feedback:'조금 추워요'},
 {id:'shorts', category:'bottom', name:'반바지', suitable:false, kind:'shorts', feedback:'조금 추워요'},
 {id:'pants', category:'bottom', name:'긴바지', suitable:true, kind:'pants'},
 {id:'jacket', category:'outer', name:'가벼운 재킷', suitable:true, kind:'jacket'},
 {id:'puffer', category:'outer', name:'두꺼운 패딩', suitable:false, kind:'puffer', feedback:'조금 더워요'},
];
export function equip(outfit, id) {
 const item = items.find(item=>item.id===id);
 return item ? {...outfit, [item.category]:id} : {...outfit};
}
export function score(outfit) {
 return categories.reduce((total, category)=>{
  const item = items.find(item=>item.id===outfit[category.id] && item.category===category.id);
  return total + (item ? (item.suitable ? category.points : -category.points) : 0);
 },0);
}
export function isComplete(outfit) {
 return categories.every(category=>items.some(item=>item.id===outfit[category.id] && item.category===category.id && item.suitable));
}
