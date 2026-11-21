export const ATTRS={Físicos:[['for','Força'],['des','Destreza'],['vig','Vigor']],Sociais:[['car','Carisma'],['man','Manipulação'],['aut','Autocontrole']],Mentais:[['int','Inteligência'],['rac','Raciocínio'],['per','Perseverança']]}
export const SKILLS={Físicas:['Armas brancas','Armas de fogo','Atletismo','Briga','Condução','Furtividade','Ladroagem','Ofícios','Sobrevivência'],Sociais:['Empatia com animais','Etiqueta','Intimidação','Liderança','Manha','Performance','Persuasão','Perspicácia','Subterfúgio'],Mentais:['Acadêmicos','Ciência','Finanças','Investigação','Medicina','Ocultismo','Percepção','Política','Tecnologia']}
export const THEMES={Padrão:'#a3121f',Brujah:'#c2452d',Gangrel:'#7d8a3c',Lasombra:'#5a5a82',Malkaviano:'#6a5aa8',Nosferatu:'#8a7556',Toreador:'#b8497f',Tremere:'#8c1d45',Ventrue:'#2f5f9e'}
export const blank=()=>({name:'Novo personagem',clan:'',predator:'',concept:'',theme:'Padrão',
attrs:Object.fromEntries(Object.values(ATTRS).flat().map(([k])=>[k,1])),skills:{},
hp:{sup:0,agg:0},wp:{sup:0,agg:0},hunger:1,humanity:7,stains:0})
export const hpMax=d=>d.attrs.vig+3
export const wpMax=d=>d.attrs.aut+d.attrs.per
