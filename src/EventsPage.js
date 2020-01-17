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
        <Badge>{`${pullRequests.length} PRs`}</Badge>
        &nbsp;
        <Badge>{`${commits.length} commits`}</Badge>
        &nbsp;
        <Label check>
          <Badge>
            {` ${comments.length} review comments `}
            <input type="checkbox" checked={commentsEmabled} onChange={() => toggleComments(!commentsEmabled)} />
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
          ? <Alert color="danger">{errorMessage}</Alert>
          : <PunchChart events={events} config={config} />}
      </CardBody>
      <EventsList events={events} />
    </Card>
  );
}
