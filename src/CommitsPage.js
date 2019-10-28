import {
  Alert,
  Button,
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
import './CommitsPage.css';

import {
  formatDate,
  formatDateAndTime,
} from './utils';
import { useCommits } from './hooks';
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
      <ListGroup>
        {commits.map(({
          sha, messageHeadline, author, date, html_url, committer,
        }) => (
          <ListGroupItem key={sha} className="commitRow">
            <div>
              <div>
                <strong>
                  <Emoji text={messageHeadline} />
                </strong>
              </div>
              <div>
                <a href={committer.html_url} target="_blank" rel="noopener noreferrer">
                  <img src={committer.avatar_url} alt="avatar" className="avatar" />
                  {` ${author.login}`}
                </a>
                {` committed on ${formatDateAndTime(date)} `}
              </div>
            </div>
            <a href={html_url} target="_blank" rel="noopener noreferrer">
              <Button>{sha.substr(0, 6)}</Button>
            </a>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Card>
  );
}
