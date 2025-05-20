import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import * as admin from 'firebase-admin'
import { Strategy } from 'passport-custom'

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  async validate(req: any, done: Function): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      done(new Error('Token not found'), false)
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token)
      req.user = decodedToken

      const userClaims = decodedToken
      req.user.roles = userClaims.roles || 'user'

      done(null, decodedToken)
    } catch (error) {
      done(new Error('Unauthorized'), false)
    }
  }
}
