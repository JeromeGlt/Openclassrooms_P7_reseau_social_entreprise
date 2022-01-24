<template>
    <div id="profile">
        <div id="profileImage">
            <img id="userImage" :src="imageUrl"/>
            <button id="modifyImageButton" title="Modifier l'image" @click="showModifyImageDialog"><img class="modifyIcon" src="../assets/edit-regular.svg"/></button>
            <!-- Modification de l'image -->
            <div id="modifySection" v-if="isModifyImageProfileOpened">
                <input type="file" id="user_imageUrl_modify" name="imageUrl_modify" @input="modifyImageProfile">
                <label id="user_imageUrl_modify_label" for="user_imageUrl_modify">Choisir une image...</label>
                <div id="modifyImageButtons">
                    <button id="sendModifiedImage" @click="sendModifiedImageProfile(userId)">Envoyer</button>
                    <button title="Annuler" class="cancelButton" @click="showModifyImageDialog">X</button>
                </div>
            </div>
        </div>

        <div class="elementPresentation" v-if="isEmailOpened">
            Votre email est : {{ email }}
            <button id="modifyEmailButton" title="Modifier l'email" @click="doubleFunction"><img class="modifyIcon" src="../assets/edit-regular.svg"/></button>
        </div>

        <!-- Modification de l'email -->
        <div id="modifyEmailSection" v-if="isModifyEmailDialogOpened">
            <label for="mail">Entrez votre nouvel email :</label>
            <input type="text" id="user_email_modify" name="email_modify" :value="email" @input="modifyEmail">
            <button id="sendModifiedEmail" @click="modifyProfile(userId)">Envoyer</button>
            <button class="cancelButton" title="Annuler" @click="doubleFunction">X</button>
        </div>
            <div id="alertEmail" v-if="alertEmail">
                Veuillez ajouter une adresse mail valide
            </div>
        <!-- ------------------------------- -->
        <div class="elementPresentation">
            Votre pseudo est : {{ pseudo }}
        </div>
        <button id="countSuppression" @click="deleteClick"><router-link to="/signup">Supprimer mon compte</router-link></button>
        <div id="links">
            <router-link to="/login" @click="logout">Se déconnecter</router-link>
            <router-link to="/posts">Page d'accueil</router-link>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import { mapGetters } from 'vuex'
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
            console.log(bodyProfile)

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
            console.log(bodyProfile)
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
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
    }
    .elementPresentation, #modifyEmailSection {
        background: #fcfcfc;
        border-radius: 15px;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
        border-radius: 15px;
        margin: 1.5rem 0;
        padding: 1rem;
        display: flex;
        align-items: center;
        width: 100%;
    }
    #modifyImageButton, #modifyEmailButton{
        border: none;
        outline: none;
        background: none;
        cursor: pointer;
        position: relative;
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
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 1rem auto;
        padding: 1rem 1rem 0 1rem;
    }
    #user_imageUrl_modify {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    #user_imageUrl_modify_label {
        color: #212E53;
        background: #E8F0FE;
        font-size: 0.8em;
        font-weight: bold;
        margin: 0 auto;
        border-radius: 5px;
        cursor: pointer;
        padding: 0.7em 0.5em;
    }
    #modifyImageButtons {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    #sendModifiedImage {
        width: 85%;
        color: #fff;
        text-align: center;
        background: #212E53;
        font-size: 1em;
        font-weight: bold;
        margin: 1rem 0;
        outline: none;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        padding: 0.7em 0.5em;
    }
    .cancelButton {
        border: none;
        background: none;
        outline: none;
        color: #A7001E;
        font-size: 1.2em;
        cursor: pointer;
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
        color: #fff;
        text-align: center;
        background: #212E53;
        font-size: 0.7em;
        font-weight: bold;
        margin: 0 2rem 0 1rem;
        outline: none;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        padding: 0.7em 0.5em;
    }
    #alertEmail {
        background: rgba(255, 0, 0, 0.2);
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
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
    }
    #links {
        width: 80%;
        display: flex;
        justify-content: space-around;
        margin-bottom: 2rem;
    }
    a {
        text-decoration: none;
        color: #212E53;
        &:active {
            text-decoration: none;
            color: #212E53;
        }
    }

</style>