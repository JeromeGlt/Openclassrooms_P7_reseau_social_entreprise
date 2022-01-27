<template>
    <div>
        <div id="post" class="box_shadow basics">
            <div id="userPost">
                <div class="userImageContainer" :style="{ backgroundImage: 'url(' + postAuthorImageUrl + ')' }"></div>
                <div class="user">
                    <div>
                        {{ postAuthor }}
                    </div>
                    <div class="date">
                        {{ formattedDate }}
                    </div>
                </div>
            </div>
            <div id="text">
                {{ text }}
            </div>
            <img v-if="imageUrl" class="postImage" :src="imageUrl" alt="image de la publication"/>
        </div>
        <div id="link">
            <router-link id="HomepageLink" to="/posts">Page d'accueil</router-link>
        </div>
    </div>
</template>

<script>
    import formatDateMixin from '../mixins/formatDateMixin.js'

    export default {
        name: 'Homepage',
        computed: {
            formattedDate() {
                return this.formatDate(this.createdAt)
            }
        },
        data: () => ({
            createdAt: null,
            user_id: null,
            imageUrl: null,
            text: '',
            postAuthor: null,
            postAuthorImageUrl: null
        }),
        mixins: [
            formatDateMixin
        ],
        methods: {
            getOnePost() {
                let id = this.$route.params.id
                let storageToken = localStorage.getItem('token')

                fetch('http://localhost:3000/api/posts/post/' + id, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + storageToken
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.text = data.post.text
                    this.createdAt = data.post.createdAt
                    this.imageUrl = data.post.imageUrl
                    this.user_id = data.post.user_id

                    fetch('http://localhost:3000/api/posts/getId/' + this.user_id, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        this.postAuthor = data.pseudo
                        this.postAuthorImageUrl = data.imageUrl
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
            }
        },
        mounted() {
            this.getOnePost()
        }
    }
</script>

<style scoped lang="scss">
    #post {
        width: 85%;
        border-radius: 15px;
        margin: 0 auto;
        padding-bottom: 2rem;
    }
    #userPost {
        width: 100%;
        margin: 0.5rem 0 0.5rem 0;
        display: flex;
        align-items: center;
    }
    #text {
        text-align: center;
        margin: 0 0.5rem;
    }
    .postImage {
        max-width: 90%;
        max-height: 20rem;
        margin-top: 1rem;
    }
    #link {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 1.2em;
        padding: 1rem;
        text-align: center;
    }
    #HomepageLink {
        color: #212E53;
        &:active {
            color: #212E53;
        }
    }
</style>