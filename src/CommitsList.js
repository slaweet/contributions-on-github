import './CommitsList.css';

import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import Emoji from 'react-emoji-render';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDateAndTime } from './utils';


export default function CommitsList({ commits }) {
  const actions = {
    pr: 'created',
    commit: 'committed',
  };
  return (
    <ListGroup>
      {commits.map(({
        id, messageHeadline, date, html_url: url, user, type,
      }) => (
        <ListGroupItem key={id} className="commitRow">
          <div>
            <div>
              <strong>
                <Emoji text={messageHeadline} />
              </strong>
            </div>
            <div>
              <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                <img src={user.avatar_url} alt="avatar" className="avatar" />
                {` ${user.login}`}
              </a>
              {` ${actions[type]} on ${formatDateAndTime(date)} `}
            </div>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button>{id.substr(0, 6)}</Button>
          </a>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}

CommitsList.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.shape()),
};

CommitsList.defaultProps = {
  commits: [],
};
