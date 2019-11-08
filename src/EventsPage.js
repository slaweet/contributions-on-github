import {
  Alert, Card, CardBody, CardHeader, Spinner,
} from 'reactstrap';
import React from 'react';

import { formatDate } from './utils';
import { useCommits, usePullRequests, useQueryParamConfig } from './hooks';
import ConfigFormButton from './ConfigFormButton';
import EventsList from './EventsList';
import PunchChart from './PunchChart';

export default function EventsPage() {
  const [config] = useQueryParamConfig();
  const [commits, isLoading, error] = useCommits(config);
  const [pullRequests] = usePullRequests(config);
  const events = [...pullRequests, ...commits];
  return (
    <Card>
      <CardHeader>
        { isLoading && <Spinner size="sm" color="secondary" />}
        &nbsp;
        {` ${pullRequests.length} PRs and `}
        {` ${commits.length} commits in `}
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
