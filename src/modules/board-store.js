import { boardService } from '../services/board.service.js'

export default {
    state: {
        boards: [],
        board: {
        }
    },
    getters: {
        boardsForDisplay(state){
            return state.boards
        },
    },
    mutations: {
        setBoards(state, { boards }){
            state.boards = boards
        },
        addBoard(state, { savedBoard }){
            state.boards.push(savedBoard)
        },
        updateBoard(state, { savedBoard }){
            const idx = state.boards.findIndex(currBoard => currBoard._id === savedBoard._id)
            state.boards.splice(idx, 1, savedBoard)
        }
    },
    actions: {
        async loadBoards({commit, getters}){
            const user = (getters.loggedInUser[0]) ? getters.loggedInUser[0]._id : undefined;
            const boards = await boardService.query(user)
            console.log(boards);
            commit({ type: 'setBoards', boards })
        },
        async saveBoard({ commit },  { board }){
            const actionType = (board._id) ? 'updateBoard' : 'addBoard';
            const savedBoard = await boardService.save(board)
            commit({ type: actionType, savedBoard })
            return savedBoard
        },
    }
}