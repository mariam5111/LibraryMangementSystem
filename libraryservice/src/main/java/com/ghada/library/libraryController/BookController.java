package com.ghada.library.libraryController;

import org.springframework.web.bind.annotation.*;

import com.ghada.library.libraryModel.Book;
import com.ghada.library.libraryService.BookServiceImpl;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/library/books")
public class BookController {
    private final BookServiceImpl service;
    public BookController(BookServiceImpl service){ this.service = service; }

    @GetMapping
    //Get all books, return a list of books, accessed and visible to all 
    public List<Book> getAll(){ return service.findAll(); }

    //get book by id
    @GetMapping("/{id}")
    public ResponseEntity<Book> getOne(@PathVariable String id){
        Book b = service.findById(id);
        return b == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(b);
    }

    //Create book available
    @PostMapping ("/add")
    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    public ResponseEntity<Book> create(@RequestBody Book book){
        Book saved = service.create(book);
        return ResponseEntity.status(201).body(saved);
    }
    //Update book 
    @PutMapping("/edit/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    public ResponseEntity<Book> update(@PathVariable String id, @RequestBody Book book){
        Book updated = service.update(id, book);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }
    //Delete Book
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN')")
    public ResponseEntity<Void> delete(@PathVariable String id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    //searching for books by either title or author in all dashboards
    @GetMapping("/search")
    public List<Book> searchByTitleAndAuthor(@RequestParam("q") String q) {
        return service.searchByTitleAndAuthor(q);
}
   


}

