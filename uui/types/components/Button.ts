import { IBasicPickerToggler, ICanRedirect, IClickable, IDisableable, IDropdownToggler, IHasCaption, IHasCX, IHasIcon, IHasPlaceholder, IAnalyticableClick, IHasRawProps } from "../props";
import { Icon } from "../objects";

export interface ButtonBaseCoreProps extends IHasCX, IClickable, ICanRedirect, IDisableable, IHasIcon, IAnalyticableClick, IHasRawProps<HTMLElement> {
    isLinkActive?: boolean;
    tabIndex?: number;
}

export interface ButtonCoreProps extends ButtonBaseCoreProps, IHasCaption, IBasicPickerToggler, IDropdownToggler, IHasPlaceholder {
    dropdownIcon?: Icon;
    dropdownIconPosition?: 'left' | 'right';
    countPosition?: 'left' | 'right';
    count?: number | null;
}

export interface ButtonSemanticProps {
    type?: 'success' | 'cancel' | 'action';
}