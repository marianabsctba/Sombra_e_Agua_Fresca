import type { Conversa } from '../jogo/tipos';

// ATO 4: LÁ FORA. Os olhos se acostumam em ordem: sombras, reflexos, coisas,
// estrelas e, por fim, o sol. No caminho, as Formas e gente demais.

const CLARO_DEMAIS = (precisa: string): Conversa => ({
  inicio: { l: [['glauco', `Ainda está claro demais para isso. Meus olhos doem. ${precisa}`]] },
});

export const FALAS4: Record<string, Conversa> = {
  entrada_fora: {
    inicio: {
      l: [
        ['', 'LUZ. MUITA LUZ. Como se alguém tivesse ligado a SombraTV no brilho máximo, dentro do seu olho.'],
        ['glauco', 'Não enxergo nada! Só... umas sombras no chão. Que ironia.'],
        ['', '(Seus olhos vão se acostumar aos poucos. Comece pelo que dá para ver: as sombras no chão, perto da saída da caverna.)'],
      ],
    },
  },

  sombrachao: {
    inicio: {
      ramos: [{ se: 'visao>=1', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['', 'A sombra de uma árvore no chão. Igualzinha às da parede. Que conforto.'],
        ['glauco', 'Mas esta não tem titereiro. Tem uma árvore de verdade em cima, eu acho. Ainda não consigo olhar para ela.'],
        ['', '(Seus olhos se acostumaram um pouco. Tente os reflexos no lago, mais abaixo.)'],
      ],
      fx: ['visao:1'],
    },
    ja: { l: [['', 'A sombra da árvore. Você já superou essa fase. Parabéns, seus olhos estão no ensino médio.']] },
  },

  reflexo: {
    inicio: {
      ramos: [{ se: 'visao>=2', ir: 'ja' }, { se: 'visao>=1', ir: 'a' }, { ir: 'cedo' }],
      l: [],
    },
    cedo: { l: [['glauco', 'O lago brilha tanto que parece outro sol. Melhor olhar primeiro as sombras no chão, perto da caverna.']] },
    a: {
      l: [
        ['', 'No lago, o mundo aparece de ponta-cabeça: árvores, nuvens, um cavalo, pessoas de toga.'],
        ['glauco', 'Reflexos! Mais nítidos que qualquer sombra. E tem gente lá fora. Gente estranha.'],
        ['', '(Agora você já consegue ver as pessoas e algumas coisas. Procure as Formas: tudo o que tiver um brilho em volta.)'],
      ],
      fx: ['visao:2'],
    },
    ja: { l: [['', 'Seu reflexo no lago. Você está com cara de quem nunca viu o sol. Porque nunca viu.']] },
  },

  // ---------- Formas

  cadeira: {
    inicio: { ramos: [{ se: 'forma:cadeira', ir: 'ja' }, { se: 'visao>=2', ir: 'a' }, { ir: 'cedo' }], l: [] },
    cedo: CLARO_DEMAIS('').inicio,
    a: {
      l: [
        ['', 'Uma cadeira. Mas não qualquer cadeira: a mais cadeira de todas as cadeiras.'],
        ['', 'Você ganhou: A CADEIRA EM SI. Todas as cadeiras do mundo são cópias tortas dela. Inclusive a sua, se um dia tiver uma.'],
      ],
      fx: ['forma:cadeira', 'visao:3'],
    },
    ja: { l: [['', 'A Cadeira em Si. Você não se senta nela. Ninguém se senta nela. É uma Forma, não um móvel.']] },
  },

  cavalo: {
    inicio: { ramos: [{ se: 'forma:cavalo', ir: 'ja' }, { se: 'visao>=2', ir: 'a' }, { ir: 'cedo' }], l: [] },
    cedo: CLARO_DEMAIS('').inicio,
    a: {
      l: [
        ['', 'Um cavalo de verdade! Tem cheiro! Tem cor! Tem três dimensões e uma opinião sobre você!'],
        ['', 'Atrás dele, um brilho: O CAVALO EM SI. A cavalidade perfeita, da qual todos os cavalos participam.'],
        ['glauco', 'O Crítico ia dar cinco estrelas para isso.'],
      ],
      fx: ['forma:cavalo', 'visao:3'],
    },
    ja: { l: [['', 'O cavalo pasta, indiferente à metafísica. O Cavalo em Si brilha atrás dele, ainda mais indiferente.']] },
  },

  arvore: {
    inicio: { ramos: [{ se: 'forma:arvore', ir: 'ja' }, { se: 'visao>=2', ir: 'a' }, { ir: 'cedo' }], l: [] },
    cedo: CLARO_DEMAIS('').inicio,
    a: {
      l: [
        ['', 'A árvore que fazia aquela sombra no chão. Folhas de verdade, que se mexem sem ninguém segurando.'],
        ['', 'Você ganhou: A ÁRVORE EM SI. Sem praga, sem galho torto, sem cachorro fazendo xixi nela.'],
      ],
      fx: ['forma:arvore', 'visao:3'],
    },
    ja: { l: [['', 'A Árvore em Si. A sombra dela, lá na caverna, ia virar novela.']] },
  },

  balanca: {
    inicio: { ramos: [{ se: 'forma:justica', ir: 'ja' }, { se: 'visao>=2', ir: 'a' }, { ir: 'cedo' }], l: [] },
    cedo: CLARO_DEMAIS('').inicio,
    a: {
      l: [
        ['', 'Uma balança de pedra, perfeitamente equilibrada. Ninguém sabe quem colocou aqui.'],
        ['', 'Você ganhou: A JUSTIÇA EM SI. O assunto d\'A República inteira. Platão escreveu dez livros para chegar nela.'],
        ['glauco', 'O Trasímaco ia odiar isso aqui. Ótimo.'],
      ],
      fx: ['forma:justica', 'visao:3'],
    },
    ja: { l: [['', 'A Justiça em Si. Não dá para pesar nada nela. Ela é que pesa você.']] },
  },

  sol: {
    inicio: {
      ramos: [{ se: 'forma:bem', ir: 'ja' }, { se: 'visao>=4', ir: 'a' }, { ir: 'cedo' }],
      l: [],
    },
    cedo: {
      l: [['glauco', 'Olhar direto para o sol? Agora? Nem pensar. Primeiro as estrelas, de noite. Dizem que a Hipátia sabe tudo de céu.']],
    },
    a: {
      l: [
        ['', 'Você olha para o sol. Não diretamente, que o oftalmologista do Hades não deixa. Mas olha.'],
        ['', 'E entende: é ele que deixa as coisas serem vistas. Que faz crescer, que faz existir. Sem ele, nem as sombras existiriam.'],
        ['', 'Você ganhou: A IDEIA DO BEM. A Forma das Formas. O sol da alma.'],
        ['glauco', 'Tudo aquilo lá embaixo... eles nunca vão ver isso.'],
        ['', '(Fale com Epicuro, no jardim, quando quiser decidir o que fazer da vida. Sem pressa. Ele não tem nenhuma.)'],
      ],
      fx: ['forma:bem', 'visao:5'],
    },
    ja: { l: [['', 'O sol continua lá. Ele não liga se você entendeu ou não. É o que tem de mais generoso.']] },
  },

  rachadura: {
    inicio: {
      l: [
        ['', 'Tem uma rachadura no céu. Bem fininha. Ninguém mais parece notar.'],
        ['', 'Pela fresta dá para ver... uma parede? E na parede... sombras de árvores, de lagos, de filósofos?'],
        ['glauco', 'Não. Não, não, não.'],
      ],
      esc: [
        { t: 'Entrar na rachadura.', fx: ['cena:secreta'] },
        { t: 'Fingir que não viu.' },
      ],
    },
  },

  // ---------- gente lá fora

  socrates4: {
    inicio: {
      ramos: [{ se: 'forma:bem', ir: 'fim' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['socrates', 'Doeu? Vai doer mais um pouco. Os olhos se acostumam em ordem: sombras, reflexos, coisas, estrelas e, por último, o sol.'],
        ['socrates', 'Pular etapa é ficar cego de novo. Igual quando alguém lê o resumo e acha que leu o livro.'],
      ],
    },
    fim: {
      l: [
        ['socrates', 'Agora você viu. E a pergunta que sobra é a mais difícil de todas.'],
        ['socrates', 'Quem viu o sol tem alguma dívida com quem ainda olha sombra? Ou pode ficar aqui, de pernas para o ar?'],
        ['socrates', 'Não me olhe assim. Eu só pergunto. Pergunte ao Epicuro, ele vai te oferecer uma rede.'],
      ],
    },
  },

  aristoteles1: {
    inicio: {
      l: [
        ['aristoteles', 'Bem-vindo ao Liceu! Aristóteles, aluno do Platão por vinte anos. Discordo dele há dezenove.'],
        ['aristoteles', 'Ele diz que a Forma mora num mundo separado. Eu digo: está na própria coisa. A cadeiridade está na cadeira, ó, bem aqui.'],
        ['glauco', 'E o que o Platão acha disso?'],
        ['aristoteles', 'Sou amigo de Platão, mas mais amigo da verdade. Agora me dá licença, estou classificando todos os animais que existem. Faltam uns quinhentos.'],
        ['aristoteles', 'Ah, e a virtude está no meio-termo. Nem covarde, nem temerário. Nem acorrentado, nem desesperado para voltar.'],
      ],
    },
  },

  platao1: {
    inicio: {
      l: [
        ['platao', 'Glauco! Meu irmão! Você saiu!'],
        ['glauco', 'Platão? Você estava aqui fora esse tempo todo?'],
        ['platao', 'Estava escrevendo. Um livro sobre você, sabia? Sobre a caverna, o fogo, a subida. Vai se chamar A República.'],
        ['glauco', 'Um livro sobre mim!'],
        ['platao', 'Sobre você, sim. Mas o protagonista vai ser o Sócrates.'],
        ['glauco', '...'],
        ['platao', 'Ele fala melhor. Você fica com as falas "sim, Sócrates", "claro, Sócrates" e "é evidente, Sócrates". São muitas, juro.'],
      ],
    },
  },

  epicuro1: {
    inicio: {
      ramos: [{ se: 'forma:bem', ir: 'decide' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['epicuro', 'Prazer, Epicuro. Prazer mesmo, é minha filosofia.'],
        ['epicuro', 'Mas não é festa. É pão, água fresca, amigos e esta sombra aqui. Sem dor no corpo, sem perturbação na alma.'],
        ['epicuro', 'E não tenha medo da morte: onde ela está, eu não estou. Onde eu estou, ela não está. Nunca nos encontramos. Muito educada.'],
        ['epicuro', 'Volte quando tiver visto o sol. Aí a gente conversa sobre a rede.'],
      ],
    },
    decide: {
      l: [
        ['epicuro', 'Viu o sol, né? Dá para ver na sua cara. Agora vem cá.'],
        ['epicuro', 'Pão, água fresca, amigos, esta rede. Sombra e água fresca, literalmente. Fica com a gente.'],
        ['epicuro', 'Lá embaixo vão rir de você. Vão dizer que você ficou cego. Podem até querer te machucar. Para quê?'],
      ],
      esc: [
        { t: 'Fico. Me passa essa rede.', ir: 'fica' },
        { t: 'Preciso voltar e contar para eles.', ir: 'volta' },
        { t: 'Ainda não sei.', ir: 'nsei' },
      ],
    },
    fica: {
      l: [['epicuro', 'Sábia escolha. Ou egoísta. Lá no jardim a gente não diferencia muito.']],
      fx: ['final:sombra'],
    },
    volta: {
      l: [
        ['epicuro', 'Teimoso. Gosto. Vai lá. Eu guardo sua rede.'],
        ['', '(A entrada da caverna fica à esquerda, de onde você saiu.)'],
      ],
      fx: ['flag:decidiuVoltar'],
    },
    nsei: { l: [['epicuro', 'Não saber é ótimo. Não ter pressa é melhor ainda. Senta um pouco.']] },
  },

  marcoaurelio1: {
    inicio: {
      l: [
        ['marcoaurelio', 'O sol forte não depende de você. A velocidade com que seus olhos se acostumam, também não muito.'],
        ['marcoaurelio', 'Respirar, aceitar e seguir: isso depende. Separe sempre o que está em seu poder do que não está.'],
        ['glauco', 'O senhor é imperador e fala igual a um livro de autoajuda.'],
        ['marcoaurelio', 'Eu escrevia para mim mesmo. Publicaram depois que eu morri. Nunca confie num editor.'],
      ],
    },
  },

  nietzsche1: {
    inicio: {
      l: [
        ['nietzsche', 'Você acha que saiu da caverna? Que lá fora é o mundo verdadeiro e aqui é a cópia?'],
        ['glauco', 'Bom... sim? Foi isso que me disseram.'],
        ['nietzsche', 'Quem disse foi Platão! O "mundo verdadeiro" virou uma fábula. Este mundo aqui, com dor, carne e sol, é o que temos. E é bom!'],
        ['nietzsche', 'Desci da montanha para avisar: Deus está morto. E a Ideia do Bem também não anda muito bem.'],
        ['nietzsche', 'Crie seus próprios valores. E dance! Eu só acreditaria num deus que soubesse dançar.'],
      ],
    },
  },

  diotima1: {
    inicio: {
      ramos: [{ se: 'forma:beleza', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['diotima', 'Sou Diotima. Fui eu que ensinei o Sócrates sobre o amor. Ele ficou quieto a aula inteira. Um milagre.'],
        ['diotima', 'O amor é uma escada, como a sua subida. Começa num corpo belo. Depois todos os corpos belos. Depois as almas belas.'],
        ['diotima', 'Depois as leis, os saberes, as ideias belas. E no topo, de repente: a Beleza em Si. Eterna, sem começo nem fim.'],
        ['', 'Você ganhou: A BELEZA EM SI.'],
      ],
      fx: ['forma:beleza', 'visao:3'],
    },
    ja: { l: [['diotima', 'Amar é desejar o que não se tem. Por isso o amor é filósofo: ama o saber porque não sabe.']] },
  },

  hipatia1: {
    inicio: {
      ramos: [
        { se: 'visao>=4', ir: 'ja' },
        { se: 'formas>=3', ir: 'a' },
        { ir: 'cedo' },
      ],
      l: [],
    },
    cedo: {
      l: [
        ['hipatia', 'Hipátia de Alexandria. Astronomia, matemática e filosofia, nessa ordem de paciência.'],
        ['hipatia', 'Você ainda está piscando demais. Ache pelo menos três Formas e volte. Aí te mostro o céu de noite.'],
      ],
    },
    a: {
      l: [
        ['hipatia', 'Agora sim. Vamos esperar a noite. Estrelas primeiro, sol depois. Está no livro, e é uma boa ordem.'],
      ],
      fx: ['flag:noite'],
      ir: 'noite',
    },
    noite: {
      l: [
        ['', 'A noite cai. Mil pontinhos acendem no céu.'],
        ['hipatia', 'Aquelas são as fixas. As que andam se chamam planetas, "errantes". Mas não erram: seguem números.'],
        ['hipatia', 'Três estrelas ali formam um triângulo quase perfeito. O perfeito mesmo fica aqui, ó: na cabeça.'],
        ['', 'Você ganhou: O TRIÂNGULO EM SI. Nenhum triângulo desenhado é perfeito. Este é.'],
        ['hipatia', 'Durma. Amanhã, com o olho descansado, suba o morro ao nordeste e olhe o sol. De lado, por favor.'],
      ],
      fx: ['-flag:noite', 'forma:triangulo', 'visao:4'],
    },
    ja: {
      l: [['hipatia', 'O morro fica no canto de cima, à direita. O sol está lá todo dia. Pontualidade de fazer inveja ao Kant.']] },
  },

  spinoza1: {
    inicio: {
      ramos: [{ se: 'flag:lente', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['spinoza', 'Espinosa, polidor de lentes. Fui expulso da minha comunidade e continuei polindo. Calma é tudo.'],
        ['spinoza', 'Tome, umas lentes escuras para quem acabou de sair da caverna. Ver é entender as causas do que nos afeta.'],
        ['', 'Glauco põe as lentes. A claridade incomoda bem menos.'],
        ['spinoza', 'E Deus, ou a Natureza, é tudo isso aqui. Você, a grama, o lago. Uma coisa só, de muitos jeitos.'],
      ],
      fx: ['flag:lente'],
    },
    ja: { l: [['spinoza', 'As lentes estão boas? Liberdade é isto: entender por que você enxerga como enxerga.']] },
  },

  laotse1: {
    inicio: {
      l: [
        ['laotse', 'O caminho que pode ser dito não é o Caminho eterno.'],
        ['glauco', 'Então como eu volto para a caverna?'],
        ['laotse', 'Como a água: pelo lado mais baixo. A água é mole e vence a pedra.'],
        ['laotse', 'O sábio age sem forçar. Wu wei. Se for convencer alguém lá embaixo, não empurre. Deixe a pessoa chegar.'],
      ],
      fx: ['flag:dicaLaotse'],
    },
  },

  confucio1: {
    inicio: {
      l: [
        ['confucio', 'Você saiu de casa e nem se despediu dos seus? Lá embaixo devem estar preocupados.'],
        ['glauco', 'Eles estão acorrentados. Não dá para se despedir de quem não vira o pescoço.'],
        ['confucio', 'Mais uma razão para voltar. Não faça aos outros o que não quer para si. Você ia querer ser esquecido no escuro?'],
      ],
    },
  },

  beauvoir1: {
    inicio: {
      l: [
        ['beauvoir', 'Li essa alegoria inteira. Todos os prisioneiros são homens, o libertador é homem, o filósofo é homem. Curioso, não?'],
        ['glauco', 'Tem a Dona Doxa.'],
        ['beauvoir', 'Que representa a opinião sem pensamento. Muito obrigada, Platão.'],
        ['beauvoir', 'Ninguém nasce prisioneiro: torna-se. O que parece natureza, quase sempre, é costume. E a sua liberdade depende da dos outros.'],
      ],
    },
  },

  schopenhauer1: {
    inicio: {
      l: [
        ['schopenhauer', 'Sol forte. Grama molhada. Passarinho gritando às seis da manhã.'],
        ['schopenhauer', 'A vida oscila como um pêndulo entre a dor e o tédio. Lá dentro era tédio. Aqui fora é dor. Bem-vindo.'],
        ['glauco', 'O senhor não gosta de nada?'],
        ['schopenhauer', 'Música. E o meu poodle. O nome dele é Atma, que quer dizer "alma do mundo". O resto é vontade cega querendo mais.'],
      ],
    },
  },

  bloqueio_volta: {
    inicio: {
      ramos: [{ se: 'forma:bem', ir: 'b' }, { ir: 'a' }],
      l: [],
    },
    a: { l: [['glauco', 'Voltar para a caverna agora? Mal comecei a enxergar. Primeiro preciso ver o sol.']] },
    b: { l: [['glauco', 'Voltar ou ficar? Antes, quero conversar com o Epicuro. Ele fica no jardim florido, ao sudeste.']] },
  },
};
