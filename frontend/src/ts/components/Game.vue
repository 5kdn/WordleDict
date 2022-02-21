<script lang="ts" src='./Game.ts'></script>


<template lang="pug">
#game
    .word-box(v-for='(word, widx) in wordlist.get_full_words()' :wordid='widx')
        template(v-for='(c, cidx) in word')
            .char-box.chr(
                v-bind:class="c.text == '' ? 'yet': c.state == 0 ? 'absent' : c.state == 1 ? 'present' : 'correct'"
                @click='toggle($event)'
                :chrid='cidx') {{c.text}}
        .char-box.del_btn(@click='clear_word($event)') x
    form(@submit.prevent="exec")
        input(
            type="text"
            placeholder="words"
            maxlength="5"
            minlength="5"
            pattern="[a-z]{5}"
            autofocus
            )
        button(type="submit")
</template>


<style lang="scss" src='./Game.scss' scoped></style>
