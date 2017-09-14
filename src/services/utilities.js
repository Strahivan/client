import isEqual from 'lodash-isequal';

function filterUntouchedProperties(main, updated) {
  const result = {};
  Object.keys(main).forEach(key => {
    if (main[key] !== updated[key]) {
      result[key] = updated[key];
    }
  });

  return result;
}

function diff(main, updated) {
  const result = {};
  Object.keys(main).forEach(key => {
    if (!isEqual(main[key], updated[key])) {
      result[key] = updated[key];
    }
  });
  return result;
}

export const utilities = { filterUntouchedProperties, diff };

