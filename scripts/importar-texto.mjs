// Converte o SEU arquivo de texto de regras em catalogo.json (roda no seu computador).
// Uso: node scripts/importar-texto.mjs regras.txt catalogo.json
import fs from 'node:fs'
const [,,input,output='catalogo.json']=process.argv
if(!input){console.log('Uso: node scripts/importar-texto.mjs regras.txt [catalogo.json]');process.exit(1)}
const L=fs.readFileSync(input,'utf8').split(/\r?\n/).map(l=>l.trim()).filter(Boolean)
const DISC=['Animalismo','Auspícios','Celeridade','Dominação','Fortitude','Ofuscação','Potência','Presença','Proteanismo','Feitiçaria de Sangue','Oblívio','Alquimia Sangue-Ralo']
const isHead=l=>/^\d+\.\s/.test(l),isItem=i=>L[i+1]?.startsWith('Fonte:')
const out=[];let sec='',disc=null
for(let i=0;i<L.length;i++){const l=L[i]
if(isHead(l)){sec=l;disc=null;continue}
if(DISC.includes(l)){disc=l;continue}
const p=l.match(/^Nível (\d) — ([^:(]+?)(?: \(([^)]*)\))?:\s*(.+)$/)
if(p&&disc){const c=(p[4].match(/\(Custo:[^)]*\)\s*$/)||[''])[0]
out.push({kind:'Poder',name:p[2].trim(),level:+p[1],source:disc,description:p[4].replace(c,'').trim(),data:{disciplina:disc,requisito:p[3]||'',custo:c.replace(/^\(|\)$/g,'')}});continue}
if(isItem(i)&&/^[14]\./.test(sec)){let j=i+2,d=[];while(j<L.length&&!isHead(L[j])&&!isItem(j))d.push(L[j++])
out.push({kind:sec[0]==='1'?'Clã':'Predador',name:l,source:L[i+1].replace('Fonte:','').trim(),description:d.join('\n')})}}
fs.writeFileSync(output,JSON.stringify(out,null,1));console.log(`${out.length} itens gravados em ${output}`)
