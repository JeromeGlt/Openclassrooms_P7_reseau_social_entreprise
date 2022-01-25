<template>
    <div id="post">
        <div id="userPost">
            <div id="userImageContainer" :style="{ backgroundImage: 'url(' + postAuthorImageUrl + ')' }"></div>
            <div id="user">
                <div id="pseudo">
                    {{ postAuthor }}
                </div>
                <div id="date">
                    {{ formattedDate }}
                </div>
            </div>
        </div>
        <div id="text">
            {{ text }}
        </div>
        <img v-if="imageUrl" class="postImage" :src="imageUrl"/>
    </div>
</template>

<script>

// import { mapState } from 'vuex'
import formatDateMixin from '../mixins/formatDateMixin.js'
// import UniquePostComp from '../components/UniquePostComp.vue'

export default {
    name: 'Homepage',
    components: {
        
    },
    computed: {
        // ...mapState(['post']),
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
    mixins: [formatDateMixin],
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
    beforeMount() {
        this.getOnePost()
    }
}

</script>

<style scoped lang="scss">

    #post {
        background: #fcfcfc;
        width: 85%;
        border-radius: 15px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        flex-direction: column;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
        color: #212E53;
        font-size: 1.2em;
        padding-bottom: 1rem;
    }
    #userPost {
        width: 100%;
        margin: 0.5rem 0 0.5rem 0;
        display: flex;
        align-items: center;
    }
    #userImageContainer {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        border: solid 1px rgb(182, 182, 182);
        text-align: center;
        overflow: hidden;
        position: relative;
        left: 10px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
    #user {
        position: relative;
        left: 15px;
        top: -15px;
    }
    #date {
        font-size: 0.5em;
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
</style>