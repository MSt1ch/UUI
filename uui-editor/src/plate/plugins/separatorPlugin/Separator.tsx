import * as React from 'react';
import { useSelected } from 'slate-react';
import cx from 'classnames';
import { uuiMod } from '@epam/uui-core';

import { StyledElementProps } from '@udecode/plate';

import css from './Separator.scss';

export function Separator(props: StyledElementProps) {
    const { children, attributes } = props;
    const selected = useSelected();
    return (
        <div
            { ...attributes }
            className={ cx(css.separator, selected && uuiMod.focus) }>
            { children }
        </div>
    );
}
