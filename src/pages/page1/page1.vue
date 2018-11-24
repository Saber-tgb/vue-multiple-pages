<template>
    <article class="page1">
        <h1>page1</h1>
        <button type="success"
                   plain><a href="page2.html">跳转page2</a></button>
        <img src="../../assets/logo.png"
             alt="logo">
        <div class="page-box"></div>
        <button class="button"
                @click="toClick">弹窗</button>
    </article>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ConfirmLoan extends Vue {
    private toClick() {
        alert('弹窗')
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/page1';
</style>

