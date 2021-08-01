import { Exception } from '../_shared/exceptions/base.exception';

/**
 * Exception for environment error.
 */
export class ConfigurationException extends Exception {
  constructor(message: string) {
    super(message);
    this.name = ConfigurationException.name;
  }
}
