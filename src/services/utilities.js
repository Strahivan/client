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

export function closeMobileMenu() {
  const menu = document.getElementsByClassName('navbar-menu')[0];
  const burger = document.getElementsByClassName('navbar-burger')[0];
  if (menu.classList.contains('is-active')) {
    menu.classList.remove('is-active');
  }
  if (burger.classList.contains('is-active')) {
    burger.classList.remove('is-active');
  }
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

export const utilities = { filterUntouchedProperties, diff, closeMobileMenu };

