import { Exception } from '../_shared/exceptions/base.exception';

/**
 * Exception for API error.
 */
export class ApiException extends Exception {
  constructor(message: string) {
    super(message);
    this.name = ApiException.name;
  }
}
