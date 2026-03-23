package com.example.personalfinancechecking.service;

import org.springframework.stereotype.Service;
import com.example.personalfinancechecking.entity.Transaction;
import com.example.personalfinancechecking.repository.TransactionRepository;
import com.example.personalfinancechecking.entity.ApiResponse;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public ApiResponse getAllTransaction() throws Exception {
        try {
            List<Transaction> models = transactionRepository.findAll();
            return new ApiResponse(true, "Lấy thông tin thành công", models);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public ApiResponse addTransaction(Transaction transaction) throws Exception {
        try {
            // Validation
            if (transaction == null) {
                return new ApiResponse(false, "Transaction không được null", null);
            }
            if (transaction.getUserId() == null) {
                return new ApiResponse(false, "UserId không được để trống", null);
            }
            if (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return new ApiResponse(false, "Số tiền phải lớn hơn 0", null);
            }
            if (transaction.getTransactionDate() == null) {
                return new ApiResponse(false, "Ngày giao dịch không được để trống", null);
            }
            if (transaction.getCategoryId() == null) {
                return new ApiResponse(false, "CategoryId không được để trống", null);
            }
            if (transaction.getTransactionDate() == null) {
                return new ApiResponse(false, "Ngày giao dịch không được để trống", null);
            }
            transaction.setTransactionId(null);
            // Save vào database
            var savedTransaction = transactionRepository.save(transaction);
            return new ApiResponse(true, "Thêm giao dịch thành công", savedTransaction);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public ApiResponse getTransactionByUserId(Long id) {
        try {
            if (id == null || id <= 0) {
                return new ApiResponse(false, "ID UserUser không hợp lệ", null);
            }
            List<Transaction> transaction = transactionRepository.findByUserId(id);
            if (transaction.isEmpty()) {
                return new ApiResponse(false, "Không tìm thấy giao dịch với người dùng có ID: " + id, null);
            }
            return new ApiResponse(true, "Lấy thông tin giao dịch thành công", transaction);
        } catch (Exception e) {
            return new ApiResponse(false, "Lỗi khi lấy giao dịch: " + e.getMessage(), null);
        }
    }

    public ApiResponse getTransactionById(Long id) {
        try {
            if (id == null || id <= 0) {
                return new ApiResponse(false, "ID giao dịch không hợp lệ", null);
            }

            var transaction = transactionRepository.findById(id);
            if (transaction.isEmpty()) {
                return new ApiResponse(false, "Không tìm thấy giao dịch với ID: " + id, null);
            }
            return new ApiResponse(true, "Lấy thông tin giao dịch thành công", transaction.get());
        } catch (Exception e) {
            return new ApiResponse(false, "Lỗi khi lấy giao dịch: " + e.getMessage(), null);
        }
    }

    public ApiResponse updateTransaction(Long id, Transaction updatedTransaction) throws Exception {
        try {
            // Validation
            if (id == null || id <= 0) {
                return new ApiResponse(false, "ID giao dịch không hợp lệ", null);
            }
            if (updatedTransaction == null) {
                return new ApiResponse(false, "Dữ liệu giao dịch không được null", null);
            }
            if (updatedTransaction.getAmount() == null
                    || updatedTransaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return new ApiResponse(false, "Số tiền phải lớn hơn 0", null);
            }
            if (updatedTransaction.getTransactionDate() == null) {
                return new ApiResponse(false, "Ngày giao dịch không được để trống", null);
            }
            var optionalTransaction = transactionRepository.findById(id);
            if (optionalTransaction.isEmpty()) {
                return new ApiResponse(false, "Không tìm thấy giao dịch với ID: " + id, null);
            }

            Transaction existing = optionalTransaction.get();

            // Kiểm tra quyền sở hữu
            if (!existing.getUserId().equals(updatedTransaction.getUserId())) {
                return new ApiResponse(false, "Bạn không có quyền cập nhật giao dịch này", null);
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
            return new ApiResponse(true, "Cập nhật giao dịch thành công", savedTransaction);
        } catch (Exception e) {
            throw new Exception("Lỗi khi cập nhật giao dịch: " + e.getMessage());
        }
    }

    public ApiResponse deleteTransaction(Long id) {
        try {
            if (id == null || id <= 0) {
                return new ApiResponse(false, "ID giao dịch không hợp lệ", null);
            }

            var optionalTransaction = transactionRepository.findById(id);
            if (optionalTransaction.isEmpty()) {
                return new ApiResponse(false, "Không tìm thấy giao dịch với ID: " + id, null);
            }
            transactionRepository.deleteById(id);
            return new ApiResponse(true, "Xóa giao dịch thành công", null);
        } catch (Exception e) {
            return new ApiResponse(false, "Lỗi khi xóa giao dịch: " + e.getMessage(), null);
        }
    }

    public ApiResponse getTransactionsByMonth(Long userId, int year, int month) {
        try {
            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
            List<Transaction> models = transactionRepository.findByUserIdAndTransactionDateBetween(
                userId, start, end);
            return new ApiResponse(true, "Lấy giao dịch tháng " + month + "/" + year + " thành công", models);
        } catch (Exception e) {
            return new ApiResponse(false, "Lỗi: " + e.getMessage(), null);
        }
    }

}
