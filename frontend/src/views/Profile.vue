<template>
    <div id="profile">
        <div id="profileImage">
            <img id="userImage" class="box_shadow" :src="imageUrl" alt="image de l'utilisateur"/>
            <button class="modifyProfileButton cursor" id="modifyImageButton" title="Modifier l'image" @click="showModifyImageDialog"><img class="modifyIcon" src="../assets/edit-regular.svg"/></button>
            <!-- Modification de l'image -->
            <div id="modifySection" class="box_shadow" v-if="isModifyImageProfileOpened">
                <input type="file" class="input_hidden" id="user_imageUrl_modify" name="imageUrl_modify" @input="modifyImageProfile">
                <label id="user_imageUrl_modify_label" class="cursor imageUrl_label" for="user_imageUrl_modify">Choisir une image...</label>
                <div id="modifyImageButtons">
                    <button id="sendModifiedImage" class="basics_buttons cursor" @click="sendModifiedImageProfile(userId)">Envoyer</button>
                    <button title="Annuler" class="cancelButton cursor" @click="showModifyImageDialog">X</button>
                </div>
            </div>
        </div>

        <div class="elementPresentation box_shadow" v-if="isEmailOpened">
            Votre email est : {{ email }}
            <button class="modifyProfileButton cursor" id="modifyEmailButton" title="Modifier l'email" @click="doubleFunction"><img class="modifyIcon" src="../assets/edit-regular.svg"/></button>
        </div>

        <!-- Modification de l'email -->
        <div class="elementPresentation" v-if="isModifyEmailDialogOpened">
            <label for="mail">Entrez votre nouvel email :</label>
            <input type="text" id="user_email_modify" name="email_modify" :value="email" @input="modifyEmail">
            <button id="sendModifiedEmail" class="basics_buttons cursor" @click="modifyProfile(userId)">Envoyer</button>
            <button class="cancelButton cursor" title="Annuler" @click="doubleFunction">X</button>
        </div>
        <div id="alertEmail" class="background_alert" v-if="alertEmail">
            Veuillez ajouter une adresse mail valide
        </div>
        <!-- ------------------------------- -->
        <div class="elementPresentation box_shadow">
            Votre pseudo est : {{ pseudo }}
        </div>
        <button id="countSuppression" class="box_shadow cursor" @click="deleteClick"><router-link to="/signup">Supprimer mon compte</router-link></button>
        <div id="links">
            <router-link to="/login" @click="logout">Se déconnecter</router-link>
            <router-link to="/posts">Page d'accueil</router-link>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'Profile',
        computed: {
            ...mapState({
                pseudo: state => state.pseudo,
                email: state => state.email,
                imageUrl: state => state.imageUrl,
                userId: state => state.userId
            })
        },
        data: () => ({
            isModifyEmailDialogOpened: false,
            isEmailOpened: true,
            isModifyImageProfileOpened: false,
            alertEmail: false
        }),
        methods: {
            logout() {
                localStorage.clear()
            },
            showModifyImageDialog() {
                this.isModifyImageProfileOpened = !this.isModifyImageProfileOpened
            },
            deleteClick() {
                this.$store.dispatch('deleteUser')
            },
            doubleFunction() {
                this.emailOpened(),
                this.showModifyEmailDialog()
            },
            getUserDatas() {
                this.$store.dispatch('getUserDatas')
            },
            sendModifiedImageProfile(userId) {

                let bodyProfile = new FormData()
                bodyProfile.append('imageUrl', this.imageUrl)

                this.$store.dispatch('modifyImageProfile', { bodyProfile, userId })
                this.$store.dispatch('getUserDatas')
                this.isModifyImageProfileOpened = !this.isModifyImageProfileOpened
            },
            showModifyEmailDialog() {
                this.isModifyEmailDialogOpened = !this.isModifyEmailDialogOpened
            },
            emailOpened() {
                this.isEmailOpened =! this.isEmailOpened
            },
            modifyEmail(event) {
                this.$store.commit('UPDATE_EMAIL', event.target.value)
            },
            modifyImageProfile(event) {
                this.$store.commit('UPDATE_IMAGE_PROFILE', event.target.files[0])
            },
            modifyProfile(userId) {

                if(this.email === undefined || this.email === "") {
                    return this.alertEmail = true
                } else {
                    this.alertEmail = false
                }

                if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/i.test(this.email)) {
                    return this.alertEmail = true
                } else {
                    this.alertEmail = false
                }

                let bodyProfile = {
                    email: this.email
                }

                this.$store.dispatch('modifyEmailProfile', { bodyProfile, userId })
                this.$store.dispatch('getUserDatas')
                this.isModifyEmailDialogOpened = !this.isModifyEmailDialogOpened
                this.isEmailOpened = !this.isEmailOpened
            },
        },
        beforeMount() {
            this.getUserDatas()
        }
    }
</script>

<style scoped lang='scss'>
    #profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #212E53;
        font-size: 1.3em;
    }
    #profileImage {
        width: 25%;
        margin: 1.5rem auto;
    }
    #userImage {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
    }
    .elementPresentation {
        background: #fcfcfc;
        border-radius: 15px;
        border-radius: 15px;
        margin: 1.5rem 0;
        padding: 1rem;
        display: flex;
        align-items: center;
        width: 100%;
    }
    #modifyImageButton {
        width: 15%;
    }
    #modifyEmailButton {
        width: 2%;
        position: absolute;
        right: 1rem;
    }
    .modifyIcon {
        width: 100%;
    }
    #modifySection {
        background: #fcfcfc;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 1rem auto;
        padding: 1rem 1rem 0 1rem;
    }
    #user_imageUrl_modify_label {
        margin: 0 auto;
    }
    #modifyImageButtons {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    #sendModifiedImage {
        width: 85%;
        margin: 1rem 0;
        padding: 0.7em 0.5em;
        transition: none;
    }
    #user_email_modify {
        background: #E8F0FE;
        margin: 0 1rem;
        border: none;
        padding: 0.5rem;
        border-radius: 15px;
    }
    #sendModifiedEmail {
        width: 20%;
        font-size: 0.7em;
        margin: 0 2rem 0 1rem;
        padding: 0.7em 0.5em;
    }
    #alertEmail {
        padding: 0.2rem;
        font-size: 0.9em;
    }
    #countSuppression {
        border: #A7001E 5px solid;
        outline: none;
        background: #fcfcfc;
        padding: 1rem;
        text-decoration: none;
        font-size: 1.2em;
        margin: 1.5rem 0;
    }
    #links {
        width: 80%;
        display: flex;
        justify-content: space-around;
        margin-bottom: 2rem;
    }
    a {
        color: #212E53;
        &:active {
            text-decoration: none;
            color: #212E53;
        }
    }
</style>