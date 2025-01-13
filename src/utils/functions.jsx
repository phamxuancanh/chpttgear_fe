/* GLOBAL FUNCTIONS
   ========================================================================== */

/**
 * Reload current browser link
 */
export const reload = () => {
    window.location.reload();
};

/**
 * Safely parse JSON format
 * @param {string | null} jsonString input json string
 * @returns {any} data in JSON format or null
 */
export const parseJSON = (jsonString) => {
    try {
        return jsonString === 'undefined' ? null : JSON.parse(jsonString ?? '');
    } catch (error) {
        console.log('Parsing error on ', { jsonString });
        return null;
    }
};

/**
 * Get value from Session Storage by key
 * @param {string} key to get value from Session Storage
 * @returns {any} JSON data
 */
export const getFromSessionStorage = (key) => {
    const value = window.sessionStorage.getItem(key);
    if (value != null) {
        return parseJSON(value);
    }
    return null;
};

/**
 * Get value from Local Storage by key
 * @param {string} key to get value from Local Storage
 * @returns {any} JSON data
 */
export const getFromLocalStorage = (key) => {
    const value = window.localStorage.getItem(key);
    if (value != null) {
        return parseJSON(value);
    }
    return null;
};

/**
 * Set value to Local Storage by key
 * @param {string} key
 * @param {string} value
 */
export const setToLocalStorage = (key, value) => {
    return window.localStorage.setItem(key, value);
};

export const removeLocalStorage = (key) => {
    return window.localStorage.removeItem(key);
};

export const removeAllLocalStorage = () => {
    return window.localStorage.clear();
};

/**
 * Convert Date to a formatted string
 * @param {Date | string} originalDateTime
 * @param {boolean} [withoutTime]
 * @returns {string} formatted date string
 */
export const convertDate = (originalDateTime, withoutTime) => {
    let arr = originalDateTime instanceof Date
        ? originalDateTime.toISOString().split(':')
        : originalDateTime.split(':');
    let date = arr[0];
    if (arr[1]) date = arr[0] + ':' + arr[1];
    if (withoutTime) {
        date = date.split('T')[0];
    }
    return date;
};

/**
 * Generate a random integer between min and max
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate an array of random integers
 * @param {number} length
 * @param {number} min
 * @param {number} max
 * @returns {number[]}
 */
export function generateRandomIntArray(length, min, max) {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
        randomArray.push(getRandomInt(min, max));
    }
    return randomArray;
}

/**
 * Generate a random float between min and max
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generate an array of random floats
 * @param {number} length
 * @param {number} min
 * @param {number} max
 * @param {number} decimalPlaces
 * @returns {number[]}
 */
export function generateRandomFloatArray(length, min, max, decimalPlaces) {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
        randomArray.push(parseFloat(getRandomFloat(min, max).toFixed(decimalPlaces)));
    }
    return randomArray;
}

/**
 * Convert a dataset into a summarized format
 * @param {any[]} dataset
 * @param {string} keyField
 * @param {string} dataField
 * @param {'avg' | 'sum' | 'count'} [typeCal='sum']
 * @returns {{index: number, key: any, value: number}[]}
 */
export function convertDataset(dataset, keyField, dataField, typeCal = 'sum') {
    const result = [];
    const tempDataset = [...dataset];
    const keySet = new Set();
    for (const data of tempDataset) {
        keySet.add(data[keyField]);
    }
    const keyArray = Array.from(keySet);
    for (const key of keyArray) {
        const tempData = tempDataset.filter((data) => data[keyField] === key);
        let index = keyArray.indexOf(key);
        let value = 0;
        switch (typeCal) {
            case 'avg':
                value = tempData.reduce((pre, cur) => pre + cur[dataField], 0) / tempData.length;
                break;
            case 'sum':
                value = tempData.reduce((pre, cur) => pre + cur[dataField], 0);
                break;
            case 'count':
                value = tempData.length;
                break;
            default:
                break;
        }
        result.push({ index, key, value });
    }
    return result;
}

/**
 * Calculate data summary for given fields
 * @param {any} data
 * @param {string} keyField
 * @param {string[]} dataFields
 * @param {'avg' | 'sum' | 'count'} [typeCal='sum']
 * @returns {{index: number, key: any, value: number}}
 */
export function calculateData(data, keyField, dataFields, typeCal = 'sum') {
    let result;
    let value = 0;
    if (typeCal === 'avg') {
        value = dataFields.reduce((pre, cur) => pre + data[cur], 0) / dataFields.length;
    }
    if (typeCal === 'sum') {
        value = dataFields.reduce((pre, cur) => pre + data[cur], 0);
    }
    if (typeCal === 'count') {
        value = dataFields.length;
    }
    result = { index: 0, key: data[keyField], value };
    return result;
}

/**
 * Filter dataset by a field value
 * @param {any[]} dataset
 * @param {string} field
 * @param {any} value
 * @returns {any[]}
 */
export function filterByField(dataset, field, value) {
    return dataset.filter((data) => data[field] === value);
}

/**
 * Filter dataset by multiple fields and values
 * @param {any[]} dataset
 * @param {string[]} fields
 * @param {any[]} value
 * @returns {any[]}
 */
export function filterByFields(dataset, fields, value) {
    return dataset.filter((data) => {
        let result = true;
        for (let i = 0; i < fields.length; i++) {
            if (data[fields[i]] !== value[i]) {
                result = false;
                break;
            }
        }
        return result;
    });
}
