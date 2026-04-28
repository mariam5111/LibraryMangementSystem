package com.ghada.library.libraryController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import com.ghada.library.libraryDTOs.AdminDashboardDTO;
import com.ghada.library.libraryModel.BorrowStatus;
import com.ghada.library.libraryModel.RequestStatus;
import com.ghada.library.libraryModel.User;
import com.ghada.library.libraryService.ReportService;
import com.ghada.library.libraryService.adminService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/library/adminDashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private adminService adminService;
    @Autowired
    private ReportService reportService;

    @GetMapping
    public AdminDashboardDTO getDashboard(){
        return new AdminDashboardDTO(
            adminService.countTotalUsers(null),
            reportService.countTotalBooks(),
            reportService.countCurrentlyBorrowedBooks(),
            reportService.countBorrowsByStatus(BorrowStatus.LATE),
            reportService.countRequestByStatus(RequestStatus.REQUESTED)

        );
    }
    //list of all users for admin to manage
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }
    //user search
    @GetMapping("users/search")
    public List<User> searchByUsername(@RequestParam String name){
        return adminService.searchByUsername(name);
    }
    //update username and user role in edit user
    @PutMapping("users/{id}/username")
    public User updateUsername(@PathVariable String id, @RequestBody String name){
        return adminService.updateName(id, name);
    }
    @PutMapping("/users/{id}/roles")
    public User updateRoles(
            @PathVariable String id,
            @RequestBody List<String> roles
    ) {
        return adminService.updateRoles(id, roles);
    }
    //might delete or replace with deactivation
    @DeleteMapping("/users/{id}")
    public void delete(@PathVariable String id) {
        adminService.deleteUser(id);
    }

}
