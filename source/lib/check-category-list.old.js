// check-category-list.js

import Category from '../models/Category.js'

const checkCategoryList = async () => {
    const masterList = await Category.findOne({});
    if (!masterList) {
        console.log("No master category list found, initializing...");
        let newMasterList = new Category({ entries: [] });
        let result = await newMasterList.save().catch(err => { console.log(err) });
        console.log('New master list created!');
        console.log(result);
    } else {
        console.log('Master category list found!');
    }
}

export default checkCategoryList;
