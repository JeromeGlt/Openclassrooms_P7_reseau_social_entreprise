<template>
    <div id="comment" v-if="isCommentOpened">
        <div id="separation"></div>
        <div id="userComment">
            <div id="userImageContainer" :style="{ backgroundImage: 'url(' + commentAuthorImageUrl + ')' }"></div>
            <div id="user">
                <div id="pseudo" v-if="commentAuthor">
                    {{ commentAuthor }}
                </div>
                <div id="date">
                    {{ formattedDate }}
                </div>
            </div>
            <div id="userButtons" v-if="pseudo === commentAuthor || isAdmin === 1">
                <button title="Modifier commentaire" id="modifyCommentButton" @click="doubleFunction">
                    <img class="modifyIcon" src="../assets/edit-regular.svg"/>
                </button>
                <button title="Supprimer commentaire" id="deleteButton" @click="deleteComment(commentData.id)">X</button>
            </div>
        </div>
        <div id="text">
            {{ commentData.text }}
        </div>
        <img v-if="commentData.imageUrl" class="commentImage" :src="commentData.imageUrl"/>
    </div>

    <!-- Modification du commentaire -->
    <div id="modifyCommentDialog" v-if="isModifyCommentDialogOpened">
        <div id="modifyTop">
            <label for="post">Que voulez-vous modifier ?</label>
            <button title="Annuler" id="cancelButton" @click="doubleFunction">X</button>
        </div>
        <textarea id="comment_text_modify" name="commentName_modify" rows="2" cols="35" v-model="text"></textarea>
        <img v-if="commentData.imageUrl" class="commentImage" :src="commentData.imageUrl"/>
        <div id="alertCommentModify" v-if="alertComment">
            Veuillez ajouter du texte ou une image
        </div>
        <input type="file" id="comment_imageUrl_modify" name="imageUrl_modify" @change="uploadFile($event)">
        <label for="comment_imageUrl_modify" id="comment_imageUrl_modify_label" :value="commentData.imageUrl">Ajouter un fichier...</label>
        <button id="modifyingButton" @click="sendModifiedComment(commentData.id)">Envoyer</button>
    </div>
</template>

<script>
// import PostBody from './PostBody.vue'
import { mapState } from 'vuex'
import formatDateMixin from '../mixins/formatDateMixin.js'

export default {
    name: 'Comment',
    props: [
        'commentData'
    ],
    mounted() {
        this.getUserInfo(this.commentData.user_id)
    },
    computed: {
        ...mapState({
            pseudo: state => state.pseudo,
            isAdmin: state => state.isAdmin,
            posts: state => state.posts
        }),
        formattedDate() {
            return this.formatDate(this.commentData.createdAt)
        }
    },
    data: () => ({
        isModifyCommentDialogOpened: false,
        isCommentOpened: true,
        commentAuthor: null,
        commentAuthorImageUrl: null,
        alertComment: false,
        text: ''
    }),
    mixins: [formatDateMixin],
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

            if((this.text === undefined || this.text === "") && this.imageUrl === undefined) {
                return this.alertComment = true
            } else {
                this.alertComment = false
            }

            let formData = new FormData()
            formData.append('text', this.text)
            formData.append('imageUrl', this.imageUrl)
            formData.append('userId', this.userId)

            this.$store.dispatch('modifyComment', { id, formData })
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
    #userComment {
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
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }
    #user {
        position: relative;
        left: 15px;
        top: -15px;
    }
    #date {
        font-size: 0.5em;
    }
    #userButtons {
        width: 10%;
        position: relative;
        right: 52px;
        top: 10px;
    }
    #modifyCommentButton {
        width: 16px;
        margin-right: 0.1rem;
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
    #text {
        text-align: center;
        margin: 0 0.5rem 1rem 0.5rem;
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
    #alertCommentModify {
        background: rgba(255, 0, 0, 0.2);
        padding: 0.2rem;
        margin-top: 1rem;
        font-size: 0.9em;
    }
</style>