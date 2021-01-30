import { isEmpty } from 'lodash';

function undefOrValue<A>(value: A) {
  return isEmpty(value) ? undefined : value;
}

export { undefOrValue };
