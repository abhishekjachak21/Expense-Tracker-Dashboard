package com.expensetracker.transaction.dto;

import com.expensetracker.transaction.Transaction;
import com.expensetracker.transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        String description,
        String category,
        BigDecimal amount,
        TransactionType type,
        LocalDate date
) {
    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getDate()
        );
    }
}
