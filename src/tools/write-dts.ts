import { resolve, join, parse } from 'path';
import { loadSync, getProtoPath } from 'google-proto-files';
import { Namespace, ReflectionObject } from 'protobufjs';
import { fs } from 'stan-utils';

import type { IParseOptions } from 'protobufjs';
import type { GenProtoFile } from './type';

import { writeBanner, replaceSamePath } from './util';
import parseNamespace from './parse-namespace';
import { Visitor } from './type';
import { Logger } from '../utils/logger';

/**
 * record parsed files
 */
const parsedFiles: string[] = [];

/**
 * generate dts file
 * @param proto
 * @param opts
 * @param visitor
 * @returns generate files
 */
export default function writeDTS(
  proto: GenProtoFile,
  opts?: IParseOptions,
  visitor?: Visitor,
): string[] {
  const { generateDependentModules = true } = proto;

  if (parsedFiles.includes(proto.file)) {
    return [];
  }

  function loadFile(file: string) {
    const root = loadSync(file, opts);
    if (!root.nestedArray.length) {
      Logger.wran(`Warning "${proto.file}" is empty`);
    }
    return root;
  }

  // only compile namespace
  // false where throw error
  function checkCanCompile(reflection: ReflectionObject): reflection is Namespace {
    const can = reflection instanceof Namespace;
    if (!can) {
      Logger.error(`Check whether the version of protobufjs that google-proto-files depends on is consistent with the version of protobufjs in the project.`)
    }
    return can;
  }

  const root = loadFile(proto.file);

  /**
   * generated dts files path
   */
  const generatedFiles: string[] = [];

  const reflection = root.nestedArray[0];

  if (!reflection) {
    return generatedFiles;
  }

  if (checkCanCompile(reflection)) {
    const outPath = resolve(proto.output!);
    const parsed = parseNamespace(reflection, root.files[0], visitor);
    fs.outputFileSync(outPath, writeBanner(parsed));
    generatedFiles.push(outPath);
    parsedFiles.push(proto.file);

    const protoLibDir = getProtoPath();
    if (generateDependentModules && root.files.length > 1) {
      for (let file of root.files.slice(1)) {
        if (parsedFiles.includes(file)) {
          continue;
        }
        const orgFile = file;
        const root = loadFile(file);
        const reflection = root.nestedArray[0];

        if (!reflection) {
          continue;
        }

        const isLibFile = file.startsWith(protoLibDir);

        if (checkCanCompile(reflection)) {
          const parsed = parseNamespace(reflection, file, visitor);
          const { dir } = parse(proto.output!);
          // internal proto file, beautify the generation path
          if (file.startsWith(protoLibDir)) {
            file = replaceSamePath(protoLibDir, file);
          }
          // beautify the proto lib path
          if (isLibFile) {
            file = join('google', file);
          }
          // generate a file based on the relative position of the file
          const { dir: importDir, name: fileName } = parse(replaceSamePath(proto.file, file));
          const outPath = resolve(dir, importDir, `${fileName}.d.ts`);
          fs.outputFileSync(outPath, writeBanner(parsed));
          generatedFiles.push(outPath);
          parsedFiles.push(orgFile);
        }
      }
    }
  }

  return generatedFiles;
}