import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as admin from 'firebase-admin'
import * as fs from 'fs'

export const FirebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: (configService: ConfigService) => {
    if (!admin.apps.length) {
      const accountPath = configService.get<string>('SA_KEY')
      if (!accountPath) throw new Error('Service account key path is not configured')

      const serviceAccount = JSON.parse(fs.readFileSync(accountPath, 'utf8'))

      const adminConfig: admin.ServiceAccount = {
        projectId: serviceAccount.project_id,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
      }

      return admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        databaseURL: `https://${adminConfig.projectId}.firebaseio.com`,
      })
    }

    return admin.app()
  },
  inject: [ConfigService],
}
