/**
 * O ÚLTIMO TURNO — RENDERIZADOR DE CENÁRIOS EM PRIMEIRA PESSOA
 * Renderiza os cenários fotorrealistas em alta resolução com hotspots diegéticos
 * e atributos data-action para a barra de ação global (#action-prompt).
 */

class RoomRenderer {
  // ==========================================
  // CAPÍTULO 1 — SALA DE OBSERVAÇÃO / ESCRITÓRIO
  // ==========================================
  getChapter1Markup() {
    const isLockerOpen = gameState.getFlag('cap1_lockerUnlocked');
    const isPhoneAnswered = gameState.getFlag('cap1_phoneAnswered');

    return `
      <div class="realistic-room-scene room-cap1">
        <!-- Telefone de Baquelite sobre a Mesa -->
        <div class="scene-hotspot" id="hs-cap1-phone" data-action="${!isPhoneAnswered ? '📞 ATENDER TELEFONE' : '📞 TELEFONE MUDO'}" title="Telefone"></div>

        <!-- Documento / Protocolo de Observação sobre a Mesa -->
        <div class="scene-hotspot" id="hs-cap1-doc" data-action="📄 LER PROTOCOLO CONFIDENCIAL" title="Protocolo de Observação"></div>

        <!-- Relógio de Parede 02:17 -->
        <div class="scene-hotspot" id="hs-cap1-clock" data-action="🔍 EXAMINAR RELÓGIO (02:17)" title="Relógio de Parede"></div>

        <!-- Armário Metálico com Cadeado -->
        <div class="scene-hotspot" id="hs-cap1-locker" data-action="${isLockerOpen ? '🔐 ARMÁRIO ABERTO' : '🔐 DESTRAVAR ARMÁRIO (CADEADO)'}" title="Armário Metálico"></div>

        <!-- Porta de Ferro para o Corredor -->
        <div class="scene-hotspot" id="hs-cap1-door" data-action="🚪 ABRIR PORTA DE SAÍDA" title="Porta de Saída"></div>
      </div>
    `;
  }

  // ==========================================
  // CAPÍTULO 2 — O CORREDOR & QUADRO DE FORÇA
  // ==========================================
  getChapter2Markup() {
    return `
      <div class="realistic-room-scene room-cap2">
        <!-- Quadro de Força / Disjuntores 220V -->
        <div class="scene-hotspot" id="hs-cap2-breaker" data-action="⚡ CALIBRAR DISJUNTORES (220V)" title="Quadro de Força"></div>

        <!-- Monitor de CFTV com Anomalia Temporal -->
        <div class="scene-hotspot" id="hs-cap2-cctv" data-action="📹 EXAMINAR CFTV (ANOMALIA)" title="Monitor de Segurança"></div>

        <!-- Porta de Acesso ao Laboratório -->
        <div class="scene-hotspot" id="hs-cap2-door-lab" data-action="🚪 ENTRAR NO LABORATÓRIO" title="Porta do Laboratório"></div>

        <!-- Porta Vermelha ao Fundo -->
        <div class="scene-hotspot" id="hs-cap2-door-red" data-action="🚪 OBSERVAR PORTA VERMELHA" title="Porta Vermelha"></div>
      </div>
    `;
  }

  // ==========================================
  // CAPÍTULO 3 — O LABORATÓRIO DE NEUROCIÊNCIA
  // ==========================================
  getChapter3Markup() {
    return `
      <div class="realistic-room-scene room-cap3">
        <!-- Vidrarias e Reagentes na Bancada -->
        <div class="scene-hotspot" id="hs-cap3-bench" data-action="🧪 EXAMINAR REAGENTES QUÍMICOS" title="Bancada de Reagentes"></div>

        <!-- Documento das Diretrizes Aurora -->
        <div class="scene-hotspot" id="hs-cap3-doc" data-action="📄 LER DIRETRIZES DO PROJETO AURORA" title="Documento Aurora"></div>

        <!-- Terminal IBM / DOS Aurora OS -->
        <div class="scene-hotspot" id="hs-cap3-terminal" data-action="💻 ACESSAR TERMINAL DOS (AURORA OS)" title="Terminal DOS"></div>

        <!-- Porta para a Sala de Arquivos -->
        <div class="scene-hotspot" id="hs-cap3-door-archive" data-action="🚪 PORTA PARA OS ARQUIVOS" title="Porta dos Arquivos"></div>
      </div>
    `;
  }

  // ==========================================
  // CAPÍTULO 4 — AS GRAVAÇÕES (FITAS CASSETE)
  // ==========================================
  getChapter4Markup() {
    return `
      <div class="realistic-room-scene room-cap4">
        <!-- Gravador de Rolo Analógico de Estúdio -->
        <div class="scene-hotspot" id="hs-cap4-player" data-action="📼 REPRODUZIR GRAVAÇÕES EM FITA" title="Gravador de Rolo"></div>

        <!-- Estante com Caixas de Fitas -->
        <div class="scene-hotspot" id="hs-cap4-tape-shelf" data-action="📂 COLETAR FITAS CASSETE" title="Arquivo de Fitas"></div>

        <!-- Porta Blindada para a Câmara 02:17 -->
        <div class="scene-hotspot" id="hs-cap4-door-clocks" data-action="🚪 ENTRAR NA CÂMARA 02:17" title="Porta para 02:17"></div>
      </div>
    `;
  }

  // ==========================================
  // CAPÍTULO 5 — A SALA 02:17
  // ==========================================
  getChapter5Markup() {
    const isWallOpen = gameState.getFlag('cap5_secretWallOpened');

    return `
      <div class="realistic-room-scene room-cap5">
        <!-- Painel dos Relógios para Sincronização -->
        <div class="scene-hotspot" id="hs-cap5-clocks-panel" data-action="⏱ SINCRONIZAR RELÓGIOS (02:17)" title="Painel de Relógios"></div>

        <!-- Cofre Secreta / Monitor de Vídeo -->
        <div class="scene-hotspot" id="hs-cap5-secret-chamber" data-action="${isWallOpen ? '📺 ASSISTIR GRAVAÇÃO DO MONITOR' : '📺 COFRE TEMPORAL BLOQUEADO'}" title="Cofre Temporal"></div>
      </div>
    `;
  }

  // ==========================================
  // CAPÍTULO 6 — A PORTA VERMELHA & ESPELHO
  // ==========================================
  getChapter6Markup() {
    const isEntered = gameState.getFlag('cap6_redDoorEntered');

    if (!isEntered) {
      return `
        <div class="realistic-room-scene room-cap6-outside">
          <!-- A Monumental Porta Vermelha Blindada -->
          <div class="scene-hotspot" id="hs-cap6-red-door" data-action="🚪 DESTRAVAR A PORTA VERMELHA COM A CHAVE MESTRA" title="A Porta Vermelha"></div>
        </div>
      `;
    }

    // Interior com Espelho Embaçado
    return `
      <div class="realistic-room-scene room-cap6-inside">
        <!-- Espelho Embaçado com Condensação -->
        <div class="scene-hotspot" id="hs-cap6-mirror" data-action="🪞 EXAMINAR ESPELHO ('LEMBRE-SE')" title="Espelho Embaçado"></div>

        <!-- Telefone na Parede -->
        <div class="scene-hotspot" id="hs-cap6-phone" data-action="📞 ATENDER CHAMADA TELEFÔNICA" title="Telefone de Parede"></div>

        <!-- Porta para os Arquivos Centrais -->
        <div class="scene-hotspot" id="hs-cap6-door-truth" data-action="🚪 AVANÇAR PARA A VERDADE" title="Porta dos Arquivos"></div>
      </div>
    `;
  }

  // ==========================================
  // CAPÍTULO 7 — A VERDADE
  // ==========================================
  getChapter7Markup() {
    return `
      <div class="realistic-room-scene room-cap7">
        <!-- Tela do Projetor com Dossiês -->
        <div class="scene-hotspot" id="hs-cap7-projector-screen" data-action="📂 EXAMINAR DOSSIÊ DO DR. VANCE" title="Dossiê Projetado"></div>

        <!-- Porta para a Ponte Central -->
        <div class="scene-hotspot" id="hs-cap7-door-final" data-action="🚪 AVANÇAR PARA O CAPÍTULO 8" title="Ponte Central"></div>
      </div>
    `;
  }

  // ==========================================
  // CAPÍTULO 8 — O ÚLTIMO TURNO (FINAL)
  // ==========================================
  getChapter8Markup() {
    return `
      <div class="realistic-room-scene room-cap8">
        <!-- Console Central de Decisão Final -->
        <div class="scene-hotspot" id="hs-cap8-console" data-action="⚡ ACIONAR CONSOLE DE DECISÃO FINAL" title="Console Central"></div>
      </div>
    `;
  }
}

window.roomRenderer = new RoomRenderer();
