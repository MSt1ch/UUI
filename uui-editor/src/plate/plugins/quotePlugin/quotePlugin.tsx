import React from 'react';

import {
    createBlockquotePlugin,
    BlockToolbarButton,
    getPluginType,
    isMarkActive,
    PlateEditor,
    StyledElementProps,
} from '@udecode/plate';

import { isPluginActive } from '../../../helpers';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as QuoteIcon } from '../../icons/quote.svg';

import css from './quote.scss';

const noop = () => {};
const KEY = 'uui-richTextEditor-quote';

const Quote = (props: StyledElementProps) => {
    return <blockquote
        { ...props.attributes }
        className={ css.quote }
    >
        { props.children }
    </blockquote>;
};

export const quotePlugin = () => createBlockquotePlugin({
    key: KEY,
    type: KEY,
    component: Quote,
    options: {
        hotkey: 'ctrl+q',
    },
});

interface ToolbarButton {
    editor: PlateEditor;
}

export const QuoteButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(KEY)) return null;

    return (
        <BlockToolbarButton
            styles={ { root: { width: 'auto', cursor: 'pointer' }} }
            type={ getPluginType(editor, KEY) }
            icon={ <ToolbarButton
                onClick={ noop }
                icon={ QuoteIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, KEY!) }
            /> }
        />
    );
};