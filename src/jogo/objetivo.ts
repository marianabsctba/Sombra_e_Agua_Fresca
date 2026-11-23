import type { Estado } from './tipos';

/** A dica do canto da tela: o próximo passo da história, em uma linha. */
export function objetivo(e: Estado, cena: string): string {
  const f = (k: string) => (e.flags[k] ?? 0) > 0;
  switch (cena) {
    case 'fundo':
      if (!f('viuSocrates')) return 'Fale com Sócrates, o velhinho careca logo atrás de você';
      if (!f('campeao')) return 'Vença o Trasímaco no campeonato (à direita, de louros)';
      if (!f('solto')) return 'Volte a falar com Sócrates';
      return 'Saia pelo vão do muro, embaixo à direita';
    case 'fogo':
      if (!f('turno')) return 'Fale com o Górgias, o chefe dos titereiros';
      if (!f('recusou')) return 'Responda à proposta do Górgias';
      return 'Suba pela saída à direita';
    case 'subida':
      if (!f('reflexo')) return 'Olhe a poça d\'água antes de atravessar';
      if (!f('salto')) return 'Atravesse o abismo: fale com Kierkegaard';
      if (!f('pitagoras')) return 'Passe pela porta de Pitágoras';
      if (!f('aporia')) return 'Fale com Sócrates na porta de cima';
      if (!f('escada')) return 'Fale com o homem de terno cinza';
      return 'Saia para a luz';
    case 'fora':
      if (e.visao < 1) return 'Olhe as sombras no chão, perto da caverna';
      if (e.visao < 2) return 'Olhe os reflexos no lago, mais abaixo';
      if (e.formas.length < 3) return 'Ache Formas: tudo o que tem brilho em volta';
      if (e.visao < 4) return 'Fale com Hipátia, no alto à direita';
      if (!e.formas.includes('bem')) return 'Olhe o sol no morro do canto direito';
      if (!f('decidiuVoltar')) return 'Fale com Epicuro no jardim florido';
      return 'Volte para a caverna, à esquerda';
    case 'volta':
      if ((e.flags.debates ?? 0) < 4) return 'Converse com os prisioneiros: pergunte, não ensine';
      return 'Fale com o Ânito: começou a assembleia';
    case 'secreta':
      return 'Fale com Sócrates';
  }
  return '';
}
