const getGoogleBookData = require('../util/getGoogleBookData')

module.exports = {
    async book(userReadBook) {
        return await getGoogleBookData(userReadBook.isbn)
    }
}