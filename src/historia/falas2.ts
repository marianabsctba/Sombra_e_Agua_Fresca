import type { Conversa } from '../jogo/tipos';

// ATO 2: O FOGO E OS TITEREIROS. Quem faz as sombras e quanto ganha para isso.

export const FALAS2: Record<string, Conversa> = {
  entrada_fogo: {
    inicio: {
      l: [
        ['', 'Atrás do muro há um corredor quente. Uma fogueira enorme. E gente. Muita gente segurando bonecos de madeira acima do muro.'],
        ['glauco', 'Então o coelho... é um boneco? O cavalo é um boneco? A Dona Doxa é um boneco?'],
        ['', 'A Dona Doxa, infelizmente, é real.'],
        ['glauco', 'Toda a minha vida foi pau de madeira na frente de uma fogueira.'],
      ],
    },
  },

  socrates2: {
    inicio: {
      ramos: [{ se: 'flag:recusou', ir: 'depois' }, { ir: 'a' }],
      l: [],
    },
    a: {
      l: [
        ['socrates', 'E então? As sombras eram mais reais que os bonecos, ou os bonecos mais reais que as sombras?'],
        ['glauco', 'Os bonecos, claro.'],
        ['socrates', 'E os bonecos são cópia de quê?'],
        ['glauco', '...de coelhos. De verdade. Que eu nunca vi.'],
        ['socrates', 'Pois é. A fogueira ilumina, mas não é o sol. Converse com o Górgias, o chefe daqui. Ele vai te oferecer alguma coisa. Ele sempre oferece.'],
      ],
    },
    depois: {
      l: [
        ['socrates', 'Você recusou o emprego. O Górgias ficou ofendido, o que para um sofista é só mais um argumento.'],
        ['socrates', 'A subida fica à direita. É escura, íngreme e ninguém volta igual. Boa sorte. Eu vou na frente. Ou atrás. Depende de como você olha.'],
      ],
    },
  },

  gorgias1: {
    inicio: {
      ramos: [
        { se: 'flag:recusou', ir: 'recusado' },
        { se: 'flag:turno', ir: 'proposta' },
        { ir: 'a' },
      ],
      l: [],
    },
    a: {
      l: [
        ['gorgias', 'Bem-vindo ao Sindicato dos Titereiros! Sou Górgias, presidente, tesoureiro e orador oficial.'],
        ['gorgias', 'Antes de tudo, nossa missão: nada existe. Se existisse, não daria para conhecer. Se desse para conhecer, não daria para explicar.'],
        ['glauco', 'Então o que vocês fazem aqui?'],
        ['gorgias', 'Explicamos. Muito bem, por sinal. Com retórica. E cobramos caro.'],
        ['gorgias', 'Faz um turno de teste? A pauta de hoje está pesada e o Byung-Chul já está no limite.'],
      ],
      esc: [
        { t: 'Bora operar boneco.', ir: 'turno' },
        { t: 'Ainda não.' },
      ],
    },
    turno: {
      l: [
        ['gorgias', 'Ótimo! Eu grito o que a plateia quer, você levanta o boneco certo. Aperte 1, 2, 3 ou 4, ou toque no boneco.'],
        ['gorgias', 'Se a plateia pedir uma coisa que não tem boneco... bota qualquer um. Eles não sabem a diferença.'],
      ],
      fx: ['mini:titereiro'],
    },
    proposta: {
      l: [
        ['gorgias', 'Belo turno! A audiência adorou. Ninguém percebeu nada, que é o maior elogio do ramo.'],
        ['gorgias', 'Tenho uma proposta. Salário bom, vale-refeição, fogueira com ar-condicionado e plano de carreira até Boneco Sênior.'],
        ['gorgias', 'Assina aqui. Bom, assinar não existe, mas se existisse...'],
      ],
      esc: [
        { t: 'Aceito. Fogueira com ar-condicionado!', ir: 'aceitou' },
        { t: 'Não. Quero ver de onde vem a luz de verdade.', ir: 'recusa' },
        { t: 'Posso pensar?', ir: 'pensar' },
      ],
    },
    pensar: {
      l: [['gorgias', 'Pensar? Pensar é com o pessoal da subida. Aqui a gente fala. Mas fique à vontade, a vaga não existe mesmo.']],
    },
    aceitou: {
      l: [
        ['gorgias', 'Excelente escolha! Seja bem-vindo à família.'],
        ['', 'Glauco recebe um crachá, um boneco de coelho e uma meta.'],
      ],
      fx: ['final:titereiro'],
    },
    recusa: {
      l: [
        ['gorgias', 'Ah, a luz. Todo mundo quer a luz. A luz não paga boleto, hein.'],
        ['gorgias', 'Vai lá. Sobe. Quando voltar cego e sem emprego, a gente conversa.'],
      ],
      fx: ['flag:recusou'],
    },
    recusado: {
      l: [['gorgias', 'Ainda aqui? A subida é à direita. Eu não disse nada. Não existe dizer.']],
    },
  },

  titereiro_fim: {
    inicio: {
      ramos: [{ se: 'flag:audiencia>=6', ir: 'bem' }, { ir: 'mal' }],
      l: [],
    },
    bem: {
      l: [['gorgias', 'Sensacional! A plateia ficou hipnotizada. Vem falar comigo, tenho uma proposta.']],
    },
    mal: {
      l: [['gorgias', 'Foi meio caótico, mas sabe o que é bonito? Ninguém percebeu. Vem falar comigo, tenho uma proposta.']],
    },
  },

  protagoras1: {
    inicio: {
      l: [
        ['protagoras', 'Protágoras, do RH. Eu meço tudo. Esta sombra aqui mede um metro. Para mim.'],
        ['protagoras', 'E para você? Quanto mede?'],
      ],
      esc: [
        { t: 'Um metro também.', ir: 'um' },
        { t: 'Uns dois metros.', ir: 'dois' },
      ],
    },
    um: {
      l: [['protagoras', 'Viu? Estamos certos. O homem é a medida de todas as coisas. Cada um com a sua fita métrica.']],
    },
    dois: {
      l: [['protagoras', 'Viu? Estamos certos os dois! O homem é a medida de todas as coisas. Cada um com a sua fita métrica. Isso aqui é RH, ninguém erra.']],
    },
  },

  maquiavel1: {
    inicio: {
      l: [
        ['maquiavel', 'Consultoria de imagem, prazer. Na caverna é melhor ser temido do que amado.'],
        ['glauco', 'E se der para ser os dois?'],
        ['maquiavel', 'Raramente dá. Mas o melhor mesmo é ser sombra. Sombra não envelhece, não dá entrevista e não pode ser cobrada.'],
        ['maquiavel', 'Os fins justificam os meios. Eu nunca disse exatamente isso, aliás. Mas pegou bem, então deixei.'],
      ],
    },
  },

  debord1: {
    inicio: {
      l: [
        ['debord', 'Olha para eles. Ninguém se olha. Todo mundo olha a parede.'],
        ['debord', 'O espetáculo não é um conjunto de imagens. É uma relação social entre pessoas, mediada por imagens.'],
        ['glauco', 'O senhor trabalha aqui?'],
        ['debord', 'Eu critico a SombraTV ao vivo, na própria SombraTV. Dá a maior audiência. Isso me deprime profundamente.'],
      ],
    },
  },

  baudrillard1: {
    inicio: {
      l: [
        ['baudrillard', 'Estou fazendo a sombra de um boneco que imita a sombra de um coelho que imita um boneco.'],
        ['glauco', 'E onde está o coelho original?'],
        ['baudrillard', 'Original? Nunca existiu. Hoje a cópia não remete a nada. É o simulacro. Hiper-real: mais real que o real.'],
        ['baudrillard', 'Se um coelho de verdade passasse na parede, a plateia ia achar falso.'],
      ],
    },
  },

  foucault1: {
    inicio: {
      l: [
        ['foucault', 'Você sabe que está sendo observado?'],
        ['glauco', 'Agora eu sei.'],
        ['foucault', 'Não sabe. Esse é o ponto. Daqui de cima eu vejo todos. Eles nunca sabem se eu estou olhando.'],
        ['foucault', 'Por isso se comportam sozinhos. Nem precisa de corrente, na verdade. A corrente é quase decorativa.'],
        ['glauco', 'E o senhor está olhando agora?'],
        ['foucault', 'Às vezes nem eu sei. O panóptico funciona até comigo.'],
      ],
    },
  },

  han1: {
    inicio: {
      l: [
        ['han', 'Ninguém me obriga. Eu que quero bater quatrocentas sombras por turno.'],
        ['han', 'Antes diziam "você não pode". Agora dizem "você pode tudo". Então eu posso. Eu posso tudo. Eu estou muito livre.'],
        ['glauco', 'O senhor está bem?'],
        ['han', 'Sou um sujeito de desempenho explorando a mim mesmo. É o melhor chefe que já tive. Socorro.'],
      ],
    },
  },

  bloqueio_subida: {
    inicio: { l: [['', 'Uma subida escura. Antes, o Górgias quer falar com você. A burocracia, ao contrário das sombras, é eterna.']] },
  },
};
