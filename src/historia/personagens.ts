import type { Personagem } from '../jogo/tipos';

const CLARA = '#f1c9a5';
const MEDIA = '#d9a37a';
const MORENA = '#b07a52';
const ESCURA = '#7a4e34';
const BRANCO = '#e8e4dc';
const GRIS = '#a8a0a0';
const PRETO = '#1e1620';
const CASTANHO = '#5a3a24';

export const PERSONAGENS: Record<string, Personagem> = {
  glauco: { nome: 'Glauco', cor: '#ffb347', voz: 330, ap: { pele: MORENA, cabelo: PRETO, estilo: 'cacheado', barba: 'nada', roupa: 'trapo', cor: '#8a7462' } },
  socrates: { nome: 'Sócrates', cor: '#ffe08a', voz: 220, ap: { pele: MEDIA, cabelo: BRANCO, estilo: 'careca', barba: 'longa', roupa: 'toga', cor: '#d8cfbd', cor2: '#a8987a' } },
  doxa: { nome: 'Dona Doxa', cor: '#d99cff', voz: 420, ap: { pele: CLARA, cabelo: GRIS, estilo: 'coque', barba: 'nada', roupa: 'vestido', cor: '#7a3a8a', acorrentado: true, sentado: true } },
  trasimaco: { nome: 'Trasímaco', cor: '#ff6a5a', voz: 160, ap: { pele: MEDIA, cabelo: PRETO, estilo: 'curto', barba: 'curta', roupa: 'tunica', cor: '#a02c2c', acessorio: 'louros', acorrentado: true, sentado: true } },
  critico: { nome: 'O Crítico', cor: '#9fd6ff', voz: 300, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'curto', barba: 'bigode', roupa: 'tunica', cor: '#3a4a6a', acessorio: 'oculos', acorrentado: true, sentado: true } },
  parmenides: { nome: 'Parmênides', cor: '#d8d0c0', voz: 140, ap: { pele: MEDIA, cabelo: BRANCO, estilo: 'longo', barba: 'longa', roupa: 'manto', cor: '#6a6470', acorrentado: true, sentado: true } },
  zenao: { nome: 'Zenão de Eleia', cor: '#8fd17a', voz: 260, ap: { pele: MEDIA, cabelo: CASTANHO, estilo: 'curto', barba: 'curta', roupa: 'tunica', cor: '#3f6a2f', acessorio: 'tartaruga', acorrentado: true, sentado: true } },
  heraclito: { nome: 'Heráclito', cor: '#ff9a52', voz: 190, ap: { pele: MORENA, cabelo: PRETO, estilo: 'cacheado', barba: 'enorme', roupa: 'manto', cor: '#3a2a3a', acorrentado: true, sentado: true } },
  pirro: { nome: 'Pirro de Élis', cor: '#c8c0a8', voz: 240, ap: { pele: MEDIA, cabelo: GRIS, estilo: 'calvo', barba: 'curta', roupa: 'toga', cor: '#b8a88a', acorrentado: true, sentado: true } },
  sartre: { nome: 'Jean-Paul Sartre', cor: '#c0c8d8', voz: 280, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'curto', barba: 'nada', roupa: 'terno', cor: '#3a3a44', acessorio: 'cachimbo', acorrentado: true, sentado: true } },
  marx: { nome: 'Karl Marx', cor: '#ff5a5a', voz: 150, ap: { pele: CLARA, cabelo: GRIS, estilo: 'cacheado', barba: 'enorme', roupa: 'terno', cor: '#2a2630', acorrentado: true, sentado: true } },
  beauvoirPrisao: { nome: 'Simone de Beauvoir', cor: '#ff8ab0', voz: 360, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'coque', barba: 'nada', roupa: 'vestido', cor: '#7a2a3a', acessorio: 'livro' } },

  gorgias: { nome: 'Górgias', cor: '#ffb347', voz: 200, ap: { pele: MEDIA, cabelo: PRETO, estilo: 'topete', barba: 'bigode', roupa: 'tunica', cor: '#c8642a', cor2: '#7a3a1a', acessorio: 'cracha' } },
  protagoras: { nome: 'Protágoras', cor: '#ffd36b', voz: 230, ap: { pele: MEDIA, cabelo: GRIS, estilo: 'calvo', barba: 'curta', roupa: 'tunica', cor: '#a8642a', acessorio: 'fita' } },
  maquiavel: { nome: 'Nicolau Maquiavel', cor: '#c84a5a', voz: 250, ap: { pele: CLARA, cabelo: PRETO, estilo: 'curto', barba: 'nada', roupa: 'terno', cor: '#2a1a24', cor2: '#c84a5a', acessorio: 'cracha' } },
  debord: { nome: 'Guy Debord', cor: '#e8e2d6', voz: 270, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'curto', barba: 'nada', roupa: 'terno', cor: '#4a4a52', acessorio: 'cigarro' } },
  baudrillard: { nome: 'Jean Baudrillard', cor: '#b99cff', voz: 260, ap: { pele: CLARA, cabelo: GRIS, estilo: 'calvo', barba: 'nada', roupa: 'terno', cor: '#3a3448', acessorio: 'oculos' } },
  foucault: { nome: 'Michel Foucault', cor: '#ffffff', voz: 240, ap: { pele: CLARA, cabelo: CLARA, estilo: 'careca', barba: 'nada', roupa: 'terno', cor: '#1e1a22', cor2: '#1e1a22', acessorio: 'oculos' } },
  han: { nome: 'Byung-Chul Han', cor: '#a8d8c8', voz: 290, ap: { pele: CLARA, cabelo: PRETO, estilo: 'curto', barba: 'nada', roupa: 'terno', cor: '#22222a', cor2: '#22222a', acessorio: 'cracha' } },

  diogenes: { nome: 'Diógenes de Sinope', cor: '#ffd36b', voz: 180, ap: { pele: MORENA, cabelo: GRIS, estilo: 'longo', barba: 'enorme', roupa: 'trapo', cor: '#6a5a4a', acessorio: 'barril' } },
  hiparquia: { nome: 'Hipárquia de Maroneia', cor: '#ff9ac0', voz: 380, ap: { pele: MORENA, cabelo: PRETO, estilo: 'rabo', barba: 'nada', roupa: 'trapo', cor: '#6a4a5a', acessorio: 'cajado' } },
  tales: { nome: 'Tales de Mileto', cor: '#6fc3e8', voz: 210, ap: { pele: MEDIA, cabelo: BRANCO, estilo: 'calvo', barba: 'longa', roupa: 'tunica', cor: '#2a4a7a', acessorio: 'estrela' } },
  camus: { nome: 'Albert Camus', cor: '#ffe8c2', voz: 280, ap: { pele: MEDIA, cabelo: PRETO, estilo: 'topete', barba: 'nada', roupa: 'terno', cor: '#7a6a52', cor2: '#3a3a44', acessorio: 'cigarro' } },
  sisifo: { nome: 'Sísifo', cor: '#c8c0a8', voz: 170, ap: { pele: ESCURA, cabelo: PRETO, estilo: 'curto', barba: 'curta', roupa: 'trapo', cor: '#7a6a52', acessorio: 'pedra' } },
  pitagoras: { nome: 'Pitágoras', cor: '#d8a84a', voz: 200, ap: { pele: MEDIA, cabelo: BRANCO, estilo: 'longo', barba: 'longa', roupa: 'toga', cor: '#f0ece0', cor2: '#7a3a8a', acessorio: 'lira' } },
  descartes: { nome: 'René Descartes', cor: '#c8d8ff', voz: 270, ap: { pele: CLARA, cabelo: PRETO, estilo: 'longo', barba: 'bigode', roupa: 'terno', cor: '#1e1a22', cor2: '#f0ece0' } },
  kierkegaard: { nome: 'Søren Kierkegaard', cor: '#9fb0d0', voz: 300, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'topete', barba: 'nada', roupa: 'terno', cor: '#22202a', acessorio: 'chapeu' } },
  kant: { nome: 'Immanuel Kant', cor: '#e8e2d6', voz: 250, ap: { pele: CLARA, cabelo: BRANCO, estilo: 'curto', barba: 'nada', roupa: 'terno', cor: '#4a3a52', cor2: '#e8e2d6', acessorio: 'peruca' } },
  wittgenstein: { nome: 'Ludwig Wittgenstein', cor: '#d0d0d0', voz: 260, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'curto', barba: 'nada', roupa: 'terno', cor: '#6a6a72', cor2: '#e8e2d6' } },

  aristoteles: { nome: 'Aristóteles', cor: '#7ab8ff', voz: 230, ap: { pele: MEDIA, cabelo: CASTANHO, estilo: 'curto', barba: 'curta', roupa: 'toga', cor: '#3a5a9a', cor2: '#d8cfbd', acessorio: 'pergaminho' } },
  epicuro: { nome: 'Epicuro', cor: '#8fd17a', voz: 210, ap: { pele: MEDIA, cabelo: CASTANHO, estilo: 'longo', barba: 'longa', roupa: 'toga', cor: '#5a8a3a', cor2: '#d8cfbd' } },
  marcoaurelio: { nome: 'Marco Aurélio', cor: '#b98aff', voz: 190, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'cacheado', barba: 'curta', roupa: 'manto', cor: '#5a2a7a', cor2: '#ffcc33', acessorio: 'louros' } },
  nietzsche: { nome: 'Friedrich Nietzsche', cor: '#ff7a7a', voz: 200, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'curto', barba: 'bigode', roupa: 'terno', cor: '#3a3036', acessorio: 'cajado' } },
  diotima: { nome: 'Diotima de Mantineia', cor: '#ffc0e0', voz: 400, ap: { pele: MORENA, cabelo: PRETO, estilo: 'longo', barba: 'nada', roupa: 'vestido', cor: '#f0ece0', cor2: '#d8a84a', acessorio: 'lira' } },
  hipatia: { nome: 'Hipátia de Alexandria', cor: '#9fd6ff', voz: 380, ap: { pele: MORENA, cabelo: CASTANHO, estilo: 'longo', barba: 'nada', roupa: 'vestido', cor: '#2a4a8a', acessorio: 'estrela' } },
  spinoza: { nome: 'Baruch Espinosa', cor: '#cfeaff', voz: 250, ap: { pele: CLARA, cabelo: PRETO, estilo: 'longo', barba: 'bigode', roupa: 'manto', cor: '#2a2630', acessorio: 'lente' } },
  laotse: { nome: 'Lao-Tsé', cor: '#ffe08a', voz: 170, ap: { pele: MEDIA, cabelo: BRANCO, estilo: 'longo', barba: 'enorme', roupa: 'manto', cor: '#c8a03a', cor2: '#7a5a1a', acessorio: 'cajado' } },
  confucio: { nome: 'Confúcio', cor: '#ff9a52', voz: 200, ap: { pele: MEDIA, cabelo: PRETO, estilo: 'coque', barba: 'longa', roupa: 'manto', cor: '#9a2a2a', cor2: '#3a1a1a' } },
  beauvoir: { nome: 'Simone de Beauvoir', cor: '#ff8ab0', voz: 360, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'coque', barba: 'nada', roupa: 'vestido', cor: '#7a2a3a', acessorio: 'livro' } },
  schopenhauer: { nome: 'Arthur Schopenhauer', cor: '#a0a0b0', voz: 150, ap: { pele: CLARA, cabelo: BRANCO, estilo: 'calvo', barba: 'nada', roupa: 'terno', cor: '#2a2a30' } },
  platao: { nome: 'Platão', cor: '#ffffff', voz: 210, ap: { pele: MEDIA, cabelo: CASTANHO, estilo: 'curto', barba: 'longa', roupa: 'toga', cor: '#f0ece0', cor2: '#3a5a9a', acessorio: 'pergaminho' } },

  arendt: { nome: 'Hannah Arendt', cor: '#ffd0a0', voz: 340, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'curto', barba: 'nada', roupa: 'terno', cor: '#3a3a4a', acessorio: 'cigarro' } },
  anito: { nome: 'Ânito', cor: '#c84a4a', voz: 160, ap: { pele: MEDIA, cabelo: PRETO, estilo: 'calvo', barba: 'curta', roupa: 'toga', cor: '#4a2a2a', cor2: '#2a1a1a' } },
  bacon: { nome: 'Francis Bacon', cor: '#c8b88a', voz: 250, ap: { pele: CLARA, cabelo: CASTANHO, estilo: 'curto', barba: 'curta', roupa: 'terno', cor: '#2a2a3a', acessorio: 'chapeu' } },

  porta: { nome: 'Porta', cor: '#d8a84a', voz: 110, ap: { pele: MEDIA, cabelo: PRETO, estilo: 'careca', barba: 'nada', roupa: 'tunica', cor: '#5a3a24' } },
  plateia: { nome: 'A Caverna inteira', cor: '#ff9a52', voz: 120, ap: { pele: MEDIA, cabelo: PRETO, estilo: 'careca', barba: 'nada', roupa: 'trapo', cor: '#5a3a24' } },
};

export function nomeDe(id: string): string {
  if (id === '') return '';
  return PERSONAGENS[id]?.nome ?? id;
}
