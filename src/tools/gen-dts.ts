import { join, parse } from 'path';
import { chalk, relativeNormalize, pms, slash } from 'stan-utils';

import type { ProtoGenDTSOptions } from './type';
import writeDTS from './write-dts';
import writeReference from './write-reference';
import { CREATE_PREFIX, Logger } from '../utils/logger';

/**
 * proto generate dts
 * @param opts
 * @returns parsedFiles path
 */
function protoGenDTS(opts: ProtoGenDTSOptions): string[] {
  if (!opts.files.length) {
    throw new Error('Please enter the proto file');
  }

  const parsedFiles: string[] = [];

  for (const file of opts.files) {
    const readablyFile = relativeNormalize(file.file);
    const _file = {
      ...file,
    };
    const { dir, name } = parse(file.file);
    if (!_file.output) {
      _file.output = join(dir, name + '.d.ts');
    }
    if (slash(_file.output).slice(-1) === '/') {
      _file.output = join(_file.output, name + '.d.ts');
    }
    const startTime = Date.now();
    Logger.compile(readablyFile, relativeNormalize(_file.output!));
    try {
      const dts = writeDTS(
        _file,
        {
          alternateCommentMode: true,
          ...opts.protoParseOptions,
          ...file.protoParseOptions,
        },
        opts.visitor,
      );
      parsedFiles.push(...dts);
      if (dts.length) {
        const spendMS = Date.now() - startTime;
        Logger.create(relativeNormalize(_file.output!), pms(spendMS));
      }
      if (dts.length > 1) {
        console.log(
          `  ${CREATE_PREFIX} dependent modules: \n` +
            chalk.greenBright(
              dts
                .slice(1)
                .map(relativeNormalize)
                .map((v) => '  • ' + v)
                .join('\n'),
            ),
        );
      }
    } catch (e) {
      Logger.error(`Build ${readablyFile} error`)
    }
  }

  if (opts.referenceEntryFile !== false) {
    const referenceEntryFile = opts.referenceEntryFile || 'index.d.ts';
    writeReference(parsedFiles, referenceEntryFile);
    console.log(
      `${CREATE_PREFIX} reference entry file: ${chalk.cyan(relativeNormalize(referenceEntryFile))}`,
    );
  }

  return parsedFiles;
}

export default protoGenDTS;