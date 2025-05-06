import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getEnvFile } from './env'
import { AuthModule } from './modules/auth/auth.module'
import { BookingModule } from './modules/booking/booking.module'
import { FavoritesModule } from './modules/favorites/favorites.module'
import { MoviesSessionModule } from './modules/movies-session/movies-session.module'
import { MovieModule } from './modules/movies/movies.module'
import { UserModule } from './modules/users/user.module'
import { FirestoreModule } from './providers'
import { FirebaseAdminModule } from './providers/firebase-admin/firebase-admin.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFile(),
    }),
    FirebaseAdminModule,
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    }),
    MovieModule,
    MoviesSessionModule,
    AuthModule,
    UserModule,
    BookingModule,
    FavoritesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
