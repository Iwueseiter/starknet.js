import urljoin from 'url-join';

/**
 * Inspired from https://github.com/segmentio/is-url
 */

/**
 * RegExps.
 * A URL must match #1 and then at least one of #2/#3.
 * Use two levels of REs to avoid REDOS.
 */
const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;

/**
 * Loosely validate a URL `string`.
 */
export function isUrl(s?: string): boolean {
  if (!s) {
    return false;
  }

  if (typeof s !== 'string') {
    return false;
  }

  const match = s.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (
    localhostDomainRE.test(everythingAfterProtocol) ||
    nonLocalhostDomainRE.test(everythingAfterProtocol)
  ) {
    return true;
  }

  return false;
}

/**
 * Builds a URL using the provided base URL, default path, and optional URL or path.
 *
 * @param {string} baseUrl - The base URL of the URL being built.
 * @param {string} defaultPath - The default path to use if no URL or path is provided.
 * @param {string} [urlOrPath] - The optional URL or path to append to the base URL.
 * @return {string} The built URL.
 */
export function buildUrl(baseUrl: string, defaultPath: string, urlOrPath?: string) {
  return isUrl(urlOrPath) ? urlOrPath! : urljoin(baseUrl, urlOrPath ?? defaultPath);
}
