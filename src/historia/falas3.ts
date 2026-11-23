import type { Conversa } from '../jogo/tipos';

// ATO 3: A SUBIDA ÍNGREME. A Linha Dividida em quatro andares, sem elevador.

export const FALAS3: Record<string, Conversa> = {
  entrada_subida: {
    inicio: {
      l: [
        ['', 'Uma subida íngreme e escura. Alguém pintou na rocha, com letra caprichada:'],
        ['', '"LINHA DIVIDIDA. QUATRO ANDARES: IMAGINAÇÃO, CRENÇA, RACIOCÍNIO, INTELIGÊNCIA. SEM ELEVADOR."'],
        ['glauco', 'Por que tudo que vale a pena é escada?'],
      ],
    },
  },

  placa1: {
    inicio: { l: [['', 'ANDAR 1: IMAGINAÇÃO. Aqui só há imagens e reflexos. Nem tudo que parece chão é chão.']] },
  },
  placa2: {
    inicio: { l: [['', 'ANDAR 2: CRENÇA. Agora as coisas são coisas. Você acredita nelas porque as vê. Cuidado com o que você não vê.']] },
  },
  placa3: {
    inicio: { l: [['', 'ANDAR 3: RACIOCÍNIO. Aqui se pensa com hipóteses e números. Matemática obrigatória. Não adianta chorar.']] },
  },
  placa4: {
    inicio: { l: [['', 'ANDAR 4: INTELIGÊNCIA. Aqui não se passa respondendo. Passa-se perguntando.']] },
  },

  poca: {
    inicio: {
      ramos: [{ se: 'flag:reflexo', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['', 'Uma poça d\'água parada. No reflexo aparece o andar inteiro, de ponta-cabeça.'],
        ['', 'Curioso: algumas pedras do chão não aparecem no reflexo. Como se nunca tivessem existido.'],
        ['glauco', 'Agora dá para ver quais pedras são só imaginação. Estão rachadas!'],
      ],
      fx: ['flag:reflexo'],
    },
    ja: {
      l: [['', 'O reflexo continua lá, mostrando o chão de verdade. Água é mais honesta que olho.']] },
  },

  queda: {
    inicio: {
      l: [['', 'O chão era só imaginação. Glauco cai de bunda no começo do andar.']],
      fx: ['teleporte:10,43'],
    },
  },

  diogenes1: {
    inicio: {
      l: [
        ['diogenes', 'Sai da frente do meu sol.'],
        ['glauco', 'Que sol? Estamos numa caverna.'],
        ['diogenes', 'Exatamente. Por isso a lanterna. Procuro um ser humano. Você é um?'],
      ],
      esc: [
        { t: 'Sou, ora!', ir: 'sou' },
        { t: 'Não sei mais.', ir: 'naosei' },
      ],
    },
    sou: {
      l: [
        ['diogenes', 'Prova. O Platão diz que homem é "bípede sem penas". Eu depenei um galo e joguei na aula dele: "eis o homem de Platão".'],
        ['diogenes', 'Ele teve que acrescentar "de unhas largas" na definição. HAHAHA. Que vergonha alheia.'],
      ],
      ir: 'dica',
    },
    naosei: {
      l: [['diogenes', 'Resposta honesta. Raríssima. Você está mais perto de ser humano que o Alexandre, o Grande.']],
      ir: 'dica',
    },
    dica: {
      l: [
        ['diogenes', 'Uma dica, de graça, porque eu não aceito dinheiro: o chão que mente não aparece na água. Olha a poça.'],
        ['diogenes', 'E agora sai da frente do meu sol imaginário.'],
      ],
    },
  },

  hiparquia1: {
    inicio: {
      l: [
        ['hiparquia', 'Ele fala muito. Eu, Hipárquia, subo.'],
        ['hiparquia', 'Larguei a casa rica, o tear e o casamento arrumado para viver de filosofia na rua. Me disseram que lugar de mulher era no tear.'],
        ['hiparquia', 'Respondi que não me arrependo do tempo que gastei com a minha própria educação. Aliás, você está gastando o seu parado aí.'],
      ],
    },
  },

  tales1: {
    inicio: {
      l: [
        ['tales', 'Cuidado com o poço!'],
        ['glauco', 'O senhor está dentro do poço?'],
        ['tales', 'Quase. Estava olhando as estrelas e caí. Uma moça trácia riu de mim: queria ver o céu e não via o que tinha nos pés.'],
        ['tales', 'Ela tinha razão, mas eu também. Tudo é água. Inclusive aqui embaixo. Principalmente aqui embaixo.'],
        ['tales', 'Ah, e eu medi uma pirâmide pela sombra dela, sabia? Sombra também serve para alguma coisa, se você usar a cabeça.'],
      ],
    },
  },

  camus1: {
    inicio: {
      l: [
        ['camus', 'Olha lá o Sísifo. Empurra a pedra morro acima, ela rola de volta. Para sempre.'],
        ['glauco', 'Que coisa horrível.'],
        ['camus', 'É absurdo. O mundo não responde quando a gente pede sentido. Mas a gente não desiste. A gente se revolta e vive mesmo assim.'],
        ['camus', 'É preciso imaginar Sísifo feliz. Eu imagino. Torço por ele toda subida. Fui goleiro, sei o que é não poder sair do lugar.'],
      ],
    },
  },

  sisifo1: {
    inicio: {
      l: [
        ['sisifo', 'De novo. E de novo. E de novo.'],
        ['sisifo', 'Sabe o que é engraçado? Eu já nem odeio a pedra. A gente se conhece.'],
      ],
      esc: [
        { t: 'Quer ajuda?', ir: 'ajuda' },
        { t: 'Força, Sísifo!', ir: 'forca' },
      ],
    },
    ajuda: {
      l: [['sisifo', 'Ajuda? E tirar o sentido da minha vida? O Camus me mata. Sai daqui, vai subir a sua.']],
    },
    forca: {
      l: [['sisifo', 'Valeu. A subida de hoje é a melhor de todas. Igual à de ontem.']],
    },
  },

  kierkegaard1: {
    inicio: {
      ramos: [{ se: 'flag:salto', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['kierkegaard', 'Do outro lado deste abismo está o andar do Raciocínio. Não tem ponte. Não tem prova. Só salto.'],
        ['glauco', 'E se eu cair?'],
        ['kierkegaard', 'Essa sensação no estômago se chama angústia. É a vertigem da liberdade. Ela é sua, aproveite.'],
        ['kierkegaard', 'Ninguém pode pular por você. Nem explicar o salto antes. Por isso é salto.'],
      ],
      esc: [
        { t: 'Pular.', ir: 'pula' },
        { t: 'Pensar mais um pouco.', ir: 'pensa' },
      ],
    },
    pensa: {
      l: [['kierkegaard', 'Pense. Eu passei a vida pensando na beira das coisas. Ou isto, ou aquilo. Não tenha pressa. Tenha angústia.']],
    },
    pula: {
      l: [
        ['', 'Glauco fecha os olhos e pula no escuro.'],
        ['', '...'],
        ['', 'E cai em pé do outro lado. Com uma dignidade razoável.'],
        ['kierkegaard', 'Viu? Não dava para provar. Dava para pular.'],
      ],
      fx: ['flag:salto', 'teleporte:10,18'],
    },
    ja: {
      l: [['kierkegaard', 'Já pulou. Agora não adianta pensar se devia. Quer dizer, adianta. Mas não muda nada. Angustiante, né?']] },
  },

  descartes1: {
    inicio: {
      l: [
        ['descartes', 'Será que esta escada existe? Será que você existe? E se um gênio maligno estiver enganando a gente sobre tudo?'],
        ['glauco', 'Eu existo. Eu acho.'],
        ['descartes', 'Acha? Então pensa. Se pensa, existe. Pronto, resolvi você. Penso, logo existo.'],
        ['descartes', 'Agora falta resolver a escada. E o resto do universo. Estou subindo por precaução, enquanto duvido.'],
      ],
    },
  },

  pitagoras1: {
    inicio: {
      ramos: [{ se: 'flag:pitagoras', ir: 'aberta' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['pitagoras', 'Alto! Esta é a Porta da Razão. Aqui tudo é número. Para passar, três perguntas.'],
        ['pitagoras', 'Primeira: quanto dá a soma dos ângulos internos de um triângulo?'],
      ],
      esc: [
        { t: '180 graus.', ir: 'p2' },
        { t: '360 graus.', ir: 'erro' },
        { t: 'Depende do triângulo.', ir: 'erro' },
      ],
    },
    p2: {
      l: [
        ['pitagoras', 'Certo! Segunda: um triângulo retângulo tem catetos 3 e 4. Quanto mede a hipotenusa?'],
      ],
      esc: [
        { t: '7.', ir: 'erro' },
        { t: '5.', ir: 'p3' },
        { t: 'Hipo o quê?', ir: 'erro' },
      ],
    },
    p3: {
      l: [
        ['pitagoras', 'Exato! Três ao quadrado mais quatro ao quadrado, vinte e cinco. Raiz, cinco. Lindo. Música para os ouvidos.'],
        ['pitagoras', 'Terceira e mais importante: você comeu fava hoje?'],
      ],
      esc: [
        { t: 'Não!', ir: 'certo' },
        { t: 'Um pouquinho, no almoço.', ir: 'fava' },
      ],
    },
    fava: {
      l: [['pitagoras', 'FAVA?! Na minha comunidade fava é proibida. Volte para o começo e reflita sobre suas escolhas alimentares.']],
      ir: 'a',
    },
    erro: {
      l: [['pitagoras', 'Errado. O número não perdoa. Recomeçando, que a harmonia exige.']],
      ir: 'a',
    },
    certo: {
      l: [
        ['pitagoras', 'Perfeito! Tudo é número, e o seu número hoje é passar.'],
        ['', 'A Porta da Razão se abre com um acorde em quinta justa.'],
      ],
      fx: ['flag:pitagoras'],
    },
    aberta: {
      l: [['pitagoras', 'Pode passar. E se encontrar meu teorema por aí, ele é meu. Os babilônios que me desculpem.']] },
  },

  socrates3: {
    inicio: {
      ramos: [{ se: 'flag:aporia', ir: 'aberta' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['socrates', 'Chegou! Esta é a porta do último andar. Ela abre com uma única coisa. Vamos ver se você tem.'],
        ['socrates', 'Me diga, Glauco: o que é a justiça?'],
      ],
      esc: [
        { t: 'Dar a cada um o que lhe é devido.', ir: 'r1' },
        { t: 'A conveniência do mais forte.', ir: 'r2' },
        { t: 'Ser campeão de sombras, como eu.', ir: 'r3' },
      ],
    },
    r1: {
      l: [
        ['socrates', 'Bonito! Então, se um amigo me empresta uma espada e depois enlouquece e pede de volta, eu devo devolver?'],
        ['glauco', 'Bem... não. Ele ia machucar alguém.'],
        ['socrates', 'Então nem sempre é justo dar o que é devido. Tente outra.'],
      ],
      ir: 'denovo',
    },
    r2: {
      l: [
        ['socrates', 'Ah, a do Trasímaco! E o mais forte nunca erra sobre o que lhe convém?'],
        ['glauco', 'Às vezes erra.'],
        ['socrates', 'Então às vezes seria "justo" fazer o que prejudica o próprio forte. Estranho, não? Tente outra.'],
      ],
      ir: 'denovo',
    },
    r3: {
      l: [
        ['socrates', 'E o Trasímaco, que foi campeão onze vezes, era justo?'],
        ['glauco', 'Ele era insuportável.'],
        ['socrates', 'Então ser campeão não é ser justo. Tente outra.'],
      ],
      ir: 'denovo',
    },
    denovo: {
      l: [['socrates', 'E então? O que é a justiça?']],
      esc: [
        { t: 'Dar a cada um o que lhe é devido.', ir: 'r1' },
        { t: 'A conveniência do mais forte.', ir: 'r2' },
        { t: 'Ser campeão de sombras, como eu.', ir: 'r3' },
        { t: 'Eu... não sei.', ir: 'aporia' },
      ],
    },
    aporia: {
      l: [
        ['socrates', 'AH! Finalmente! Isso se chama aporia: o beco sem saída onde a gente descobre que não sabia o que achava que sabia.'],
        ['socrates', 'Só sei que nada sei. É essa a chave. Ela não abre a resposta, abre a pergunta.'],
        ['', 'A porta se abre. Silenciosamente. Do jeito que portas sábias abrem.'],
      ],
      fx: ['flag:aporia'],
    },
    aberta: {
      l: [['socrates', 'Lá em cima tem um homem de terno cinza. Ele não fala muito. Quando fala, depois desmente.']] },
  },

  kant1: {
    inicio: {
      l: [
        ['kant', 'Ah, esta porta? É a Porta da Coisa em Si. Ela nunca abre.'],
        ['glauco', 'E para que serve uma porta que nunca abre?'],
        ['kant', 'Para lembrar que só conhecemos as coisas como aparecem para nós. Os fenômenos. A coisa em si fica do outro lado. Sempre.'],
        ['kant', 'Agora com licença: são três e meia. Hora da minha caminhada. A cidade inteira acerta o relógio por mim.'],
        ['kant', 'Ah, e antes de passar pela outra porta, pergunte: e se todo mundo fizesse isso? Se der certo para todos, pode ir. Imperativo categórico.'],
      ],
    },
  },

  portakant: {
    inicio: { l: [['', 'PORTA DA COISA EM SI. Você vê a porta como ela aparece para você. Como ela é de verdade, nunca vai saber. Ela não abre.']] },
  },

  wittgenstein1: {
    inicio: {
      ramos: [{ se: 'flag:escada', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['wittgenstein', 'Você subiu pela escada.'],
        ['wittgenstein', 'Agora, quem entendeu tudo, joga a escada fora depois de ter subido por ela.'],
        ['glauco', 'Mas e se eu precisar voltar?'],
        ['wittgenstein', '...'],
      ],
      esc: [
        { t: '...', ir: 'silencio' },
        { t: 'O senhor não vai responder?', ir: 'silencio' },
      ],
    },
    silencio: {
      l: [
        ['wittgenstein', 'Sobre aquilo de que não se pode falar, deve-se calar.'],
        ['', 'Ele dá um passo para o lado. A saída está livre. Tem luz lá fora. Muita luz.'],
        ['wittgenstein', 'Ah, e depois eu mudei de ideia sobre quase tudo isso. Mas vai lá.'],
      ],
      fx: ['flag:escada'],
    },
    ja: {
      l: [['wittgenstein', '...']] },
  },

  bloqueio_saida: {
    inicio: { l: [['', 'Um homem de terno cinza está diante da saída e olha para você em silêncio. Parece querer dizer alguma coisa. Ou não dizer.']] },
  },
};
