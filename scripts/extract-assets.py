"""Extract vector parts from the user's licensed EPS art, preserving clipping paths.
Run after gs -sDEVICE=pdfwrite conversion into .asset-work/<id>.pdf.
No raster tracing or AI redrawing: original vector paths are retained.
"""
from pathlib import Path
import json
import pymupdf as f
OUT=Path('assets/characters');OUT.mkdir(parents=True,exist_ok=True)
def point(p): return f'{p.x:.3f},{p.y:.3f}'
def pathdata(d):
 s=[];last=None
 for item in d['items']:
  k=item[0]
  if k=='re':
   r=item[1];s.append(f'M{r.x0:.3f},{r.y0:.3f}H{r.x1:.3f}V{r.y1:.3f}H{r.x0:.3f}Z');last=None
  elif k in ('l','c'):
   if last is None or abs(last.x-item[1].x)+abs(last.y-item[1].y)>.01: s.append('M'+point(item[1]))
   s.append(('L'+point(item[2])) if k=='l' else 'C'+' '.join(point(p) for p in item[2:]));last=item[-1]
  elif k=='qu':
   q=item[1];s.append('M'+point(q.ul)+'L'+point(q.ur)+'L'+point(q.lr)+'L'+point(q.ll)+'Z');last=None
 if d.get('closePath'):s.append('Z')
 return ' '.join(s)
def color(c):return '#'+''.join(f'{round(max(0,min(1,v))*255):02x}' for v in c[:3])
def extract(id,name,bounds):
 crop=f.Rect(bounds);p=f.open(f'.asset-work/{id}.pdf')[0];defs=[];parts=[];clips=[]
 for i,d in enumerate(p.get_drawings(extended=True)):
  level=d.get('level',0)
  clips=[c for c in clips if c[0]<level]
  if d['type']=='clip':
   key=f'c{i}';defs.append(f'<clipPath id="{key}"><path d="{pathdata(d)}" clip-rule="'+('evenodd' if d.get('even_odd') else 'nonzero')+'"/></clipPath>');clips.append((level,key));continue
  if d['type']=='group':continue
  r=d['rect']
  if not r.intersects(crop) or r.get_area()>crop.get_area()*2:continue
  fill=d.get('fill')
  if name in ('girl-body-dressed',) and fill and min(fill)>.99 and 210<r.y0<220 and 35<r.width<40:continue
  if ('body' in name) and r.y0>390 and r.height<20 and r.width>50:continue
  # White rectangular paper folding tabs, including rotated shoulder tabs.
  if fill and min(fill)>.82 and max(fill)-min(fill)<.025 and all(it[0] in ('l','re') for it in d['items']) and len(d['items'])<=5 and r.get_area()<100 and (r.width<8 or r.height<8):continue
  attrs=f'fill="{color(fill) if fill else "none"}" fill-rule="'+('evenodd' if d.get('even_odd') else 'nonzero')+'"'
  if d.get('color'):attrs+=f' stroke="{color(d["color"])}" stroke-width="{d["width"]}"'
  el=f'<path d="{pathdata(d)}" {attrs}/>'
  for _,key in reversed(clips):el=f'<g clip-path="url(#{key})">{el}</g>'
  parts.append(el)
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{crop.x0} {crop.y0} {crop.width} {crop.height}"><!-- Adapted from macrovector / Freepik, licensed source {id}. -->\n<defs>'+''.join(defs)+'</defs>'+''.join(parts)+'</svg>'
 (OUT/f'{name}.svg').write_text(svg)
 return dict(file=f'{name}.svg',source=id,bounds=list(bounds))
# Bounds use PDF points, matching the original sheets.
specs=[
('42247','boy-shoe-left',(94.5,389.5,106.7,408)),
('42247','boy-shoe-right',(114,389.5,126.2,408)),
('42244','girl-shoe-left',(45.8,392,56.3,406)),
('42244','girl-shoe-right',(58,392,68.5,406)),
('42247','boy-shoes',(87,389,130,409)),
('42244','girl-shoes',(43,391,73,407)),
('42247','boy-body',(190,128,261,399)),
('42244','girl-body',(194,142,256,398)),
('42244','girl-body-dressed',(194,142,256,398)),
('42247','boy-long',(274,124,342,213)),
('42234','boy-tank',(225,302,283,405)),
('42247','boy-pants',(120,252,169,375)),
('42234','boy-shorts',(110,362,170,432)),
('42247','knit',(349,155,417,233)),
('42247','puffer',(274,288,345,372)),
('42244','girl-long',(37,168,94,238)),
('42250','girl-tank',(193,183,243,255)),
('42244','girl-pants',(116,255,160,372)),
('42250','girl-shorts',(253,166,310,202)),
('42250','girl-jacket',(166,259,242,359)),
]
manifest=[extract(*s) for s in specs];(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))
# Vector-only contact sheet for visual inspection.
parts=[]
for n,m in enumerate(manifest):
 x=(n%5)*150;y=(n//5)*240
 svg=(OUT/m['file']).read_text().replace('<svg ',f'<svg x="{x+10}" y="{y+25}" width="130" height="190" ',1)
 parts.append(svg+f'<text x="{x+12}" y="{y+230}" font-size="12">{m["file"]}</text>')
Path('.asset-work/contact.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="750" height="720"><rect width="750" height="720" fill="#eee"/>'+''.join(parts)+'</svg>')
d=f.open('.asset-work/contact.svg');d[0].get_pixmap().save('.asset-work/contact.png')
