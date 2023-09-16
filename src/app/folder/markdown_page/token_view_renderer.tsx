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
		return <RenderTokenArray tokenArr={children as any} />;
	};

	if (t.type === "paragraph") {
		return (
			<Box pl={leftPadding}>
				<RenderChildren />
			</Box>
		);
	}

	if (t.type === "list") {
		if (t.ordered)
			return (
				<OrderedList pl={leftPadding}>
					<RenderChildren />
				</OrderedList>
			);
		return (
			<UnorderedList pl={leftPadding}>
				<RenderChildren />
			</UnorderedList>
		);
	}

	if (token.type === "list_item") {
		return (
			<li>
				<RenderChildren />
			</li>
		);
	}

	if (token.type === "heading") {
		let fontSize = "";
		switch (token.depth) {
			case 1:
				fontSize = "4xl";
				break;
			case 2:
				fontSize = "2xl";
				break;
			case 3:
				fontSize = "xl";
				break;
			case 4:
				fontSize = "lg";
				break;
			case 5:
				fontSize = "md";
				break;
			case 6:
				fontSize = "sm";
		}
		return (
			<>
				<Heading fontSize={fontSize} mt="4" mb="2">
					<RenderChildren />
				</Heading>
			</>
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
		console.log("Splitted text:", newArr);

		return (
			<>
				{...newArr.map((i, index) => {
					if (i === "<br>") return <br />;
					return (
						<Text as="span" key={index}>
							{i}
						</Text>
					);
				})}
			</>
		);
	}

	if (token.type === "cloze")
		return (
			<Text as="span" bg="blue.100" px="1">
				{token.clozeContent}
			</Text>
		);
	if (token.type === "strong")
		return (
			<Text as="span" fontWeight="bold">
				<RenderChildren />
			</Text>
		);

	if (token.type === "link") {
		return (
			<Link href={token.href} color="teal.500" isExternal wordBreak="break-all">
				<RenderChildren />
			</Link>
		);
	}
	if (token.type === "Space" || token.raw === "\n\n") return <Box h="0.5em" />;
	return <React.Fragment>{(token as any).text}</React.Fragment>;
};

export const RenderTokenArray = ({ tokenArr }: { tokenArr: Token[] }) => {
	return (
		<>
			{...tokenArr.map((token, index) => {
				return <TokenRenderBlock token={token} key={index} />;
			})}
		</>
	);
};
