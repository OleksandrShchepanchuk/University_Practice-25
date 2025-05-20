import { BaseModel } from 'src/modules/base/models'
import { Roles } from './role'

export class User extends BaseModel {
  static collectionName = 'users'

  email: string
  firstName: string
  lastName: string
  roles: Roles
}
