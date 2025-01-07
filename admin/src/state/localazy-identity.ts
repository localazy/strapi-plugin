import { createGlobalState } from "react-hooks-global-state";
import { emptyIdentity, LocalazyIdentity } from "../modules/user/model/localazy-identity";

const STATE_NAME = "localazyIdentity";
const { setGlobalState, useGlobalState } = createGlobalState({
  [STATE_NAME]: emptyIdentity,
});

const setLocalazyIdentity = (identity: LocalazyIdentity = emptyIdentity) => {
  setGlobalState(STATE_NAME, () => identity);
};

const getLocalazyIdentity = (): LocalazyIdentity => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // TODO: WHY [0]
  return useGlobalState(STATE_NAME)[0];
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
