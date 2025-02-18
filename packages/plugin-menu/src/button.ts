/* Copyright 2021, Milkdown by Mirone. */

import { css } from '@emotion/css';
import { CmdKey, commandsCtx, Ctx } from '@milkdown/core';
import type { Icon } from '@milkdown/design-system';
import type { EditorView } from '@milkdown/prose';
import type { Utils } from '@milkdown/utils';

import type { CommonConfig } from './default-config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ButtonConfig<T = any> = {
    type: 'button';
    icon: Icon;
    active?: (view: EditorView) => boolean;
    key: CmdKey<T>;
    options?: T;
} & CommonConfig;

export const button = (utils: Utils, config: ButtonConfig, ctx: Ctx) => {
    const buttonStyle = utils.getStyle((themeTool) => {
        return css`
            width: 1.5rem;
            height: 1.5rem;
            padding: 0.25rem;
            margin: 0.5rem;
            flex-shrink: 0;

            display: flex;
            justify-content: center;
            align-items: center;

            background-color: ${themeTool.palette('surface')};
            color: ${themeTool.palette('solid')};
            transition: all 0.4s ease-in-out;

            cursor: pointer;

            &.active,
            &:hover {
                background-color: ${themeTool.palette('secondary', 0.12)};
                color: ${themeTool.palette('primary')};
            }
        `;
    });

    const $button = document.createElement('div');
    if (buttonStyle) {
        $button.classList.add(buttonStyle);
    }
    const $icon = utils.themeTool.slots.icon(config.icon);
    $button.appendChild($icon);
    $button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ctx.get(commandsCtx).call(config.key, config.options);
    });
    return $button;
};
