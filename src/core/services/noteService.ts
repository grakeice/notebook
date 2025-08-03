/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Note } from "../models/Note";
import { storageService } from "./storageService";

export class NoteService {
	private static instance: NoteService;
	private readonly NOTE_PREFIX = "note-";

	static getInstance(): NoteService {
		if (!NoteService.instance) {
			NoteService.instance = new NoteService();
		}
		return NoteService.instance;
	}

	private getNoteKey(id: string): string {
		return `${this.NOTE_PREFIX}${id}`;
	}

	/**
	 * ノートのハッシュ値を計算する（Web Crypto API使用）
	 */
	private async calculateNoteHash(note: Note): Promise<string> {
		const content = JSON.stringify({
			title: note.title,
			content: note.content,
		});

		// TextEncoderでUTF-8バイト配列に変換
		const encoder = new TextEncoder();
		const data = encoder.encode(content);

		// SHA-256ハッシュを計算
		const hashBuffer = await crypto.subtle.digest("SHA-256", data);

		// ArrayBufferを16進文字列に変換
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		return hashHex;
	}

	/**
	 * 2つのノートの内容が同じかどうかを比較する
	 */
	areNotesEqual(note1: Note, note2: Note): boolean {
		return (
			note1.title === note2.title &&
			JSON.stringify(note1.content) === JSON.stringify(note2.content)
		);
	}

	/**
	 * ノートに変更があるかどうかをチェックする
	 */
	async hasNoteChanged(currentNote: Note): Promise<boolean> {
		try {
			const savedNote = await this.loadNote(currentNote.ID);
			if (!savedNote) {
				// 保存されていないノートは変更ありとみなす
				return true;
			}

			return !this.areNotesEqual(currentNote, savedNote);
		} catch (error) {
			console.error("Failed to check note changes:", error);
			// エラーの場合は安全側に倒して変更ありとみなす
			return true;
		}
	}

	/**
	 * ノートのハッシュ値を比較して差分をチェックする（軽量版）
	 */
	async hasNoteChangedByHash(currentNote: Note): Promise<boolean> {
		try {
			const savedNote = await this.loadNote(currentNote.ID);
			if (!savedNote) {
				return true;
			}

			const [currentHash, savedHash] = await Promise.all([
				this.calculateNoteHash(currentNote),
				this.calculateNoteHash(savedNote),
			]);

			return currentHash !== savedHash;
		} catch (error) {
			console.error("Failed to check note changes by hash:", error);
			return true;
		}
	}

	/**
	 * 複数のノートの差分をバッチで確認する
	 */
	async checkMultipleNotesChanges(
		notes: Note[],
	): Promise<Map<string, boolean>> {
		const results = new Map<string, boolean>();

		try {
			await Promise.all(
				notes.map(async (note) => {
					const hasChanged = await this.hasNoteChanged(note);
					results.set(note.ID, hasChanged);
				}),
			);
		} catch (error) {
			console.error("Failed to check multiple notes changes:", error);
		}

		return results;
	}

	/**
	 * ノートの変更があった場合のみ保存する
	 */
	async saveNoteIfChanged(
		note: Note,
	): Promise<{ saved: boolean; reason: string; id: string }> {
		try {
			const hasChanged = await this.hasNoteChangedByHash(note);

			if (!hasChanged) {
				return {
					id: note.ID,
					saved: false,
					reason: "No change detected",
				};
			}

			await this.saveNote(note);
			return { id: note.ID, saved: true, reason: "Change detected" };
		} catch (error) {
			console.error("Failed to save note if changed:", error);
			throw new Error("ノートの保存に失敗しました");
		}
	}

	async saveNote(note: Note): Promise<void> {
		try {
			await storageService.save(this.getNoteKey(note.ID), note.toJSON());
		} catch (error) {
			console.error("Failed to save note:", error);
			throw new Error("ノートの保存に失敗しました");
		}
	}

	async loadNote(id: string): Promise<Note | null> {
		try {
			const data = await storageService.load(this.getNoteKey(id));
			return data ? Note.fromJSON(data as Record<string, unknown>) : null;
		} catch (error) {
			console.error("Failed to load note:", error);
			return null;
		}
	}

	async deleteNote(id: string): Promise<void> {
		try {
			await storageService.delete(this.getNoteKey(id));
		} catch (error) {
			console.error("Failed to delete note:", error);
			throw new Error("ノートの削除に失敗しました");
		}
	}

	async getAllNotes(): Promise<Note[]> {
		try {
			const keys = await storageService.getAllKeys();
			const noteKeys = keys.filter((key) =>
				key.startsWith(this.NOTE_PREFIX),
			);

			const notes: Note[] = [];
			for (const key of noteKeys) {
				const note = await this.loadNote(
					key.replace(this.NOTE_PREFIX, ""),
				);
				if (note) {
					notes.push(note);
				}
			}

			// 更新日時順でソート
			return notes.sort(
				(a, b) =>
					b.dateLastModified.getTime() - a.dateLastModified.getTime(),
			);
		} catch (error) {
			console.error("Failed to get all notes:", error);
			return [];
		}
	}

	async searchNotes(query: string): Promise<Note[]> {
		try {
			const allNotes = await this.getAllNotes();
			const lowercaseQuery = query.toLowerCase();

			return allNotes.filter(
				(note) =>
					note.title.toLowerCase().includes(lowercaseQuery) ||
					JSON.stringify(note.content)
						.toLowerCase()
						.includes(lowercaseQuery),
			);
		} catch (error) {
			console.error("Failed to search notes:", error);
			return [];
		}
	}

	async getStorageStats(): Promise<{ noteCount: number; totalSize: number }> {
		try {
			const info = await storageService.getStorageInfo();
			const keys = await storageService.getAllKeys();
			const noteCount = keys.filter((key) =>
				key.startsWith(this.NOTE_PREFIX),
			).length;

			return {
				noteCount,
				totalSize: info.storageSize,
			};
		} catch (error) {
			console.error("Failed to get storage stats:", error);
			return { noteCount: 0, totalSize: 0 };
		}
	}
}

export const noteService = NoteService.getInstance();
