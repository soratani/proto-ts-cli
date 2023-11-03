import * as commander from 'commander';
import { Command } from 'commander';
import { CommandLoader } from './command';

const bootstrap = () => {
    const program: Command = commander as unknown as Command;
    program
        .version(
            require('../package.json').version,
            '-v, --version',
            '输出当前版本.',
        )
        .usage('<command> [options]')
        .helpOption('-h, --help', '帮助信息.');
        CommandLoader.load(program);
    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
};

bootstrap();