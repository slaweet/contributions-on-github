import {
  Alert, Card, CardBody, CardHeader, Spinner,
} from 'reactstrap';
import React from 'react';

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
  const events = [...pullRequests, ...commits, ...comments];
  const isLoading = isLoadingCommits || isLoadingPullRequests || isLoadingComments;
  return (
    <Card>
      <CardHeader>
        { isLoading && <Spinner size="sm" color="secondary" />}
        &nbsp;
        {` ${pullRequests.length} PRs, `}
        {` ${commits.length} commits and `}
        {` ${comments.length} review comments in `}
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
