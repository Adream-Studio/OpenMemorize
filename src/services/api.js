import localForage from 'localforage';

export async function fetchWord() {
    return localForage.getItem('words');
}

export async function addWord(words) {
    return localForage.setItem('words', words);
}
