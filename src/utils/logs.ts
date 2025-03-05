import chalk from 'chalk';
import path from 'path';

export const CRUD_ICONS = {
	POST: '📝',
	GET: '📖',
	PUT: '✏️',
	DELETE: '🗑️',
};

export function log(message: string, type: string = 'info', dirname: string): void {
	const relativePath = path.relative(process.cwd(), dirname);
	const PAD_LENGTH = 10;
	const timestamp = new Date().toLocaleTimeString('es-ES', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});

	const sourceInfo = relativePath ? chalk.dim(`[${relativePath}]`) : '';

	switch (type.toLowerCase()) {
		case 'error':
			console.log(
				`${chalk.bold.red('ERROR'.padEnd(PAD_LENGTH))}| ${timestamp} | ${sourceInfo.padEnd(50)} | ${message}`,
			);
			break;
		case 'success':
			console.log(
				`${chalk.bold.green('SUCCESS'.padEnd(PAD_LENGTH))}| ${timestamp} | ${sourceInfo.padEnd(50)} | ${message}`,
			);
			break;
		case 'warning':
			console.log(
				`${chalk.bold.yellow('WARN'.padEnd(PAD_LENGTH))}| ${timestamp} | ${sourceInfo.padEnd(50)} | ${message}`,
			);
			break;
		case 'info':
			console.log(
				`${chalk.bold.blue('INFO'.padEnd(PAD_LENGTH))}| ${timestamp} | ${sourceInfo.padEnd(50)} | ${message}`,
			);
			break;
		default:
			console.log(
				`${chalk.bold.white('LOG'.padEnd(PAD_LENGTH))}| ${timestamp} | ${sourceInfo.padEnd(50)} | ${message}`,
			);
			break;
	}
}
