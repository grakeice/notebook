import { useEffect, useState } from "react";
import styles from "./ToolbarPlugin.module.css";
import { TbArticle, TbH1, TbH2, TbH3 } from "react-icons/tb";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
} from "lexical";
import {
	$createHeadingNode,
	$isHeadingNode,
	type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

const SupportedBlockType = {
	paragraph: "Paragraph",
	h1: "Heading 1",
	h2: "Heading 2",
	h3: "Heading 3",
	h4: "Heading 4",
	h5: "Heading 5",
	h6: "Heading 6",
} as const;
type BlockType = keyof typeof SupportedBlockType;

export const ToolbarPlugin: React.FC = () => {
	const [editor] = useLexicalComposerContext();
	const [blockType, setBlockType] = useState<BlockType>("paragraph");

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const selection = $getSelection();

				if (!$isRangeSelection(selection)) return;

				const anchorNode = selection.anchor.getNode();

				const targetNode =
					anchorNode.getKey() === "root"
						? anchorNode
						: anchorNode.getTopLevelElementOrThrow();

				if ($isHeadingNode(targetNode)) {
					const tag = targetNode.getTag();
					setBlockType(tag);
				} else {
					const nodeType = targetNode.getType();
					if (nodeType in SupportedBlockType) {
						setBlockType(nodeType as BlockType);
					} else {
						setBlockType("paragraph");
					}
				}
			});
		});
	});

	const format = (headingSize: HeadingTagType | "paragraph") => {
		if (blockType !== headingSize) {
			editor.update(() => {
				const selection = $getSelection();
				switch (headingSize) {
					case "paragraph":
						if ($isRangeSelection(selection)) {
							$setBlocksType(selection, () => $createParagraphNode());
						}
						break;
					default:
						if ($isRangeSelection(selection)) {
							$setBlocksType(selection, () => $createHeadingNode(headingSize));
						}
				}
			});
		}
	};

	return (
		<div className={styles.toolbar}>
			<button
				type="button"
				role="checkbox"
				title={SupportedBlockType["paragraph"]}
				aria-label={SupportedBlockType["paragraph"]}
				aria-checked={blockType === "paragraph"}
				onClick={() => format("paragraph")}>
				<TbArticle />
			</button>
			<button
				type="button"
				role="checkbox"
				title={SupportedBlockType["h1"]}
				aria-label={SupportedBlockType["h1"]}
				aria-checked={blockType === "h1"}
				onClick={() => format("h1")}>
				<TbH1 />
			</button>
			<button
				type="button"
				role="checkbox"
				title={SupportedBlockType["h2"]}
				aria-label={SupportedBlockType["h2"]}
				aria-checked={blockType === "h2"}
				onClick={() => format("h2")}>
				<TbH2 />
			</button>
			<button
				type="button"
				role="checkbox"
				title={SupportedBlockType["h3"]}
				aria-label={SupportedBlockType["h3"]}
				aria-checked={blockType === "h3"}
				onClick={() => format("h3")}>
				<TbH3 />
			</button>
		</div>
	);
};
