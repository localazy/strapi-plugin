export default (a: Record<string, any>, b: Record<string, any>) => {
  const uidA = Object.keys(a)[0].toLowerCase();
  const uidB = Object.keys(b)[0].toLowerCase();

  if (uidA < uidB) return -1;

  if (uidA > uidB) return 1;

  return 0;
};
