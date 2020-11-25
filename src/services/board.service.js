import { httpService } from './http.service';
import { utilService } from './util.service';

export const boardService = {
    query,
    getById,
    remove,
    save,
    getEmptyBoard
};

function query(userId = 'kaki') {
    return httpService.get(`board?creator=${userId}`);
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`);
}

function remove(boardId) {
    return httpService.delete(`board/${boardId}`);
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

function getEmptyBoard(userId = 'kaki') {
    return {
        name: '',
        members: [],
        labels: [],
        background: { color: '', url: '' },
        creator: userId,
        dueDate: '',
        description: '',
        activityLog: [{
            createdAt: Date.now(),
            txt: 'Board created',
            userId: userId,
            taskId: ''
        }
        ],
        lists: [getEmptyList()]
    };
}

function getEmptyList() {
    return {
        id: utilService.makeId(),
        name: '',
        tasks: [getEmptyTask()]
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
        activityLog: [],
        previewImg: '',
        attachments: [],
        checkLists: []
    };
}