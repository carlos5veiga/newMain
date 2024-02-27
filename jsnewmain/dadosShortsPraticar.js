const dados = [
  {
    tituloVideo: 'Solfejo 01',
    tituloCabecalho: 'Solfejo 1',
    codigoVideo: 'qxif7bONnNY',
    resumoVideo: 'Solfejo em dó maior para quem quiser praticar.'
  },
  {
    tituloVideo: 'Solfejo 02',
    tituloCabecalho: 'Solfejo 2',
    codigoVideo: '1HMTla97Kjo',
    resumoVideo: 'Aproveite este vídeo para treinar um solfejo em compasso ternário e aprenda várias dicas importantes para melhorar o seu solfejo.'
  },
  {
    tituloVideo: 'Solfejo 03',
    tituloCabecalho: 'Solfejo 3',
    codigoVideo: 'FeoJudws8x4',
    resumoVideo: 'Terceiro vídeo da série que vai deixar você craque no solfejo. Aprenda o que é um motivo e veja como essa informação ajuda você a cantar corretamente.'
  },
  {
    tituloVideo: 'Solfejo 04',
    tituloCabecalho: 'Solfejo 4',
    codigoVideo: 'zsf8m8h9ygk',
    resumoVideo: 'Neste solfejo você vai praticar um ritmo que tem a semínima pontuada, uma situação rítmica muito encontrada no mundo musical. Pratique e ganhe autonomia.'
  },
  {
    tituloVideo: 'Solfejo 05',
    tituloCabecalho: 'Solfejo 5',
    codigoVideo: 'hlcdVgTnKR0',
    resumoVideo: 'Lindo solfejo para você desenvolver a sua leitura musical. Aproveite também para tocar a melodia no seu instrumento.'
  },
  {
    tituloVideo: 'Solfejo 06',
    tituloCabecalho: 'Solfejo 6',
    codigoVideo: 'wNogNico1x4',
    resumoVideo: 'Cante este solfejo e perceba a sonoridade do campo harmônico menor. Assista aos vídeos da primeira série para perceber a diferença em relação ao campo harmônico maior.'
  },
  {
    tituloVideo: 'Solfejo 07',
    tituloCabecalho: 'Solfejo 7',
    codigoVideo: 'xqeutRvSkUA',
    resumoVideo: 'Sétimo solfejo desta série que está desvendando os segredos do solfejo. Saiba como analisar uma alteração que aparece no meio da melodia.'
  },
  {
    tituloVideo: 'Solfejo 08',
    tituloCabecalho: 'Solfejo 8',
    codigoVideo: 'oK5c_orFdTY',
    resumoVideo: 'Lindo solfejo para você treinar a sua leitura musical e perceber o campo harmônico menor.'
  },
  {
    tituloVideo: 'Solfejo 09',
    tituloCabecalho: 'Solfejo 9',
    codigoVideo: 'gPcoHIr8MZI',
    resumoVideo: 'Conheça a sonoridade do modo eólio nesse solfejo. Esta sonoridade é a mesma da escala menor primitiva. Cante comigo e aprecie a melodia.'
  },
  {
    tituloVideo: 'Solfejo 10',
    tituloCabecalho: 'Solfejo 10',
    codigoVideo: '6O7-GgJ_9-w',
    resumoVideo: 'Descubra o que é a terça de picardia e cante este décimo solfejo da nossa série. Aproveite para baixar a nova versão do e-book com os 10 solfejos.'
  },
  {
    tituloVideo: 'Solfejo 11',
    tituloCabecalho: 'Solfejo 11',
    codigoVideo: 'ljXu3aH108U',
    resumoVideo: 'Neste solfejo a primeira nota da melodia é a terça do acorde e eu aproveito para criar uma melodia com muitos arpejos. Aproveite para cantar e perceber.'
  },
  {
    tituloVideo: 'Solfejo 12',
    tituloCabecalho: 'Solfejo 12',
    codigoVideo: 'ZfJ-QrET1gQ',
    resumoVideo: 'Cante este solfejo e veja se as dissonâncias inseridas na harmonia ajudam ou atrapalham a sua performance.'
  },
  {
    tituloVideo: 'Solfejo 13',
    tituloCabecalho: 'Solfejo 13',
    codigoVideo: 'mZQsVHTKDYk',
    resumoVideo: 'Pratique o seu solfejo com esta melodia e conheça como funciona o sistema de graus para solfejar.'
  },
  {
    tituloVideo: 'Solfejo 14',
    tituloCabecalho: 'Solfejo 14',
    codigoVideo: 'PFJ-IWY5BWc',
    resumoVideo: 'Pratique o seu solfejo com este novo desafio: comece a cantar a partir do quinto grau da tonalidade e veja como este solfejo ficou bonito.'
  },
  {
    tituloVideo: 'Solfejo 15',
    tituloCabecalho: 'Solfejo 15',
    codigoVideo: 'r6hdKuQhShc',
    resumoVideo: 'Cante este solfejo e aproveite para baixar a nova versão do e-book com a série completa para você desenvolver o seu solfejo.'
  },
  {
    tituloVideo: 'Solfejo 16',
    tituloCabecalho: 'Solfejo 16',
    codigoVideo: 'dJlZ03D1xKc',
    resumoVideo: 'Entrando em uma nova etapa desta série, você vai cantar em outras tonalidade. E para começar: Sol Maior.'
  },
  {
    tituloVideo: 'Solfejo 17',
    tituloCabecalho: 'Solfejo 17',
    codigoVideo: 'OQ0lIB9umdA',
    resumoVideo: 'Cante esta linda melodia em Sola maior e desenvolva o seu solfejo e a sua percepção musical.'
  },
  {
    tituloVideo: 'Solfejo 18',
    tituloCabecalho: 'Solfejo 18',
    codigoVideo: 'vB8g5pUpXAE',
    resumoVideo: 'A nossa série de solfejo traz uma nova partitura para você se desenvolver. Cante esta linda melodia em Sol Maior e compasso quaternário.'
  },
  {
    tituloVideo: 'Solfejo 19',
    tituloCabecalho: 'Solfejo 19',
    codigoVideo: 'eZcc6y6MKc0',
    resumoVideo: 'Vigésimo solfejo desta série incrível que está revolucionando o ensino do solfejo a distância.'
  },
  {
    tituloVideo: 'Solfejo 20',
    tituloCabecalho: 'Solfejo 20',
    codigoVideo: 'cO643RTjZE0',
    resumoVideo: 'Cante esta melodia em Fá Maior e aproveite para conhecer toda a série de solfejos para praticar. Você pode nos ajudar divulgando este vídeo e também o e-book. Não esqueça de deixar o like.'
  },
  {
    tituloVideo: 'Solfejo 21',
    tituloCabecalho: 'Solfejo 21',
    codigoVideo: 'OPELSrkNVvY',
    resumoVideo: 'Perceber e entender as escalas maiores vai ampliar muito a sua capacidade de ouvir, cantar, tocar, escrever...'
  },
  {
    tituloVideo: 'Solfejo 22',
    tituloCabecalho: 'Solfejo 22',
    codigoVideo: 'qEEtpK-yraQ',
    resumoVideo: 'Você consegue cantar esta melodia em Fá Maior? Tente junto comigo neste vídeo incrível e você vai conseguir.'
  },
  {
    tituloVideo: 'Solfejo 23',
    tituloCabecalho: 'Solfejo 23',
    codigoVideo: 'wdE7EWSVz2I',
    resumoVideo: 'Você acha que uma melodia para ser interessante precisa ser difícil? Eu acho que não e criei esta melodia para tentar defender a minha ideia. Tente cantar e escreva a sua opinião.'
  },
  {
    tituloVideo: 'Solfejo 24',
    tituloCabecalho: 'Solfejo 24',
    codigoVideo: 'sKVWn2pNYhY',
    resumoVideo: 'Nesta melodia o começo está no quinto grau. Aprenda este intervalo de quarta ascendente que é muito comum no início de melodias diversas.'
  },
  {
    tituloVideo: 'Solfejo 25',
    tituloCabecalho: 'Solfejo 25',
    codigoVideo: 'gc1ndiMM-wE',
    resumoVideo: 'Com esta linda melodia em Fá Maior chega uma nova versão do e-book com os solfejos e as aulas.'
  },
  {
    tituloVideo: 'Solfejo 26',
    tituloCabecalho: 'Solfejo 26',
    codigoVideo: 'UwB0gA05yxo',
    resumoVideo: 'Aproveite este solfejo e conheça a anacruse, uma preparação melódica muita presente na música.'
  },
  {
    tituloVideo: 'Solfejo 27',
    tituloCabecalho: 'Solfejo 27',
    codigoVideo: 'VXX7aTbz1jI',
    resumoVideo: 'Linda melodia para solfejar e exemplo de anacruse e terça de picardia.'
  },
  {
    tituloVideo: 'Solfejo 28',
    tituloCabecalho: 'Solfejo 28',
    codigoVideo: '5rzczuTJpgs',
    resumoVideo: 'Cante ou toque esta melodia e aprenda a contar os compassos e também conheça uma dica para cantar o intervalo de quarta justa ascendente.'
  },
  {
    tituloVideo: 'Solfejo 29',
    tituloCabecalho: 'Solfejo 29',
    codigoVideo: 'RnzlMZgVToo',
    resumoVideo: 'Neste vídeo você vai solfejar uma melodia que começa no terceiro tempo do compasso ternário, ou seja, é uma anacruse. A tonalidade é Fá Maior.'
  },
  {
    tituloVideo: 'Solfejo 30',
    tituloCabecalho: 'Solfejo 30',
    codigoVideo: '6NVpePofN3A',
    resumoVideo: 'Vídeo com o trigésimo solfejo desta série que está levando conhecimento para todos que desejam aprender música. Solfejo em fá maior. No e-book você vai encontrar a série completa. Baixe agora.'
  },
  {
    tituloVideo: 'Solfejo 31',
    tituloCabecalho: 'Solfejo 31',
    codigoVideo: 'wXbgFfjLcxs',
    resumoVideo: 'Cante este lindo exemplo de um compasso acéfalo. Não sabe o que é isso? Descubra neste vídeo.'
  },
  {
    tituloVideo: 'Solfejo 32',
    tituloCabecalho: 'Solfejo 32',
    codigoVideo: 'uOpTrL-6le0',
    resumoVideo: 'Mais um exemplo de compasso acéfalo para praticar. Desenvolva o seu solfejo.'
  },
  {
    tituloVideo: 'Solfejo 33',
    tituloCabecalho: 'Solfejo 33',
    codigoVideo: 'QO0-nNeHX0A',
    resumoVideo: 'Exemplo de um solfejo de compasso acéfalo e começa no quinto grau para você praticar.'
  },
  {
    tituloVideo: 'Solfejo 34',
    tituloCabecalho: 'Solfejo 34',
    codigoVideo: 'CcY6ZvYnte4',
    resumoVideo: 'Este exemplo de compasso acéfalo em Ré Maior tem várias dicas interessantes sobre o solfejo.'
  },
  {
    tituloVideo: 'Solfejo 35',
    tituloCabecalho: 'Solfejo 35',
    codigoVideo: 'Yan09wvyrt4',
    resumoVideo: 'Cante esta melodia em Fá Maior e baixe a nova versão do e-book com todas as melodias e aulas.'
  },
  {
    tituloVideo: 'Solfejo 36',
    tituloCabecalho: 'Solfejo 36',
    codigoVideo: 'y9YbSQKbNLI',
    resumoVideo: 'Comece a solfejar as semicolcheias com este exercício fantástico.'
  },
  {
    tituloVideo: 'Solfejo 37',
    tituloCabecalho: 'Solfejo 37',
    codigoVideo: '7bdUrjApimw',
    resumoVideo: 'Este vídeo apresenta dicas incríveis pra você tocar as semicolcheias.'
  },
  {
    tituloVideo: 'Solfejo 38',
    tituloCabecalho: 'Solfejo 38',
    codigoVideo: 'jqeMIz0MmiA',
    resumoVideo: 'Neste solfejo você vai cantar as semicolcheias e perceber que os motivos ajudam a gente a solfejar.'
  },
  {
    tituloVideo: 'Solfejo 39',
    tituloCabecalho: 'Solfejo 39',
    codigoVideo: '54R1ZWUObeM',
    resumoVideo: 'As 4 semicolcheias estão ficando simples de solfejar? Este exemplo deixa o grupo de semicolcheias bem evidente. Vamos cantar.'
  },
  {
    tituloVideo: 'Solfejo 40',
    tituloCabecalho: 'Solfejo 40',
    codigoVideo: '4fsfCK2Z7bc',
    resumoVideo: 'Com este incrível solfejo lançamos a nova versão do e-book, agora com 40 solfejos. Destrave o seu solfejo.'
  }
]

export { dados };