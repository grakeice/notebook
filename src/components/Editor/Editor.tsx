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
import { type EditorState, type SerializedEditorState } from "lexical";
import { useEffect, useState } from "react";
import { Note } from "../../core/models";
import { useDebounce } from "../../hooks";
import { ToolbarPlugin } from "../../plugins/ToolbarPlugin";
import { WordCounterPlugin } from "../../plugins/WordCounterPlugin";
import { updateWordCount } from "../../plugins/WordCounterPlugin/utils";
import style from "./Editor.module.css";
import { noteService } from "../../core/services";

interface EditorProps {
	selectedNote?: Note | null;
}

export const Editor: React.FC<EditorProps> = ({ selectedNote }) => {
	const [currentNote, setCurrentNote] = useState<Note | null>(null);
	const [wordCount, setWordCount] = useState({ characters: 0, words: 0 });
	const [editorKey, setEditorKey] = useState(0);

	// selectedNoteが変更された時の処理
	useEffect(() => {
		if (selectedNote) {
			setCurrentNote(selectedNote);
			setEditorKey((prev) => prev + 1);
		} else {
			// 新しいノートを作成
			const newNote = new Note({});
			setCurrentNote(newNote);
			setEditorKey((prev) => prev + 1);
		}
	}, [selectedNote]);

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
		// 安全なエディターステートの設定
		editorState: currentNote
			? getValidEditorState(currentNote.content as SerializedEditorState)
			: undefined,
	};

	const debouncedUpdateNote = useDebounce(async (editorState: EditorState) => {
		if (!currentNote) return;

		try {
			currentNote.updateContent(editorState.toJSON());
			await noteService.saveNote(currentNote);
		} catch (error) {
			console.error("Failed to save note:", error);
		}
	}, 1000);

	const handleEditorChange = (editorState: EditorState) => {
		updateWordCount(editorState, setWordCount);
		debouncedUpdateNote(editorState);
	};

	// タイトル変更のデバウンス
	const debouncedUpdateTitle = useDebounce(async (title: string) => {
		if (!currentNote) return;

		try {
			currentNote.updateTitle(title);
			await noteService.saveNote(currentNote);
		} catch (error) {
			console.error("Failed to save title:", error);
		}
	}, 500);

	// currentNoteがない場合の表示
	if (!currentNote) {
		return (
			<div className={style.editor}>
				<div className={style.placeholder}>
					<h2>ノートを選択してください</h2>
					<p>
						左のサイドバーからノートを選択するか、新しいノートを作成してください。
					</p>
				</div>
			</div>
		);
	}

	return (
			<div className={style.editor}>
				{/* ノートタイトル表示 */}
				<div className={style.noteHeader}>
					<input
						type="text"
						value={currentNote.title}
						onChange={(e) => {
							currentNote.title = e.target.value; // 一時的に更新
							debouncedUpdateTitle(e.target.value); // デバウンスで保存
						}}
						className={style.titleInput}
						placeholder="ノートのタイトル"
					/>
					<div className={style.noteInfo}>
						<span className={style.lastModified}>
							最終更新: {currentNote.dateLastModified.toLocaleString("ja-JP")}
						</span>
					</div>
				</div>

				<LexicalComposer key={editorKey} initialConfig={initialConfig}>
					<ToolbarPlugin />
					<RichTextPlugin
						contentEditable={<ContentEditable />}
						placeholder={
							<div className={style.editorPlaceholder}>
								ここにテキストを入力してください...
							</div>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<HistoryPlugin />
					<AutoFocusPlugin />
					<ListPlugin />
					<TabIndentationPlugin />
					<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					<OnChangePlugin onChange={handleEditorChange} />
					<WordCounterPlugin
						wordCount={wordCount}
						setWordCount={setWordCount}
					/>
				</LexicalComposer>
			</div>
	);
};
