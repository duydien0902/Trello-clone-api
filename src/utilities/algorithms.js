// https://www.mongodb.com/docs/manual/reference/method/cursor.skip/#pagination-example
// Tính toán giá trị skip phục vụ các tác vụ phân trang
export const pagingSkipValue = (currentPage, itemsPerPage) => {
  // Phải kiểm tra giá trị ở đây vì có thể client sẽ gửi linh tinh lên số âm chẳng hạn
  if (!currentPage || !itemsPerPage) return 0
  if (currentPage <= 0 || itemsPerPage <= 0) return 0

  /**
  * Ví dụ trường hợp mỗi page hiển thị 12 sản phẩm (itemsPerPage = 12)
  * Case 01: User đứng ở page 1 (currentPage = 1) thì sẽ lấy 1 - 1 = 0 sau đó nhân với 12 thì cũng = 0, lúc này giá trị skip là 0, nghĩa là không skip bản ghi
  * Case 02: User đứng ở page 2 (currentPage = 2) thì sẽ lấy 2 - 1 = 1 sau đó nhân với 12 thì = 12, lúc này giá trị skip là 12, nghĩa là skip 12 bản ghi của 1 page trước đó
  * Case 03: User đứng ở page 5 (currentPage = 5) thì sẽ lấy 5 - 1 = 4 sau đó nhân với 12 thì = 48, lúc này giá trị skip là 48, nghĩa là skip 48 bản ghi của 4 page trước đó
  * ... Tương tự với mọi page khác
  */
  return (currentPage - 1) * itemsPerPage
}
