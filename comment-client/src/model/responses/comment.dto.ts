import { CommentData } from "../data/comment";

export class CommentDataDto {
    id: number;
    content: string;
    authorName: string;
    likes: number;

    toComment = (): CommentData => {
        const comment = new CommentData();
        
        comment.id = this.id;
        comment.content = this.content;
        comment.authorName = this.authorName;
        comment.likes = this.likes;

        return comment;
    }
}