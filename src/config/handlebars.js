const { engine } = require('express-handlebars');

const hbs = engine({
    extname: '.handlebars',
    defaultLayout: 'main', 
    helpers: {
        selectedSort: function (value, options) {
            return (options.data.root.sort === value) ? 'selected' : '';
        }
    }
});

module.exports = hbs;