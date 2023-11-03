import { Command } from "commander";
import { get } from 'lodash';
import { AbstractCommand } from "./abstract.command";
import { Input } from "./command.input";
import { Logger } from "../utils/logger";


export class BuildCommand extends AbstractCommand {
    public load(program: Command): void {
        program
            .command('build')
            .description('转化proto文件为ts类型')
            .option('-s, --source [source]', '源文件位置')
            .option('-o, --out [out]', '文件输出位置')
            .action(async (command: Command) => {
                const source = get(command, 'source');
                const out = get(command, 'out');
                const inputs: Input[] = [];
                const options: Input[] = [];
                if (!source) Logger.error('请输入源文件')
                if (!out) Logger.error('请输入文件输出位置')
                options.push({
                    name: 'source',
                    value: source,
                });
                options.push({
                    name: 'out',
                    value: out,
                });
                await this.action.handle(inputs, options);
            })
    }
}