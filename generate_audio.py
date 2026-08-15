#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
O ÚLTIMO TURNO — GERADOR DRAMÁTICO DE GRAVAÇÕES DIEGÉTICAS (EDGE-TTS + SSML)
=============================================================================
Usa edge-tts com SSML rico para simular respiração pesada, hesitação,
sussurros e pânico nas vozes das fitas cassete do Instituto Aurora.
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

# Vozes Neurais por Personagem
VOICE_ANTONIO    = "pt-BR-AntonioNeural"               # Dr. Vance — pesquisador desorientado, voz grave
VOICE_FRANCISCA  = "pt-BR-FranciscaNeural"             # Dra. Helena Meyer — registros formais, trêmula
VOICE_THALITA    = "pt-BR-ThalitaMultilingualNeural"   # Dra. Cecília Santos — melancólica, desesperada

# Wrapper que constrói SSML com prosody + breaks embutidos
def ssml(text_with_breaks: str, rate: str = "-14%", pitch: str = "-8%", voice: str = VOICE_ANTONIO) -> str:
    """
    text_with_breaks: texto onde [P_XXX] vira <break time="XXXms"/> e
    [EMP]...[/EMP] vira <emphasis level="strong">...</emphasis>
    [LOW]...[/LOW] vira <prosody rate="-20%" pitch="-14%">...</prosody>
    """
    t = text_with_breaks
    import re
    # Substituição de marcações customizadas → SSML real
    t = re.sub(r'\[P_(\d+)\]', lambda m: f'<break time="{m.group(1)}ms"/>', t)
    t = re.sub(r'\[EMP\](.*?)\[/EMP\]', r'<emphasis level="strong">\1</emphasis>', t, flags=re.DOTALL)
    t = re.sub(r'\[LOW\](.*?)\[/LOW\]', r'<prosody rate="-20%" pitch="-14%">\1</prosody>', t, flags=re.DOTALL)
    t = re.sub(r'\[WHISPER\](.*?)\[/WHISPER\]', r'<prosody rate="-18%" pitch="-12%" volume="soft">\1</prosody>', t, flags=re.DOTALL)

    body = f'<prosody rate="{rate}" pitch="{pitch}">{t}</prosody>'
    return (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" '
        f'xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="pt-BR">'
        f'<voice name="{voice}">{body}</voice>'
        '</speak>'
    )

DIEGETIC_TRACKS = [
    # ==========================================
    # 1. FITAS CASSETE DO INSTITUTO AURORA
    # ==========================================
    {
        "id": "tape_01",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_400]Se você chegou até aqui[P_800]"
            "[WHISPER]não continue.[/WHISPER][P_900]"
            "Você acha que está tentando escapar de um prédio trancado[P_600]"
            "mas as portas[P_400]não são o seu verdadeiro problema.[P_1000]"
            "[LOW]Cada sala que você abre[P_500]é apenas uma camada mais profunda[P_400]"
            "da sua própria[EMP]negação.[/EMP][/LOW]",
            rate="-16%", pitch="-10%", voice=VOICE_ANTONIO
        )
    },
    {
        "id": "tape_02",
        "voice": VOICE_FRANCISCA,
        "ssml": ssml(
            "[P_300]Você sempre faz isso.[P_800]"
            "Toda vez que as luzes piscam[P_500]e o relógio marca[EMP]duas e dezessete[/EMP][P_700]"
            "você acorda no chão[P_400]examina a mesma mesa[P_400]atende o telefone[P_600]"
            "[LOW]e começa a procurar as mesmas chaves[P_500]que você mesmo escondeu.[/LOW]",
            rate="-14%", pitch="-6%", voice=VOICE_FRANCISCA
        )
    },
    {
        "id": "tape_03",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_500]Na primeira vez[P_700]você abriu a porta errada.[P_1000]"
            "Você achou que estava[EMP]salvando[/EMP] os outros quatro pesquisadores[P_600]"
            "[LOW]mas você os trancou lá dentro.[/LOW][P_1200]"
            "O experimento não falhou por causa do maquinário[P_600]"
            "[WHISPER]Falhou por causa de uma escolha sua.[/WHISPER]",
            rate="-13%", pitch="-9%", voice=VOICE_ANTONIO
        )
    },
    {
        "id": "tape_04",
        "voice": VOICE_THALITA,
        "ssml": ssml(
            "Você não deveria[P_500][EMP]lembrar.[/EMP][P_900]"
            "Foi por isso que você programou o Instituto[P_400]para apagar tudo a cada ciclo.[P_1000]"
            "[LOW]Se a verdade vier à tona[P_500]a culpa será insuportável.[/LOW][P_800]"
            "[WHISPER]Por favor.[P_400]Pare de procurar as gravações restantes.[/WHISPER]",
            rate="-15%", pitch="-7%", voice=VOICE_THALITA
        )
    },
    {
        "id": "tape_05",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_400]Se encontrar a sala das duas e dezessete[P_600]não entre.[P_1000]"
            "[LOW]Ela contém a máquina de retorno.[/LOW][P_800]"
            "E se você olhar para a porta vermelha ao fundo do corredor[P_500]"
            "[EMP]dê meia volta.[/EMP][P_1000]"
            "[WHISPER]O que está do outro lado daquele vidro[P_400]não é uma pessoa.[/WHISPER]",
            rate="-16%", pitch="-11%", voice=VOICE_ANTONIO
        )
    },
    {
        "id": "tape_own_voice",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_600]Meu Deus.[P_1000]"
            "eu estive aqui antes.[P_900]"
            "Eu reconheço[P_400]a minha própria letra no relatório.[P_1000]"
            "[LOW]Eu não sou um prisioneiro tentando escapar.[P_600]"
            "eu fui[EMP]quem trancou este lugar.[/EMP][/LOW][P_1200]"
            "Se a minha versão futura estiver ouvindo isto[P_800]"
            "[WHISPER]o quinto rosto na foto é o seu.[P_600]"
            "Não confie na sua própria mente.[/WHISPER]",
            rate="-18%", pitch="-10%", voice=VOICE_ANTONIO
        )
    },

    # ==========================================
    # 2. CHAMADAS TELEFÔNICAS DIEGÉTICAS
    # ==========================================
    {
        "id": "cap1_phone_voice_1",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_800]Se você está ouvindo isso[P_1000]"
            "[WHISPER]significa que eu falhei.[/WHISPER]",
            rate="-18%", pitch="-15%", voice=VOICE_ANTONIO
        )
    },
    {
        "id": "cap1_phone_voice_2",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_500]Não confie na quinta pessoa.[P_1000]"
            "[LOW]O relógio sempre marca a hora da sua decisão.[/LOW]",
            rate="-16%", pitch="-14%", voice=VOICE_ANTONIO
        )
    },
    {
        "id": "cap6_phone_1",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_1200][WHISPER]Você abriu.[/WHISPER]",
            rate="-20%", pitch="-16%", voice=VOICE_ANTONIO
        )
    },
    {
        "id": "cap6_phone_3",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_1500][EMP]Você.[/EMP]",
            rate="-22%", pitch="-16%", voice=VOICE_ANTONIO
        )
    },

    # ==========================================
    # 3. REGISTRO DE ALERTA NO MONITOR
    # ==========================================
    {
        "id": "cap5_warning",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "Se você está vendo isso na tela do monitor[P_800]"
            "[EMP]não abra a porta vermelha.[/EMP][P_1000]"
            "[LOW]Eu repito.[P_400]Não abra a porta vermelha.[/LOW]",
            rate="-14%", pitch="-9%", voice=VOICE_ANTONIO
        )
    },

    # ==========================================
    # 4. OS 3 FINAIS (EPÍLOGOS NARRADOS)
    # ==========================================
    {
        "id": "ending_fuga",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_600]Parabéns pelo seu turno[P_500]Doutor.[P_1000]"
            "Você conseguiu escapar do seu próprio laboratório.[P_900]"
            "[LOW]Agora só falta você encontrar os outros quatro pesquisadores[P_500]"
            "que você[EMP]deixou para trás.[/EMP][/LOW]",
            rate="-14%", pitch="-12%", voice=VOICE_ANTONIO
        )
    },
    {
        "id": "ending_loop",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_1000][WHISPER]Se você está ouvindo isso[P_800]"
            "significa que eu falhei.[/WHISPER]",
            rate="-20%", pitch="-13%", voice=VOICE_ANTONIO
        )
    },
    {
        "id": "ending_verdade",
        "voice": VOICE_ANTONIO,
        "ssml": ssml(
            "[P_700]Agora você finalmente se lembra[P_500]de quem é.[P_1200]"
            "[LOW]O último turno[P_600]terminou.[/LOW]",
            rate="-13%", pitch="-7%", voice=VOICE_ANTONIO
        )
    },
]

async def generate_track(track: dict, total: int, index: int):
    audio_path = os.path.join(OUTPUT_DIR, f"{track['id']}.mp3")
    voice_label = track["voice"].replace("pt-BR-", "")
    print(f"  [{index:02d}/{total}] {track['id']}.mp3  [{voice_label}]")

    communicate = edge_tts.Communicate(
        text=track["ssml"],
        voice=track["voice"],
    )
    await communicate.save(audio_path)
    size_kb = os.path.getsize(audio_path) // 1024
    print(f"         -> Salvo ({size_kb} KB): {audio_path}")

async def main():
    print("=" * 70)
    print("  O ULTIMO TURNO -- SINTESE SSML DE GRAVACOES DIEGETICAS")
    print("=" * 70)
    print(f"  Destino : {OUTPUT_DIR}")
    print(f"  Faixas  : {len(DIEGETIC_TRACKS)}")
    print("-" * 70)

    success = 0
    for i, track in enumerate(DIEGETIC_TRACKS, start=1):
        try:
            await generate_track(track, len(DIEGETIC_TRACKS), i)
            success += 1
        except Exception as e:
            print(f"  -> [ERRO ao gerar {track['id']}]: {e}")
        await asyncio.sleep(0.25)

    print("=" * 70)
    print(f"  [CONCLUIDO] {success}/{len(DIEGETIC_TRACKS)} gravacoes diegeticas geradas!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
