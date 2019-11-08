import './EventsList.css';

import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import Emoji from 'react-emoji-render';
import PropTypes from 'prop-types';
import React from 'react';

import { formatDateAndTime } from './utils';


export default function EventsList({ events }) {
  const actionLabels = {
    pr: 'created',
    commit: 'committed',
    comment: 'commented',
  };
  return (
    <ListGroup>
      {events.map(({
        id, messageHeadline, date, html_url: url, user, type,
      }) => (
        <ListGroupItem key={id} className="eventRow">
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
              {` ${actionLabels[type]} on ${formatDateAndTime(date)} `}
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

EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape()),
};

EventsList.defaultProps = {
  events: [],
};
