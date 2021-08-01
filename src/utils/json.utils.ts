/**
 *
 * @param value check if passed json string has a valid json structure.
 */
export const hasJsonStructure = (value: string) => {
  try {
    const object = JSON.parse(value);
    const type = Object.prototype.toString.call(object);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
};
