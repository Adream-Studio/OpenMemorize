import {
    setSetting,
    getSetting,
} from '../services/api';

export function get(callback) {
    getSetting().then(data => {
        if (data === null) {
            data = {
                locale: '',
            };
        }

        callback(data);
    }).catch(err => {
        console.log(err);
    });
}

export function set({ setting, onSuccess }) {
    setSetting(setting).then(() => {
        onSuccess();
    }).catch(err => {
        console.log(err);
    });
}
