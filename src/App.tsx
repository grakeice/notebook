/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useState, useEffect } from "react";
import { Editor } from "./components/Editor";
import { Sidebar } from "./components/Sidebar";
import { Note } from "./core/models";
import styles from "./App.module.css";

export const App: React.FC = () => {
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [deletedNoteId, setDeletedNoteId] = useState<string | undefined>();
	const [isMobile, setIsMobile] = useState(false);
	const [showSidebar, setShowSidebar] = useState(true);

	// モバイル画面かどうかを判定
	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth <= 768;
			setIsMobile(mobile);
			// モバイルでノートが選択されていない場合はサイドバーを表示
			if (mobile && !selectedNote) {
				setShowSidebar(true);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [selectedNote]);

	const handleNoteDeleted = (noteId: string) => {
		setDeletedNoteId(noteId);
		// 少し後にリセット（保存処理が完了するまで）
		setTimeout(() => setDeletedNoteId(undefined), 100);
	};

	const handleNoteSelect = (note: Note | null) => {
		setSelectedNote(note);
		// モバイルでノートが選択されたらエディターを表示
		if (isMobile && note) {
			setShowSidebar(false);
		}
	};

	// モバイルでサイドバーに戻る
	const handleBackToSidebar = () => {
		if (isMobile) {
			setShowSidebar(true);
		}
	};

	return (
		<div className={styles["editor-container"]}>
			<Sidebar
				onNoteSelect={handleNoteSelect}
				selectedNoteId={selectedNote?.ID}
				onNoteDeleted={handleNoteDeleted}
				className={
					isMobile ? (showSidebar ? styles.mobileVisible : styles.mobileHidden) : ""
				}
			/>
			<Editor
				selectedNote={selectedNote}
				deletedNoteId={deletedNoteId}
				onBackToSidebar={handleBackToSidebar}
				isMobile={isMobile}
				showInMobile={isMobile ? !showSidebar : true}
			/>
		</div>
	);
};
