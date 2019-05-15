// index.js

import express from 'express'
const index = express.Router()

// model
import Category from '../models/Category.js'

index.get('/', async (req, res) => {
    const currentUser = req.user;

    let categoryList = await Category.findOne({}).catch(err => { console.log(err) });
    let categories = categoryList.entries;
    categories = categories.filter(element => {
        if (element == 'test') {
            return false
        } else {
            return true
        }
    })

    res.render('index', { currentUser, categories })
})

export default index;
