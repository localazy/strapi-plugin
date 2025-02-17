const generateRandomId = (length = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '_';

  for (let i = 0; i < length - 1; i++) {
    const randomValue = Math.random();
    const scaledValue = randomValue * chars.length;
    const index = Math.floor(scaledValue);
    const selectedChar = chars.charAt(index);
    result += selectedChar;
  }

  return result;
};

export { generateRandomId };
