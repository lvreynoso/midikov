// Category.js
// just a list of categories


import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    entries: [String]
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
