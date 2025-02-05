export interface Identity {
  accessToken: string;
  project: {
    id: string;
    image: string;
    name: string;
    url: string;
  };
  scope: string;
  user: {
    id: string;
    name: string;
  };
}

const KEY = 'identity';

const emptyIdentity: Identity = {
  accessToken: '',
  project: {
    id: '',
    image: '',
    name: '',
    url: '',
  },
  scope: '',
  user: {
    id: '',
    name: '',
  },
};

export { KEY, emptyIdentity };
