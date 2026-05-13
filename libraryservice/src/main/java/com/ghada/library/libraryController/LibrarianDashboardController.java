package com.ghada.library.libraryController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ghada.library.libraryDTOs.LibrarianDashboardDTO;
import com.ghada.library.libraryService.ReportService;
import com.ghada.library.libraryService.adminService;

@RestController
//returns data for librarian dashboard
@RequestMapping("/librarian")
@PreAuthorize("hasRole('LIBRARIAN')")
public class LibrarianDashboardController {

    @Autowired
    adminService adminService;
    @Autowired
    ReportService service;

    @GetMapping("/dashboard")
    public LibrarianDashboardDTO getDashboard() {
        return new LibrarianDashboardDTO(
                service.countBooksIssuedToday(),
                service.countBooksReturnedToday(),
                service.countActiveBorrowers(),
                service.countPendingReturns(),
                service.countCurrentlyBorrowedBooks());
    }
}
// LibrarianDashboardController is a REST controller that handles requests related to the librarian dashboard. It provides an endpoint to retrieve data for the dashboard, including the number of books issued today, books returned today, active borrowers, pending returns, and currently borrowed books. The controller is secured with a role-based access control, allowing only users with the "LIBRARIAN" role to access its endpoints.