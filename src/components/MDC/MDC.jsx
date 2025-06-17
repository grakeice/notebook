/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import "@material/web/all.js";

// Button Components
const MDButton = ({ children, ...props }) => {
	return <md-button {...props}>{children}</md-button>;
};

const MDElevatedButton = ({ children, ...props }) => {
	return <md-elevated-button {...props}>{children}</md-elevated-button>;
};

const MDFilledButton = ({ children, ...props }) => {
	return <md-filled-button {...props}>{children}</md-filled-button>;
};

const MDFilledTonalButton = ({ children, ...props }) => {
	return <md-filled-tonal-button {...props}>{children}</md-filled-tonal-button>;
};

const MDOutlinedButton = ({ children, ...props }) => {
	return <md-outlined-button {...props}>{children}</md-outlined-button>;
};

const MDTextButton = ({ children, ...props }) => {
	return <md-text-button {...props}>{children}</md-text-button>;
};

// FAB Components
const MDBrandedFab = ({ children, ...props }) => {
	return <md-branded-fab {...props}>{children}</md-branded-fab>;
};

const MDFab = ({ children, ...props }) => {
	return <md-fab {...props}>{children}</md-fab>;
};

// Checkbox Components
const MDCheckbox = ({ children, ...props }) => {
	return <md-checkbox {...props}>{children}</md-checkbox>;
};

// Chip Components
const MDAssistChip = ({ children, ...props }) => {
	return <md-assist-chip {...props}>{children}</md-assist-chip>;
};

const MDChipSet = ({ children, ...props }) => {
	return <md-chip-set {...props}>{children}</md-chip-set>;
};

const MDFilterChip = ({ children, ...props }) => {
	return <md-filter-chip {...props}>{children}</md-filter-chip>;
};

const MDInputChip = ({ children, ...props }) => {
	return <md-input-chip {...props}>{children}</md-input-chip>;
};

const MDSuggestionChip = ({ children, ...props }) => {
	return <md-suggestion-chip {...props}>{children}</md-suggestion-chip>;
};

// Dialog Components
const MDDialog = ({ children, ...props }) => {
	return <md-dialog {...props}>{children}</md-dialog>;
};

// Divider Components
const MDDivider = ({ children, ...props }) => {
	return <md-divider {...props}>{children}</md-divider>;
};

// Elevation Components
const MDElevation = ({ children, ...props }) => {
	return <md-elevation {...props}>{children}</md-elevation>;
};

// Focus Ring Components
const MDFocusRing = ({ children, ...props }) => {
	return <md-focus-ring {...props}>{children}</md-focus-ring>;
};

// Icon Components
const MDIcon = ({ children, ...props }) => {
	return <md-icon {...props}>{children}</md-icon>;
};

const MDIconButton = ({ children, ...props }) => {
	return <md-icon-button {...props}>{children}</md-icon-button>;
};

const MDFilledIconButton = ({ children, ...props }) => {
	return <md-filled-icon-button {...props}>{children}</md-filled-icon-button>;
};

const MDFilledTonalIconButton = ({ children, ...props }) => {
	return (
		<md-filled-tonal-icon-button {...props}>
			{children}
		</md-filled-tonal-icon-button>
	);
};

const MDOutlinedIconButton = ({ children, ...props }) => {
	return (
		<md-outlined-icon-button {...props}>{children}</md-outlined-icon-button>
	);
};

// List Components
const MDList = ({ children, ...props }) => {
	return <md-list {...props}>{children}</md-list>;
};

const MDListItem = ({ children, ...props }) => {
	return <md-list-item {...props}>{children}</md-list-item>;
};

// Menu Components
const MDMenu = ({ children, ...props }) => {
	return <md-menu {...props}>{children}</md-menu>;
};

const MDMenuItem = ({ children, ...props }) => {
	return <md-menu-item {...props}>{children}</md-menu-item>;
};

const MDSubMenu = ({ children, ...props }) => {
	return <md-sub-menu {...props}>{children}</md-sub-menu>;
};

// Progress Components
const MDCircularProgress = ({ children, ...props }) => {
	return <md-circular-progress {...props}>{children}</md-circular-progress>;
};

const MDLinearProgress = ({ children, ...props }) => {
	return <md-linear-progress {...props}>{children}</md-linear-progress>;
};

// Radio Components
const MDRadio = ({ children, ...props }) => {
	return <md-radio {...props}>{children}</md-radio>;
};

// Ripple Components
const MDRipple = ({ children, ...props }) => {
	return <md-ripple {...props}>{children}</md-ripple>;
};

// Select Components
const MDFilledSelect = ({ children, ...props }) => {
	return <md-filled-select {...props}>{children}</md-filled-select>;
};

const MDOutlinedSelect = ({ children, ...props }) => {
	return <md-outlined-select {...props}>{children}</md-outlined-select>;
};

const MDSelectOption = ({ children, ...props }) => {
	return <md-select-option {...props}>{children}</md-select-option>;
};

// Slider Components
const MDSlider = ({ children, ...props }) => {
	return <md-slider {...props}>{children}</md-slider>;
};

// Switch Components
const MDSwitch = ({ children, ...props }) => {
	return <md-switch {...props}>{children}</md-switch>;
};

// Tabs Components
const MDPrimaryTab = ({ children, ...props }) => {
	return <md-primary-tab {...props}>{children}</md-primary-tab>;
};

const MDSecondaryTab = ({ children, ...props }) => {
	return <md-secondary-tab {...props}>{children}</md-secondary-tab>;
};

const MDTabs = ({ children, ...props }) => {
	return <md-tabs {...props}>{children}</md-tabs>;
};

// Text Field Components
const MDFilledTextField = ({ children, ...props }) => {
	return <md-filled-text-field {...props}>{children}</md-filled-text-field>;
};

const MDOutlinedTextField = ({ children, ...props }) => {
	return <md-outlined-text-field {...props}>{children}</md-outlined-text-field>;
};

// Tooltip Components
const MDTooltip = ({ children, ...props }) => {
	return <md-tooltip {...props}>{children}</md-tooltip>;
};

export {
	// Button Components
	MDButton,
	MDElevatedButton,
	MDFilledButton,
	MDFilledTonalButton,
	MDOutlinedButton,
	MDTextButton,

	// FAB Components
	MDBrandedFab,
	MDFab,

	// Checkbox Components
	MDCheckbox,

	// Chip Components
	MDAssistChip,
	MDChipSet,
	MDFilterChip,
	MDInputChip,
	MDSuggestionChip,

	// Dialog Components
	MDDialog,

	// Divider Components
	MDDivider,

	// Elevation Components
	MDElevation,

	// Focus Ring Components
	MDFocusRing,

	// Icon Components
	MDIcon,
	MDIconButton,
	MDFilledIconButton,
	MDFilledTonalIconButton,
	MDOutlinedIconButton,

	// List Components
	MDList,
	MDListItem,

	// Menu Components
	MDMenu,
	MDMenuItem,
	MDSubMenu,

	// Progress Components
	MDCircularProgress,
	MDLinearProgress,

	// Radio Components
	MDRadio,

	// Ripple Components
	MDRipple,

	// Select Components
	MDFilledSelect,
	MDOutlinedSelect,
	MDSelectOption,

	// Slider Components
	MDSlider,

	// Switch Components
	MDSwitch,

	// Tabs Components
	MDPrimaryTab,
	MDSecondaryTab,
	MDTabs,

	// Text Field Components
	MDFilledTextField,
	MDOutlinedTextField,

	// Tooltip Components
	MDTooltip,
};
