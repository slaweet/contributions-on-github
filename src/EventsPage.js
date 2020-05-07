import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Label,
  Spinner,
} from 'reactstrap';
import React, { useState } from 'react';

import { formatDate } from './utils';
import { useAllEvents, useQueryParamConfig } from './hooks';
import PunchChart from './PunchChart';
import ConfigFormButton from './ConfigFormButton';
import EventsList from './EventsList';

export default function EventsPage() {
  const [config] = useQueryParamConfig();
  const [commentsEmabled, toggleComments] = useState(true);
  const [{ pullRequests, commits, comments }, isLoading, error] = useAllEvents(config);
  const errorMessage = `${error}` === 'Error: Request failed with status code 403'
    ? 'Authorization failed. You can resolve this by setting localStorage.setItem(\'githubToken\', \'YOUR_GITHUB_TOKEN\')'
    : `${error}`;
  const events = [
    ...pullRequests,
    ...commits,
    ...(commentsEmabled ? comments : []),
  ];

  return (
    <Card>
      <CardHeader>
        { isLoading && <Spinner size="sm" color="secondary" />}
        &nbsp;
        <Badge className="p-2">{`${pullRequests.length} PRs`}</Badge>
        &nbsp;
        <Badge className="p-2">{`${commits.length} commits`}</Badge>
        &nbsp;
        <Label check>
          <Badge className="p-2">
            {` ${comments.length} review comments `}
            <input className="my-n1" type="checkbox" checked={commentsEmabled} onChange={() => toggleComments(!commentsEmabled)} />
          </Badge>
        </Label>
        &nbsp;
         in
        &nbsp;
        <ConfigFormButton config={config} />
        {` from ${formatDate(config.since)} to ${formatDate(config.until)}`}
      </CardHeader>
      <CardBody>
        {errorMessage
          ? (
            <Alert color="danger">
              {errorMessage}
              {!localStorage.getItem('githubToken') && (
              <div>
              You can set up your
                {' '}
                <a href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line" target="_blank">GitHub token</a>
                {' '}
              by running
                <div>
                  <code>localStorage.setItem('githubToken', '[YOUR_GITHUB_TOKEN]')</code>
                </div>
              in the JavaScript console of this browser.
              </div>
              )}
            </Alert>
          )
          : <PunchChart events={events} config={config} />}
      </CardBody>
      <EventsList events={events} />
    </Card>
  );
}
