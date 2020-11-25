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
            const user = await userService.login(userCred);
            commit({ type: 'setUser', user });
            return user;
        },
        async signup({ commit }, { userCred }) {
            const user = await userService.signup(userCred);
            commit({ type: 'setUser', user });
            return user;

        },
        async logout({ commit }) {
            await userService.logout();
            commit({ type: 'setUsers', users: [] });
            commit({ type: 'setUser', user: null });
        },
        async loadUsers({ commit }) {
            const users = await userService.getUsers();
            commit({ type: 'setUsers', users });
        },
        async removeUser({ commit }, { userId }) {
            await userService.remove(userId);
            commit({ type: 'removeUser', userId });
        },
        async updateUser({ commit }, { user }) {
            user = await userService.update(user);
            commit({ type: 'setUser', user });
        },
    }

};