/**
 * O ÚLTIMO TURNO — GERENCIADOR DE CENÁRIOS & NAVEGAÇÃO DOS 8 CAPÍTULOS
 * Integração completa com o RoomRenderer de alta fidelidade e LightingEngine para
 * iluminação volumétrica dinâmica em tempo real.
 */

class SceneManager {
  constructor() {
    this.stage = document.getElementById('scene-stage');
    this.chapterTitleEl = document.getElementById('current-chapter-title');
    this.roomNameEl = document.getElementById('current-room-name');
    this.hudClockEl = document.getElementById('hud-clock');
    
    this.dialogueBox = document.getElementById('dialogue-box');
    this.dialogueSpeaker = document.getElementById('dialogue-speaker');
    this.dialogueText = document.getElementById('dialogue-text');
    this.dialogueAvatar = document.getElementById('dialogue-avatar');
    this.dialogueChannel = document.getElementById('dialogue-channel');
    this.btnDialogueNext = document.getElementById('btn-dialogue-next');
    this.btnDialogueSkip = document.getElementById('btn-dialogue-skip');

    this.currentDialogueQueue = [];
    this.currentDialogueIndex = 0;
    this.isTyping = false;
    this.typingInterval = null;

    this.initEventListeners();
  }

  initEventListeners() {
    if (this.btnDialogueNext) {
      this.btnDialogueNext.addEventListener('click', () => this.advanceDialogue());
    }
    if (this.btnDialogueSkip) {
      this.btnDialogueSkip.addEventListener('click', () => this.finishDialogue());
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.dialogueBox && !this.dialogueBox.classList.contains('hidden')) {
        e.preventDefault();
        this.advanceDialogue();
      }
    });
  }

  renderCurrentScene() {
    const chapter = gameState.state.currentChapter;
    const info = CHAPTER_INFO[chapter] || CHAPTER_INFO[1];

    if (this.chapterTitleEl) this.chapterTitleEl.textContent = info.title;
    if (this.roomNameEl) this.roomNameEl.textContent = info.location;
    if (this.hudClockEl) this.hudClockEl.textContent = info.time;

    if (!this.stage || !window.roomRenderer) return;

    // Atualiza modo de emergência na iluminação
    if (window.lightingEngine) {
      window.lightingEngine.emergencyMode = (chapter === 2 && gameState.getFlag('cap2_emergencyLightsActive')) || chapter === 6;
    }

    switch (chapter) {
      case 1:
        this.stage.innerHTML = window.roomRenderer.getChapter1Markup();
        this.bindChapter1Events();
        break;
      case 2:
        this.stage.innerHTML = window.roomRenderer.getChapter2Markup();
        this.bindChapter2Events();
        break;
      case 3:
        this.stage.innerHTML = window.roomRenderer.getChapter3Markup();
        this.bindChapter3Events();
        break;
      case 4:
        this.stage.innerHTML = window.roomRenderer.getChapter4Markup();
        this.bindChapter4Events();
        break;
      case 5:
        this.stage.innerHTML = window.roomRenderer.getChapter5Markup();
        this.bindChapter5Events();
        break;
      case 6:
        this.stage.innerHTML = window.roomRenderer.getChapter6Markup();
        this.bindChapter6Events();
        break;
      case 7:
        this.stage.innerHTML = window.roomRenderer.getChapter7Markup();
        this.bindChapter7Events();
        break;
      case 8:
        this.stage.innerHTML = window.roomRenderer.getChapter8Markup();
        this.bindChapter8Events();
        break;
      default:
        this.stage.innerHTML = window.roomRenderer.getChapter1Markup();
        this.bindChapter1Events();
    }
  }

  // ==========================================
  // EVENTOS DO CAPÍTULO 1
  // ==========================================
  bindChapter1Events() {
    const isPhoneAnswered = gameState.getFlag('cap1_phoneAnswered');

    const hsClock = document.getElementById('hs-cap1-clock');
    if (hsClock) {
      hsClock.addEventListener('click', () => {
        soundEngine.playClockTick();
        gameState.setFlag('cap1_clockExamined', true);
        this.startDialogue([
          { speaker: 'PROTAGONISTA', type: 'local', text: 'O relógio de parede está parado... marca exatamente duas horas e dezessete minutos (02:17).' },
          { speaker: 'PROTAGONISTA', type: 'local', text: 'O segundo dígito da hora é 2. Isso é uma pista para o armário.' }
        ]);
      });
    }

    const hsPhone = document.getElementById('hs-cap1-phone');
    if (hsPhone) {
      hsPhone.addEventListener('click', () => {
        if (!isPhoneAnswered) {
          soundEngine.playButtonClick();
          gameState.setFlag('cap1_phoneAnswered', true);
          hsPhone.classList.remove('ringing');
          this.startDialogue(NARRATIVE_DATABASE.dialogues.cap1_phone_call);
        } else {
          this.startDialogue([
            { speaker: 'PROTAGONISTA', type: 'local', text: 'A linha telefônica está muda. Apenas um ruído estático distante ecoa no fone.' }
          ]);
        }
      });
    }

    const hsDoc = document.getElementById('hs-cap1-doc');
    if (hsDoc) {
      hsDoc.addEventListener('click', () => {
        soundEngine.playButtonClick();
        gameState.discoverDoc('doc_welcome_protocol');
        gameState.setFlag('cap1_noteRead', true);
        puzzleSystem.openDocumentReader('doc_welcome_protocol');
      });
    }

    const hsLocker = document.getElementById('hs-cap1-locker');
    if (hsLocker) {
      hsLocker.addEventListener('click', () => {
        soundEngine.playButtonClick();
        if (gameState.getFlag('cap1_lockerUnlocked')) {
          if (window.toast) window.toast('O armário já foi destrancado. Os itens estão no seu inventário.');
        } else {
          puzzleSystem.openSafePuzzle();
        }
      });
    }

    const hsDoor = document.getElementById('hs-cap1-door');
    if (hsDoor) {
      hsDoor.addEventListener('click', () => {
        if (gameState.hasItem('item_rusty_key')) {
          soundEngine.playDoorUnlock();
          gameState.setFlag('cap1_roomDoorUnlocked', true);
          this.triggerFlash(() => {
            if (window.toast) window.toast('Porta destrancada! Avançando para o Corredor Central.');
            gameState.setChapter(2);
            this.renderCurrentScene();
          });
        } else {
          soundEngine.playButtonClick();
          this.startDialogue([
            { speaker: 'PROTAGONISTA', type: 'local', text: 'A porta de ferro está trancada por uma fechadura pesada. Preciso de uma chave para abri-la.' }
          ]);
        }
      });
    }

    if (!gameState.getFlag('cap1_awakened')) {
      gameState.setFlag('cap1_awakened', true);
      soundEngine.playHeartbeat();
      this.startDialogue(NARRATIVE_DATABASE.dialogues.cap1_intro);
    }
  }

  // ==========================================
  // EVENTOS DO CAPÍTULO 2
  // ==========================================
  bindChapter2Events() {
    const hsBreaker = document.getElementById('hs-cap2-breaker');
    if (hsBreaker) {
      hsBreaker.addEventListener('click', () => {
        soundEngine.playButtonClick();
        if (window.lightingEngine) window.lightingEngine.triggerSparks();
        puzzleSystem.openBreakerPuzzle();
      });
    }

    const hsCctv = document.getElementById('hs-cap2-cctv');
    if (hsCctv) {
      hsCctv.addEventListener('click', () => {
        soundEngine.playMemoryGlitch();
        this.triggerGlitch();
        this.startDialogue(NARRATIVE_DATABASE.dialogues.cap2_cctv_anomaly);
      });
    }

    const hsDoorLab = document.getElementById('hs-cap2-door-lab');
    if (hsDoorLab) {
      hsDoorLab.addEventListener('click', () => {
        if (gameState.getFlag('cap2_breakerRestored')) {
          soundEngine.playDoorUnlock();
          this.triggerFlash(() => {
            if (window.toast) window.toast('Acesso concedido: Entrando no Laboratório.');
            gameState.setChapter(3);
            this.renderCurrentScene();
          });
        } else {
          soundEngine.playButtonClick();
          this.startDialogue([
            { speaker: 'PROTAGONISTA', type: 'local', text: 'A fechadura eletromagnética do Laboratório está sem energia. Preciso restaurar o quadro de força primeiro.' }
          ]);
        }
      });
    }

    const hsDoorRed = document.getElementById('hs-cap2-door-red');
    if (hsDoorRed) {
      hsDoorRed.addEventListener('click', () => {
        soundEngine.playButtonClick();
        this.startDialogue([
          { speaker: 'PROTAGONISTA', type: 'local', text: 'A porta vermelha está trancada por uma trava especial de alta segurança.' }
        ]);
      });
    }

    if (!gameState.getFlag('cap2_introDone')) {
      gameState.setFlag('cap2_introDone', true);
      this.startDialogue(NARRATIVE_DATABASE.dialogues.cap2_corridor_intro);
    }
  }

  // ==========================================
  // EVENTOS DO CAPÍTULO 3
  // ==========================================
  bindChapter3Events() {
    const hsDoc = document.getElementById('hs-cap3-doc');
    if (hsDoc) {
      hsDoc.addEventListener('click', () => {
        soundEngine.playButtonClick();
        gameState.discoverDoc('doc_aurora_project');
        gameState.setFlag('cap3_auroraDocRead', true);
        puzzleSystem.openDocumentReader('doc_aurora_project');
      });
    }

    const hsTerminal = document.getElementById('hs-cap3-terminal');
    if (hsTerminal) {
      hsTerminal.addEventListener('click', () => {
        soundEngine.playButtonClick();
        puzzleSystem.openTerminalPuzzle();
      });
    }

    const hsDoorArchive = document.getElementById('hs-cap3-door-archive');
    if (hsDoorArchive) {
      hsDoorArchive.addEventListener('click', () => {
        if (gameState.hasItem('item_keycard_aurora')) {
          soundEngine.playDoorUnlock();
          this.triggerFlash(() => {
            if (window.toast) window.toast('Cartão autenticado! Entrando na Sala de Arquivos.');
            gameState.setChapter(4);
            this.renderCurrentScene();
          });
        } else {
          soundEngine.playButtonClick();
          this.startDialogue([
            { speaker: 'PROTAGONISTA', type: 'local', text: 'Esta porta exige um cartão magnético de nível 3. Preciso procurá-lo no terminal de computadores.' }
          ]);
        }
      });
    }

    if (!gameState.getFlag('cap3_introDone')) {
      gameState.setFlag('cap3_introDone', true);
      this.startDialogue(NARRATIVE_DATABASE.dialogues.cap3_lab_discovery);
    }
  }

  // ==========================================
  // EVENTOS DO CAPÍTULO 4
  // ==========================================
  bindChapter4Events() {
    const hsTapeShelf = document.getElementById('hs-cap4-tape-shelf');
    if (hsTapeShelf) {
      hsTapeShelf.addEventListener('click', () => {
        soundEngine.playButtonClick();
        gameState.discoverTape('tape_01');
        gameState.discoverTape('tape_02');
        gameState.discoverTape('tape_03');
        gameState.discoverTape('tape_04');
        gameState.discoverTape('tape_05');
        gameState.discoverTape('tape_own_voice');
        if (!gameState.hasItem('item_tape_own_voice')) {
          gameState.addItem('item_tape_own_voice');
          if (window.toast) window.toast('Você encontrou a FITA CASSETE PRETA!');
        }
        puzzleSystem.openTapePlayerModal();
      });
    }

    const hsPlayer = document.getElementById('hs-cap4-player');
    if (hsPlayer) {
      hsPlayer.addEventListener('click', () => {
        soundEngine.playTapeDeckClick();
        puzzleSystem.openTapePlayerModal();
      });
    }

    const hsDoorClocks = document.getElementById('hs-cap4-door-clocks');
    if (hsDoorClocks) {
      hsDoorClocks.addEventListener('click', () => {
        if (gameState.getFlag('cap4_ownVoiceTapeListened')) {
          soundEngine.playDoorUnlock();
          this.triggerFlash(() => {
            if (window.toast) window.toast('Avançando para a Sala 02:17.');
            gameState.setChapter(5);
            this.renderCurrentScene();
          });
        } else {
          soundEngine.playButtonClick();
          this.startDialogue([
            { speaker: 'PROTAGONISTA', type: 'local', text: 'Antes de prosseguir, sinto que preciso ouvir todas as gravações para entender o que aconteceu.' }
          ]);
        }
      });
    }
  }

  // ==========================================
  // EVENTOS DO CAPÍTULO 5
  // ==========================================
  bindChapter5Events() {
    const hsClocks = document.getElementById('hs-cap5-clocks-panel');
    if (hsClocks) {
      hsClocks.addEventListener('click', () => {
        soundEngine.playButtonClick();
        puzzleSystem.openClockPuzzle();
      });
    }

    const hsSecretChamber = document.getElementById('hs-cap5-secret-chamber');
    if (hsSecretChamber) {
      hsSecretChamber.addEventListener('click', () => {
        if (gameState.getFlag('cap5_secretWallOpened')) {
          soundEngine.playMemoryGlitch();
          this.triggerGlitch();
          this.startDialogue(NARRATIVE_DATABASE.dialogues.cap5_monitor_warning);
          
          if (!gameState.hasItem('item_master_red_key')) {
            gameState.addItem('item_master_red_key');
            if (window.toast) window.toast('Você obteve a CHAVE MESTRA DA PORTA VERMELHA!');
          }

          setTimeout(() => {
            gameState.setChapter(6);
            this.renderCurrentScene();
          }, 3500);
        } else {
          soundEngine.playButtonClick();
          this.startDialogue([
            { speaker: 'PROTAGONISTA', type: 'local', text: 'Uma ranhura no concreto indica que esta parede pode deslizar se os relógios forem sincronizados.' }
          ]);
        }
      });
    }

    if (!gameState.getFlag('cap5_introDone')) {
      gameState.setFlag('cap5_introDone', true);
      this.startDialogue(NARRATIVE_DATABASE.dialogues.cap5_clock_chamber);
    }
  }

  // ==========================================
  // EVENTOS DO CAPÍTULO 6
  // ==========================================
  bindChapter6Events() {
    const isEntered = gameState.getFlag('cap6_redDoorEntered');

    if (!isEntered) {
      const hsRedDoor = document.getElementById('hs-cap6-red-door');
      if (hsRedDoor) {
        hsRedDoor.addEventListener('click', () => {
          soundEngine.playDoorUnlock();
          gameState.setFlag('cap6_redDoorEntered', true);
          this.triggerFlash(() => {
            this.renderCurrentScene();
          });
        });
      }

      if (!gameState.getFlag('cap6_introDone')) {
        gameState.setFlag('cap6_introDone', true);
        this.startDialogue(NARRATIVE_DATABASE.dialogues.cap6_red_door_encounter);
      }
    } else {
      const hsPhone = document.getElementById('hs-cap6-phone');
      if (hsPhone) {
        hsPhone.addEventListener('click', () => {
          soundEngine.playButtonClick();
          hsPhone.classList.remove('ringing');
          this.startDialogue(NARRATIVE_DATABASE.dialogues.cap6_mirror_scene);
          
          setTimeout(() => {
            const mirrorSurface = document.getElementById('mirror-surface');
            const mirrorText = document.getElementById('mirror-text');
            if (mirrorSurface) mirrorSurface.classList.add('glitched');
            if (mirrorText) mirrorText.classList.add('visible');
            soundEngine.playMemoryGlitch();
            gameState.setFlag('cap6_mirrorRememberRevealed', true);
          }, 3000);
        });
      }

      const hsDoorTruth = document.getElementById('hs-cap6-door-truth');
      if (hsDoorTruth) {
        hsDoorTruth.addEventListener('click', () => {
          if (gameState.getFlag('cap6_mirrorRememberRevealed')) {
            soundEngine.playDoorUnlock();
            this.triggerFlash(() => {
              if (window.toast) window.toast('Avançando para o Arquivo Confidencial.');
              gameState.setChapter(7);
              this.renderCurrentScene();
            });
          } else {
            soundEngine.playButtonClick();
            this.startDialogue([
              { speaker: 'PROTAGONISTA', type: 'local', text: 'O telefone está tocando na mesa. Preciso atender antes de sair.' }
            ]);
          }
        });
      }
    }
  }

  // ==========================================
  // EVENTOS DO CAPÍTULO 7
  // ==========================================
  bindChapter7Events() {
    const hsDossier = document.getElementById('hs-cap7-projector-screen');
    if (hsDossier) {
      hsDossier.addEventListener('click', () => {
        soundEngine.playButtonClick();
        gameState.discoverDoc('doc_executive_dossier');
        puzzleSystem.openDocumentReader('doc_executive_dossier');
        
        if (!gameState.getFlag('cap7_flashbackTriggered')) {
          gameState.setFlag('cap7_flashbackTriggered', true);
          setTimeout(() => {
            soundEngine.playMemoryGlitch();
            this.triggerGlitch();
            this.startDialogue(NARRATIVE_DATABASE.dialogues.cap7_flashback_realization);
          }, 1500);
        }
      });
    }

    const hsDoorFinal = document.getElementById('hs-cap7-door-final');
    if (hsDoorFinal) {
      hsDoorFinal.addEventListener('click', () => {
        if (gameState.getFlag('cap7_flashbackTriggered')) {
          soundEngine.playDoorUnlock();
          this.triggerFlash(() => {
            if (window.toast) window.toast('Entrando na Estação Central de Controle.');
            gameState.setChapter(8);
            this.renderCurrentScene();
          });
        } else {
          soundEngine.playButtonClick();
          this.startDialogue([
            { speaker: 'PROTAGONISTA', type: 'local', text: 'Preciso ler o dossiê da diretoria sobre a mesa antes de prosseguir.' }
          ]);
        }
      });
    }
  }

  // ==========================================
  // EVENTOS DO CAPÍTULO 8
  // ==========================================
  bindChapter8Events() {
    const hsConsole = document.getElementById('hs-cap8-console');
    if (hsConsole) {
      hsConsole.addEventListener('click', () => {
        soundEngine.playButtonClick();
        puzzleSystem.openFiveMonitorsPuzzle();
      });
    }

    if (!gameState.getFlag('cap8_introDone')) {
      gameState.setFlag('cap8_introDone', true);
      this.startDialogue(NARRATIVE_DATABASE.dialogues.cap8_central_hub);
    }
  }

  // ==========================================
  // DIÁLOGOS CINEMATOGRÁFICOS
  // ==========================================
  startDialogue(queue) {
    if (!queue || queue.length === 0) return;
    this.currentDialogueQueue = queue;
    this.currentDialogueIndex = 0;
    this.showDialogue(this.currentDialogueQueue[0]);
  }

  showDialogue(line) {
    if (!this.dialogueBox || !line) return;
    this.dialogueBox.classList.remove('hidden');

    if (line.type === 'radio') {
      this.dialogueBox.classList.add('speaker-voice');
      if (this.dialogueAvatar) this.dialogueAvatar.className = 'dialogue-avatar speaker-voice';
      if (this.dialogueChannel) this.dialogueChannel.textContent = 'TRANSMISSÃO FREQUÊNCIA 02.17 MHz';
      soundEngine.playMemoryGlitch();
    } else {
      this.dialogueBox.classList.remove('speaker-voice');
      if (this.dialogueAvatar) this.dialogueAvatar.className = 'dialogue-avatar speaker-protagonist';
      if (this.dialogueChannel) this.dialogueChannel.textContent = 'COMUNICAÇÃO LOCAL';
    }

    if (this.dialogueSpeaker) this.dialogueSpeaker.textContent = line.speaker;

    // Dispara exclusivamente o arquivo MP3 diegético (sem TTS / speechSynthesis)
    // Se o arquivo falhar, apenas o texto aparece com efeito de digitação na tela.
    if (line.audio) {
      soundEngine.playVoice(line.audio, null, line.type);
    }

    if (this.dialogueText) {
      this.dialogueText.textContent = '';
      let charIdx = 0;
      clearInterval(this.typingInterval);
      this.isTyping = true;

      this.typingInterval = setInterval(() => {
        if (charIdx < line.text.length) {
          this.dialogueText.textContent += line.text[charIdx];
          if (charIdx % 3 === 0) soundEngine.playTypewriterKey();
          charIdx++;
        } else {
          clearInterval(this.typingInterval);
          this.isTyping = false;
        }
      }, 25);
    }
  }

  advanceDialogue() {
    if (this.isTyping) {
      clearInterval(this.typingInterval);
      this.isTyping = false;
      const currentLine = this.currentDialogueQueue[this.currentDialogueIndex];
      if (currentLine && this.dialogueText) {
        this.dialogueText.textContent = currentLine.text;
      }
      return;
    }

    soundEngine.stopVoice();
    this.currentDialogueIndex++;
    if (this.currentDialogueIndex < this.currentDialogueQueue.length) {
      soundEngine.playButtonClick();
      this.showDialogue(this.currentDialogueQueue[this.currentDialogueIndex]);
    } else {
      this.finishDialogue();
    }
  }

  finishDialogue() {
    soundEngine.stopVoice();
    clearInterval(this.typingInterval);
    this.isTyping = false;
    if (this.dialogueBox) {
      this.dialogueBox.classList.add('hidden');
    }
  }

  triggerFlash(callback) {
    const flashEl = document.getElementById('effect-flash');
    if (flashEl) {
      flashEl.classList.add('flash-white');
      setTimeout(() => {
        flashEl.classList.remove('flash-white');
        if (callback) callback();
      }, 300);
    } else if (callback) {
      callback();
    }
  }

  triggerGlitch(duration = 400) {
    const glitchEl = document.getElementById('effect-glitch');
    if (glitchEl) {
      glitchEl.classList.add('active');
      setTimeout(() => {
        glitchEl.classList.remove('active');
      }, duration);
    }
  }
}

const sceneManager = new SceneManager();
