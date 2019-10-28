import {
  Alert, Card, CardBody, CardHeader, Spinner,
} from 'reactstrap';
import { useQueryParam, StringParam, BooleanParam } from 'use-query-params';
import React from 'react';
import moment from 'moment';

import { formatDate } from './utils';
import { useCommits } from './hooks';
import CommitsList from './CommitsList';
import ConfigFormButton from './ConfigFormButton';
import PunchChart from './PunchChart';

const formatEndOfDay = (date) => (
  date.endOf('day').toISOString().substr(0, 10)
);

export default function CommitsPage() {
  const [repo] = useQueryParam('repo', StringParam);
  const [username] = useQueryParam('username', StringParam);
  const [since = formatEndOfDay(moment().subtract(14, 'days'))] = useQueryParam('since', StringParam);
  const [until = formatEndOfDay(moment())] = useQueryParam('until', StringParam);
  const [showAvatarsAsPoints = false] = useQueryParam('showAvatarsAsPoints', BooleanParam);

  const config = {
    username, repo, since, until, showAvatarsAsPoints,
  };
  const [commits, isLoading, error] = useCommits(config);
  return (
    <Card>
      <CardHeader>
        { isLoading && <Spinner size="sm" color="secondary" />}
        &nbsp;
        {` ${commits.length} commits in `}
        <ConfigFormButton config={config} />
        {` from ${formatDate(since)} to ${formatDate(until)}`}
      </CardHeader>
      <CardBody>
        {error
          ? <Alert color="danger">{`${error}`}</Alert>
          : <PunchChart commits={commits} config={config} />}
      </CardBody>
      <CommitsList commits={commits} />
    </Card>
  );
}
