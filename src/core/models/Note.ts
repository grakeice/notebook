/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export interface INote {
	readonly ID: string;
	title: string;
	content: object;
	readonly dateCreated: Date;
	dateLastModified: Date;
	summaryText: string;
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
		this.title = title ?? "Untitled";
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

	get summaryText() {
		try {
			const content = this.content as {
				root: { children: Array<{ children: Array<{ text: string }> }> };
			};

			// より安全な型チェックを追加
			if (!content?.root?.children?.[0]?.children) {
				return "";
			}

			const textContent = content.root.children[0].children
				.filter(
					(child) =>
						typeof child === "object" &&
						"text" in child &&
						typeof child.text === "string"
				)
				.map((v) => v.text)
				.join("");

			return textContent;
		} catch {
			return "";
		}
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
