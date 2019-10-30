import {
  Alert, Card, CardBody, CardHeader, Spinner,
} from 'reactstrap';
import React from 'react';

import { formatDate } from './utils';
import { useCommits, useQueryParamConfig } from './hooks';
import CommitsList from './CommitsList';
import ConfigFormButton from './ConfigFormButton';
import PunchChart from './PunchChart';

export default function CommitsPage() {
  const [config] = useQueryParamConfig();
  const [commits, isLoading, error] = useCommits(config);
  return (
    <Card>
      <CardHeader>
        { isLoading && <Spinner size="sm" color="secondary" />}
        &nbsp;
        {` ${commits.length} commits in `}
        <ConfigFormButton config={config} />
        {` from ${formatDate(config.since)} to ${formatDate(config.until)}`}
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
