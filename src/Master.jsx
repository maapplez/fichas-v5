import {useEffect,useState} from 'react'
import {sb} from './supabase'
import {THEMES,hpMax,wpMax} from './data'
import {Dots,Track} from './ui'

export default function Master({onOpen}){
const [rows,setRows]=useState([])
const load=()=>sb.from('characters').select('id,data,profiles(name)').order('created_at').then(({data})=>setRows(data??[]))
useEffect(()=>{load()
const ch=sb.channel('mestre').on('postgres_changes',{event:'*',schema:'public',table:'characters'},load).subscribe()
return()=>{sb.removeChannel(ch)}},[])
function patch(r,fn){const d=structuredClone(r.data);fn(d)
setRows(rs=>rs.map(x=>x.id===r.id?{...x,data:d}:x));sb.from('characters').update({data:d}).eq('id',r.id)}
if(!rows.length)return <p className="muted">Nenhuma ficha criada ainda. Quando os jogadores criarem personagens, elas aparecem aqui.</p>
return <div className="grid">{rows.map(r=>{const d=r.data
return <article key={r.id} className="card" style={{'--acc':THEMES[d.theme]||THEMES.Padrão}}>
<button className="link" onClick={()=>onOpen(r.id)}><strong>{d.name}</strong></button>
<p className="muted">{[d.clan,r.profiles?.name].filter(Boolean).join(' · ')}</p>
<Track label="Vitalidade" max={hpMax(d)} t={d.hp} on={v=>patch(r,n=>{n.hp=v})}/>
<Track label="Força de vontade" max={wpMax(d)} t={d.wp} on={v=>patch(r,n=>{n.wp=v})}/>
<div className="track"><h4>Fome</h4><Dots v={d.hunger} on={v=>patch(r,n=>{n.hunger=v})}/></div></article>})}</div>}
