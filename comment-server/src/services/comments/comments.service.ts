import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Comment } from '../../model/common/comment';
import { createUniqueId } from 'src/utility';

@Injectable()
export class CommentsService {
  private readonly filePath = join(
    __dirname,
    '../../..',
    'data',
    'comments.json',
  );
  private readonly fileEncoding = 'utf8';
  private callbacks: ((message: string, data: Comment) => void)[] = [];

  async getComments(): Promise<Comment[]> {
    try {
      const data = await fs.readFile(this.filePath, this.fileEncoding);
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.writeFile(
          this.filePath,
          JSON.stringify([]),
          this.fileEncoding,
        );
        return [];
      } else {
        throw err;
      }
    }
  }

  async addComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
    const comments = await this.getComments();
    const newComment: Comment = { id: createUniqueId(), ...comment };
    comments.unshift(newComment);
    await fs.writeFile(this.filePath, JSON.stringify(comments, null, 2));
    this.sendMessage('added', newComment); // Emit an update event
    return newComment;
  }

  async deleteComment(id: number): Promise<Comment | undefined> {
    const comments = await this.getComments();
    const index = comments.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    const [deletedComment] = comments.splice(index, 1);
    await fs.writeFile(this.filePath, JSON.stringify(comments, null, 2));
    this.sendMessage('deleted', deletedComment); // Emit an update event
    return deletedComment;
  }

  async likeComment(id: number): Promise<Comment | undefined> {
    const comments = await this.getComments();
    const index = comments.findIndex((c) => c.id === id);
    if (index === -1) return undefined; // Comment not found

    // Toggle the like status for the comment
    comments[index].likes++;

    await fs.writeFile(this.filePath, JSON.stringify(comments, null, 2));
    this.sendMessage('liked', comments[index]); // Emit an update event
    return comments[index];
  }

  sendMessage = (message: string, data: Comment) => {
    for (const callback of this.callbacks) {
      callback(message, data);
    }
  };

  subscribe = (callback: (message: string, data: Comment) => void) => {
    this.callbacks.push(callback);
  };

  unsubscribe = (callback: (message: string, data: Comment) => void) => {
    this.callbacks = this.callbacks.filter(x => x !== callback);
  }
}
