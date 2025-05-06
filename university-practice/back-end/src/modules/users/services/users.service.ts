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
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.firstName + user.lastName,
      })

      const now = time().toDate()
      const uid = userRecord.uid
      const docRef = this.collection.doc(uid)

      await docRef.set({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles ?? Roles.USER,
        createdAt: now,
        updatedAt: now,
      })

      const doc = await docRef.get()
      return { id: doc.id, ...(doc.data() as User) }
    } catch (error) {
      throw new Error(error)
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
