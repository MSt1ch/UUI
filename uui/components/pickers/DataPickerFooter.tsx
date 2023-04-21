import React, { PropsWithChildren } from 'react';
import { isMobile, PickerFooterProps } from '@epam/uui-core';
import { i18n } from '../../i18n';
import { Switch } from '../inputs';
import { FlexCell, FlexRow, FlexSpacer } from '../layout';
import { LinkButton } from '../buttons';
import { SizeMod } from '../types';

type DataPickerFooterProps<TItem, TId> = PickerFooterProps<TItem, TId> &
SizeMod & {
    selectionMode: string;
};

const switchSizes = {
    24: '12',
    36: '18',
    42: '24',
    48: '24',
} as const;

function DataPickerFooterImpl<TItem, TId>(props: PropsWithChildren<DataPickerFooterProps<TItem, TId>>) {
    const {
        clearSelection,
        view,
        showSelected,
        selectionMode,
    } = props;
    const size = isMobile() ? '48' : props.size || '36';
    const switchSize = switchSizes[size as unknown as (keyof typeof switchSizes)];
    const hasSelection = view.getSelectedRowsCount() > 0;

    const isSinglePicker = selectionMode === 'single';

    const clearAllText = i18n.pickerInput.clearSelectionButton;
    const clearSingleText = i18n.pickerInput.clearSelectionButtonSingle;
    const selectAllText = i18n.pickerInput.selectAllButton;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!e.shiftKey && e.key === 'Tab') e.preventDefault();
    };

    return (
        <FlexRow padding="12">
            {!isSinglePicker && (
                <Switch
                    size={ switchSize }
                    value={ showSelected.value }
                    isDisabled={ !hasSelection }
                    onValueChange={ showSelected.onValueChange }
                    label={ i18n.pickerInput.showOnlySelectedLabel }
                />
            )}

            <FlexSpacer />

            <FlexCell width="auto" alignSelf="center">
                {view.selectAll && (
                    <LinkButton
                        size={ size }
                        caption={ hasSelection ? clearAllText : selectAllText }
                        onClick={ hasSelection ? clearSelection : () => view.selectAll.onValueChange(true) }
                        rawProps={ { onKeyDown: handleKeyDown } }
                    />
                )}
                {!view.selectAll && (
                    <LinkButton
                        isDisabled={ !hasSelection }
                        size={ size }
                        caption={ isSinglePicker ? clearSingleText : clearAllText }
                        onClick={ clearSelection }
                        rawProps={ { onKeyDown: handleKeyDown } }
                    />
                )}
            </FlexCell>
        </FlexRow>
    );
}

export const DataPickerFooter = React.memo(DataPickerFooterImpl);
