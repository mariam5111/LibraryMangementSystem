package com.ghada.library.libraryController;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ghada.library.libraryDTOs.BorrowRequestDTO;
import com.ghada.library.libraryModel.Book;
import com.ghada.library.libraryModel.Borrow;
import com.ghada.library.libraryModel.RequestStatus;
import com.ghada.library.libraryService.BorrowService;
import com.ghada.library.libraryService.ReportService;
import com.ghada.library.Security.JwtService;

@RestController
@RequestMapping("/borrow")
public class BorrowController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BorrowService borrowService;

    @Autowired
    private ReportService reportService;


    //in list of borrowing users, approval, pending returns etc

    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping("/list")
    public List<Borrow> getAllBorrows() {
        return reportService.getAllBorrows();
    }

    //gets all pending requests for librarian to approve or reject
    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping("/getAllPendingRequests")
    public List<Borrow> getAllPendingRequests() {
        return reportService.getBorrowsByRequestStatus(RequestStatus.REQUESTED);
    }
     


    /*Getting all borrowed books */
    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping("/getAllBorrowedBooks")
    public List<Book> getAllBorrowedBooks() {
        return reportService.getAllBorrowedBooks();
    }

    // get borrow history per user
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/history/{id}")
    public List<Borrow> getBorrowByUserId(@PathVariable String id) {
        return reportService.getBorrowsByUserId(id);
    }

   
//approval and rejecton endpoints for librarian

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/approve/{borrowId}")
    public Borrow approveBorrowedBook(@PathVariable String borrowId) {
        return borrowService.approveBorrow(borrowId);
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/reject/{borrowId}")
    public Borrow rejectBorrowedBook(@PathVariable String borrowId) {
        return borrowService.rejectBorrow(borrowId);
    }

    //the borrow endpoint for user
     @PreAuthorize("hasRole('USER')")        
    @PostMapping("/request")
    public Borrow borrowBook(@RequestBody BorrowRequestDTO req, @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractId(token.substring(7));
        req.setUserId(userId);
        if (req.getBookId() == null || req.getBookId().isEmpty()) {
            throw new IllegalArgumentException("Book ID cannot be null or empty");
        }
        return borrowService.createBorrowRequest(req);
    }

    //the end points for returning and cancling
    @PreAuthorize("hasRole('USER')")  
    @PostMapping("/return/{borrowId}")
    public Borrow returnBorrowedBook(
            @PathVariable String borrowId,
            @RequestHeader("Authorization") String token) {

        String userId = jwtService.extractId(token.substring(7));
        return borrowService.returnBorrow(borrowId, userId);
    }
    @PreAuthorize("hasRole('USER')")  
    @PostMapping("/cancel/{borrowId}")
    public Borrow cancelBorrowedBook(
            @PathVariable String borrowId,
            @RequestHeader("Authorization") String token) {

        String userId = jwtService.extractId(token.substring(7));
        return borrowService.cancelBorrow(borrowId, userId);
    }
    
}
