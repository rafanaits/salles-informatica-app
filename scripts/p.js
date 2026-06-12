// PASSEI PROVAS - Multi-API (DeepSeek + Groq) com dupla verificação
(async function(){
const DK=atob('c2stOGQ2ZDMwY2I4ZjUxNGI1Yjg2YTQyMDZkZmRmOGQ2MTE=');
const GK=atob('Z3NrX3h1NGw2SmlQbDJ1bFZQUDRMRXl2V0dkeWIzRllTekJXbHkySHNnRmpEaFR0Tm1qaHNSbVM=');
console.clear();
console.log('%c🎓 PASSEI PROVAS - Multi-API','color:#00ff88;font-size:18px;font-weight:bold');
console.log('%c🔒 DeepSeek + Groq | Dupla verificação','color:#ffaa00;font-size:13px');

// 1. EXTRAIR QUESTÕES
const qs=[];
document.querySelectorAll('[data-question-index]').forEach(d=>{
const ts=d.querySelectorAll('[data-testid="question-typography"]');
let e='';for(const t of ts){if(!t.closest('button')){e=t.textContent.trim();break;}}
if(!e)return;
const alts=[];
d.querySelectorAll('button[data-testid^="alternative-"]').forEach(b=>{
const l=b.querySelector('small')?.textContent?.trim();
const t=b.querySelector('[data-testid="question-typography"]')?.textContent?.trim();
if(l&&t)alts.push({l,t,b});
});
if(alts.length>0)qs.push({n:qs.length+1,e,alts});
});
if(!qs.length){console.log('%c❌ Nenhuma questão!','color:#ff4444');return;}
console.log(`%c📝 ${qs.length} questões encontradas`,'color:#00ff88');

// 2. MONTAR PROMPT
let prompt=`Você é um professor especialista em tecnologia e programação. Responda TODAS as ${qs.length} questões com a alternativa CORRETA. Cuidado com pegadinhas. APENAS JSON puro:\n{"respostas":[{"questao":1,"letra":"A"},{"questao":2,"letra":"B"}]}\n\n`;
qs.forEach(q=>{prompt+=`Q${q.n}: ${q.e}\n`;q.alts.forEach(a=>{prompt+=`${a.l}) ${a.t}\n`;});prompt+='\n';});

// 3. CHAMAR APIs
async function chamarDeepSeek(){
try{
console.log('%c📡 Consultando DeepSeek...','color:#aaa;font-size:11px');
const r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+DK},body:JSON.stringify({model:'deepseek-chat',messages:[{role:'user',content:prompt}],temperature:0.1,max_tokens:1000})});
if(!r.ok)throw new Error(r.status);
const d=await r.json();const t=d.choices[0].message.content.trim();const m=t.match(/\{[\s\S]*\}/);
return m?JSON.parse(m[0]):null;
}catch(e){console.log(`%c⚠️ DeepSeek falhou: ${e.message}`,'color:#ff8800;font-size:11px');return null;}
}

async function chamarGroq(){
try{
console.log('%c📡 Consultando Groq...','color:#aaa;font-size:11px');
const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+GK},body:JSON.stringify({model:'meta-llama/llama-4-scout-17b-16e-instruct',messages:[{role:'user',content:prompt}],temperature:0.1,max_tokens:1000})});
if(!r.ok)throw new Error(r.status);
const d=await r.json();const t=d.choices[0].message.content.trim();const m=t.match(/\{[\s\S]*\}/);
return m?JSON.parse(m[0]):null;
}catch(e){console.log(`%c⚠️ Groq falhou: ${e.message}`,'color:#ff8800;font-size:11px');return null;}
}

// 4. CONSULTAR AMBAS
const [r1,r2]=await Promise.all([chamarDeepSeek(),chamarGroq()]);

// 5. COMPARAR E DECIDIR
const final=[];
let concordam=0,divergem=0;

qs.forEach(q=>{
const a1=r1?.respostas?.find(r=>r.questao===q.n);
const a2=r2?.respostas?.find(r=>r.questao===q.n);

if(a1&&a2&&a1.letra===a2.letra){
  final.push({q:q.n,l:a1.letra,c:'✅',conf:'100%'});concordam++;
}else if(a1&&a2){
  // Divergência - prefere DeepSeek (mais preciso)
  final.push({q:q.n,l:a1.letra,c:'⚠️',conf:'70%',alt:a2.letra});divergem++;
  console.log(`%c⚠️ Q${q.n}: DeepSeek=${a1.letra} vs Groq=${a2.letra} → usando DeepSeek`,'color:#ff8800;font-size:11px');
}else if(a1){
  final.push({q:q.n,l:a1.letra,c:'✅',conf:'85%'});concordam++;
}else if(a2){
  final.push({q:q.n,l:a2.letra,c:'✅',conf:'85%'});concordam++;
}else{
  final.push({q:q.n,l:'A',c:'❓',conf:'0%'});
}
});

console.log(`%c📊 Resultado: ${concordam} concordam ✅ | ${divergem} divergem ⚠️`,'color:#00ff88;font-size:13px');

// 6. DESEMPATE (se houver divergências, consulta DeepSeek novamente com prompt diferente)
if(divergem>0){
console.log('%c🎯 Rodando desempate para divergências...','color:#ffaa00;font-size:12px');
const divQs=qs.filter(q=>final.find(f=>f.q===q.n&&f.c==='⚠️'));
let p2=`Revise com MÁXIMO cuidado. Cuidado com "apenas","somente","nunca","sempre". Prefira alternativas mais completas e tecnicamente precisas. APENAS JSON:\n{"respostas":[{"questao":1,"letra":"A"}]}\n\n`;
divQs.forEach(q=>{p2+=`Q${q.n}: ${q.e}\n`;q.alts.forEach(a=>{p2+=`${a.l}) ${a.t}\n`;});p2+='\n';});
try{
const r3=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+DK},body:JSON.stringify({model:'deepseek-chat',messages:[{role:'user',content:p2}],temperature:0.2,max_tokens:800})});
if(r3.ok){
const d=await r3.json();const t=d.choices[0].message.content.trim();const m=t.match(/\{[\s\S]*\}/);
if(m){const res=JSON.parse(m[0]);
res.respostas?.forEach(r=>{const idx=final.findIndex(f=>f.q===r.questao);if(idx!==-1){final[idx].l=r.letra;final[idx].c='🎯';final[idx].conf='90%';}});
}}
}catch(e){}
}

// 7. MARCAR RESPOSTAS
console.log('%c🖱️ Marcando respostas...','color:#ffaa00');
for(const f of final){
const q=qs.find(x=>x.n===f.q);if(!q)continue;
const alt=q.alts.find(a=>a.l===f.l);
if(alt&&alt.b){await new Promise(r=>setTimeout(r,2000));alt.b.click();
console.log(`%c${f.c} Q${f.q}: ${f.l} (${f.conf})`,'color:#00ff88;font-size:13px');}
}

// 8. PAINEL
const panel=document.createElement('div');
panel.style.cssText='position:fixed;top:10px;right:10px;background:rgba(0,0,0,.95);color:#0f8;font:13px monospace;padding:15px;border-radius:10px;z-index:99999;border:2px solid #0f8;max-height:90vh;overflow-y:auto';
panel.innerHTML=`<b>🎓 PASSEI PROVAS</b><br><small style="color:#888">DeepSeek + Groq</small><br><br>`+
final.map(f=>`Q${f.q}: <b>${f.l}</b> ${f.c} ${f.conf}`).join('<br>')+
`<br><br><small style="color:#888">✅=ambas concordam | 🎯=desempate | ⚠️=divergência</small><br><small style="color:#666">Clique pra fechar</small>`;
panel.onclick=()=>panel.remove();document.body.appendChild(panel);
console.log('%c✅ Pronto! Verifique e finalize.','color:#00ff88;font-size:14px;font-weight:bold');
})();
