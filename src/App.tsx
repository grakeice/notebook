import { Suspense, useState } from "react";
import { Editor } from "./components/Editor/Editor";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Note } from "./core/models/Note";
import style from "./App.module.css";


export const App: React.FC = () => {
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);

	const handleNoteSelect = (note: Note) => {
		setSelectedNote(note);
	};

	return (
		<div className={style["editor-container"]}>
			<Sidebar
				onNoteSelect={handleNoteSelect}
				selectedNoteId={selectedNote?.id}
			/>
			<Suspense>
				<Editor selectedNote={selectedNote} />
			</Suspense>
		</div>
	);
};
