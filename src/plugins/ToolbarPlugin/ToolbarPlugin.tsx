/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$createHeadingNode,
	$isHeadingNode,
	type HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
} from "lexical";
import { useEffect, useState } from "react";
import { MDIcon, MDIconButton, MDDivider } from "../../components/MDC";
import styles from "./ToolbarPlugin.module.css";

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
	}, [editor]);

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
			<MDIconButton
				type="button"
				title={SupportedBlockType["paragraph"]}
				aria-label={SupportedBlockType["paragraph"]}
				selected={blockType === "paragraph"}
				onClick={() => format("paragraph")}>
				<MDIcon>article</MDIcon>
			</MDIconButton>

			<MDDivider className={styles.separator} />

			<MDIconButton
				type="button"
				title={SupportedBlockType["h1"]}
				aria-label={SupportedBlockType["h1"]}
				selected={blockType === "h1"}
				onClick={() => format("h1")}>
				<MDIcon>looks_one</MDIcon>
			</MDIconButton>

			<MDIconButton
				type="button"
				title={SupportedBlockType["h2"]}
				aria-label={SupportedBlockType["h2"]}
				selected={blockType === "h2"}
				onClick={() => format("h2")}>
				<MDIcon>looks_two</MDIcon>
			</MDIconButton>

			<MDIconButton
				type="button"
				title={SupportedBlockType["h3"]}
				aria-label={SupportedBlockType["h3"]}
				selected={blockType === "h3"}
				onClick={() => format("h3")}>
				<MDIcon>looks_3</MDIcon>
			</MDIconButton>
		</div>
	);
};
