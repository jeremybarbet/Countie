import { AsyncStorage } from 'react-native';
import { merge } from 'lodash';

export const prefix = v => `@countie:${v}`;

const storage = {
  /**
  * Get a one or more value for a key or array of keys from AsyncStorage
  */
  get(key) {
    if (!Array.isArray(key)) {
      return AsyncStorage.getItem(key).then(value =>
        JSON.parse(value),
      );
    }

    return AsyncStorage.multiGet(key).then(values =>
      values.map(value =>
        JSON.parse(value[1]),
      ),
    );
  },

  /**
  * Save a key value pair or a series of key value pairs to AsyncStorage.
  */
  set(key, value) {
    if (!Array.isArray(key)) {
      return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    const pairs = key.map(pair => [pair[0], JSON.stringify(pair[1])]);

    return AsyncStorage.multiSet(pairs);
  },

  /**
  * Updates the value in the store for a given key in AsyncStorage.
  * If the value is a string it will be replaced. If the value is an object it will be deep merged.
  */
  update(key, value) {
    return this.get(key).then((item) => {
      value = typeof value === 'string' ? value : merge({}, item, value); // eslint-disable-line
      return AsyncStorage.setItem(key, JSON.stringify(value));
    });
  },

  /**
  * Delete the value for a given key in AsyncStorage.
  */
  delete(key) {
    return AsyncStorage.removeItem(key);
  },

  /**
  * Get all keys in AsyncStorage.
  */
  keys() {
    return AsyncStorage.getAllKeys();
  },

  /**
  * Remove all the namespaced keys
  */
  clear() {
    return this.keys()
      .then((keys) => {
        keys
          .filter(key => key.split('@countie:')[1])
          .map(key => AsyncStorage.removeItem(key));
      });
  },
};

export default storage;
