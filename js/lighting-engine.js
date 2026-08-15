/**
 * O ÚLTIMO TURNO — MOTOR DE ILUMINAÇÃO VOLUMÉTRICA & LANTERNA EM TEMPO REAL
 * Renderiza máscara de escuridão dinâmica, facho cônico da lanterna com penumbra suave,
 * partículas de poeira suspensas, luz de emergência vermelha pulsante e realce de hotspots.
 */

class LightingEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    
    // Posição da Lanterna / Feixe de Luz
    this.lightX = window.innerWidth / 2;
    this.lightY = window.innerHeight / 2;
    this.targetX = window.innerWidth / 2;
    this.targetY = window.innerHeight / 2;
    
    // Parâmetros da Luz
    this.lightRadius = 280;
    this.ambientDarkness = 0.95; // Nível de escuridão profunda
    this.isFlashlightOn = true;
    this.emergencyMode = false;
    this.emergencyStrobeIntensity = 0;
    
    // Partículas de Poeira Volumétrica
    this.particles = [];
    this.maxParticles = 65;

    // Faíscas Elétricas Dinâmicas
    this.sparks = [];

    this.animationFrame = null;
    this.init();
  }

  init() {
    let canvas = document.getElementById('lighting-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'lighting-canvas';
      canvas.className = 'lighting-canvas';
      
      const stage = document.getElementById('scene-stage');
      const viewport = document.getElementById('scene-viewport');
      if (stage) {
        stage.appendChild(canvas);
      } else if (viewport) {
        viewport.appendChild(canvas);
      } else {
        document.body.appendChild(canvas);
      }
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.resize();
    this.createParticles();
    this.setupEventListeners();
    this.startRenderLoop();
  }

  resize() {
    const stage = document.getElementById('scene-stage') || this.canvas.parentElement || document.body;
    const rect = stage.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;
    
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.1, // leve convecção térmica
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());

    // Seguir o mouse suavemente
    window.addEventListener('mousemove', (e) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      this.targetX = e.clientX - rect.left;
      this.targetY = e.clientY - rect.top;
    });

    // Toque no celular
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0 && this.canvas) {
        const rect = this.canvas.getBoundingClientRect();
        this.targetX = e.touches[0].clientX - rect.left;
        this.targetY = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    // Tecla F para alternar lanterna
    window.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') {
        this.toggleFlashlight();
      }
    });
  }

  toggleFlashlight() {
    this.isFlashlightOn = !this.isFlashlightOn;
    if (typeof soundEngine !== 'undefined') soundEngine.playBreakerSwitch();
    if (window.toast) {
      window.toast(this.isFlashlightOn ? 'Lanterna LIGADA [F]' : 'Lanterna DESLIGADA [F]');
    }
  }

  triggerSparks(x, y, count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.sparks.push({
        x: x || this.width * 0.12,
        y: y || this.height * 0.36,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 1.2,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        color: Math.random() > 0.3 ? '#facc15' : '#ef4444'
      });
    }
  }

  startRenderLoop() {
    const render = () => {
      this.update();
      this.draw();
      this.animationFrame = requestAnimationFrame(render);
    };
    render();
  }

  update() {
    // Interpolação suave (Lerp) para a lanterna
    this.lightX += (this.targetX - this.lightX) * 0.14;
    this.lightY += (this.targetY - this.lightY) * 0.14;

    // Pulsação de luz de emergência vermelha (Estrobo sutil)
    const time = Date.now() * 0.003;
    this.emergencyStrobeIntensity = (Math.sin(time) + 1) * 0.5;

    // Atualização das partículas de poeira
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
    }

    // Atualização das faíscas elétricas
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.25; // gravidade
      s.life -= s.decay;
      if (s.life <= 0) {
        this.sparks.splice(i, 1);
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Escuridão de fundo com Blend Mode
    ctx.save();
    
    // Cor de base da escuridão profunda (com matiz avermelhado se estiver em alarme)
    if (this.emergencyMode) {
      const redAlpha = 0.88 + this.emergencyStrobeIntensity * 0.08;
      ctx.fillStyle = `rgba(18, 4, 6, ${redAlpha})`;
    } else {
      ctx.fillStyle = `rgba(3, 4, 7, ${this.ambientDarkness})`;
    }
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Se a lanterna estiver ligada, abre a máscara volumétrica suave
    if (this.isFlashlightOn) {
      ctx.globalCompositeOperation = 'destination-out';

      // Leve tremor orgânico da mão do personagem
      const handTremble = Math.sin(Date.now() * 0.008) * 3;
      const radius = this.lightRadius + handTremble;
      
      const grad = ctx.createRadialGradient(
        this.lightX, this.lightY, 15,
        this.lightX, this.lightY, radius
      );

      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.95)');
      grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.6)');
      grad.addColorStop(0.88, 'rgba(0, 0, 0, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.lightX, this.lightY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Luz ambiente secundária difusa vinda de cima
      const topAmbient = ctx.createRadialGradient(
        this.width * 0.5, 40, 10,
        this.width * 0.5, 40, 240
      );
      topAmbient.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
      topAmbient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topAmbient;
      ctx.fillRect(0, 0, this.width, this.height * 0.4);
    }

    ctx.restore();

    // 3. Efeito de feixe de luz, halo e partículas iluminadas
    if (this.isFlashlightOn) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Halo sutil da lente de vidro
      const haloGrad = ctx.createRadialGradient(
        this.lightX, this.lightY, 5,
        this.lightX, this.lightY, this.lightRadius * 0.85
      );
      haloGrad.addColorStop(0, 'rgba(255, 248, 220, 0.18)');
      haloGrad.addColorStop(0.6, 'rgba(186, 230, 253, 0.06)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(this.lightX, this.lightY, this.lightRadius, 0, Math.PI * 2);
      ctx.fill();

      // Partículas de poeira suspensa iluminadas
      for (let p of this.particles) {
        const dx = p.x - this.lightX;
        const dy = p.y - this.lightY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.lightRadius) {
          const intensity = (1 - dist / this.lightRadius) * p.alpha;
          ctx.fillStyle = `rgba(255, 255, 240, ${intensity * 0.85})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    // 4. Luz de Emergência Vermelha Pulsante (Alarme)
    if (this.emergencyMode) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      const strobeGrad = ctx.createRadialGradient(
        this.width * 0.5, this.height * 0.3, 50,
        this.width * 0.5, this.height * 0.3, this.width * 0.7
      );
      const alpha = this.emergencyStrobeIntensity * 0.15;
      strobeGrad.addColorStop(0, `rgba(239, 68, 68, ${alpha})`);
      strobeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = strobeGrad;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }

    // 5. Faíscas elétricas com emissão de luz
    if (this.sparks.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let s of this.sparks) {
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5 * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
}

// Instância global do motor de iluminação
window.lightingEngine = new LightingEngine();
