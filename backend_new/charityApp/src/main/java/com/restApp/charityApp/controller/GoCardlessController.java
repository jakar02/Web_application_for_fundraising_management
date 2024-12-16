package com.restApp.charityApp.controller;

import com.restApp.charityApp.service.GoCardlessService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
public class GoCardlessController {

    private final GoCardlessService goCardlessService;

    public GoCardlessController(GoCardlessService goCardlessService) {
        this.goCardlessService = goCardlessService;
    }

    @GetMapping("/account/{accountId}/transactions")
    public String getAccountTransactions(@PathVariable String accountId) {
        try {
            LocalDateTime lastFetchDate = goCardlessService.getLastFetchDate();
            if (!goCardlessService.isFetchDateOlderThan6Hours(lastFetchDate))
            {
                System.out.println("Fetching skipped, data is still fresh");
                return "Fetching skipped, data is still fresh";
            }
            return goCardlessService.getAccountTransactions(accountId);
        } catch (IOException e) {
            return "Error fetching transactions: " + e.getMessage();
        }
    }
}
