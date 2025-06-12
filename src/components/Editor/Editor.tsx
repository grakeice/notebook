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
	type EditorState,
	type SerializedEditorState,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { Note } from "../../core/models";
import { noteService } from "../../core/services";
import { useDebounce } from "../../hooks";
import { ToolbarPlugin } from "../../plugins/ToolbarPlugin";
import { WordCounterPlugin } from "../../plugins/WordCounterPlugin";
import { countWords } from "../../plugins/WordCounterPlugin/utils";
import styles from "./Editor.module.css";

interface EditorProps {
	selectedNote?: Note | null;
	deletedNoteId?: string; // 削除されたノートのIDを追加
}

export const Editor: React.FC<EditorProps> = ({
	selectedNote,
	deletedNoteId,
}) => {
	const [currentNote, setCurrentNote] = useState<Note | null>(null);
	const [titleValue, setTitleValue] = useState<string>(""); // タイトル用の状態を追加
	const [wordCount, setWordCount] = useState({ characters: 0, words: 0 });
	const currentEditorStateRef = useRef<EditorState | null>(null);
	const previousNoteRef = useRef<Note | null>(null);
	const lastSavedContentRef = useRef<string | null>(null);

	// selectedNoteが変わったときの処理
	useEffect(() => {
		console.log(`Selected note has changed to: ${selectedNote?.ID}`);

		// 新しいノートの最後に保存したコンテンツを記録
		if (selectedNote) {
			lastSavedContentRef.current = JSON.stringify(selectedNote.content);
			setTitleValue(selectedNote.title); // タイトル状態を更新
		} else {
			lastSavedContentRef.current = null;
			setTitleValue(""); // タイトル状態をリセット
		}
	}, [selectedNote]);

	useEffect(() => {
		// 前のノートを保存
		const savePreviousNote = async () => {
			if (previousNoteRef.current && currentEditorStateRef.current) {
				// 削除されたノートは保存しない
				if (deletedNoteId && previousNoteRef.current.ID === deletedNoteId) {
					console.log(`Skipping save for deleted note: ${deletedNoteId}`);
					return;
				}

				// 差分チェック
				const currentContent = JSON.stringify(
					currentEditorStateRef.current.toJSON()
				);
				const savedContent = JSON.stringify(previousNoteRef.current.content);

				if (currentContent === savedContent) {
					console.log(
						`No changes detected for note: ${previousNoteRef.current.ID}`
					);
					return;
				}

				try {
					previousNoteRef.current.updateContent(
						currentEditorStateRef.current.toJSON()
					);
					const prevID = previousNoteRef.current.ID;
					await noteService.saveNote(previousNoteRef.current);
					console.log(`Previous note saved successfully. (ID: ${prevID})`);
				} catch (error) {
					console.error("Failed to save previous note:", error);
				}
			}
		};

		if (selectedNote?.ID !== currentNote?.ID) {
			savePreviousNote();
		}

		// 現在のノートを更新
		previousNoteRef.current = currentNote;
		if (selectedNote) {
			setCurrentNote(selectedNote);
		} else if (selectedNote === null) {
			setCurrentNote(null);
		}
	}, [selectedNote, currentNote, deletedNoteId]);

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

	const debouncedUpdateNote = useDebounce(async (editorState: EditorState) => {
		if (!currentNote) return;

		// 差分チェック
		const currentContent = JSON.stringify(editorState.toJSON());
		if (currentContent === lastSavedContentRef.current) {
			console.log(`No changes detected for current note: ${currentNote.ID}`);
			return;
		}

		try {
			currentNote.updateContent(editorState.toJSON());
			await noteService.saveNote(currentNote);
			// 保存成功したら最後に保存したコンテンツを更新
			lastSavedContentRef.current = currentContent;
			console.log(`Note saved successfully: ${currentNote.ID}`);
		} catch (error) {
			console.error("Failed to save note:", error);
		}
	}, 1000);

	const handleEditorChange = (editorState: EditorState) => {
		currentEditorStateRef.current = editorState; // refに保存
		setWordCount(
			countWords(editorState.read(() => $getRoot().getTextContent()))
		);
		debouncedUpdateNote(editorState);
	};

	// タイトル変更のデバウンス
	const debouncedUpdateTitle = useDebounce(async (title: string) => {
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
	}, 500);

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
			{/* ノートタイトル表示 */}
			<div className={styles.noteHeader}>
				<input
					type="text"
					value={titleValue} // 状態を使用
					onChange={(e) => {
						setTitleValue(e.target.value); // 状態を更新
						debouncedUpdateTitle(e.target.value); // デバウンスで保存
					}}
					className={styles.titleInput}
					placeholder="ノートのタイトル"
				/>
				<div className={styles.noteInfo}>
					<span className={styles.lastModified}>
						最終更新: {currentNote.dateLastModified.toLocaleString("ja-JP")}
					</span>
				</div>
			</div>

			<LexicalComposer key={currentNote.ID} initialConfig={initialConfig}>
				<ToolbarPlugin />
				<RichTextPlugin
					contentEditable={<ContentEditable />}
					// placeholder={
					// 	<div className={styles.editorPlaceholder}>
					// 		ここにテキストを入力してください...
					// 	</div>
					// }
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
