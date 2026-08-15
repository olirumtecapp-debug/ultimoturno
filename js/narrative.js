/**
 * O ÚLTIMO TURNO — ROTEIRO NARRATIVO COMPLETO
 * Diálogos cinematográficos, transcrições de fitas, documentos confidenciais,
 * chamadas telefônicas perturbadoras e 3 finais com áudio diegético exclusivo.
 */

const NARRATIVE_DATABASE = {
  // ==========================================
  // DOCUMENTOS TEXTUAIS
  // ==========================================
  documents: {
    doc_welcome_protocol: {
      id: 'doc_welcome_protocol',
      title: 'PROTOCOLO DE OBSERVAÇÃO #01',
      date: '14/11/1986',
      stamp: 'CONFIDENCIAL',
      content: `INSTITUTO AURORA — DIVISÃO DE NEUROCOGNITIVA
LOCAL: Sala de Observação Inicial (Setor B)

INSTRUÇÃO AO MONITOR DE TURNO:
Ao despertar, o sujeito experimentará desorientação temporal transitória e amnésia retrógrada induzida pelo processo.

CÓDIGO DE EMERGÊNCIA DO ARMÁRIO:
A combinação de 4 dígitos é baseada nos parâmetros do protocolo:
- Dígito 1: Quantidade de pesquisadores titulares no projeto.
- Dígito 2: Hora marcada no relógio de sincronização.
- Dígito 3: Número de falhas críticas registradas no Setor B (Consulte a anotação na mesa).
- Dígito 4: Mês de início das operações do Instituto (Consulte o calendário).`
    },

    doc_aurora_project: {
      id: 'doc_aurora_project',
      title: 'PROJETO AURORA — DIRETRIZES DE REESCRITA',
      date: '02/03/1987',
      stamp: 'NÍVEL DE ACESSO 4',
      content: `OBJETIVO DO PROJETO AURORA:
Estudo da maleabilidade da memória episódica humana e reprogramação de traumas por meio de estimulação eletroconvulsiva de baixa frequência.

OBSERVAÇÕES DO DIRETOR:
A mente humana não armazena fatos como um arquivo estático; ela reconstrói cada lembrança no momento em que é evocada. 
Se alterarmos os pontos de ancoragem (fotografias, horários repetidos, sons específicos), o sujeito aceitará uma nova identidade sem resistência.

AVISO CRÍTICO:
Em caso de quebra de contenção cognitiva, o sujeito tenderá a buscar uma saída física, ignorando que o verdadeiro confinamento é puramente mental.`
    },

    doc_file_017: {
      id: 'doc_file_017',
      title: 'ARQUIVO CLÍNICO #017 — SUJEITO 05',
      date: '28/08/1987',
      stamp: 'ANOMALIA DETECTADA',
      content: `RELATÓRIO DE MONITORAMENTO:
Sujeito 05 apresenta resistência atípica aos ciclos de reinicialização de memória.

MANIFESTAÇÕES DO PACIENTE:
- O paciente insiste veementemente que "já esteve nesta sala antes".
- Durante os testes de reflexo, relata que sua própria imagem no espelho não se move em sincronia.
- Deixou mensagens rabiscadas pelas instalações alertando a si mesmo sobre "não confiar na quinta pessoa".

CONCLUSÃO:
O Sujeito 05 é o arquiteto do próprio sistema. Se ele se lembrar de sua função original, todo o complexo entrará em colapso reflexivo.`
    },

    doc_executive_dossier: {
      id: 'doc_executive_dossier',
      title: 'DOSSIÊ DOS 5 PESQUISADORES — SESSÃO FINAL',
      date: '19/10/1987',
      stamp: 'DESTRUIÇÃO IMEDIATA',
      content: `REGISTRO DOS PARTICIPANTES DO EXPERIMENTO AURORA:

1. Dra. Helena Meyer — Neurobiologista Chefe (Sinal Perdido)
2. Dr. Arthur Pendelton — Especialista em Psicometria (Sinal Perdido)
3. Dra. Cecília Santos — Analista de Ondas Cerebrais (Sinal Perdido)
4. Dr. Marcus Webb — Engenheiro de Sistemas (Sinal Perdido)
5. DR. VANCE — Idealizador do Projeto e Sujeito de Teste Voluntário.

ÚLTIMA GRAVAÇÃO DE DISCUSSÃO:
"Você não pode apagar sua própria culpa nos colocando nesta simulação!"
"Não é uma simulação... é a única maneira de descobrir qual de nós cometeu o erro fatal."`
    }
  },

  // ==========================================
  // GRAVAÇÕES DIEGÉTICAS & FITAS CASSETE (ÁUDIO FALADO)
  // ==========================================
  tapes: {
    tape_01: {
      id: 'tape_01',
      audio: 'assets/audio/tape_01.mp3',
      title: 'FITA 01 — REGISTRO DE OBSERVAÇÃO',
      speaker: 'DR. VANCE',
      duration: '0:55',
      transcript: `"Gravação de registro... 14 de outubro. Se alguém encontrar esta fita... eu... eu ainda estou preso no Setor de Observação. As luzes de emergência caíram... e os terminais não respondem ao protocolo padrão. Tem algo no duto de ventilação... eu consigo ouvir o metal rangendo. O código de contenção primário precisa ser inserido antes que a pressão da câmara colapse! Não olhem diretamente para o visor da porta... por favor..."`
    },
    tape_02: {
      id: 'tape_02',
      audio: 'assets/audio/tape_02.mp3',
      title: 'FITA 02 — ISOLAMENTO MAGNÉTICO',
      speaker: 'DRA. HELENA MEYER',
      duration: '0:45',
      transcript: `"Protocolo de segurança nível quatro ativado. O espécime quebrou o isolamento magnético às três da manhã. Nós tentamos reverter o fluxo pelo painel central, mas... os cartões magnéticos foram danificados. As chaves de acesso manuais foram divididas entre os armários do corredor B. Se você está ouvindo isso... não tente ligar os geradores principais de uma vez só. A sobrecarga vai trancar todas as saídas!"`
    },
    tape_03: {
      id: 'tape_03',
      audio: 'assets/audio/tape_03.mp3',
      title: 'FITA 03 — SALA DE ARQUIVOS',
      speaker: 'DRA. CECÍLIA SANTOS',
      duration: '0:48',
      transcript: `"Eu tranquei a porta da sala de arquivos por dentro... mas a tranca... a tranca não vai aguentar muito tempo. A fita de áudio original revela que eles sabiam do risco desde o início. O código do cofre do laboratório está escondido atrás do diagrama na parede. Se você conseguir chegar até a saída de emergência... corte a energia do relé auxiliar primeiro. Eles... eles estão nos corredores..."`
    },
    tape_04: {
      id: 'tape_04',
      audio: 'assets/audio/tape_04.mp3',
      title: 'FITA 04 — CENTRAL DE SEGURANÇA',
      speaker: 'OFICIAL DE SEGURANÇA',
      duration: '0:38',
      transcript: `"Central de segurança, último aviso! A evacuação falhou. Todas as portas corta-fogo foram seladas automaticamente pelo sistema central! A única rota restante é através do duto de manutenção da subestação. Você vai precisar do fusível de alta voltagem e da chave mestra do painel elétrico. Não confiem nos monitores de vídeo... o que aparece nas câmeras já não é mais deste lugar!"`
    },
    tape_05: {
      id: 'tape_05',
      audio: 'assets/audio/tape_05.mp3',
      title: 'FITA 05 — CAIXA DE FUSÍVEIS',
      speaker: 'DR. VANCE',
      duration: '0:46',
      transcript: `"Dia dois após o incidente. O oxigênio no nível inferior está diminuindo rápido demais. Consegui religar o primeiro disjuntor na caixa de fusíveis, mas o painel de sobrecarga requer uma sequência de quatro dígitos. A pista está no manual do turno da noite, na gaveta trancada da bancada. Não se aproximem do tanque de refrigeração... ele começou a vazar."`
    },
    tape_06: {
      id: 'tape_06',
      audio: 'assets/audio/tape_06.mp3',
      title: 'FITA 06 — PULSO ELETROMAGNÉTICO',
      speaker: 'DRA. HELENA MEYER',
      duration: '0:35',
      transcript: `"O comportamento do objeto mudou drasticamente. Ele não reage à luz ultravioleta como esperávamos... ele se alimenta do pulso eletromagnético da rede! Desliguem os monitores! Apaguem as luzes dos corredores! Ele se move nas sombras onde a eletricidade estática é mais densa..."`
    },
    tape_07: {
      id: 'tape_07',
      audio: 'assets/audio/tape_07.mp3',
      title: 'FITA 07 — A NÉVOA CENTRAL',
      speaker: 'DRA. CECÍLIA SANTOS',
      duration: '0:42',
      transcript: `"Se meu irmão encontrar este gravador... me perdoe. Nós fomos proibidos de registrar os sintomas... mas a névoa começou a entrar pela ventilação central. Meus dedos estão perdendo a sensibilidade. A combinação para a porta blindada é a data de fundação do complexo... não esqueça... mil novecentos e oitenta e..."`
    },
    tape_08: {
      id: 'tape_08',
      audio: 'assets/audio/tape_08.mp3',
      title: 'FITA 08 — BLOCO C',
      speaker: 'OFICIAL DE SEGURANÇA',
      duration: '0:26',
      transcript: `"Mayday! Mayday! Aqui é o posto avançado do Bloco C. Perdemos contato com a superfície! A trava hidráulica do elevador de serviço foi rompida de dentro para fora! Mantenham a barricada! Repito, mantenham a barricada!"`
    },
    tape_09: {
      id: 'tape_09',
      audio: 'assets/audio/tape_09.mp3',
      title: 'FITA 09 — A ILUSÃO DO TEMPO',
      speaker: 'DR. VANCE',
      duration: '0:45',
      transcript: `"Não era uma pesquisa médica. Nunca foi. O gás liberado nos dutos altera a percepção do tempo dos cobaias. Nós achamos que tínhamos entrado há apenas algumas horas... mas o calendário da parede diz que estamos aqui há semanas! Seus próprios olhos vão mentir para você... confie apenas no som do relógio!"`
    },
    tape_10: {
      id: 'tape_10',
      audio: 'assets/audio/tape_10.mp3',
      title: 'FITA 10 — A CÂMARA PRINCIPAL',
      speaker: 'DRA. HELENA MEYER',
      duration: '0:32',
      transcript: `"Para quem estiver vivo e chegou até a câmara principal: a chave de fenda e o cilindro de ar estão no armário médico do fundo. Para abrir a escotilha final do teto, você deve alinhar as três válvulas de pressão até o ponteiro estabilizar na faixa vermelha. Faça isso rápido... o tempo acabou."`
    },
    tape_11: {
      id: 'tape_11',
      audio: 'assets/audio/tape_11.mp3',
      title: 'FITA 11 — ALERTA DA IA CENTRAL',
      speaker: 'SISTEMA AURORA',
      duration: '0:34',
      transcript: `"Atenção. Violação de contenção biológica confirmada no Nível Três. Protocolo de purga térmica iniciado. Tempo restante estimado: dez minutos para o fechamento irreversível das comportas hidráulicas. Todos os funcionários devem se dirigir imediatamente à câmara de descompressão."`
    },
    tape_12: {
      id: 'tape_12',
      audio: 'assets/audio/tape_12.mp3',
      title: 'FITA 12 — O ÚLTIMO REGISTRO',
      speaker: 'DR. VANCE',
      duration: '0:40',
      transcript: `"Este é meu último registro. A lanterna está quase sem bateria... e a porta do gerador começou a ceder. Se você encontrou todas as fitas... pegue o cartão de acesso mestre no meu jaleco. Corra até a saída e nunca... sob hipótese alguma... olhe para trás. Boa sorte."`
    },
    tape_13: {
      id: 'tape_13',
      audio: 'assets/audio/tape_13.mp3',
      title: 'FITA 13 — O ÚLTIMO TURNO',
      speaker: 'DRA. CECÍLIA SANTOS',
      duration: '0:30',
      transcript: `"Você acha que conseguiu escapar... mas escute com atenção. O zumbido no fundo... a luz que nunca apaga de verdade... Nós nunca saímos da sala de observação. O último turno nunca termina..."`
    }
  },

  // ==========================================
  // DIÁLOGOS NARRATIVOS (ÁUDIO APENAS EM TRANSMISSÕES DIEGÉTICAS)
  // ==========================================
  dialogues: {
    // CAPÍTULO 1
    cap1_intro: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Minha cabeça... dói como se tivesse levado uma pancada.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Que lugar é esse? Uma sala de escritório antiga... e por que está tão escuro?' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Preciso examinar os arredores e encontrar uma forma de sair daqui.' }
    ],

    cap1_phone_call: [
      { speaker: 'VOZ MISTERIOSA', type: 'radio', audio: 'assets/audio/cap1_phone_voice_1.mp3', text: 'Se você está ouvindo isso... significa que eu falhei.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Quem é você?! Onde eu estou?!' },
      { speaker: 'VOZ MISTERIOSA', type: 'radio', audio: 'assets/audio/cap1_phone_voice_2.mp3', text: 'Não confie na quinta pessoa. O relógio sempre marca a hora da sua decisão.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Espere! Alô?! ...Desligou.' }
    ],

    cap1_photo_reaction: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Uma fotografia antiga... cinco pessoas de jaleco branco no Instituto Aurora.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Quatro rostos normais, mas o quinto rosto foi riscado com força... com tinta preta.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Atrás da foto está escrito: NÃO CONFIE NA QUINTA PESSOA. Por que isso me causa um calafrio tão estranho?' }
    ],

    // CAPÍTULO 2
    cap2_corridor_intro: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'O corredor é enorme e o cheiro de mofo e desinfetante hospitalar é sufocante.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'As luzes principais estão mortas. Devo procurar o quadro de energia para liberar as travas magnéticas das portas.' }
    ],

    cap2_cctv_anomaly: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'O monitor da câmera de segurança está ligado... mostrando o corredor exatamente onde estou.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Espere um segundo... na tela, eu apareço abrindo a porta e entrando no corredor alguns segundos antes de eu realmente ter entrado!' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Isso é impossível... é como se a imagem estivesse atrasada no tempo, ou prevendo meus movimentos.' }
    ],

    // CAPÍTULO 3
    cap3_lab_discovery: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'O Laboratório de Neurociência. Há bancadas com tubos secos e relatórios sobre o Projeto Aurora.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'O terminal antigo de computador ainda está ligado, esperando por credenciais de acesso.' }
    ],

    // CAPÍTULO 4
    cap4_own_voice_reaction: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Essa... essa voz na gravação... é a MINHA voz!' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Como isso é possível?! Eu nunca estive neste setor... ou estive?' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Minhas mãos estão tremendo. A voz na fita disse que eu sou a quinta pessoa.' }
    ],

    // CAPÍTULO 5
    cap5_clock_chamber: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Uma sala circular... dezenas de relógios de parede cobrem as paredes de concreto.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Cada um marca um horário completamente aleatório, mas um deles está fixado em duas e dezessete.' }
    ],

    cap5_monitor_warning: [
      { speaker: 'GRAVAÇÃO NO MONITOR', type: 'radio', audio: 'assets/audio/cap5_warning.mp3', text: 'Se você está vendo isso na tela do monitor... não abra a porta vermelha. Eu repito: não abra a porta vermelha.' }
    ],

    // CAPÍTULO 6
    cap6_red_door_encounter: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'A porta vermelha... ela é diferente de todas as outras portas de aço do Instituto.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Algo dentro das minhas entranhas grita para que eu não toque nela. Mas é a única passagem adiante.' }
    ],

    cap6_mirror_scene: [
      { speaker: 'VOZ NO TELEFONE', type: 'radio', audio: 'assets/audio/cap6_phone_1.mp3', text: 'Você abriu.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Quem é você afinal?!' },
      { speaker: 'VOZ NO TELEFONE', type: 'radio', audio: 'assets/audio/cap6_phone_3.mp3', text: 'Você.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'O espelho... meu reflexo demorou para se mover... ele está levantando a mão sozinho!' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Ele está escrevendo no vidro embaçado... LEMBRE-SE.' }
    ],

    // CAPÍTULO 7
    cap7_flashback_realization: [
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Os relatórios da diretoria... o Doutor Vance... EU sou o Doutor Vance.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Eu criei o Instituto Aurora. Nós éramos cinco pesquisadores tentando erradicar o sofrimento e reescrever memórias traumáticas.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Mas o teste sobrecarregou os terminais. Para não encarar as consequências do que fiz com meus colegas, eu apaguei minha própria memória e me tranquei neste ciclo.' }
    ],

    // CAPÍTULO 8
    cap8_central_hub: [
      { speaker: 'SISTEMA AURORA', type: 'radio', text: 'ESTAÇÃO CENTRAL ATIVA. CINCO SUJEITOS CADASTRADOS. QUATRO CONEXÕES INTERROMPIDAS.' },
      { speaker: 'PROTAGONISTA', type: 'local', text: 'Cinco monitores... quatro mostram SINAL PERDIDO. O quinto monitor mostra a minha própria transmissão ao vivo.' },
      { speaker: 'SISTEMA AURORA', type: 'radio', text: 'PERGUNTA DE CONTROLE: QUAL DELES É O ORIGINAL?' }
    ]
  },

  // ==========================================
  // OS 3 FINAIS (EPÍLOGOS NARRADOS)
  // ==========================================
  endings: {
    FUGA: {
      title: 'FINAL 1 — A FUGA',
      badge: 'DESTINO: ESCAPATÓRIA',
      audio: 'assets/audio/ending_fuga.mp3',
      text: `Você insere o cartão magnético mestre e aciona a comporta de descompressão da superfície. O ar gélido da madrugada invade o túnel subterrâneo. Você sobe os degraus de metal e sai para a floresta enevoada que cerca o Instituto Aurora.

Atrás de você, os portões de aço se fecham com um estrondo definitivo. 
Na guarita externa abandonada, o telefone público começa a tocar insistentemente. 

Você se aproxima e ergue o fone:
"Parabéns pelo seu turno, Doutor." — diz a voz familiar do outro lado da linha. — "Você conseguiu escapar do seu próprio laboratório. Agora só falta você encontrar os outros quatro pesquisadores que deixou para trás."

A ligação é cortada. A neblina engole a estrada à sua frente.`
    },

    LOOP: {
      title: 'FINAL 2 — O LOOP ETERNO',
      badge: 'DESTINO: NEGAÇÃO',
      audio: 'assets/audio/ending_loop.mp3',
      text: `Você recusa a verdade do experimento e força a abertura da porta de emergência secundária. Uma luz branca ofuscante preenche todo o campo de visão. O som de passos e alarmes se dissipa em um silêncio sepulcral.

...
...

Você abre os olhos lentamente. O teto de concreto manchado está diante de você.
O chão de linóleo é frio sob o seu corpo.
Você olha para o relógio na parede: ele marca exatamente 02:17.

O telefone sobre a mesa de madeira começa a tocar.
Você se levanta, atende o fone e ouve sua própria voz sussurrar:
"Se você está ouvindo isso... significa que eu falhei."`
    },

    VERDADE: {
      title: 'FINAL 3 — A CONSCIÊNCIA DESPERTA',
      badge: 'DESTINO: A VERDADE ABSOLUTA',
      audio: 'assets/audio/ending_verdade.mp3',
      text: `Você digita seu código original de administrador no console central e assume a responsabilidade total pelo experimento Aurora. Você não tenta fugir nem reiniciar o ciclo. Você desativa os inibidores de memória e restaura todos os registros confidenciais da pesquisa.

Os monitores dos outros quatro pesquisadores voltam a emitir sinais vitais nos módulos de contenção profunda. As luzes de emergência vermelhas se apagam, dando lugar a uma iluminação branca, límpida e serena.

A voz nos alto-falantes não é mais uma gravação distorcida, mas a sua própria consciência reconciliada:
"Agora você finalmente se lembra de quem é. O último turno terminou."

O sistema entra em hibernação. Pela primeira vez em anos, você está livre do labirinto da sua mente.`
    }
  }
};
