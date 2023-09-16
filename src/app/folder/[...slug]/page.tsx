"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { FolderViewPage } from "./folder_view_page";
import MarkdownPage from "../markdown_page";

export default function Index() {
	const params = useParams();
	const searchParams = useSearchParams();

	if (!searchParams) throw Error();
	const isFolder = searchParams.get("file-type") === "folder";
	if (!params) throw Error();

	if (isFolder) {
		return <FolderViewPage />;
	}
	return <MarkdownPage />;
}
