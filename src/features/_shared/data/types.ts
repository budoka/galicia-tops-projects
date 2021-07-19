export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export type TipoPersona = 'fisica' | 'juridica';
export type TipoCuenta = 'ca' | 'cc';
export type TipoCodigoBanco = 'aba' | 'swift';
export type DetalleGastos = 'ben' | 'our' | 'sha';
