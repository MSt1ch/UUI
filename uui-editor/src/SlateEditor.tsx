import React, { FocusEventHandler, Fragment, KeyboardEventHandler, useMemo, useRef, useState } from 'react';
import { IEditable, IHasCX, IHasRawProps, cx, useForceUpdate, uuiMod } from '@epam/uui-core';
import { ScrollBars } from '@epam/uui';

import { Plate, PlateContent, PlateEditor, Value, createPlugins, useEditorState, useEventEditorSelectors } from '@udecode/plate-common';

import { createPlateUI } from './components';
import { migrateSchema } from './migration';
import { baseMarksPlugin } from './plugins';
import { MainToolbar, MarksToolbar } from './implementation/Toolbars';
import { EditorValue } from './types';
import { defaultPlugins } from './defaultPlugins';
import { isEditorValueEmpty } from './helpers';

import css from './SlateEditor.module.scss';

const basePlugins: any = [
    baseMarksPlugin(),
    ...defaultPlugins,
];

interface SlateEditorProps extends IEditable<EditorValue>, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    isReadonly?: boolean;
    plugins?: any[];
    autoFocus?: boolean;
    minHeight?: number | 'none';
    placeholder?: string;
    mode?: 'form' | 'inline';
    fontSize?: '14' | '16';
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    onBlur?: FocusEventHandler<HTMLDivElement>;
    scrollbars?: boolean;
}

interface PlateEditorProps extends SlateEditorProps {
    id: string,
}

function Editor(props: PlateEditorProps) {
    const editor = useEditorState();

    const focusedEditorId = useEventEditorSelectors.focus();
    const isFocused = editor.id === focusedEditorId;

    const renderEditor = () => (
        <Fragment>
            <PlateContent
                id={ props.id }
                autoFocus={ props.autoFocus }
                readOnly={ props.isReadonly }
                placeholder={ props.placeholder }
                className={ css.editor }
                onKeyDown={ props.onKeyDown }
                onBlur={ props.onBlur }
                renderPlaceholder={ ({ attributes }) => {
                    return isEditorValueEmpty(editor.children) && (
                        <div
                            { ...attributes }
                            style={ { pointerEvents: 'none' } }
                            className={ css.placeholder }
                        >
                            { props.placeholder }
                        </div>
                    );
                } }
                style={ { minHeight: props.minHeight } }
            />
            <MainToolbar />
            <MarksToolbar />
        </Fragment>
    );

    return (
        <div
            className={ cx(
                'uui-typography',
                props.cx,
                css.container,
                css['mode-' + (props.mode || 'form')],
                (!props.isReadonly && isFocused) && uuiMod.focus,
                props.isReadonly && uuiMod.readonly,
                props.scrollbars && css.withScrollbars,
                props.fontSize === '16' ? 'uui-typography-size-16' : 'uui-typography-size-14',
            ) }
            { ...props.rawProps }
        >
            { props.scrollbars
                ? (
                    <ScrollBars cx={ css.scrollbars }>
                        { renderEditor() }
                    </ScrollBars>
                )
                : renderEditor()}
        </div>
    );
}

function SlateEditor(props: SlateEditorProps) {
    const currentId = useRef(String(Date.now()));
    const [editor, setEditor] = useState<PlateEditor>();

    const plugins = useMemo(
        () => {
            return createPlugins((props.plugins || []).flat(), { components: createPlateUI() });
        },
        [props.plugins],
    );

    const onChange = (value: Value) => {
        if (props.isReadonly) return;
        props?.onValueChange(value);
    };

    const value = useMemo(() => {
        return migrateSchema(props.value);
    }, [props.value]);

    const forceUpdate = useForceUpdate();
    if (value && editor?.children && editor.children !== value) {
        editor.children = value;
        forceUpdate();
    }

    return (
        <Plate
            id={ currentId.current }
            initialValue={ value }
            plugins={ plugins }
            onChange={ onChange }
            editorRef={ setEditor }
            // we override plate core insertData plugin
            // so, we need to disable default implementation
            disableCorePlugins={ { insertData: true } }
        >
            <Editor
                id={ currentId.current }
                { ...props }
            />
        </Plate>
    );
}

export { SlateEditor, basePlugins };
