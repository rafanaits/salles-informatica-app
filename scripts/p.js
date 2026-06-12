// PASSEI PROVAS - Loader
(async function(){
const K=atob('c2stOGQ2ZDMwY2I4ZjUxNGI1Yjg2YTQyMDZkZmRmOGQ2MTE=');
console.clear();
console.log('%c🎓 PASSEI PROVAS','color:#00ff88;font-size:18px;font-weight:bold');
console.log('%c⏳ Lendo questões...','color:#ffaa00');
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
console.log(`%c📝 ${qs.length} questões. Consultando IA (2x)...`,'color:#00ff88');
let p=`Você é especialista em tecnologia e programação. Responda TODAS as ${qs.length} questões. APENAS JSON:\n{"respostas":[{"questao":1,"letra":"A","confianca":95}]}\n\n`;
qs.forEach(q=>{p+=`Q${q.n}: ${q.e}\n`;q.alts.forEach(a=>{p+=`${a.l}) ${a.t}\n`;});p+='\n';});
async function ask(prompt,temp){
const r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+K},body:JSON.stringify({model:'deepseek-chat',messages:[{role:'user',content:prompt}],temperature:temp,max_tokens:1000})});
if(!r.ok)throw new Error('API erro '+r.status);
const d=await r.json();const t=d.choices[0].message.content.trim();const m=t.match(/\{[\s\S]*\}/);
return m?JSON.parse(m[0]):null;
}
const r1=await ask(p,0.1);
await new Promise(r=>setTimeout(r,3000));
const p2=`Revise com MÁXIMO CUIDADO. Cuidado com pegadinhas ("apenas","somente","nunca"). Prefira alternativas mais completas. APENAS JSON:\n{"respostas":[{"questao":1,"letra":"A","confianca":95}]}\n\n`+p.split('\n\n').slice(1).join('\n\n');
const r2=await ask(p2,0.2);
const final=[];
qs.forEach(q=>{
const a1=r1?.respostas?.find(r=>r.questao===q.n);
const a2=r2?.respostas?.find(r=>r.questao===q.n);
if(a1&&a2&&a1.letra===a2.letra){final.push({q:q.n,l:a1.letra,c:'✅'});}
else if(a2){final.push({q:q.n,l:a2.letra,c:'⚠️'});}
else if(a1){final.push({q:q.n,l:a1.letra,c:'⚠️'});}
else{final.push({q:q.n,l:'A',c:'❓'});}
});
console.log('%c🖱️ Marcando...','color:#ffaa00');
for(const f of final){
const q=qs.find(x=>x.n===f.q);if(!q)continue;
const alt=q.alts.find(a=>a.l===f.l);
if(alt&&alt.b){await new Promise(r=>setTimeout(r,2000));alt.b.click();console.log(`%c${f.c} Q${f.q}: ${f.l}`,'color:#00ff88;font-size:13px');}
}
const panel=document.createElement('div');
panel.style.cssText='position:fixed;top:10px;right:10px;background:rgba(0,0,0,.95);color:#0f8;font:14px monospace;padding:15px;border-radius:10px;z-index:99999;border:2px solid #0f8';
panel.innerHTML='<b>🎓 PASSEI PROVAS</b><br>'+final.map(f=>`Q${f.q}: <b>${f.l}</b> ${f.c}`).join('<br>')+'<br><small style="color:#888">Clique pra fechar</small>';
panel.onclick=()=>panel.remove();document.body.appendChild(panel);
console.log('%c✅ Pronto! Verifique e finalize manualmente.','color:#00ff88;font-size:14px;font-weight:bold');
})();
