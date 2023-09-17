import path from "path";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { parser } from "./utils/parser";
import { joinPaths } from "./utils/joinPaths";
import { shuffleArray } from "./utils/shuffleArray";

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

	res.status(200).json(lineArr);
}
