<template>
    <div id="welcome_signup">
        <div id="signup" class="box_shadow">
            <p id="signup_presentation">Veuillez remplir tous les champs afin de créer votre compte</p>
            <div class="form">
                <label for='email'>Email</label>
                <input type="text" name="email" v-model="email" @change="emailInput">
                <div class="alert background_alert" v-if="alertEmail">Veuillez renseigner une adresse mail valide. Exemple: jean@dupont.fr</div>
            </div>
            <div class="form">
                <label for='pseudo'>Pseudo</label>
                <input type="text" name="pseudo" v-model="pseudo" @change="pseudoInput">
                <div class="alert background_alert" v-if="alertPseudo">Le pseudo doit contenir entre 5 et 40 caractères. Seuls les lettres, points et tirets sont autorisés</div>
            </div>
            <div class="form">
                <label for='password'>Mot de passe</label>
                <input type="password" name="password" v-model="password" @change="passwordInput">
                <div class="alert background_alert" v-if="alertPassword">Le mot de passe doit contenir entre 8 et 100 caractères dont une minuscule, une majuscule et un chiffre</div>
            </div>
            <div class="form">
                <label id="user_imageUrl_label" class="cursor imageUrl_label" for="user_imageUrl">Ajouter votre image</label>
                <input type="file" class="input_hidden" id="user_imageUrl" name="imageUrl" @change="uploadFile($event)">
            </div>
            <p id="alertInput" class="background_alert" v-if="!this.pseudo || !this.email || !this.imageUrl || !this.password || alertEmail ||alertPseudo || alertPassword">Veuillez remplir tous les champs pour créer votre compte</p>
            <button v-if="this.pseudo && this.email && this.password && this.imageUrl && !alertEmail && !alertPseudo && !alertPassword" id="send_button" class="basics_buttons" @click="click">Créer mon compte</button>
            <div class="alert background_alert" v-if="message">{{ message }}</div>
            <p id="loginLink">Si vous avez déjà un compte, <router-link id="login_link_router" to="/login">cliquez ici !</router-link></p>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {

        name: 'Signup',
        computed: {
            ...mapState({
                message: state => state.message
            }),
        },
        data: () => ({
                pseudo: '',
                password: '',
                email: '',
                imageUrl: '',
                alertEmail: false,
                alertPseudo: false,
                alertPassword: false
        }),
        methods: {
            emailInput() {
                if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/i.test(this.email)) {
                    return this.alertEmail = true
                } else {
                    this.alertEmail = false
                }
            },
            pseudoInput() {
                if(/[^a-zA-Z-_.]/i.test(this.pseudo)) {
                    return this.alertPseudo = true
                } else {
                this.alertPseudo = false
                }
            },
            passwordInput() {
                if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,100}$/.test(this.password)) {
                    return this.alertPassword = true
                } else {
                    this.alertPassword = false
                }
            },
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
        border: none;
        border-radius: 5px;
        padding: 10px;
        margin: 20px auto;
        background: #E8F0FE;
        &:focus {
            outline: none;
        }
    }
    #user_imageUrl_label {
        font-size: 1em;
        margin: 15px 0 20px 0;
        padding: 1em 1em;
    }
    label {
        font-size: 1.2em;
        font-weight: bold;
    }
    #send_button {
        width: 60%;
        height: 40%;
        display: block;
        margin: 10px 0 15px 0;
        padding: 1em 1em;
        &:hover {
            background: #BED3C3;
            color: #212E53;
        }
    }
    #alertInput {
        width: 90%;
        margin: 1rem 0;
        text-align: center;
        font-size: 1.2em;
        padding: 0.2rem;
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
    .alert {
        text-align: center;
        margin: 0 0.3rem 0.5rem 0.3rem;
        padding: 0.5rem;
    }
</style>