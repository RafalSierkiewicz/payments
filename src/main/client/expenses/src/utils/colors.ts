import * as _ from 'lodash';

const randomBetween = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const getRandomColor = (values: number[]) => {
  return _.map(values, (el: number) => {
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    return { background: `rgba(${r}, ${g}, ${b}, 0.2)`, border: `rgba(${r}, ${g}, ${b}, 1)` };
  });
};

export { getRandomColor };
