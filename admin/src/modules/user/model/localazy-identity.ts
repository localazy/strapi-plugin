export interface LocalazyIdentity {
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

export const emptyIdentity: LocalazyIdentity = {
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
