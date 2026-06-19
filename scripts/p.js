// PASSEI PROVAS - DeepSeek dupla verificação (sem Groq)
(async function(){
const DK=atob('c2stOGQ2ZDMwY2I4ZjUxNGI1Yjg2YTQyMDZkZmRmOGQ2MTE=');
console.clear();
console.log('%c🎓 PASSEI PROVAS','color:#00ff88;font-size:18px;font-weight:bold');
console.log('%c🔒 DeepSeek | Dupla verificação','color:#ffaa00;font-size:13px');

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

// 2. CHAMAR DEEPSEEK
async function ask(prompt,temp){
const r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+DK},body:JSON.stringify({model:'deepseek-chat',messages:[{role:'user',content:prompt}],temperature:temp,max_tokens:1000})});
if(!r.ok){const e=await r.text();throw new Error('API erro '+r.status+': '+e.substring(0,100));}
const d=await r.json();const t=d.choices[0].message.content.trim();const m=t.match(/\{[\s\S]*\}/);
return m?JSON.parse(m[0]):null;
}

// 3. RODADA 1
let p1=`Você é um professor universitário com 20 anos de experiência em provas de tecnologia, banco de dados, programação e redes. Analise cada questão com EXTREMO CUIDADO.

REGRAS:
1. Leia TODAS as alternativas antes de escolher
2. Cuidado com alternativas que parecem corretas mas têm um detalhe errado
3. Desconfie de "apenas", "somente", "sempre", "nunca"
4. Prefira alternativas MAIS COMPLETAS e TECNICAMENTE PRECISAS
5. Em correspondências, verifique CADA par individualmente
6. Responda TODAS as ${qs.length} questões

APENAS JSON: {"respostas":[{"questao":1,"letra":"A"},{"questao":2,"letra":"B"}]}

`;
qs.forEach(q=>{p1+=`Q${q.n}: ${q.e}\n`;q.alts.forEach(a=>{p1+=`${a.l}) ${a.t}\n`;});p1+='\n';});

console.log('%c📡 Rodada 1: Respondendo...','color:#aaa;font-size:11px');
const r1=await ask(p1,0.1);

// 4. RODADA 2 (prompt diferente, revisão)
await new Promise(r=>setTimeout(r,2000));
let p2=`Você é um revisor de provas especialista em encontrar ERROS. Revise estas questões com olhar CRÍTICO.

ATENÇÃO ESPECIAL:
- Se uma alternativa parece "óbvia demais", desconfie
- Verifique se termos técnicos estão usados corretamente
- "Row" = Linha (NÃO coluna), "Column" = Coluna (NÃO linha)
- "Table" em NoSQL pode equivaler a "Column Family" ou "Tabela"
- Cuidado com inversões de conceitos

APENAS JSON: {"respostas":[{"questao":1,"letra":"A"},{"questao":2,"letra":"B"}]}

`;
qs.forEach(q=>{p2+=`Q${q.n}: ${q.e}\n`;q.alts.forEach(a=>{p2+=`${a.l}) ${a.t}\n`;});p2+='\n';});

console.log('%c📡 Rodada 2: Revisando...','color:#aaa;font-size:11px');
const r2=await ask(p2,0.2);

// 5. COMPARAR
const final=[];
let concordam=0,divergem=0;
qs.forEach(q=>{
const a1=r1?.respostas?.find(r=>r.questao===q.n);
const a2=r2?.respostas?.find(r=>r.questao===q.n);
if(a1&&a2&&a1.letra===a2.letra){
  final.push({q:q.n,l:a1.letra,c:'✅'});concordam++;
}else if(a1&&a2){
  final.push({q:q.n,l:a2.letra,c:'⚠️'});divergem++;
  console.log(`%c⚠️ Q${q.n}: R1=${a1.letra} vs R2=${a2.letra} → usando R2 (revisão)`,'color:#ff8800;font-size:11px');
}else if(a1){final.push({q:q.n,l:a1.letra,c:'✅'});concordam++;}
else if(a2){final.push({q:q.n,l:a2.letra,c:'✅'});concordam++;}
else{final.push({q:q.n,l:'A',c:'❓'});}
});
console.log(`%c📊 ${concordam} concordam ✅ | ${divergem} divergem ⚠️`,'color:#00ff88;font-size:13px');

// 6. DESEMPATE
if(divergem>0){
await new Promise(r=>setTimeout(r,2000));
console.log('%c🎯 Rodada 3: Desempate...','color:#ffaa00;font-size:12px');
const divQs=qs.filter(q=>final.find(f=>f.q===q.n&&f.c==='⚠️'));
let p3=`DESEMPATE. Analise com máxima precisão. Última chance de acertar. APENAS JSON:\n{"respostas":[{"questao":1,"letra":"A"}]}\n\n`;
divQs.forEach(q=>{p3+=`Q${q.n}: ${q.e}\n`;q.alts.forEach(a=>{p3+=`${a.l}) ${a.t}\n`;});p3+='\n';});
try{
const r3=await ask(p3,0.15);
r3?.respostas?.forEach(r=>{const idx=final.findIndex(f=>f.q===r.questao);if(idx!==-1){final[idx].l=r.letra;final[idx].c='🎯';}});
}catch(e){}
}

// 7. MARCAR
console.log('%c🖱️ Marcando...','color:#ffaa00');
for(const f of final){
const q=qs.find(x=>x.n===f.q);if(!q)continue;
const alt=q.alts.find(a=>a.l===f.l);
if(alt&&alt.b){await new Promise(r=>setTimeout(r,2000));alt.b.click();
console.log(`%c${f.c} Q${f.q}: ${f.l}`,'color:#00ff88;font-size:13px');}
}
console.log('%c✅ Pronto! Todas marcadas.','color:#00ff88;font-size:14px;font-weight:bold');
console.table(final.map(f=>({Q:f.q,Resp:f.l,Status:f.c})));
})();
