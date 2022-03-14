#!/usr/bin/env node

import { defineComponent, ref, Ref } from 'vue'
import axios from 'axios'
import Game from './Game.vue'
import Graph from './Graph.vue'
import Result from './Result.vue'
import { WordList } from './WordList'


interface SenderObject{
    in: string[],
    in_not_positions: { [key: string]: number[] },
    not_in: string[],
    fixed: string,
}


export default defineComponent({
    data: function () {
        const matchedwords:Ref<string[]> = ref([])
        axios.post('./search',{})
        .then(response => {
            matchedwords.value = response.data['result']
        })
        .catch(error => {
            throw new Error(error)
        })

        return {
            wordlist: ref(new WordList()),
            matchedwords: matchedwords,
        }
    },
    components: {
        Game,
        Graph,
        Result,
    },
    methods: {
        wlchanged: async function () {
            let params:SenderObject = this.wordlist.send_data()

            const res = await axios.post(
                './search',
                params,
            )
                .catch(error => {
                    throw new Error("通信エラー")
                })

            if (res.status === 200){
                this.matchedwords = res.data['result']
            } else {
                throw new Error(res.status.toString() + "error")
            }
        }
    },
})
