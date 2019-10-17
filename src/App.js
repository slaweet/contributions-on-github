import './App.css';

import { useFetch } from 'react-hooks-fetch';
import React, { Suspense } from 'react';

import PunchChart from './PunchChart';

function transformCommit({ commit, author, sha }) {
  return {
    author: { login: author.login, id: author.id },
    date: commit.author.date,
    message: commit.message,
    sha,
    comment_count: commit.comment_count,
  };
}

function DisplayRemoteData() {
  const { error, data } = useFetch('https://api.github.com/repos/LiskHQ/lisk-hub/commits');
  if (error) return <span>{`Error:${error.message}`}</span>;
  if (!data) return null; // this is important
  return (
    <span>
      <PunchChart commits={data.map(transformCommit)} />
    </span>
  );
}

function App() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <DisplayRemoteData />
    </Suspense>
  );
}

export default App;
