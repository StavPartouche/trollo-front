import { httpService } from './http.service'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update
};

function getUsers() {
    return httpService.get('user');
}

function getById(userId) {
    return httpService.get(`user/${userId}`);
}

function remove(userId) {
    return httpService.delete(`user/${userId}`);
}

function update(user) {
    return httpService.put(`user/${user._id}`, user);
}

async function login(userCred) {
    const user = await httpService.get(`user?userName=${userCred.userName}&fullName=${userCred.fullName}`);
    return (user.length) ? _handleLogin(user[0]) : false;
}

async function signup(userCred) {
    console.log(userCred);
    const user = await httpService.post('user', userCred);
    return _handleLogin(user);
}

async function logout() {
    // await httpService.post('logout');
    sessionStorage.clear();
}


function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
}