// TEST PAD PLEASE IGNORE

import _ from 'lodash'

const testFunction = () => {
    let object1 = {
        first: 'meow',
        second: 99,
        third: 0xDEADBEEF,
        fourth: 0xff
    }
    let object2 = {
        first: 'meow',
        second: 99,
        third: 0xDEADBEEF,
        fourth: 0xff
    }
    let object3 = {
        first: 'pow',
        second: 98,
        third: 0xDEADBEE,
        fourth: 0xee
    }

    let firstComparison = _.isEqual(object1, object2);
    let secondComparison = _.isEqual(object1, object3);
    console.log(`Lodash result should be true: ${firstComparison}`);
    console.log(`Lodash result should be false: ${secondComparison}`);
}

export default testFunction;
