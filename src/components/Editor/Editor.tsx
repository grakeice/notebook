/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
	$getRoot,
	$getSelection,
	type EditorState,
	type SerializedEditorState,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "react-use";
import { Note } from "../../core/models";
import { noteService } from "../../core/services";
import { EditorHeaderPlugin } from "../../plugins/EditorHeaderPlugin";
import { ToolbarPlugin } from "../../plugins/ToolbarPlugin";
import { WordCounterPlugin } from "../../plugins/WordCounterPlugin";
import { countWords } from "../../plugins/WordCounterPlugin/utils";
import styles from "./Editor.module.css";

interface EditorProps {
	selectedNote?: Note | null;
	deletedNoteId?: string; // 削除されたノートのIDを追加
}

export const Editor: React.FC<EditorProps> = (props) => {
	const [currentNote, setCurrentNote] = useState<Note | null>(null);
	const [titleValue, setTitleValue] = useState<string>(""); // タイトル用の状態を追加
	const [wordCount, setWordCount] = useState({ characters: 0, words: 0 });
	const currentEditorStateRef = useRef<EditorState | null>(null);
	const previousNoteRef = useRef<Note | null>(null);

	// selectedNoteが変わったときの処理
	useEffect(() => {
		console.log(`Selected note has changed to: ${props.selectedNote?.ID}`);
		if (props.selectedNote) {
			setTitleValue(props.selectedNote.title); // タイトル状態を更新
		} else {
			setTitleValue(""); // タイトル状態をリセット
		}
	}, [props.selectedNote]);

	useEffect(() => {
		// 前のノートを保存
		const savePreviousNote = async () => {
			if (previousNoteRef.current && currentEditorStateRef.current) {
				// 削除されたノートは保存しない
				if (
					props.deletedNoteId &&
					previousNoteRef.current.ID === props.deletedNoteId
				) {
					console.log(`Skipping save for deleted note: ${props.deletedNoteId}`);
					return;
				}

				try {
					previousNoteRef.current.updateContent(
						currentEditorStateRef.current.toJSON()
					);
					const message = await noteService.saveNoteIfChanged(
						previousNoteRef.current
					);
					console.log(
						`ID: ${message.id}\nSaved: ${message.saved}\nReason: ${message.reason}`
					);
				} catch (error) {
					console.error("Failed to save previous note:", error);
				}
			}
		};

		if (props.selectedNote?.ID !== currentNote?.ID) {
			savePreviousNote();
		}

		// 現在のノートを更新
		previousNoteRef.current = currentNote;
		if (props.selectedNote) {
			setCurrentNote(props.selectedNote);
		} else if (props.selectedNote === null) {
			setCurrentNote(null);
		}
	}, [props.selectedNote, currentNote, props.deletedNoteId]);

	// エディターステートの妥当性をチェックする関数
	const getValidEditorState = (
		content: SerializedEditorState | Record<string, unknown> | undefined
	): string | undefined => {
		if (!content) return undefined;

		try {
			// すでに文字列の場合はそのまま返す
			if (typeof content === "string") {
				const parsed = JSON.parse(content);
				// root要素とchildrenが存在するかチェック
				if (
					parsed.root &&
					parsed.root.children &&
					Array.isArray(parsed.root.children)
				) {
					return content;
				}
			}

			// オブジェクトの場合は文字列化してから検証
			if (typeof content === "object") {
				const contentStr = JSON.stringify(content);
				const parsed = JSON.parse(contentStr);

				// 有効なエディターステートの構造をチェック
				if (
					parsed.root &&
					parsed.root.children &&
					Array.isArray(parsed.root.children)
				) {
					return contentStr;
				}
			}
		} catch (error) {
			console.warn("Invalid editor state content:", error);
		}

		// 無効な場合はundefinedを返してデフォルトの空エディターステートを使用
		return undefined;
	};

	const initialConfig = {
		namespace: "Editor",
		onError: (error: Error) => console.error(error),
		nodes: [HeadingNode, CodeNode, QuoteNode, ListNode, ListItemNode, LinkNode],
		theme: {
			list: {
				nested: {
					listitem: "list-item-nested",
				},
				ol: "list-ordered",
				ul: "list-unordered",
				listitem: "list-item",
			},
		},
		editorState: currentNote
			? getValidEditorState(currentNote.content as SerializedEditorState)
			: undefined,
	};

	useDebounce(
		async () => {
			const editorState = currentEditorStateRef.current;
			if (!currentNote || !editorState) return;

			try {
				currentNote.updateContent(editorState.toJSON());
				const message = await noteService.saveNoteIfChanged(currentNote);
				console.log(
					`ID: ${message.id}\nSaved: ${message.saved}\nReason: ${message.reason}`
				);
			} catch (error) {
				console.error("Failed to save note:", error);
			}
		},
		1000,
		[currentEditorStateRef.current]
	);

	const handleEditorChange = (editorState: EditorState) => {
		currentEditorStateRef.current = editorState; // refに保存
		editorState.read(() => {
			const selection = $getSelection();
			if (selection?.getTextContent() !== "" && selection) {
				setWordCount(countWords(selection.getTextContent()));
			} else {
				setWordCount(countWords($getRoot().getTextContent()));
			}
		});
	};

	// タイトル変更のデバウンス
	useDebounce(
		async () => {
			const title = titleValue;
			if (!currentNote) return;

			// タイトルの差分チェック
			if (title === currentNote.title) {
				console.log(`No title change detected for note: ${currentNote.ID}`);
				return;
			}

			try {
				currentNote.updateTitle(title);
				await noteService.saveNote(currentNote);
				console.log(`Title updated successfully: ${currentNote.ID}`);
			} catch (error) {
				console.error("Failed to save title:", error);
			}
		},
		1000,
		[titleValue]
	);

	// currentNoteがない場合の表示
	if (!currentNote) {
		return (
			<div className={styles.editor}>
				<div className={styles.placeholder}>
					<h2>ノートを選択してください</h2>
					<p>
						左のサイドバーからノートを選択するか、新しいノートを作成してください。
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.editor}>
			<LexicalComposer key={currentNote.ID} initialConfig={initialConfig}>
				<EditorHeaderPlugin
					noteID={props.selectedNote?.ID}
					title={titleValue}
					dateLastModified={currentNote.dateLastModified}
					onChange={(e) => {
						setTitleValue(e.target.value);
					}}
				/>
				<ToolbarPlugin />
				<RichTextPlugin
					contentEditable={<ContentEditable />}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<AutoFocusPlugin />
				<ListPlugin />
				<TabIndentationPlugin />
				<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
				<OnChangePlugin onChange={handleEditorChange} />
				<WordCounterPlugin wordCount={wordCount} />
			</LexicalComposer>
		</div>
	);
};
