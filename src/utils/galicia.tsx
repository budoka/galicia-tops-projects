export function getLegajoFromEmail(email?: string) {
  if (!email) return;
  const legajo = email.split('@')[0].toUpperCase();
  return legajo;
}

export function getAccountFormat(moneda: string, codigo: string, numero: string | number) {
  return `${moneda} | ${codigo} | ${numero}`;
}
