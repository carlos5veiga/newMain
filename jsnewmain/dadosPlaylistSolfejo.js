const dados = [
  {
    tituloVideo: 'Solfejo01 - Introdução',
    tituloCabecalho: 'O que é o Solfejo?',
    codigoVideo: 'qqw3War57BQ',
    resumoVideo: 'Meu primeiro vídeo, gravado em 2010. O início de todo o trabalho do canal Tutoriais em Música.'
  },
  {
    tituloVideo: 'Solfejo02 - Tônica',
    tituloCabecalho: 'O que é a tônica',
    codigoVideo: '6v4KHwGHXEQ',
    resumoVideo: 'Perceba auditivamente e entenda o conceito de tônica, importante elemento musical.'
  },
  {
    tituloVideo: 'Solfejo 03 - Software',
    tituloCabecalho: 'App para os graus',
    codigoVideo: 'lDK61UKmiQA',
    resumoVideo: 'Acesse um aplicativo feito por mim para auxiliar o seu aprendizado.'
  },
  {
    tituloVideo: 'Solfejo 04 - Pentagrama',
    tituloCabecalho: 'A notação musical',
    codigoVideo: 'QacA2f6L_1U',
    resumoVideo: 'Aprenda como as notas musicais são representadas em um pentagrama.'
  },
  {
    tituloVideo: 'Solfejo 05 - Estrutura da Escala Maior',
    tituloCabecalho: 'Estrutura da escala maior',
    codigoVideo: 'nL5ecTTK4KE',
    resumoVideo: 'Tópico essencial para desenvolver o solfejo.'
  },
  {
    tituloVideo: 'Solfejo 06 - Exercícios',
    tituloCabecalho: 'Exercícios',
    codigoVideo: 'dRhY885r-LM',
    resumoVideo: 'Um pouco de exercício para complementar os estudos.'
  },
  {
    tituloVideo: 'Solfejo 07 - Sol Maior',
    tituloCabecalho: 'Sol Maior',
    codigoVideo: '9iPbKvB5x1Q',
    resumoVideo: 'Conheça a escala de Sol Maior'
  },
  {
    tituloVideo: 'Solfejo 08 - Sustenido',
    tituloCabecalho: 'Sustenido',
    codigoVideo: 'CvkvfuNgpSU',
    resumoVideo: 'Comece a descobrir as alterações das notas.'
  },
  {
    tituloVideo: 'Solfejo 09 - Armaduras',
    tituloCabecalho: 'Armaduras',
    codigoVideo: 'NCwZHwEeFNI',
    resumoVideo: 'Simplificando a partitura com a armadura.'
  },
  {
    tituloVideo: 'Solfejo 10 - Claves',
    tituloCabecalho: 'Claves',
    codigoVideo: 'Juix6j-RXE4',
    resumoVideo: 'Entenda porque existem as claves.'
  },
  {
    tituloVideo: 'Solfejo 11 - Clave de sol',
    tituloCabecalho: 'Clave de sol',
    codigoVideo: 'EBP3KxQ9sI0',
    resumoVideo: 'Conheça este símbolo mundialmente famoso.'
  },
  {
    tituloVideo: 'Solfejo 12 - Sol Maior 2',
    tituloCabecalho: 'Sol Maior 2',
    codigoVideo: 'pfhAcB888VI',
    resumoVideo: 'Aprofundando na tonalidade de Sol Maior.'
  },
  {
    tituloVideo: 'Solfejo 13 - Lá Maior',
    tituloCabecalho: 'Lá maior',
    codigoVideo: 'CwvUI_epm4o',
    resumoVideo: 'Conheça a estrutura da escala de Lá Maior.'
  },
  {
    tituloVideo: 'Solfejo 14 - Ré Maior',
    tituloCabecalho: 'Ré maior',
    codigoVideo: 'y6Fdmqjppl8',
    resumoVideo: 'Conheça a estrutura da escala de Ré Maior.'
  },
  {
    tituloVideo: 'Solfejo 15 - Primeiro Solfejo',
    tituloCabecalho: 'Primeiro Solfejo',
    codigoVideo: 'EAOA3NUS0qc',
    resumoVideo: 'Veja como você já avançou: faça o seu primeiro solfejo.'
  },
  {
    tituloVideo: 'Solfejo 16 - Segundo Solfejo',
    tituloCabecalho: 'Segundo Solfejo',
    codigoVideo: 'My8Jlt57LeY',
    resumoVideo: 'Ninguém segura você: faça o seu segundo solfejo.'
  },
  {
    tituloVideo: 'Solfejo 17 - Partes de coral',
    tituloCabecalho: 'Partes de coral',
    codigoVideo: 'kM6skY2bJRU',
    resumoVideo: 'Conhecendo muito material para estudar.'
  },
  {
    tituloVideo: 'Solfejo 18 - Elementos Ritmicos',
    tituloCabecalho: 'Elementos Ritmicos',
    codigoVideo: 'NdfD_V0dk4Y',
    resumoVideo: 'Vamos mergulhar no aspectos rítmicos, a dor de muita gente.'
  },
  {
    tituloVideo: 'Solfejo 19 - Símbolos rítmicos',
    tituloCabecalho: 'Símbolos rítmicos',
    codigoVideo: 'A28lh01IcZw',
    resumoVideo: 'Conheça os principais símbolos rítmicos.'
  },
  {
    tituloVideo: 'Solfejo 20 - Compassos',
    tituloCabecalho: 'Compassos',
    codigoVideo: 'VUGYRGlk1AA',
    resumoVideo: 'Entenda o que é um compasso e tudo vai ficar mais simples.'
  },
  {
    tituloVideo: 'Solfejo 21 - Compassos Binários',
    tituloCabecalho: 'Compassos Binários',
    codigoVideo: 'Oqw3fNlqLDw',
    resumoVideo: 'Conheça o compasso com 2 tempos.'
  },
  {
    tituloVideo: 'Solfejo 22 - Exemplos binários',
    tituloCabecalho: 'Exemplos binários',
    codigoVideo: 'B27vXvlVdAA',
    resumoVideo: 'Exemplos de compassos com 2 tempos.'
  },
  {
    tituloVideo: 'Solfejo 23 - Compassos Ternários',
    tituloCabecalho: 'Compassos Ternários',
    codigoVideo: 'zQAj55o7qAU',
    resumoVideo: 'Conheça o compasso com 3 tempos.'
  },
  {
    tituloVideo: 'Solfejo 24 - Exemplos ternários',
    tituloCabecalho: 'Exemplos ternários',
    codigoVideo: 'mVxQ83tcm1w',
    resumoVideo: 'Exemplos de compassos com 3 tempos.'
  },
  {
    tituloVideo: 'Solfejo 25 - Compassos quaternários',
    tituloCabecalho: 'Compassos quaternários',
    codigoVideo: 'lC2s9SyGs1A',
    resumoVideo: 'Conheça o compasso com 4 tempos.'
  },
  {
    tituloVideo: 'Solfejo 26 - Exemplos quaternários',
    tituloCabecalho: 'Exemplos quaternários',
    codigoVideo: 'FAhpkTiYIVM',
    resumoVideo: 'Exemplos de compassos com 4 tempos.'
  },
  {
    tituloVideo: 'Solfejo 27 - Dobro x Metade',
    tituloCabecalho: 'Dobro x Metade',
    codigoVideo: 'eORjOJvL4co',
    resumoVideo: 'Importantíssima relação rítmica fácil de perceber.'
  },
  {
    tituloVideo: 'Solfejo 28 - Armaduras com sustenidos',
    tituloCabecalho: 'Armaduras com sustenidos',
    codigoVideo: 'GHzbPJ2euxU',
    resumoVideo: 'Aprenda a simplificar a escrita musical com as armaduras com sustenidos.'
  },
  {
    tituloVideo: 'Solfejo 29 - Armaduras com bemóis',
    tituloCabecalho: 'Armaduras com bemóis',
    codigoVideo: 'zSpnqICRvKI',
    resumoVideo: 'Aprenda a simplificar a escrita musical com as armaduras com bemóis.'
  },
  {
    tituloVideo: 'Solfejo 30 - Dois exemplos',
    tituloCabecalho: 'Dois exemplos de armaduras',
    codigoVideo: '9WxJFdF9cws',
    resumoVideo: 'Veja na prática a importância do conceito de armaduras.'
  },
  {
    tituloVideo: 'Solfejo 31 - Intervalos',
    tituloCabecalho: 'Intervalos',
    codigoVideo: 'pH80v1OzVFA',
    resumoVideo: 'Quer ganhar mais autonomia? Pratique os intervalos.'
  },
  {
    tituloVideo: 'Solfejo 32 - Segundas Maiores e menores',
    tituloCabecalho: 'Segundas Maiores e menores',
    codigoVideo: '9d-a0jI-IzY',
    resumoVideo: 'Conheça e perceba os principais intervalos de segundas.'
  },
  {
    tituloVideo: 'Solfejo 33 - Terças maiores e menores',
    tituloCabecalho: 'Terças maiores e menores',
    codigoVideo: 'lEgotD1sKHk',
    resumoVideo: 'Conheça e perceba os principais intervalos de terças.'
  },
  {
    tituloVideo: 'Solfejo 34 - Oitava justa',
    tituloCabecalho: 'Oitava justa',
    codigoVideo: 'RQv4yL61rLE',
    resumoVideo: 'Conheça e perceba os principais intervalos de oitavas.'
  },
  {
    tituloVideo: 'Solfejo 35 - Intervalos Justos x Maiores e menores',
    tituloCabecalho: 'Intervalos Justos x Maiores ou menores',
    codigoVideo: 'm4vOmT3qufY',
    resumoVideo: 'Por que alguns intervalos são classificados como justos enquanto outros são maiores ou menores?'
  },
  {
    tituloVideo: 'Solfejo 36 - Sextas Maiores e menores',
    tituloCabecalho: 'Sextas Maiores e menores',
    codigoVideo: '5yIGHMmLYhc',
    resumoVideo: 'Conheça e perceba os principais intervalos de sextas.'
  },
  {
    tituloVideo: 'Solfejo 37 - Sétimas Maiores e menores',
    tituloCabecalho: 'Sétimas Maiores e menores',
    codigoVideo: 'mAh_Dt_AZmw',
    resumoVideo: 'Conheça e perceba os principais intervalos de sétimas.'
  },
  {
    tituloVideo: 'Solfejo 38 - Inversão de intervalos',
    tituloCabecalho: 'Inversão de intervalos',
    codigoVideo: 'd1mtPn229Fo',
    resumoVideo: 'Conheça esta regrinha para mudar sua vida.'
  },
  {
    tituloVideo: 'Solfejo 39 - Subdivisão binária',
    tituloCabecalho: 'Subdivisão binária',
    codigoVideo: 'Lk0LWJV6HYE',
    resumoVideo: 'Entenda e perceba a subdivisão por trás dos compassos simples.'
  },
  {
    tituloVideo: 'Solfejo 40 - Clave de fá',
    tituloCabecalho: 'Clave de fá',
    codigoVideo: 'gDjRHvmuz60',
    resumoVideo: 'Trabalhando com outra clave para ganhar mais autonomia.'
  },
  {
    tituloVideo: 'Solfejo 41 - Exemplos clave de fá',
    tituloCabecalho: 'Exemplos clave de fá',
    codigoVideo: 'hmwXJpFgbyQ',
    resumoVideo: 'Comece a praticar e veja como é simples.'
  },
  {
    tituloVideo: 'Solfejo 42 - Escala menor primitiva',
    tituloCabecalho: 'Escala menor primitiva',
    codigoVideo: 'Ich5bNj5eEw',
    resumoVideo: 'Percebendo a escala menor primitava e entendendo a sua relação com a escala maior.'
  },
  {
    tituloVideo: 'Solfejo 43 - Treinando leitura e escrita de música',
    tituloCabecalho: 'Treinando leitura e escrita de música',
    codigoVideo: 'n_WRtA29xZE',
    resumoVideo: 'Que tal começar a aprender a escrever música?'
  },
  {
    tituloVideo: 'Solfejo 44 - Ditado melódico',
    tituloCabecalho: 'Ditado melódico',
    codigoVideo: 'Svz5AmMOtCY',
    resumoVideo: 'Um primeiro ditado para você acostumar.'
  },
  {
    tituloVideo: 'Solfejo 45 - Escala menor harmônica',
    tituloCabecalho: 'Escala menor harmônica',
    codigoVideo: 'yMuWqTfWi9I',
    resumoVideo: 'Uma pequena alteração para grandes diferenças.'
  },
  {
    tituloVideo: 'Solfejo 46 - Escala menor melódica',
    tituloCabecalho: 'Escala menor melódica',
    codigoVideo: 'd3A9jLeDzgw',
    resumoVideo: 'Subindo a escala com alteração e descendo sem alteração.'
  },
  {
    tituloVideo: 'Solfejo 47 - Escala Bachiana e resumo',
    tituloCabecalho: 'Escala Bachiana e resumo',
    codigoVideo: 'fMD-Q8qal7w',
    resumoVideo: 'Um resumo com as principais escalas menores.'
  },
  {
    tituloVideo: 'Solfejo 48 - Grupos rítmicos',
    tituloCabecalho: 'Grupos rítmicos',
    codigoVideo: 'u59RMgkflv8',
    resumoVideo: 'Começando a agrupar símbolos rítmicos.'
  },
  {
    tituloVideo: 'Solfejo 49 - Tercinas ou quiálteras de 3',
    tituloCabecalho: 'Tercinas ou quiálteras de 3',
    codigoVideo: '07VBGhIT7o0',
    resumoVideo: 'Perceba este importante elemento que será a base dos compassos compostos.'
  },
  {
    tituloVideo: 'Solfejo 50 - Compassos compostos',
    tituloCabecalho: 'Compassos compostos',
    codigoVideo: 'DtaOA3sJOd0',
    resumoVideo: 'Começando a entender os compassos compostos.'
  },
  {
    tituloVideo: 'Solfejo 51 - Ligaduras de duração',
    tituloCabecalho: 'Ligaduras de duração',
    codigoVideo: 'N8Z7Up1Ye0I',
    resumoVideo: 'Aprenda a aumentar a duração de um som.'
  },
  {
    tituloVideo: 'Solfejo 52 - Clave de dó',
    tituloCabecalho: 'Clave de dó',
    codigoVideo: 'O3Xvvm1wE50',
    resumoVideo: 'Uma clave pouco usada mas que você vai entender rapidamente.'
  },
  {
    tituloVideo: 'Solfejo 53 - Relação entre as claves',
    tituloCabecalho: 'Relação entre as claves',
    codigoVideo: 'wR977l8JVcM',
    resumoVideo: 'Entenda como e porque essas diferentes claves se relacionam.'
  },
  {
    tituloVideo: 'Solfejo 54 - Ligaduras e ponto de aumento',
    tituloCabecalho: 'Ligaduras e ponto de aumento',
    codigoVideo: 'JRwZ7yglHDA',
    resumoVideo: 'Simplificando a escrita musical com o ponto de aumento.'
  },
  {
    tituloVideo: 'Solfejo 55 - Síncopes',
    tituloCabecalho: 'Síncopes',
    codigoVideo: 'Ofu2-5nyzN0',
    resumoVideo: 'Conheça este importante elemento musical muito usado na MPB.'
  },
  {
    tituloVideo: 'Anacruse, Tético e Acéfalo',
    tituloCabecalho: 'Anacruse, Tético e Acéfalo',
    codigoVideo: 'aGX17QJauoA',
    resumoVideo: 'Principais maneiras de classificar uma compasso pelo início da frase.'
  },
  {
    tituloVideo: 'Solfejo 57 - Modo jônio',
    tituloCabecalho: 'Modo jônio',
    codigoVideo: 'VeboQODP20I',
    resumoVideo: 'Percebendo os modos: Modo jônio. Começando do grau 1.'
  },
  {
    tituloVideo: 'Solfejo 58 - Modo dórico',
    tituloCabecalho: 'Modo dórico',
    codigoVideo: 'EgxyJAESLnY',
    resumoVideo: 'Percebendo os modos: Modo dórico. Começando do grau 2.'
  },
  {
    tituloVideo: 'Solfejo 59 - Modo frígio',
    tituloCabecalho: 'Modo frígio',
    codigoVideo: '8XaAaph-dfg',
    resumoVideo: 'Percebendo os modos: Modo frígio. Começando do grau 3.'
  },
  {
    tituloVideo: 'Solfejo 60 - Modo lídio',
    tituloCabecalho: 'Modo lídio',
    codigoVideo: 'V2j4Fv_ql28',
    resumoVideo: 'Percebendo os modos: Modo lídio. Começando do grau 4.'
  },
  {
    tituloVideo: 'Solfejo 61 - Modo mixolídio',
    tituloCabecalho: 'Modo mixolídio',
    codigoVideo: 'J09UpN_Ti7M',
    resumoVideo: 'Percebendo os modos: Modo mixolídio. Começando do grau 5.'
  },
  {
    tituloVideo: 'Solfejo 62 - Modo eólio',
    tituloCabecalho: 'Modo eólio',
    codigoVideo: 'pDDoh-uqUgQ',
    resumoVideo: 'Percebendo os modos: Modo eólio. Começando do grau 6.'
  },
  {
    tituloVideo: 'Solfejo 63 - Modo lócrio',
    tituloCabecalho: 'Modo lócrio',
    codigoVideo: 'RhvCulmPm08',
    resumoVideo: 'Percebendo os modos: Modo lócrio. Começando do grau 7.'
  },
  {
    tituloVideo: 'Seqüências numéricas - Tutoriais em música',
    tituloCabecalho: 'Seqüências numéricas',
    codigoVideo: '9L4fI4pCO0Q',
    resumoVideo: 'Muitas sequências numéricas.'
  },
  {
    tituloVideo: 'Tutoriais em música - Sequencias Numéricas 2',
    tituloCabecalho: 'Sequencias Numéricas 2',
    codigoVideo: 'oo9SdH8y1cw',
    resumoVideo: 'Mais sequências numéricas para você treinar.'
  },
  {
    tituloVideo: 'Solfejo 68 - Ditados Sequencias Numéricas',
    tituloCabecalho: 'Ditados Sequencias Numéricas',
    codigoVideo: 'k0uJvbMT9JY',
    resumoVideo: 'Escute, perceba e escreva algumas sequências numéricas.'
  },
  {
    tituloVideo: 'Tutoriais em música - Sequências na pauta',
    tituloCabecalho: 'Sequências na pauta',
    codigoVideo: 'fLHa8M3W7rk',
    resumoVideo: 'Ótima maneira de praticar tudo isso que você aprendeu aqui.'
  },
  {
    tituloVideo: 'Tutoriais em música - Sequencias Numéricas 3',
    tituloCabecalho: 'Sequencias Numéricas 3',
    codigoVideo: 'vD3d1qNHcBM',
    resumoVideo: 'Coloque em prática tudo que você vem estudando.'
  },
  {
    tituloVideo: 'Tutoriais em música - Sequencias Numéricas 4',
    tituloCabecalho: 'Sequencias Numéricas 4',
    codigoVideo: 'nNGRfsB1d1k',
    resumoVideo: 'Não pare de ouvir nem pare de pensar.'
  },
  {
    tituloVideo: 'Solfejo 72 - Melodia simples',
    tituloCabecalho: 'Melodia simples',
    codigoVideo: 'rDwm273u614',
    resumoVideo: 'Uma super evolução desde que você começou. Concorda comigo?'
  }
]

export { dados };