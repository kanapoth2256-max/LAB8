import fs from "fs";
import path from "path";

export type Book = {
  bookNo: number;
  bookName: string;
};

type DbShape = { books: Book[] };

const dbPath = path.join(process.cwd(), "data", "books.json");

// TODO 1: Implement readDb(): DbShape
// - If file not found: create data folder + books.json with { books: [] }
// - Read file text (utf-8) and JSON.parse
function readDb(): DbShape {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data) as DbShape;
  } catch (error) {
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const initialDb: DbShape = { books: [] };
    writeDb(initialDb);
    return initialDb;
  }
}

// TODO 2: Implement writeDb(db: DbShape)
// - JSON.stringify(db, null, 2) and writeFileSync utf-8
function writeDb(db: DbShape) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

export function readBooks(): Book[] {
  // TODO 3: return readDb().books
  return readDb().books;
}

export function addBook(bookName: string): Book {
  // TODO 4:
  // - read db
  // - find max bookNo
  // - create newBook { bookNo: max+1, bookName }
  // - push, write db
  // - return newBook
  if (!bookName || bookName.trim() === "") {
    throw new Error("Book name cannot be empty");
  }
  
  const db = readDb();
  const maxBookNo = db.books.reduce(
    (max, book) => (book.bookNo > max ? book.bookNo : max),
    0
  );
  
  const newBook: Book = {
    bookNo: maxBookNo + 1,
    bookName: bookName.trim()
  };
  
  db.books.push(newBook);
  writeDb(db);
  return newBook;
}

// Challenge 1: Delete book by bookNo
export function deleteBook(bookNo: number): boolean {
  const db = readDb();
  const initialLength = db.books.length;
  
  db.books = db.books.filter(book => book.bookNo !== bookNo);
  
  if (db.books.length !== initialLength) {
    writeDb(db);
    return true;
  }
  return false;
}

// Challenge 2: Search books by name (case-insensitive partial match)
export function searchBooks(query: string): Book[] {
  const db = readDb();
  
  if (!query || query.trim() === "") {
    return db.books;
  }
  
  const searchTerm = query.trim().toLowerCase();
  return db.books.filter(book => 
    book.bookName.toLowerCase().includes(searchTerm)
  );
}