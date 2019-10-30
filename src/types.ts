
export type Author = {
  login: string;
  avatar_url: string;
};

export type Committer = {
  html_url: string;
  avatar_url: string;
};

export type Commit = {
  sha: string;
  messageHeadline: string;
  author: Author;
  date:string;
  html_url: string;
  committer: Committer;
}

