import express, { Request, Response } from "express";
import path from "path";
import { addBook, readBooks, deleteBook, searchBooks } from "./services/bookFileDb";

const app = express();
const PORT = process.env.PORT || 3000;

// TODO 5: Add middleware for HTML form + JSON + static files
// - app.use(express.urlencoded({ extended: true }));
// - app.use(express.json());
// - app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req: Request, res: Response) => {
  // TODO 6: Send public/index.html
  // Hint: res.sendFile(path.join(process.cwd(), "public", "index.html"));
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.get("/books", (req: Request, res: Response) => {
  // TODO 7: Return all books as JSON
  // Hint: const books = readBooks(); return res.json(books);
  const books = readBooks();
  return res.json(books);
});

app.post("/books/add", (req: Request, res: Response) => {
  try {
    // TODO 8: Read bookName from req.body.bookName and validate (trim it)
    // If empty -> return res.status(400).send("bookName is required");
    const bookName = req.body.bookName?.trim();
    
    if (!bookName) {
      return res.status(400).send("bookName is required");
    }

    // TODO 9: Call addBook(bookName)
    addBook(bookName);

    // TODO 10: Redirect to "/" after success
    // Hint: return res.redirect("/");
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// Challenge 1: Delete book 
app.post("/books/:bookNo/delete", (req: Request, res: Response) => {
  try {
    const bookNo = parseInt(req.params.bookNo);
    
    if (isNaN(bookNo)) {
      return res.status(400).json({ error: "Invalid book number" });
    }
    
    const deleted = deleteBook(bookNo);
    
    if (deleted) {
      return res.status(200).json({ message: "Book deleted successfully" });
    } else {
      return res.status(404).json({ error: "Book not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Challenge 2
app.get("/books/search", (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || "";
    const results = searchBooks(query);
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});