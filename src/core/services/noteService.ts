import { Note } from '../models/Note';
import { storageService } from './storageService';

export class NoteService {
    private static instance: NoteService;
    private readonly NOTE_PREFIX = 'note-';

    static getInstance(): NoteService {
        if (!NoteService.instance) {
            NoteService.instance = new NoteService();
        }
        return NoteService.instance;
    }

    private getNoteKey(id: string): string {
        return `${this.NOTE_PREFIX}${id}`;
    }

    async saveNote(note: Note): Promise<void> {
        try {
            await storageService.save(this.getNoteKey(note.id), note.toJSON());
        } catch (error) {
            console.error('Failed to save note:', error);
            throw new Error('ノートの保存に失敗しました');
        }
    }

    async loadNote(id: string): Promise<Note | null> {
        try {
            const data = await storageService.load(this.getNoteKey(id));
            return data ? Note.fromJSON(data as Record<string, unknown>) : null;
        } catch (error) {
            console.error('Failed to load note:', error);
            return null;
        }
    }

    async deleteNote(id: string): Promise<void> {
        try {
            await storageService.delete(this.getNoteKey(id));
        } catch (error) {
            console.error('Failed to delete note:', error);
            throw new Error('ノートの削除に失敗しました');
        }
    }

    async getAllNotes(): Promise<Note[]> {
        try {
            const keys = await storageService.getAllKeys();
            const noteKeys = keys.filter(key => key.startsWith(this.NOTE_PREFIX));
            
            const notes: Note[] = [];
            for (const key of noteKeys) {
                const note = await this.loadNote(key.replace(this.NOTE_PREFIX, ''));
                if (note) {
                    notes.push(note);
                }
            }
            
            // 更新日時順でソート
            return notes.sort((a, b) => b.dateLastModified.getTime() - a.dateLastModified.getTime());
        } catch (error) {
            console.error('Failed to get all notes:', error);
            return [];
        }
    }

    async searchNotes(query: string): Promise<Note[]> {
        try {
            const allNotes = await this.getAllNotes();
            const lowercaseQuery = query.toLowerCase();
            
            return allNotes.filter(note => 
                note.title.toLowerCase().includes(lowercaseQuery) ||
                JSON.stringify(note.content).toLowerCase().includes(lowercaseQuery)
            );
        } catch (error) {
            console.error('Failed to search notes:', error);
            return [];
        }
    }

    async getStorageStats(): Promise<{ noteCount: number; totalSize: number }> {
        try {
            const info = await storageService.getStorageInfo();
            const keys = await storageService.getAllKeys();
            const noteCount = keys.filter(key => key.startsWith(this.NOTE_PREFIX)).length;
            
            return {
                noteCount,
                totalSize: info.storageSize,
            };
        } catch (error) {
            console.error('Failed to get storage stats:', error);
            return { noteCount: 0, totalSize: 0 };
        }
    }
}

export const noteService = NoteService.getInstance();