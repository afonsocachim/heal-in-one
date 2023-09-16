"use client";

import { MedicineSVG } from "@/components/medicine_svg";
import { Container, Stack, Box, Heading, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();
	const routeString = "/folder/ACLS?file-type=folder";
	router.prefetch(routeString);
	return (
		<Container maxW={"7xl"}>
			<Stack
				align={"center"}
				spacing={{ base: 8, md: 10 }}
				direction={{ base: "column", md: "row" }}
			>
				<Stack flex={1} spacing={{ base: 5, md: 10 }}>
					<Heading lineHeight={1.1} fontWeight={600} fontSize="6xl">
						<Text
							as={"span"}
							position={"relative"}
							_after={{
								content: "''",
								width: "full",
								height: "30%",
								position: "absolute",
								bottom: 1,
								left: 0,
								bg: "blue.400",
								zIndex: -1,
							}}
						>
							Heal-In-One
						</Text>
						<Box pb="10" />
						<Text as={"span"} color={"blue.400"}>
							Everything you need!
						</Text>
					</Heading>
					<Text color={"gray.500"}>
						{`Our mission is to provide you with seamless access to essential medical knowledge. Currently, we're laser-focused on ACLS, but are expanding rapidly. Get ready to revolutionize your medical journey with Heal-In-One!`}
					</Text>
					<Stack
						spacing={{ base: 4, sm: 6 }}
						direction={{ base: "column", sm: "row" }}
						minW="400"
					>
						<Button
							rounded={"full"}
							size={"lg"}
							fontWeight={"normal"}
							px={6}
							colorScheme={"blue"}
							bg={"blue.400"}
							_hover={{ bg: "blue.500" }}
							onClick={() => router.push(routeString)}
						>
							Get started with ACLS
						</Button>
					</Stack>
				</Stack>
				<Box w={"full"} pt="2">
					<MedicineSVG w={"100%"} h="100%" />
				</Box>
			</Stack>
		</Container>
	);
}
