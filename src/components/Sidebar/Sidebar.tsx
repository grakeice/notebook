/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Note } from "../../core/models/Note";
import { noteService } from "../../core/services/noteService";
import {
	MDCircularProgress,
	MDDialog,
	MDDivider,
	MDFilledButton,
	MDFilledTonalButton,
	MDIcon,
	MDIconButton,
	MDList,
	MDListItem,
	MDOutlinedTextField,
	MDTextButton,
} from "../MDC";
import styles from "./Sidebar.module.css";

interface SidebarProps {
	onNoteSelect?: (note: Note | null) => void;
	selectedNoteId?: string;
	onNoteDeleted?: (deletedNoteId: string) => void;
	className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
	selectedNoteId,
	onNoteSelect,
	onNoteDeleted,
	className = "",
}) => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newNoteTitle, setNewNoteTitle] = useState("");
	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));
	// ノート一覧を取得
	const loadNotes = async (isRefresh = false) => {
		try {
			if (isRefresh) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}
			setError(null);
			const allNotes = await noteService.getAllNotes();
			setNotes(allNotes);
		} catch (err) {
			console.error("Failed to load notes:", err);
			setError("ノートの読み込みに失敗しました");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	// 初回読み込み
	useEffect(() => {
		loadNotes();
	}, []);

	// メモ化によるパフォーマンス改善
	const memoizedNotes = useMemo(() => notes, [notes]);

	// 削除ダイアログを開く
	const handleDeleteNoteClick = useCallback(
		(noteId: string, event: React.MouseEvent) => {
			event.stopPropagation(); // ノート選択を防ぐ
			setNoteToDelete(noteId);
			setDeleteDialogOpen(true);
		},
		[]
	);

	// ノート削除の確認
	const handleConfirmDelete = useCallback(async () => {
		if (!noteToDelete) return;

		try {
			// 削除するノートが現在選択中のノートかどうかをチェック
			const isSelectedNote = selectedNoteId === noteToDelete;

			// 削除前に親コンポーネントに通知
			onNoteDeleted?.(noteToDelete);

			// モバイル判定
			const isMobile = window.innerWidth <= 768;

			// 削除したノートが選択中だった場合の処理
			if (isSelectedNote) {
				if (isMobile) {
					// スマホの場合は選択を解除するのみ
					onNoteSelect?.(null);
				} else {
					// デスクトップの場合は別のノートを選択
					const remainingNotes = notes.filter((note) => note.ID !== noteToDelete);

					if (remainingNotes.length > 0) {
						onNoteSelect?.(remainingNotes[0]);
					} else {
						// ノートが一つもない場合は選択を解除
						onNoteSelect?.(null);
					}
				}
			}

			// APIでノートを削除
			await noteService.deleteNote(noteToDelete);
			console.log(`ノートの削除に成功しました ID:${noteToDelete}`);

			// 成功した場合のみローカルの配列からも削除
			setNotes((prevNotes) =>
				prevNotes.filter((note) => note.ID !== noteToDelete)
			);
		} catch (err) {
			console.error("Failed to delete note:", err);
			alert("ノートの削除に失敗しました");
			// エラーの場合は配列を更新しない、または再読み込み
			await loadNotes();
		} finally {
			setDeleteDialogOpen(false);
			setNoteToDelete(null);
		}
	}, [noteToDelete, selectedNoteId, onNoteDeleted, notes, onNoteSelect]);

	// 削除キャンセル
	const handleCancelDelete = useCallback(async () => {
		await sleep(250);
		setDeleteDialogOpen(false);
		setNoteToDelete(null);
	}, []);

	// 新しいノート作成ダイアログを開く
	const handleCreateNewNoteClick = useCallback(() => {
		setNewNoteTitle("");
		setCreateDialogOpen(true);
	}, []);

	// 新しいノート作成の確認
	const handleConfirmCreateNote = useCallback(async () => {
		const title = newNoteTitle.trim() || "無題のノート";

		try {
			const newNote = new Note({ title });
			// 新しいノートを保存
			await noteService.saveNote(newNote);
			// サイドバーの一覧を更新
			await loadNotes();
			// エディタで新しいノートを選択
			onNoteSelect?.(newNote);
		} catch (err) {
			console.error("Failed to create new note:", err);
			alert("新しいノートの作成に失敗しました");
		} finally {
			setCreateDialogOpen(false);
			setNewNoteTitle("");
		}
	}, [newNoteTitle, onNoteSelect]);

	// 新しいノート作成のキャンセル
	const handleCancelCreateNote = useCallback(async () => {
		await sleep(250);
		setCreateDialogOpen(false);
		setNewNoteTitle("");
	}, []);

	// リフレッシュボタンのハンドラー
	const handleRefresh = useCallback(() => {
		loadNotes(true);
	}, []);

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
	// 削除対象のノートの情報を取得
	const noteToDeleteInfo = useMemo(() => {
		if (!noteToDelete) return null;
		return notes.find((note) => note.ID === noteToDelete);
	}, [noteToDelete, notes]);

	// 初回読み込み中のUI
	if (loading && !refreshing) {
		return (
			<div className={`${styles.sidebar} ${className}`}>
				<div className={styles.header}>
					<h2>ノート</h2>
					<MDIconButton onClick={handleCreateNewNoteClick} title="新しいノート">
						<MDIcon>add</MDIcon>
					</MDIconButton>
				</div>
				<div className={styles.loading}>
					<MDCircularProgress indeterminate />
					<span>読み込み中...</span>
				</div>
				<div className={styles.footer}>
					<MDTextButton onClick={handleRefresh}>
						<MDIcon slot="icon">refresh</MDIcon>
						更新
					</MDTextButton>
					<span className={styles.noteCount}>-- 個のノート</span>
				</div>
			</div>
		);
	}

	// エラー時のUI
	if (error) {
		return (
			<div className={`${styles.sidebar} ${className}`}>
				<div className={styles.header}>
					<h2>ノート</h2>
					<MDIconButton onClick={handleCreateNewNoteClick}>
						<MDIcon>add</MDIcon>
					</MDIconButton>
				</div>
				<div className={styles.error}>
					<span>{error}</span>
					<MDTextButton onClick={() => loadNotes()}>再試行</MDTextButton>
				</div>
				<div className={styles.footer}>
					<MDTextButton onClick={handleRefresh}>
						<MDIcon slot="icon">refresh</MDIcon>
						更新
					</MDTextButton>
					<span className={styles.noteCount}>-- 個のノート</span>
				</div>
			</div>
		);
	}

	return (
		<div className={`${styles.sidebar} ${className}`}>
			<div className={styles.header}>
				<h2>ノート</h2>
				<MDIconButton onClick={handleCreateNewNoteClick} title="新しいノート">
					<MDIcon>add</MDIcon>
				</MDIconButton>
			</div>

			{notes.length === 0 ? (
				<div className={styles.emptyState}>
					<MDIcon>description</MDIcon>
					<p>まだノートがありません</p>
					<MDFilledButton onClick={handleCreateNewNoteClick}>
						最初のノートを作成
					</MDFilledButton>
				</div>
			) : (
				<div className={styles.notesContainer}>
					{refreshing && (
						<div className={styles.refreshIndicator}>
							<MDCircularProgress indeterminate />
							<span>更新中...</span>
						</div>
					)}
					<MDList className={styles.notesList}>
						{memoizedNotes.map((note, index) => (
							<div key={note.ID}>
								<MDListItem
									type="button"
									className={selectedNoteId === note.ID ? styles.selected : ""}
									onClick={() => onNoteSelect?.(note)}>
									<div slot="headline">{note.title}</div>
									<div slot="supporting-text">{note.summaryText}</div>
									<div slot="trailing-supporting-text">
										{formatDate(note.dateLastModified)}
									</div>
									<MDIconButton
										slot="end"
										onClick={(e: React.MouseEvent) => handleDeleteNoteClick(note.ID, e)}
										title="削除">
										<MDIcon>clear</MDIcon>
									</MDIconButton>
								</MDListItem>
								{index < memoizedNotes.length - 1 && <MDDivider />}
							</div>
						))}
					</MDList>
				</div>
			)}

			<div className={styles.footer}>
				<MDTextButton onClick={handleRefresh} disabled={refreshing}>
					<MDIcon slot="icon">refresh</MDIcon>
					{refreshing ? "更新中..." : "更新"}
				</MDTextButton>
				<span className={styles.noteCount}>{notes.length} 個のノート</span>
			</div>

			{/* 新しいノート作成ダイアログ */}
			<MDDialog
				className="new_note"
				open={createDialogOpen}
				onClose={handleCancelCreateNote}
				onCancel={handleCancelCreateNote}>
				<div slot="headline">新しいノートを作成</div>
				<div slot="content">
					<MDOutlinedTextField
						label="ノートのタイトル"
						value={newNoteTitle}
						onInput={(e) => setNewNoteTitle((e.target as HTMLInputElement).value)}
						placeholder="タイトルを入力してください"
					/>
				</div>
				<div slot="actions">
					<MDTextButton onClick={handleCancelCreateNote}>キャンセル</MDTextButton>
					<MDFilledButton onClick={handleConfirmCreateNote}>作成</MDFilledButton>
				</div>
			</MDDialog>

			{/* 削除確認ダイアログ */}
			<MDDialog
				open={deleteDialogOpen}
				type="confirm"
				onClose={handleCancelDelete}
				onCancel={handleCancelDelete}>
				<div slot="headline">ノートを削除</div>
				<MDIcon slot="icon">delete_outline</MDIcon>
				<form id="form" slot="content" method="dialog">
					{noteToDeleteInfo && (
						<>
							<p>次のノートを削除してもよろしいですか？</p>
							<p>
								<strong>{noteToDeleteInfo.title || "無題のノート"}</strong>
							</p>
							<p>この操作は取り消せません。</p>
						</>
					)}
				</form>
				<div slot="actions">
					<MDTextButton onClick={handleConfirmDelete}>削除</MDTextButton>
					<MDFilledTonalButton onClick={handleCancelDelete} autoFocus>
						キャンセル
					</MDFilledTonalButton>
				</div>
			</MDDialog>
		</div>
	);
};
