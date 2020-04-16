module.exports = {
  async feedBooks(user, { isbn10, isbn13 }) {
    return (isbn10 || isbn13
      ? isbn10
        ? user.feedBooks.filter((feedBook) => feedBook.isbn10 === isbn10)
        : user.feedBooks.filter((feedBook) => feedBook.isbn13 === isbn13)
      : user.feedBooks
    ).sort(
      (a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
    )
  },
}
