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
import {
  useComments,
  useCommits,
  usePullRequests,
  useQueryParamConfig,
} from './hooks';
import ConfigFormButton from './ConfigFormButton';
import EventsList from './EventsList';
import PunchChart from './PunchChart';

export default function EventsPage() {
  const [config] = useQueryParamConfig();
  const [commits, isLoadingCommits, error] = useCommits(config);
  const [pullRequests, isLoadingPullRequests] = usePullRequests(config);
  const [comments, isLoadingComments] = useComments(config, pullRequests);
  const [commentsEmabled, toggleComments] = useState(true);
  const events = [
    ...pullRequests,
    ...commits,
    ...(commentsEmabled ? comments : []),
  ];
  const isLoading = isLoadingCommits || isLoadingPullRequests || isLoadingComments;
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
          : <PunchChart events={events} config={config} />}
      </CardBody>
      <EventsList events={events} />
    </Card>
  );
}
