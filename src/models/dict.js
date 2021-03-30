import {
  fetchDict,
  updateDict,
  removeDict,
  setCurrentDict,
  getCurrentDict,
  save as saveAs,
} from '../services/api';

export function query(callback) {
  fetchDict().then(data => {
    if (data === null) {
      data = [];
    }

    callback(data);
  }).catch(err => {
    console.log(err);
  })
}

export function add({ dicts, onSuccess }) {
  updateDict(dicts).then(() => {
    onSuccess();
  }).catch(err => {
    console.log(err);
  });
}

export function rename({ dicts, onSuccess }) {
  updateDict(dicts).then(() => {
    onSuccess();
  }).catch(err => {
    console.log(err);
  });
}

export function remove({ dicts, dictId, onSuccess }) {
  updateDict(dicts).then(() => {
    removeDict(dictId).then(() => {
      onSuccess();
    }).catch(err => {
      console.log(err);
    });
  }).catch(err => {
    console.log(err);
  });
}

export function setCurrent({ dict, onSuccess }) {
  setCurrentDict(dict).then(() => {
    onSuccess();
  }).catch(err => {
    console.log(err);
  });
}

export function getCurrent(onSuccess) {
  getCurrentDict().then(data => {
    onSuccess(data);
  });
}

export function save(dict) {
  return saveAs(dict);
}
