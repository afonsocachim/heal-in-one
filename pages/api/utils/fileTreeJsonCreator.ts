import path from "path";
import { promisify } from "util";
import fs from "fs";

const readdirp = promisify(fs.readdir);
const statp = promisify(fs.stat);

export type Local_File = { path: string; name: string; isDir: false };
export type Folder = {
	path: string;
	name: string;
	isDir: true;
	children: { [x: string]: Local_File | Folder };
};

export const fileTreeJsonCreator = async (parent: Folder) => {
	let files = await readdirp(parent.path);

	for (let f of files) {
		let fullPath = path.join(parent.path, f);
		let stat = await statp(fullPath);
		if (stat.isDirectory()) {
			const folder: Folder = {
				name: f,
				path: fullPath,
				isDir: true,
				children: {},
			};
			parent.children[f] = folder;
			await fileTreeJsonCreator(folder);
		} else {
			const mdFile: Local_File = { path: fullPath, name: f, isDir: false };
			parent.children[f] = mdFile;
		}
	}
	return parent;
};
