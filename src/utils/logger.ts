import * as colors from 'chalk';

export const ERROR_PREFIX = colors.bgRgb(210, 0, 75).bold.rgb(0, 0, 0)('ERROR');
export const INFO_PREFIX = colors.bgRgb(35, 187, 110).bold.rgb(0, 0, 0)('INFO');
export const WRAN_PREFIX = colors.bgRgb(208, 211, 44).bold.rgb(0, 0, 0)('WRAN');
export const COMPILE_PREFIX = colors.bgRgb(35, 187, 110).bold.rgb(0, 0, 0)('Compile');
export const CREATE_PREFIX = colors.bgRgb(35, 187, 110).bold.rgb(0, 0, 0)('Created');

export class Logger {
    static error(message: string, ...args: any[]) {
        console.log(`\n${ERROR_PREFIX} >>> ${colors.redBright(message)}`, ...args);
        process.exit(1);
    }
    static info(message: string, ...args: any[]) {
        console.log(`\n${INFO_PREFIX} >>> ${colors.green(message)}`, ...args);
    }
    static wran(message: string, ...args: any[]) {
        console.log(`\n${WRAN_PREFIX} >>> ${colors.yellow(message)}`, ...args);
    }
    static compile(file: string, out: string) {
        console.log(`\n${COMPILE_PREFIX} >>> ${colors.yellow(file)} → ${colors.cyan(out)}...`); 
    }
    static create(file: string, out: string) {
        console.log(`${CREATE_PREFIX} >>> ${colors.cyan(file)} in ${colors.bold(out)}`); 
    }
}