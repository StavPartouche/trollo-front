import { httpService } from './http.service';
import { utilService } from './util.service';

export const boardService = {
    query,
    getById,
    remove,
    save,
    getEmptyBoard,
    getEmptyList,
    getEmptyTask,
    newActivity
};

function query(userId = 'guest') {
    return httpService.get(`board?user=${userId}`);
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`);
}

function remove(board) {
    return httpService.delete(`board/${board._id}`);
}

function save(board) {
    const savedBoard = (board._id) ? put(board) : post(board);
    return savedBoard;
}

function post(board) {
    return httpService.post(`board`, board);
}

function put(board) {
    return httpService.put(`board/${board._id}`, board);
}

function getEmptyBoard(userId = 'guest') {
    const newBoard = {
        name: '',
        members: [],
        labels: [
            { backgroundColor: 'rgb(97, 189, 79)', txt: 'Entertainment' },
            { backgroundColor: 'rgb(242, 214, 0)', txt: 'Extras' },
            { backgroundColor: 'rgb(255, 159, 26)', txt: 'First priority' },
            { backgroundColor: 'rgb(235, 90, 70)', txt: 'Must Have' },
            { backgroundColor: 'rgb(195, 119, 224', txt: 'Pending' },
            { backgroundColor: 'rgb(0, 121, 191)', txt: 'Expensive' }
        ],
        style: { backgroundColor: '', url: 'bgc1.jpg' },
        creator: userId,
        dueDate: '',
        description: '',
        activities: [{
            createdAt: Date.now(),
            txt: 'Board created',
            userId: userId,
            taskId: ''
        }],
        lists: _getEmptyLists()
    };
    if (userId !== 'guest') newBoard.members.push(userId);
    return newBoard;
}

function _getEmptyLists() {
    return [
        getEmptyList('To do'),
        getEmptyList('In Progress'),
        getEmptyList('Done')
    ]
}

function getEmptyList(listName = '') {
    return {
        id: utilService.makeId(),
        name: listName,
        tasks: []
    };
}

function getEmptyTask() {
    return {
        id: utilService.makeId(),
        name: '',
        description: '',
        dueDate: '',
        createdAt: '',
        backgroundColor: '',
        members: [],
        labels: [],
        comments: [],
        previewImg: '',
        attachments: [],
        checkLists: []
    };
}

function newActivity(txt,userId, taskId = null){
    return {
        createdAt: Date.now(),
        txt,
        userId,
        taskId
    }
    // return {
    //     createdAt: Date.now(),
    //     txt:`added a new task "${newTask.name}"`,
    //     userId: this.$store.getters.loggedInUser
    //       ? this.$store.getters.loggedInUser._id
    //       : { fullName: "Guest" },
    //     taskId: newTask.id
    // }
}