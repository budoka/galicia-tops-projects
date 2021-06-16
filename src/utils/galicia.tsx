import { Pattern } from 'src/constants';

export function getLegajoFromEmail(email?: string) {
  if (!email) return;
  const legajo = email.split('@')[0].toUpperCase();
  return legajo;
}
