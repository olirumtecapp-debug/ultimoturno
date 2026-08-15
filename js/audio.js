/**
 * O ÚLTIMO TURNO — MOTOR DE ÁUDIO PROCEDURAL & PROCESSAMENTO DE FITAS ANALÓGICAS
 * Suporte robusto a Autoplay Policy dos navegadores, desbloqueio por gesto do usuário,
 * caminhos relativos seguros (./assets/audio/...) e logs de depuração.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.ambienceGain = null;
    this.voiceGain = null;
    
    this.isMuted = false;
    this.masterVolume = 0.85;
    this.sfxVolume = 0.9;
    this.ambienceVolume = 0.7;
    this.voiceVolume = 1.0;
    
    this.ambienceNodes = [];
    this.currentVoiceAudio = null;
    this.voiceSourceNode = null;
    this.tapeHissNode = null;
    this.tapeHissGain = null;
    this.isUnlocked = false;
  }

  // Desbloqueia e inicializa o AudioContext no primeiro clique/toque
  init() {
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(err => console.warn('[Audio] Erro ao resumir context:', err));
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('[Audio] Web Audio API não suportada neste navegador.');
        return;
      }

      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
      
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(this.voiceVolume, this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);

      this.isUnlocked = true;
      console.log('[Audio] AudioContext inicializado com sucesso. Estado:', this.ctx.state);
      this.startAmbientDrone();
    } catch (e) {
      console.error('[Audio] Falha ao inicializar Web Audio API:', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        console.log('[Audio] AudioContext retomado.');
      }).catch(err => {
        console.warn('[Audio] Falha ao retomar AudioContext:', err);
      });
    }
  }

  // Gera curva de saturação analógica sutil para simular fita magnética
  makeDistortionCurve(amount = 18) {
    const k = typeof amount === 'number' ? amount : 18;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // ==========================================
  // REPRODUÇÃO EXCLUSIVA DE GRAVAÇÕES DIEGÉTICAS (FITAS & RÁDIO)
  // ==========================================

  playVoice(audioPath, fallbackText, channelType = 'radio', onEndCallback = null) {
    this.stopVoice();
    if (!audioPath) {
      if (onEndCallback) onEndCallback();
      return;
    }

    this.init();
    this.resume();

    // Normaliza caminho relativo (garante ./assets/audio/...)
    let cleanPath = audioPath;
    if (!cleanPath.startsWith('http') && !cleanPath.startsWith('./')) {
      cleanPath = './' + cleanPath.replace(/^\/+/, '');
    }

    try {
      console.log(`[Audio] Carregando gravação diegética: ${cleanPath}`);
      const audio = new Audio(cleanPath);
      audio.preload = "auto";
      this.currentVoiceAudio = audio;

      // Efeito mecânico de estalo de cabeçote magnético / acionamento de relé
      this.playTapeClickStart();
      this.startTapeHiss();

      // Roteamento DSP pelo Web Audio API (Filtro Bandpass 1400Hz + Saturação WaveShaper)
      if (this.ctx && this.ctx.state === 'running') {
        try {
          const source = this.ctx.createMediaElementSource(audio);
          this.voiceSourceNode = source;

          // 1. Filtro Bandpass em 1400Hz (Q 1.2) para cortar graves profundos e agudos limpos
          const bandpass = this.ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.frequency.setValueAtTime(1400, this.ctx.currentTime);
          bandpass.Q.setValueAtTime(1.2, this.ctx.currentTime);

          // 2. WaveShaperNode para distorção/saturação analógica suave em picos de volume
          const shaper = this.ctx.createWaveShaper();
          shaper.curve = this.makeDistortionCurve(16);
          shaper.oversample = '4x';

          // Conexão em cascata: Fonte -> Bandpass -> WaveShaper -> VoiceGain
          source.connect(bandpass);
          bandpass.connect(shaper);
          shaper.connect(this.voiceGain);
        } catch (dspErr) {
          // Fallback para volume direto se createMediaElementSource já estiver vinculado
          audio.volume = this.voiceVolume * this.masterVolume;
        }
      } else {
        audio.volume = this.voiceVolume * this.masterVolume;
      }

      // Ativa animação das ondas de áudio na interface
      const waves = document.querySelectorAll('.audio-wave-anim');
      waves.forEach(w => w.classList.add('active'));

      audio.onended = () => {
        console.log(`[Audio] Gravação concluída: ${cleanPath}`);
        waves.forEach(w => w.classList.remove('active'));
        this.stopTapeHiss();
        this.playTapeClickEnd();
        this.currentVoiceAudio = null;
        if (onEndCallback) onEndCallback();
      };

      audio.onerror = (e) => {
        console.error(`[Audio] Erro ao reproduzir o arquivo de áudio (${cleanPath}):`, e);
        waves.forEach(w => w.classList.remove('active'));
        this.stopTapeHiss();
        this.currentVoiceAudio = null;
        if (onEndCallback) onEndCallback();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((playErr) => {
          console.warn(`[Audio] Autoplay bloqueado ou arquivo indisponível (${cleanPath}):`, playErr);
          waves.forEach(w => w.classList.remove('active'));
          this.stopTapeHiss();
          this.currentVoiceAudio = null;
          if (onEndCallback) onEndCallback();
        });
      }
    } catch (e) {
      console.error('[Audio] Exceção geral ao executar gravação:', e);
      if (onEndCallback) onEndCallback();
    }
  }

  stopVoice() {
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      } catch (e) {}
      this.currentVoiceAudio = null;
      this.playTapeClickEnd();
    }

    this.stopTapeHiss();

    const waves = document.querySelectorAll('.audio-wave-anim');
    waves.forEach(w => w.classList.remove('active'));
  }

  // ==========================================
  // EFEITOS ESPECIAIS DE FITA ANALÓGICA (TAPE HISS & CLICKS)
  // ==========================================

  startTapeHiss() {
    if (!this.ctx || this.tapeHissNode || this.ctx.state !== 'running') return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.04; // Ruído branco analógico
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filtro passa-faixa para simular ruído de cabeçote magnético
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(1.2, this.ctx.currentTime);

      // Volume de 15% (0.15) enquanto a fita estiver ativa
      this.tapeHissGain = this.ctx.createGain();
      this.tapeHissGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

      whiteNoise.connect(bandpass);
      bandpass.connect(this.tapeHissGain);
      this.tapeHissGain.connect(this.voiceGain);

      whiteNoise.start();
      this.tapeHissNode = whiteNoise;
    } catch (e) {}
  }

  stopTapeHiss() {
    if (this.tapeHissNode) {
      try {
        if (this.tapeHissGain) {
          this.tapeHissGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        this.tapeHissNode.stop();
        this.tapeHissNode.disconnect();
      } catch (e) {}
      this.tapeHissNode = null;
      this.tapeHissGain = null;
    }
  }

  playTapeClickStart() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playTapeClickEnd() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.06);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  // ==========================================
  // AMBIÊNCIA CONTÍNUA & SUSPENSE
  // ==========================================

  startAmbientDrone() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    this.stopAmbientDrone();

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(58.5, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.ambienceGain);

      osc1.start();
      osc2.start();

      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ambienceGain);

      whiteNoise.start();
      this.ambienceNodes = [osc1, osc2, whiteNoise, droneGain, noiseGain];
    } catch (e) {}
  }

  stopAmbientDrone() {
    this.ambienceNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambienceNodes = [];
  }

  // ==========================================
  // EFEITOS MECÂNICOS & INTERATIVOS (SFX)
  // ==========================================

  playButtonHover() {
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  playButtonClick() {
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playTypewriterKey() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const randomFreq = 500 + Math.random() * 300;
      osc.frequency.setValueAtTime(randomFreq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch (e) {}
  }

  playClockTick() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch (e) {}
  }

  playDoorUnlock() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.frequency.setValueAtTime(450, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.06);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc1.connect(gain1);
      gain1.connect(this.sfxGain);
      osc1.start(now);
      osc1.stop(now + 0.06);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(180, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(35, now + 0.35);
      gain2.gain.setValueAtTime(0.25, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch (e) {}
  }

  // Estouro de lâmpada ao restaurar o quadro de força (Cap 2)
  playLightBulbBurst() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;

      // Faísca / click elétrico inicial
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      noise.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noise.start(now);

      // Tom grave de estalo de filamento
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.4);
      gain.gain.setValueAtTime(0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + 0.05);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  playHeartbeat() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  playBreakerSwitch() {
    this.playButtonClick();
  }

  playTapeDeckClick() {
    this.playTapeClickStart();
  }

  playMemoryGlitch() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  setMasterVolume(val) {
    this.masterVolume = val;
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = val;
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  setAmbienceVolume(val) {
    this.ambienceVolume = val;
    if (this.ambienceGain) {
      this.ambienceGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }
}

// Instância global do motor de som
const soundEngine = new SoundEngine();

// Desbloqueio Global Uncondicional de Áudio ao primeiro gesto do usuário
const unlockUserAudio = () => {
  soundEngine.init();
  soundEngine.resume();
  window.removeEventListener('click', unlockUserAudio);
  window.removeEventListener('touchstart', unlockUserAudio);
  window.removeEventListener('keydown', unlockUserAudio);
};
window.addEventListener('click', unlockUserAudio, { once: true });
window.addEventListener('touchstart', unlockUserAudio, { once: true });
window.addEventListener('keydown', unlockUserAudio, { once: true });
