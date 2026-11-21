import {useEffect,useState} from 'react'
import {sb} from './supabase'
import {blank} from './data'
import Sheet from './Sheet'
import Master from './Master'

function Login(){
const [email,setEmail]=useState(''),[pw,setPw]=useState(''),[up,setUp]=useState(false),[msg,setMsg]=useState('')
async function go(e){e.preventDefault();setMsg('')
const r=up?await sb.auth.signUp({email,password:pw,options:{data:{name:email.split('@')[0]}}}):await sb.auth.signInWithPassword({email,password:pw})
if(r.error)setMsg(r.error.message);else if(up&&!r.data.session)setMsg('Conta criada. Confirme o e-mail e depois entre.')}
return <main className="login"><h1>Fichas</h1><p className="muted">Entre para ver os seus personagens.</p>
<form onSubmit={go}><label>E-mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
<label>Senha<input type="password" required minLength={6} value={pw} onChange={e=>setPw(e.target.value)}/></label>
<button className="primary">{up?'Criar conta':'Entrar'}</button></form>
{msg&&<p role="alert" className="err">{msg}</p>}
<button className="link" onClick={()=>setUp(!up)}>{up?'Já tenho conta':'Criar uma conta nova'}</button></main>}

export default function App(){
const [user,setUser]=useState(null),[ready,setReady]=useState(false),[role,setRole]=useState('player'),[view,setView]=useState('list'),[chars,setChars]=useState([])
useEffect(()=>{sb.auth.getSession().then(({data})=>{setUser(data.session?.user??null);setReady(true)})
const {data}=sb.auth.onAuthStateChange((_,s)=>setUser(s?.user??null));return()=>data.subscription.unsubscribe()},[])
const load=()=>sb.from('characters').select('id,data').order('created_at').then(({data})=>setChars(data??[]))
useEffect(()=>{if(!user)return;sb.from('profiles').select('role').eq('id',user.id).single().then(({data})=>setRole(data?.role??'player'));load()},[user])
async function create(){const {data,error}=await sb.from('characters').insert({data:blank()}).select('id').single();if(!error){await load();setView(data.id)}}
if(!ready)return null
if(!user)return <Login/>
const back=()=>{load();setView('list')}
return <><nav><strong>Fichas V5</strong>
<button className="link" onClick={back}>Minhas fichas</button>
{role==='master'&&<button className="link" onClick={()=>setView('master')}>Painel do mestre</button>}
<button className="link" onClick={()=>sb.auth.signOut()}>Sair</button></nav>
<main>{view==='master'?<Master onOpen={setView}/>:view==='list'?<>
<h1>Minhas fichas</h1>
{!chars.length&&<p className="muted">Você ainda não tem personagens. Crie o primeiro para começar.</p>}
<div className="grid">{chars.map(c=><button key={c.id} className="card" onClick={()=>setView(c.id)} style={{'--acc':'#a3121f'}}><strong>{c.data.name}</strong><span className="muted">{c.data.clan||'Sem clã'}</span></button>)}</div>
<button className="primary" onClick={create}>Nova ficha</button></>:<Sheet id={view} onBack={back}/>}</main></>}
