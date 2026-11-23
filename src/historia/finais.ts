// Os seis finais. Cada um tem cor própria, um texto e uma moral torta.

export interface Final {
  titulo: string;
  cor: string;
  fundo: string;
  silhueta: string;
  texto: string[];
  moral: string;
}

export const FINAIS: Record<string, Final> = {
  sombra: {
    titulo: 'Sombra e Água Fresca',
    cor: '#8fd17a',
    fundo: '#0f2418',
    silhueta: 'arvore',
    texto: [
      'Glauco ficou no jardim de Epicuro. Pão, água fresca, amigos e uma rede que balança sozinha.',
      'Ele viu o sol, entendeu o Bem e decidiu que o Bem, para ele, era não subir escada nunca mais.',
      'Às vezes, de noite, ele pensa na Dona Doxa. Depois passa.',
    ],
    moral: 'Sábio e levemente culpado. Como quase todo mundo que está bem.',
  },
  rei: {
    titulo: 'O Rei Filósofo',
    cor: '#ffcc33',
    fundo: '#2a1e08',
    silhueta: 'sol',
    texto: [
      'As correntes caíram. A caverna inteira virou o pescoço ao mesmo tempo. Foi o maior torcicolo coletivo da história.',
      'Como foi Glauco quem voltou, a caverna decidiu que ele devia governar. Ele nunca quis. Platão diz que é justamente por isso.',
      'Hoje a SombraTV passa só documentário. A audiência caiu muito. A Dona Doxa tem opinião sobre isso.',
    ],
    moral: 'Quem governa bem é quem não queria governar. Infelizmente, essa pessoa nunca se candidata.',
  },
  titereiro: {
    titulo: 'Titereiro',
    cor: '#ff7a3d',
    fundo: '#2a1008',
    silhueta: 'coelho',
    texto: [
      'Glauco aceitou o emprego. Fogueira com ar-condicionado, vale-refeição e plano de carreira até Boneco Sênior.',
      'Ele nunca viu o sol. Mas ficou muito bom em fazer sombra de coelho. A melhor da caverna, dizem.',
      'Às vezes ele olha a plateia acorrentada e sente alguma coisa. O Górgias diz que é ilusão. Nada existe.',
    ],
    moral: 'O melhor salário e o pior final. Igual à vida.',
  },
  cicuta: {
    titulo: 'Cicuta',
    cor: '#b98aff',
    fundo: '#180e24',
    silhueta: 'vaso',
    texto: [
      'A caverna votou. Ganhou o chá.',
      'Glauco não ficou com raiva. Ele perguntou se o chá era justo, e ninguém soube responder. Para ele, isso já foi uma vitória.',
      'Sócrates apareceu, deu um tapinha nas costas dele e disse: acontece nas melhores famílias. Na minha, por exemplo.',
    ],
    moral: 'Em 399 a.C., Atenas condenou Sócrates à morte por fazer perguntas. As perguntas continuam por aí.',
  },
  sofa: {
    titulo: 'De Volta ao Sofá',
    cor: '#ff8ab0',
    fundo: '#240a16',
    silhueta: 'cadeira',
    texto: [
      'Glauco pediu desculpas, voltou para a corrente e virou o pescoço para a parede.',
      'No dia seguinte passou o coelho, às três. Ele adivinhou. Todo mundo aplaudiu, com as mãos presas.',
      'Ele sabe que lá fora tem sol. Só decidiu que hoje não. Nem amanhã. Talvez na segunda.',
    ],
    moral: 'Sartre chamaria isso de má-fé. A Dona Doxa chamaria de bom senso.',
  },
  cavernas: {
    titulo: 'A Caverna da Caverna',
    cor: '#9fd6ff',
    fundo: '#081624',
    silhueta: 'triangulo',
    texto: [
      'Glauco descobriu que o lá fora também era uma caverna. Maior, mais bonita, com filósofos melhores. Mas caverna.',
      'Ele não se desesperou. Pegou sua dúvida, que já estava bem treinada, e começou a procurar a próxima rachadura.',
      'Dizem que ele ainda está subindo. Descartes vai atrás, por precaução.',
    ],
    moral: 'Final secreto. Filosofar não é sair da caverna uma vez. É criar o hábito.',
  },
};

export const ORDEM_FINAIS = Object.keys(FINAIS);
