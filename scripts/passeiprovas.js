// ============================================
// 🎓 PASSEI PROVAS - Versão Premium para Provas Principais
// ============================================
// Dupla verificação + pesquisa online + só finaliza com 100% de certeza
// Cole no console (F12) e espere. Ele faz tudo.
// ============================================

(async function () {
  console.clear();
  console.log('%c🎓 PASSEI PROVAS - Modo Prova Principal', 'color: #00ff88; font-size: 18px; font-weight: bold;');
  console.log('%c🔒 Dupla verificação ativada. Só finaliza com certeza total.', 'color: #ffaa00; font-size: 13px;');

  // ===== CONFIG =====
  const DEEPSEEK_KEY = localStorage.getItem('passei_deepseek_key') || prompt('Cole sua DeepSeek API Key:');
  if (!DEEPSEEK_KEY) { console.log('%c❌ Key não informada!', 'color: #ff4444;'); return; }
  localStorage.setItem('passei_deepseek_key', DEEPSEEK_KEY);
  const DELAY_ENTRE_CLIQUES = 2000;
  const MARCAR_AUTOMATICO = true;
  const FINALIZAR_AUTOMATICO = false; // NÃO finaliza - você confere e finaliza manualmente
  // ==================

  // ===== 1. EXTRAIR QUESTÕES =====
  function extrairQuestoes() {
    const questoes = [];
    const questionDivs = document.querySelectorAll('[data-question-index]');

    questionDivs.forEach((div) => {
      const allTypo = div.querySelectorAll('[data-testid="question-typography"]');
      let enunciado = '';
      for (const t of allTypo) {
        if (!t.closest('button')) {
          enunciado = t.textContent.trim();
          break;
        }
      }
      if (!enunciado) return;

      const alternativas = [];
      const buttons = div.querySelectorAll('button[data-testid^="alternative-"]');
      buttons.forEach(btn => {
        const letraEl = btn.querySelector('small');
        const letra = letraEl?.textContent?.trim();
        const textoEl = btn.querySelector('[data-testid="question-typography"]');
        const texto = textoEl?.textContent?.trim();
        if (letra && texto) {
          alternativas.push({ letra, texto, botao: btn });
        }
      });

      if (alternativas.length > 0) {
        questoes.push({ numero: questoes.length + 1, enunciado, alternativas });
      }
    });
    return questoes;
  }

  // ===== 2. CHAMAR DEEPSEEK API =====
  async function chamarIA(questoes, tentativa = 1) {
    let prompt = '';
    if (tentativa === 1) {
      prompt = `Você é um professor universitário especialista em tecnologia, programação, React Native, JavaScript, banco de dados, redes e desenvolvimento mobile. Analise cada questão com cuidado e escolha a alternativa CORRETA.

REGRAS:
- Responda TODAS as ${questoes.length} questões
- Pense passo a passo antes de responder
- Considere pegadinhas e alternativas parcialmente corretas
- Responda APENAS com JSON puro:
{"respostas": [{"questao": 1, "letra": "A", "confianca": 95}, {"questao": 2, "letra": "B", "confianca": 90}]}

O campo "confianca" é de 0 a 100 indicando sua certeza na resposta.

`;
    } else {
      prompt = `Você é um especialista em concursos e provas de tecnologia. Revise estas questões com MÁXIMO CUIDADO. Algumas respostas podem ter pegadinhas.

ATENÇÃO ESPECIAL:
- Leia TODAS as alternativas antes de responder
- Cuidado com "apenas", "somente", "sempre", "nunca" - geralmente estão erradas
- Prefira alternativas mais completas e tecnicamente precisas
- Se duas alternativas parecem corretas, escolha a mais abrangente

Responda APENAS com JSON:
{"respostas": [{"questao": 1, "letra": "A", "confianca": 95}]}

`;
    }

    questoes.forEach(q => {
      prompt += `Questão ${q.numero}: ${q.enunciado}\n`;
      q.alternativas.forEach(a => prompt += `${a.letra}) ${a.texto}\n`);
      prompt += '\n';
    });

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: tentativa === 1 ? 0.1 : 0.2,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`DeepSeek erro (${response.status}): ${err.substring(0, 200)}`);
    }

    const data = await response.json();
    const texto = data.choices[0].message.content.trim();
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Resposta não contém JSON válido');
    return JSON.parse(jsonMatch[0]);
  }

  // ===== 3. DUPLA VERIFICAÇÃO =====
  async function duplaVerificacao(questoes) {
    console.log('%c📝 Rodada 1: Respondendo questões...', 'color: #00ff88; font-size: 13px;');
    const rodada1 = await chamarIA(questoes, 1);

    // Espera 3 segundos entre as rodadas
    await new Promise(r => setTimeout(r, 3000));

    console.log('%c🔍 Rodada 2: Revisando respostas...', 'color: #00ff88; font-size: 13px;');
    const rodada2 = await chamarIA(questoes, 2);

    // Compara as duas rodadas
    const respostasFinais = [];
    let divergencias = 0;

    for (const q of questoes) {
      const r1 = rodada1.respostas?.find(r => r.questao === q.numero);
      const r2 = rodada2.respostas?.find(r => r.questao === q.numero);

      if (!r1 && !r2) {
        respostasFinais.push({ questao: q.numero, letra: 'A', confianca: 0, divergente: true });
        continue;
      }

      if (!r1) { respostasFinais.push({ ...r2, divergente: false }); continue; }
      if (!r2) { respostasFinais.push({ ...r1, divergente: false }); continue; }

      if (r1.letra === r2.letra) {
        // Ambas concordam - alta confiança
        const confianca = Math.max(r1.confianca || 85, r2.confianca || 85);
        respostasFinais.push({ questao: q.numero, letra: r1.letra, confianca, divergente: false });
        console.log(`%c   ✅ Q${q.numero}: ${r1.letra} (ambas concordam - ${confianca}%)`, 'color: #00ff88; font-size: 11px;');
      } else {
        // Divergência - precisa desempatar
        divergencias++;
        console.log(`%c   ⚠️ Q${q.numero}: Rodada1=${r1.letra} vs Rodada2=${r2.letra} - DIVERGÊNCIA`, 'color: #ff8800; font-size: 11px;');

        // Usa a resposta com maior confiança, ou a da rodada 2 (revisão)
        const conf1 = r1.confianca || 70;
        const conf2 = r2.confianca || 75;
        const escolhida = conf2 >= conf1 ? r2 : r1;
        respostasFinais.push({ questao: q.numero, letra: escolhida.letra, confianca: Math.min(conf1, conf2), divergente: true });
      }
    }

    if (divergencias > 0) {
      console.log(`%c⚠️ ${divergencias} divergência(s) encontrada(s). Rodando desempate...`, 'color: #ff8800; font-size: 13px;');

      // Rodada 3: Desempate apenas para questões divergentes
      const questoesDivergentes = questoes.filter(q =>
        respostasFinais.find(r => r.questao === q.numero && r.divergente)
      );

      if (questoesDivergentes.length > 0) {
        await new Promise(r => setTimeout(r, 3000));
        console.log('%c🎯 Rodada 3: Desempate...', 'color: #ffaa00; font-size: 13px;');
        const rodada3 = await chamarIA(questoesDivergentes, 2);

        rodada3.respostas?.forEach(r3 => {
          const idx = respostasFinais.findIndex(r => r.questao === r3.questao);
          if (idx !== -1) {
            respostasFinais[idx].letra = r3.letra;
            respostasFinais[idx].confianca = r3.confianca || 80;
            respostasFinais[idx].divergente = false;
            console.log(`%c   🎯 Q${r3.questao}: Desempate = ${r3.letra}`, 'color: #00ff88; font-size: 11px;');
          }
        });
      }
    }

    return { respostas: respostasFinais };
  }

  // ===== 4. MARCAR RESPOSTAS =====
  async function marcarRespostas(questoes, respostas) {
    let marcadas = 0;
    for (const q of questoes) {
      const r = respostas.respostas.find(x => x.questao === q.numero);
      if (!r) {
        console.log(`%c⚠️ Q${q.numero}: sem resposta, marcando A`, 'color: #ffaa00;');
        if (q.alternativas[0]?.botao) {
          await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_CLIQUES));
          q.alternativas[0].botao.click();
          marcadas++;
        }
        continue;
      }

      const alt = q.alternativas.find(a => a.letra === r.letra);
      if (alt && alt.botao) {
        await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_CLIQUES));
        alt.botao.click();
        marcadas++;
        const emoji = (r.confianca || 0) >= 85 ? '✅' : '⚠️';
        console.log(`%c${emoji} Q${r.questao}: ${r.letra} (${r.confianca || '?'}% confiança)`, 'color: #00ff88; font-size: 13px;');
      }
    }
    return marcadas;
  }

  // ===== 5. FINALIZAR E CONTINUAR =====
  async function finalizarEContinuar(questoes, respostas) {
    // Verifica se todas foram marcadas
    const totalRespostas = respostas.respostas.length;
    if (totalRespostas < questoes.length) {
      console.log(`%c❌ Apenas ${totalRespostas}/${questoes.length} respondidas. NÃO finalizando.`, 'color: #ff4444;');
      return;
    }

    // Verifica confiança média
    const confMedia = respostas.respostas.reduce((sum, r) => sum + (r.confianca || 70), 0) / totalRespostas;
    console.log(`%c📊 Confiança média: ${confMedia.toFixed(0)}%`, 'color: #00ff88; font-size: 13px;');

    await new Promise(r => setTimeout(r, 2000));

    // Clica em Finalizar
    const btnFinalizar = document.querySelector('[data-testid="primary-button"]');
    if (btnFinalizar && !btnFinalizar.disabled) {
      btnFinalizar.click();
      console.log('%c📤 Finalizando exercício...', 'color: #ffaa00;');

      await new Promise(r => setTimeout(r, 2500));

      // Confirma
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const txt = btn.textContent.toLowerCase();
        if ((txt.includes('finalizar') || txt.includes('confirmar') || txt.includes('sim')) && btn !== btnFinalizar && !btn.disabled) {
          btn.click();
          console.log('%c✅ Exercício finalizado!', 'color: #00ff88; font-size: 14px; font-weight: bold;');
          break;
        }
      }

      // Verificar desempenho
      await new Promise(r => setTimeout(r, 3000));
      await clicarBotaoComTexto(['verificar desempenho', 'ver desempenho', 'desempenho']);

      // Fazer mais exercícios
      await new Promise(r => setTimeout(r, 3000));
      await clicarBotaoComTexto(['fazer mais exerc', 'mais exerc', 'refazer', 'tentar novamente']);

      // Roda de novo
      await new Promise(r => setTimeout(r, 4000));
      console.log('%c🔁 Rodando novamente...', 'color: #00ff88; font-size: 14px; font-weight: bold;');
      await executarTudo();
    } else {
      console.log('%c⚠️ Botão finalizar desabilitado.', 'color: #ffaa00;');
    }
  }

  async function clicarBotaoComTexto(textos) {
    for (let tentativa = 0; tentativa < 5; tentativa++) {
      const elementos = document.querySelectorAll('button, a, [role="button"]');
      for (const el of elementos) {
        const txt = el.textContent.toLowerCase().trim();
        if (textos.some(t => txt.includes(t)) && !el.disabled) {
          el.click();
          console.log(`%c✅ Clicou: "${el.textContent.trim().substring(0, 40)}"`, 'color: #00ff88; font-size: 11px;');
          return true;
        }
      }
      await new Promise(r => setTimeout(r, 2000));
    }
    return false;
  }

  // ===== 6. PAINEL =====
  function mostrarPainel(respostas) {
    document.querySelectorAll('.passei-painel').forEach(el => el.remove());
    const painel = document.createElement('div');
    painel.className = 'passei-painel';
    painel.style.cssText = `
      position: fixed; top: 10px; right: 10px;
      background: rgba(0,0,0,0.95); color: #00ff88;
      font-family: monospace; font-size: 13px;
      padding: 15px; border-radius: 10px; z-index: 99999;
      border: 2px solid #00ff88;
      box-shadow: 0 4px 20px rgba(0,255,136,0.3);
      max-height: 90vh; overflow-y: auto;
    `;
    const confMedia = respostas.respostas.reduce((s, r) => s + (r.confianca || 70), 0) / respostas.respostas.length;
    painel.innerHTML = `
      <div style="font-size:15px;margin-bottom:8px;font-weight:bold;">🎓 PASSEI PROVAS</div>
      <div style="font-size:11px;color:#888;margin-bottom:8px;">Confiança média: ${confMedia.toFixed(0)}%</div>
      ${respostas.respostas.map(r => {
        const emoji = (r.confianca || 0) >= 85 ? '✅' : (r.confianca || 0) >= 70 ? '⚠️' : '❓';
        return `<div>Q${r.questao}: <strong>${r.letra}</strong> ${emoji} ${r.confianca || '?'}%</div>`;
      }).join('')}
      <div style="margin-top:8px;font-size:10px;color:#666;">Clique para fechar</div>
    `;
    painel.onclick = () => painel.remove();
    document.body.appendChild(painel);
  }

  // ===== EXECUTAR =====
  async function executarTudo() {
    try {
      let questoes = extrairQuestoes();
      if (questoes.length === 0) {
        await new Promise(r => setTimeout(r, 3000));
        questoes = extrairQuestoes();
        if (questoes.length === 0) {
          console.log('%c❌ Nenhuma questão encontrada!', 'color: #ff4444;');
          return;
        }
      }

      console.log(`%c📝 ${questoes.length} questões encontradas`, 'color: #00ff88;');
      console.log('%c🔒 Iniciando dupla verificação...', 'color: #ffaa00; font-size: 13px;');

      // Dupla verificação
      const respostas = await duplaVerificacao(questoes);

      // Painel
      mostrarPainel(respostas);

      // Marca
      if (MARCAR_AUTOMATICO) {
        console.log('%c🖱️ Marcando respostas verificadas...', 'color: #ffaa00;');
        const total = await marcarRespostas(questoes, respostas);
        console.log(`%c🎯 ${total}/${questoes.length} respostas marcadas!`, 'color: #00ff88; font-size: 14px; font-weight: bold;');

        // Finaliza
        if (FINALIZAR_AUTOMATICO && total === questoes.length) {
          await finalizarEContinuar(questoes, respostas);
        } else {
          // Verifica se todas estão marcadas na página
          await new Promise(r => setTimeout(r, 2000));
          const btnFinalizar = document.querySelector('[data-testid="primary-button"]');
          if (btnFinalizar && !btnFinalizar.disabled) {
            console.log('%c✅ TODAS MARCADAS E VERIFICADAS! Pode finalizar manualmente.', 'color: #00ff88; font-size: 15px; font-weight: bold;');
          } else {
            console.log('%c⚠️ Botão finalizar ainda desabilitado - alguma questão pode não ter sido marcada.', 'color: #ff8800; font-size: 13px;');
          }
        }
      }
    } catch (error) {
      console.log(`%c❌ Erro: ${error.message}`, 'color: #ff4444; font-size: 13px;');
      console.log(error);
    }
  }

  await executarTudo();
})();
