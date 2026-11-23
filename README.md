# Sombra e Água Fresca

Um jogo em pixel sobre sair da Caverna de Platão, com filósofos demais e humor de sobra.

**Jogar:** https://marianabsctba.github.io/Sombra_e_Agua_Fresca/

Você é Glauco, prisioneiro de nascença no fundo da caverna. A SombraTV nunca sai do ar, o campeonato de previsão de sombras está na final e a vida está ótima. Até que um velhinho descalço chamado Sócrates começa a fazer perguntas.

## Os cinco atos

1. **O Fundo**: os acorrentados, a SombraTV e o Campeonato de Previsão de Sombras contra o invicto Trasímaco.
2. **O Fogo**: atrás do muro fica o Sindicato dos Titereiros. Você faz um turno de teste operando bonecos e recebe uma proposta de emprego.
3. **A Subida**: a Linha Dividida em quatro andares (imaginação, crença, raciocínio e inteligência), com chão que mente, salto de fé, a porta de Pitágoras e uma porta que só abre com "não sei".
4. **Lá Fora**: os olhos se acostumam em ordem (sombras, reflexos, coisas, estrelas e sol). No caminho você coleciona as sete Formas.
5. **A Volta**: no escuro de novo, você tenta convencer quem nunca virou o pescoço. Pergunta funciona, sermão irrita e no fim tem assembleia (e chá).

São seis finais, um deles secreto.

## Álbum de Filósofos

São 40 cartas, de Tales a Byung-Chul Han, passando por Hipátia, Diotima, Hipárquia, Beauvoir e Arendt. Cada carta traz a ideia central de verdade, em poucas linhas, e uma curiosidade. O álbum continua guardado quando você começa um jogo novo.

## Controles

| Ação | Teclado | Toque |
|---|---|---|
| Andar | setas ou WASD | direcional na tela |
| Conversar e avançar | Enter, Espaço ou E | Ok, ou tocar na tela |
| Escolher | setas e Enter, 1 a 4, ou clique | toque na opção |
| Álbum | Tab ou I | Álbum |
| Som | M | |

## Desenvolvimento

TypeScript, Vite e Canvas 2D, sem motor de jogo. Personagens, ladrilhos, silhuetas e som são gerados por código.

```
npm install
npm run dev      # http://localhost:6533
npm test         # valida a história e joga até os seis finais
npm run build
```

- `src/historia/`: falas dos cinco atos, mapas, álbum e finais
- `src/jogo/`: núcleo (estado, conversas, efeitos), desenho e o robô de testes
- `src/motor/`: tela, entrada, sprites, ladrilhos e som
- `src/minijogos/`: campeonato de sombras e turno de titereiro

No navegador, o robô fica em `window.robo`, por exemplo: `jogo.novoJogo(); robo.ato1().ato2()`.

Para uma partida inteira jogada só com toques e teclas de verdade (anda pelo mapa, conversa, joga os minijogos), abra `http://localhost:6533/?semPausa&toque` e rode no console:

```js
const j = await import('/ferramentas/jogador.js'); await j.jogarAteORei(); // ou jogarAteORei(3) para começar no ato 3
```

O `?semPausa` mantém o jogo rodando com a aba escondida e o `?toque` liga os botões de celular.

A trilha também é gerada por código (`src/motor/musica.ts`): cada ato tem tema próprio, com tímpano, caixa, baixo, arpejo, cordas e metais.

Publicação automática no GitHub Pages a cada push na `main`.

## Licença

Código sob a licença MIT. A fonte Pixelify Sans é distribuída sob a SIL Open Font License.
