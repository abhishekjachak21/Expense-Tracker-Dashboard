package com.expensetracker.transaction;

import com.expensetracker.transaction.dto.CreateTransactionRequest;
import com.expensetracker.transaction.dto.SummaryResponse;
import com.expensetracker.transaction.dto.TransactionResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public List<TransactionResponse> getTransactions(
            @RequestParam(defaultValue = "2026-09") String month) {
        return service.getByMonth(YearMonth.parse(month));
    }

    @GetMapping("/summary")
    public SummaryResponse getSummary(
            @RequestParam(defaultValue = "2026-09") String month) {
        return service.getSummary(YearMonth.parse(month));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse createTransaction(
            @Valid @RequestBody CreateTransactionRequest request) {
        return service.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(@PathVariable Long id) {
        service.delete(id);
    }
}
