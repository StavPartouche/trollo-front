import { boardService } from '../services/board.service.js';

export default {
    state: {
        boards: [],
        // templates: [],
        board: {
        }
    },
    getters: {
        userBoardsForDisplay(state) {
            console.log(state.boards.filter(board => board.creator !== 'guest' && board.creator !== 'template'))
            return state.boards.filter(board => board.creator !== 'guest' && board.creator !== 'template');
        },
        publicBoardsForDisplay(state) {
            return state.boards.filter(board => board.creator === 'guest');
        },
        templatesFrDisplay(state) {
            return state.boards.filter(board => board.creator === 'template');
        }
    },
    mutations: {
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        addBoard(state, { savedBoard }) {
            state.boards.push(savedBoard);
        },
        updateBoard(state, { savedBoard }) {
            const idx = state.boards.findIndex(currBoard => currBoard._id === savedBoard._id);
            state.boards.splice(idx, 1, savedBoard);
        }
    },
    actions: {
        async loadBoards({ commit, getters }) {
            console.log(getters.loggedInUser);
            const user = (getters.loggedInUser) ? getters.loggedInUser._id : undefined;
            const boards = await boardService.query(user);
            commit({ type: 'setBoards', boards });
        },
        async saveBoard({ commit }, { board }) {
            const actionType = (board._id) ? 'updateBoard' : 'addBoard';
            const savedBoard = await boardService.save(board);
            commit({ type: actionType, savedBoard });
            return savedBoard;
        },
    }
};