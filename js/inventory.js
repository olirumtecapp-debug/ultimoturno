/**
 * O ÚLTIMO TURNO — SISTEMA DE INVENTÁRIO & INSPEÇÃO DETALHADA
 * Gerencia a lista de itens, renderização fotorrealista com fotos macro,
 * modo de inspeção 3D com rotação/verso e uso nos cenários.
 */

const ITEM_DATABASE = {
  item_photo_researchers: {
    id: 'item_photo_researchers',
    name: 'FOTOGRAFIA DOS 5 PESQUISADORES',
    type: 'DOCUMENTO FOTOGRÁFICO',
    image: 'assets/images/item_foto_polaroid.png',
    icon: `<img src="assets/images/item_foto_polaroid.png" alt="Foto" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`,
    description: 'Uma fotografia polaroid dos cinco fundadores do Instituto Aurora. Quatro pesquisadores posam em seus jalecos, mas o quinto rosto foi riscado violentamente com tinta preta.',
    extra: 'Ao examinar a fotografia, a legenda diz: "WE WERE FIVE". Uma sensação de náusea e familiaridade invade sua mente.',
    canFlip: true,
    backText: 'VERSO DA FOTO: "NÃO CONFIE NA QUINTA PESSOA. O EXPERIMENTO NUNCA DEVERIA TER COMEÇADO."'
  },

  item_rusty_key: {
    id: 'item_rusty_key',
    name: 'CHAVE METÁLICA DO SETOR B',
    type: 'CHAVE MECÂNICA',
    image: 'assets/images/item_chave_ferro.png',
    icon: `<img src="assets/images/item_chave_ferro.png" alt="Chave" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`,
    description: 'Uma chave de ferro forjado pesada com entalhes oxidados. Encontrada trancada no armário de observação.',
    extra: 'Ideal para destravar a porta metálica que leva ao corredor principal.',
    canFlip: false
  },

  item_cassette_01: {
    id: 'item_cassette_01',
    name: 'FITA CASSETE #01',
    type: 'GRAVAÇÃO MAGNÉTICA',
    image: 'assets/images/item_fita_cassete.png',
    icon: `<img src="assets/images/item_fita_cassete.png" alt="Fita" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`,
    description: 'Uma fita magnética preta dos anos 80. Rótulo com caligrafia em tinta vermelha: "REGISTRO CONFIDENCIAL #05".',
    extra: 'Pode ser inserida no gravador de rolo ou no leitor de fitas da Sala de Arquivos.',
    canFlip: true,
    backText: 'ETIQUETA: "A verdade está dividida em 5 partes."'
  },

  item_keycard_aurora: {
    id: 'item_keycard_aurora',
    name: 'CARTÃO MAGNÉTICO DE ACESSO AURORA',
    type: 'CARTÃO DE SEGURANÇA',
    image: 'assets/images/item_cartao_acesso.png',
    icon: `<img src="assets/images/item_cartao_acesso.png" alt="Cartão" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`,
    description: 'Cartão de identificação oficial do Instituto Aurora com nível de acesso 4 — ACESSO TOTAL.',
    extra: 'Permite autenticar terminais do Laboratório e abrir as portas dos Arquivos.',
    canFlip: true,
    backText: 'SENHA DE EMERGÊNCIA: "017-AURORA"'
  },

  item_fuse_15a: {
    id: 'item_fuse_15a',
    name: 'FUSÍVEL INDUSTRIAL 15A',
    type: 'COMPONENTE ELÉTRICO',
    image: 'assets/images/item_chave_ferro.png',
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="24" width="32" height="16" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
      <rect x="22" y="26" width="20" height="12" fill="#38bdf8" opacity="0.6"/>
      <path d="M26 32h12" stroke="#eab308" stroke-width="2"/>
      <rect x="12" y="22" width="6" height="20" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
      <rect x="46" y="22" width="6" height="20" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
    </svg>`,
    description: 'Um fusível de alta capacidade para caixas de disjuntores de instalações pesadas.',
    extra: 'Essencial para substituir a chave de força no quadro elétrico do corredor.',
    canFlip: false
  },

  item_tape_own_voice: {
    id: 'item_tape_own_voice',
    name: 'FITA CASSETE CONFIDENCIAL',
    type: 'GRAVAÇÃO CLASSIFICADA',
    image: 'assets/images/item_fita_cassete.png',
    icon: `<img src="assets/images/item_fita_cassete.png" alt="Fita Confidencial" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`,
    description: 'Uma fita cassete com gravação pessoal do Dr. Vance reconhecendo sua própria voz e o papel no isolamento do complexo.',
    extra: 'O segredo mais perturbador sobre a sua verdadeira identidade.',
    canFlip: true,
    backText: 'AVISO: "NÃO OUÇA SE VOCÊ DESEJA CONTINUAR EM PAZ."'
  },

  item_master_red_key: {
    id: 'item_master_red_key',
    name: 'CHAVE MESTRA DA PORTA VERMELHA',
    type: 'CHAVE MESTRA DE CONTENÇÃO',
    image: 'assets/images/item_chave_ferro.png',
    icon: `<img src="assets/images/item_chave_ferro.png" alt="Chave Mestra" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`,
    description: 'Chave mestra de latão maciço e ferro forjado obtida no cofre temporal da Sala 02:17.',
    extra: 'Capaz de abrir os trincos hidráulicos da Monumental Porta Vermelha.',
    canFlip: false
  }
};

class InventorySystem {
  constructor() {
    this.slotsContainer = document.getElementById('inventory-slots');
    this.selectedItemNameEl = document.getElementById('selected-item-name');
    this.inventoryCountEl = document.getElementById('inventory-count');
    
    // Modal de Inspeção
    this.modalInspect = document.getElementById('modal-inspect-item');
    this.inspectNameEl = document.getElementById('inspect-item-name');
    this.inspectTypeEl = document.getElementById('inspect-item-type');
    this.inspectDescEl = document.getElementById('inspect-item-desc');
    this.inspectExtraEl = document.getElementById('inspect-item-extra');
    this.inspectVisualEl = document.getElementById('inspect-3d-visual');
    this.btnInspectFlip = document.getElementById('btn-inspect-flip');
    this.btnInspectUse = document.getElementById('btn-inspect-use');
    this.btnCloseInspect = document.getElementById('btn-close-inspect');

    this.currentInspectedItem = null;
    this.isFlipped = false;

    this.init();
  }

  init() {
    gameState.subscribe(() => this.render());

    if (this.btnInspectFlip) {
      this.btnInspectFlip.addEventListener('click', () => this.toggleFlip());
    }

    if (this.btnCloseInspect) {
      this.btnCloseInspect.addEventListener('click', () => {
        if (this.modalInspect) this.modalInspect.classList.add('hidden');
      });
    }

    if (this.btnInspectUse) {
      this.btnInspectUse.addEventListener('click', () => {
        if (this.currentInspectedItem) {
          gameState.selectItem(this.currentInspectedItem.id);
          if (this.modalInspect) this.modalInspect.classList.add('hidden');
          if (window.toast) window.toast(`Item pronto para uso: ${this.currentInspectedItem.name}`);
        }
      });
    }
  }

  render() {
    const items = gameState.state.inventory;
    const selected = gameState.state.selectedItem;

    if (this.inventoryCountEl) {
      this.inventoryCountEl.textContent = items.length;
    }

    if (this.selectedItemNameEl) {
      if (selected && ITEM_DATABASE[selected]) {
        this.selectedItemNameEl.textContent = ITEM_DATABASE[selected].name;
      } else {
        this.selectedItemNameEl.textContent = 'Nenhum item selecionado';
      }
    }

    if (!this.slotsContainer) return;
    this.slotsContainer.innerHTML = '';

    const totalSlots = Math.max(8, items.length);
    for (let i = 0; i < totalSlots; i++) {
      const itemId = items[i];
      const slot = document.createElement('div');
      slot.className = 'inventory-slot';

      if (itemId && ITEM_DATABASE[itemId]) {
        const item = ITEM_DATABASE[itemId];
        if (selected === itemId) slot.classList.add('selected');

        slot.innerHTML = `
          <div class="slot-item-icon">${item.icon}</div>
          <span class="slot-item-name-tag">${item.name}</span>
        `;

        slot.addEventListener('click', () => {
          soundEngine.playButtonClick();
          gameState.selectItem(itemId);
        });

        slot.addEventListener('dblclick', () => {
          this.openInspection(item);
        });
      } else {
        slot.classList.add('empty');
      }

      this.slotsContainer.appendChild(slot);
    }
  }

  openInspection(item) {
    if (!item) return;
    this.currentInspectedItem = item;
    this.isFlipped = false;
    soundEngine.playButtonClick();

    if (this.inspectNameEl) this.inspectNameEl.textContent = item.name;
    if (this.inspectTypeEl) this.inspectTypeEl.textContent = item.type;
    if (this.inspectDescEl) this.inspectDescEl.textContent = item.description;
    if (this.inspectExtraEl) this.inspectExtraEl.textContent = item.extra || '';

    if (this.btnInspectFlip) {
      this.btnInspectFlip.style.display = item.canFlip ? 'inline-flex' : 'none';
    }

    this.renderInspectVisual(item);

    if (this.modalInspect) {
      this.modalInspect.classList.remove('hidden');
    }
  }

  renderInspectVisual(item) {
    if (!this.inspectVisualEl) return;
    
    const frontContent = item.image 
      ? `<img src="${item.image}" alt="${item.name}" style="width: 220px; height: 220px; object-fit: cover; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.9); border: 2px solid rgba(255,255,255,0.15);">`
      : `<div style="width: 160px; height: 160px;">${item.icon}</div>`;

    this.inspectVisualEl.innerHTML = `
      <div class="inspect-3d-wrapper ${this.isFlipped ? 'flipped' : ''}" id="inspect-wrapper">
        <div class="inspect-face face-front">
          ${frontContent}
        </div>
        <div class="inspect-face face-back">
          <div class="inspect-back-paper">
            <p>${item.backText || 'Nenhuma inscrição visível no verso.'}</p>
          </div>
        </div>
      </div>
    `;
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    soundEngine.playButtonClick();
    const wrapper = document.getElementById('inspect-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('flipped', this.isFlipped);
    }
  }
}

const inventorySystem = new InventorySystem();
