/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ja } from "./locales/translations";

const resources = {
	ja: {
		translation: ja,
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: "ja",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
