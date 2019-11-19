import { to } from 'await-to-js';
import { useQueryParam, StringParam, BooleanParam } from 'use-query-params';
import { useState, useEffect } from 'react';
import moment from 'moment';

import { getComments, getCommits, getPullRequests } from './utils';

const formatEndOfDay = (date) => (
  date.endOf('day').toISOString().substr(0, 10)
);

export function useQueryParamConfig() {
  const [repo = ''] = useQueryParam('repo', StringParam);
  const [username = ''] = useQueryParam('username', StringParam);
  const [since = formatEndOfDay(moment().subtract(14, 'days'))] = useQueryParam('since', StringParam);
  const [until = formatEndOfDay(moment())] = useQueryParam('until', StringParam);
  const [showAvatarsAsPoints = false] = useQueryParam('showAvatarsAsPoints', BooleanParam);

  return [{
    username, repo, since, until, showAvatarsAsPoints,
  }];
}

function useEvents({
  username, repo, since, until,
}, getEvents) {
  const [commits, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function validateConfig() {
      const isValid = !!repo && !!username;
      if (!isValid) {
        setError('Missing `repo` and/or `username` param. Please select them in the header dropdown');
      }
      return isValid;
    }

    async function fetchUrl(page = 1, prevEvents = []) {
      setLoading(true);
      const [err, response] = await to(getEvents({
        repo, username, page, since, until,
      }));
      setLoading(false);
      if (err) {
        setError(err);
      } else {
        const currentEvents = [
          ...prevEvents,
          ...response.data.filter(
            ({ id, date }) => !prevEvents.some((c) => c.id === id)
              && (moment(date).isAfter(since))
              && moment(date).isBefore(until),
          )];
        setEvents(currentEvents);
        if (response.data.length === 30) {
          fetchUrl(page + 1, currentEvents);
        }
      }
    }
    if (validateConfig()) {
      fetchUrl();
    }
  }, [username, repo, since, until, getEvents]);
  return [commits, loading, error];
}

export function useCommits(config) {
  return useEvents(config, getCommits);
}

export function usePullRequests(config) {
  return useEvents(config, getPullRequests);
}

export function useComments(config) {
  return useEvents(config, getComments);
}

export function useAllEvents(config) {
  const [commits, isLoadingCommits, commitsError] = useCommits(config);
  const [pullRequests, isLoadingPullRequests, pullRequestsError] = usePullRequests(config);
  const [comments, isLoadingComments, commentsError] = useComments(config);

  const events = { pullRequests, commits, comments };
  const isLoading = isLoadingCommits || isLoadingPullRequests || isLoadingComments;
  const error = commitsError || pullRequestsError || commentsError;
  return [events, isLoading, error];
}
