export const global: any;
declare global {

    class WordArray { 
        
        ciphertext: WordArray;

        toString(any: any): string;
    }

    namespace CryptoJS {

        namespace AES {
            export function encrypt(message: string, key: string, cfg: { iv: string, mode: mode, padding: pad }): WordArray;

            export function decrypt(text: any, key: string, cfg: { iv: string, mode: mode, padding: pad }): WordArray;
        }

        namespace enc {
            namespace Utf8 {
                export function parse(key: WordArray): string;
                export function stringify(word: WordArray): string;
            }
            class Hex {
                static parse(any: any): any
            }
        }

        export enum mode {
            CBC
        }

        export enum pad {
            Pkcs7
        }
    }
}