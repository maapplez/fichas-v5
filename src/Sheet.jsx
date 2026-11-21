import {useEffect,useRef,useState} from 'react'
import {sb} from './supabase'
import {ATTRS,SKILLS,THEMES,hpMax,wpMax} from './data'
import {Dots,Track} from './ui'

export default function Sheet({id,onBack}){
const [d,setD]=useState(null),timer=useRef()
useEffect(()=>{
sb.from('characters').select('data').eq('id',id).single().then(({data})=>setD(data?.data))
const ch=sb.channel('ficha-'+id).on('postgres_changes',{event:'UPDATE',schema:'public',table:'characters',filter:`id=eq.${id}`},p=>setD(p.new.data)).subscribe()
return()=>{sb.removeChannel(ch)}},[id])
const set=fn=>setD(prev=>{const n=structuredClone(prev);fn(n)
clearTimeout(timer.current);timer.current=setTimeout(()=>sb.from('characters').update({data:n}).eq('id',id),500);return n})
async function del(){if(confirm('Apagar esta ficha? Não dá para desfazer.')){await sb.from('characters').delete().eq('id',id);onBack()}}
if(!d)return <p className="muted">Carregando ficha…</p>
const txt=(k,label)=><label>{label}<input value={d[k]} onChange={e=>set(n=>{n[k]=e.target.value})}/></label>
return <section className="sheet" style={{'--acc':THEMES[d.theme]||THEMES.Padrão}}>
<button className="link" onClick={onBack}>Voltar às fichas</button>
<header><input className="title" value={d.name} onChange={e=>set(n=>{n.name=e.target.value})} aria-label="Nome do personagem"/>
<div className="row">{txt('clan','Clã')}{txt('predator','Predador')}{txt('concept','Conceito')}
<label>Cor do tema<select value={d.theme} onChange={e=>set(n=>{n.theme=e.target.value})}>{Object.keys(THEMES).map(t=><option key={t}>{t}</option>)}</select></label></div></header>
<h2>Atributos</h2><div className="cols">{Object.entries(ATTRS).map(([g,list])=><div key={g}><h3>{g}</h3>
{list.map(([k,l])=><div className="line" key={k}>{l}<Dots v={d.attrs[k]} on={v=>set(n=>{n.attrs[k]=Math.max(1,v)})}/></div>)}</div>)}</div>
<h2>Perícias</h2><div className="cols">{Object.entries(SKILLS).map(([g,list])=><div key={g}><h3>{g}</h3>
{list.map(s=><div className="line" key={s}>{s}<Dots v={d.skills[s]||0} on={v=>set(n=>{n.skills[s]=v})}/></div>)}</div>)}</div>
<h2>Condição</h2><div className="cols">
<Track label="Vitalidade" max={hpMax(d)} t={d.hp} on={v=>set(n=>{n.hp=v})}/>
<Track label="Força de vontade" max={wpMax(d)} t={d.wp} on={v=>set(n=>{n.wp=v})}/>
<div className="track"><h4>Fome</h4><Dots v={d.hunger} on={v=>set(n=>{n.hunger=v})}/>
<h4>Humanidade</h4><Dots v={d.humanity} max={10} on={v=>set(n=>{n.humanity=v})}/>
<h4>Manchas</h4><Dots v={d.stains} max={10-d.humanity} on={v=>set(n=>{n.stains=v})}/></div></div>
<button className="danger" onClick={del}>Apagar ficha</button></section>}
