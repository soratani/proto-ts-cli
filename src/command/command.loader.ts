import { Command } from "commander";
import { Logger } from "../utils/logger";
import { BuildCommand } from "./build.command";
import { BuildAction } from "../action";

export class CommandLoader {
    public static load(program: Command): void {
        new BuildCommand(new BuildAction()).load(program);
        this.handleInvalidCommand(program);
    }

    private static handleInvalidCommand(program: Command) {
        program.on('command:*', () => {
            Logger.error('未知命令: %s', program.args.join(' '));
            Logger.info('有关可用命令的列表，请参见 --help.\n');
            process.exit(1);
        });
    }
}