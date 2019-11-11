import commentsApiResponse from './commentsApiResponse';
import commitsApiReponse from './commitsApiReponse';
import pullRequestsApiResponse from './pullRequestsApiResponse';

export default {
  'https://api.github.com/repos/LiskHQ/lisk-hub/commits': commitsApiReponse,
  'https://api.github.com/repos/LiskHQ/lisk-hub/pulls': pullRequestsApiResponse,
  'https://api.github.com/repos/LiskHQ/lisk-hub/pulls/comments': commentsApiResponse,
};
