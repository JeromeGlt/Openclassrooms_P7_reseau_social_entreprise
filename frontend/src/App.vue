<template>
    <div id="general">
        <div id="app">
        <img alt='Logo de Groupomania' src='./assets/icon-left-font-monochrome-black_2.png'>
        </div>
        <router-view/>
    </div>
</template>

<script>
import './assets/style/reset.css'
export default {
    name: 'App'
}
</script>

<style scoped lang='scss'>
#general {
    background: #E2E9C0;
    min-height: 100vh;
}
#app {
    display: flex;
    align-items: center;
    justify-content: center;
}
img {
    width: 28em;
}
</style>