import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createRef, useState } from "react";
import { useAuthorName } from "../../../hooks/use-author-name";
import { CommentData } from "../../../model/comment";
import "./add-comment-form.scss";
import { useComments } from "../../../hooks/use-comments";

export const AddCommentForm: React.FC = () => {
    const addCommentFormRef = createRef<HTMLFormElement>();
    const {comments, setOptimistic, overrideOptimistic} = useComments();
    const [addCommentContent, setAddCommentContent] = useState('');
    const {authorName} = useAuthorName();

    const handleCommentContentKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== 'Enter' || event.shiftKey) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        handleAddCommentSubmit();
    }

    const handleCommentContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAddCommentContent(event.target.value);
    }

    const handleAddCommentSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        if (addCommentContent === '') {
            return;
        }
        const comment = new CommentData();
        comment.content = addCommentContent;
        comment.authorName = authorName === '' ? 'Anonymous' : authorName;
        const id = setOptimistic(comment);
        setAddCommentContent('');
        fetch('http://localhost:5000/comments', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const commentData = new CommentData();
            commentData.id = data.id;
            commentData.content = data.content;
            commentData.authorName = data.authorName;
            commentData.likes = data.likes;
            console.log(comment, id);
            
            overrideOptimistic(id, commentData);
        }).catch(error => {
            console.error(error);
            overrideOptimistic(id);
        });
      }
      
    return (
        <form ref={addCommentFormRef} className='add-comment-form keep row' onSubmit={handleAddCommentSubmit}>
          <div className='add-comment-content-wrapper'>
            <textarea 
              className='add-comment-content' 
              onKeyDown={handleCommentContentKeyDown} 
              value={addCommentContent}
              onChange={handleCommentContentChange}
              ></textarea>
            <div className='add-comment-content shadow'>
              {addCommentContent.length === 0 ? <br/> : addCommentContent}
            </div>
          </div>
          <div className='keep'>
            <button type='submit' className='submit c-pointer'>
              <FontAwesomeIcon className='submit-icon' icon={"paper-plane"}></FontAwesomeIcon>
            </button>
          </div>
        </form>
    )
}