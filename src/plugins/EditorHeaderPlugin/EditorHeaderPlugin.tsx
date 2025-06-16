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
	noteID?: string
	onChange?(e: ChangeEvent<HTMLInputElement>): void;
}

export const EditorHeaderPlugin: React.FC<EditorHeaderPluginProps> = (
	props
) => {
	return (
		<div className={styles.noteHeader}>
			<input
				type="text"
				value={props.title} // 状態を使用
				onChange={(e) => props.onChange?.(e)}
				className={styles.titleInput}
				placeholder="ノートのタイトル"
			/>
			<div className={styles.noteInfo}>
				<span className={styles.lastModified}>
					最終更新: {props.dateLastModified.toLocaleString("ja-JP")}
				</span>
				<span className={styles.lastModified}>
					ID: {props.noteID}
				</span>
			</div>
		</div>
	);
};
