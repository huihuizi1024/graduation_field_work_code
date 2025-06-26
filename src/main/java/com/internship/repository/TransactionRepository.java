package com.internship.repository;

<<<<<<< HEAD
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.PointTransaction;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Mapper
public interface TransactionRepository extends BaseMapper<PointTransaction> {

    @Select("SELECT * FROM point_transaction WHERE user_id = #{userId} ORDER BY transaction_time DESC")
    void findByUserId(@Param("userId") Long userId, 
                    com.baomidou.mybatisplus.extension.plugins.pagination.Page<PointTransaction> page);

    @Select("SELECT * FROM point_transaction WHERE transaction_type = #{transactionType} ORDER BY transaction_time DESC")
    void findByTransactionType(@Param("transactionType") Integer transactionType, 
                             com.baomidou.mybatisplus.extension.plugins.pagination.Page<PointTransaction> page);

    @Select("SELECT * FROM point_transaction WHERE user_id = #{userId} AND transaction_type = #{transactionType} ORDER BY transaction_time DESC")
    void findByUserIdAndTransactionType(
            @Param("userId") Long userId, 
            @Param("transactionType") Integer transactionType,
            com.baomidou.mybatisplus.extension.plugins.pagination.Page<PointTransaction> page);
=======
import com.internship.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Transaction findByTransactionId(String transactionId);
    List<Transaction> findByUserId(String userId);
>>>>>>> ecb1823576adb48f04118c7cefec2dd94e3ef73e
}
