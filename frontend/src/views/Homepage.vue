<template>
    <router-link class="linkHomepage" to='/profile'>Voir mon profil</router-link>
    <router-link class="linkHomepage" to='/login' @click="logout">Se déconnecter</router-link>
    <div id="createPost">
        <p>{{ pseudo }},</p>
        <label for="post">que voulez-vous partager aujourd'hui ?</label>
        <div id="text_image">
            <textarea name="postText" rows="3" cols="50" v-model="text"></textarea>
            <input type="file" id="post_imageUrl" name="imageUrl" @change="uploadFile($event)">
            <label for="post_imageUrl" id="post_imageUrl_label">Ajouter un fichier...</label>
        </div>
        <div id="alertPost" v-if="alertPost">
            Veuillez ajouter du texte ou une image
        </div>
        <button id="sendButton" @click="sendPost">Publier</button>
    </div>
    <ul id='posts'>
        <li v-for="post in posts" :key="post.text">
            <Post :postData="post"/>
        </li>
    </ul>
</template>

<script>

import { mapState } from 'vuex'
import Post from '../components/Post.vue'

export default {
    name: 'Homepage',
    components: {
        Post
    },
    computed: {
        ...mapState(['pseudo', 'userId', 'posts'])
    },
    data: () => ({
        alertPost: false,
        text: ''
    }),
    methods: {
        sendPost() {

            if((this.text === undefined || this.text === "") && this.imageUrl === undefined) {
                return this.alertPost = true
            } else {
                this.alertPost = false
            }

            let formData = new FormData()
            formData.append('text', this.text)
            formData.append('imageUrl', this.imageUrl)
            formData.append('userId', this.userId)

            this.$store.dispatch('createPost', formData)
        },
        uploadFile(event) {
            console.log(event.target.files)
            this.imageUrl = event.target.files[0]
        },
        loadAllPosts() {
            this.$store.dispatch('loadAllPosts')
        },
        getUserDatas() {
            this.$store.dispatch('getUserDatas')
        },
        logout() {
            localStorage.clear()
        }
    },
    mounted() {
        this.getUserDatas(),
        this.loadAllPosts()
    }
}
</script>

<style scoped lang='scss'>
    .linkHomepage {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 1.1em;
        margin: 0 1rem 0 1.5rem;
        text-decoration: none;
        color: #212E53;
    }
    #createPost {
        background: #fcfcfc;
        width: 100%;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #212E53;
        font-size: 1.2em;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 1rem 0 1rem 0;
        margin: 1rem 0 1.5rem 0;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
    }
    #text_image {
        display: flex;
        flex-direction: column;
        margin-top: 1.5rem;
    }
    textarea {
        max-width: 90%;
        border-radius: 10px;
        background: #E8F0FE;
        text-align: center;
        font-size: 1.2em;
        margin: 0 auto;
    }
    #post_imageUrl {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    #post_imageUrl_label {
        max-width: 90%;
        color: #212E53;
        background: #E8F0FE;
        font-size: 0.8em;
        font-weight: bold;
        margin: 15px auto;
        border-radius: 5px;
        cursor: pointer;
        padding: 0.7em 0.5em;
    }
    #alertPost {
        background: rgba(255, 0, 0, 0.2);
        padding: 0.2rem;
    }
    #sendButton {
        width: 20%;
        color: #fff;
        text-align: center;
        display: block;
        background: #212E53;
        font-size: 1em;
        font-weight: bold;
        margin: 10px 0 10px 0;
        outline: none;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: .2s ease-in;
        padding: 0.7em 0.5em;
        &:hover {
            background: #BED3C3;
            color: #212E53;
        }
    }
    ul {
        display: flex;
        flex-direction: column-reverse;
    }
</style>