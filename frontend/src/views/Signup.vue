<template>
    <div id="welcome_signup">
        <div id="signup">
            <p id="signup_presentation">Veuillez remplir tous les champs afin de créer votre compte</p>
            <div class="form">
                <label for='email'>Email</label>
                <input type="text" id="user_email" name="email" v-model="email">
            </div>
            <div class="form">
                <label for='pseudo'>Pseudo</label>
                <input type="text" id="user_pseudo" name="pseudo" v-model="pseudo">
            </div>
            <div class="form">
                <label for='password'>Mot de passe</label>
                <input type="password" id="user_password" name="password" v-model="password">
            </div>
            <div class="form">
                <label id="user_imageUrl_label" for="user_imageUrl">Ajouter votre image</label>
                <input type="file" id="user_imageUrl" name="imageUrl" @change="uploadFile($event)">
            </div>
            <p id="alert" v-if="!this.pseudo || !this.email || !this.imageUrl || !this.password">Veuillez remplir tous les champs pour créer votre compte</p>
            <router-link v-if="this.pseudo && this.email && this.password && this.imageUrl" to='/posts' id="send_button" @click="click">Créer mon compte</router-link>
            <p id="loginLink">Si vous avez déjà un compte, <router-link id="login_link_router" to="/login">cliquez ici !</router-link></p>
        </div>
    </div>
</template>

<script>

export default {

    name: 'Signup',
    data() {
        return {
            pseudo: '',
            password: '',
            email: '',
            imageUrl: ''
        }
    },
    methods: {
        click() {
            let formData = new FormData()
            formData.append('pseudo', this.pseudo)
            formData.append('password', this.password)
            formData.append('imageUrl', this.imageUrl)
            formData.append('email', this.email)
                
            this.$store.dispatch('submitSignup', formData)
        },
        uploadFile(event) {
            this.imageUrl = event.target.files[0]
        }
    }
}
</script>

<style scoped lang='scss'>

    #welcome_signup {
        min-height: 100vh;
        color: #212E53;
        background: #E2E9C0;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
    #signup {
        width: 350px;
        background: #fcfcfc;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        position: relative;
    }
    #welcome_signup, #signup, .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #signup_presentation {
        font-size: 1.4em;
        justify-content: center;
        text-align: center;
        margin: 1em 2.5em;
    }
    input {
        width: 100%;
        height: 50%;
        border: none;
        outline: none;
        border-radius: 5px;
        padding: 10px;
        margin: 20px auto;
        background: #E8F0FE;
        &:focus {
            outline: none;
        }
    }
    #user_imageUrl {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    #user_imageUrl_label {
        color: #212E53;
        background: #E8F0FE;
        font-size: 1em;
        font-weight: bold;
        margin: 15px 0 20px 0;
        border-radius: 5px;
        cursor: pointer;
        padding: 1em 1em;
    }
    label {
        font-size: 1.2em;
        font-weight: bold;
        color: #212E53;
    }
    #send_button {
        width: 60%;
        height: 40%;
        color: #fff;
        justify-content: center;
        text-align: center;
        display: block;
        background: #212E53;
        font-size: 1em;
        font-weight: bold;
        margin: 10px 0 15px 0;
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
    #alert {
        width: 90%;
        margin: 1rem 0;
        text-align: center;
        font-size: 1.2em;
        padding: 0.2rem;
        background: rgba(255, 0, 0, 0.2);
    }
    #loginLink {
        margin: 1rem 0;
        font-size: 1.2em;
        text-align: center;
    }
    #login_link_router {
    text-decoration: none;
    color: #212E53;
    &:active {
        text-decoration: none;
    }
}
</style>