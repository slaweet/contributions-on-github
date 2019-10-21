import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Spinner,
} from 'reactstrap';
import { useQueryParam, StringParam, BooleanParam } from 'use-query-params';
import Emoji from 'react-emoji-render';
import React from 'react';
import moment from 'moment';

import {
  formatDate,
  formatDateAndTime,
  getAvatarSrc,
  getRepoUrl,
} from './utils';
import { useCommits } from './hooks';
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
    username, repo, since: `${since}T00:00:00+0000`, until: `${until}T00:00:00+0000`, showAvatarsAsPoints,
  };
  const [commits, isLoading, error] = useCommits(config);
  return (
    <Card>
      <CardHeader>
        { isLoading && <Spinner size="sm" color="secondary" />}
        {` ${commits.length} commits in `}
        <a href={getRepoUrl({ username, repo })}>{`${username}/${repo}`}</a>
        {` from ${formatDate(since)} to ${formatDate(until)}`}
      </CardHeader>
      <CardBody>
        {error
          ? <Alert color="danger">{`${error}`}</Alert>
          : <PunchChart commits={commits} config={config} />}
      </CardBody>
      <ListGroup>
        {commits.map(({
          sha, message, author, date,
        }) => (
          <ListGroupItem key={sha}>
            <a href={`${getRepoUrl({ username, repo })}/commit/${sha}`}>
              {sha.substr(0, 6)}
            </a>
            {' '}
             by
            {' '}
            <a href={`https://github.com/${author.login}`}>
              <img src={getAvatarSrc(author.id)} alt="avatar" />
              {` ${author.login}`}
            </a>
            {` ${formatDateAndTime(date)} `}
            <Emoji text={message} />
          </ListGroupItem>
        ))}
      </ListGroup>
    </Card>
  );
}
