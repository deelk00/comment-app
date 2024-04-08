import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./comment.scss";

export interface CommentProps {
    id: number;
    content: string;
    authorName: string;
    likes: number;
    onDelete: (id: number) => void;
}

export const CommentComponent: React.FC<CommentProps> = (props) => {

    const handleDelete = () => {
        fetch(`http://localhost:5000/comments/${props.id}`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                console.error('Error deleting comment');
                return;
            }
            props.onDelete(props.id);
        });
    };

    return (
        <div className='comment-reference keep'>
            <div className="delete-icon c-pointer" onClick={handleDelete}>
                <FontAwesomeIcon className='icon' icon={"trash"} size={"1x"}></FontAwesomeIcon>
            </div>
            <div className="comment">
                <div className="comment-icon">
                    <FontAwesomeIcon className='icon' icon={"comment"} size={"xs"}></FontAwesomeIcon>
                </div>
                <div className='comment-content'>
                    {props.content}
                </div>
                <div className='comment-footer row'>
                    <div className="row keep likes c-pointer">
                        <FontAwesomeIcon className="thumbs-icon" icon={"thumbs-up"} size="sm"></FontAwesomeIcon>
                        <span className='keep number'>{props.likes}</span>
                    </div>
                    <span className='author'>{props.authorName}</span>
                </div>
            </div>
        </div>
    );
}