import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { parser } from "./utils/parser";

const shuffleArray = <T>(array: T[]): T[] => {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
};

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
	const lineArr = fileContents.split("\r\n");
	const filtered = lineArr
		.filter((s) => s !== "")
		.filter((s) => s.includes("{{c:"))
		.map((s) => s.replace("- ", ""));
	const parsed = filtered.map((s) => parser(s)[0]);
	const shuffled = shuffleArray(parsed);

	res.status(200).json(shuffled);
}
