<script lang="ts" src='./Result.ts'></script>


<template lang="pug">
#result
    p {{matchedwords.length}} words hitted.
    ul
        template(v-for='word in matchedwords')
            li {{word}}
</template>


<style lang="scss" src='./Result.scss' scoped></style>
