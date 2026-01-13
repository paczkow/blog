import { useEffect } from "react";
import { searchQuery } from "@/stores/searchQuery";
import { SearchInput } from "./Input";

export const SearchSidebar = ({
	icons,
}: {
	icons?: React.ReactNode;
}) => {
	useEffect(() => {
		return () => {
			searchQuery.set("");
		}
	}, []);

	return (
		<div className="flex flex-col gap-4 h-full">
			<h2 className="text-sand-12 mb-4 font-semibold">Writing</h2>
			<p className="text-sand-11 mb-4">Find all my writing here</p>
			<SearchInput
				onChange={(query) => {
					searchQuery.set(query);
				}}
			/>
			{icons}
		</div>
	);
};
