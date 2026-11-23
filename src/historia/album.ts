// Álbum de Filósofos: a parte didática. Cada carta tem a ideia de verdade
// (curta e correta) e a piada do jogo. Ganha-se ao conversar com a pessoa.

export interface Carta {
  vida: string;
  ideia: string;
  piada: string;
}

export const ALBUM: Record<string, Carta> = {
  socrates: {
    vida: 'Atenas, c. 470 a 399 a.C.',
    ideia: 'Não escreveu nada. Filosofava perguntando: a maiêutica ajuda o outro a "parir" ideias, e o élenco mostra que quem acha que sabe, não sabe. Foi condenado à morte por "corromper a juventude".',
    piada: 'Nunca deu uma resposta direta na vida. Nem quando perguntaram as horas.',
  },
  platao: {
    vida: 'Atenas, c. 428 a 348 a.C.',
    ideia: 'Aluno de Sócrates e autor da Alegoria da Caverna (A República, livro VII). Para ele, o mundo que vemos é cópia imperfeita das Formas (ou Ideias), eternas e perfeitas, que só a razão alcança.',
    piada: 'O nome de verdade era Arístocles. "Platão" seria apelido por causa dos ombros largos. Glauco, o protagonista, é irmão dele de verdade.',
  },
  parmenides: {
    vida: 'Eleia, c. 515 a 450 a.C.',
    ideia: 'O ser é, o não ser não é. Mudança e movimento seriam ilusões dos sentidos: a realidade verdadeira é una, imóvel e eterna.',
    piada: 'O único prisioneiro que não reclama da corrente. Para ele, se mexer é ilusão mesmo.',
  },
  zenao: {
    vida: 'Eleia, c. 490 a 430 a.C.',
    ideia: 'Discípulo de Parmênides, criou paradoxos para provar que o movimento é impossível. O mais famoso: Aquiles nunca alcança a tartaruga, porque sempre falta metade do caminho.',
    piada: 'Faz dez anos que tenta alcançar a parede. Já percorreu a metade da metade da metade.',
  },
  heraclito: {
    vida: 'Éfeso, c. 535 a 475 a.C.',
    ideia: 'Tudo flui (panta rhei). Ninguém entra duas vezes no mesmo rio, porque nem o rio nem a pessoa são os mesmos. A realidade é mudança e tensão entre opostos, regida pelo logos.',
    piada: 'Chamado de "o obscuro" e de "o filósofo que chora". Não assiste reprise.',
  },
  pirro: {
    vida: 'Élis, c. 360 a 270 a.C.',
    ideia: 'Pai do ceticismo: como todo argumento tem um contrário de mesmo peso, o sábio suspende o juízo (epoché) e assim chega à tranquilidade (ataraxia).',
    piada: 'Contam que os amigos precisavam segurá-lo para não cair em barranco, porque ele não tinha certeza de que o barranco existia.',
  },
  trasimaco: {
    vida: 'Calcedônia, século V a.C.',
    ideia: 'Sofista que, n\'A República, afirma que "a justiça é a conveniência do mais forte". Sócrates passa o livro I inteiro tentando derrubá-lo.',
    piada: 'Campeão invicto de previsão de sombras. Acha que isso o torna justo.',
  },
  sartre: {
    vida: 'Paris, 1905 a 1980',
    ideia: 'Existencialista: a existência precede a essência. Não nascemos com natureza pronta, nos fazemos pelas escolhas, e por isso estamos "condenados a ser livres". Na peça Entre Quatro Paredes: "o inferno são os outros".',
    piada: 'Divide corrente com Dona Doxa. A frase sobre o inferno nasceu aí.',
  },
  marx: {
    vida: 'Tréveris e Londres, 1818 a 1883',
    ideia: 'A história é a história da luta de classes. A ideologia faz a dominação parecer natural. No Manifesto: os proletários nada têm a perder além de seus grilhões.',
    piada: 'Está organizando o sindicato dos acorrentados. Falta só alguém se mexer.',
  },
  gorgias: {
    vida: 'Leontinos, c. 485 a 380 a.C.',
    ideia: 'Sofista e mestre da retórica. Defendeu que nada existe; se existisse, não poderia ser conhecido; se pudesse, não poderia ser comunicado. E ainda assim cobrava caro para ensinar a falar bem.',
    piada: 'Presidente do Sindicato dos Titereiros. Prova que você não existe e depois pede sua assinatura.',
  },
  protagoras: {
    vida: 'Abdera, c. 490 a 420 a.C.',
    ideia: '"O homem é a medida de todas as coisas." Relativismo: a verdade depende de quem percebe. Foi o primeiro a cobrar pelas aulas, e caro.',
    piada: 'Trabalha no RH medindo tudo com fita métrica. Cada um tem a sua fita.',
  },
  maquiavel: {
    vida: 'Florença, 1469 a 1527',
    ideia: 'N\'O Príncipe, separa política de moral: o governante deve ser temido ou amado, e se não puder os dois, é mais seguro ser temido. Descreve o poder como ele é, não como deveria ser.',
    piada: 'Consultor de imagem da caverna. Melhor ser temido que amado, mas o ideal é estar na tela.',
  },
  debord: {
    vida: 'Paris, 1931 a 1994',
    ideia: 'N\'A Sociedade do Espetáculo: o espetáculo não é um conjunto de imagens, é uma relação social mediada por imagens. Vivemos assistindo a vida em vez de vivê-la.',
    piada: 'Faz a crítica da SombraTV ao vivo, na própria SombraTV.',
  },
  baudrillard: {
    vida: 'Reims e Paris, 1929 a 2007',
    ideia: 'Simulacros e Simulação: chega um ponto em que a cópia não remete a nenhum original. O "hiper-real" é mais real que o real.',
    piada: 'Faz sombra de sombra de boneco que imita sombra. Ninguém sabe mais qual era o coelho original.',
  },
  foucault: {
    vida: 'Poitiers e Paris, 1926 a 1984',
    ideia: 'Vigiar e Punir: o panóptico é a prisão onde o preso nunca sabe se está sendo vigiado, e por isso se vigia sozinho. O poder não só proíbe, ele produz comportamentos e saberes.',
    piada: 'Fiscaliza a caverna de um ponto alto. Ninguém sabe se ele está olhando. Ele também não.',
  },
  han: {
    vida: 'Seul e Berlim, nascido em 1959',
    ideia: 'A Sociedade do Cansaço: trocamos o "você não pode" pelo "você pode tudo", e o sujeito do desempenho explora a si mesmo até o esgotamento, achando que é livre.',
    piada: 'Titereiro com meta de 400 sombras por turno. Diz que ninguém o obriga. É isso que o assusta.',
  },
  diogenes: {
    vida: 'Sinope e Corinto, c. 412 a 323 a.C.',
    ideia: 'Cínico: vida simples, segundo a natureza, desprezando convenções. Morava num barril (um grande jarro), andava de dia com uma lanterna "procurando um homem" e, quando Alexandre, o Grande, ofereceu o que quisesse, pediu que saísse da frente do sol.',
    piada: 'Tirou um galo depenado da sacola e disse: "eis o homem de Platão". Os dois não se suportavam.',
  },
  hiparquia: {
    vida: 'Maroneia e Atenas, c. 350 a 280 a.C.',
    ideia: 'Uma das primeiras filósofas registradas. Cínica, largou a vida rica para viver com Crates na rua. Quando zombaram dela por estudar em vez de tecer, respondeu que não se arrependia do tempo dedicado à própria educação.',
    piada: 'Vizinha de barril do Diógenes. Ela é a mais educada dos dois, o que não é difícil.',
  },
  tales: {
    vida: 'Mileto, c. 624 a 546 a.C.',
    ideia: 'Considerado o primeiro filósofo do Ocidente: procurou um princípio natural para tudo (a água), sem recorrer aos mitos. Teria previsto um eclipse e medido pirâmides pela sombra.',
    piada: 'Caiu num poço olhando as estrelas. Uma criada trácia riu: queria ver o céu e não via o que tinha nos pés. Platão conta essa.',
  },
  camus: {
    vida: 'Argélia e França, 1913 a 1960',
    ideia: 'O absurdo nasce do choque entre nossa busca de sentido e o silêncio do mundo. A resposta não é desistir, é revoltar-se e viver mesmo assim. "É preciso imaginar Sísifo feliz."',
    piada: 'Torce pelo Sísifo como quem torce por time de várzea. Era goleiro na juventude, aliás.',
  },
  sisifo: {
    vida: 'Mito grego, tempo nenhum',
    ideia: 'Condenado pelos deuses a empurrar uma pedra morro acima para sempre: ela rola de volta ao chegar no topo. Camus fez dele o herói do absurdo.',
    piada: 'Não é filósofo, mas é o único que já subiu o morro mil vezes.',
  },
  pitagoras: {
    vida: 'Samos e Crotona, c. 570 a 495 a.C.',
    ideia: 'Para os pitagóricos, tudo é número: a harmonia da música e do cosmos é matemática. Fundou uma comunidade com regras rígidas, entre elas a de não comer favas.',
    piada: 'Guarda a porta do andar da Razão. Pergunta de geometria e se você comeu feijão.',
  },
  descartes: {
    vida: 'França e Suécia, 1596 a 1650',
    ideia: 'Duvidou de tudo, até de um "gênio maligno" que poderia enganá-lo sobre o mundo inteiro. Sobrou uma certeza: se duvido, penso; "penso, logo existo".',
    piada: 'Ainda não confirmou se a escada existe. Está subindo mesmo assim, por precaução.',
  },
  kierkegaard: {
    vida: 'Copenhague, 1813 a 1855',
    ideia: 'Pai do existencialismo. A angústia é a "vertigem da liberdade". Certas escolhas, como a fé, não se provam pela razão: exigem um salto.',
    piada: 'Fica na beira do abismo explicando que não dá para explicar. Aí pula.',
  },
  kant: {
    vida: 'Königsberg, 1724 a 1804',
    ideia: 'Só conhecemos os fenômenos, as coisas como aparecem para nós. A "coisa em si" fica fora do alcance. Na ética, o imperativo categórico: aja só segundo a regra que você quereria que valesse para todos.',
    piada: 'Fazia a mesma caminhada todo dia, tão pontual que os vizinhos acertavam o relógio por ele.',
  },
  wittgenstein: {
    vida: 'Viena e Cambridge, 1889 a 1951',
    ideia: 'No Tractatus, os limites da minha linguagem são os limites do meu mundo. O livro termina dizendo que quem o entendeu deve jogar fora a escada depois de subir por ela, e que sobre o que não se pode falar, deve-se calar.',
    piada: 'Depois mudou de ideia e escreveu outro livro inteiro discordando de si mesmo.',
  },
  aristoteles: {
    vida: 'Estagira e Atenas, 384 a 322 a.C.',
    ideia: 'Aluno de Platão por 20 anos, discordou do mestre: a forma não mora num mundo separado, está nas próprias coisas. Classificou animais, criou a lógica formal e definiu a virtude como o meio-termo.',
    piada: '"Sou amigo de Platão, mas mais amigo da verdade." Está catalogando suas Formas com etiqueta.',
  },
  epicuro: {
    vida: 'Samos e Atenas, 341 a 270 a.C.',
    ideia: 'O bem é o prazer, mas o prazer tranquilo: ausência de dor no corpo e de perturbação na alma. Pão, água, amigos e um jardim. "Onde a morte está, eu não estou."',
    piada: 'Inventou o "sombra e água fresca" uns 2.300 anos antes do ditado.',
  },
  marcoaurelio: {
    vida: 'Roma, 121 a 180',
    ideia: 'Imperador estoico. Nas Meditações, escritas para si mesmo: distinguir o que depende de nós do que não depende, e aceitar o resto com serenidade.',
    piada: 'O homem mais poderoso do mundo e o diário dele é só autoajuda pra si mesmo.',
  },
  nietzsche: {
    vida: 'Prússia e Suíça, 1844 a 1900',
    ideia: 'Criticou a ideia de um mundo verdadeiro além deste, que via como herança de Platão. "Deus está morto": é preciso criar valores novos. Zaratustra desce da montanha para ensinar o além-do-homem.',
    piada: 'Desceu da montanha de bigode e tudo. Acha que a caverna é este mundo e lá fora é invenção.',
  },
  diotima: {
    vida: 'Mantineia, século V a.C.',
    ideia: 'No Banquete, Sócrates conta que aprendeu com ela o que é o amor: um desejo que sobe, degrau por degrau, do corpo belo até a Beleza em si.',
    piada: 'A única pessoa que deu aula para o Sócrates e ele ficou quieto.',
  },
  hipatia: {
    vida: 'Alexandria, c. 360 a 415',
    ideia: 'Matemática, astrônoma e filósofa neoplatônica, dirigia uma escola em Alexandria. Comentou obras de matemática e ensinava a observar o céu. Foi assassinada por uma multidão.',
    piada: 'Leva você para ver as estrelas e corrige sua conta no caminho.',
  },
  spinoza: {
    vida: 'Amsterdã, 1632 a 1677',
    ideia: 'Deus ou Natureza: há uma única substância, e tudo é modo dela. Liberdade é entender as causas do que nos afeta. Ganhava a vida polindo lentes.',
    piada: 'Faz óculos sob medida para quem acabou de sair da caverna. Expulso da própria comunidade, nunca perdeu a calma.',
  },
  laotse: {
    vida: 'China, século VI a.C. (talvez lenda)',
    ideia: 'No Tao Te Ching, o Tao que pode ser dito não é o Tao eterno. O sábio age pelo não agir (wu wei), como a água, que é mole e vence a pedra.',
    piada: 'Respondeu tudo que você perguntou sem dizer nada. E você entendeu.',
  },
  confucio: {
    vida: 'China, 551 a 479 a.C.',
    ideia: 'Ética das relações: benevolência (ren), ritual e estudo. A regra de prata: não faça aos outros o que não quer para si. A sociedade melhora quando cada um cultiva a si mesmo.',
    piada: 'Quer saber por que você saiu da caverna sem se despedir dos seus pais.',
  },
  beauvoir: {
    vida: 'Paris, 1908 a 1986',
    ideia: 'N\'O Segundo Sexo: "ninguém nasce mulher: torna-se mulher". O que parece natureza é construção social. Liberdade é sempre situada, e a sua depende da dos outros.',
    piada: 'Leu a Alegoria da Caverna e perguntou por que todos os prisioneiros eram homens.',
  },
  schopenhauer: {
    vida: 'Danzig e Frankfurt, 1788 a 1860',
    ideia: 'O mundo é vontade e representação: por trás de tudo há uma vontade cega que nunca se satisfaz. A vida oscila entre a dor e o tédio. A arte e a compaixão dão algum alívio.',
    piada: 'Saiu da caverna, achou o sol forte demais e a grama molhada. Dava aula no mesmo horário que Hegel, para ninguém.',
  },
  arendt: {
    vida: 'Alemanha e Nova York, 1906 a 1975',
    ideia: 'A banalidade do mal: grandes crimes podem vir de gente comum que não pensa. Pensar é dialogar consigo mesmo, e a política é o espaço da pluralidade, onde aparecemos uns para os outros.',
    piada: 'A única na assembleia que exige que todo mundo pense antes de votar. Vaiada pelos dois lados.',
  },
  anito: {
    vida: 'Atenas, século V a.C.',
    ideia: 'Político ateniense, um dos três acusadores de Sócrates no julgamento de 399 a.C. (com Meleto e Lícon), como Platão narra na Apologia.',
    piada: 'Organizador oficial de assembleia que termina em chá.',
  },
  bacon: {
    vida: 'Londres, 1561 a 1626',
    ideia: 'Pai do método empírico. Os "ídolos" atrapalham o conhecimento: da tribo, do foro, do teatro e da caverna, este último sendo os vícios de cada um, sua própria caverna pessoal.',
    piada: 'Morreu, diz a lenda, depois de enfiar neve num frango para testar se o frio conservava a carne.',
  },
};

/** Ordem de exibição no álbum. */
export const ORDEM_ALBUM = Object.keys(ALBUM);
