var localLoggedInUser = null;
if (sessionStorage.user) localLoggedInUser = JSON.parse(sessionStorage.user);

export default {
    state: {
        loggedInUser: localLoggedInUser,
        users: []
    },
    getters: {
        
    },
    mutations: {
        
    },
    actions: {
       
    }

}