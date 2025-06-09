export interface INote {
	readonly id: string;
	title: string;
	content: object;
	readonly dateCreated: Date;
	dateLastModified: Date;
}

export class Note implements INote {
	readonly id: string = crypto.randomUUID();
	title: string;
	content: object;
	readonly dateCreated: Date;
	dateLastModified: Date;

	constructor({
		title,
		content,
		dateCreated,
		dateLastModified,
	}: {
		title?: string;
		content?: object;
		dateCreated?: Date;
		dateLastModified?: Date;
	}) {
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
			id: this.id,
			title: this.title,
			content: this.content,
			dateCreated: this.dateCreated.toISOString(),
			dateLastModified: this.dateLastModified.toISOString(),
		};
	}

	static fromJSON(data: Record<string, unknown>): Note {
		const note = new Note({
			title: data.title as string,
			content: data.content as object,
			dateCreated: new Date(data.dateCreated as string),
			dateLastModified: new Date(data.dateLastModified as string),
		});
		return note;
	}
}
