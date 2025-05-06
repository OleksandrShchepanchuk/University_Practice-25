// firebase-auth.guard.ts
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']
    if (!authHeader) throw new UnauthorizedException('Missing token')

    const token = authHeader.split(' ')[1]
    try {
      const decodedToken = await this.firebaseApp.auth().verifyIdToken(token)
      request.user = decodedToken
      return true
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException('Invalid token')
    }
  }
}
