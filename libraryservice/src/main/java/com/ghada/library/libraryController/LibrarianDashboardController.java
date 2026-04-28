package com.ghada.library.libraryController;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestMapping;
import com.ghada.library.libraryDTOs.LibrarianDashboardDTO;
import com.ghada.library.libraryService.ReportService;
import com.ghada.library.libraryService.adminService;

@RestController
//returns data for librarian dashboard
@RequestMapping("/library/librarianDashboard")
@PreAuthorize("hasRole('LIBRARIAN')")
public class LibrarianDashboardController {

    @Autowired
    adminService adminService;
    @Autowired
    ReportService service;

    @GetMapping
    public LibrarianDashboardDTO getDashboard() {
        return new LibrarianDashboardDTO(
                service.countBooksIssuedToday(),
                service.countBooksReturnedToday(),
                service.countActiveBorrowers(),
                service.countPendingReturns(),
                service.countCurrentlyBorrowedBooks());
    }
}
