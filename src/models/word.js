import { fetchWord, updateWord, } from '../services/api';

export function query(dictId, callback) {
  fetchWord(dictId).then(data => {
    if (data === null) {
      data = [];
    }

    callback(data);
  }).catch(err => {
    console.log(err);
  })
}

export function add({ dictId, words, onSuccess }) {
  updateWord(dictId, words).then(() => {
    onSuccess();
  }).catch(err => {
    console.log(err);
  });
}

export function update({ dictId, words, onSuccess }) {
  updateWord(dictId, words).then(() => {
    onSuccess();
  }).catch(err => {
    console.log(err);
  });
}

export function remove({ dictId, words, onSuccess }) {
  updateWord(dictId, words).then(() => {
    onSuccess();
  }).catch(err => {
    console.log(err);
  })
}
