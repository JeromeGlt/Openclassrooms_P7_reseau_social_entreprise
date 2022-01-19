<template>
    <div id="comment" v-if="isCommentOpened">
        <div id="separation"></div>
        <div id="commentBody">
            <div id="userImageContainer" v-if="commentAuthorImageUrl">
                <img id="userImage" :src="commentAuthorImageUrl"/>
            </div>
            <div v-if="commentAuthor">{{ commentAuthor }}</div>
            {{ commentData.createdAt }}
            <button v-if="pseudo === commentAuthor || isAdmin === 1" title="Modifier commentaire" id="modifyCommentButton" @click="doubleFunction"><img class="modifyIcon" src="../assets/edit-regular.svg"/></button>
            <button v-if="pseudo === commentAuthor || isAdmin === 1" title="Supprimer commentaire" id="deleteButton" @click="deleteComment(commentData.id)">X</button>
        </div>
        {{ commentData.text }}
        <img class="commentImage" :src="commentData.imageUrl"/>
    </div>

    <div id="modifyCommentDialog" v-if="isModifyCommentDialogOpened">
        <div id="modifyTop">
            <label for="post">Que voulez-vous modifier ?</label>
            <button title="Annuler" id="cancelButton" @click="doubleFunction">X</button>
        </div>
        <textarea id="comment_text_modify" name="commentName_modify" rows="2" cols="35" v-model="text"></textarea>
        <img class="commentImage" :src="commentData.imageUrl"/>
        <input type="file" id="comment_imageUrl_modify" name="imageUrl_modify" @change="uploadFile($event)">
        <label for="comment_imageUrl_modify" id="comment_imageUrl_modify_label">Ajouter un fichier...</label>
        <button id="modifyingButton" @click="sendModifiedComment(commentData.id)">Envoyer</button>
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
    mounted() {
        this.getUserInfo(this.commentData.user_id)
    },
    computed: {
        ...mapState(['pseudo', 'posts'])
    },
    data: () => ({
        isModifyCommentDialogOpened: false,
        isCommentOpened: true,
        commentAuthor: null,
        commentAuthorImageUrl: null
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
            formData.append('imageUrl', this.imageUrl)
            formData.append('userId', this.userId)

            this.$store.dispatch('modifyComment', { id, formData })
            document.getElementById('comment_text_modify').value = ""
        },
        getUserInfo(user_id) {

            fetch('http://localhost:3000/api/posts/getId/' + user_id, {
            headers: {
                'Accept': 'application/json'
            }
            })
            .then(res => res.json())
            .then(data => {
                this.commentAuthor = data.pseudo
                this.commentAuthorImageUrl = data.imageUrl
            })
            .catch(err => console.log(err))
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
    #modifyCommentButton {
        width: 4%;
        border: none;
        outline: none;
        background: none;
        cursor: pointer;
    }
    .modifyIcon {
        width: 100%;
    }
    #deleteButton {
        color: #A7001E;
        font-size: 1em;
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
    }
    .commentImage {
        width: 80%;
        margin: 1rem 0 1.5rem 0;
    }
    #modifyTop {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
    }
    #modifyCommentDialog {
        background: #fcfcfc;
        width: 92%;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #212E53;
        font-size: 1.2em;
    }
    #modifyingButton {
        width: 30%;
        padding: 0.5rem;
        cursor: pointer;
        color: #fff;
        text-align: center;
        background: #212E53;
        font-size: 1em;
        font-weight: bold;
        outline: none;
        border: none;
        border-radius: 5px;
        transition: .2s ease-in;
        padding: 0.7em 0.5em;
        margin-bottom: 1rem;
        &:hover {
            background: #BED3C3;
            color: #212E53;
        }
    }
    #comment_text_modify {
        border-radius: 10px;
        background: #E8F0FE;
        text-align: center;
        font-size: 1.2em;
        margin: 1rem 0 1rem 0;
    }
    #comment_imageUrl_modify {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    #comment_imageUrl_modify_label {
        color: #212E53;
        background: #E8F0FE;
        font-size: 0.8em;
        font-weight: bold;
        margin: 1rem 0 1rem 0;
        border-radius: 5px;
        cursor: pointer;
        padding: 0.7rem 0.5rem;
    }
    #cancelButton {
        color: #A7001E;
        font-size: 1em;
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
    }
</style>