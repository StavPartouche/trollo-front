import { userService } from '@/services/user.service.js';

var localLoggedInUser;
if (sessionStorage.user) localLoggedInUser = JSON.parse(sessionStorage.user);

export default {
    state: {
        loggedInUser: localLoggedInUser,
        users: []
    },
    getters: {
        users(state) {
            return state.users;
        },
        loggedInUser(state) {
            return state.loggedInUser;
        },
    },
    mutations: {
        setUser(state, { user }) {
            state.loggedInUser = user;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId);
        },
    },
    actions: {
        async login({ commit }, { userCred }) {
            try{
                const user = await userService.login(userCred);
                commit({ type: 'setUser', user });
                return user;
            } catch (err){
                console.error('Cannot login', err);
                throw err;
            }
        },
        async signup({ commit }, { userCred }) {
            try{
                const user = await userService.signup(userCred);
                commit({ type: 'setUser', user });
                return user;
            } catch (err){
                console.error('Cannot signup', err);
                throw err;
            }

        },
        async logout({ commit }) {
            try{
                await userService.logout();
                commit({ type: 'setUsers', users: [] });
                commit({ type: 'setUser', user: null });
            } catch (err){
                console.error('Cannot logout', err);
                throw err;
            }
        },
        async loadUsers({ commit }) {
            try {
                const users = await userService.getUsers();
                commit({ type: 'setUsers', users });
            } catch (err){
                console.error('Cannot load users', err);
                throw err;
            }
        },
        async removeUser({ commit }, { userId }) {
            try{
                await userService.remove(userId);
                commit({ type: 'removeUser', userId });
            } catch (err){
                console.error('Cannot remove user', err);
                throw err;
            }
        },
        async updateUser({ commit }, { user }) {
            try{
                user = await userService.update(user);
                commit({ type: 'setUser', user });
            } catch (err){
                console.error('Cannot update user', err);
                throw err;
            }
        },
    }

};