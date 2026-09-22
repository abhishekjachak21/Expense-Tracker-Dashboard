package com.expensetracker.transaction.dto;

import java.math.BigDecimal;

public record SummaryResponse(
        BigDecimal balance,
        BigDecimal income,
        BigDecimal expenses
) {
}