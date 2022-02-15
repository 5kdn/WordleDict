#!/usr/bin/env node

import { State, Chr } from './Chr'


export class Word {
    private _arr: Chr[]

    /**
     * Creates an instance of Word.
     * @memberof Word
     */
    constructor (text:string = '') {
        this._arr = []
        for (let i = 0; i < 5; i++) {
            this._arr.push(new Chr())
        }

        if (text == '') return
        this.set_text_as_absent(text)
    }

    /**
     * @description crear word
     * @memberof Word
     */
    clear() {
        this._arr.forEach(c => {
            c.text = ''
            c.state = State.Absent
        });
    }

    get text(): string{
        let t: string = ''
        this._arr.forEach(c => {
            t += c.text
        })
        return t
    }

    get chars(): Chr[]{
        return this._arr
    }

    get cells(): Chr[]{
        return this._arr
    }

    /**
     * @description 単語をState=State.absentとして追加する。
     * @memberof Word
     */
    set_text_as_absent(text: string) {
        if (! text.match(/^[a-z]{5}$/)) throw new Error('"text" must match "/^[a-z]{5}$/".')
        for (let i = 0; i < this._arr.length; i++){
            this._arr[i].text = text.charAt(i)
            this._arr[i].state = State.Absent
        }
    }

    /**
     * @description 指定したアルファベットのstateを循環変更する(灰->黃->緑->灰)
     * @param {number} index
     * @memberof Word
     */
    toggle_state(index: number) {
        if (index < 0 || index >= 5) throw new Error('"index" out of bounds.')
        this._arr[index].state = (this._arr[index].state + 1) % 3
    }

    /**
     * @description Wordに格納された単語を返す
     * @readonly
     * @type {string}
     * @memberof Word
     */
    get_value(): string {
        let val = ""
        this._arr.forEach(c => {
            val += c.text
        })
        return val
    }

    get_char(index: number): Chr{
        if (index < 0 || index >= 5) throw new Error('"index" out of bounds.')
        return this._arr[index]
    }

    /**
     * @description Wordに格納されたStateの一覧を返す
     * @type {State[]}
     * @memberof Word
     */
    states(): State[]{
        let s:State[] = []
        this._arr.forEach(c => {
            s.push(c.state)
        })
        return s
    }

    /**
     * @description index文字目のStateを返す
     * @param index
     * @returns
     */
    state(index: number): State{
        if (index < 0 || index >= 5) throw new Error('"index" out of bounds.')
        return this._arr[index].state
    }
}