import { BoardModel } from '*/models/board.model'
import { cloneDeep } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_CURRENT_PAGE } from '*/utilities/constants'

const createNew = async (data, userId) => {
  try {
    const createdBoard = await BoardModel.createNew(data, userId)
    const getNewBoard = await BoardModel.findOneById(createdBoard.insertedId.toString())
    // push notification
    // do something...vv
    // transform data

    return getNewBoard
  } catch (error) {
    throw new Error(error)
  }
}

const getFullBoard = async (boardId, userId) => {
  try {
    const board = await BoardModel.getFullBoard(boardId)
    if (!board) {
      throw new Error('Board not found!')
    }

    const transformBoard = cloneDeep(board)
    // kiểm tra user đang request có quyền truy cập vào cái board hay không
    if (!transformBoard.ownerIds.map(i => i.toString().includes(userId)) &&
    !transformBoard.memberIds.map(i => i.toString().includes(userId))
    ) {
      throw new Error('you have no right to accsset this board')
    }

    // Filter deteled columns
    transformBoard.columns = transformBoard.columns.filter(column => !column._destroy)

    // Add card to each column
    transformBoard.columns.forEach(column => {
      column.cards = transformBoard.cards.filter(c => c.columnId.toString() === column._id.toString())
    })
    // Sort columns by columnOrder, sort cards bt cardOrder, this step will pass to frontend DEV =))
    // Remove cards data from boards
    delete transformBoard.cards

    return transformBoard
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    if (updateData._id) delete updateData._id
    if (updateData.columns) delete updateData.columns

    const updatedBoard = await BoardModel.update(id, updateData)

    return updatedBoard
  } catch (error) {
    throw new Error(error)
  }
}

const getListBoards = async (userId, currentPage, itemsPerPage, queryFilter) => {
  try {

    if (!currentPage) currentPage = DEFAULT_CURRENT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE


    const results = await BoardModel.getListBoards(
      userId,
      parseInt(currentPage),
      parseInt(itemsPerPage),
      queryFilter
    )

    return results
  } catch (error) {
    throw new Error(error)
  }
}


export const BoardService = {
  createNew,
  update,
  getFullBoard,
  getListBoards
}
