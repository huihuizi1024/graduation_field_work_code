package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.PointTransaction;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

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
            
    @Select("SELECT * FROM point_transaction WHERE user_id = #{userId} ORDER BY create_time DESC")
    List<PointTransaction> findByUserIdOrderByCreateTimeDesc(@Param("userId") Long userId);

    /**
     * 根据用户ID和相关项目ID查询交易记录
     */
    List<PointTransaction> findByUserIdAndRelatedId(Long userId, String relatedId);
}
