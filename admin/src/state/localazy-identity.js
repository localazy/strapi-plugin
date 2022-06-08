import { createGlobalState } from "react-hooks-global-state";
import { emptyIdentity } from "../modules/user/model/localazy-identity";

const STATE_NAME = "localazyIdentity";
const { setGlobalState, useGlobalState } = createGlobalState({
  [STATE_NAME]: emptyIdentity,
});

const setLocalazyIdentity = (identity = emptyIdentity) => {
  setGlobalState(STATE_NAME, () => identity);
};

const getLocalazyIdentity = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useGlobalState(STATE_NAME);
};

const hasLocalazyIdentity = () => {
  const identity = getLocalazyIdentity();

  return !!identity.accessToken;
};

export {
  STATE_NAME,
  getLocalazyIdentity,
  setLocalazyIdentity,
  hasLocalazyIdentity,
};
