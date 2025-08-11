// src/services/encryption.ts

/**
 * Encrypts the given string using the btoa function, and replaces the
 * characters '+', '/', and '=' with '-', '_', and '', respectively.
 *
 * @param data - The string to encrypt.
 * @returns The encrypted string.
 */
export const encrypt = (data: string): string => {
    return btoa(data).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Decrypts the given string using the atob function, and replaces the
 * characters '-', '_', and '' with '+', '/', and '=', respectively.
 *
 * @param data - The string to decrypt.
 * @returns The decrypted string.
 */
export const decrypt = (data: string): string => {
    return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
}