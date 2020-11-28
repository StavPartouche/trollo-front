import { httpService } from './http.service';
import { utilService } from './util.service';

export const boardService = {
    query,
    getById,
    remove,
    save,
    getEmptyBoard,
    getEmptyList,
    getEmptyTask
};

function query(userId = 'guest') {
    // return httpService.get(`board?creator=${userId}&creator=guest&creator=template&`);
    return httpService.get(`board?user=${userId}`);
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`);
}

function remove(board) {
    return httpService.delete(`board/${board._id}`, board);
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
    return {
        name: '',
        members: [userId],
        labels: [],
        style: { backgroundColor: '', url: 'bgc1.jpg' },
        creator: userId,
        dueDate: '',
        description: '',
        activities: [{
            createdAt: Date.now(),
            txt: 'Board created',
            userId: userId,
            taskId: ''
        }
        ],
        lists: _getEmptyLists()
    };
}

function _getEmptyLists(){
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