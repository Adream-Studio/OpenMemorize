import { fetchWord, addWord, } from '../services/api';

export function query(callback) {
    fetchWord().then(data => {
        if (data === null) {
            data = [];
        }

        callback(data);
    }).catch(err => {
        console.log(err);
    })
}

export function add(params) {
    const {
        words,
        onSuccess,
    } = params;

    addWord(words).then(data => {
        console.log(data);
        onSuccess();
    }).catch(err => {
        console.log(err);
    });
}
