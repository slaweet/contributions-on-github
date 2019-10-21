import {
  Card, CardHeader, ListGroup, ListGroupItem,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import Emoji from 'react-emoji-render';
import React from 'react';

import { formatDate, formatDateAndTime, getAvatarSrc } from './utils';
import { useCommits } from './hooks';
import PunchChart from './PunchChart';


export default function CommitsPage() {
  const {
    username = 'LiskHQ',
    repo = 'lisk-hub',
    since = '2019-09-29T00:00:00+0000',
    until = '2019-10-11T00:00:00+0000',
    showAvatarsAsPoints = false,
  } = useParams();
  const config = {
    username, repo, since, until, showAvatarsAsPoints,
  };
  const [commits] = useCommits(config);
  return (
    <Card>
      <CardHeader>{`Commits of ${config.repo} from ${formatDate(config.since)} to ${formatDate(config.until)}`}</CardHeader>
      <PunchChart commits={commits} config={config} />
      <ListGroup>
        {commits.map(({
          sha, message, author, date,
        }) => (
          <ListGroupItem key={sha}>
            <a href={`https://github.com/${config.username}/${config.repo}/commit/${sha}`}>
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
