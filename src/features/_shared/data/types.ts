export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export type TipoPersona = 'fisica' | 'juridica';
export type TipoCuenta = 'ca' | 'cc';
export type TipoCodigo = 'aba' | 'swift';
export type DetalleGasto = 'ben' | 'our' | 'sha';
