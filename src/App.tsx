import { Editor } from "./Editor";
import styles from "./App.module.css";

export const App: React.FC = () => {
	return (
		<>
			<div className={styles["editor-container"]}>
				<Editor />
			</div>
		</>
	);
};
