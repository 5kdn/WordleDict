<script lang="ts" src='./Graph.ts'></script>


<template lang="pug">
#graph
    Responsive.w-full
        template(#main="{width, height}")
            Chart(
                :data="data"
                :axis="axis"
                :size="{width, height}"
                )
                template(#layers)
                    Grid(strokeDasharray="2,2")
                    Bar(:dataKeys="['letter', 'count']" :barStyle="{ fill: '#90e0ef' }")
                    Labels(:dataKeys="['letter', 'count']")
                template(#widgets)
                    Tooltip(borderColor='#000' :config="{letter:{color:'#000'}}")
</template>


<style lang="scss" src='./Graph.scss' scoped />
