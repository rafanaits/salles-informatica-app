// ============================================
// 🎓 PASSEI ASSISTIR - Estácio (Auto-clique quando liberar)
// ============================================
// O timer de 15 min é validado no servidor, não dá pra pular.
// Este script ESPERA liberar e clica automaticamente em "Já assisti".
// Depois avança pra próxima aula e repete.
// ============================================
// COMO USAR: Cole no console e deixe a aba aberta. Pode minimizar.
// Ele vai clicar sozinho quando o tempo passar.
// ============================================

(function () {
  console.clear();
  console.log('%c🎓 PASSEI ASSISTIR - Estácio', 'color: #00ff88; font-size: 16px; font-weight: bold;');
  console.log('%c⏳ Aguardando timer liberar... Pode minimizar a aba.', 'color: #ffaa00; font-size: 13px;');
  console.log('%c💡 O script clica automaticamente quando "Já assisti" ficar disponível.', 'color: #fff; font-size: 12px;');

  let aulasAssistidas = 0;
  const inicio = Date.now();

  function formatarTempo(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return `${m}:${seg.toString().padStart(2, '0')}`;
  }

  function tentarClicar() {
    // Procura botões que indicam conclusão da aula
    const botoes = document.querySelectorAll('button, a, [role="button"], span');
    for (const btn of botoes) {
      const txt = (btn.textContent || '').toLowerCase().trim();

      // Detecta o timer (conta pra frente) ex: "marcar como concluído (08:37)"
      const timerMatch = /\((\d{2}):(\d{2})\)/.exec(txt);
      if (timerMatch && txt.includes('marcar como conclu')) {
        const minutos = parseInt(timerMatch[1]);
        const segundos = parseInt(timerMatch[2]);
        // Atualiza título da aba com tempo atual
        document.title = `⏳ ${timerMatch[1]}:${timerMatch[2]} / 15:00 | PASSEI`;
        // Ainda não chegou em 15 min, não clica
        if (minutos < 15) {
          return false;
        }
      }
      const isAlvo = txt.includes('já assisti') || txt.includes('ja assisti') ||
                     txt.includes('marcar como assistid') || txt.includes('concluir') ||
                     txt.includes('marcar como conclu') || txt.includes('marcar como concluído') ||
                     txt.includes('próximo conteúdo') || txt.includes('proximo conteudo') ||
                     txt.includes('avançar') || txt.includes('avancar') ||
                     txt === 'próximo' || txt === 'proximo' || txt.includes('next');

      // Se tem contador (ex: "marcar como concluído (08:37)"), só clica quando >= 15:00 ou sem timer
      const temTimer = /\((\d{2}):(\d{2})\)/.exec(txt);
      if (isAlvo && temTimer) {
        const min = parseInt(temTimer[1]);
        if (min < 15) {
          return false;
        }
      }

      if (isAlvo && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true' &&
          getComputedStyle(btn).pointerEvents !== 'none' && getComputedStyle(btn).opacity !== '0') {
        btn.click();
        aulasAssistidas++;
        const tempo = formatarTempo(Date.now() - inicio);
        console.log(`%c✅ [${tempo}] Clicou: "${txt.substring(0, 30)}" (Aula #${aulasAssistidas})`, 'color: #00ff88; font-size: 13px; font-weight: bold;');

        // Espera a próxima aula carregar e continua monitorando
        setTimeout(() => {
          console.log(`%c⏳ Aguardando próxima aula liberar...`, 'color: #ffaa00; font-size: 12px;');
        }, 5000);

        return true;
      }
    }
    return false;
  }

  // Monitora a cada 5 segundos
  const intervalo = setInterval(() => {
    const clicou = tentarClicar();
    if (!clicou) {
      // Mostra progresso a cada 30 segundos
      const elapsed = Date.now() - inicio;
      if (Math.floor(elapsed / 1000) % 30 === 0) {
        console.log(`%c⏳ [${formatarTempo(elapsed)}] Aguardando... (${aulasAssistidas} aulas concluídas)`, 'color: #888; font-size: 11px;');
      }
    }
  }, 5000);

  // Também usa MutationObserver pra detectar mudanças mais rápido
  const observer = new MutationObserver(() => {
    tentarClicar();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['disabled', 'aria-disabled', 'class', 'style']
  });

  // Mostra status no título da aba
  setInterval(() => {
    const elapsed = formatarTempo(Date.now() - inicio);
    document.title = `⏳ ${elapsed} | ${aulasAssistidas} aulas | PASSEI`;
  }, 1000);

  console.log('%c─'.repeat(40), 'color: #333;');
  console.log('%c📌 Dica: Abra várias abas com aulas diferentes pra ir mais rápido!', 'color: #fff; font-size: 12px;');
  console.log('%c📌 O título da aba mostra o tempo decorrido.', 'color: #fff; font-size: 12px;');
  console.log('%c─'.repeat(40), 'color: #333;');
})();
