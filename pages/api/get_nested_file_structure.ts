import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import {
	fileTreeJsonCreator,
	Folder,
	Local_File,
} from "./utils/fileTreeJsonCreator";

const getNestedOb = (f: Folder, nextFoldersList: string[]): Folder => {
	const nextFolderName = nextFoldersList[0];
	if (nextFoldersList.length <= 1) {
		const finalReturn = f.children[nextFolderName] as Folder;
		return finalReturn;
	}
	const nextFolder = f.children[nextFolderName] as Folder;
	nextFoldersList.shift();
	return getNestedOb(nextFolder, nextFoldersList);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const folderList = req.body.folderList as string[];
	//Find the absolute path of the json directory
	let fileTree: null | Folder = null;
	const fileDirectory = path.join(process.cwd(), "markdown");
	//Read the json data file data.json
	if (!fileTree)
		fileTree = await fileTreeJsonCreator({
			name: "root",
			path: fileDirectory,
			isDir: true,
			children: {},
		});

	const currentFolder = getNestedOb(fileTree, folderList);
	const newChildren: {
		[x: string]: Folder | Local_File;
	} = { ...currentFolder.children };
	Object.entries(currentFolder.children).forEach(([_, child]) => {
		if (child.isDir) {
			const newChild: Folder | Local_File = {
				...child,
				children: {},
			};
			newChildren[child.name] = newChild;
		}
	});
	currentFolder.children = newChildren;

	res.status(200).json(currentFolder);
}
