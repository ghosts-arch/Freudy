import {
	access,
	mkdir,
	readdir,
	readFile,
	rename,
	stat,
	unlink,
	writeFile,
} from "node:fs/promises";
import path from "node:path";

const getTimeStamp = (): string => {
	return new Date().toISOString();
};

enum Levels {
	INFO = "info",
	ERROR = "error",
}

interface Log {
	level: Levels;
	message: string;
	timestamp: string;
}

const LOGS_DIRECTORY_PATH = path.resolve(__dirname, "../../logs");

const LOGS_FILE_PATH = path.join(LOGS_DIRECTORY_PATH, "logs.json");

const writeLog = async (log: Log) => {
	const logs: Log[] = JSON.parse(await readFile(LOGS_FILE_PATH, "utf-8"));
	logs.push(log);
	await writeFile(LOGS_FILE_PATH, JSON.stringify(logs, null, 2), {
		encoding: "utf-8",
	});
};

const createNewFileLog = async () => {
	await writeFile(LOGS_FILE_PATH, JSON.stringify([]));
};

const rotateFile = async () => {
	if ((await stat(LOGS_FILE_PATH)).size > 5 * 1024 * 1024) {
		await rename(
			LOGS_FILE_PATH,
			path.join(LOGS_DIRECTORY_PATH, `logs-${Date.now()}.json`),
		);
		await createNewFileLog();
	}

	const logsFiles = (await readdir(LOGS_DIRECTORY_PATH))
		.filter((file) => file.match("logs-[0-9]{13}.json"))
		.sort();

	if (logsFiles.length > 10) {
		await unlink(path.join(LOGS_DIRECTORY_PATH, logsFiles[0]));
	}
};

const log = async (message: string, level: Levels = Levels.INFO) => {
	await mkdir(LOGS_DIRECTORY_PATH, { recursive: true });
	try {
		await access(LOGS_FILE_PATH);
	} catch {
		await createNewFileLog();
	}
	try {
		const logEntry: Log = {
			message: message,
			level: level,
			timestamp: getTimeStamp(),
		};
		console.log(logEntry);
		await writeLog(logEntry);
		await rotateFile();
	} catch (err) {
		console.error(err);
	}
};

export const info = async (message: string, level = Levels.INFO) => {
	await log(message, level);
};

export const error = async (message: string, level = Levels.ERROR) => {
	await log(message, level);
};
