import * as React from 'react';
import cx from 'classnames';
import { IAdaptiveItem, IDropdownToggler, Icon, IHasCX, uuiMarkers, IClickable } from '@epam/uui-core';
import { IconContainer, Avatar } from '@epam/uui-components';
import { ReactComponent as FoldingArrow } from '../../../icons/folding-arrow-18.svg';
import css from './MainMenuAvatar.module.scss';

/** Represents the properties of the MainMenuAvatar component. */
export interface MainMenuAvatarProps extends IClickable, IAdaptiveItem, IDropdownToggler, IHasCX {
    avatarUrl?: string;
    icon?: Icon;
}

export const MainMenuAvatar = React.forwardRef<HTMLButtonElement, MainMenuAvatarProps>((props, ref) => (
    <button
        ref={ ref }
        className={ cx(css.container, props.isDropdown && css.dropdown, props.isOpen && css.open, props.onClick && uuiMarkers.clickable, props.cx) }
        onClick={ props.onClick }
    >
        <Avatar size="36" img={ props.avatarUrl } />
        {props.icon && <IconContainer icon={ props.icon } />}
        {props.isDropdown && (
            <div>
                <IconContainer icon={ FoldingArrow } flipY={ props.isOpen } />
            </div>
        )}
    </button>
));
