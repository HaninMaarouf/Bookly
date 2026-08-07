import BookCard from "./BookCard";

function BookGrid() {
    const books = [
        {
            id: 1,
            title: "Atomic Habits",
            author: "James Clear",
            category: "Self Help",
            price: 15,
        },
        {
            id: 2,
            title: "The Alchemist",
            author: "Paulo Coelho",
            category: "Novel",
            price: 12,
        },
        {
            id: 3,
            title: "Rich Dad Poor Dad",
            author: "Robert Kiyosaki",
            category: "Finance",
            price: 18,
        },
    ];

    return (
        <div className="book-grid">
            {books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );
}

export default BookGrid;