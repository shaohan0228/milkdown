import type { Schema } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { EditorView } from 'prosemirror-view';
import {
    createToggleIcon,
    hasMark,
    modifyLink,
    findChildNode,
    modifyImage,
    updateLink,
    updateImage,
    isTextSelection,
} from './utility';
import { Ctx } from '@milkdown/core';
import { ToggleBold, ToggleItalic, ToggleInlineCode, ToggleLink } from '@milkdown/preset-commonmark';
import { ToggleStrikeThrough } from '@milkdown/preset-gfm';

export type Pred = (view: EditorView) => boolean;
export type Updater = (view: EditorView, $: HTMLElement) => void;
export type Event2Command = (e: Event) => Command;

export type ButtonItem = {
    $: HTMLElement;
    command: Event2Command;
    active: Pred;
    disable?: Pred;
    enable: Pred;
};

export type InputItem = {
    command: Event2Command;
    display: Pred;
    placeholder: string;
    update: Updater;
};

export enum ButtonAction {
    ToggleBold,
    ToggleItalic,
    ToggleStrike,
    ToggleCode,
    ToggleLink,
}

export enum InputAction {
    ModifyLink,
    ModifyImage,
}

export type ButtonMap = Record<ButtonAction, ButtonItem>;
export type InputMap = Record<InputAction, InputItem>;

export const inputMap = (schema: Schema): InputMap => {
    const { marks, nodes } = schema;
    return {
        [InputAction.ModifyLink]: {
            display: (view) => isTextSelection(view.state) && hasMark(view.state, marks.link),
            command: modifyLink(),
            placeholder: 'Input Web Link',
            update: updateLink(schema),
        },
        [InputAction.ModifyImage]: {
            display: (view) => Boolean(findChildNode(view.state.selection, nodes.image)),
            command: modifyImage(schema, 'src'),
            placeholder: 'Input Image Link',
            update: updateImage(schema),
        },
    };
};

export const buttonMap = (schema: Schema, ctx: Ctx): ButtonMap => {
    const { marks } = schema;
    return {
        [ButtonAction.ToggleBold]: createToggleIcon(ctx, 'format_bold', ToggleBold, marks.strong, marks.code_inline),
        [ButtonAction.ToggleItalic]: createToggleIcon(ctx, 'format_italic', ToggleItalic, marks.em, marks.code_inline),
        [ButtonAction.ToggleStrike]: createToggleIcon(
            ctx,
            'strikethrough_s',
            ToggleStrikeThrough,
            marks.strike_through,
            marks.code_inline,
        ),
        [ButtonAction.ToggleCode]: createToggleIcon(ctx, 'code', ToggleInlineCode, marks.code_inline, marks.link),
        [ButtonAction.ToggleLink]: createToggleIcon(ctx, 'link', ToggleLink, marks.link, marks.code_inline),
    };
};
