//useSWR allows the use of SWR inside function components
"use client";
import {
	Box,
	Heading,
	Link,
	OrderedList,
	Text,
	UnorderedList,
} from "@chakra-ui/react";
import { Token } from "marked";
import "react-json-view-lite/dist/index.css";
import React from "react";
import { decodeHtmlEntities } from "../../../../pages/api/utils/htmlEntities";

const leftPadding = "6";

export const TokenRenderBlock = ({ token }: { token: Token }) => {
	const t = token as any;
	let children: string | Token[] | undefined;
	if (t.text) children = decodeHtmlEntities(t.text);
	if (t.clozeNumber) children = t.clozeNumber;
	if (t.tokens) children = t.tokens;
	if (t.items) children = t.items;

	const RenderChildren = () => {
		if (typeof children === "string") return <>{children}</>;
		if (typeof children === "undefined") return <></>;
		if (!Array.isArray(children)) {
			throw Error();
		}
		return <TokenQuestionRenderer tokenArr={children as any} />;
	};

	if (t.type === "paragraph") {
		return (
			<Box pl={leftPadding}>
				<RenderChildren />
			</Box>
		);
	}

	if (token.type === "text") {
		const arr = token.text.split("\n") as string[];
		if (arr.length <= 1) {
			return (
				<Text as="span">
					<RenderChildren />
				</Text>
			);
		}
		const newArr: string[] = [];
		arr.forEach((item, index) => {
			newArr.push(item);
			const thereIsNext = arr[index + 1] !== undefined;
			if (thereIsNext) newArr.push("<br>");
		});

		return (
			<>
				{...newArr.map((i, index) => {
					if (i === "<br>") return <br />;
					return (
						<Heading as="span" key={index} fontSize="lg">
							{i}
						</Heading>
					);
				})}
			</>
		);
	}
	if (token.type === "strong")
		return (
			<Text as="span" textDecoration="underline">
				<RenderChildren />
			</Text>
		);
	if (token.type === "cloze")
		return (
			<Text as="span" bg="blue.100" px="1">
				{`[...]`}
			</Text>
		);

	if (token.type === "Space" || token.raw === "\n\n") return <Box h="0.5em" />;
	return <React.Fragment>{(token as any).text}</React.Fragment>;
};

export const TokenQuestionRenderer = ({ tokenArr }: { tokenArr: Token[] }) => {
	return (
		<>
			{...tokenArr.map((token, index) => {
				return <TokenRenderBlock token={token} key={index} />;
			})}
		</>
	);
};
