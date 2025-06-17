/**
 * Copyright (c) 2025 grakeice
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import React from "react";

// 基本的なプロパティ型定義
export interface MDBaseProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
}

export interface MDButtonBaseProps extends MDBaseProps {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    form?: string;
    formaction?: string;
    formenctype?: string;
    formmethod?: string;
    formnovalidate?: boolean;
    formtarget?: string;
    name?: string;
    value?: string;
}

export interface MDIconProps extends MDBaseProps {
    name?: string;
}

export interface MDIconButtonProps extends MDButtonBaseProps {
    toggle?: boolean;
    selected?: boolean;
    ariaLabel?: string;
    ariaLabelSelected?: string;
}

export interface MDCheckboxProps extends MDBaseProps {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    required?: boolean;
    value?: string;
    name?: string;
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
}

export interface MDChipProps extends MDBaseProps {
    disabled?: boolean;
    elevated?: boolean;
    href?: string;
    target?: string;
    label?: string;
    selected?: boolean;
    removable?: boolean;
    onRemove?: (event: React.CustomEvent) => void;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface MDDialogProps extends MDBaseProps {
    open?: boolean;
    quick?: boolean;
    returnValue?: string;
    type?: 'alert' | 'confirm' | 'prompt';
    onOpen?: (event: React.CustomEvent) => void;
    onOpened?: (event: React.CustomEvent) => void;
    onClose?: (event: React.CustomEvent) => void;
    onClosed?: (event: React.CustomEvent) => void;
    onCancel?: (event: React.CustomEvent) => void;
}

export interface MDDividerProps extends MDBaseProps {
    inset?: boolean;
    insetStart?: boolean;
    insetEnd?: boolean;
}

export interface MDElevationProps extends MDBaseProps {
    level?: number;
}

export interface MDFocusRingProps extends MDBaseProps {
    for?: string;
    inward?: boolean;
}

export interface MDFabProps extends MDButtonBaseProps {
    variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
    size?: 'small' | 'medium' | 'large';
    label?: string;
    lowered?: boolean;
}

export interface MDListProps extends MDBaseProps {
    type?: 'list' | 'menu';
}

export interface MDListItemProps extends MDBaseProps {
    disabled?: boolean;
    type?: 'text' | 'button' | 'link';
    href?: string;
    target?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface MDMenuProps extends MDBaseProps {
    anchor?: string;
    positioning?: 'absolute' | 'fixed' | 'document' | 'popover';
    quick?: boolean;
    hasOverflow?: boolean;
    open?: boolean;
    xOffset?: number;
    yOffset?: number;
    typeaheadDelay?: number;
    anchorCorner?: string;
    menuCorner?: string;
    stayOpenOnOutsideClick?: boolean;
    stayOpenOnFocusout?: boolean;
    skipRestoreFocus?: boolean;
    defaultFocus?: string;
    onOpening?: (event: React.CustomEvent) => void;
    onOpened?: (event: React.CustomEvent) => void;
    onClosing?: (event: React.CustomEvent) => void;
    onClosed?: (event: React.CustomEvent) => void;
}

export interface MDMenuItemProps extends MDBaseProps {
    disabled?: boolean;
    type?: 'menuitem' | 'option';
    href?: string;
    target?: string;
    keepOpen?: boolean;
    selected?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface MDProgressProps extends MDBaseProps {
    value?: number;
    max?: number;
    indeterminate?: boolean;
    buffer?: number;
}

export interface MDRadioProps extends MDBaseProps {
    checked?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    required?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
}

export interface MDRippleProps extends MDBaseProps {
    for?: string;
    disabled?: boolean;
}

export interface MDSelectProps extends MDBaseProps {
    quick?: boolean;
    required?: boolean;
    disabled?: boolean;
    errorText?: string;
    label?: string;
    noAsterisk?: boolean;
    supportingText?: string;
    value?: string;
    selectedIndex?: number;
    hasLeadingIcon?: boolean;
    displayText?: string;
    menuPositioning?: 'absolute' | 'fixed';
    clampMenuWidth?: boolean;
    typeaheadDelay?: number;
    name?: string;
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
    onInput?: (event: React.InputEvent<HTMLElement>) => void;
    onOpening?: (event: React.CustomEvent) => void;
    onOpened?: (event: React.CustomEvent) => void;
    onClosing?: (event: React.CustomEvent) => void;
    onClosed?: (event: React.CustomEvent) => void;
}

export interface MDSelectOptionProps extends MDBaseProps {
    disabled?: boolean;
    selected?: boolean;
    value?: string;
    type?: 'option';
    displayText?: string;
}

export interface MDSliderProps extends MDBaseProps {
    disabled?: boolean;
    min?: number;
    max?: number;
    value?: number;
    valueStart?: number;
    valueEnd?: number;
    valueLabel?: string;
    valueLabelStart?: string;
    valueLabelEnd?: string;
    ariaLabelStart?: string;
    ariaValueTextStart?: string;
    ariaLabelEnd?: string;
    ariaValueTextEnd?: string;
    step?: number;
    ticks?: boolean;
    labeled?: boolean;
    range?: boolean;
    name?: string;
    nameStart?: string;
    nameEnd?: string;
    onInput?: (event: React.InputEvent<HTMLElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
}

export interface MDSwitchProps extends MDBaseProps {
    disabled?: boolean;
    selected?: boolean;
    icons?: boolean;
    showOnlySelectedIcon?: boolean;
    required?: boolean;
    value?: string;
    name?: string;
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
}

export interface MDTabProps extends MDBaseProps {
    isTab?: boolean;
    active?: boolean;
    hasIcon?: boolean;
    iconOnly?: boolean;
    selected?: boolean;
    focusable?: boolean;
    md3?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface MDTabsProps extends MDBaseProps {
    autoActivate?: boolean;
    activeTabIndex?: number;
    tabs?: readonly HTMLElement[];
    onChange?: (event: React.CustomEvent) => void;
}

export interface MDTextFieldProps extends MDBaseProps {
    disabled?: boolean;
    error?: boolean;
    errorText?: string;
    label?: string;
    noAsterisk?: boolean;
    required?: boolean;
    value?: string;
    prefixText?: string;
    suffixText?: string;
    hasLeadingIcon?: boolean;
    hasTrailingIcon?: boolean;
    supportingText?: string;
    textDirection?: string;
    rows?: number;
    cols?: number;
    inputMode?: string;
    max?: string;
    maxLength?: number;
    min?: string;
    minLength?: number;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    multiple?: boolean;
    step?: string;
    type?: string;
    autocomplete?: string;
    onInput?: (event: React.InputEvent<HTMLElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
    onSelect?: (event: React.SelectEvent<HTMLElement>) => void;
}

export interface MDTooltipProps extends MDBaseProps {
    for?: string;
    type?: 'plain' | 'rich';
    position?: 'top' | 'right' | 'bottom' | 'left';
    visible?: boolean;
    onShow?: (event: React.CustomEvent) => void;
    onHide?: (event: React.CustomEvent) => void;
}

// コンポーネント宣言
export declare const MDButton: React.FC<MDButtonBaseProps>;
export declare const MDElevatedButton: React.FC<MDButtonBaseProps>;
export declare const MDFilledButton: React.FC<MDButtonBaseProps>;
export declare const MDFilledTonalButton: React.FC<MDButtonBaseProps>;
export declare const MDOutlinedButton: React.FC<MDButtonBaseProps>;
export declare const MDTextButton: React.FC<MDButtonBaseProps>;

export declare const MDBrandedFab: React.FC<MDFabProps>;
export declare const MDFab: React.FC<MDFabProps>;

export declare const MDCheckbox: React.FC<MDCheckboxProps>;

export declare const MDAssistChip: React.FC<MDChipProps>;
export declare const MDChipSet: React.FC<MDBaseProps>;
export declare const MDFilterChip: React.FC<MDChipProps>;
export declare const MDInputChip: React.FC<MDChipProps>;
export declare const MDSuggestionChip: React.FC<MDChipProps>;

export declare const MDDialog: React.FC<MDDialogProps>;

export declare const MDDivider: React.FC<MDDividerProps>;

export declare const MDElevation: React.FC<MDElevationProps>;

export declare const MDFocusRing: React.FC<MDFocusRingProps>;

export declare const MDIcon: React.FC<MDIconProps>;
export declare const MDIconButton: React.FC<MDIconButtonProps>;
export declare const MDFilledIconButton: React.FC<MDIconButtonProps>;
export declare const MDFilledTonalIconButton: React.FC<MDIconButtonProps>;
export declare const MDOutlinedIconButton: React.FC<MDIconButtonProps>;

export declare const MDList: React.FC<MDListProps>;
export declare const MDListItem: React.FC<MDListItemProps>;

export declare const MDMenu: React.FC<MDMenuProps>;
export declare const MDMenuItem: React.FC<MDMenuItemProps>;
export declare const MDSubMenu: React.FC<MDMenuProps>;

export declare const MDCircularProgress: React.FC<MDProgressProps>;
export declare const MDLinearProgress: React.FC<MDProgressProps>;

export declare const MDRadio: React.FC<MDRadioProps>;

export declare const MDRipple: React.FC<MDRippleProps>;

export declare const MDFilledSelect: React.FC<MDSelectProps>;
export declare const MDOutlinedSelect: React.FC<MDSelectProps>;
export declare const MDSelectOption: React.FC<MDSelectOptionProps>;

export declare const MDSlider: React.FC<MDSliderProps>;

export declare const MDSwitch: React.FC<MDSwitchProps>;

export declare const MDPrimaryTab: React.FC<MDTabProps>;
export declare const MDSecondaryTab: React.FC<MDTabProps>;
export declare const MDTabs: React.FC<MDTabsProps>;

export declare const MDFilledTextField: React.FC<MDTextFieldProps>;
export declare const MDOutlinedTextField: React.FC<MDTextFieldProps>;

export declare const MDTooltip: React.FC<MDTooltipProps>;

// Material Design Web Components型定義
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'md-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-elevated-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-filled-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-filled-tonal-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-outlined-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-text-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-branded-fab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-fab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-assist-chip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-chip-set': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-filter-chip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-input-chip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-suggestion-chip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-divider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-elevation': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-focus-ring': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-filled-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-filled-tonal-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-outlined-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-list': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-list-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-menu-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-sub-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-circular-progress': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-linear-progress': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-radio': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-ripple': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-filled-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-outlined-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-select-option': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-slider': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-switch': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-primary-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-secondary-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-tabs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-filled-text-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-outlined-text-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'md-tooltip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
