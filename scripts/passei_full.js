// ============================================
// 🎓 PASSEI FULL AUTO - Lê, responde, marca e finaliza TUDO sozinho
// ============================================
// Cole no console (F12) e espere. Ele faz tudo.
// Depois de finalizar, clica em "Fazer mais exercícios" e roda de novo!
// ============================================

(async function () {
  console.clear();
  console.log('%c🎓 PASSEI FULL AUTO', 'color: #00ff88; font-size: 18px; font-weight: bold;');
  console.log('%c⏳ Lendo questões, buscando respostas e marcando...', 'color: #ffaa00; font-size: 13px;');

  // ===== CONFIG =====
  const GROQ_KEY = 'SUA_GROQ_KEY';
  const DELAY_ENTRE_CLIQUES = 1500; // ms entre cada clique
  const MARCAR_AUTOMATICO = true;
  const FINALIZAR_AUTOMATICO = true; // clica em finalizar no final
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
        console.log(`%c📖 Q${questoes.length}: ${enunciado.substring(0, 80)}...`, 'color: #aaa; font-size: 11px;');
      }
    });
    return questoes;
  }

  // ===== 2. CHAMAR GROQ API =====
  async function chamarGroq(questoes) {
    let prompt = `Você é um especialista em tecnologia, programação e React Native. Analise cada questão e responda com a alternativa CORRETA.

REGRAS IMPORTANTES:
- Responda TODAS as ${questoes.length} questões
- Responda APENAS com JSON puro, sem explicação
- Use EXATAMENTE este formato:
{"respostas": [{"questao": 1, "letra": "A"}, {"questao": 2, "letra": "B"}, {"questao": 3, "letra": "C"}, {"questao": 4, "letra": "D"}, {"questao": 5, "letra": "E"}, {"questao": 6, "letra": "A"}, {"questao": 7, "letra": "B"}, {"questao": 8, "letra": "C"}, {"questao": 9, "letra": "D"}, {"questao": 10, "letra": "E"}]}

Questões:\n\n`;

    questoes.forEach(q => {
      prompt += `Questão ${q.numero}: ${q.enunciado}\n`;
      q.alternativas.forEach(a => prompt += `${a.letra}) ${a.texto}\n`);
      prompt += '\n';
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq erro (${response.status}): ${err.substring(0, 200)}`);
    }

    const data = await response.json();
    const texto = data.choices[0].message.content.trim();
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Resposta não contém JSON válido');
    const resultado = JSON.parse(jsonMatch[0]);

    // Verifica se todas as questões foram respondidas
    if (resultado.respostas.length < questoes.length) {
      console.log(`%c⚠️ IA respondeu ${resultado.respostas.length}/${questoes.length}. Completando...`, 'color: #ffaa00;');
    }

    return resultado;
  }

  // ===== 3. MARCAR RESPOSTAS =====
  async function marcarRespostas(questoes, respostas) {
    let marcadas = 0;
    for (const q of questoes) {
      const r = respostas.respostas.find(x => x.questao === q.numero);
      if (!r) {
        console.log(`%c⚠️ Q${q.numero}: sem resposta da IA, marcando A`, 'color: #ffaa00; font-size: 12px;');
        // Marca A como fallback
        const altA = q.alternativas[0];
        if (altA && altA.botao) {
          await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_CLIQUES));
          altA.botao.click();
          marcadas++;
        }
        continue;
      }

      const alt = q.alternativas.find(a => a.letra === r.letra);
      if (alt && alt.botao && MARCAR_AUTOMATICO) {
        await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_CLIQUES));
        alt.botao.click();
        marcadas++;
        console.log(`%c✅ Q${r.questao}: ${r.letra}`, 'color: #00ff88; font-size: 13px;');
      } else if (!alt) {
        // Letra não encontrada, marca a primeira
        console.log(`%c⚠️ Q${q.numero}: letra "${r.letra}" não encontrada, marcando A`, 'color: #ffaa00; font-size: 12px;');
        const altFallback = q.alternativas[0];
        if (altFallback && altFallback.botao) {
          await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_CLIQUES));
          altFallback.botao.click();
          marcadas++;
        }
      }
    }
    return marcadas;
  }

  // ===== 4. FINALIZAR EXERCÍCIO E CONTINUAR =====
  async function finalizarEContinuar() {
    // Espera um pouco após marcar tudo
    await new Promise(r => setTimeout(r, 2000));

    // Clica no botão "Finalizar exercício"
    const btnFinalizar = document.querySelector('[data-testid="primary-button"]');
    if (btnFinalizar && !btnFinalizar.disabled) {
      btnFinalizar.click();
      console.log('%c📤 Clicou em "Finalizar exercício"...', 'color: #ffaa00; font-size: 13px;');

      // Espera o modal de confirmação aparecer
      await new Promise(r => setTimeout(r, 2000));

      // Procura botão de confirmação
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const txt = btn.textContent.toLowerCase();
        if ((txt.includes('finalizar') || txt.includes('confirmar') || txt.includes('sim') || txt.includes('enviar')) && btn !== btnFinalizar && !btn.disabled) {
          btn.click();
          console.log('%c✅ Exercício finalizado!', 'color: #00ff88; font-size: 14px; font-weight: bold;');
          break;
        }
      }
    } else {
      console.log('%c⚠️ Botão finalizar desabilitado.', 'color: #ffaa00;');
      return;
    }

    // Espera a página de resultado carregar
    await new Promise(r => setTimeout(r, 3000));

    // Clica em "Verificar desempenho"
    console.log('%c📊 Procurando "Verificar desempenho"...', 'color: #ffaa00;');
    await clicarBotaoComTexto(['verificar desempenho', 'ver desempenho', 'desempenho']);

    // Espera a página de desempenho carregar
    await new Promise(r => setTimeout(r, 3000));

    // Clica em "Fazer mais exercícios"
    console.log('%c🔄 Procurando "Fazer mais exercícios"...', 'color: #ffaa00;');
    await clicarBotaoComTexto(['fazer mais exerc', 'mais exerc', 'refazer', 'tentar novamente', 'nova tentativa']);

    // Espera a nova prova carregar
    await new Promise(r => setTimeout(r, 4000));

    // RODA O SCRIPT DE NOVO AUTOMATICAMENTE!
    console.log('%c🔁 Nova prova detectada! Rodando novamente...', 'color: #00ff88; font-size: 14px; font-weight: bold;');
    await executarTudo();
  }

  // ===== HELPER: Clicar em botão/link pelo texto =====
  async function clicarBotaoComTexto(textos) {
    // Tenta várias vezes (a página pode estar carregando)
    for (let tentativa = 0; tentativa < 5; tentativa++) {
      const elementos = document.querySelectorAll('button, a, [role="button"]');
      for (const el of elementos) {
        const txt = el.textContent.toLowerCase().trim();
        if (textos.some(t => txt.includes(t)) && !el.disabled) {
          el.click();
          console.log(`%c✅ Clicou: "${el.textContent.trim().substring(0, 40)}"`, 'color: #00ff88; font-size: 12px;');
          return true;
        }
      }
      // Se não encontrou, espera e tenta de novo
      await new Promise(r => setTimeout(r, 2000));
    }
    console.log('%c⚠️ Botão não encontrado. Pode precisar clicar manualmente.', 'color: #ffaa00;');
    return false;
  }

  // ===== 5. MOSTRAR PAINEL =====
  function mostrarPainel(respostas) {
    document.querySelectorAll('.passei-painel').forEach(el => el.remove());
    const painel = document.createElement('div');
    painel.className = 'passei-painel';
    painel.style.cssText = `
      position: fixed; top: 10px; right: 10px;
      background: rgba(0,0,0,0.95); color: #00ff88;
      font-family: monospace; font-size: 14px;
      padding: 15px; border-radius: 10px; z-index: 99999;
      border: 2px solid #00ff88;
      box-shadow: 0 4px 20px rgba(0,255,136,0.3);
    `;
    painel.innerHTML = `
      <div style="font-size:16px;margin-bottom:8px;font-weight:bold;">🎓 PASSEI AUTO</div>
      ${respostas.respostas.map(r => `<div>Q${r.questao}: <strong>${r.letra}</strong> ✅</div>`).join('')}
      <div style="margin-top:8px;font-size:11px;color:#aaa;">Clique para fechar</div>
    `;
    painel.onclick = () => painel.remove();
    document.body.appendChild(painel);
  }

  // ===== EXECUTAR TUDO =====
  async function executarTudo() {
    try {
      const questoes = extrairQuestoes();
      if (questoes.length === 0) {
        console.log('%c⏳ Aguardando questões carregarem...', 'color: #ffaa00;');
        await new Promise(r => setTimeout(r, 3000));
        const questoes2 = extrairQuestoes();
        if (questoes2.length === 0) {
          console.log('%c❌ Nenhuma questão encontrada!', 'color: #ff4444;');
          return;
        }
        return await processarQuestoes(questoes2);
      }
      return await processarQuestoes(questoes);
    } catch (error) {
      console.log(`%c❌ Erro: ${error.message}`, 'color: #ff4444; font-size: 13px;');
      console.log(error);
    }
  }

  async function processarQuestoes(questoes) {
    console.log(`%c📝 ${questoes.length} questões encontradas. Consultando IA...`, 'color: #00ff88;');

    // Chama Groq
    const respostas = await chamarGroq(questoes);
    console.log('%c🧠 Respostas recebidas!', 'color: #00ff88; font-size: 13px;');

    // Mostra painel
    mostrarPainel(respostas);

    // Marca respostas
    if (MARCAR_AUTOMATICO) {
      console.log('%c🖱️ Marcando respostas...', 'color: #ffaa00;');
      const total = await marcarRespostas(questoes, respostas);
      console.log(`%c🎯 ${total} respostas marcadas!`, 'color: #00ff88; font-size: 14px; font-weight: bold;');

      // Finaliza e continua
      if (FINALIZAR_AUTOMATICO && total === questoes.length) {
        await finalizarEContinuar();
      }
    }
  }

  // Inicia!
  await executarTudo();
})();
