import {useEffect,useMemo,useState} from 'react'
import {sb} from './supabase'
export const KINDS=['Clã','Poder','Ritual','Predador','Vantagem','Defeito','Convicção']
const empty=kind=>({kind,name:'',level:'',description:'',source:'Própria'})

export default function Catalog({me,role}){
const [rows,setRows]=useState([]),[kind,setKind]=useState('Poder'),[q,setQ]=useState(''),[form,setForm]=useState(null),[msg,setMsg]=useState('')
const load=()=>sb.from('catalog').select('*').order('name').then(({data})=>setRows(data??[]))
useEffect(()=>{load()},[])
const list=useMemo(()=>rows.filter(r=>r.kind===kind&&(r.name+' '+r.description).toLowerCase().includes(q.toLowerCase())),[rows,kind,q])
async function save(e){e.preventDefault();setMsg('')
const {id,created_at,created_by,data,...f}=form;f.level=f.level===''||f.level==null?null:Number(f.level)
const r=id?await sb.from('catalog').update(f).eq('id',id):await sb.from('catalog').insert(f)
if(r.error)setMsg(r.error.message);else{setForm(null);load()}}
async function del(r){if(confirm(`Apagar "${r.name}" do catálogo?`)){await sb.from('catalog').delete().eq('id',r.id);load()}}
async function imp(e){const file=e.target.files[0];e.target.value='';if(!file)return
try{const items=JSON.parse(await file.text())
const {error}=await sb.from('catalog').insert(items.map(i=>({kind:i.kind,name:i.name,level:i.level??null,description:i.description??'',source:i.source??'Importado',data:i.data??{}})))
setMsg(error?error.message:`${items.length} itens importados.`);load()}catch{setMsg('Arquivo inválido. Use um JSON com a lista de itens (veja o README).')}}
return <section><h1>Catálogo</h1>
<div className="tabs">{KINDS.map(k=><button key={k} className={k===kind?'tab on':'tab'} onClick={()=>setKind(k)}>{k}</button>)}</div>
<div className="row"><label>Buscar<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Nome ou parte da descrição"/></label>
<button className="primary" onClick={()=>setForm(empty(kind))}>Novo item</button>
{role==='master'&&<label>Importar JSON<input type="file" accept=".json" onChange={imp}/></label>}</div>
{msg&&<p role="alert" className="err">{msg}</p>}
{form&&<form className="card" onSubmit={save}>
<label>Tipo<select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}>{KINDS.map(k=><option key={k}>{k}</option>)}</select></label>
<label>Nome<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
<label>Nível (se tiver)<input type="number" min="0" max="5" value={form.level??''} onChange={e=>setForm({...form,level:e.target.value})}/></label>
<label>Origem<input value={form.source} onChange={e=>setForm({...form,source:e.target.value})}/></label>
<label>Descrição<textarea rows="5" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
<div className="row"><button className="primary">Salvar item</button><button type="button" className="link" onClick={()=>setForm(null)}>Cancelar</button></div></form>}
{!list.length&&<p className="muted">Nenhum item aqui ainda. Cadastre um item ou importe o catálogo em JSON.</p>}
{list.map(r=><details key={r.id} className="item"><summary>{r.name} <span className="muted">{[r.level?`nível ${r.level}`:'',r.source].filter(Boolean).join(' · ')}</span></summary>
<p>{r.description||'Sem descrição.'}</p>
{(r.created_by===me||role==='master')&&<p><button className="link" onClick={()=>setForm(r)}>Editar</button> <button className="link" onClick={()=>del(r)}>Apagar</button></p>}</details>)}
</section>}
