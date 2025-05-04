// roles.guard.ts
import { Firestore } from '@google-cloud/firestore'
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import * as admin from 'firebase-admin'
import { FirestoreDatabaseProvider } from 'src/providers'
import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
    @Inject(FirestoreDatabaseProvider) private readonly firestore: Firestore,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles || requiredRoles.length === 0) return true

    const request = context.switchToHttp().getRequest()
    const uid = request.user?.uid
    if (!uid) throw new ForbiddenException('No user ID in request')

    const userDoc = await this.firestore.collection('users').doc(uid).get()
    const userData = userDoc.data()

    if (!userData || !requiredRoles.includes(userData.roles)) {
      throw new ForbiddenException('Insufficient role permissions')
    }

    return true
  }
}
