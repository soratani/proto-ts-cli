import { existsSync, mkdirSync } from "fs";
import { extname, join } from 'path';
import { Input } from "../command";
import { AbstractAction } from "./abstract.action";
import { Logger } from "../utils/logger";
import { genProtoFiles } from "../tools";

export class BuildAction extends AbstractAction {
    public async handle(inputs?: Input[], options?: Input[], extraFlags?: string[]): Promise<void> {
        const source = options.find((o) => o.name === 'source')?.value as string;
        const out = options.find((o) => o.name === 'out')?.value as string;
        const sourcePath = join(process.cwd(), source);
        const outPath = join(process.cwd(), out);
        Logger.info(`Input path:${sourcePath}`);
        Logger.info(`Output path:${outPath}`);
        if(!existsSync(sourcePath)) Logger.error('The input location does not exist');
        if (!!extname(outPath)) Logger.error('The output path cannot be a file');
        if (!existsSync(outPath)) mkdirSync(outPath, { recursive: true });
        await genProtoFiles(sourcePath, out);
    }
}