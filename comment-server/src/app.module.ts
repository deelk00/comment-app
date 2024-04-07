import { Module } from '@nestjs/common';
import { CommentsController } from './controllers/comments/comments.controller';
import { CommentsService } from './services/comments/comments.service';
import { SettingsController } from './controllers/settings/settings.controller';

@Module({
  imports: [],
  controllers: [CommentsController, SettingsController],
  providers: [CommentsService],
})
export class AppModule {}
