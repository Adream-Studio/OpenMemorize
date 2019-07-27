import { getCountList, setCountList } from '../services/api';
import { query as queryDicts } from "../models/dict";
import { query as queryWords } from '../models/word';

const genCountListItem = (dictId, callback) => {
  queryWords(dictId, words => {
    const data = [];

    words.forEach((_, index) => {
      data.push({
        id: index,
        count: 0,
      });
    });

    callback({
      dictId: dictId,
      data,
    });
  });
};

export function query(dictId, onSuccess) {
  getCountList().then(data => {
    if (data === null) {
      const countList = [];

      queryDicts(dicts => {
        dicts.forEach(dict => {
          genCountListItem(dict.id, listItem => {
            countList.push(listItem);

            setCountList(countList).catch(err => console.log(err));

            onSuccess(countList[dictId]);
          });
        });
      });
    } else if (!data.find(item => item.dictId===dictId)) {
      genCountListItem(dictId, listItem => {
        data.push(listItem);

        setCountList(data).catch(err => console.log(err));

        onSuccess(listItem);
      });
    } else {
      onSuccess(data.find(item => item.dictId===dictId));
    }
  }).catch(err => {
    console.log(err);
  })
}

export function update(listItem) {
  getCountList().then(data => {
    let countList;
    if (data === null) {
      countList = [];
      countList.push(listItem);
    } else {
      countList = data.map(item => {
        if (item.dictId === listItem.dictId) {
          return listItem;
        } else {
          return item;
        }
      });

      setCountList(countList).catch(err => console.log(err));
    }
  });
}
