import { glob } from "glob";
import gen from './gen-dts';
import { Logger } from "../utils/logger";


export async function genProtoFiles(path: string, out: string) {
    const files = await glob([`${path}/**/*.proto`, `${path}/*.proto`]);
    if(!files.length) Logger.error('No proto files found');
    return gen({
        files: files.map((file) => ({
            file,
            output: `${out}/`,
            generateDependentModules: true
        })),
        referenceEntryFile: `${out}/index.d.ts`
    });
}