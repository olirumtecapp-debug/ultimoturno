/**
 * O ÚLTIMO TURNO — CONTROLADOR DOS QUEBRA-CABEÇAS TÁTEIS & DISPOSITIVOS
 * Implementa toda a lógica dos puzzles dos 8 capítulos: cofre de 4 dígitos,
 * quadro elétrico, terminal DOS Aurora OS, reprodutor de fitas, relógios 02:17 e console final.
 */

class PuzzleSystem {
  constructor() {
    this.puzzleModal = document.getElementById('modal-puzzle-view');
    this.puzzleTitle = document.getElementById('puzzle-title');
    this.puzzleContainer = document.getElementById('puzzle-interactive-container');
    this.btnClosePuzzle = document.getElementById('btn-close-puzzle');

    this.journalModal = document.getElementById('modal-journal');
    this.btnCloseJournal = document.getElementById('btn-close-journal');
    this.journalContentList = document.getElementById('journal-content-list');
    this.journalReader = document.getElementById('journal-reader');

    this.initEventListeners();
  }

  initEventListeners() {
    if (this.btnClosePuzzle) {
      this.btnClosePuzzle.addEventListener('click', () => this.closePuzzle());
    }

    if (this.btnCloseJournal) {
      this.btnCloseJournal.addEventListener('click', () => {
        if (this.journalModal) this.journalModal.classList.add('hidden');
      });
    }

    // Abas do Diário
    const journalTabs = document.querySelectorAll('.journal-tab-btn');
    journalTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        journalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderJournalTab(tab.dataset.tab);
      });
    });
  }

  closePuzzle() {
    soundEngine.stopVoice();
    if (this.puzzleModal) {
      this.puzzleModal.classList.add('hidden');
    }
  }

  // ==========================================
  // 1. PUZZLE DO COFRE / ARMÁRIO (CAPÍTULO 1)
  // Combinação: 5 - 2 - 1 - 7
  // ==========================================
  openSafePuzzle() {
    if (this.puzzleTitle) this.puzzleTitle.textContent = 'CADEADO DIGITAL DO ARMÁRIO DE OBSERVAÇÃO';
    
    let digits = [0, 0, 0, 0];

    const renderSafe = () => {
      this.puzzleContainer.innerHTML = `
        <div class="safe-lock-widget">
          <div style="font-family: monospace; font-size: 0.75rem; color: #8b949e; letter-spacing: 2px;">
            INSIRA A COMBINAÇÃO DE 4 DÍGITOS
          </div>

          <div class="safe-digits-display">
            ${[0, 1, 2, 3].map(i => `
              <div class="digit-drum-col">
                <button class="btn-digit-step" data-action="up" data-index="${i}">▲</button>
                <div class="digit-drum-value" id="safe-drum-${i}">${digits[i]}</div>
                <button class="btn-digit-step" data-action="down" data-index="${i}">▼</button>
              </div>
            `).join('')}
          </div>

          <div class="safe-feedback-text" id="safe-status">AGUARDANDO SEQUÊNCIA CORRETA</div>
          
          <button class="retro-btn btn-primary" id="btn-submit-safe">
            <span class="btn-led"></span>
            <span>DESTRAVAR FECHADURA</span>
          </button>
        </div>
      `;

      // Eventos de clique nos botões de dígito
      const stepBtns = this.puzzleContainer.querySelectorAll('.btn-digit-step');
      stepBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          soundEngine.playButtonClick();
          const idx = parseInt(btn.dataset.index);
          const act = btn.dataset.action;
          if (act === 'up') {
            digits[idx] = (digits[idx] + 1) % 10;
          } else {
            digits[idx] = (digits[idx] + 9) % 10;
          }
          const drum = document.getElementById(`safe-drum-${idx}`);
          if (drum) drum.textContent = digits[idx];
        });
      });

      const btnSubmit = document.getElementById('btn-submit-safe');
      if (btnSubmit) {
        btnSubmit.addEventListener('click', () => {
          const code = digits.join('');
          if (code === '5217') {
            soundEngine.playDoorUnlock();
            const statusEl = document.getElementById('safe-status');
            if (statusEl) {
              statusEl.textContent = 'ACESSO PERMITIDO! ARMÁRIO ABERTO.';
              statusEl.style.color = '#22c55e';
            }

            gameState.setFlag('cap1_lockerUnlocked', true);
            gameState.addItem('item_photo_researchers');
            gameState.addItem('item_rusty_key');
            gameState.addItem('item_cassette_01');

            setTimeout(() => {
              this.closePuzzle();
              sceneManager.renderCurrentScene();
              if (window.toast) window.toast('Armário aberto! Chave, Foto e Fita adicionados ao inventário.');
            }, 1200);
          } else {
            soundEngine.playMemoryGlitch();
            const statusEl = document.getElementById('safe-status');
            if (statusEl) {
              statusEl.textContent = 'CÓDIGO INCORRETO. CONSULTE AS PISTAS.';
              statusEl.style.color = '#ef4444';
            }
          }
        });
      }
    };

    renderSafe();
    if (this.puzzleModal) this.puzzleModal.classList.remove('hidden');
  }

  // ==========================================
  // 2. PUZZLE DO QUADRO ELÉTRICO (CAPÍTULO 2)
  // Combinação correta: ON - OFF - ON - ON - OFF
  // ==========================================
  openBreakerPuzzle() {
    soundEngine.init();
    soundEngine.resume();
    if (this.puzzleTitle) this.puzzleTitle.textContent = 'QUADRO DE DISTRIBUIÇÃO DE ENERGIA — SETOR B';

    let switches = [false, false, false, false, false];

    const renderBreakers = () => {
      const activeCount = switches.filter(Boolean).length;
      const voltage = switches[0] && !switches[1] && switches[2] && switches[3] && !switches[4] ? 220 : activeCount * 45;

      this.puzzleContainer.innerHTML = `
        <div class="breaker-panel-widget">
          <div class="breaker-header-gauges">
            <div class="voltmeter-display">
              <span>TENSÃO NOMINAL:</span>
              <span class="voltage-val" id="voltage-readout">${voltage}V</span>
            </div>
            <div style="font-family: monospace; font-size: 0.72rem; color: #94a3b8;">
              PADRÃO EXIGIDO: <strong style="color: #22c55e;">220V ESTÁVEL</strong>
            </div>
          </div>

          <div class="breaker-switches-grid">
            ${[0, 1, 2, 3, 4].map(i => `
              <div class="breaker-switch-item">
                <span class="breaker-label">CH-0${i + 1}</span>
                <div class="breaker-toggle-lever ${switches[i] ? 'on' : ''}" data-index="${i}">
                  <div class="breaker-toggle-handle"></div>
                </div>
                <span style="font-size: 0.65rem; color: ${switches[i] ? '#22c55e' : '#ef4444'}; font-family: monospace;">
                  ${switches[i] ? 'LIG' : 'DESL'}
                </span>
              </div>
            `).join('')}
          </div>

          <button class="retro-btn btn-primary" id="btn-energize-panel" style="width: 100%;">
            <span class="btn-led"></span>
            <span>ENERGIZAR BARRAMENTO PRINCIPAL</span>
          </button>
        </div>
      `;

      const levers = this.puzzleContainer.querySelectorAll('.breaker-toggle-lever');
      levers.forEach(lever => {
        lever.addEventListener('click', () => {
          soundEngine.playBreakerSwitch();
          const idx = parseInt(lever.dataset.index);
          switches[idx] = !switches[idx];
          renderBreakers();
        });
      });

      const btnEnergize = document.getElementById('btn-energize-panel');
      if (btnEnergize) {
        btnEnergize.addEventListener('click', () => {
          // Verifica se a combinação é ON, OFF, ON, ON, OFF
          if (switches[0] && !switches[1] && switches[2] && switches[3] && !switches[4]) {
            soundEngine.playBreakerSwitch();
            soundEngine.playLightBulbBurst();

            gameState.setFlag('cap2_breakerRestored', true);
            gameState.setFlag('cap2_emergencyLightsActive', true);

            if (window.toast) window.toast('Energia restaurada! Uma lâmpada estourou no corredor.');

            setTimeout(() => {
              this.closePuzzle();
              sceneManager.renderCurrentScene();
            }, 1000);
          } else {
            soundEngine.playMemoryGlitch();
            if (window.toast) window.toast('Sobrecarga no circuito! Ajuste a posição dos disjuntores.');
          }
        });
      }
    };

    renderBreakers();
    if (this.puzzleModal) this.puzzleModal.classList.remove('hidden');
  }

  // ==========================================
  // 3. TERMINAL DOS / AURORA OS (CAPÍTULO 3)
  // ==========================================
  openTerminalPuzzle() {
    if (this.puzzleTitle) this.puzzleTitle.textContent = 'TERMINAL COGNITIVO AURORA OS v2.1';

    let history = [
      'INSTITUTO AURORA — SISTEMA DE ARQUIVOS NEUROCOGNITIVOS',
      'DIGITE "HELP" PARA LISTAR COMANDOS DISPONÍVEIS.',
      '---------------------------------------------------'
    ];

    const renderTerminal = () => {
      this.puzzleContainer.innerHTML = `
        <div class="aurora-terminal-widget">
          <div class="terminal-crt-scanline"></div>
          <div class="terminal-header-bar">
            <span>AURORA OS // NÓ LOCAL 05</span>
            <span>MEMÓRIA: 640KB LIVRES</span>
          </div>
          <div class="terminal-screen-output" id="term-out">${history.join('\n')}</div>
          <div class="terminal-input-row">
            <span class="terminal-prompt">C:\\AURORA&gt;</span>
            <input type="text" class="terminal-input" id="term-in" autofocus autocomplete="off" spellcheck="false">
          </div>
        </div>
      `;

      const input = document.getElementById('term-in');
      const output = document.getElementById('term-out');

      if (input) {
        input.focus();
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const cmd = input.value.trim().toUpperCase();
            soundEngine.playTypewriterKey();
            input.value = '';

            history.push(`C:\\AURORA> ${cmd}`);

            if (cmd === 'HELP') {
              history.push('COMANDOS DISPONÍVEIS:');
              history.push('  DIR          - Listar arquivos no diretório atual');
              history.push('  CAT [ARQUIVO]- Exibir conteúdo de um arquivo');
              history.push('  LOGIN        - Autenticar credencial de pesquisador');
              history.push('  STATUS       - Exibir integridade do experimento');
              history.push('  CLEAR        - Limpar tela do terminal');
            } else if (cmd === 'DIR') {
              history.push('DIRETÓRIO DE C:\\AURORA\\');
              history.push('  PROJETO_AURORA.DOC     [DOCUMENTO PÚBLICO]');
              history.push('  ARQUIVO_017.DAT        [ACESSO RESTRITO - LOGIN NECESSÁRIO]');
              history.push('  CHAVE_ACESSO.SYS       [SISTEMA DE SEGURANÇA]');
            } else if (cmd === 'CAT PROJETO_AURORA.DOC' || cmd === 'CAT PROJETO_AURORA') {
              history.push('PROJETO AURORA: Estudo da reconstrução de memórias traumáticas.');
              history.push('DIRETRIZ: Toda memória evocada é reconstruída.');
            } else if (cmd === 'LOGIN' || cmd === 'LOGIN VANCE' || cmd === 'LOGIN 017-AURORA') {
              history.push('AUTENTICANDO SUJEITO 05 / DR. VANCE...');
              history.push('ACESSO CONCEDIDO: NÍVEL DE SEGURANÇA 3.');
              history.push('CARTÃO MAGNÉTICO GERADO NO DRIVE DE ENTRADA.');
              
              if (!gameState.hasItem('item_keycard_aurora')) {
                gameState.addItem('item_keycard_aurora');
                gameState.setFlag('cap3_terminalLoggedIn', true);
                if (window.toast) window.toast('Você obteve o CARTÃO MAGNÉTICO DE ACESSO!');
              }
            } else if (cmd === 'CAT ARQUIVO_017.DAT' || cmd === 'READ 017' || cmd === 'CAT ARQUIVO_017') {
              if (gameState.getFlag('cap3_terminalLoggedIn')) {
                history.push('ARQUIVO #017: Paciente insiste que já esteve nesta sala.');
                history.push('O Sujeito 05 é o próprio arquiteto do projeto.');
                gameState.discoverDoc('doc_file_017');
                gameState.setFlag('cap3_file017Read', true);
              } else {
                history.push('ERRO: ACESSO NEGADO. DIGITE "LOGIN" PARA AUTENTICAR.');
              }
            } else if (cmd === 'CLEAR') {
              history = [];
            } else {
              history.push(`COMANDO DESCONHECIDO: "${cmd}". DIGITE "HELP".`);
            }

            if (output) {
              output.textContent = history.join('\n');
              output.scrollTop = output.scrollHeight;
            }
          }
        });
      }
    };

    renderTerminal();
    if (this.puzzleModal) this.puzzleModal.classList.remove('hidden');
  }

  // ==========================================
  // 4. REPRODUTOR DE FITAS CASSETE (CAPÍTULO 4)
  // ==========================================
  openTapePlayerModal() {
    if (this.puzzleTitle) this.puzzleTitle.textContent = 'GRAVADOR & LEITOR DE FITAS MAGNÉTICAS';

    const tapes = Object.values(NARRATIVE_DATABASE.tapes);

    let currentTape = tapes[0];
    let isPlaying = false;

    const renderPlayer = () => {
      this.puzzleContainer.innerHTML = `
        <div class="tape-player-widget" style="width: 100%; max-width: 680px;">
          <div class="cassette-visual-deck ${isPlaying ? 'playing' : ''}">
            <div class="cassette-reel"></div>
            <div style="font-family: monospace; font-size: 0.85rem; color: #e2e8f0; text-align: center;">
              <strong>${currentTape.title}</strong><br>
              <small style="color: #94a3b8;">LOCUTOR: ${currentTape.speaker}</small>
            </div>
            <div class="cassette-reel"></div>
          </div>

          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; max-height: 90px; overflow-y: auto; padding: 4px;">
            ${tapes.map((t, idx) => `
              <button class="retro-btn btn-sm ${currentTape.id === t.id ? 'btn-primary' : ''}" data-index="${idx}">
                <span>FITA ${String(idx + 1).padStart(2, '0')}</span>
              </button>
            `).join('')}
          </div>

          <div class="tape-transcript">
            <p><strong>TRANSCRIÇÃO DE ÁUDIO:</strong></p>
            <p style="margin-top: 8px; font-style: italic;">${currentTape.transcript}</p>
          </div>

          <button class="retro-btn btn-primary" id="btn-play-tape" style="align-self: center;">
            <span class="btn-led"></span>
            <span>${isPlaying ? '⏸ PAUSAR FITA' : '▶ OUVIR GRAVAÇÃO'}</span>
          </button>
        </div>
      `;

      const tapeBtns = this.puzzleContainer.querySelectorAll('.tape-player-widget .btn-sm');
      tapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          soundEngine.stopVoice();
          soundEngine.playTapeDeckClick();
          const idx = parseInt(btn.dataset.index);
          currentTape = tapes[idx];
          isPlaying = false;
          renderPlayer();

          if (currentTape.id === 'tape_own_voice') {
            gameState.setFlag('cap4_ownVoiceTapeListened', true);
            soundEngine.playMemoryGlitch();
            sceneManager.triggerGlitch();
            sceneManager.startDialogue(NARRATIVE_DATABASE.dialogues.cap4_own_voice_reaction);
          }
        });
      });

      const btnPlay = document.getElementById('btn-play-tape');
      if (btnPlay) {
        btnPlay.addEventListener('click', () => {
          soundEngine.playTapeDeckClick();
          isPlaying = !isPlaying;
          if (isPlaying) {
            soundEngine.playVoice(currentTape.audio, null, 'radio', () => {
              isPlaying = false;
              renderPlayer();
            });
          } else {
            soundEngine.stopVoice();
          }
          renderPlayer();
        });
      }
    };

    renderPlayer();
    if (this.puzzleModal) this.puzzleModal.classList.remove('hidden');
  }

  // ==========================================
  // 5. PUZZLE DOS RELÓGIOS 02:17 (CAPÍTULO 5)
  // ==========================================
  openClockPuzzle() {
    if (this.puzzleTitle) this.puzzleTitle.textContent = 'PAINEL DE SINCRONIZAÇÃO TEMPORAL';

    let clockHours = [8, 4, 2, 11];

    const renderClocks = () => {
      this.puzzleContainer.innerHTML = `
        <div class="clock-puzzle-widget">
          <p style="font-family: monospace; font-size: 0.85rem; color: #c9d1d9;">
            SINCRONIZE OS RELÓGIOS COM O HORÁRIO FUNDAMENTAL: <strong style="color: #ef4444;">02:17</strong>
          </p>

          <div class="clocks-circular-array">
            ${[0, 1, 2, 3].map(i => `
              <div class="puzzle-clock-item" data-index="${i}">
                <span style="font-size: 1.5rem;">⏱️</span>
                <span class="puzzle-clock-time">${clockHours[i].toString().padStart(2, '0')}:17</span>
              </div>
            `).join('')}
          </div>

          <button class="retro-btn btn-primary" id="btn-sync-clocks" style="margin-top: 20px;">
            <span class="btn-led"></span>
            <span>SINCRONIZAR MECANISMO DE PAREDE</span>
          </button>
        </div>
      `;

      const clockItems = this.puzzleContainer.querySelectorAll('.puzzle-clock-item');
      clockItems.forEach(item => {
        item.addEventListener('click', () => {
          soundEngine.playClockTick();
          const idx = parseInt(item.dataset.index);
          clockHours[idx] = (clockHours[idx] + 1) % 12;
          if (clockHours[idx] === 0) clockHours[idx] = 12;
          renderClocks();
        });
      });

      const btnSync = document.getElementById('btn-sync-clocks');
      if (btnSync) {
        btnSync.addEventListener('click', () => {
          // Se todos os relógios marcarem 02:17
          if (clockHours.every(h => h === 2)) {
            soundEngine.playDoorUnlock();
            gameState.setFlag('cap5_clocksSynced', true);
            gameState.setFlag('cap5_secretWallOpened', true);
            if (window.toast) window.toast('Mecanismo ativado! A parede secreta deslizou.');

            setTimeout(() => {
              this.closePuzzle();
              sceneManager.renderCurrentScene();
            }, 1000);
          } else {
            soundEngine.playMemoryGlitch();
            if (window.toast) window.toast('Horários desalinhados. Todos os relógios devem marcar 02:17.');
          }
        });
      }
    };

    renderClocks();
    if (this.puzzleModal) this.puzzleModal.classList.remove('hidden');
  }

  // ==========================================
  // 6. PUZZLE DOS 5 MONITORES — FINAL (CAPÍTULO 8)
  // ==========================================
  openFiveMonitorsPuzzle() {
    if (this.puzzleTitle) this.puzzleTitle.textContent = 'ESTAÇÃO CENTRAL DE DECISÃO COGNITIVA';

    this.puzzleContainer.innerHTML = `
      <div class="five-monitors-decision-widget">
        <div style="font-family: monospace; font-size: 0.9rem; color: #ef4444; text-align: center; letter-spacing: 2px;">
          PERGUNTA DE CONTROLE: QUAL DELES É O ORIGINAL?
        </div>

        <p style="font-size: 0.95rem; color: #c9d1d9; text-align: center; max-width: 620px;">
          Os quatro primeiros pesquisadores foram confinados na simulação de memória. Você é o Dr. Vance, o arquiteto original. Escolha seu destino:
        </p>

        <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 580px;">
          <button class="retro-btn btn-secondary" id="btn-end-1" style="justify-content: flex-start; text-align: left; padding: 14px 20px;">
            <span class="btn-led"></span>
            <div>
              <strong>OPÇÃO A: ABRIR COMPORTAS & ESCAPAR</strong><br>
              <small style="color: #94a3b8;">Sair do Instituto para a floresta e deixar o passado para trás.</small>
            </div>
          </button>

          <button class="retro-btn btn-secondary" id="btn-end-2" style="justify-content: flex-start; text-align: left; padding: 14px 20px;">
            <span class="btn-led"></span>
            <div>
              <strong>OPÇÃO B: REINICIAR PROTOCOLO AURORA</strong><br>
              <small style="color: #94a3b8;">Apagar sua memória novamente e recomeçar o turno às 02:17.</small>
            </div>
          </button>

          <button class="retro-btn btn-primary" id="btn-end-3" style="justify-content: flex-start; text-align: left; padding: 14px 20px;">
            <span class="btn-led"></span>
            <div>
              <strong>OPÇÃO C: ASSUMIR A VERDADE & LIBERTAR OS CINCO</strong><br>
              <small style="color: #94a3b8;">Aceitar sua culpa, desligar o experimento e acordar todos os pesquisadores.</small>
            </div>
          </button>
        </div>
      </div>
    `;

    const btnEnd1 = document.getElementById('btn-end-1');
    if (btnEnd1) {
      btnEnd1.addEventListener('click', () => {
        soundEngine.playDoorUnlock();
        this.closePuzzle();
        this.triggerEnding('FUGA');
      });
    }

    const btnEnd2 = document.getElementById('btn-end-2');
    if (btnEnd2) {
      btnEnd2.addEventListener('click', () => {
        soundEngine.playMemoryGlitch();
        this.closePuzzle();
        this.triggerEnding('LOOP');
      });
    }

    const btnEnd3 = document.getElementById('btn-end-3');
    if (btnEnd3) {
      btnEnd3.addEventListener('click', () => {
        soundEngine.playDoorUnlock();
        this.closePuzzle();
        this.triggerEnding('VERDADE');
      });
    }

    if (this.puzzleModal) this.puzzleModal.classList.remove('hidden');
  }

  // ==========================================
  // DISPARO DOS 3 FINAIS
  // ==========================================
  triggerEnding(endingKey) {
    const endingData = NARRATIVE_DATABASE.endings[endingKey];
    if (!endingData) return;

    gameState.state.flags.endingAchieved = endingKey;

    const endingScreen = document.getElementById('ending-screen');
    const endingBadge = document.getElementById('ending-badge');
    const endingTitle = document.getElementById('ending-title');
    const endingNarrative = document.getElementById('ending-narrative');
    const btnEndingMenu = document.getElementById('btn-ending-menu');

    if (endingBadge) endingBadge.textContent = endingData.badge;
    if (endingTitle) endingTitle.textContent = endingData.title;
    if (endingNarrative) endingNarrative.innerHTML = endingData.text.replace(/\n/g, '<br>');

    // Toca a narração dramática do epílogo final
    soundEngine.playVoice(endingData.audio, null, 'radio');

    // Estatísticas
    const statHints = document.getElementById('stat-hints');
    if (statHints) statHints.textContent = gameState.state.stats.hintsUsedCount;

    if (endingScreen) {
      endingScreen.classList.remove('hidden');
      endingScreen.classList.add('active');
    }

    if (btnEndingMenu) {
      btnEndingMenu.addEventListener('click', () => {
        soundEngine.playButtonClick();
        if (endingScreen) endingScreen.classList.remove('active', 'hidden');
        window.location.reload();
      });
    }
  }

  // ==========================================
  // LEITOR DE DOCUMENTOS (MODAL DO DIÁRIO)
  // ==========================================
  openDocumentReader(docId) {
    const doc = NARRATIVE_DATABASE.documents[docId];
    if (!doc) return;

    if (this.journalReader) {
      this.journalReader.innerHTML = `
        <div class="document-view-container">
          <div class="doc-stamp">${doc.stamp}</div>
          <h3 class="doc-title">${doc.title}</h3>
          <div style="color: #94a3b8; font-size: 0.75rem; margin-bottom: 8px;">DATA DO REGISTRO: ${doc.date}</div>
          <div class="doc-body">${doc.content}</div>
        </div>
      `;
    }

    if (this.journalModal) {
      this.journalModal.classList.remove('hidden');
    }
  }

  renderJournalTab(tabName) {
    if (!this.journalContentList) return;
    this.journalContentList.innerHTML = '';

    if (tabName === 'documents') {
      const docs = gameState.state.discoveredDocs;
      if (docs.length === 0) {
        this.journalContentList.innerHTML = '<p style="color: #8b949e; font-size: 0.8rem;">Nenhum documento coletado.</p>';
        return;
      }
      docs.forEach(docId => {
        const doc = NARRATIVE_DATABASE.documents[docId];
        if (doc) {
          const item = document.createElement('div');
          item.className = 'journal-item-entry';
          item.innerHTML = `
            <div class="journal-entry-title">${doc.title}</div>
            <div class="journal-entry-date">${doc.date} • ${doc.stamp}</div>
          `;
          item.addEventListener('click', () => this.openDocumentReader(docId));
          this.journalContentList.appendChild(item);
        }
      });
    } else if (tabName === 'tapes') {
      this.openTapePlayerModal();
    }
  }
}

const puzzleSystem = new PuzzleSystem();
