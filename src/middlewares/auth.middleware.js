import { HttpStatusCode } from '*/utilities/constants'
import { JwtProvider } from '*/providers/JwtProvider'
import { env } from '*/config/environtment'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken
  if (!clientAccessToken) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      errors: 'Unauthorized (token not found)'
    })
  }

  try {
    // thực hiện giaỉ mã token xem nó có hơp lệ hay là không
    const accessTokenDecoded = await JwtProvider.verifyToken(env.ACCESS_TOKEN_SECRET_SIGNATURE, clientAccessToken)


    // Quan trọng: Nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giải mã được vào cái req, để sử dụng cho các phần cần xử lý ở phía sau

    req.jwtDecoded = accessTokenDecoded

    //cho phép request đi tiếp
    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      // cái accessToken nó bị hết hạn (expired) thì mình cần trả về một cái mã lỗi cho phía FE rọi api refreshToken
      return res.status(HttpStatusCode.EXPIRED).json({
        errors: 'Need to refresh token.'
      })
    }

    // Nếu như cái accessToken nó không lợp lệ do bất kỳ điều gì thì chúng ta sẽ trả về mã 401 cho phía FE gọi api sign_out luôn
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      errors: 'Unauthorized.'
    })

  }
}

export const AuthMiddleware = { isAuthorized }