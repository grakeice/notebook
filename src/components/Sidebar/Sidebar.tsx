/**
 * Copyright (c) 2025 grakeice
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useEffect, useState } from "react";
import { Note } from "../../core/models/Note";
import { noteService } from "../../core/services/noteService";
import styles from "./Sidebar.module.css";

interface SidebarProps {
	onNoteSelect?: (note: Note | null) => void;
	selectedNoteId?: string;
	onNoteDeleted?: (deletedNoteId: string) => void; // 追加
}

export const Sidebar: React.FC<SidebarProps> = ({
	onNoteSelect,
	selectedNoteId,
	onNoteDeleted, // 追加
}) => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// ノート一覧を取得
	const loadNotes = async () => {
		try {
			setLoading(true);
			setError(null);
			const allNotes = await noteService.getAllNotes();
			setNotes(allNotes);
		} catch (err) {
			console.error("Failed to load notes:", err);
			setError("ノートの読み込みに失敗しました");
		} finally {
			setLoading(false);
		}
	};

	// 初回読み込み
	useEffect(() => {
		loadNotes();
	}, []);

	// ノート削除
	const handleDeleteNote = async (noteId: string, event: React.MouseEvent) => {
		event.stopPropagation(); // ノート選択を防ぐ

		if (window.confirm("このノートを削除してもよろしいですか？")) {
			try {
				// 削除するノートが現在選択中のノートかどうかをチェック
				const isSelectedNote = selectedNoteId === noteId;

				// 削除前に親コンポーネントに通知
				onNoteDeleted?.(noteId);

				// 削除したノートが選択中だった場合、別のノートを選択
				if (isSelectedNote) {
					// 削除予定のノート以外のノートから最初のものを選択
					const remainingNotes = notes.filter((note) => note.ID !== noteId);

					if (remainingNotes.length > 0) {
						onNoteSelect?.(remainingNotes[0]);
					} else {
						// ノートが一つもない場合は選択を解除
						onNoteSelect?.(null);
					}
				}

				// APIでノートを削除
				await noteService.deleteNote(noteId);
				console.log(`ノートの削除に成功しました ID:${noteId}`);

				// 成功した場合のみローカルの配列からも削除
				setNotes((prevNotes) => prevNotes.filter((note) => note.ID !== noteId));
			} catch (err) {
				console.error("Failed to delete note:", err);
				alert("ノートの削除に失敗しました");
				// エラーの場合は配列を更新しない、または再読み込み
				await loadNotes();
			}
		}
	};

	// 新しいノート作成
	const handleCreateNewNote = async () => {
		const newNote = new Note({});
		try {
			// 新しいノートを保存
			await noteService.saveNote(newNote);
			// サイドバーの一覧を更新
			await loadNotes();
			// エディタで新しいノートを選択
			onNoteSelect?.(newNote);
		} catch (err) {
			console.error("Failed to create new note:", err);
			alert("新しいノートの作成に失敗しました");
		}
	};

	// 日付のフォーマット
	const formatDate = (date: Date): string => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) {
			return "今日";
		} else if (days === 1) {
			return "昨日";
		} else if (days < 7) {
			return `${days}日前`;
		} else {
			return date.toLocaleDateString("ja-JP", {
				month: "short",
				day: "numeric",
			});
		}
	};

	if (loading) {
		return (
			<div className={styles.sidebar}>
				<div className={styles.header}>
					<h2>ノート</h2>
					<button
						className={styles.newNoteButton}
						onClick={handleCreateNewNote}
						title="新しいノート">
						+
					</button>
				</div>
				<div className={styles.loading}>読み込み中...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.sidebar}>
				<div className={styles.header}>
					<h2>ノート</h2>
					<button
						className={styles.newNoteButton}
						onClick={handleCreateNewNote}>
						+
					</button>
				</div>
				<div className={styles.error}>
					{error}
					<button onClick={loadNotes} className={styles.retryButton}>
						再試行
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.sidebar}>
			<div className={styles.header}>
				<h2>ノート</h2>
				<button
					className={styles.newNoteButton}
					onClick={handleCreateNewNote}
					title="新しいノート">
					+
				</button>
			</div>

			<div className={styles.notesList}>
				{notes.length === 0 ? (
					<div className={styles.emptyState}>
						<p>まだノートがありません</p>
						<button
							onClick={handleCreateNewNote}
							className={styles.createFirstNoteButton}>
							最初のノートを作成
						</button>
					</div>
				) : (
					notes.map((note) => (
						<div
							key={note.ID}
							className={`${styles.noteItem} ${
								selectedNoteId === note.ID ? styles.selected : ""
							}`}
							onClick={() => onNoteSelect?.(note)}>
							<div className={styles.noteHeader}>
								<h3 className={styles.noteTitle}>{note.title}</h3>
								<button
									className={styles.deleteButton}
									onClick={(e) => handleDeleteNote(note.ID, e)}
									title="削除">
									×
								</button>
							</div>
							<p className={styles.notePreview}>{note.ID}</p>
							<div className={styles.noteDate}>
								{formatDate(note.dateLastModified)}
							</div>
						</div>
					))
				)}
			</div>

			<div className={styles.footer}>
				<button onClick={loadNotes} className={styles.refreshButton}>
					更新
				</button>
				<span className={styles.noteCount}>{notes.length} 個のノート</span>
			</div>
		</div>
	);
};
