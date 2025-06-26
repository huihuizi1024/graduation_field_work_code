package com.internship.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@TableName("platform_activity")
@Schema(description = "平台活动实体")
public class PlatformActivity {

    @TableId(type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Long id;

    @NotBlank(message = "活动名称不能为空")
    @Schema(description = "活动名称")
    private String activityName;

    @NotBlank(message = "活动编码不能为空")
    @Schema(description = "活动编码")
    private String activityCode;

    @Schema(description = "活动描述")
    private String activityDescription;

    @Schema(description = "活动类型：1-线上活动，2-线下活动，3-混合活动")
    private Integer activityType;

    @NotNull(message = "活动开始时间不能为空")
    @Schema(description = "活动开始时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    @NotNull(message = "活动结束时间不能为空")
    @Schema(description = "活动结束时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    @Schema(description = "活动地点")
    private String location;

    @Schema(description = "组织者")
    private String organizer;

    @Schema(description = "联系人")
    private String contactPerson;

    @Schema(description = "联系电话")
    private String contactPhone;

    @Schema(description = "奖励积分")
    private Double rewardPoints;

    @NotNull(message = "状态不能为空")
    @Schema(description = "状态：1-进行中，0-已结束，2-已取消")
    private Integer status;

    @Schema(description = "创建人ID")
    private Long creatorId;

    @Schema(description = "创建人姓名")
    private String creatorName;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
