export default (a, b) => {
  const uidA = Object.keys(a)[0].toLowerCase();
  const uidB = Object.keys(b)[0].toLowerCase();

  if (uidA < uidB) return -1;

  if (uidA > uidB) return 1;

  return 0;
};
