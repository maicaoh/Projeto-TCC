export function peDominande(codigo: number): string {
  return codigo === 1
    ? 'D'
    : 'E'
}

export function posicaoJogador(codigo: number): string {
  switch (codigo) {
    case 0:
      return 'Goleiro'
    case 1:
      return 'Fixo'
    case 2:
      return 'Ala'
    case 3:
      return 'Pivô'
    case 4:
      return 'Universal'
    default:
      return 'Desconhecido'
  }
}

export function tipoCompeticao(codigo: number): string {
  switch (codigo) {
    case 0:
      return 'Liga'
    case 1:
      return 'Mata Mata'
    case 2:
      return 'Fase de grupos'
    default:
      return 'Desconhecido'
  }
}

export function statusCompeticao(codigo: number): string {
  switch (codigo) {
    case 0:
      return 'Não iniciado'
    case 1:
      return 'Em andamento'
    case 2:
      return 'Encerrado'
    default:
      return 'Desconhecido'
  }
}

export function statusPartida(codigo: number): string {
  switch (codigo) {
    case 0:
      return ''
    case 1:
      return 'Em andamento'
    case 2:
      return 'Encerrado'
    default:
      return 'Desconhecido'
  }
}

export function tipoFalta(codigo: number): string {
  switch (codigo) {
    case 0:
      return 'Falta'
    case 1:
      return 'Penalti'
    case 2:
      return 'Tiro livre indireto'
    default:
      return 'Desconhecido'
  }
}

export function tipoCartao(codigo: number): string {
  switch (codigo) {
    case 0:
      return 'Amarelo'
    case 1:
      return 'Vermelho'
    default:
      return 'Desconhecido'
  }
}
