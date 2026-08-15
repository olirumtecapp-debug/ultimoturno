/**
 * O ÚLTIMO TURNO — SISTEMA DE PISTAS PROGRESSIVAS EM 3 NÍVEIS
 * Oferece auxílio investigativo inteligente sem estragar o mistério.
 */

const HINTS_DATABASE = {
  // CAPÍTULO 1
  1: {
    tier1: 'Observe atentamente os quatro elementos principais da sala: o relógio na parede, a quantidade de pessoas na fotografia, o documento sobre a mesa e a anotação.',
    tier2: 'O código do armário é composto por 4 dígitos: [Pesquisadores na foto] - [Hora do relógio] - [Falhas no doc] - [Último dígito do ano/mês].',
    tier3: 'A senha exata do armário é 5-2-1-7. Insira esse valor no teclado numérico do armário para destravá-lo e pegar a chave da porta.'
  },

  // CAPÍTULO 2
  2: {
    tier1: 'O corredor está sem energia e as travas magnéticas das portas dependem da caixa de disjuntores.',
    tier2: 'Para atingir a tensão ideal de 220V sem queimar os fusíveis, você precisa intercalar a posição de algumas chaves.',
    tier3: 'Posicione as cinco chaves na sequência: CH-01 (LIGADA), CH-02 (DESLIGADA), CH-03 (LIGADA), CH-04 (LIGADA), CH-05 (DESLIGADA).'
  },

  // CAPÍTULO 3
  3: {
    tier1: 'O terminal antigo de computador no laboratório aceita comandos de texto como HELP, DIR e LOGIN.',
    tier2: 'No documento do Projeto Aurora, é mencionado o código de identificação do pesquisador responsável.',
    tier3: 'No terminal, digite o comando "LOGIN" para autenticar e obter o cartão magnético que abre a sala de arquivos.'
  },

  // CAPÍTULO 4
  4: {
    tier1: 'A sala de arquivos possui diversas fitas gravadas pelos pesquisadores do Instituto.',
    tier2: 'Ouça atentamente todas as fitas cassete para compreender a cronologia e encontrar a gravação com sua própria voz.',
    tier3: 'Ouça a Fita 06 (a fita preta sem rótulo). Ao final da reprodução, a porta para a câmara dos relógios será liberada.'
  },

  // CAPÍTULO 5
  5: {
    tier1: 'Os relógios na câmara circular marcam horários diferentes, mas um horário específico se repetiu durante todo o jogo.',
    tier2: 'O horário fundamental do Instituto Aurora é o momento em que o alarme e o turno foram disparados.',
    tier3: 'Alinhe todos os quatro relógios da parede para marcarem exatamente 02:17. Isso fará a parede secreta deslizar.'
  },

  // CAPÍTULO 6
  6: {
    tier1: 'A porta vermelha ao final do corredor guarda a revelação sobre a sua percepção alterada.',
    tier2: 'Dentro da sala da porta vermelha, o telefone está tocando e o espelho embaçado apresenta uma anomalia visual.',
    tier3: 'Atenda o telefone vermelho e observe a mensagem que seu próprio reflexo escreverá no espelho: "LEMBRE-SE".'
  },

  // CAPÍTULO 7
  7: {
    tier1: 'O dossiê confidencial da diretoria contém o perfil dos cinco pesquisadores originais.',
    tier2: 'Leia atentamente as anotações sobre o Sujeito 05 para desencadear as memórias reprimidas do Dr. Vance.',
    tier3: 'Examine o Dossiê dos 5 Pesquisadores para disparar o flashback de lembrança e liberar a Estação Central.'
  },

  // CAPÍTULO 8
  8: {
    tier1: 'Na estação central, quatro monitores perderam o sinal e o quinto exibe você mesmo.',
    tier2: 'A escolha final depende da sua interpretação sobre a culpa e o propósito do experimento.',
    tier3: 'Selecione uma das três decisões no console central para acionar o Final 1 (Fuga), Final 2 (Loop) ou Final 3 (Verdade).'
  }
};

class HintsSystem {
  constructor() {
    this.modalHints = document.getElementById('modal-hints');
    this.btnCloseHints = document.getElementById('btn-close-hints');
    this.btnHudHints = document.getElementById('btn-hud-hints');
    this.btnPauseHints = document.getElementById('btn-pause-hints');

    this.boxTier1 = document.getElementById('hint-tier-1');
    this.boxTier2 = document.getElementById('hint-tier-2');
    this.boxTier3 = document.getElementById('hint-tier-3');

    this.textTier1 = document.getElementById('text-hint-1');
    this.textTier2 = document.getElementById('text-hint-2');
    this.textTier3 = document.getElementById('text-hint-3');

    this.statusTier1 = document.getElementById('status-hint-1');
    this.statusTier2 = document.getElementById('status-hint-2');
    this.statusTier3 = document.getElementById('status-hint-3');

    this.btnUnlockTier1 = document.getElementById('btn-unlock-hint-1');
    this.btnUnlockTier2 = document.getElementById('btn-unlock-hint-2');
    this.btnUnlockTier3 = document.getElementById('btn-unlock-hint-3');

    this.initEventListeners();
  }

  initEventListeners() {
    if (this.btnCloseHints) {
      this.btnCloseHints.addEventListener('click', () => this.close());
    }

    if (this.btnHudHints) {
      this.btnHudHints.addEventListener('click', () => this.open());
    }

    if (this.btnPauseHints) {
      this.btnPauseHints.addEventListener('click', () => {
        const pauseModal = document.getElementById('modal-pause');
        if (pauseModal) pauseModal.classList.add('hidden');
        this.open();
      });
    }

    if (this.btnUnlockTier1) {
      this.btnUnlockTier1.addEventListener('click', () => this.unlockTier(1));
    }
    if (this.btnUnlockTier2) {
      this.btnUnlockTier2.addEventListener('click', () => this.unlockTier(2));
    }
    if (this.btnUnlockTier3) {
      this.btnUnlockTier3.addEventListener('click', () => this.unlockTier(3));
    }
  }

  open() {
    soundEngine.playButtonClick();
    this.render();
    if (this.modalHints) this.modalHints.classList.remove('hidden');
  }

  close() {
    if (this.modalHints) this.modalHints.classList.add('hidden');
  }

  render() {
    const chapter = gameState.state.currentChapter;
    const hints = HINTS_DATABASE[chapter] || HINTS_DATABASE[1];

    const key1 = `cap${chapter}_tier1`;
    const key2 = `cap${chapter}_tier2`;
    const key3 = `cap${chapter}_tier3`;

    const is1 = gameState.isHintUnlocked(key1);
    const is2 = gameState.isHintUnlocked(key2);
    const is3 = gameState.isHintUnlocked(key3);

    // Tier 1
    if (is1) {
      this.boxTier1.className = 'hint-tier-box unlocked';
      this.statusTier1.textContent = 'REVELADO';
      this.textTier1.textContent = hints.tier1;
      this.btnUnlockTier1.style.display = 'none';
    } else {
      this.boxTier1.className = 'hint-tier-box';
      this.statusTier1.textContent = 'DISPONÍVEL';
      this.textTier1.textContent = 'Clique no botão abaixo para revelar uma observação sutil do cenário.';
      this.btnUnlockTier1.style.display = 'inline-flex';
    }

    // Tier 2
    if (is2) {
      this.boxTier2.className = 'hint-tier-box unlocked';
      this.statusTier2.textContent = 'REVELADO';
      this.textTier2.textContent = hints.tier2;
      this.btnUnlockTier2.style.display = 'none';
    } else if (is1) {
      this.boxTier2.className = 'hint-tier-box';
      this.statusTier2.textContent = 'DISPONÍVEL';
      this.textTier2.textContent = 'Revela qual objeto ou mecanismo deve ser manipulado.';
      this.btnUnlockTier2.style.display = 'inline-flex';
      this.btnUnlockTier2.disabled = false;
    } else {
      this.boxTier2.className = 'hint-tier-box locked';
      this.statusTier2.textContent = 'BLOQUEADO';
      this.textTier2.textContent = 'Requer o desbloqueio da Pista Nível 1.';
      this.btnUnlockTier2.style.display = 'inline-flex';
      this.btnUnlockTier2.disabled = true;
    }

    // Tier 3
    if (is3) {
      this.boxTier3.className = 'hint-tier-box unlocked';
      this.statusTier3.textContent = 'REVELADO';
      this.textTier3.textContent = hints.tier3;
      this.btnUnlockTier3.style.display = 'none';
    } else if (is2) {
      this.boxTier3.className = 'hint-tier-box';
      this.statusTier3.textContent = 'DISPONÍVEL';
      this.textTier3.textContent = 'Explica o passo a passo completo da solução.';
      this.btnUnlockTier3.style.display = 'inline-flex';
      this.btnUnlockTier3.disabled = false;
    } else {
      this.boxTier3.className = 'hint-tier-box locked';
      this.statusTier3.textContent = 'BLOQUEADO';
      this.textTier3.textContent = 'Requer o desbloqueio da Pista Nível 2.';
      this.btnUnlockTier3.style.display = 'inline-flex';
      this.btnUnlockTier3.disabled = true;
    }
  }

  unlockTier(tierNum) {
    soundEngine.playButtonClick();
    const chapter = gameState.state.currentChapter;
    const key = `cap${chapter}_tier${tierNum}`;
    gameState.unlockHint(key);
    this.render();
  }
}

const hintsSystem = new HintsSystem();
