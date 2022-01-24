<template>
    <div id="post" v-if="isPostOpened">
        <div id="userPost">
            <div id="userImageContainer" :style="{ backgroundImage: 'url(' + postData.user.imageUrl + ')' }"></div>
            <div id="user">
                <div id="pseudo">
                    {{ postData.user.pseudo }}
                </div>
                <div id="date">
                    {{ formattedDate }}
                </div>
            </div>
            <div id="userButtons" v-if="pseudo === postData.user.pseudo || isAdmin === 1">
                <button title="Modifier" id="modifyButton" @click="doubleFunction">
                    <img class="modifyIcon" src="../assets/edit-regular.svg"/>
                </button>
                <button id="deleteButton" title="Supprimer" @click="deletePost(postData.id)">X</button>
            </div>
        </div>
        <div id="text">
            {{ postData.text }}
        </div>
        <img v-if="postData.imageUrl" class="postImage" :src="postData.imageUrl"/>
        <div id="buttons">
            <div id="likesButton">
                <button class="interactionButton" @click="clickLike(this.postData.id, this.userId)">J'aime</button>
                <p id="likesNumber">{{ postData.likes.length }}</p>
            </div>
            <button class="interactionButton" @click="showCommentDialog">Commenter</button>
            <button id="showCommentsButton" class="interactionButton" @click="showComments">Afficher les commentaires({{ postData.comments.length }})</button>
        </div>
    </div>
    <ul id="commentsList" v-if="isCommentsVisible">
        <li v-for="comment in postData.comments" :key="comment.text">
            <Comment :commentData="comment"/>
        </li>
    </ul> 

    <!-- Modification -->

    <div id="modifyPostDialog" v-if="isModifyDialogOpened">
        <div id="modifyTop">
            <label for="post">Que voulez-vous modifier ?</label>
            <button id="cancelButton" title="Annuler" @click="doubleFunction">X</button>
        </div>
        <textarea id="post_text_modify" name="postText_modify" rows="2" cols="40" v-model="text"></textarea>
        <img class="postImage" :src="postData.imageUrl"/>
        <input type="file" id="post_imageUrl_modify" name="imageUrl_modify" @change="uploadFile($event)">
        <label for="post_imageUrl_modify" id="post_imageUrl_modify_label">Ajouter un fichier...</label>
        <div id="alertPost" v-if="alertPost">
            Veuillez ajouter du texte ou une image
        </div>
        <button id="modifyingButton" @click="sendModifiedPost(postData.id)">Envoyer</button>
    </div>

    <!-- Commentaires -->

    <div id="commentCreation" v-if="isCommentDialogOpened">
        <div id="separation"></div>
        <label for="comment">Ecrire un commentaire...</label>
        <textarea id="comment_text" name="commentName" rows="2" cols="35" v-model="text"></textarea>
        <div id="alertComment" v-if="alertComment">
            Veuillez ajouter du texte ou une image
        </div>
        <div id="commentButtons">
            <input type="file" id="comment_imageUrl" name="imageUrl" @change="uploadFile($event)">
            <label for="comment_imageUrl" id="comment_imageUrl_label">Ajouter un fichier...</label>
            <button id="commentSendButton" @click="sendComment(postData.id)">Envoyer</button>
        </div>
    </div>

</template>

<script>

import { mapState } from 'vuex'
import Comment from './Comment.vue'
import formatDateMixin from '../mixins/formatDateMixin.js'

export default {
    name: 'Post',
    components: {
        Comment
    },
    props: [
        'postData'
    ],
    computed: {
        ...mapState({
            pseudo: state => state.pseudo,
            isAdmin: state => state.isAdmin,
            userId: state => state.userId
        }),
        formattedDate() {
            return this.formatDate(this.postData.createdAt)
        }
    },
    data: () => ({
        isCommentDialogOpened: false,
        isCommentsVisible: false,
        isModifyDialogOpened: false,
        isPostOpened: true,
        alertPost: false,
        alertComment: false,
        text: ''
    }),
    mixins: [formatDateMixin],
    methods: {
        doubleFunction() {
            this.postOpened(),
            this.showModifyDialog()

            this.isCommentDialogOpened = false
            this.isCommentsVisible = false
        },
        deletePost(id) {
            this.$store.dispatch('deletePost', id)
        },
        uploadFile(event) {
            console.log(event.target.files)
            this.imageUrl = event.target.files[0]
        },
        sendComment(id) {

            if((this.text === undefined || this.text === "") && this.imageUrl === undefined) {
                return this.alertComment = true
            } else {
                this.alertComment = false
            }

            let formData = new FormData()
            formData.append('text', this.text)
            formData.append('imageUrl', this.imageUrl)
            formData.append('userId', this.userId)
            formData.append('postId', id)

            console.log(formData)

            this.$store.dispatch('createComment', formData)
            document.getElementById('comment_text').value =""
            this.isCommentsVisible = true
            this.isCommentDialogOpened = false
        },
        // updatePostText(event) {
        //     this.$store.commit('UPDATE_POST_TEXT', event.target.value)
        // },
        showCommentDialog() {
            this.isCommentDialogOpened = !this.isCommentDialogOpened
        },
        showComments() {
            this.isCommentsVisible = !this.isCommentsVisible
        },
        showModifyDialog() {
            this.isModifyDialogOpened = !this.isModifyDialogOpened
        },
        postOpened() {
            this.isPostOpened = !this.isPostOpened
        },
        clickLike(id, userId) {

            const userIdIntoArray = (element) => element.user_id === userId

            let resultOfUserIdIntoArray = this.postData.likes.some(userIdIntoArray)
            console.log(resultOfUserIdIntoArray)

            if(resultOfUserIdIntoArray === true) {
                this.$store.dispatch('deleteLike', { id, userId } )
            } else {
                let bodyLike = {
                     user_id: this.userId,
                     post_id: this.postData.id
                }
                this.$store.dispatch('createLike', bodyLike)
            }
        },
        sendModifiedPost(id) {

            if((this.text === undefined || this.text === "") && this.imageUrl === undefined) {
                return this.alertPost = true
            } else {
                this.alertPost = false
            }

            let formData = new FormData()
            formData.append('text', this.text)
            formData.append('imageUrl', this.imageUrl)
            formData.append('userId', this.userId)

            this.$store.dispatch('modifyPost', { id, formData })
            document.getElementById('post_text_modify').value = ""
        }
    }
}

</script>

<style scoped lang="scss">
    #post {
        background: #fcfcfc;
        width: 85%;
        border-radius: 15px;
        margin-top: 2.5rem;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        align-items: center;
        flex-direction: column;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
        color: #212E53;
        font-size: 1.2em;
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
    #userButtons {
        width: 10%;
        position: relative;
        right: 52px;
        top: 10px;
    }
    #deleteButton {
        color: #A7001E;
        font-size: 1em;
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
    }
    #modifyButton {
        width: 16px;
        margin-right: 0.1rem;
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
    }
    .modifyIcon {
        width: 100%;
    }
    #text {
        text-align: center;
        margin: 0 0.5rem;
    }
    #buttons {
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: 1rem 0;
        margin-top: 1rem;
        flex-wrap: wrap;
    }
    #likesButton {
        display: flex;
    }
    #likesNumber {
        margin: auto 0.4rem;
    }
    .postImage {
        max-width: 90%;
        margin-top: 1rem;
    }
    .interactionButton {
        background: #E8F0FE;
        color: #212E53;
        border: none;
        outline: none;
        font-size: 0.8em;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 15px;
    }
    #commentsList {
        width: 80%;
        margin: 0 auto;
        background: #fcfcfc;
        border-radius: 0 0 15px 15px;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
        list-style-type: none;
    }
    // modifition du post ---------------------------------------------------------------------------------------------
    #modifyTop {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
    }
    #modifyPostDialog {
        background: #fcfcfc;
        width: 85%;
        border-radius: 15px;
        margin-top: 2.5rem;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
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
    #alertPost {
        background: rgba(255, 0, 0, 0.2);
        padding: 0.2rem;
        margin-bottom: 1rem;
    }
    #post_text_modify {
        border-radius: 10px;
        background: #E8F0FE;
        text-align: center;
        font-size: 1.2em;
        margin: 1rem 0 1rem 0;
    }
    #post_imageUrl_modify {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    #post_imageUrl_modify_label {
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
    // création de commentaire ----------------------------------------------------------------------------------------
    #commentCreation {
        background: #fcfcfc;
        width: 80%;
        margin: auto;
        border-radius: 0 0 15px 15px;
        color: #212E53;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 1.2em;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    #separation {
        width: 50%;
        height: 1px;
        background: rgb(182, 182, 182);
        margin-bottom: 0.8rem;
    }
    #comment_text {
        border-radius: 10px;
        background: #E8F0FE;
        text-align: center;
        font-size: 1.2em;
        margin-top: 1rem;
    }
    #commentButtons {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    #comment_imageUrl {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    #comment_imageUrl_label {
        color: #212E53;
        background: #E8F0FE;
        font-size: 0.8em;
        font-weight: bold;
        margin: 1rem 0 1rem 0;
        border-radius: 5px;
        cursor: pointer;
        padding: 0.7rem 0.5rem;
    }
    #alertComment {
        background: rgba(255, 0, 0, 0.2);
        padding: 0.2rem;
        margin-top: 1rem;
        font-size: 0.9em;
    }
    #commentSendButton {
        width: 28%;
        height: 80%;
        color: #fff;
        text-align: center;
        background: #212E53;
        font-size: 1em;
        font-weight: bold;
        margin: 10px 0 10px 0;
        outline: none;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: .2s ease-in;
        padding: 0.7rem;
        &:hover {
            background: #BED3C3;
            color: #212E53;
        }
    }
    // @media (max-width: 550px) {
    //     #buttons {
    //         flex-wrap: wrap;
    //     }
    // }
</style>