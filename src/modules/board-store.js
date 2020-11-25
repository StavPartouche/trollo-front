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
    },
    actions: {
        //Board
        async loadBoards({ commit }){
            const boards = await boardService.query()
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