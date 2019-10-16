import './App.css';

import { useFetch } from 'react-hooks-fetch';
import React, { Suspense } from 'react';

function DisplayRemoteData() {
  const { error, data } = useFetch('https://api.github.com/repos/LiskHQ/lisk-hub/commits');
  if (error) return <span>{`Error:${error.message}`}</span>;
  if (!data) return null; // this is important
  return (
    <span>
      RemoteData:
      {JSON.stringify(data)}
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
