export const Dots=({v,max=5,on})=><span className="dots">{Array.from({length:max},(_,i)=>
<button key={i} className={i<v?'d on':'d'} aria-label={`Nível ${i+1}`} onClick={()=>on(v===i+1?i:i+1)}/>)}</span>
const Step=({label,v,max,on})=><span className="step">{label}
<button onClick={()=>on(Math.max(0,v-1))} aria-label={`Menos ${label}`}>−</button><b>{v}</b>
<button onClick={()=>on(Math.min(max,v+1))} aria-label={`Mais ${label}`}>+</button></span>
export function Track({label,max,t,on}){
return <div className="track"><h4>{label}</h4>
<div className="boxes">{Array.from({length:max},(_,i)=><i key={i} className={i<t.agg?'b agg':i<t.agg+t.sup?'b sup':'b'}/>)}</div>
<Step label="Superficial" v={t.sup} max={max-t.agg} on={v=>on({...t,sup:v})}/>
<Step label="Agravado" v={t.agg} max={max-t.sup} on={v=>on({...t,agg:v})}/></div>}
