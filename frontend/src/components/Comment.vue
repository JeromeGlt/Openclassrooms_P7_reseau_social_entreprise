<template>
    <div id="comment" v-if="isCommentOpened">
        <div id="separation"></div>
        <div id="commentBody">
            <div id="userImageContainer">
                <img id="userImage" :src="imageUrl"/>
            </div>
            {{ pseudo }}
            {{ commentData.createdAt }}
            <button @click="doubleFunction">R</button>
            <button id="deleteButton" @click="deleteComment(commentData.id)">X</button>
        </div>
        {{ commentData.text }}
        <img id="commentImage" :src="commentData.imageUrl"/>
    </div>

    <div v-if="isModifyCommentDialogOpened">
        <p>{{ pseudo }}</p>
        <label for="post">Que voulez-vous modifier ?</label>
        <textarea id="comment_text_modify" name="commentName_modify" rows="5" cols="30" v-model="text"></textarea>
        <img :src="commentData.imageUrl"/>
        <input type="file" id="comment_imageUrl_modify" name="imageUrl_modify" @change="uploadFile($event)">
        <button @click="sendModifiedComment(commentData.id)">Envoyer</button>
        <button @click="doubleFunction">Annuler</button>
    </div>
</template>

<script>
// import PostBody from './PostBody.vue'
import { mapState } from 'vuex'

export default {
    name: 'Comment',
    props: [
        'commentData'
    ],
    computed: {
        ...mapState(['pseudo', 'imageUrl', 'posts'])
    },
    data: () => ({
        isModifyCommentDialogOpened: false,
        isCommentOpened: true
    }),
    methods: {
        uploadFile(event) {
            console.log(event.target.files)
            this.imageUrl = event.target.files[0]
        },
        doubleFunction() {
            this.commentOpened(),
            this.showModifyCommentDialog()
        },
        showModifyCommentDialog() {
            this.isModifyCommentDialogOpened = !this.isModifyCommentDialogOpened
        },
        commentOpened() {
            this.isCommentOpened = !this.isCommentOpened
        },
        deleteComment(id) {
        this.$store.dispatch('deleteComment', id)
        },
        sendModifiedComment(id) {
            let formData = new FormData()
            formData.append('text', this.text)
            formData.append('imageUrl', this.commentData.imageUrl)
            formData.append('userId', this.userId)

            this.$store.dispatch('modifyComment', { id, formData })
            document.getElementById('comment_text_modify').value = ""
        }
    }
}

</script>

<style scoped lang="scss">
    #separation {
        width: 50%;
        height: 1px;
        background: rgb(182, 182, 182);
        margin-bottom: 0.8rem;
    }
    #comment {
        background: #fcfcfc;
        width: 92%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #212E53;
        font-size: 1.2em;
    }
    #commentBody {
        width: 100%;
        margin: 0.5rem 0 1rem 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    #userImageContainer {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        border: solid 1px rgb(182, 182, 182);
        text-align: center;
        overflow: hidden;
    }
    #userImage {
        object-fit: contain;
        max-width: 100%;
    }
    #deleteButton {
        color: #A7001E;
        font-size: 1em;
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
    }
    #commentImage {
        height: 55%;
        width: 60%;
        margin-top: 1rem;
    }
</style>