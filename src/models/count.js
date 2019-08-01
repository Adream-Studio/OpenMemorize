import { getCountList, setCountList } from '../services/api';
import { query as queryDicts } from "../models/dict";
import { query as queryWords } from '../models/word';

const genCountListItem = (dictId, callback) => {
  queryWords(dictId, words => {
    const data = [];

    words.forEach((word) => {
      data.push({
        word: word.text,
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
    if (!data) {
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
    } else {
      const dictCountList = data.find(item => item.dictId===dictId);
      queryWords(dictId, words => {
        if (!dictCountList || dictCountList.data.length < words.length) {
          genCountListItem(dictId, listItem => {
            const existListItem = data.find(item => item.dictId === listItem.dictId);

            if (existListItem) {
              existListItem.data.push({
                word: words.slice(-1)[0].text,
                count: 0,
              });

              data = data.map(item => {
                if (item.dictId === existListItem.dictId) {
                  return existListItem;
                } else {
                  return item;
                }
              });
            } else {
              data.push(listItem);
            }
    
            setCountList(data).catch(err => console.log(err));
    
            onSuccess(listItem);
          });
        } else {
          onSuccess(dictCountList);
        }
      });
    }
  }).catch(err => {
    console.log(err);
  })
}

export function remove(dictId, text) {
  getCountList().then(data => {
    if (data && data.length > 0) {
      setCountList(data.map(dictCountList => {
        if (dictCountList.dictId===dictId) {
          return {
            dictId,
            data: dictCountList.data.filter(item => item.word!==text)
          };
        } else {
          return dictCountList;
        }
      })).catch(err => console.log(err));
    }
  });
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
