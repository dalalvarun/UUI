import * as React from 'react';
import cx from 'classnames';
import { DndActorRenderParams, IHasCX } from '@epam/uui-core';
import css from './DropMarker.scss';

export interface DropMarkerProps extends DndActorRenderParams, IHasCX {
    enableBlocker?: boolean;
}

export class DropMarker extends React.Component<DropMarkerProps> {
    render() {
        return this.props.isDndInProgress ? <>
            { this.props.enableBlocker && <div
                className={ css.blocker }
            /> }
            <div
                className={ cx({
                    [css.marker]: true,
                    [css[this.props.position]]: true,
                    [this.props.cx]: !!this.props.cx,
                }) }
            />
        </> : null;
    }
}