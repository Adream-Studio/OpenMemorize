import localForage from 'localforage';
import { saveAs } from 'file-saver';

export async function fetchWord(dictId) {
    return localForage.getItem(dictId);
}

export async function updateWord(dictId, words) {
    return localForage.setItem(dictId, words);
}

export async function fetchDict() {
    return localForage.getItem('dicts');
}

export async function updateDict(dicts) {
    return localForage.setItem('dicts', dicts);
}

export async function removeDict(dictId) {
    return localForage.removeItem(dictId);
}

export async function setCurrentDict(dict) {
    return localForage.setItem('current', dict);
}

export async function getCurrentDict() {
    return localForage.getItem('current');
}

export async function getSetting() {
    return localForage.getItem('setting');
}

export async function setSetting(setting) {
    return localForage.setItem('setting', setting);
}

export async function getCountList() {
    return localForage.getItem('countList');
}

export async function setCountList(list) {
    return localForage.setItem('countList', list);
}

export function save({ name, content }) {
    const blob = new Blob([content], {type: "text/json;charset=utf-8"});
    return saveAs(blob, name);
}
