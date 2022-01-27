<template>
    <div>
        <div id="comment" class="basics" v-if="isCommentOpened">
            <div class="separation"></div>
            <div class="userComponents">
                <div class="userImageContainer" :style="{ backgroundImage: 'url(' + commentAuthorImageUrl + ')' }"></div>
                <div class="user">
                    <div v-if="commentAuthor">
                        {{ commentAuthor }}
                    </div>
                    <div class="date">
                        {{ formattedDate }}
                    </div>
                </div>
                <div class="userButtons" v-if="pseudo === commentAuthor || isAdmin === true">
                    <button title="Modifier commentaire" class="modifyButton cursor" @click="doubleFunction">
                        <img class="modifyIcon" src="../assets/edit-regular.svg"/>
                    </button>
                    <button title="Supprimer commentaire" class="deleteButton cursor" @click="deleteComment(commentData.id)">X</button>
                </div>
            </div>
            <div id="text">
                {{ commentData.text }}
            </div>
            <img v-if="commentData.imageUrl" class="commentImage" :src="commentData.imageUrl" alt="image du commentaire"/>
        </div>
    
        <!-- Modification du commentaire -->
        <div id="modifyCommentDialog" class="basics" v-if="isModifyCommentDialogOpened">
            <div class="modifyTop">
                <label for="post">Que voulez-vous modifier ?</label>
                <button title="Annuler" class="cancelButton cursor" @click="doubleFunction">X</button>
            </div>
            <textarea class="text_modify" name="commentName_modify" rows="2" cols="35" v-model="text"></textarea>
            <img v-if="commentData.imageUrl" class="commentImage" :src="commentData.imageUrl" alt="image du commentaire"/>
            <div v-if="alertComment">
                <p id="alertCommentModify" class="background_alert">Veuillez ajouter du texte ou une image</p>
            </div>
            <input type="file" class="input_hidden" id="comment_imageUrl_modify" name="imageUrl_modify" @change="uploadFile($event)">
            <label for="comment_imageUrl_modify" class="imageUrl_label cursor" :value="commentData.imageUrl">Ajouter un fichier...</label>
            <button id="modifyingButton" class="basics_buttons cursor" @click="sendModifiedComment(commentData.id)">Envoyer</button>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import formatDateMixin from '../mixins/formatDateMixin.js'

    export default {
        name: 'Comment',
        props: [
            'commentData'
        ],
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
        mixins: [
            formatDateMixin
        ],
        methods: {
            uploadFile(event) {
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
        },
        mounted() {
            this.getUserInfo(this.commentData.user_id)
        },
    }
</script>

<style scoped lang="scss">
    #comment {  
        width: 92%;
        margin: 0 auto;
    }
    #text {
        text-align: center;
        margin: 0 0.5rem 1rem 0.5rem;
    }
    .commentImage {
        width: 80%;
        margin: 1rem 0 1.5rem 0;
    }
    #modifyCommentDialog {
        width: 92%;
        margin-left: auto;
        margin-right: auto;
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
    #alertCommentModify {
        padding: 0.2rem;
        margin-top: 1rem;
        font-size: 0.9em;
    }
</style>