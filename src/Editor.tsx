import style from "./Editor.module.css";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { CODE, HEADING } from "@lexical/markdown";
import { HeadingNode } from "@lexical/rich-text";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { CodeNode } from "@lexical/code";
import { Note } from "./core/Note";

export const Editor: React.FC = () => {
	const initialConfig = {
		namespace: "Editor",
		onError: (error: Error) => console.error(error),
		nodes: [HeadingNode, CodeNode],
	};
	const note = new Note();
	return (
		<div className={style.editor}>
			<LexicalComposer initialConfig={initialConfig}>
				<ToolbarPlugin />
				<RichTextPlugin
					contentEditable={<ContentEditable />}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<AutoFocusPlugin />
				<MarkdownShortcutPlugin transformers={[HEADING, CODE]} />
				<OnChangePlugin
					onChange={(editorState) => {
						note.updateContent(editorState.toJSON());
						console.log(note);
					}}
				/>
			</LexicalComposer>
		</div>
	);
};
