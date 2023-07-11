const KEY_PREFIX = "to-do-app-";

const getDataDB = (keyWithoutPrefix) => {
  const key = KEY_PREFIX + keyWithoutPrefix;
  return JSON.parse(localStorage.getItem(key)) ?? [];
};

const addToDB = (keyWithoutPrefix, newValue = [{}]) => {
  const key = KEY_PREFIX + keyWithoutPrefix;

  const value = [...getDataDB(keyWithoutPrefix), ...newValue];
  localStorage.setItem(key, JSON.stringify(value));
};

const updateToDB = (keyWithoutPrefix, id, newData = {}) => {
  const key = KEY_PREFIX + keyWithoutPrefix;

  const data = getDataDB(keyWithoutPrefix);

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      data[i] = {
        ...data[i],
        ...newData,
      };
      break;
    }
  }

  localStorage.setItem(key, JSON.stringify(data));
};

export { addToDB, getDataDB, updateToDB };
