<template>
    <router-link class="linkHomepage" to='/profile'>Voir mon profil</router-link>
    <router-link class="linkHomepage" to='/login' @click="logout">Se déconnecter</router-link>
    <div id="createPost" class="box_shadow basics">
        <p>{{ pseudo }},</p>
        <label for="post">que voulez-vous partager aujourd'hui ?</label>
        <div id="text_image">
            <textarea name="postText" rows="3" cols="50" v-model="text"></textarea>
            <input type="file" id="post_imageUrl" class="input_hidden" name="imageUrl" @change="uploadFile($event)">
            <label for="post_imageUrl" id="post_imageUrl_label" class="imageUrl_label">Ajouter un fichier...</label>
        </div>
        <div id="alertPost" class="background_alert" v-if="alertPost">
            Veuillez ajouter du texte ou une image
        </div>
        <button id="sendButton" class="basics_buttons cursor" @click="sendPost">Publier</button>
    </div>
    <ul>
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
            ...mapState({
                pseudo: state => state.pseudo,
                userId: state => state.userId,
                posts: state => state.posts
            })
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
        width: 100%;
        padding: 1rem 0 1rem 0;
        margin: 1rem 0 1.5rem 0;
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
    #post_imageUrl_label {
        max-width: 90%;
        margin: 15px auto;
    }
    #alertPost {
        padding: 0.2rem;
    }
    #sendButton {
        width: 20%;
        display: block;
        margin: 10px 0 10px 0;
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