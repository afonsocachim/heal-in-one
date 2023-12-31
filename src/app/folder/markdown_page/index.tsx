//useSWR allows the use of SWR inside function components
"use client";
import useSWR from "swr";
import {
	Box,
	Button,
	Card,
	CardBody,
	Center,
	Container,
	Flex,
	Grid,
	GridItem,
	Heading,
	Progress,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Token } from "marked";
import "react-json-view-lite/dist/index.css";
import React from "react";
import {
	useParams,
	useSearchParams,
	useRouter,
	usePathname,
} from "next/navigation";
import "react-json-view-lite/dist/index.css";
import ViewMarkDownPage from "./ViewMarkDownPage";
import { TokenQuestionRenderer } from "./token_question_renderer";
import { TokenAnswerRenderer } from "./token_answer_renderer";
import { shuffleArray } from "../../../../pages/api/utils/shuffleArray";
import { parser } from "../../../../pages/api/utils/parser";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url: URL, pathList: string[]) =>
	fetch(url, {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify({ pathList }), // body data type must match "Content-Type" header
	}).then((res) => res.json());

export default function MarkdownPage() {
	//Set up SWR to run the fetcher function when calling "/api/staticdata"
	//There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
	const [IsQuestion, setIsQuestion] = React.useState(true);
	const [CurQuestionPos, setCurQuestionPos] = React.useState(0);
	const [TotalRight, setTotalRight] = React.useState(0);

	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [TokenArr, setTokenArr] = React.useState<any[]>([]);

	if (!pathname) throw Error();
	if (!router) throw Error();
	if (!searchParams) throw Error();
	if (!params) throw Error();
	const isStudy = searchParams.get("study") === "true";
	const slugList = params.slug;
	if (!Array.isArray(slugList)) throw Error();
	const pathList = slugList.map((i) => decodeURI(i));
	const { data, error } = useSWR(
		["/api/get_study_array", pathList],
		([url, token]) => fetcher(url as unknown as URL, token),
	);
	React.useEffect(() => {
		setIsQuestion(true);
	}, [CurQuestionPos]);
	React.useEffect(() => {
		if (!data) return;
		const lineArr = data.split("\n") as string[];
		const filtered = lineArr
			.filter((s) => s !== "")
			.filter((s) => s.includes("{{c:"))
			.map((s) => s.replace("- ", ""));
		const lowered = filtered.map((i) => {
			const newI = i.trim();
			console.log("I:, ", i);
			return newI[0].toLowerCase() + newI.slice(1);
		});
		const parsed = lowered.map((s) => parser(s)[0]);
		const shuffled = shuffleArray(parsed);
		setTokenArr(shuffled);
	}, [data]);
	if (error) return <div>{JSON.stringify(error)}</div>;
	if (!data)
		return (
			<Box
				bgColor="blue.100"
				w="100%"
				minH="100vh"
				alignItems="center"
				py="10"
			/>
		);

	const percentageDone = (CurQuestionPos / TokenArr.length) * 100;
	const percentageRight = Math.round((TotalRight / TokenArr.length) * 100);
	const questionsFinished = CurQuestionPos >= TokenArr.length;
	if (isStudy) {
		return (
			<>
				<Flex direction="column" gap={4} minH="100vh">
					<Box p="4">
						<Progress colorScheme="green" size="lg" value={percentageDone} />
					</Box>
					{questionsFinished && (
						<>
							<Flex
								flex="1"
								minH="300"
								justifyContent="center"
								alignItems="center"
							>
								<Box>
									<Heading>Percentage Correct: {percentageRight}%</Heading>
								</Box>
							</Flex>
						</>
					)}
					{CurQuestionPos < TokenArr.length && (
						<>
							<Flex flex="1" minH="300" justifyContent="center" p="4">
								{IsQuestion && (
									<Box>
										Na{" "}
										<Text as="span" fontWeight="bold">
											cólica renal{" "}
										</Text>
										<TokenQuestionRenderer
											tokenArr={TokenArr[CurQuestionPos].tokens}
										/>
									</Box>
								)}
								{!IsQuestion && (
									<Box>
										Na{" "}
										<Text as="span" fontWeight="bold">
											cólica renal{" "}
										</Text>
										<TokenAnswerRenderer
											tokenArr={TokenArr[CurQuestionPos].tokens}
										/>
									</Box>
								)}
							</Flex>
							<Box p="4">
								{IsQuestion && (
									<Flex justifyContent="center">
										<Box px="6">
											<Button minW="100" onClick={() => setIsQuestion(false)}>
												Show Answer
											</Button>
										</Box>
									</Flex>
								)}
								{!IsQuestion && (
									<Flex justifyContent="center">
										<Box px="6">
											<Button
												minW="100"
												variant="ghost"
												colorScheme="red"
												onClick={() => {
													setCurQuestionPos(CurQuestionPos + 1);
												}}
											>
												Wrong
											</Button>
										</Box>
										<Box px="6">
											<Button
												minW="100"
												variant="ghost"
												colorScheme="green"
												onClick={() => {
													setCurQuestionPos(CurQuestionPos + 1);
													setTotalRight(TotalRight + 1);
												}}
											>
												Right
											</Button>
										</Box>
									</Flex>
								)}
							</Box>
						</>
					)}
					<Box p="4">
						<Flex>
							<Box flex="1">
								<Text>
									Topic: {pathList[pathList.length - 1].split(".")[0]}
								</Text>
							</Box>
							<Flex direction={{ base: "column", md: "row" }}>
								{questionsFinished && (
									<Box pb="2" pr="2">
										<Button
											onClick={() => {
												setIsQuestion(true);
												setCurQuestionPos(0);
												setTotalRight(0);
											}}
										>
											{"Try Again"}
										</Button>
									</Box>
								)}
								<Button
									onClick={() => {
										setIsQuestion(true);
										setCurQuestionPos(0);
										setTotalRight(0);
										router.replace(pathname + "?file-typ=md");
									}}
								>
									{"View topic"}
								</Button>
							</Flex>
						</Flex>
					</Box>
				</Flex>
			</>
		);
	}
	return <ViewMarkDownPage pathList={pathList} />;
}
