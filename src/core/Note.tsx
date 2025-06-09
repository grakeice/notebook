interface INote {
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

	constructor(title?: string, content?: object) {
		this.title = title ?? "";
		this.content = content ?? {}; 
		this.dateCreated = new Date();
		this.dateLastModified = new Date();
	}

	updateContent(newContent: object): void {
		this.content = newContent;
		this.dateLastModified = new Date();
	}

	updateTitle(newTitle: string): void {
		this.title = newTitle;
		this.dateLastModified = new Date();
	}
}
