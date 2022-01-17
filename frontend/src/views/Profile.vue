<template>
    <div id='profile'>
        <div v-if="isEmailOpened">
            Votre email est : {{ email }}
            <button @click="doubleFunction">Modifier votre email</button>
        </div>

        <!-- Modification de l'email -->
        <div v-if="isModifyEmailDialogOpened">
            <label for='mail'>Entrez votre nouvel email :</label>
            <input type="text" id="user_email_modify" name="email_modify" :value="email" @input="modifyEmail">
            <button @click="modifyProfile(userId)">Envoyer</button>
            <button @click="doubleFunction">Annuler</button>
        </div>
        <div>
            Votre pseudo est : {{ pseudo }}
        </div>
        <div>
            <img :src="imageUrl"/>
            <button @click="showModifyImageDialog">Modifier l'image</button>
            <div v-if="isModifyImageProfileOpened">
                <input type="file" id="user_imageUrl" name="imageUrl_modify" @input="modifyImageProfile">
                <button @click="sendModifiedImageProfile(userId)">Envoyer</button>
                <button @click="showModifyImageDialog">Annuler</button>
            </div>
        </div>
        <button id="countSuppression" @click="deleteClick">Supprimer mon compte</button>
        <router-link to='/login' @click="logout">Se déconnecter</router-link>
    </div>

    <!-- <router-link to='/posts'>Retourner sur la page d'accueil</router-link> -->
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
        isModifyImageProfileOpened: false
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

            this.$store.dispatch('modifyProfile', { bodyProfile, userId })
            this.$store.dispatch('getUserDatas')
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
            let bodyProfile = {
                email: this.email
            }
            console.log(bodyProfile)
            this.$store.dispatch('modifyProfile', { bodyProfile, userId })
            this.$store.dispatch('getUserDatas')
        },
    },
    beforeMount() {
        this.getUserDatas()
    }
}
</script>

<style scoped lang='scss'>

    #countSuppression {
    width: 18rem;
    height: 4rem;
    border-radius: 20em;
    box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
    border: none;
    outline: none;
    color: #fff;
    font-size: 1em;
    cursor: pointer;
    background: red;
    }

</style>