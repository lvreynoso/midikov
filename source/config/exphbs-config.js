// helpers.js

let exphbsConfig = {
    defaultLayout: 'main',
    helpers: {
        // helpers go here
        categoryGenerator: function(context) {
            // console.log(context);
            // console.log(context.data.root.categories);
            let elements = context.data.root.categories;
            let output = '';
            if (elements.length > 0) {
                elements.forEach( (element, index) => {
                    output += `<a href="#" name="category" id="category${index}">${element}</a>`
                });
            }
            return output;
        }
    }
}


export default exphbsConfig;
