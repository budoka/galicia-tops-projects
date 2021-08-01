import dotenv from 'dotenv';
import { ConfigurationException } from './configuration.exception';
import { parseValue } from '../utils/parse.utils';

declare global {
  interface Window {
    [key: string]: any;
  }
}

const PREFIX_WINDOW = 'window.';
const PREFIX_REACT_APP = 'REACT_APP_';

dotenv.config();

interface ICache<T> {
  [key: string]: T;
}

interface EnvironmentData<T = string | number | boolean> {
  cache: ICache<T>;
  env?: string;
}

const environmentData: EnvironmentData = {
  env: undefined,
  cache: {},
};

/**
 * Check if the environment variable exist.
 * The checked value is cached for a better performance.
 * @param variableName Variable name
 */
export function checkVar(variableName: string) {
  if (!variableName) throw new ConfigurationException(`Malformed environment variable name.`);

  // Check if the variable is cached and return it.
  if (environmentData.cache[variableName]) return true;

  const value = process.env[PREFIX_REACT_APP + variableName] ?? window[PREFIX_REACT_APP + variableName];

  if (value === undefined) return false;
  else return true;
}

/**
 * Get the environment variable.
 * The retrieved value is cached for a better performance.
 * @param variableName Variable name
 */
export function getVar(variableName: string) {
  if (!variableName) throw new ConfigurationException(`Malformed environment variable name.`);

  // Check if the variable is cached and return it.
  if (environmentData.cache[variableName]) return environmentData.cache[variableName];

  const value = process.env[PREFIX_REACT_APP + variableName] ?? window[PREFIX_REACT_APP + variableName];

  if (value === undefined) throw new ConfigurationException(`Unable to get environment variable: '${variableName}'.`);
  const parsedValue = parseValue(value);

  // Cache the value and return it.
  return (environmentData.cache[variableName] = parsedValue);
}

/**
 * Get the environment variable or null.
 * The retrieved value is cached for a better performance.
 * @param variableName Variable name
 */
export function getVarOrNull(variableName: string) {
  if (!variableName) throw new ConfigurationException(`Malformed environment variable name.`);

  // Check if the variable is cached and return it.
  if (environmentData.cache[variableName]) return environmentData.cache[variableName];

  const value = process.env[PREFIX_REACT_APP + variableName] ?? window[PREFIX_REACT_APP + variableName];

  if (value === undefined) return null;
  const parsedValue = parseValue(value);

  // Cache the value and return it.
  return (environmentData.cache[variableName] = parsedValue);
}

/**
 * Get the environment name.
 */
export function getEnvironment() {
  if (environmentData.env) return environmentData.env;
  else return (environmentData.env = process.env.NODE_ENV.toString().toLowerCase());
}

/**
 * Check if the current environment is a local environment.
 */
export function isLocal() {
  return getEnvironment() === 'local';
}

/**
 * Check if the current environment is a development environment.
 */
export function isDevelopment() {
  return getEnvironment() === 'development';
}

/**
 * Check if the current environment is an integration environment.
 */
export function isIntegration() {
  return getEnvironment() === 'integration';
}

/**
 * Check if the current environment is a QAS environment.
 */
export function isQAS() {
  return getEnvironment() === 'qas';
}

/**
 * Check if the current environment is a production environment.
 */
export function isProduction() {
  return getEnvironment() === 'production';
}
