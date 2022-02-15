#!/usr/bin/env node

import { Chr, State } from './Chr';
import { Word } from './Word';

interface SenderObject{
    in: string[],
    not_in: string[],
    in_not_positions: { [key: string]: number[] },
    fixed: string,
}

export class WordList {
    private _arr: Word[]

    constructor () {
        this._arr = []
    }

    /**
     * @description 登録されている単語数を返す
     * @readonly
     * @type {number}
     * @memberof WordList
     */
    get length(): number {
        return this._arr.length
    }

    get_charactor(word_index: number, chr_index: number): Chr{
        if (word_index < 0 || word_index > this._arr.length) throw new Error('"word_index" out of bounds.')
        return this._arr[word_index].get_char(chr_index)
    }

    get_word(index: number): Word{
        if (index < 0 || index >= 6) throw new Error('"index" out of bounds.')
        return this._arr[index]
    }

    get_full_words(): Chr[][]{
        let arr: Chr[][] = []
        this._arr.forEach(word => {
            arr.push(word.chars)
        })
        while (arr.length < 6) {
            let _: Chr[] = []
            for (let i = 0; i < 5; i++){
                _.push(new Chr())
            }
            arr.push(_)
        }
        return arr
    }

    /**
     * @description 指定行を削除する
     * @param {number} index    対象の行
     * @memberof WordList
     */
    clear(index: number) {
        if (index < 0 || index > this._arr.length) throw new Error('"index" out of bounds.');
        this._arr.splice(index, 1)
    }

    /**
     * @description 全ての行を削除する
     * @memberof WordList
     */
    clear_all() {
        this._arr = []
    }

    /**
     * @description 新しい単語を追加する
     * @param {string} text 追加する単語
     * @memberof WordList
     */
    push(text: string) {
        if (! /^[a-z]{5}$/)  throw new Error('"text" must match "/^[a-z]{5}$/".');

        this._arr.push(new Word(text))
    }

    /**
     * @description 指定したアルファベットのstateを循環変更する(灰->黃->緑->灰)
     * @param {number} word_index   行番号
     * @param {number} chr_index    文字数
     * @memberof WordList
     */
    toggle_state(word_index: number, chr_index: number) {
        this._arr[word_index].toggle_state(chr_index)
    }

    send_data(): SenderObject {
        let ret: SenderObject = {
            in: [],
            in_not_positions: {},
            not_in: [],
            fixed: '',
        }
        let fixed_word: string[] = ['_', '_', '_', '_', '_']
        this._arr.forEach((word) => {
            word.cells.forEach((chr, cidx) => {
                if (chr.state == State.Absent) {
                    // 灰色
                    if(ret['not_in'].indexOf(chr.text) < 0 ) {
                        ret['not_in'].push(chr.text)
                    }
                }
                else if (chr.state == State.Present) {
                    // 黄色
                    if (ret['in'].indexOf(chr.text) < 0) {
                        ret['in'].push(chr.text)
                    }

                    if (!ret['in_not_positions'][chr.text]) {
                        ret['in_not_positions'][chr.text] = [cidx]
                    } else if (ret['in_not_positions'][chr.text].indexOf(cidx) < 0) {
                        ret['in_not_positions'][chr.text].push(cidx)
                    }
                }
                else {
                    // Correct
                    fixed_word[cidx] = chr.text
                }
            })
        })
        ret['fixed'] = fixed_word.join('')
        return ret
    }
}