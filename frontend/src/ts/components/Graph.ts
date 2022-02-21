#!/usr/bin/env node

import { defineComponent, PropType , Ref, ref} from 'vue'
import { Responsive, Chart, Grid, Bar, Tooltip } from 'vue3-charts'


export default defineComponent({
    components: { Responsive, Chart, Grid, Bar, Tooltip },
    setup(){
        const data: Ref<{ letter: string; count: number }[]> = ref([])
        const axis = {
            primary: {
                type: 'band'
            },
            secondary: {
                domain: ['0', 'dataMax * 1.1'],
                type: 'linear',
                ticks: 8
            }
        }
        return { data, axis }
    },
    props: {
        matchedwords: {
            type: Array as PropType<string[]>,
        },
    },
    watch: {
        matchedwords: function (mw: string[]) {
            let arr:{ [key: string]: number} = {}
            mw.forEach(word => {
                Array.prototype.forEach.call(word, c => {
                    if (!arr[c]) {
                        arr[c] = 1
                    } else {
                        arr[c] += 1
                    }
                })
            })

            let ret: { letter: string; count: number; }[] = []
            for (let i = 97; i <= 122; i++){
                let lttr:string = String.fromCharCode(i)
                ret.push({
                    letter: lttr,
                    count: arr[lttr] ? arr[lttr] : 0
                })
            }
            this.data = ret.sort((n1, n2)=> {
                if (n1.count < n2.count) return 1
                if (n1.count > n2.count) return -1
                return 0
            })
        },
    },
})
