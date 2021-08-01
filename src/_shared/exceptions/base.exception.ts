/**
 * Base exception.
 */
export abstract class Exception extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, Exception.prototype);
  }
}
