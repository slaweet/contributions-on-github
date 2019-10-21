import {
  Card, CardHeader, ListGroup, ListGroupItem,
} from 'reactstrap';
import { useQueryParam, StringParam, BooleanParam } from 'use-query-params';
import Emoji from 'react-emoji-render';
import React from 'react';

import { formatDate, formatDateAndTime, getAvatarSrc } from './utils';
import { useCommits } from './hooks';
import PunchChart from './PunchChart';


export default function CommitsPage() {
  const [repo = 'lisk-hub'] = useQueryParam('repo', StringParam);
  const [username = 'LiskHQ'] = useQueryParam('username', StringParam);
  const [since = '2019-09-29T00:00:00+0000'] = useQueryParam('since', StringParam);
  const [until = '2019-10-11T00:00:00+0000'] = useQueryParam('until', StringParam);
  const [showAvatarsAsPoints = false] = useQueryParam('showAvatarsAsPoints', BooleanParam);

  const config = {
    username, repo, since, until, showAvatarsAsPoints,
  };
  const [commits] = useCommits(config);
  return (
    <Card>
      <CardHeader>{`Commits of ${username}/${repo} from ${formatDate(since)} to ${formatDate(until)}`}</CardHeader>
      <PunchChart commits={commits} config={config} />
      <ListGroup>
        {commits.map(({
          sha, message, author, date,
        }) => (
          <ListGroupItem key={sha}>
            <a href={`https://github.com/${username}/${repo}/commit/${sha}`}>
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
