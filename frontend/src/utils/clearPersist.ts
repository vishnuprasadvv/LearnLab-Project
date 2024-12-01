import storage from 'redux-persist/lib/storage'; // default localStorage

export const clearSpecificPersistedData = (key: string) => {
  storage.removeItem(key);  // Remove a specific persisted key from storage
};

// Example to remove only the 'auth' slice data
clearSpecificPersistedData('auth');