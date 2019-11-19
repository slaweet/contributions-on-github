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
import Charts from './Charts';
import ConfigFormButton from './ConfigFormButton';
import EventsList from './EventsList';

export default function EventsPage() {
  const [config] = useQueryParamConfig();
  const [commentsEmabled, toggleComments] = useState(true);
  const [{ pullRequests, commits, comments }, isLoading, error] = useAllEvents(config);
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
        {error
          ? <Alert color="danger">{`${error}`}</Alert>
          : <Charts events={events} config={config} />}
      </CardBody>
      <EventsList events={events} />
    </Card>
  );
}
