import React, { useState } from 'react';
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CommentData } from './model/comment';
import { Settings } from './components/settings/settings';
import { AuthorNameProvider, useAuthorName } from './hooks/use-author-name';
import { CommentsProvider, useComments } from './hooks/use-comments';
import { CommentSection } from './components/comments/comment-section/comment-section';
import { SearchTermProvider, useSearchTerm } from './hooks/use-search-term';
import { AddCommentForm } from './components/comments/add-comment-form/add-comment-form';
import { Navigation } from './components/navigation/navigation';

function App() {
  return (
    <div className='app'>
      <SearchTermProvider>
        <Navigation></Navigation>
        <div className='app-body'>
        <CommentsProvider>
          <AuthorNameProvider>
            <AddCommentForm></AddCommentForm>
            <CommentSection></CommentSection>
            <Settings></Settings>
          </AuthorNameProvider>
        </CommentsProvider>
      </div>
      </SearchTermProvider>
    </div>
  );
}

export default App;
