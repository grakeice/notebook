/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useState } from "react";
import { Editor } from "./components/Editor";
import { Sidebar } from "./components/Sidebar";
import { Note } from "./core/models";
import styles from "./App.module.css";

export const App: React.FC = () => {
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [deletedNoteId, setDeletedNoteId] = useState<string | undefined>();

	const handleNoteDeleted = (noteId: string) => {
		setDeletedNoteId(noteId);
		// 少し後にリセット（保存処理が完了するまで）
		setTimeout(() => setDeletedNoteId(undefined), 100);
	};

	const handleNoteSelect = (note: Note | null) => {
		setSelectedNote(note);
	};

	return (
		<div className={styles["editor-container"]}>
			<Sidebar
				onNoteSelect={handleNoteSelect}
				selectedNoteId={selectedNote?.ID}
				onNoteDeleted={handleNoteDeleted}
			/>
			<Editor selectedNote={selectedNote} deletedNoteId={deletedNoteId} />
		</div>
	);
};
