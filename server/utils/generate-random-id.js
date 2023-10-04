const generateRandomId = (length = 16) => `_${Math.random().toString(36).substr(2, length)}`;

module.exports = generateRandomId;
