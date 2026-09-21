package com.expensetracker.config;

import com.expensetracker.transaction.Transaction;
import com.expensetracker.transaction.TransactionRepository;
import com.expensetracker.transaction.TransactionType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedTransactions(TransactionRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            repository.save(new Transaction("Monthly salary", "Salary", new BigDecimal("60000"),
                    TransactionType.INCOME, LocalDate.of(2026, 9, 12)));
            repository.save(new Transaction("Weekend groceries", "Food", new BigDecimal("2450"),
                    TransactionType.EXPENSE, LocalDate.of(2026, 9, 11)));
            repository.save(new Transaction("Cab to office", "Transport", new BigDecimal("680"),
                    TransactionType.EXPENSE, LocalDate.of(2026, 9, 10)));
            repository.save(new Transaction("Movie night", "Entertainment", new BigDecimal("1200"),
                    TransactionType.EXPENSE, LocalDate.of(2026, 9, 8)));
            repository.save(new Transaction("Freelance work", "Other", new BigDecimal("8500"),
                    TransactionType.INCOME, LocalDate.of(2026, 9, 6)));
        };
    }
}
