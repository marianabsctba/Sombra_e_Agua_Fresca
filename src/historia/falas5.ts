import type { Conversa, Escolha } from '../jogo/tipos';

// ATO 5: A VOLTA. No escuro de novo, sem enxergar, tentando convencer quem
// nunca virou o pescoço. Pergunta funciona. Sermão irrita. Deboche, mais ainda.

type Tom = 'pergunta' | 'sermao' | 'deboche';

/** Monta um debate: cada escolha tem um tom; só a pergunta convence. */
function debate(id: string, abertura: [string, string][], escolhas: [Tom, string, [string, string][]][], ja: string): Conversa {
  const esc: Escolha[] = escolhas.map(([tom, t]) => ({ t, ir: tom }));
  const conv: Conversa = {
    inicio: { ramos: [{ se: `flag:deb_${id}`, ir: 'ja' }, { ir: 'a' }], l: [] },
    a: { l: abertura, esc },
    ja: { l: [[id, ja]] },
  };
  for (const [tom, , resposta] of escolhas) {
    const fx = [`flag:deb_${id}`, 'flag:debates+1'];
    if (tom === 'pergunta') fx.push(`conv:${id}`);
    if (tom === 'sermao') fx.push('irrit+1');
    if (tom === 'deboche') fx.push('irrit+2');
    conv[tom] = { l: resposta, fx };
  }
  return conv;
}

export const FALAS5: Record<string, Conversa> = {
  entrada_volta: {
    inicio: {
      l: [
        ['', 'De volta ao fundo da caverna. Está escuro como nunca esteve. Seus olhos ainda estão lá fora, olhando o sol.'],
        ['glauco', 'Não enxergo nada. Antes eu enxergava tudo aqui. Agora tudo é borrão.'],
        ['doxa', 'Olha quem voltou! Dizem que subiu e voltou cego. Eu sempre disse que subir fazia mal.'],
        ['', '(Converse com os prisioneiros. Quem só recebe sermão se irrita. Quem é perguntado, às vezes, pensa.)'],
      ],
    },
  },

  doxa5: debate(
    'doxa',
    [['doxa', 'Lá fora? Lá fora não existe, meu filho. Se existisse, ia passar na SombraTV.']],
    [
      ['sermao', 'Existe sim! Tem sol, tem árvore, tem cavalo de verdade!', [['doxa', 'Cavalo de verdade? Que coisa mais sem fundamento. Vou falar para todo mundo que você está delirando.']]],
      ['pergunta', 'A senhora já viu tudo que existe passar na parede?', [
        ['doxa', 'Tudo? Bom... tudo, tudo, não.'],
        ['doxa', 'Ontem o vaso não passou. Será que o vaso continua existindo quando não passa? Ai. Nunca tinha pensado nisso.'],
        ['doxa', 'Isso é perigoso. Gostei. Vou falar para todo mundo.'],
      ]],
      ['deboche', 'A senhora nunca soube nada, Dona Doxa.', [['doxa', 'Grosso! Cego e grosso! Pode deixar que isso eu vou espalhar.']]],
    ],
    'Já estou espalhando. Não sei bem o quê, mas estou.',
  ),

  trasimaco5: debate(
    'trasimaco',
    [['trasimaco', 'O ex-campeão voltou! E agora perde de qualquer um na previsão de sombras. A justiça é a conveniência do mais forte, e você ficou fraco.']],
    [
      ['deboche', 'Seu título não vale nada, Trasímaco.', [['trasimaco', 'Fala isso para quem tem onze! Assembleia! Esse aí está ofendendo o campeão!']]],
      ['sermao', 'A justiça é uma Forma eterna, e você não sabe nada sobre ela!', [['trasimaco', 'Forma eterna? Você virou titereiro de palavra bonita. Pior que o Górgias.']]],
      ['pergunta', 'Se o mais forte se enganar sobre o que lhe convém, ser justo é obedecer ao erro dele?', [
        ['trasimaco', 'O mais forte não se engana!'],
        ['trasimaco', '...Às vezes se engana. Eu achava que o vaso era o coelho disfarçado. Igual a Doxa.'],
        ['trasimaco', 'Que horror. Fiquei com raiva e pensando ao mesmo tempo. Isso dói.'],
      ]],
    ],
    'Ainda estou bravo. Mas é uma raiva com dúvida dentro. Nova sensação.',
  ),

  critico5: debate(
    'critico',
    [['critico', 'Então lá fora é melhor que a SombraTV? Lá fora tem roteiro? Tem fotografia? Tem trilha?']],
    [
      ['pergunta', 'Se tudo na parede ganha duas estrelas, qual seria a de cinco?', [
        ['critico', 'Cinco estrelas? Nunca dei. Seria... uma sombra com profundidade. Com cor. Com cheiro.'],
        ['critico', 'Uma sombra que não fosse sombra. Espera. Você está dizendo que isso existe?'],
        ['critico', 'Preciso rever todas as minhas resenhas. Talvez a minha carreira.'],
      ]],
      ['sermao', 'Lá fora é real, então é perfeito. Ponto final.', [['critico', 'Realismo sem roteiro. Duas estrelas para a sua viagem.']]],
      ['deboche', 'Você só sabe criticar sombra.', [['critico', 'E você só sabe ser chato. Meia estrela.']]],
    ],
    'Estou escrevendo a primeira resenha com cinco estrelas da história. Sobre algo que nunca vi.',
  ),

  parmenides5: debate(
    'parmenides',
    [['parmenides', 'Você diz que saiu e voltou. Impossível. O movimento é ilusão. Você nunca saiu daqui.']],
    [
      ['deboche', 'Então por que o senhor fala tanto, se nada muda?', [['parmenides', 'Insolente! O ser é! E o seu respeito, pelo visto, não é.']]],
      ['pergunta', 'Se o ser é uno e eterno, ele é visível daqui de baixo ou só pela razão?', [
        ['parmenides', 'Pela razão, claro. Os sentidos enganam. As sombras são sentidos.'],
        ['parmenides', 'Então... a SombraTV engana. E o que a razão vê está além dela.'],
        ['parmenides', 'Hum. Acho que você e eu concordamos. Não se mexa, que eu não quero que isso mude.'],
      ]],
      ['sermao', 'O senhor está errado, eu andei e voltei, eu vi!', [['parmenides', 'Viu. Com os olhos. Os mesmos olhos que agora não enxergam nada. Belo argumento.']]],
    ],
    'Concordo com você. Imovelmente.',
  ),

  pirro5: debate(
    'pirro',
    [['pirro', 'Você diz que viu o sol. Talvez tenha visto. Talvez não. Por que eu acreditaria?']],
    [
      ['sermao', 'Porque eu estou dizendo! Eu estava lá!', [['pirro', 'Para cada testemunha há outra. A Doxa diz que você delira. Pesos iguais. Suspendo.']]],
      ['deboche', 'Com o senhor não dá para conversar.', [['pirro', 'Talvez dê. Talvez não. Mas agora estou incomodado, o que é péssimo para a ataraxia.']]],
      ['pergunta', 'Se nada é certo, a parede também não é. Por que o senhor confia mais nela que em mim?', [
        ['pirro', 'Hum. Eu não confio na parede. Eu só... não desconfio.'],
        ['pirro', 'Então, para ser coerente, tenho que duvidar dela também. E se eu duvido dela, posso virar o pescoço para checar.'],
        ['pirro', 'Isso não é acreditar em você. É duvidar melhor. Aceito.'],
      ]],
    ],
    'Continuo sem certeza. Mas agora duvido na direção certa.',
  ),

  zenao5: debate(
    'zenao',
    [['zenao', 'Você saiu? Impossível. Para chegar lá fora você teria que percorrer metade do caminho, e a metade da metade...']],
    [
      ['pergunta', 'E mesmo assim a Aquiles chegou no meu pé. Como ela fez isso?', [
        ['zenao', 'Ela... chegou? Aquiles! Volta aqui!'],
        ['zenao', 'Infinitas metades, e ela chegou. Talvez infinitos pedaços caibam num tempo finito. Que ideia escandalosa.'],
        ['zenao', 'Vou repensar tudo. Devagar. Metade de cada vez.'],
      ]],
      ['deboche', 'Sua tartaruga anda mais que o senhor.', [['zenao', 'Ofender a Aquiles não, hein. Ela é sensível.']]],
      ['sermao', 'O movimento existe e pronto, senhor Zenão.', [['zenao', '"E pronto" não é argumento. Eu tenho quarenta paradoxos. Você tem um "e pronto".']]],
    ],
    'Metade de mim já acredita em você. Agora falta a metade da metade.',
  ),

  marx5: {
    inicio: {
      ramos: [{ se: 'conv:marx', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['marx', 'Camarada! Você voltou! Eu disse: atrás do muro tem dono dos meios de produção de sombra!'],
        ['glauco', 'Tem. Um sindicato inteiro. O Górgias ainda me ofereceu emprego.'],
        ['marx', 'Típico. Não se trata só de interpretar a caverna, trata-se de transformá-la! Conte comigo na assembleia.'],
      ],
      fx: ['conv:marx'],
    },
    ja: { l: [['marx', 'Estou contando os votos. E escrevendo um livro gigante sobre isso. Três volumes, no mínimo.']] },
  },

  heraclito5: {
    inicio: {
      ramos: [{ se: 'conv:heraclito', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['heraclito', 'Você voltou diferente! Não é o mesmo Glauco que saiu! Eu sabia! Tudo flui!'],
        ['heraclito', '*chora de alegria* Pode contar com o meu voto. Votar também é mudança.'],
      ],
      fx: ['conv:heraclito'],
    },
    ja: { l: [['heraclito', 'Você continua mudando. Eu continuo chorando. Tudo certo.']] },
  },

  sartre5: {
    inicio: {
      l: [
        ['sartre', 'Você escolheu voltar. Ninguém te obrigou. Isso é bem existencial da sua parte.'],
        ['sartre', 'Agora eles vão ter que escolher também. E a maioria vai preferir a má-fé: fingir que não tinha escolha.'],
        ['sartre', 'A Simone mandou um recado, aliás: que você não esqueça das prisioneiras que ninguém conta nessa história.'],
      ],
    },
  },

  arendt5: {
    inicio: {
      ramos: [{ se: 'flag:arendt', ir: 'ja' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['arendt', 'Hannah Arendt. Vim acompanhar esta assembleia.'],
        ['arendt', 'O pior mal, muitas vezes, não vem de monstros. Vem de gente comum que simplesmente não pensa. Que só segue a parede.'],
        ['arendt', 'Pensar é conversar consigo mesmo. Vou pedir que cada um faça isso antes de votar. Vão me vaiar, mas vou pedir.'],
        ['', '(A sala fica um pouco menos irritada.)'],
      ],
      fx: ['flag:arendt', 'irrit-1'],
    },
    ja: { l: [['arendt', 'Política é o espaço onde aparecemos uns para os outros. Até numa caverna. Principalmente numa caverna.']] },
  },

  socrates5: {
    inicio: {
      l: [
        ['socrates', 'Está vendo? Ninguém agradece quem volta para incomodar.'],
        ['socrates', 'Comigo também foi assim. Me chamavam de mosca. Uma mosca que pica o cavalo preguiçoso que é a cidade.'],
        ['socrates', 'Pergunte, não ensine. E quando o Ânito aparecer, cuidado com o chá.'],
      ],
    },
  },

  anito5: {
    inicio: {
      l: [
        ['anito', 'Cidadãos da caverna! Sou Ânito. Organizo assembleias. Esta é sobre ESTE aí.'],
        ['anito', 'Ele voltou dizendo que a nossa SombraTV é falsa. Que existe um "lá fora". Ele confunde os jovens. Ele corrompe a juventude!'],
        ['plateia', 'Uuuuuuh!'],
        ['anito', 'Proponho uma solução tradicional e muito educada: um chazinho de cicuta. Mas antes, o acusado tem direito à defesa.'],
      ],
      esc: [
        { t: 'Eu não vim ensinar nada. Vim perguntar.', ir: 'perguntar' },
        { t: 'Eu vi o sol e vocês são todos uns ignorantes!', ir: 'cicuta' },
        { t: 'Tá bom, tá bom. A sombra é real. Me acorrenta de novo.', ir: 'sofa' },
      ],
    },
    perguntar: {
      l: [
        ['glauco', 'Só quero que cada um pergunte: o que é aquilo na parede? Quem faz? E o que tem atrás?'],
        ['anito', 'Muito bem. Votemos. Quem quer o chá levanta a mão.'],
        ['', '...ninguém consegue levantar a mão. Todos estão acorrentados.'],
        ['anito', 'Votemos de outro jeito. Quem quer o chá, grite.'],
      ],
      ir: 'apuracao',
    },
    apuracao: { l: [], ramos: [{ se: 'conv>=5&irrit<=3', ir: 'vitoria' }, { ir: 'cicuta' }] },
    vitoria: {
      l: [
        ['', 'Silêncio. Um silêncio enorme, de gente pensando pela primeira vez.'],
        ['doxa', 'Eu... quero ver o que tem atrás do muro. Pronto, falei. Vou espalhar isso também.'],
        ['trasimaco', 'Eu também. Mas só se eu puder ir na frente.'],
        ['marx', 'SOLTEM AS CORRENTES!'],
      ],
      fx: ['final:rei'],
    },
    cicuta: {
      l: [
        ['plateia', 'CHÁ! CHÁ! CHÁ!'],
        ['anito', 'A caverna decidiu. Não é nada pessoal. É só a maioria acorrentada.'],
      ],
      fx: ['final:cicuta'],
    },
    sofa: {
      l: [
        ['anito', 'Ora vejam. Arrependimento! A caverna perdoa quem desiste.'],
        ['doxa', 'Eu sabia que ele ia voltar ao normal. Eu sempre sei.'],
      ],
      fx: ['final:sofa'],
    },
  },

  bloqueio_assembleia: {
    inicio: { l: [['', 'Ainda há prisioneiros com quem conversar. A assembleia começa quando você tiver falado com pelo menos quatro deles.']] },
  },

  // ---------- final secreto: a caverna da caverna

  entrada_secreta: {
    inicio: {
      l: [
        ['', 'Atrás da rachadura do céu há... uma caverna. Maior. Com uma parede. E na parede passam sombras de árvores, lagos e filósofos.'],
        ['glauco', 'O lá fora era uma sombra também?!'],
      ],
    },
  },

  descartes6: {
    inicio: {
      l: [
        ['descartes', 'Eu avisei. Um gênio maligno pode ter feito tudo isso. O sol, o lago, a cadeira em si. Tudo.'],
        ['glauco', 'E agora? O que sobra?'],
        ['descartes', 'Sobra você duvidando. Se duvida, pensa. Se pensa, existe. Isso nenhuma caverna tira de você.'],
      ],
    },
  },

  bacon6: {
    inicio: {
      l: [
        ['bacon', 'Francis Bacon. Eu chamo isso de ídolos da caverna: cada pessoa tem a sua, feita dos próprios costumes, leituras e manias.'],
        ['bacon', 'Não tem saída definitiva. Tem método: observar, testar, desconfiar de si. E de vez em quando sair um pouco.'],
        ['bacon', 'Eu morri testando se a neve conservava um frango, dizem. Valeu a pena. Pela ciência.'],
      ],
    },
  },

  socrates6: {
    inicio: {
      l: [
        ['socrates', 'Ah, você achou a rachadura. Pouca gente acha.'],
        ['socrates', 'Talvez toda saída seja a entrada de uma caverna maior. Talvez filosofar seja isso: sair, sair de novo, e sair mais uma vez.'],
        ['glauco', 'Isso não acaba nunca?'],
        ['socrates', 'Espero que não. Seria tão chato.'],
      ],
      esc: [{ t: 'Então vamos para a próxima.', fx: ['final:cavernas'] }],
    },
  },
};
