import { $getRoot, type EditorState } from "lexical";

export type WordCounterPluginProps = {
	wordCount: { characters: number; words: number };
	setWordCount({
		characters,
		words,
	}: {
		characters: number;
		words: number;
	}): void;
};

export const updateWordCount = (
	editorState: EditorState,
	setWordCount: WordCounterPluginProps["setWordCount"]
) => {
	editorState.read(() => {
		const root = $getRoot();
		const textContent = root.getTextContent();

		const characterCount = [...textContent].length;
		const wordCount = textContent
			.trim()
			.split(/\s+/)
			.filter((word) => [...word].length > 0).length;

		setWordCount({
			characters: characterCount,
			words: textContent.trim() === "" ? 0 : wordCount,
		});
	});
};
