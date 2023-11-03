import { relative, parse, resolve } from 'path';
import { fs, slash } from 'stan-utils';

import { formatTS, writeBanner } from './util';

/**
 * generate reference
 * @param dts
 * @param entryFilepath
 */
function writeReference(dts: string[], entryFilepath: string) {
  entryFilepath = resolve(entryFilepath);
  let orgContent = '';
  if (fs.existsSync(entryFilepath)) {
    orgContent = fs.readFileSync(entryFilepath).toString();
  }
  const content: string =
    orgContent +
    [...new Set(dts)]
      .sort()
      .map(
        (d) => `/// <reference path="${slash(relative(parse(entryFilepath).dir, d))}" />`,
      )
      .filter((v) => !orgContent.includes(v))
      .join('\n');
  fs.outputFileSync(entryFilepath, formatTS(writeBanner(content)));
}

export default writeReference;