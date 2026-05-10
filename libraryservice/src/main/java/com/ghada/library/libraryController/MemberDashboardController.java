package com.ghada.library.libraryController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ghada.library.Security.JwtService;
import com.ghada.library.libraryDTOs.MemberDashboardDTO;
import com.ghada.library.libraryService.ReportService;

@RestController
@PreAuthorize("hasRole('USER')")
//returns data for member dashbaord
@RequestMapping("/member")
public class MemberDashboardController {

    @Autowired
    private ReportService reportService;
    @Autowired
    private JwtService jwtService;

    @GetMapping("/dashboard")
    public MemberDashboardDTO getDashboard(@RequestHeader("Authorization") String authHeader) {
        
        String id = jwtService.extractId(authHeader.substring(7));
       
        return new MemberDashboardDTO(
            reportService.countActiveBorrowForUser(id),
        reportService.countOverdueForUser(id),
           reportService.countHistoryForUser(id)
        );
    }
}
 