import React from 'react';
import { VerticalTabButton } from '../VerticalTabButton';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { ReactComponent as calendarIcon } from '../../../icons/calendar-18.svg';

describe('VerticalTabButton', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<VerticalTabButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <VerticalTabButton
                onClick={ jest.fn }
                icon={ calendarIcon }
                isDisabled={ false }
                withNotify={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
