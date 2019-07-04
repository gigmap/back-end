/**
 * @param {string} name
 * @return {string}
 */
const stripDateFromName = (name) => {
  const position = name.lastIndexOf('(');
  if (position === -1) {
    return name;
  }

  return name.substring(0, position - 1);
};

module.exports = stripDateFromName;