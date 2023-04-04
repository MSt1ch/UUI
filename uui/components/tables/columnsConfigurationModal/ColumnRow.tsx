import * as React from "react";
import { cx, DataColumnProps, DndActor, DndActorRenderParams, IColumnConfig } from "@epam/uui-core";
import { FlexRow, Checkbox, DropMarker } from "../../.";
import { DragHandle, FlexSpacer, ColumnsConfigurationRowProps } from "@epam/uui-components";
import { PinIconButton } from "./PinIconButton";
import styles from "./ColumnRow.scss";

type DndDataType = { column: DataColumnProps, columnConfig: IColumnConfig };

export interface ColumnRowProps {
    column: ColumnsConfigurationRowProps;
}

export const ColumnRow = React.memo(function ColumnRow(props: ColumnRowProps) {
    const { column } = props;
    const { toggleVisibility, togglePin, onCanAcceptDrop, onDrop, columnConfig, isDndAllowed, isPinnedAlways } = column;
    const { isVisible, fix } = columnConfig;
    const isPinned = fix || isPinnedAlways;
    const data = { column, columnConfig };

    const renderContent = (dndActorParams: DndActorRenderParams) => {
        const wrapperClasses = cx(
            styles.rowWrapper,
            !isPinned && styles.notPinned,
            ...(isDndAllowed ? dndActorParams.classNames : []),
        );
        const { onTouchStart, onPointerDown, ...restEventHandlers } = dndActorParams.eventHandlers;
        const wrapperAttrs = {
            ...(isDndAllowed ? { ref: dndActorParams.ref } : {}),
            ...(isDndAllowed ? { rawProps: { ...restEventHandlers } } : {}),
        };
        const dragHandleRawProps: any = {
            ...(isDndAllowed ? { onTouchStart, onPointerDown } : {}),
        };

        return (
            <FlexRow size="30" cx={ wrapperClasses } { ...wrapperAttrs }>
                <FlexRow size="30" spacing='6' cx={ styles.title }>
                    <DragHandle rawProps={ dragHandleRawProps } isDisabled={ !isDndAllowed } cx={ cx(styles.dragHandle, !isDndAllowed && styles.dndDisabled) } />
                    <Checkbox
                        key={ column.key }
                        label={ column.caption }
                        value={ isVisible }
                        onValueChange={ toggleVisibility }
                        isDisabled={ column.isAlwaysVisible }
                    />
                </FlexRow>
                <FlexSpacer />
                <FlexRow size="30" cx={ styles.pinIconButton }>
                    <PinIconButton
                        id={ column.key }
                        isPinned={ !!isPinned }
                        canUnpin={ !isPinnedAlways }
                        onTogglePin={ togglePin }
                    />
                </FlexRow>
                <DropMarker { ...dndActorParams } />
            </FlexRow>
        );
    };

    return (
        <DndActor<DndDataType, DndDataType>
            key={ column.key }
            srcData={ data }
            dstData={ data }
            canAcceptDrop={ onCanAcceptDrop }
            onDrop={ onDrop }
            render={ renderContent }
        />
    );
});