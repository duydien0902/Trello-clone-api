import { HttpStatusCode } from '*/utilities/constants'
import { BoardService } from '*/services/board.service'

const createNew = async (req, res) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await BoardService.createNew(req.body, userId)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getFullBoard = async (req, res) => {
  try {
    const boardId = req.params.id
    const userId = req.jwtDecoded._id

    const result = await BoardService.getFullBoard(boardId, userId)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const result = await BoardService.update(id, req.body)

    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const getListBoards = async (req, res) => {
  try {
    const userId = req.jwtDecoded._id
    const { currentPage, itemsPerPage, q } = req.query

    const queryFilter = q
    const results = await BoardService.getListBoards(userId, currentPage, itemsPerPage, queryFilter)

    res.status(HttpStatusCode.OK).json(results)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}


export const BoardController = {
  createNew,
  getFullBoard,
  update,
  getListBoards
}
