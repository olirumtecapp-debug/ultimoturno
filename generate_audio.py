#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
O ÚLTIMO TURNO — GERADOR DE GRAVAÇÕES DIEGÉTICAS E FITAS CASSETE (EDGE-TTS)
=============================================================================
Gera exclusivamente as gravações narrativas diegéticas (fitas cassete,
telefonemas misteriosos e epílogos) com vozes maduras, ritmo lento (-12% a -16%),
pausas dramáticas e respiração tensa.
"""

import os
import sys
import asyncio

try:
    import edge_tts
except ImportError:
    print("[ERRO] A biblioteca 'edge-tts' nao esta instalada.")
    print("Execute: uv run --with edge-tts python generate_audio.py")
    sys.exit(1)

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "assets", "audio"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Vozes Expressivas em Português Brasileiro
VOICE_MALE_MATURE   = "pt-BR-AntonioNeural"              # Dr. Vance / Dr. Arthur / Dr. Webb / Voz Telefone
VOICE_FEMALE_HELENA = "pt-BR-FranciscaNeural"            # Dra. Helena Meyer (Científica, Trêmula)
VOICE_FEMALE_CECILIA= "pt-BR-ThalitaMultilingualNeural"  # Dra. Cecília Santos (Melancólica, Desesperada)

# Catálogo Exclusivo das Gravações Diegéticas da História
DIEGETIC_TRACKS = [
    # ==========================================
    # 1. FITAS CASSETE DO INSTITUTO AURORA
    # ==========================================
    {
        "id": "tape_01",
        "voice": VOICE_MALE_MATURE,
        "rate": "-14%",
        "pitch": "-10Hz",
        "text": "Se você chegou até aqui... ... não continue. ... Você acha que está tentando escapar de um prédio trancado... mas as portas não são o seu verdadeiro problema. ... Cada sala que você abre... é apenas uma camada mais profunda... da sua própria negação."
    },
    {
        "id": "tape_02",
        "voice": VOICE_FEMALE_HELENA,
        "rate": "-14%",
        "pitch": "-4Hz",
        "text": "Você sempre faz isso... ... Toda vez que as luzes piscam... e o relógio marca duas e dezessete... você acorda no chão... examina a mesma mesa... atende o telefone... e começa a procurar as mesmas chaves... que você mesmo escondeu."
    },
    {
        "id": "tape_03",
        "voice": VOICE_MALE_MATURE,
        "rate": "-12%",
        "pitch": "-8Hz",
        "text": "Na primeira vez... você abriu a porta errada. ... Você achou que estava salvando os outros quatro pesquisadores... mas você os trancou lá dentro. ... O experimento não falhou por causa do maquinário... ... Falhou por causa de uma escolha sua."
    },
    {
        "id": "tape_04",
        "voice": VOICE_FEMALE_CECILIA,
        "rate": "-14%",
        "pitch": "-6Hz",
        "text": "Você não deveria lembrar... ... Foi por isso que você programou o Instituto para apagar tudo a cada ciclo. ... Se a verdade vier à tona... a culpa será insuportável. ... Por favor... pare de procurar as gravações restantes."
    },
    {
        "id": "tape_05",
        "voice": VOICE_MALE_MATURE,
        "rate": "-15%",
        "pitch": "-10Hz",
        "text": "Se encontrar a sala das duas e dezessete... não entre. ... Ela contém a máquina de retorno. ... E se você olhar para a porta vermelha ao fundo do corredor... dê meia volta. ... O que está do outro lado daquele vidro... não é uma pessoa."
    },
    {
        "id": "tape_own_voice",
        "voice": VOICE_MALE_MATURE,
        "rate": "-16%",
        "pitch": "-8Hz",
        "text": "Meu Deus... ... eu estive aqui antes. ... Eu reconheço a minha própria letra no relatório. ... Eu não sou um prisioneiro tentando escapar... eu fui quem trancou este lugar. ... Se a minha versão futura estiver ouvindo isto... ... o quinto rosto na foto é o seu. ... Não confie na sua própria mente."
    },

    # ==========================================
    # 2. CHAMADAS TELEFÔNICAS DIEGÉTICAS
    # ==========================================
    {
        "id": "cap1_phone_voice_1",
        "voice": VOICE_MALE_MATURE,
        "rate": "-16%",
        "pitch": "-14Hz",
        "text": "Se você está ouvindo isso... ... significa que eu falhei."
    },
    {
        "id": "cap1_phone_voice_2",
        "voice": VOICE_MALE_MATURE,
        "rate": "-14%",
        "pitch": "-14Hz",
        "text": "Não confie na quinta pessoa. ... O relógio sempre marca a hora da sua decisão."
    },
    {
        "id": "cap6_phone_1",
        "voice": VOICE_MALE_MATURE,
        "rate": "-18%",
        "pitch": "-16Hz",
        "text": "Você abriu."
    },
    {
        "id": "cap6_phone_3",
        "voice": VOICE_MALE_MATURE,
        "rate": "-20%",
        "pitch": "-16Hz",
        "text": "Você."
    },

    # ==========================================
    # 3. REGISTRO DE ALERTA NO MONITOR
    # ==========================================
    {
        "id": "cap5_warning",
        "voice": VOICE_MALE_MATURE,
        "rate": "-14%",
        "pitch": "-8Hz",
        "text": "Se você está vendo isso na tela do monitor... ... não abra a porta vermelha. ... Eu repito: não abra a porta vermelha."
    },

    # ==========================================
    # 4. OS 3 FINAIS (EPÍLOGOS NARRADOS)
    # ==========================================
    {
        "id": "ending_fuga",
        "voice": VOICE_MALE_MATURE,
        "rate": "-14%",
        "pitch": "-12Hz",
        "text": "Parabéns pelo seu turno, Doutor. ... Você conseguiu escapar do seu próprio laboratório. ... Agora só falta você encontrar os outros quatro pesquisadores... que você deixou para trás."
    },
    {
        "id": "ending_loop",
        "voice": VOICE_MALE_MATURE,
        "rate": "-18%",
        "pitch": "-12Hz",
        "text": "Se você está ouvindo isso... ... significa que eu falhei."
    },
    {
        "id": "ending_verdade",
        "voice": VOICE_MALE_MATURE,
        "rate": "-12%",
        "pitch": "-6Hz",
        "text": "Agora você finalmente se lembra de quem é. ... O último turno... terminou."
    }
]

async def generate_track(track, total, index):
    audio_path = os.path.join(OUTPUT_DIR, f"{track['id']}.mp3")
    print(f"[{index}/{total}] Sintetizando gravacao diegetica: {track['id']}.mp3 ({track['voice']})...")
    
    communicate = edge_tts.Communicate(
        text=track["text"],
        voice=track["voice"],
        rate=track["rate"],
        pitch=track["pitch"]
    )
    await communicate.save(audio_path)

async def main():
    print("=" * 70)
    print(" O ULTIMO TURNO -- SINTESE DE FITAS E GRAVACOES DIEGETICAS")
    print("=" * 70)
    print(f"Destino: {OUTPUT_DIR}")
    print(f"Faixas diegeticas a gerar: {len(DIEGETIC_TRACKS)}")
    print("-" * 70)

    success = 0
    for i, track in enumerate(DIEGETIC_TRACKS, start=1):
        try:
            await generate_track(track, len(DIEGETIC_TRACKS), i)
            success += 1
        except Exception as e:
            print(f" -> [ERRO ao gerar {track['id']}]: {e}")
        await asyncio.sleep(0.2)

    print("=" * 70)
    print(f" [CONCLUIDO] {success}/{len(DIEGETIC_TRACKS)} gravacoes diegeticas sintetizadas com sucesso!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
