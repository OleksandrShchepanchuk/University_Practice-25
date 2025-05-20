import { Firestore } from '@google-cloud/firestore'
import { Inject, Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { time } from 'src/helpers'
import { BaseService } from 'src/modules/base/services/base.service'
import { FirestoreDatabaseProvider } from 'src/providers'
import { UserDto } from '../dtos/user.dto'
import { Roles } from '../models/role'
import { User } from '../models/user'

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
    @Inject(FirestoreDatabaseProvider) repository: Firestore,
  ) {
    super(repository, repository.collection('users') as FirebaseFirestore.CollectionReference<User>)
  }

  async create(user: UserDto): Promise<User> {
    const auth = this.firebaseApp.auth()

    try {
      const { uid } = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: `${user.firstName} ${user.lastName}`,
      })

      await auth.setCustomUserClaims(uid, {
        role: user.roles ?? Roles.USER,
      })

      const now = time().toDate()
      const doc = this.collection.doc(uid)
      await doc.set({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles ?? Roles.USER,
        createdAt: now,
        updatedAt: now,
      })

      const snap = await doc.get()
      return { id: snap.id, ...(snap.data() as User) }
    } catch (e) {
      throw new Error((e as Error).message)
    }
  }

  async findUser(email: string) {
    try {
      const user = await admin.auth().getUserByEmail(email)
      return user
    } catch (error) {
      throw new Error('User not found: ' + error)
    }
  }
}
