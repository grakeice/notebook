export type WordCounterPluginProps = {
	wordCount: { characters: number; words: number };
};

export const countWords = (textContent: string) => {
	const characterCount = [...textContent].length;
	const wordCount = textContent
		.trim()
		.split(/\s+/)
		.filter((word) => [...word].length > 0).length;
	return {
		characters: characterCount,
		words: textContent.trim() === "" ? 0 : wordCount,
	};
};
