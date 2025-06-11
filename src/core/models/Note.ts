export interface INote {
	readonly ID: string;
	title: string;
	content: object;
	readonly dateCreated: Date;
	dateLastModified: Date;
}

export class Note implements INote {
	readonly ID: string;
	title: string;
	content: object;
	readonly dateCreated: Date;
	dateLastModified: Date;

	constructor({
		ID,
		title,
		content,
		dateCreated,
		dateLastModified,
	}: {
		ID?: string;
		title?: string;
		content?: object;
		dateCreated?: Date;
		dateLastModified?: Date;
	}) {
		this.ID = ID ?? crypto.randomUUID();
		this.title = title ?? "";
		this.content = content ?? {};
		this.dateCreated = dateCreated ?? new Date();
		this.dateLastModified = dateLastModified ?? new Date();
	}

	updateContent(newContent: object): void {
		this.content = newContent;
		this.dateLastModified = new Date();
	}

	updateTitle(newTitle: string): void {
		this.title = newTitle;
		this.dateLastModified = new Date();
	}

	toJSON(): Record<string, unknown> {
		return {
			ID: this.ID,
			title: this.title,
			content: this.content,
			dateCreated: this.dateCreated.toISOString(),
			dateLastModified: this.dateLastModified.toISOString(),
		};
	}

	static fromJSON(data: Record<string, unknown>): Note {
		const note = new Note({
			ID: data.ID as string,
			title: data.title as string,
			content: data.content as object,
			dateCreated: new Date(data.dateCreated as string),
			dateLastModified: new Date(data.dateLastModified as string),
		});
		return note;
	}
}
