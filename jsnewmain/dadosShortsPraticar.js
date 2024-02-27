const dados = [
  {
    tituloVideo: 'Solfejo 01',
    tituloCabecalho: 'Solfejo 1',
    codigoVideo: 'bN2cz_blta8',
    resumoVideo: 'Solfejo em dó maior para quem quiser praticar.'
  },
  {
    tituloVideo: 'Solfejo 02',
    tituloCabecalho: 'Solfejo 2',
    codigoVideo: '3cjIb-awQyA',
    resumoVideo: 'Aproveite este vídeo para treinar um solfejo em compasso ternário e aprenda várias dicas importantes para melhorar o seu solfejo.'
  },
  {
    tituloVideo: 'Solfejo 03',
    tituloCabecalho: 'Solfejo 3',
    codigoVideo: 'RzNSvXUMdak',
    resumoVideo: 'Terceiro vídeo da série que vai deixar você craque no solfejo. Aprenda o que é um motivo e veja como essa informação ajuda você a cantar corretamente.'
  },
  {
    tituloVideo: 'Solfejo 04',
    tituloCabecalho: 'Solfejo 4',
    codigoVideo: 'T_Z7p9EvsgE',
    resumoVideo: 'Neste solfejo você vai praticar um ritmo que tem a semínima pontuada, uma situação rítmica muito encontrada no mundo musical. Pratique e ganhe autonomia.'
  },
  {
    tituloVideo: 'Solfejo 05',
    tituloCabecalho: 'Solfejo 5',
    codigoVideo: '_lO8Z1SzfPw',
    resumoVideo: 'Lindo solfejo para você desenvolver a sua leitura musical. Aproveite também para tocar a melodia no seu instrumento.'
  },
  {
    tituloVideo: 'Solfejo 06',
    tituloCabecalho: 'Solfejo 6',
    codigoVideo: 'hf1B-nM9Tkc',
    resumoVideo: 'Cante este solfejo e perceba a sonoridade do campo harmônico menor. Assista aos vídeos da primeira série para perceber a diferença em relação ao campo harmônico maior.'
  },
  {
    tituloVideo: 'Solfejo 07',
    tituloCabecalho: 'Solfejo 7',
    codigoVideo: 'P_KCOfKwXjc',
    resumoVideo: 'Sétimo solfejo desta série que está desvendando os segredos do solfejo. Saiba como analisar uma alteração que aparece no meio da melodia.'
  },
  {
    tituloVideo: 'Solfejo 08',
    tituloCabecalho: 'Solfejo 8',
    codigoVideo: 'Gelru831O08',
    resumoVideo: 'Lindo solfejo para você treinar a sua leitura musical e perceber o campo harmônico menor.'
  },
  {
    tituloVideo: 'Solfejo 09',
    tituloCabecalho: 'Solfejo 9',
    codigoVideo: 'dODZCaqO8p0',
    resumoVideo: 'Conheça a sonoridade do modo eólio nesse solfejo. Esta sonoridade é a mesma da escala menor primitiva. Cante comigo e aprecie a melodia.'
  },
  {
    tituloVideo: 'Solfejo 10',
    tituloCabecalho: 'Solfejo 10',
    codigoVideo: '9Qa1AmiOFuo',
    resumoVideo: 'Descubra o que é a terça de picardia e cante este décimo solfejo da nossa série. Aproveite para baixar a nova versão do e-book com os 10 solfejos.'
  },
  {
    tituloVideo: 'Solfejo 11',
    tituloCabecalho: 'Solfejo 11',
    codigoVideo: 'EKVMhCtNapQ',
    resumoVideo: 'Neste solfejo a primeira nota da melodia é a terça do acorde e eu aproveito para criar uma melodia com muitos arpejos. Aproveite para cantar e perceber.'
  },
  {
    tituloVideo: 'Solfejo 12',
    tituloCabecalho: 'Solfejo 12',
    codigoVideo: 'pFlGTKvLJQY',
    resumoVideo: 'Cante este solfejo e veja se as dissonâncias inseridas na harmonia ajudam ou atrapalham a sua performance.'
  },
  {
    tituloVideo: 'Solfejo 13',
    tituloCabecalho: 'Solfejo 13',
    codigoVideo: 'JeFXKAxsblA',
    resumoVideo: 'Pratique o seu solfejo com esta melodia e conheça como funciona o sistema de graus para solfejar.'
  },
  {
    tituloVideo: 'Solfejo 14',
    tituloCabecalho: 'Solfejo 14',
    codigoVideo: 'dLI6MOUoZXY',
    resumoVideo: 'Pratique o seu solfejo com este novo desafio: comece a cantar a partir do quinto grau da tonalidade e veja como este solfejo ficou bonito.'
  },
  {
    tituloVideo: 'Solfejo 15',
    tituloCabecalho: 'Solfejo 15',
    codigoVideo: 'DVnUOD1xV4o',
    resumoVideo: 'Cante este solfejo e aproveite para baixar a nova versão do e-book com a série completa para você desenvolver o seu solfejo.'
  },
  {
    tituloVideo: 'Solfejo 16',
    tituloCabecalho: 'Solfejo 16',
    codigoVideo: 'WyUbqnVXoBs',
    resumoVideo: 'Entrando em uma nova etapa desta série, você vai cantar em outras tonalidade. E para começar: Sol Maior.'
  },
  {
    tituloVideo: 'Solfejo 17',
    tituloCabecalho: 'Solfejo 17',
    codigoVideo: '_BaSEjQ0Big',
    resumoVideo: 'Cante esta linda melodia em Sola maior e desenvolva o seu solfejo e a sua percepção musical.'
  },
  {
    tituloVideo: 'Solfejo 18',
    tituloCabecalho: 'Solfejo 18',
    codigoVideo: '0ureHB4zGe8',
    resumoVideo: 'A nossa série de solfejo traz uma nova partitura para você se desenvolver. Cante esta linda melodia em Sol Maior e compasso quaternário.'
  },
  {
    tituloVideo: 'Solfejo 19',
    tituloCabecalho: 'Solfejo 19',
    codigoVideo: 'ILwJy3cL88k',
    resumoVideo: 'Vigésimo solfejo desta série incrível que está revolucionando o ensino do solfejo a distância.'
  },
  {
    tituloVideo: 'Solfejo 20',
    tituloCabecalho: 'Solfejo 20',
    codigoVideo: 'vqnlRPBZW10',
    resumoVideo: 'Cante esta melodia em Fá Maior e aproveite para conhecer toda a série de solfejos para praticar. Você pode nos ajudar divulgando este vídeo e também o e-book. Não esqueça de deixar o like.'
  },
  {
    tituloVideo: 'Solfejo 21',
    tituloCabecalho: 'Solfejo 21',
    codigoVideo: 'EBEk-gMM-7E',
    resumoVideo: 'Perceber e entender as escalas maiores vai ampliar muito a sua capacidade de ouvir, cantar, tocar, escrever...'
  },
  {
    tituloVideo: 'Solfejo 22',
    tituloCabecalho: 'Solfejo 22',
    codigoVideo: 'TRI6FCtqxl8',
    resumoVideo: 'Você consegue cantar esta melodia em Fá Maior? Tente junto comigo neste vídeo incrível e você vai conseguir.'
  },
  {
    tituloVideo: 'Solfejo 23',
    tituloCabecalho: 'Solfejo 23',
    codigoVideo: 'cJPhxWzogQE',
    resumoVideo: 'Você acha que uma melodia para ser interessante precisa ser difícil? Eu acho que não e criei esta melodia para tentar defender a minha ideia. Tente cantar e escreva a sua opinião.'
  },
  {
    tituloVideo: 'Solfejo 24',
    tituloCabecalho: 'Solfejo 24',
    codigoVideo: 'VUTr20yFn5Q',
    resumoVideo: 'Nesta melodia o começo está no quinto grau. Aprenda este intervalo de quarta ascendente que é muito comum no início de melodias diversas.'
  },
  {
    tituloVideo: 'Solfejo 25',
    tituloCabecalho: 'Solfejo 25',
    codigoVideo: 'aZ1seXciVu8',
    resumoVideo: 'Com esta linda melodia em Fá Maior chega uma nova versão do e-book com os solfejos e as aulas.'
  },
  {
    tituloVideo: 'Solfejo 26',
    tituloCabecalho: 'Solfejo 26',
    codigoVideo: 'qiVOWaMgCQM',
    resumoVideo: 'Aproveite este solfejo e conheça a anacruse, uma preparação melódica muita presente na música.'
  },
  {
    tituloVideo: 'Solfejo 27',
    tituloCabecalho: 'Solfejo 27',
    codigoVideo: 'Al1aijYR_h4',
    resumoVideo: 'Linda melodia para solfejar e exemplo de anacruse e terça de picardia.'
  },
  {
    tituloVideo: 'Solfejo 28',
    tituloCabecalho: 'Solfejo 28',
    codigoVideo: 'pa1q9sW3Hzs',
    resumoVideo: 'Cante ou toque esta melodia e aprenda a contar os compassos e também conheça uma dica para cantar o intervalo de quarta justa ascendente.'
  },
  {
    tituloVideo: 'Solfejo 29',
    tituloCabecalho: 'Solfejo 29',
    codigoVideo: '9PagbmBm-Rg',
    resumoVideo: 'Neste vídeo você vai solfejar uma melodia que começa no terceiro tempo do compasso ternário, ou seja, é uma anacruse. A tonalidade é Fá Maior.'
  },
  {
    tituloVideo: 'Solfejo 30',
    tituloCabecalho: 'Solfejo 30',
    codigoVideo: 'uslfwcmVUUs',
    resumoVideo: 'Vídeo com o trigésimo solfejo desta série que está levando conhecimento para todos que desejam aprender música. Solfejo em fá maior. No e-book você vai encontrar a série completa. Baixe agora.'
  },
  {
    tituloVideo: 'Solfejo 31',
    tituloCabecalho: 'Solfejo 31',
    codigoVideo: 'PAFf_od9fFc',
    resumoVideo: 'Cante este lindo exemplo de um compasso acéfalo. Não sabe o que é isso? Descubra neste vídeo.'
  },
  {
    tituloVideo: 'Solfejo 32',
    tituloCabecalho: 'Solfejo 32',
    codigoVideo: 'aaGMSTcRJJw',
    resumoVideo: 'Mais um exemplo de compasso acéfalo para praticar. Desenvolva o seu solfejo.'
  },
  {
    tituloVideo: 'Solfejo 33',
    tituloCabecalho: 'Solfejo 33',
    codigoVideo: '-Asytn3wI4k',
    resumoVideo: 'Exemplo de um solfejo de compasso acéfalo e começa no quinto grau para você praticar.'
  },
  {
    tituloVideo: 'Solfejo 34',
    tituloCabecalho: 'Solfejo 34',
    codigoVideo: 'SxT5tAsvCDY',
    resumoVideo: 'Este exemplo de compasso acéfalo em Ré Maior tem várias dicas interessantes sobre o solfejo.'
  },
  {
    tituloVideo: 'Solfejo 35',
    tituloCabecalho: 'Solfejo 35',
    codigoVideo: 'GNV-Ri-w9lc',
    resumoVideo: 'Cante esta melodia em Fá Maior e baixe a nova versão do e-book com todas as melodias e aulas.'
  },
  {
    tituloVideo: 'Solfejo 36',
    tituloCabecalho: 'Solfejo 36',
    codigoVideo: 'sARQynvA5l0',
    resumoVideo: 'Comece a solfejar as semicolcheias com este exercício fantástico.'
  },
  {
    tituloVideo: 'Solfejo 37',
    tituloCabecalho: 'Solfejo 37',
    codigoVideo: '2JOLxDvJg-c',
    resumoVideo: 'Este vídeo apresenta dicas incríveis pra você tocar as semicolcheias.'
  },
  {
    tituloVideo: 'Solfejo 38',
    tituloCabecalho: 'Solfejo 38',
    codigoVideo: 'VBUR5mctIiY',
    resumoVideo: 'Neste solfejo você vai cantar as semicolcheias e perceber que os motivos ajudam a gente a solfejar.'
  },
  {
    tituloVideo: 'Solfejo 39',
    tituloCabecalho: 'Solfejo 39',
    codigoVideo: 'G684AwAdU10',
    resumoVideo: 'As 4 semicolcheias estão ficando simples de solfejar? Este exemplo deixa o grupo de semicolcheias bem evidente. Vamos cantar.'
  },
  {
    tituloVideo: 'Solfejo 40',
    tituloCabecalho: 'Solfejo 40',
    codigoVideo: 'H20wKS8R_ow',
    resumoVideo: 'Com este incrível solfejo lançamos a nova versão do e-book, agora com 40 solfejos. Destrave o seu solfejo.'
  },
  {
    tituloVideo: 'Solfejo 41',
    tituloCabecalho: 'Solfejo 41',
    codigoVideo: 'Fg1Cz2aNzdM',
    resumoVideo: 'Neste vídeo iniciamos um novo grupo rítmico e uma nova tonalidade. Um ótimo exercício para quem está estudando solfejo.'
  },
  {
    tituloVideo: 'Solfejo 42',
    tituloCabecalho: 'Solfejo 42',
    codigoVideo: 'TItP3wK4Ejo',
    resumoVideo: 'Melodia maravilhosa para você desenvolver a sua leitura musical. Toque e cante comigo. Baixe o e-book para o curso gratuito completo.'
  }
]

export { dados };