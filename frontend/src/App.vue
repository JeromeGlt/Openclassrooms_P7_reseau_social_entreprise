<template>
    <div id="general">
        <img alt='Logo de Groupomania' src='./assets/icon-left-font-monochrome-black_2.png'>
    </div>
    <router-view/>
</template>

<script>
    import './assets/style/reset.css'
    export default {
        name: 'App'
    }
</script>

<style scoped lang='scss'>
    #general {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    img {
        width: 28em;
    }
</style>