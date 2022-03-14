import { defineComponent, PropType } from 'vue'


export default defineComponent({
    props: {
        matchedwords: {
            type: Array as PropType<string[]>,
        },
    },
});
