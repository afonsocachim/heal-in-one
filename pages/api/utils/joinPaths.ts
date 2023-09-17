import path from "path";

export const joinPaths = (curPath: string, futurePaths: string[]): string => {
	if (futurePaths.length === 0) return curPath;
	const localFuturePaths = [...futurePaths];
	const pathToAdd = localFuturePaths.shift();
	if (!pathToAdd) throw Error();
	const newPath = path.join(curPath, pathToAdd);
	return joinPaths(newPath, localFuturePaths);
};
