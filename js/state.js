/**
 * O ÚLTIMO TURNO — GERENCIADOR DE ESTADO & PERSISTÊNCIA
 * Controla os 8 capítulos, inventário, pistas coletadas, documentos lidos,
 * fitas ouvidas, puzzles resolvidos e salvamento automático no localStorage.
 */

const STORAGE_KEY = 'O_ULTIMO_TURNO_SAVE_DATA_V1';

const CHAPTER_INFO = {
  1: { id: 1, title: 'CAPÍTULO 1 — O DESPERTAR', location: 'SALA DE OBSERVAÇÃO', time: '02:17' },
  2: { id: 2, title: 'CAPÍTULO 2 — O CORREDOR', location: 'CORREDOR CENTRAL - SETOR B', time: '02:24' },
  3: { id: 3, title: 'CAPÍTULO 3 — O LABORATÓRIO', location: 'LABORATÓRIO DE NEUROCIÊNCIA', time: '02:35' },
  4: { id: 4, title: 'CAPÍTULO 4 — AS GRAVAÇÕES', location: 'SALA DE ARQUIVOS MAGNÉTICOS', time: '02:48' },
  5: { id: 5, title: 'CAPÍTULO 5 — A SALA 02:17', location: 'CÂMARA DE SINCRONIZAÇÃO', time: '02:17' },
  6: { id: 6, title: 'CAPÍTULO 6 — A PORTA VERMELHA', location: 'CÂMARA DO ESPELHO', time: '03:02' },
  7: { id: 7, title: 'CAPÍTULO 7 — A VERDADE', location: 'ARQUIVO CONFIDENCIAL DA DIRETORIA', time: '03:15' },
  8: { id: 8, title: 'CAPÍTULO 8 — O ÚLTIMO TURNO', location: 'ESTAÇÃO CENTRAL DE CONTROLE', time: '03:30' }
};

class GameStateManager {
  constructor() {
    this.state = this.getDefaultState();
    this.listeners = [];
  }

  getDefaultState() {
    return {
      currentChapter: 1,
      unlockedChapters: [1],
      currentRoom: 'SALA DE OBSERVAÇÃO',
      currentTime: '02:17',
      
      // Inventário
      inventory: [],
      selectedItem: null,
      
      // Documentos e Gravações Descobertos
      discoveredDocs: [],
      discoveredTapes: [],
      discoveredPhotos: [],
      
      // Progresso de Puzzles e Eventos por Capítulo
      flags: {
        // Cap 1
        cap1_phoneAnswered: false,
        cap1_photoExamined: false,
        cap1_photoFaceGlitched: false,
        cap1_lockerUnlocked: false,
        cap1_clockExamined: false,
        cap1_noteRead: false,
        cap1_roomDoorUnlocked: false,

        // Cap 2
        cap2_cctvExamined: false,
        cap2_breakerRestored: false,
        cap2_lightExploded: false,
        cap2_emergencyLightsActive: false,
        cap2_labKeyFound: false,
        cap2_labDoorUnlocked: false,

        // Cap 3
        cap3_auroraDocRead: false,
        cap3_terminalLoggedIn: false,
        cap3_file017Read: false,
        cap3_archiveKeycardFound: false,

        // Cap 4
        cap4_tape1Listened: false,
        cap4_tape2Listened: false,
        cap4_tape3Listened: false,
        cap4_tape4Listened: false,
        cap4_tape5Listened: false,
        cap4_ownVoiceTapeListened: false,
        cap4_clockKeyFound: false,

        // Cap 5
        cap5_clocksSynced: false,
        cap5_secretWallOpened: false,
        cap5_warningMonitorWatched: false,

        // Cap 6
        cap6_redDoorApproached: false,
        cap6_redDoorEntered: false,
        cap6_phoneAnswered: false,
        cap6_mirrorExamined: false,
        cap6_mirrorGlitchTriggered: false,
        cap6_mirrorRememberRevealed: false,
        cap6_masterKeyFound: false,

        // Cap 7
        cap7_dossierReassembled: false,
        cap7_flashbackTriggered: false,
        cap7_trueIdentityRevealed: false,

        // Cap 8
        cap8_finalPuzzleActive: false,
        cap8_chosenSubject: null,
        cap8_decompressionUnlocked: false,
        
        // Final
        endingAchieved: null // 'FUGA', 'LOOP', 'VERDADE'
      },

      // Estatísticas da Partida
      stats: {
        hintsUsedCount: 0,
        unlockedHints: {}, // { 'cap1_tier1': true, ... }
        startTime: Date.now(),
        totalInteractions: 0
      },

      // Configurações
      settings: {
        masterVolume: 80,
        sfxVolume: 90,
        ambienceVolume: 70,
        crtEffectsEnabled: true,
        typewriterEnabled: true
      }
    };
  }

  // Registra ouvinte para alterações de estado
  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
    this.saveToStorage();
  }

  // ==========================================
  // MÉTODOS DE CONTROLE DE CAPÍTULO & LOCAL
  // ==========================================

  setChapter(chapNum) {
    if (CHAPTER_INFO[chapNum]) {
      this.state.currentChapter = chapNum;
      this.state.currentRoom = CHAPTER_INFO[chapNum].location;
      this.state.currentTime = CHAPTER_INFO[chapNum].time;
      
      if (!this.state.unlockedChapters.includes(chapNum)) {
        this.state.unlockedChapters.push(chapNum);
      }

      this.notify();
    }
  }

  setFlag(flagName, value = true) {
    this.state.flags[flagName] = value;
    this.state.stats.totalInteractions++;
    this.notify();
  }

  getFlag(flagName) {
    return !!this.state.flags[flagName];
  }

  // ==========================================
  // INVENTÁRIO
  // ==========================================

  addItem(itemId) {
    if (!this.state.inventory.includes(itemId)) {
      this.state.inventory.push(itemId);
      this.notify();
      return true;
    }
    return false;
  }

  removeItem(itemId) {
    const idx = this.state.inventory.indexOf(itemId);
    if (idx !== -1) {
      this.state.inventory.splice(idx, 1);
      if (this.state.selectedItem === itemId) {
        this.state.selectedItem = null;
      }
      this.notify();
      return true;
    }
    return false;
  }

  hasItem(itemId) {
    return this.state.inventory.includes(itemId);
  }

  selectItem(itemId) {
    if (this.state.selectedItem === itemId) {
      this.state.selectedItem = null; // Desmarcar
    } else if (this.state.inventory.includes(itemId)) {
      this.state.selectedItem = itemId;
    }
    this.notify();
  }

  // ==========================================
  // DOCUMENTOS & FITAS COLETADOS
  // ==========================================

  discoverDoc(docId) {
    if (!this.state.discoveredDocs.includes(docId)) {
      this.state.discoveredDocs.push(docId);
      this.notify();
    }
  }

  discoverTape(tapeId) {
    if (!this.state.discoveredTapes.includes(tapeId)) {
      this.state.discoveredTapes.push(tapeId);
      this.notify();
    }
  }

  discoverPhoto(photoId) {
    if (!this.state.discoveredPhotos.includes(photoId)) {
      this.state.discoveredPhotos.push(photoId);
      this.notify();
    }
  }

  // ==========================================
  // SISTEMA DE PISTAS & ESTATÍSTICAS
  // ==========================================

  unlockHint(hintKey) {
    if (!this.state.stats.unlockedHints[hintKey]) {
      this.state.stats.unlockedHints[hintKey] = true;
      this.state.stats.hintsUsedCount++;
      this.notify();
    }
  }

  isHintUnlocked(hintKey) {
    return !!this.state.stats.unlockedHints[hintKey];
  }

  // ==========================================
  // SALVAMENTO & CARREGAMENTO (LOCALSTORAGE)
  // ==========================================

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Não foi possível salvar os dados no localStorage:', e);
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = Object.assign(this.getDefaultState(), parsed);
        this.notify();
        return true;
      }
    } catch (e) {
      console.warn('Erro ao carregar dados salvos:', e);
    }
    return false;
  }

  hasSaveData() {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return false;
    }
  }

  resetSaveData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.state = this.getDefaultState();
      this.notify();
    } catch (e) {
      console.warn('Erro ao resetar dados salvos:', e);
    }
  }
}

// Instância global do estado do jogo
const gameState = new GameStateManager();
