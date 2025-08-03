/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { WordCounterPluginProps } from "./utils/WordCounterPluginUtil";
import styles from "./WordCounterPlugin.module.css";

export const WordCounterPlugin: React.FC<WordCounterPluginProps> = ({
	wordCount,
}) => {
	return (
		<div className={styles.wordCounter}>
			<span>文字数: {wordCount.characters}</span>
			<span className={styles.separator}>|</span>
			<span>単語数: {wordCount.words}</span>
		</div>
	);
};
