// src/services/local-storage.ts

import { decrypt, encrypt } from "./encryption";

/**
 * Encrypts the given data, then stores it in local storage.
 *
 * @param key Unique key to store the data with.
 * @param data Data to store. Must be JSON serializable.
 */
export const setLocalStorage = <T>(key: string, data: T): void => {
    // const encryptedData = encrypt(JSON.stringify(data));
    // localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, encryptedData);
    localStorage.setItem(`${key}`, JSON.stringify(data));
};

/**
 * Retrieves the given data from local storage, decrypts it, and returns it
 * as a JSON-parsed object.
 *
 * @param key Unique key to retrieve the data with.
 * @returns The retrieved data, or null if the key does not exist.
 */
export const getLocalStorage = <T>(key: string): T | null => {
    const storedData = localStorage.getItem(`${key}`);
    if (!storedData) return null;
    // const decryptedData = decrypt(storedData);
    // return JSON.parse(decryptedData) as T;
    return JSON.parse(storedData) as T;
};

/**
 * Updates the data stored in local storage for a given key by merging
 * the existing data with the new data provided. If no data is found
 * for the given key, the function does nothing.
 *
 * @param key Unique key to locate and update the stored data.
 * @param data New data to merge with the existing data.
 */
export const updateLocalStorage = <T>(key: string, data: T): void => {
    const storedData = getLocalStorage<T>(key);
    if (!storedData) return;
    
    const newState = { ...storedData, ...data };
    setLocalStorage(key, newState);
};

/**
 * Deletes the data stored in local storage for the specified key.
 *
 * @param key Unique key to identify the data to be removed.
 */
export const deleteLocalStorage = (key: string): void => {
    localStorage.removeItem(`${key}`);
};