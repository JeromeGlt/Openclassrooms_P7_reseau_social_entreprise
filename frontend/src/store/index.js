import { createStore } from 'vuex'
import router from '../router/index.js'

// import { SET_NOTE } from '@/store/mutation-types'

const store = createStore({
    state: {
        pseudo: '',
        password: '',
        email: '',
        imageUrl: '',
        userId: '',
        token: '',
        isAdmin: '',
        message: '',
        posts: [],
    },
    getters: {
    },
    mutations: {
        SIGNUP (state, data) {
            state.pseudo = data.pseudo,
            state.email = data.email,
            state.imageUrl = data.imageUrl,
            state.userId = data.userId,
            state.token = data.token,
            state.isAdmin = data.isAdmin
            state.message = data.message
          },
        LOGIN (state, data) {
            state.pseudo = data.pseudo,
            state.email = data.email,
            state.imageUrl = data.imageUrl,
            state.userId = data.userId,
            state.token = data.token,
            state.isAdmin = data.isAdmin
            state.message = data.message
        },
        GET_USER_ID (state, data) {
            state.userId = data.userId,
            state.pseudo = data.pseudo,
            state.imageUrl = data.imageUrl,
            state.email = data.email,
            state.isAdmin = data.isAdmin
        },
        SET_POST (state, data) {
            state.posts = data
        },
        UPDATE_EMAIL (state, email) {
            state.email = email
        },
        UPDATE_IMAGE_PROFILE (state, imageUrl) {
            state.imageUrl = imageUrl
        }
    },
    actions: {
        // Cinq actions concernant les utilisateurs - Signup, Login, Get, Delete et Modify
        submitSignup({ commit }, formData) {
            console.log(formData)
            fetch('http://localhost:3000/api/auth/signup', {
                method: 'post',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    commit('SIGNUP', data)
                    if(!data.message) {
                        router.push('/posts')
                    }
                    localStorage.setItem('token', data.token)
                })
                .catch(err => console.log(err))
        },
        submitLogin({ commit }, loginData) {
            console.log(loginData)
            fetch('http://localhost:3000/api/auth/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData),
            })
            .then(res => res.json())
            .then(data => {
                commit('LOGIN', data)
                if(!data.message) {
                    router.push('/posts')
                }
                localStorage.setItem('token', data.token)
            })
            .catch(err => console.log(err))
        },
        deleteUser({ state }) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/auth/profile/delete/' + state.pseudo, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                }
            })
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.log(err, 'erreur dans la fonction deleteUser'))
        },
        getUserDatas({ commit }) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/posts/getId', {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + storageToken
            }
        })
                .then(res => res.json())
                .then(data => commit('GET_USER_ID', data))
                .catch(err => console.log(err))
        },
        modifyImageProfile({ dispatch }, { bodyProfile, userId }) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/auth/profile/' + userId, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                },
                body: bodyProfile
            })
                .then(res => res.json())
                .then(data => dispatch('getUserDatas', data))
                .catch(err => console.log(err))
        },
        modifyEmailProfile({ dispatch }, { bodyProfile, userId }) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/auth/profile/' + userId, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                },
                body: JSON.stringify(bodyProfile)
            })
                .then(res => res.json())
                .then(data => dispatch('getUserDatas', data))
                .catch(err => console.log(err))
        },
        // Quatre actions concernant les publications - Create, Delete, Get et Put
        createPost({ dispatch }, formData) {

            let storageToken = localStorage.getItem('token')

            console.log(formData)
            fetch('http://localhost:3000/api/posts', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                },
                body: formData
            })
                .then(() => {
                    dispatch('loadAllPosts')
                })
                .catch(err => console.log(err))
        },
        modifyPost({ dispatch }, { id, formData }) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/posts/' + id, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                },
                body: formData
            })
                .then(() => {
                    dispatch('loadAllPosts')
                })
                .catch(err => console.log(err))
        },
        deletePost({ dispatch }, id) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/posts/' + id, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                }
            })
                .then(() => {
                    dispatch('loadAllPosts')
                })
                .catch(err => console.log(err))
        },
        loadAllPosts({ commit }) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/posts', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                }
            })
                .then(res => res.json())
                .then(data => commit('SET_POST', data))
                .catch(err => console.log(err))
        },
        // Quatre actions concernant les commentaires - Create, Delete, Get et Modify
        createComment({ dispatch }, formData) {
            
            let storageToken = localStorage.getItem('token')

            console.log(formData)
            fetch('http://localhost:3000/api/posts/comments', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                },
                body: formData
            })
                .then(() => {
                    dispatch('loadAllPosts')
                })
                .catch(err => console.log(err))
        },
        modifyComment({ dispatch }, { id, formData }) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/posts/comments/' + id, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                },
                body: formData
            })
                .then(() => {
                    dispatch('loadAllPosts')
                })
                .catch(err => console.log(err))
        },
        deleteComment({ dispatch }, id) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/posts/comments/' + id, {
                method: 'delete',
                headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + storageToken
                }
            })
                .then(() => {
                    dispatch('loadAllPosts')
                })
                .catch(err => console.log(err))
        },
        createLike({ dispatch }, bodyLike) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/posts/likes', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + storageToken
                },
                body: JSON.stringify(bodyLike)
            })
            .then(() => {
                dispatch('loadAllPosts')
            })
            .catch(err => console.log(err))
        },
        deleteLike({ dispatch }, { id, userId }) {

            let storageToken = localStorage.getItem('token')

            fetch('http://localhost:3000/api/posts/' + id + '/' + userId + '/likes', {
                method: 'delete',
                headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + storageToken
                }
            })
                .then(() => {
                    dispatch('loadAllPosts')
                })
                .catch(err => console.log(err))
        }
    }
})

export default store