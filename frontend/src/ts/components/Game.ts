import { defineComponent } from 'vue'
import { WordList } from './WordList'


export default defineComponent({
    props:{
        wordlist:{
            type: WordList,
        }
    },

    methods: {
        /**
         * @description 入力フォームに入力された単語を登録し、フォームを空にする
         */
        exec() {
            const form: HTMLFormElement | null = document.querySelector('form')
            if (form === null) throw new Error('form not found.')

            const input_elem: HTMLInputElement | null = form.querySelector('input')
            if (input_elem === null) throw new Error('input area is found.')
            if (this.wordlist === undefined) throw new Error('wl undefined.')

            try {
                this.wordlist.push(input_elem.value)
            } catch (error) {
                console.error(error)
            }
            input_elem.value = ''

            this.$emit('wordlist-changed', this.wordlist)
        },

        /**
         * @description 文字パネルが押されたときタイルのステータスと色を変える
         * @param {PointerEvent} event
         */
        toggle(event: PointerEvent) {
            if (this.wordlist === undefined) throw new Error('wl undefined.')
            if (event.currentTarget === null) throw new Error('event.currentTarget is null.')
            let cur_tgt:HTMLDivElement = (<HTMLDivElement>event.currentTarget)

            let cls = cur_tgt.classList.value
            if (cls.includes('yet')) return

            let word_id: number = Number((<HTMLDivElement>(<HTMLDivElement>event.target).parentNode).getAttribute('wordid'))
            let char_id: number = Number(cur_tgt.getAttribute('chrid'))
            this.wordlist.toggle_state(word_id, char_id)
            this.$emit('wordlist-changed', this.wordlist)
        },

        /**
         * @description ×ボタンが押されたとき、その単語を削除する
         * @param {PointerEvent} event
         */
        clear_word(event: PointerEvent) {
            // TODO: 対象行がemptyのとき中止
            if (this.wordlist === undefined) throw new Error('wl undefined.')
            if (event.currentTarget === null) throw new Error('event.currentTarget is null.');

            let word_id: number = Number((<HTMLDivElement>(<HTMLDivElement>event.target).parentNode).getAttribute('wordid'))
            this.wordlist.clear(word_id)

            this.$emit('wordlist-changed', this.wordlist)
        }
    }

})