/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    function getValue(obj, field) {
        const fieldArr = Array.isArray(field) ? field : field.split('.');
        const newObj = obj[fieldArr[0]];

        if (newObj && fieldArr.length > 1) {
            return getValue(newObj, fieldArr.slice(1));
        }

        return newObj;
    }
    return function (item) {
        return getValue(item, path);
    };
}
