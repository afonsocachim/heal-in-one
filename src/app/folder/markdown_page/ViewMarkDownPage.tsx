//useSWR allows the use of SWR inside function components
"use client";
import useSWR from "swr";
import {
	Box,
	Button,
	Card,
	CardBody,
	Container,
	Flex,
	Heading,
	IconButton,
} from "@chakra-ui/react";
import { Token } from "marked";
import "react-json-view-lite/dist/index.css";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { RenderTokenArray } from "./token_view_renderer";
import { PiBookOpenTextLight } from "react-icons/pi";
import { JsonView } from "react-json-view-lite";

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

export default function ViewMarkDownPage({ pathList }: { pathList: string[] }) {
	const router = useRouter();
	const pathname = usePathname();

	if (!pathname) throw Error();
	if (!router) throw Error();
	const { data, error } = useSWR(
		["/api/get_parsed_markdown", pathList],
		([url, token]) => fetcher(url as unknown as URL, token),
	);

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

	const tokenArr = data as Token[];

	return (
		<Box bgColor="blue.100" w="100%" minH="100vh" alignItems="center" py="10">
			<Container alignItems="center" maxW="800px">
				<Card>
					<CardBody>
						<Flex pb="6" direction={{ base: "column", md: "row" }}>
							<Heading flex="1" fontSize="4xl">
								{pathList[pathList.length - 1].split(".")[0]}
							</Heading>
							<Flex pt="2">
								<Box pr="2">
									<Button
										onClick={() => {
											const newPathList = pathList.slice(
												0,
												pathList.length - 1,
											);
											const pathString = `/folder/${newPathList.join(
												"/",
											)}?file-type=folder`;
											console.log("newPathList:", pathString, newPathList);
											router.replace(pathString);
										}}
									>
										{"Go back"}
									</Button>
								</Box>
								<IconButton
									variant="outline"
									colorScheme="blue"
									aria-label="study"
									fontSize="20px"
									icon={<PiBookOpenTextLight />}
									onClick={() => {
										const newRouteString =
											pathname + "?file-type=md&study=true";
										router.push(newRouteString);
									}}
								/>
							</Flex>
						</Flex>
						<RenderTokenArray tokenArr={tokenArr} />
						<JsonView data={tokenArr} />
					</CardBody>
				</Card>
			</Container>
		</Box>
	);
}
