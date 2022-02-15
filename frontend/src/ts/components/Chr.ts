#!/usr/bin/env node

export enum State{
    Absent,     // 灰色
    Present,    // 黄色
    Correct     // 緑色
}


export class Chr{
    private _text: string
    private _state: State

    constructor (text: string='', state: State=State.Absent) {
        this._text = text
        this._state = state
    }

    get text(): string{
        return this._text
    }
    set text(text: string) {
        if (! text.match(/^[a-z]$/)) throw new Error('"text" must match "/^[a-z]$/".')
        this._text = text
    }

    get state() :State{
        return this._state
    }
    set state(state: State) {
        this._state = state
    }
}