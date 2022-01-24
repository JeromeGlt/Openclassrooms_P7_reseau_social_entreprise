<template>
    <div id="welcome_login">
        <div id="login">
            <h1 id="welcome_message">BIENVENUE</h1>
            <div id="form_pseudo">
                <label for='pseudo'>Pseudo</label>
                <input type="text" id="pseudo" name="user_pseudo" v-model="pseudo">
            </div>
            <div id="form_password">
                <label for='password'>Mot de passe</label>
                <input type="password" id="password" name="user_password" v-model="password">
            </div>
            <p id="alert" v-if="!this.pseudo || !this.password">Veuillez remplir les champs pour vous connecter</p>
            <button v-if="this.pseudo && this.password" id='connection_button' @click="login">Connexion</button>

        <p id="signup_link">Si vous n'avez pas encore créé de compte, <router-link id="signup_link_router" to='/signup'>cliquez ici</router-link> !</p>
        <div id="message" v-if="message">{{ message }}</div>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
    name: 'Login',
    computed: {
        ...mapState({
            message: state => state.message
        }),
    },
    data: () => ({
            pseudo: '',
            password: ''
    }),
    methods: {
        login() {
            
            let loginData = {
                pseudo: this.pseudo,
                password: this.password
            }

            console.log(loginData)
            this.$store.dispatch('submitLogin', loginData)
        }
    }
}
</script>

<style scoped lang='scss'>

#welcome_login {
    min-height: 100vh;
    background: #E2E9C0;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}
#welcome_title {
    font-size: 1.5em;
}
#welcome_message {
    font-size: 2.3em;
    justify-content: center;
    margin: 60px;
    font-weight: bold;
    color: #212E53;
}
#login {
    width: 350px;
    height: auto;
    background: #fcfcfc;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    position: relative;
}
input {
    width: 100%;
    height: 50%;
    background: #E8F0FE;
    border: none;
    outline: none;
    border-radius: 5px;
    padding: 10px;
    margin: 20px auto;
}
label {
    color: #212E53;
    font-size: 1.2em;
    font-weight: bold;
}
#form_pseudo, #form_password, #login, #welcome_login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
#connection_button {
    width: 70%;
    text-align: center;
    color: #fff;
    margin: 10px auto;
    justify-content: center;
    display: block;
    background: #212E53;
    font-size: 1em;
    font-weight: bold;
    margin-top: 20px;
    outline: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: .2s ease-in;
    padding: 1em 1em;
    &:hover {
        background: #BED3C3;
        color: #212E53;
    }
}
#message {
    padding: 0.5rem;
    background: rgba(255, 0, 0, 0.2);
    margin-bottom: 0.5rem;
    color: #212E53;
}
#signup_link {
    margin: 20px;
    font-size: 1.1em;
    color: #212E53;
    text-align: center;
}
#signup_link_router {
    text-decoration: none;
    color: #212E53;
    &:active {
        text-decoration: none;
    }
}
#alert {
        width: 90%;
        margin: 1rem 0;
        text-align: center;
        font-size: 1.2em;
        padding: 0.2rem;
        background: rgba(255, 0, 0, 0.2);
    }
</style>