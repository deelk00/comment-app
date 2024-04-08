import React, { useEffect, useState } from 'react';
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CommentComponent } from './components/comment/comment';
import { CommentData } from './model/data/comment';

function App() {
  const addCommentFormRef = React.createRef<HTMLFormElement>();
  const [searchTerm, setSearchTerm] = useState('');
  const [comments, setComments] = useState<CommentData[]>([]);
  const [displayedComments, setDisplayedComments] = useState<CommentData[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [requestLatency, setRequestLatency] = useState<number | undefined>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [addCommentContent, setAddCommentContent] = useState('');

  const [isLatencyDirty, setIsLatencyDirty] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

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
    fetch('http://localhost:5000/settings/latency')
      .then(response => response.json())
      .then(data => {
        setRequestLatency(data.delay);
      }).catch(error => console.error(error));
  }, []);

  useEffect(() => {
    console.log("awd");
    
    if (searchTerm === '') {
      setDisplayedComments(comments);
      return;
    }
    setDisplayedComments(comments.filter(comment => comment.content.includes(searchTerm) || comment.authorName.includes(searchTerm)));
  }, [searchTerm, comments]);

  const commentDeletedCallback = (id: number) => {
    setComments(comments.filter(comment => comment.id !== id));
  }

  const handleAuthorNameChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const value = event.target.value;
    setAuthorName(value);
    setIsLatencyDirty(true);
  }

  const handleLatencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value !== "" ? Number(event.target.value) : undefined;
    if (value && (isNaN(value) || value < 0)) {
      return;
    }
    setIsLatencyDirty(true);
    setRequestLatency(value);
  }

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
    console.log(JSON.stringify(comment));
    
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
      setComments([commentData, ...comments]);
      setAddCommentContent('');
    });
  }

  const updateLatency = () => {
    const settings = { delay: requestLatency };
    fetch('http://localhost:5000/settings/latency', {
      method: 'PATCH',
      body: JSON.stringify(settings),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => setIsLatencyDirty(false));
  }

  return (
    <div className='app'>
      <nav className='navigation keep row'>
        <a href='/' className='brand icon keep c-pointer'>Commenter</a>
        <div className='row control'>
          <FontAwesomeIcon 
            className='keep icon' 
            size='lg'
            icon={"search"} 
            />
          <input 
            role='search' 
            type='text'
            className='search'
            onChange={handleSearchChange}
            value={searchTerm}
            />
        </div>
      </nav>
      <div className='app-body'>
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
        <div className='settings keep row'>
          <FontAwesomeIcon 
            className='settings-icon keep' 
            size='lg'
            icon={"cog"} 
            />
          <div className='column'>
            <div className='control'>
              <FontAwesomeIcon 
                className='keep icon' 
                size='lg'
                icon={"person"} 
                />
              <input type="text" placeholder='Anonymous' onChange={handleAuthorNameChange}></input>
            </div>
            <div className='control'>
              <FontAwesomeIcon 
                className='keep icon' 
                size='lg'
                icon={"clock"} 
                />
              <input type={"number"} min={0} value={requestLatency === undefined ? "" : requestLatency} onChange={handleLatencyChange}></input>
              <span className='unit'>ms</span>
            </div>
            <div className='row keep'>
              <button className='save-button keep' disabled={!isLatencyDirty} onClick={updateLatency}>Speichern</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
