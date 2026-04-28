package com.ghada.library.libraryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ghada.library.libraryModel.Book;
import com.ghada.library.libraryRepository.BookRepository;

import java.util.List;

@Service
//concrete implementation of book service -> decorator design pattern
public class BookServiceImpl implements BookService {
    
    @Autowired
    private BookRepository repo;


     @Override
    public List<Book> findAll(){ return repo.findAll(); }
     @Override
    public Book findById(String id){ return repo.findById(id).orElse(null); }
     @Override
    public Book create(Book b){ return repo.save(b); }
     @Override
    public Book update(String id, Book b){
        Book exist = repo.findById(id).orElse(null);
        if(exist == null) return null;
        exist.setTitle(b.getTitle());
        exist.setAuthor(b.getAuthor());
        exist.setIsbn(b.getIsbn());
        exist.setCopies(b.getCopies());
        exist.setImageUrl(b.getImageUrl());
        return repo.save(exist);
    }
     @Override
    public void delete(String id){ repo.deleteById(id); }

    public List<Book> searchByTitle(String q) {
    return repo.findByTitleContainingIgnoreCase(q);
}
    public List<Book> searchByAuthor(String q) {
    return repo.findByAuthorContainingIgnoreCase(q);
}
    public List<Book>searchByTitleAndAuthor(String q){
    return repo.searchBookByNameAndAuthor(q);
}
}

