export * from "./toDisplayString";

export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const isString = (value) => {
  return typeof value === "string";
};

export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal);
};

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);

const capitalize = (event) => event.charAt(0).toUpperCase() + event.slice(1);

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};

export const toHandlerKey = (str) => (str ? "on" + capitalize(str) : "");
