#!/usr/bin/env node

import { defineComponent, ref, Ref } from 'vue'
import axios from 'axios'
import Game from './Game.vue'
import { WordList } from './WordList'


interface SenderObject{
    in: string[],
    in_not_positions: { [key: string]: number[] },
    not_in: string[],
    fixed: string,
}


export default defineComponent({
    data: function () {
        return {
            wordlist: ref(new WordList()),
        }
    },
    components: {
        Game,
    },
})
