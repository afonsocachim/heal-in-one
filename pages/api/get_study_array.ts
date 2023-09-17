import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { parser } from "./utils/parser";

const joinPaths = (curPath: string, futurePaths: string[]): string => {
	if (futurePaths.length === 0) return curPath;
	const localFuturePaths = [...futurePaths];
	const pathToAdd = localFuturePaths.shift();
	if (!pathToAdd) throw Error();
	const newPath = path.join(curPath, pathToAdd);
	return joinPaths(newPath, localFuturePaths);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const pathList = req.body.pathList as string[];
	const fileName = pathList.pop();
	//Find the absolute path of the json directory
	const fileDirectory = joinPaths(
		path.join(process.cwd(), "markdown"),
		pathList,
	);
	//Read the json data file data.json
	const fileContents = await fs.readFile(
		fileDirectory + `/${fileName}`,
		"utf8",
	);
	// const parsed = parser(fileContents);

	res.status(200).json(fileContents);
}
