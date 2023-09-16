"use client";
import {
	Box,
	Card,
	CardBody,
	Container,
	Heading,
	ListItem,
	OrderedList,
	Stack,
	Text,
	Link as ChakraLink,
	Flex,
	Button,
} from "@chakra-ui/react";
import React from "react";
import { Folder } from "../../../../pages/api/utils/fileTreeJsonCreator";
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: URL, folderList: string[]) =>
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
		body: JSON.stringify({ folderList }), // body data type must match "Content-Type" header
	}).then((res) => res.json());

export const FolderViewPage = () => {
	const params = useParams();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	if (!searchParams) throw Error();
	if (!params) throw Error();
	const pathList = params.slug;
	if (!Array.isArray(pathList)) throw Error();
	if (!Array.isArray(pathList)) throw Error();
	const { data, error } = useSWR(
		["/api/get_nested_file_structure", pathList],
		([url, token]) => fetcher(url as unknown as URL, token),
	);
	if (error) return <div>{JSON.stringify(error)}</div>;
	if (!data) return <div>Loading...</div>;
	const folder = data as Folder;

	return (
		<Box bgColor="blue.100" w="100%" minH="100vh" alignItems="center" py="10">
			<Container alignItems="center">
				<Card>
					<CardBody>
						<Stack direction={["column"]} spacing="24px" h="100%">
							<Flex pb="6">
								<Heading fontSize="6xl" flex="1">
									{folder.name}
								</Heading>
								<Button
									onClick={() => {
										if (pathList.length === 1) router.replace("/");
										// const newPathList = pathList.slice(0, pathList.length - 1);
										// const pathString = `/folder/${newPathList.join(
										// 	"/",
										// )}?file-type=folder`;
										// console.log("newPathList:", pathString, newPathList);
										// router.replace(pathString);
									}}
								>
									{"Go back"}
								</Button>
							</Flex>

							<OrderedList>
								{Object.values(folder.children).map((child, index) => {
									if (child.isDir)
										return (
											<Box key={index} as="div" bgColor="red">
												<Link
													href={{
														pathname: pathname + "/" + child.name,
														query: { isDir: true },
													}}
												>
													{child.name}
												</Link>
											</Box>
										);
									const routeString = `${pathname}/${child.name}?file-type=md`;
									router.prefetch(routeString);
									return (
										<ListItem
											key={index}
											onClick={() => router.push(routeString)}
											py="2"
											fontWeight={400}
										>
											<ChakraLink as={Link} href={routeString} color="blue.500">
												{child.name.split(".")[0]}
											</ChakraLink>
										</ListItem>
									);
								})}
							</OrderedList>
						</Stack>
					</CardBody>
				</Card>
			</Container>
		</Box>
	);
};
