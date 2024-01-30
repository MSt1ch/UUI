import * as React from 'react';
import {
    IHasRawProps, cx, IHasCX, IDisableable, IEditable, IHasLabel, Icon, uuiMod, uuiElement, ICanBeReadonly,
    IAnalyticableOnChange, UuiContexts, uuiMarkers, UuiContext, IHasForwardedRef, ICanFocus, IHasTabIndex,
} from '@epam/uui-core';
import { IconContainer } from '../layout/IconContainer';
import css from './RadioInput.module.scss';

export type RadioInputProps = IHasCX & IDisableable & IEditable<boolean> & IHasLabel & ICanBeReadonly & IAnalyticableOnChange<boolean>
& IHasRawProps<React.LabelHTMLAttributes<HTMLLabelElement>> & IHasForwardedRef<HTMLLabelElement> & ICanFocus<HTMLInputElement> & IHasTabIndex & {
    /** Icon for radio input selected state.
     * Usually it has a default implementation in skins, so providing this is only necessary if you want to replace the default icon
     */
    icon?: Icon;
    /** Render callback for checkbox label.
     * If omitted, 'label' prop value will be rendered.
     */
    renderLabel?(): React.ReactNode;
    /** ID to put on 'input' node */
    id?: string;
    /** Defines native HTML name attribute for the input */
    name?: string;
};

export class RadioInput extends React.Component<RadioInputProps> {
    static contextType = UuiContext;
    context: UuiContexts;
    handleChange = () => {
        this.props.onValueChange(!this.props.value);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(!this.props.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    };

    render() {
        return (
            <label
                className={ cx(
                    css.container,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    this.props.cx,
                    !this.props.isReadonly && !this.props.isDisabled && uuiMarkers.clickable,
                ) }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                <div
                    className={ cx(uuiElement.radioInput, this.props.value && uuiMod.checked) }
                    onFocus={ this.props.onFocus }
                    onBlur={ this.props.onBlur }
                >
                    <input
                        name={ this.props.name }
                        type="radio"
                        onChange={ !this.props.isReadonly ? this.handleChange : undefined }
                        disabled={ this.props.isDisabled }
                        aria-disabled={ this.props.isDisabled || undefined }
                        readOnly={ this.props.isReadonly }
                        aria-readonly={ this.props.isReadonly || undefined }
                        required={ this.props.isRequired }
                        aria-required={ this.props.isRequired || undefined }
                        checked={ this.props.value || false }
                        aria-checked={ this.props.value || false }
                        id={ this.props.id }
                        tabIndex={ this.props.tabIndex }
                    />
                    {this.props.value && <IconContainer icon={ this.props.icon } cx={ css.circle } />}
                </div>
                {(this.props.renderLabel || this.props.label) && (
                    <div className={ uuiElement.inputLabel }>{this.props.renderLabel ? this.props.renderLabel() : this.props.label}</div>
                )}
            </label>
        );
    }
}
