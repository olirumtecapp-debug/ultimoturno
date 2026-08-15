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
      title: 'FITA 01 — O AVISO INICIAL',
      speaker: 'VOZ DESCONHECIDA',
      duration: '0:42',
      transcript: `"Se você chegou até aqui... não continue. Você acha que está tentando escapar de um prédio trancado, mas as portas não são o seu verdadeiro problema. Cada sala que você abre é apenas uma camada mais profunda da sua própria negação."`
    },

    tape_02: {
      id: 'tape_02',
      audio: 'assets/audio/tape_02.mp3',
      title: 'FITA 02 — O PADRÃO REPETITIVO',
      speaker: 'DRA. HELENA MEYER',
      duration: '0:38',
      transcript: `"Você sempre faz isso... Toda vez que as luzes piscam e o relógio marca duas e dezessete, você acorda no chão, examina a mesa, atende o telefone... e começa a procurar as mesmas chaves que você mesmo escondeu."`
    },

    tape_03: {
      id: 'tape_03',
      audio: 'assets/audio/tape_03.mp3',
      title: 'FITA 03 — A PORTA ERRADA',
      speaker: 'DR. ARTHUR PENDELTON',
      duration: '0:50',
      transcript: `"Na primeira vez você abriu a porta errada. Você achou que estava salvando os outros quatro pesquisadores, mas você os trancou lá dentro. O experimento não falhou por causa do maquinário... Falhou por causa de uma escolha sua."`
    },

    tape_04: {
      id: 'tape_04',
      audio: 'assets/audio/tape_04.mp3',
      title: 'FITA 04 — O BLOQUEIO DE MEMÓRIA',
      speaker: 'DRA. CECÍLIA SANTOS',
      duration: '0:45',
      transcript: `"Você não deveria lembrar... Foi por isso que você programou o Instituto para apagar tudo a cada ciclo. Se a verdade vier à tona, a culpa será insuportável. Pare de procurar as gravações restantes."`
    },

    tape_05: {
      id: 'tape_05',
      audio: 'assets/audio/tape_05.mp3',
      title: 'FITA 05 — A SALA 02:17',
      speaker: 'DR. MARCUS WEBB',
      duration: '0:40',
      transcript: `"Se encontrar a sala das duas e dezessete, não entre. Ela contém a máquina de retorno. E se você olhar para a porta vermelha ao fundo do corredor... dê meia volta. O que está do outro lado daquele vidro não é uma pessoa."`
    },

    tape_own_voice: {
      id: 'tape_own_voice',
      audio: 'assets/audio/tape_own_voice.mp3',
      title: 'FITA CONFIDENCIAL — REGISTRO DO PROTAGONISTA',
      speaker: 'PROTAGONISTA (SUA PRÓPRIA VOZ)',
      duration: '1:12',
      transcript: `"(Som de respiração tensa e chiado analógico)... Meu Deus... eu estive aqui antes. Eu reconheço a minha própria letra no relatório. Eu não sou um prisioneiro tentando escapar... eu fui quem trancou este lugar. Se a minha versão futura estiver ouvindo isto: o quinto rosto na foto é o seu. Não confie na sua própria mente."`
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
