import { boardService } from '../services/board.service.js';

export default {
    state: {
        boards: [],
        board: {}
    },
    getters: {
        userBoardsForDisplay(state) {
            const userBoard = state.boards.find(board => board.creator !== 'template' && board.creator !== 'guest');
            const userId = (userBoard) ? userBoard.creator : '';
            return state.boards.filter(board => board.creator === userId || board.members.includes(userId));
        },
        publicBoardsForDisplay(state) {
            return state.boards.filter(board => board.creator === 'guest');
        },
        templatesForDisplay(state) {
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
        },
        removeBoard(state, { boardId }) {
            const idx = state.boards.findIndex(board => board._id === boardId);
            state.boards.splice(idx, 1);
        }
    },
    actions: {
        async loadBoards({ commit, getters }) {
            try{
                const user = (getters.loggedInUser) ? getters.loggedInUser._id : undefined;
                const boards = await boardService.query(user);
                commit({ type: 'setBoards', boards });
            } catch (err){
                console.error('Cannot load boards', err);
                throw err;
            }
        },
        async saveBoard({ commit }, { board }) {
            try {
                const actionType = (board._id) ? 'updateBoard' : 'addBoard';
                const savedBoard = await boardService.save(board);
                commit({ type: actionType, savedBoard });
                return savedBoard;
            } catch (err) {
                console.error('Cannot save board', err);
                throw err;
            }
        },
        async removeBoard({ commit }, { boardId }) {
            try {
                const board = await boardService.getById(boardId);
                const removedBoard = await boardService.remove(board);
                commit({ type: 'removeBoard', boardId });
                return removedBoard;
            } catch (err) {
                throw err;
            }
        }
    }
};