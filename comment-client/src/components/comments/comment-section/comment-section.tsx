import { useState, useEffect } from "react";
import { CommentData } from "../../../model/data/comment";
import { CommentComponent } from "./../comment/comment";
import { useSearchTerm } from "../../../hooks/use-search-term";
import { useComments } from "../../../hooks/use-comments";
import { useAuthorName } from "../../../hooks/use-author-name";

export const CommentSection: React.FC = () => { 
    const [isLoading, setIsLoading] = useState(true);
    const {authorName} = useAuthorName();
    const {comments, setComments} = useComments();
    const [displayedComments, setDisplayedComments] = useState<CommentData[]>([]);
    const searchTerm = useSearchTerm();
    
    useEffect(() => {
        fetch('http://localhost:5000/comments')
            .then(response => response.json())
            .then(data => {
            setComments(data.map((comment: any) => {
                const commentData = new CommentData();
                commentData.id = comment.id;
                commentData.content = comment.content;
                commentData.authorName = comment.authorName;
                commentData.likes = comment.likes;
                return commentData;
            }));
            setIsLoading(false);
            }).catch(error => console.error(error));

        const commentsEventSource = new EventSource('http://localhost:5000/comments/subscribe');
        commentsEventSource.onmessage = (event: any) => {
            const data = JSON.parse(event.data);
            const message = data.message as string;
            const comment = data.data as CommentData;
            
            switch (message) {
                case 'added':
                    if (comment.authorName !== authorName) {
                        setComments([comment, ...comments]);
                    }
                    break;
                case 'deleted':
                    setComments(comments.filter(c => c.id !== comment.id));
                    break;
                case 'liked':
                    const likedComment = comments.find(c => c.id === comment.id);
                    
                    likedComment!.likes = comment.likes;
                    setComments([...comments]);
                    break;
                default:
                    throw new Error("How did that happen?!");
            }
        };
    
    
        // Clean up on component unmount
        return () => {
            commentsEventSource.close();
        };
    }, [comments]);

    useEffect(() => {
        if (searchTerm.searchTerm === '') {
            setDisplayedComments(comments);
            return;
        }
        setDisplayedComments(comments.filter(comment => comment.content.includes(searchTerm.searchTerm) || comment.authorName.includes(searchTerm.searchTerm)));
    }, [searchTerm, comments]);
    

    const commentDeletedCallback = (id: number) => {
        setComments(comments.filter(comment => comment.id !== id));
    }

    return (
        <>
            { isLoading ? 
            <div className='loading comment-section'>
              <h2 className='loading-text'>Lade Kommentare...</h2>
            </div>
            : 
            <div className='comment-section'>
                {displayedComments.length === 0 ? 
                <div className='no-comments'>
                    <h2>Keine Kommentare vorhanden</h2>
                </div> 
                : displayedComments.map(comment => (<CommentComponent onDelete={commentDeletedCallback} key={comment.id} {...comment}></CommentComponent>))}
            </div>
            }
        </>
    )
}