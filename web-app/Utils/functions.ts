import { DIFF_VALUE } from './enums';

// Ref: https://stackoverflow.com/questions/8572826/generic-deep-diff-between-two-objects
export var deepDiffMapper = (function () {
  return {
    map: function (obj1, obj2) {
      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw 'Invalid argument. Function given, object expected.';
      }
      if (this.isValue(obj1) || this.isValue(obj2)) {
        const type = this.compareValues(obj1, obj2);
        return {
          type,
          data:
            type === DIFF_VALUE.VALUE_UPDATED
              ? obj2
              : obj1 === undefined
              ? obj2
              : obj1,
        };
      }

      var diff = {};
      for (var key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }

        var value2 = undefined;
        if (obj2[key] !== undefined) {
          value2 = obj2[key];
        }

        diff[key] = this.map(obj1[key], value2);
      }
      for (var key in obj2) {
        if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
          continue;
        }

        diff[key] = this.map(undefined, obj2[key]);
      }

      return diff;
    },
    compareValues: function (value1, value2) {
      if (value1 === value2) {
        return DIFF_VALUE.VALUE_UNCHANGED;
      }
      if (
        this.isDate(value1) &&
        this.isDate(value2) &&
        value1.getTime() === value2.getTime()
      ) {
        return DIFF_VALUE.VALUE_UNCHANGED;
      }
      if (value1 === undefined) {
        return DIFF_VALUE.VALUE_CREATED;
      }
      if (value2 === undefined) {
        return DIFF_VALUE.VALUE_DELETED;
      }
      return DIFF_VALUE.VALUE_UPDATED;
    },
    isFunction: function (x) {
      return (
        Object.prototype.toString.call(x) === '[object Function]'
      );
    },
    isArray: function (x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    },
    isDate: function (x) {
      return Object.prototype.toString.call(x) === '[object Date]';
    },
    isObject: function (x) {
      return Object.prototype.toString.call(x) === '[object Object]';
    },
    isValue: function (x) {
      return !this.isObject(x) && !this.isArray(x);
    },
  };
})();
