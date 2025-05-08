export enum Pe {
    DIREITA = 'D',
    ESQUERDA = 'E'
}

export enum TipoFalta {
    FALTA = 0,
    PENALTI = 1,
    TIRO_LIVRE_INDIRETO = 2
  }

  export enum TipoCartao {
    AMARELO = 0,
    VERMELHO = 1,
}

export enum StatusTorneio {
    NAO_INICIADO = 0,
    EM_ANDAMENTO = 1,
    ENCERRADO = 2,
  }
  export enum TipoTorneio {
    LIGA = 0,
    MATA_MATA = 1,
    FASE_DE_GRUPOS = 2,
  }
  
  export enum PosicaoJogador {
    GOLEIRO = 0,
    FIXO = 1,
    ALA = 2,
    PIVO = 3,
    UNIVERSAL = 4
  }


  export enum PisoQuadra {
    MADEIRA = 0,
    BORRACHA = 1,
    CIMENTO = 2,
  }
  export enum StatusPartida {
    NAO_INICIADO = 0,
    EM_ANDAMENTO = 1,
    ENCERRADO = 2,
  }