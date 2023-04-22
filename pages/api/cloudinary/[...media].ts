import {
  createMediaHandler,
} from 'next-tinacms-cloudinary/dist/handlers'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default createMediaHandler({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  authorized: async (req, res) => {
    try {
      if (process.env.NODE_ENV == 'development') {
        return true
      }
      const session = await getServerSession(req, res, authOptions)
      const userHasValidSession = Boolean(session)

      const isAuthorized =
        process.env.TINA_PUBLIC_IS_LOCAL === 'true'
        || userHasValidSession === true
        || false

      if (isAuthorized) {
        console.log("Session in media", session)
        return Boolean(session.user)
      }

      // const user = await isAuthorized

      // return user && user.verified
    } catch (e) {
      console.error(e)
      return false
    }
  },
})
