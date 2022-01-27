<template>
    <div>
        <div id="post" class="basics" v-if="isPostOpened">
            <div class="userComponents">
                <div class="userImageContainer" :style="{ backgroundImage: 'url(' + postData.user.imageUrl + ')' }"></div>
                <div class="user">
                    <div>
                        {{ postData.user.pseudo }}
                    </div>
                    <div class="date">
                        {{ formattedDate }}
                    </div>
                </div>
                <div class="userButtons" v-if="pseudo === postData.user.pseudo || isAdmin === true">
                    <button title="Modifier" class="modifyButton cursor" @click="doubleFunction">
                        <img class="modifyIcon" src="../assets/edit-regular.svg"/>
                    </button>
                    <button class="deleteButton cursor" title="Supprimer" @click="deletePost(postData.id)">X</button>
                </div>
            </div>
            <div class="cursor" id="contentPost" @click="routerPost(postData.id)">
                <div id="text">
                    {{ postData.text }}
                </div>
                <img v-if="postData.imageUrl" class="postImage" :src="postData.imageUrl" alt="image de la publication"/>
            </div>
            <div id="buttons">
                <div id="likesButton">
                    <button class="interactionButton cursor" @click="clickLike(this.postData.id, this.userId)">J'aime</button>
                    <p id="likesNumber">{{ postData.likes.length }}</p>
                </div>
                <button class="interactionButton cursor" @click="showCommentDialog">Commenter</button>
                <button class="interactionButton cursor" @click="showComments">Afficher les commentaires({{ postData.comments.length }})</button>
            </div>
        </div>
        <ul id="commentsList" v-if="isCommentsVisible">
            <li v-for="comment in postData.comments" :key="comment.text">
                <Comment :commentData="comment"/>
            </li>
        </ul> 

        <!-- Modification -->

        <div id="modifyPostDialog" class="basics" v-if="isModifyDialogOpened">
            <div class="modifyTop">
                <label for="post">Que voulez-vous modifier ?</label>
                <button class="cancelButton cursor" title="Annuler" @click="doubleFunction">X</button>
            </div>
            <textarea class="text_modify" name="postText_modify" rows="2" cols="40" v-model="text"></textarea>
            <img v-if="postData.imageUrl" class="postImage" :src="postData.imageUrl" alt="image de la publication"/>
            <input type="file" class="input_hidden" id="post_imageUrl_modify" name="imageUrl_modify" @change="uploadFile($event)">
            <label for="post_imageUrl_modify" class="imageUrl_label cursor">Ajouter un fichier...</label>
            <div id="alertPost" class="background_alert" v-if="alertPost">
                Veuillez ajouter du texte ou une image
            </div>
            <button id="modifyingButton" class="basics_buttons cursor" @click="sendModifiedPost(postData.id)">Envoyer</button>
        </div>

        <!-- Commentaires -->

        <div id="commentCreation" class="basics" v-if="isCommentDialogOpened">
            <div class="separation"></div>
            <label for="comment">Ecrire un commentaire...</label>
            <textarea class="text_modify" name="commentName" rows="2" cols="35" v-model="text"></textarea>
            <div id="alertComment" class="background_alert" v-if="alertComment">
                Veuillez ajouter du texte ou une image
            </div>
            <div id="commentButtons">
                <input type="file" class="input_hidden" id="comment_imageUrl" name="imageUrl" @change="uploadFile($event)">
                <label for="comment_imageUrl" class="imageUrl_label cursor">Ajouter un fichier...</label>
                <button id="commentSendButton" class="basics_buttons cursor" @click="sendComment(postData.id)">Envoyer</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Comment from './Comment.vue'
    import formatDateMixin from '../mixins/formatDateMixin.js'
    import router from '../router/index.js'

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
        mixins: [
            formatDateMixin
        ],
        methods: {
            routerPost(id) {
                router.push('/posts/post/' + id)
            },
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

                this.$store.dispatch('createComment', formData)
                this.isCommentsVisible = true
                this.isCommentDialogOpened = false
            },
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
            }
        }
    }
</script>

<style scoped lang="scss">
    #post {
        width: 85%;
        border-radius: 15px;
        margin-top: 2.5rem;
        margin-left: auto;
        margin-right: auto;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
    }
    #contentPost {
        text-align: center;
    }
    #text {
        text-align: center;
        margin: 0 0.5rem;
    }
    .postImage {
        max-width: 90%;
        max-height: 20rem;
        margin-top: 1rem;
        margin-right: auto;
        margin-left: auto;
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
    #commentsList {
        width: 80%;
        margin: 0 auto;
        background: #fcfcfc;
        border-radius: 0 0 15px 15px;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
        list-style-type: none;
    }
    // modifition du post ---------------------------------------------------------------------------------------------
    #modifyPostDialog {
        width: 85%;
        border-radius: 15px;
        margin-top: 2.5rem;
        margin-left: auto;
        margin-right: auto;
        box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2);
    }
    #modifyingButton {
        width: 30%;
        padding: 0.7em 0.5em;
        margin-bottom: 1rem;
        &:hover {
            background: #BED3C3;
            color: #212E53;
        }
    }
    #alertPost {
        padding: 0.2rem;
        margin-bottom: 1rem;
    }
    // création de commentaire ----------------------------------------------------------------------------------------
    #commentCreation {
        width: 80%;
        margin: auto;
        border-radius: 0 0 15px 15px;
    }
    #commentButtons {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    #alertComment {
        padding: 0.2rem;
        margin-top: 1rem;
        font-size: 0.9em;
    }
    #commentSendButton {
        width: 28%;
        height: 80%;
        margin: 10px 0 10px 0;
        padding: 0.7rem;
        &:hover {
            background: #BED3C3;
            color: #212E53;
        }
    }
</style>