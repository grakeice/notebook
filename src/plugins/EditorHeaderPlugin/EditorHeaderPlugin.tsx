/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ChangeEvent } from "react";
import styles from "./EditorHeaderPlugin.module.css";

interface EditorHeaderPluginProps {
	title: string;
	dateLastModified: Date;
	noteID?: string;
	onChange?(e: ChangeEvent<HTMLInputElement>): void;
	maxTitleLength?: number;
}

export const EditorHeaderPlugin: React.FC<EditorHeaderPluginProps> = ({
	title,
	dateLastModified,
	noteID,
	onChange,
	maxTitleLength = 100,
}) => {
	return (
		<div className={styles.noteHeader}>
			<input
				type="text"
				value={title}
				onChange={onChange}
				className={styles.titleInput}
				placeholder="ノートのタイトル"
				maxLength={maxTitleLength}
			/>
			<div className={styles.noteInfo}>
				<span className={styles.lastModified}>
					最終更新: {dateLastModified.toLocaleString("ja-JP")}
				</span>
				<span className={styles.lastModified}>ID: {noteID}</span>
			</div>
		</div>
	);
};
