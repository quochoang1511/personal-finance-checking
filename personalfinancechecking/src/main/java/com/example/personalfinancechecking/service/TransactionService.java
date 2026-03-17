package com.example.personalfinancechecking.service;

import org.springframework.stereotype.Service;
import com.example.personalfinancechecking.entity.Transaction;
import com.example.personalfinancechecking.repository.TransactionRepository;
import com.example.personalfinancechecking.entity.APIResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public APIResponse getAllTransaction() throws Exception {
        try {
            List<Transaction> models = transactionRepository.findAll();
            return new APIResponse(true, "Lấy thông tin thành công", models);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public APIResponse addTransaction(Transaction transaction) throws Exception {
        try {
            // Validation
            if (transaction == null) {
                return new APIResponse(false, "Transaction không được null", null);
            }
            if (transaction.getUserId() == null) {
                return new APIResponse(false, "UserId không được để trống", null);
            }
            if (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return new APIResponse(false, "Số tiền phải lớn hơn 0", null);
            }
            if (transaction.getTransactionDate() == null) {
                return new APIResponse(false, "Ngày giao dịch không được để trống", null);
            }
            if (transaction.getCategoryId() == null) {
                return new APIResponse(false, "CategoryId không được để trống", null);
            }
            if (transaction.getTransactionDate() == null) {
                return new APIResponse(false, "Ngày giao dịch không được để trống", null);
            }
            transaction.setTransactionId(null);
            // Save vào database
            var savedTransaction = transactionRepository.save(transaction);
            return new APIResponse(true, "Thêm giao dịch thành công", savedTransaction);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public APIResponse getTransactionById(Long id) {
        try {
            if (id == null || id <= 0) {
                return new APIResponse(false, "ID giao dịch không hợp lệ", null);
            }

            var transaction = transactionRepository.findById(id);
            if (transaction.isEmpty()) {
                return new APIResponse(false, "Không tìm thấy giao dịch với ID: " + id, null);
            }
            return new APIResponse(true, "Lấy thông tin giao dịch thành công", transaction.get());
        } catch (Exception e) {
            return new APIResponse(false, "Lỗi khi lấy giao dịch: " + e.getMessage(), null);
        }
    }

    public APIResponse updateCategory(Long id, Transaction updatedTransaction) throws Exception {
        try {
            // Validation
            if (id == null || id <= 0) {
                return new APIResponse(false, "ID giao dịch không hợp lệ", null);
            }
            if (updatedTransaction == null) {
                return new APIResponse(false, "Dữ liệu giao dịch không được null", null);
            }
            if (updatedTransaction.getAmount() == null
                    || updatedTransaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return new APIResponse(false, "Số tiền phải lớn hơn 0", null);
            }
            if (updatedTransaction.getTransactionDate() == null) {
                return new APIResponse(false, "Ngày giao dịch không được để trống", null);
            }
            var optionalTransaction = transactionRepository.findById(id);
            if (optionalTransaction.isEmpty()) {
                return new APIResponse(false, "Không tìm thấy giao dịch với ID: " + id, null);
            }

            Transaction existing = optionalTransaction.get();

            // Kiểm tra quyền sở hữu
            if (!existing.getUserId().equals(updatedTransaction.getUserId())) {
                return new APIResponse(false, "Bạn không có quyền cập nhật giao dịch này", null);
            }
            // Cập nhật các trường cho phép thay đổi
            existing.setAmount(updatedTransaction.getAmount());
            existing.setDescription(updatedTransaction.getDescription() != null
                    ? updatedTransaction.getDescription().trim()
                    : null);
            existing.setTransactionDate(updatedTransaction.getTransactionDate());
            existing.setCategoryId(updatedTransaction.getCategoryId());

            // Lưu lại
            var savedTransaction = transactionRepository.save(existing);
            return new APIResponse(true, "Cập nhật giao dịch thành công", savedTransaction);
        } catch (Exception e) {
            throw new Exception("Lỗi khi cập nhật giao dịch: " + e.getMessage());
        }
    }

    public APIResponse deleteTransaction(Long id) {
        try {
            if (id == null || id <= 0) {
                return new APIResponse(false, "ID giao dịch không hợp lệ", null);
            }

            var optionalTransaction = transactionRepository.findById(id);
            if (optionalTransaction.isEmpty()) {
                return new APIResponse(false, "Không tìm thấy giao dịch với ID: " + id, null);
            }
            transactionRepository.deleteById(id);
            return new APIResponse(true, "Xóa giao dịch thành công", null);
        } catch (Exception e) {
            return new APIResponse(false, "Lỗi khi xóa giao dịch: " + e.getMessage(), null);
        }
    }

    public APIResponse getTransactionsByMonth(Long userId, int year, int month) {
        try {
            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
            List<Transaction> models = transactionRepository.findByUserIdAndTransactionDateBetween(
                userId, start, end);
            return new APIResponse(true, "Lấy giao dịch tháng " + month + "/" + year + " thành công", models);
        } catch (Exception e) {
            return new APIResponse(false, "Lỗi: " + e.getMessage(), null);
        }
    }

}
