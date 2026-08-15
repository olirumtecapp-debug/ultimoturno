/**
 * O ÚLTIMO TURNO — APLICAÇÃO PRINCIPAL & PONTO DE ENTRADA
 * Orquestra a navegação entre telas, menus, atalhos de teclado, salvamento,
 * inicialização de áudio e eventos globais de toque e mouse.
 */

// Notificação Toast Global
window.toast = function(message) {
  const toastEl = document.getElementById('toast-message');
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('active');
  setTimeout(() => {
    toastEl.classList.remove('active');
  }, 3200);
};

class AppController {
  constructor() {
    this.mainMenuScreen = document.getElementById('main-menu');
    this.gameplayScreen = document.getElementById('gameplay-screen');
    
    // Botões do Menu Principal
    this.btnNewGame = document.getElementById('btn-new-game');
    this.btnContinue = document.getElementById('btn-continue');
    this.btnChapterSelect = document.getElementById('btn-chapter-select');
    this.btnOptions = document.getElementById('btn-options');
    this.btnCredits = document.getElementById('btn-credits');
    this.continueInfoEl = document.getElementById('continue-chapter-info');

    // Botões do Top HUD
    this.btnHudFlashlight = document.getElementById('btn-hud-flashlight');
    this.btnHudJournal = document.getElementById('btn-hud-journal');
    this.btnHudInventory = document.getElementById('btn-hud-inventory');
    this.btnHudPause = document.getElementById('btn-hud-pause');

    // Modais
    this.modalOptions = document.getElementById('modal-options');
    this.btnCloseOptions = document.getElementById('btn-close-options');
    this.modalPause = document.getElementById('modal-pause');
    this.btnPauseResume = document.getElementById('btn-pause-resume');
    this.btnPauseMenu = document.getElementById('btn-pause-menu');
    this.btnPauseOptions = document.getElementById('btn-pause-options');
    this.modalChapters = document.getElementById('modal-chapters');
    this.btnCloseChapters = document.getElementById('btn-close-chapters');
    this.chaptersGrid = document.getElementById('chapters-selection-grid');
    this.btnResetSave = document.getElementById('btn-reset-save');

    // Controles de Opções
    this.sliderMaster = document.getElementById('slider-master-volume');
    this.sliderSfx = document.getElementById('slider-sfx-volume');
    this.sliderAmbience = document.getElementById('slider-ambience-volume');
    this.labelMaster = document.getElementById('label-master-volume');
    this.labelSfx = document.getElementById('label-sfx-volume');
    this.labelAmbience = document.getElementById('label-ambience-volume');
    this.checkCrt = document.getElementById('check-crt-effects');

    this.menuTimer = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkSaveState();
    this.startMenuAmbienceCycle();

    // Atualiza o inventário sempre que o estado mudar
    gameState.subscribe(() => {
      inventorySystem.render();
      this.checkSaveState();
    });
  }

  setupEventListeners() {
    // O desbloqueio do AudioContext é gerenciado globalmente em audio.js.
    // Não duplicar o listener aqui para evitar conflito com o unlock global.

    // Menu Principal
    if (this.btnNewGame) {
      this.btnNewGame.addEventListener('click', () => this.startNewGame());
    }

    if (this.btnContinue) {
      this.btnContinue.addEventListener('click', () => this.continueGame());
    }

    if (this.btnChapterSelect) {
      this.btnChapterSelect.addEventListener('click', () => this.openChapterSelect());
    }

    if (this.btnOptions) {
      this.btnOptions.addEventListener('click', () => this.openOptions());
    }

    if (this.btnCredits) {
      this.btnCredits.addEventListener('click', () => {
        soundEngine.playButtonClick();
        puzzleSystem.openDocumentReader('doc_executive_dossier');
      });
    }

    // Top HUD
    if (this.btnHudFlashlight) {
      this.btnHudFlashlight.addEventListener('click', () => {
        if (window.lightingEngine) {
          window.lightingEngine.toggleFlashlight();
        }
      });
    }

    if (this.btnHudJournal) {
      this.btnHudJournal.addEventListener('click', () => {
        soundEngine.playButtonClick();
        if (puzzleSystem.journalModal) {
          puzzleSystem.journalModal.classList.remove('hidden');
          puzzleSystem.renderJournalTab('documents');
        }
      });
    }

    if (this.btnHudInventory) {
      this.btnHudInventory.addEventListener('click', () => {
        soundEngine.playButtonClick();
        const items = gameState.state.inventory;
        if (items.length > 0) {
          inventorySystem.openInspection(ITEM_DATABASE[items[0]]);
        } else {
          window.toast('Inventário vazio. Explore a sala para encontrar itens.');
        }
      });
    }

    if (this.btnHudPause) {
      this.btnHudPause.addEventListener('click', () => this.togglePause(true));
    }

    // Modais
    if (this.btnCloseOptions) {
      this.btnCloseOptions.addEventListener('click', () => {
        if (this.modalOptions) this.modalOptions.classList.add('hidden');
      });
    }

    if (this.btnPauseResume) {
      this.btnPauseResume.addEventListener('click', () => this.togglePause(false));
    }

    if (this.btnPauseMenu) {
      this.btnPauseMenu.addEventListener('click', () => {
        soundEngine.playButtonClick();
        this.togglePause(false);
        this.returnToMenu();
      });
    }

    if (this.btnPauseOptions) {
      this.btnPauseOptions.addEventListener('click', () => {
        if (this.modalPause) this.modalPause.classList.add('hidden');
        this.openOptions();
      });
    }

    if (this.btnCloseChapters) {
      this.btnCloseChapters.addEventListener('click', () => {
        if (this.modalChapters) this.modalChapters.classList.add('hidden');
      });
    }

    if (this.btnResetSave) {
      this.btnResetSave.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja apagar todo o progresso investigativo salvo?')) {
          gameState.resetSaveData();
          window.location.reload();
        }
      });
    }

    // Sliders de Volume
    if (this.sliderMaster) {
      this.sliderMaster.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (this.labelMaster) this.labelMaster.textContent = `${val}%`;
        soundEngine.setMasterVolume(val / 100);
      });
    }

    if (this.sliderSfx) {
      this.sliderSfx.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (this.labelSfx) this.labelSfx.textContent = `${val}%`;
        soundEngine.setSfxVolume(val / 100);
      });
    }

    if (this.sliderAmbience) {
      this.sliderAmbience.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (this.labelAmbience) this.labelAmbience.textContent = `${val}%`;
        soundEngine.setAmbienceVolume(val / 100);
      });
    }

    if (this.checkCrt) {
      this.checkCrt.addEventListener('change', (e) => {
        const screenFx = document.getElementById('screen-effects');
        if (screenFx) {
          screenFx.style.display = e.target.checked ? 'block' : 'none';
        }
      });
    }

    // Atalhos de Teclado
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const anyModalOpen = document.querySelector('.modal-overlay:not(.hidden)');
        if (anyModalOpen) {
          anyModalOpen.classList.add('hidden');
        } else if (this.gameplayScreen.classList.contains('active')) {
          this.togglePause(true);
        }
      } else if (e.key === 'i' || e.key === 'I') {
        if (this.gameplayScreen.classList.contains('active')) {
          const items = gameState.state.inventory;
          if (items.length > 0) {
            inventorySystem.openInspection(ITEM_DATABASE[items[0]]);
          } else {
            window.toast('Inventário vazio.');
          }
        }
      } else if (e.key === 'h' || e.key === 'H') {
        if (this.gameplayScreen.classList.contains('active')) {
          hintsSystem.open();
        }
      }
    });

    // Rastreamento do Cursor Tático, Hotspots e Barra Central de Ação Global (#action-prompt)
    const sceneViewport = document.getElementById('scene-viewport');
    const interactionCursor = document.getElementById('interaction-cursor');
    const actionPrompt = document.getElementById('action-prompt');
    const actionPromptText = document.getElementById('action-prompt-text');
    let currentHoveredHotspot = null;

    if (sceneViewport) {
      sceneViewport.addEventListener('mousemove', (e) => {
        if (interactionCursor) {
          const rect = sceneViewport.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          interactionCursor.style.left = `${x}px`;
          interactionCursor.style.top = `${y}px`;
        }

        const targetEl = document.elementFromPoint(e.clientX, e.clientY);
        const isHotspot = targetEl && targetEl.closest('.scene-hotspot');
        
        if (isHotspot) {
          currentHoveredHotspot = isHotspot;
          if (interactionCursor) interactionCursor.classList.add('hovering-hotspot');
          if (actionPrompt && actionPromptText) {
            const actionText = isHotspot.getAttribute('data-action') || isHotspot.getAttribute('title') || 'INTERAGIR';
            actionPromptText.textContent = actionText;
            actionPrompt.classList.add('active');
          }
        } else {
          currentHoveredHotspot = null;
          if (interactionCursor) interactionCursor.classList.remove('hovering-hotspot');
          if (actionPrompt) actionPrompt.classList.remove('active');
        }
      });

      sceneViewport.addEventListener('mouseleave', () => {
        currentHoveredHotspot = null;
        if (interactionCursor) interactionCursor.classList.remove('hovering-hotspot');
        if (actionPrompt) actionPrompt.classList.remove('active');
      });
    }

    if (actionPrompt) {
      actionPrompt.addEventListener('click', () => {
        if (currentHoveredHotspot) {
          currentHoveredHotspot.click();
        }
      });
    }

    // Sons nos botões retro
    document.querySelectorAll('.retro-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => soundEngine.playButtonHover());
    });
  }

  checkSaveState() {
    if (gameState.hasSaveData()) {
      if (this.btnContinue) this.btnContinue.disabled = false;
      if (this.continueInfoEl) {
        const chap = gameState.state.currentChapter;
        this.continueInfoEl.textContent = `CAPÍTULO ${chap} • SALA: ${CHAPTER_INFO[chap].location}`;
      }
    } else {
      if (this.btnContinue) this.btnContinue.disabled = true;
      if (this.continueInfoEl) this.continueInfoEl.textContent = 'NENHUM REGISTRO';
    }
  }

  startNewGame() {
    soundEngine.init();
    soundEngine.resume();
    soundEngine.playButtonClick();
    gameState.state = gameState.getDefaultState();
    gameState.saveToStorage();
    this.transitionToGameplay();
  }

  continueGame() {
    soundEngine.init();
    soundEngine.resume();
    soundEngine.playButtonClick();
    gameState.loadFromStorage();
    this.transitionToGameplay();
  }

  transitionToGameplay() {
    if (this.mainMenuScreen) this.mainMenuScreen.classList.remove('active');
    if (this.gameplayScreen) this.gameplayScreen.classList.add('active');

    inventorySystem.render();
    sceneManager.renderCurrentScene();
  }

  returnToMenu() {
    if (this.gameplayScreen) this.gameplayScreen.classList.remove('active');
    if (this.mainMenuScreen) this.mainMenuScreen.classList.add('active');
    this.checkSaveState();
  }

  openOptions() {
    soundEngine.playButtonClick();
    if (this.modalOptions) this.modalOptions.classList.remove('hidden');
  }

  openChapterSelect() {
    soundEngine.playButtonClick();
    if (!this.chaptersGrid) return;
    this.chaptersGrid.innerHTML = '';

    const unlocked = gameState.state.unlockedChapters || [1];

    for (let i = 1; i <= 8; i++) {
      const info = CHAPTER_INFO[i];
      const isUnlocked = unlocked.includes(i);
      const card = document.createElement('div');
      card.className = `chapter-card-item ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <span class="chapter-num">CAPÍTULO ${i}</span>
        <span class="chapter-name">${info.title.split('—')[1] || info.title}</span>
        <small style="color: #94a3b8; font-size: 0.7rem;">${isUnlocked ? info.location : '🔒 BLOQUEADO'}</small>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          soundEngine.playButtonClick();
          gameState.setChapter(i);
          if (this.modalChapters) this.modalChapters.classList.add('hidden');
          this.transitionToGameplay();
        });
      }

      this.chaptersGrid.appendChild(card);
    }

    if (this.modalChapters) this.modalChapters.classList.remove('hidden');
  }

  togglePause(show) {
    soundEngine.playButtonClick();
    if (this.modalPause) {
      if (show) {
        this.modalPause.classList.remove('hidden');
      } else {
        this.modalPause.classList.add('hidden');
      }
    }
  }

  startMenuAmbienceCycle() {
    // Efeito de telefone tocando e luz oscilante após inatividade no menu
    setInterval(() => {
      if (this.mainMenuScreen && this.mainMenuScreen.classList.contains('active')) {
        soundEngine.playClockTick();
      }
    }, 1000);

    setTimeout(() => {
      if (this.mainMenuScreen && this.mainMenuScreen.classList.contains('active')) {
        soundEngine.playPhoneRing();
        sceneManager.triggerGlitch(600);
      }
    }, 8000);
  }
}

// Inicialização da aplicação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
});
