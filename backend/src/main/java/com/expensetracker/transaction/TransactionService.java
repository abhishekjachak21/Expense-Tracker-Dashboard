package com.expensetracker.transaction;

import com.expensetracker.transaction.dto.CreateTransactionRequest;
import com.expensetracker.transaction.dto.SummaryResponse;
import com.expensetracker.transaction.dto.TransactionResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getByMonth(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();

        return repository.findByDateBetween(startDate, endDate).stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .map(TransactionResponse::from)
                .toList();
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {
        Transaction transaction = new Transaction(
                request.description().trim(),
                request.category(),
                request.amount(),
                request.type(),
                request.date()
        );
        return TransactionResponse.from(repository.save(transaction));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new TransactionNotFoundException(id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public SummaryResponse getSummary(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();

        List<Transaction> transactions = repository.findByDateBetween(startDate, endDate);

        BigDecimal income = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expenses = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new SummaryResponse(income.subtract(expenses), income, expenses);
    }
}
