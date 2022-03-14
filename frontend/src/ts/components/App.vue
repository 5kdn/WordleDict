<template lang="pug">
#upper
    Game(:wordlist='wordlist' v-bind:wordlist='wordlist' v-on:wordlist-changed='wlchanged')
    Graph(:matchedwords='matchedwords')
hr
#lower
    Result(:matchedwords='matchedwords')
</template>

<script type="ts" src='./App.ts'></script>

<style lang="scss"></style>
