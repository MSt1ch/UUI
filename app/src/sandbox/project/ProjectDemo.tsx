import React, { useCallback, useMemo, useState } from 'react';
import { DataTable, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton, useForm } from '@epam/promo';
import { AcceptDropParams, DataTableState, DropParams, DropPosition, Metadata, useList } from '@epam/uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/common/table-row_plus_after-24.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/common/table-row_plus_before-24.svg';
import { Task } from './types';
import { getDemoTasks } from './demoData';
import { getColumns } from './columns';
import { getInsertionOrder } from './helpers';

interface FormState {
    items: Record<number, Task>;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    name: { isRequired: true },
                },
            },
        },
    },
};

let lastId = -1;

let savedValue: FormState = { items: getDemoTasks() };

export function ProjectDemo() {
    const {
        lens, value, onValueChange, save, isChanged, revert, undo, canUndo, redo, canRedo,
    } = useForm<FormState>({
        value: savedValue,
        onSave: async (data) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = data;
        },
        getMetadata: () => metadata,
    });

    const [tableState, setTableState] = useState<DataTableState>({ sorting: [{ field: 'order' }] });

    // Insert new/exiting top/bottom or above/below relative to other task
    const insertTask = useCallback((position: DropPosition, relativeTask: Task | null = null, existingTask: Task | null = null) => {
        let tempRelativeTask = relativeTask;
        const task: Task = existingTask ? { ...existingTask } : { id: lastId--, name: '' };
        if (position === 'inside') {
            task.parentId = relativeTask.id;
            tempRelativeTask = null; // just insert as the first child
        }

        if (tempRelativeTask) {
            task.parentId = tempRelativeTask.parentId;
        }

        task.order = getInsertionOrder(
            Object.values(value.items)
                .filter((i) => i.parentId === task.parentId)
                .map((i) => i.order),
            position === 'bottom' || position === 'inside' ? 'after' : 'before', // 'inside' drop should also insert at the top of the list, so it's ok to default to 'before'
            tempRelativeTask?.order,
        );

        onValueChange({ ...value, items: { ...value.items, [task.id]: task } });
        if (position === 'inside') {
            setTableState({ ...tableState, folded: { ...tableState.folded, [`${task.parentId}`]: false } });
        }
    }, [value, onValueChange, tableState, setTableState]);

    const deleteTask = useCallback((task: Task) => {
        const items = { ...value.items };
        
        delete items[task.id];
        onValueChange({ ...value, items });
    }, [value, onValueChange]);

    const handleCanAcceptDrop = useCallback((params: AcceptDropParams<Task & { isTask: boolean }, Task>) => {
        if (!params.srcData.isTask || params.srcData.id === params.dstData.id) {
            return null;
        } else {
            return { bottom: true, top: true, inside: true };
        }
    }, []);

    const handleDrop = useCallback(
        (params: DropParams<Task, Task>) => insertTask(params.position, params.dstData, params.srcData),
        [insertTask],
    );

    const { rows, listProps } = useList(
        {
            type: 'array',
            listState: tableState,
            setListState: setTableState,
            items: Object.values(value.items),
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getRowOptions: (task) => ({
                ...lens.prop('items').prop(task.id).toProps(), // pass IEditable to each row to allow editing
                // checkbox: { isVisible: true },
                isSelectable: true,
                dnd: {
                    srcData: { ...task, isTask: true },
                    dstData: { ...task, isTask: true },
                    canAcceptDrop: handleCanAcceptDrop,
                    onDrop: handleDrop,
                },
            }),
        },
        [],
    );

    const columns = useMemo(
        () => getColumns({ insertTask, deleteTask }),
        [insertTask, deleteTask],
    );

    return (
        <Panel style={ { width: '100%' } }>
            <FlexRow spacing="12" margin="12">
                <FlexCell width="auto">
                    <IconButton icon={ insertAfter } onClick={ () => insertTask('bottom') } />
                </FlexCell>
                <FlexCell width="auto">
                    <IconButton icon={ insertBefore } onClick={ () => insertTask('top') } />
                </FlexCell>
                <FlexSpacer />
                <FlexCell width="auto">
                    <Button size="30" icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="30" icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="30" caption="Save" onClick={ save } isDisabled={ !isChanged } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="30" caption="Revert" onClick={ revert } isDisabled={ !isChanged } />
                </FlexCell>
            </FlexRow>
            <DataTable
                headerTextCase="upper"
                getRows={ () => rows }
                columns={ columns }
                value={ tableState }
                onValueChange={ setTableState }
                showColumnsConfig
                allowColumnsResizing
                allowColumnsReordering
                { ...listProps }
            />
        </Panel>
    );
}
