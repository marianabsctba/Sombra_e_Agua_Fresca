import type { Conversa } from '../jogo/tipos';

// ATO 1: O FUNDO. Glauco acorrentado, a SombraTV e o campeonato.

export const FALAS1: Record<string, Conversa> = {
  entrada_fundo: {
    inicio: {
      l: [
        ['', 'Fundo da caverna. Sempre foi assim. Sempre vai ser assim. Ou pelo menos é o que dizem na parede.'],
        ['glauco', 'Meu nome é Glauco. Nasci acorrentado, igual a todo mundo aqui. A minha corrente é de dois metros: primeira classe.'],
        ['glauco', 'Na nossa frente tem uma parede. Na parede passam sombras. É a SombraTV, a única programação que existe.'],
        ['glauco', 'Hoje é final do Campeonato de Previsão de Sombras. Quem adivinha a próxima sombra ganha honra, glória e o direito de se achar.'],
      ],
      ir: 'ajuda',
    },
    ajuda: {
      l: [],
      ramos: [{ se: 'flag:toque', ir: 'toque' }, { ir: 'teclado' }],
    },
    teclado: {
      l: [['', '(Setas ou WASD para se arrastar. Enter, Espaço ou E para conversar. Tab abre o Álbum de Filósofos. M liga e desliga o som.)']],
    },
    toque: {
      l: [['', '(Use as setas na tela para se arrastar e Ok para conversar, ou toque na tela. O botão Álbum abre o Álbum de Filósofos.)']],
    },
  },

  limite_corrente: {
    inicio: { l: [['glauco', 'A corrente estica até aqui. Dois metros. Luxo é isso.']] },
  },

  socrates1: {
    inicio: {
      ramos: [
        { se: 'flag:solto', ir: 'solto' },
        { se: 'flag:campeao', ir: 'campeao' },
        { se: 'flag:viuSocrates', ir: 'denovo' },
        { ir: 'primeira' },
      ],
      l: [],
    },
    primeira: {
      l: [
        ['socrates', 'Glauco! Que bom te ver. Posso te fazer uma perguntinha?'],
        ['glauco', 'Quem é você? E por que você não está acorrentado?'],
        ['socrates', 'Ótimas perguntas. Responda a minha primeiro: o que é aquilo na parede?'],
      ],
      esc: [
        { t: 'Um coelho.', ir: 'coelho' },
        { t: 'A SombraTV, ué.', ir: 'tv' },
        { t: 'Não faço ideia.', ir: 'naosei' },
      ],
      fx: ['flag:viuSocrates'],
    },
    coelho: {
      l: [
        ['socrates', 'Um coelho! E me diga: os coelhos que você conhece são achatados, cor de nada e sem cheiro?'],
        ['glauco', 'Todos os coelhos que eu conheço são assim.'],
        ['socrates', 'Quantos coelhos você conhece?'],
        ['glauco', 'Todos os que passaram na parede.'],
        ['socrates', 'Interessante. Muito interessante. Vou anotar. Não, eu não escrevo nada. Vou lembrar.'],
      ],
      ir: 'fim',
    },
    tv: {
      l: [
        ['socrates', 'E quem faz a SombraTV?'],
        ['glauco', 'Ninguém faz. Ela sempre esteve aí. Como a parede. E a Dona Doxa.'],
        ['socrates', 'Ah, a Dona Doxa. Ela também tem uma opinião sobre isso, aposto.'],
      ],
      ir: 'fim',
    },
    naosei: {
      l: [
        ['socrates', 'Você não sabe! Que maravilha! Há anos procuro alguém aqui que admita isso.'],
        ['glauco', 'É bom não saber?'],
        ['socrates', 'É o começo. O meio é pior. O fim, ninguém sabe.'],
      ],
      ir: 'fim',
    },
    fim: {
      l: [
        ['socrates', 'Faz assim: ganhe o campeonato do Trasímaco. Depois a gente conversa sobre o prêmio.'],
        ['socrates', 'Ele fica mais à direita, de louros na cabeça. Não tem como errar. Ele não deixa.'],
      ],
    },
    denovo: {
      l: [['socrates', 'Ainda não ganhou o campeonato? O Trasímaco está à direita. Vai lá, eu espero. Eu sempre espero. Tenho tempo, não trabalho.']],
    },
    campeao: {
      l: [
        ['socrates', 'Campeão! Parabéns. E então: o que você ganhou?'],
      ],
      esc: [
        { t: 'Honra!', ir: 'honra' },
        { t: 'O título de Doutor em Coelho de Mão.', ir: 'honra' },
        { t: '...nada?', ir: 'nada' },
      ],
    },
    honra: {
      l: [
        ['socrates', 'E a honra serve para quê, aqui no escuro?'],
        ['glauco', 'Para eu ser respeitado pelos outros prisioneiros.'],
        ['socrates', 'Que também não sabem o que é um coelho.'],
        ['glauco', '...'],
        ['socrates', 'Pense de novo. O que você ganhou?'],
      ],
      esc: [{ t: '...nada.', ir: 'nada' }],
    },
    nada: {
      l: [
        ['socrates', 'Agora sim estamos começando.'],
        ['socrates', 'Segura aí que vou soltar sua corrente. Não pergunte como. Na verdade, pergunte, mas eu vou responder com outra pergunta.'],
        ['', '*CLANC*'],
        ['socrates', 'Agora vire o pescoço. Para trás. Não, mais para trás. Isso.'],
        ['glauco', 'AI! Dói!'],
        ['socrates', 'A verdade costuma dar torcicolo. Tem um vão no muro, lá embaixo, à direita. Vai olhar de onde vêm as sombras.'],
      ],
      fx: ['flag:solto'],
    },
    solto: {
      l: [['socrates', 'O vão no muro fica embaixo, à direita. Leve sua dúvida. Ela pesa menos que a corrente.']],
    },
  },

  doxa1: {
    inicio: {
      ramos: [{ se: 'flag:solto', ir: 'solto' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['doxa', 'Glauquinho! Você viu que a sombra do vaso estava mais gordinha hoje? Eu tenho certeza de que é o coelho disfarçado.'],
      ],
      esc: [
        { t: 'Como a senhora sabe?', ir: 'como' },
        { t: 'Faz sentido, Dona Doxa.', ir: 'sentido' },
      ],
    },
    como: {
      l: [
        ['doxa', 'Todo mundo sabe! Eu mesma falei para todo mundo.'],
        ['glauco', 'Mas e se não for?'],
        ['doxa', 'Se não for, é porque mudaram. E se mudaram, eu já sabia. Opinião minha não erra, só se atualiza.'],
      ],
    },
    sentido: {
      l: [['doxa', 'Faz, né? Gente inteligente concorda comigo. Gente burra também, mas aí é sorte.']],
    },
    solto: {
      l: [
        ['doxa', 'Você está... em pé? Isso é proibido? Não sei, mas eu acho que é. Vou falar que é.'],
      ],
    },
  },

  sartre1: {
    inicio: {
      l: [
        ['sartre', 'Divido corrente com a Dona Doxa há quarenta anos. O inferno são os outros.'],
        ['glauco', 'O senhor não parece daqui. Que roupa é essa?'],
        ['sartre', 'Não existe "daqui". A existência precede a essência. Primeiro eu existo, depois decido o que sou.'],
        ['glauco', 'E o senhor decidiu ser acorrentado?'],
        ['sartre', 'Estamos condenados a ser livres, garoto. Até para escolher como olhar a parede. Eu escolho olhar com desdém.'],
      ],
    },
  },

  critico1: {
    inicio: {
      l: [
        ['critico', 'A sombra de cavalo de hoje: duas estrelas. Faltou profundidade.'],
        ['glauco', 'Toda sombra é plana.'],
        ['critico', 'Por isso dou duas estrelas para todas. Coerência é tudo nesta profissão.'],
      ],
    },
  },

  parmenides1: {
    inicio: {
      l: [
        ['parmenides', 'Não se mexa, jovem. O movimento é ilusão.'],
        ['glauco', 'Mas as sombras passam o tempo todo.'],
        ['parmenides', 'Passam nada. O ser é, o não ser não é. Tudo é um, imóvel e eterno. Você é que acha que tem coelho indo e vindo.'],
        ['glauco', 'O senhor nunca reclamou da corrente?'],
        ['parmenides', 'Para quê? Mesmo sem ela eu não ia a lugar nenhum. Não existe lugar nenhum.'],
      ],
    },
  },

  zenao1: {
    inicio: {
      l: [
        ['zenao', 'Estou indo até a parede. Já percorri metade do caminho.'],
        ['glauco', 'O senhor está sentado.'],
        ['zenao', 'Agora falta a metade da metade. Depois a metade da metade da metade. Faz dez anos.'],
        ['zenao', 'Esta é a minha tartaruga. O nome dela é Aquiles. Ela também não chega.'],
        ['glauco', 'Ela está andando para lá agora mesmo.'],
        ['zenao', 'Ilusão. Pergunte ao Parmênides. Ele é meu professor. Ele também não se mexe.'],
      ],
    },
  },

  heraclito1: {
    inicio: {
      l: [
        ['heraclito', 'Nunca se assiste à mesma sombra duas vezes.'],
        ['glauco', 'Mas é sempre o mesmo coelho. Todo dia, às três.'],
        ['heraclito', 'Nem o coelho é o mesmo, nem você é o mesmo! Tudo flui! Panta rhei!'],
        ['heraclito', '*soluça* Desculpa. Me chamam de "o filósofo que chora". Fico emocionado com mudança.'],
      ],
    },
  },

  pirro1: {
    inicio: {
      l: [
        ['pirro', 'Olá. Estou acorrentado? Talvez. Talvez não. Suspendo o juízo.'],
        ['glauco', 'O senhor está, sim. Dá pra ver a corrente.'],
        ['pirro', 'Dá pra ver. Mas ver é prova? Para cada argumento existe outro do mesmo peso. Então fico quietinho.'],
        ['pirro', 'Por isso sou o prisioneiro mais tranquilo da caverna. Ataraxia. Recomendo.'],
      ],
    },
  },

  marx1: {
    inicio: {
      l: [
        ['marx', 'Prisioneiros da caverna, uni-vos! Vocês não têm nada a perder a não ser as correntes!'],
        ['glauco', 'O senhor fala isso para quem?'],
        ['marx', 'Para todos! Ninguém se mexe. Isso é a ideologia: fazer a corrente parecer natural.'],
        ['marx', 'Alguém atrás do muro é dono dos meios de produção de sombra. Anote o que eu digo. Ou melhor: não anote, que eles leem.'],
      ],
      fx: ['flag:marx'],
    },
  },

  trasimaco1: {
    inicio: {
      ramos: [
        { se: 'flag:campeao', ir: 'perdeu' },
        { ir: 'a' },
      ],
      l: [],
    },
    a: {
      l: [
        ['trasimaco', 'Ora, ora. O Glauco. Veio assistir o campeão?'],
        ['trasimaco', 'Invicto há onze temporadas. Justiça, meu caro, é a conveniência do mais forte. E o mais forte no ranking sou eu.'],
      ],
      esc: [
        { t: 'Quero disputar a final.', ir: 'final' },
        { t: 'Só vim dar oi.' },
      ],
    },
    final: {
      l: [
        ['trasimaco', 'HAHAHA. Disputar comigo? Tudo bem. A regra é simples: as sombras passam em sequência e você adivinha a próxima.'],
        ['trasimaco', 'Quatro rodadas. Errou, eu rio e você tenta de novo. Eu adoro rir.'],
      ],
      fx: ['mini:sombras'],
    },
    perdeu: {
      l: [
        ['trasimaco', 'Justiça é a conveniência do mais forte. Hoje o mais forte é você. Então hoje está tudo injusto.'],
        ['trasimaco', 'Pode ir, campeão. Aproveita a honra. Ela não enche barriga, mas brilha.'],
      ],
    },
  },

  campeonato_fim: {
    inicio: {
      l: [
        ['', 'A caverna inteira aplaude. Bom, aplaude quem tem as mãos livres, então ninguém.'],
        ['trasimaco', 'Impossível! Ganhou de mim! Você agora é... Doutor em Coelho de Mão.'],
        ['glauco', 'Eu ganhei! Eu ganhei... o quê, exatamente?'],
        ['', '(Sócrates parece querer saber a mesma coisa.)'],
      ],
    },
  },
};
