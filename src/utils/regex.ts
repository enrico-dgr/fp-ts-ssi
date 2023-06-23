/**
 * @example
 * const myStringWithValues = 'limit=5 numMin=2';
 * const regex = getRegexForParamValue('limit');
 * 
 * const matches = myStringWithValues.match(regex);
 * 
 * console.log(
 *  matches[0]
 * ) // output: 5 
 * @param key `${key}="value"`
 * @returns
 */
export const getRegexForParamValue = (key: string) =>
  new RegExp(`(?<=${key}=['"])[^'"]*(?=['"])`)

/**
 * @example
 * const myStringWithValues = '<!--#set var="ROOT" value="/root/path"-->';
 * 
 * const matches = myStringWithValues.match(regexForFuncParams);
 * 
 * console.log(
 *  matches[0]
 * ) // output: var="ROOT" value="/root/path" 
 */
export const regexForFuncParams = new RegExp(`(?<=<!-- *#[^ ]* +)[^>]+(?=-->)`)
