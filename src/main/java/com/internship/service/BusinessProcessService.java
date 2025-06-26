package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.BusinessProcess;

import java.util.List;
import java.util.Map;

public interface BusinessProcessService {

    BusinessProcess createBusinessProcess(BusinessProcess businessProcess);

    BusinessProcess updateBusinessProcess(Long id, BusinessProcess businessProcess);

    void deleteBusinessProcess(Long id);

    BusinessProcess getBusinessProcessById(Long id);

    PageResponse<BusinessProcess> getBusinessProcesses(Integer page, Integer size, String processName, Integer category, Integer status);

    void changeBusinessProcessStatus(Long id, Integer status);

    Map<String, Object> getBusinessProcessStatistics();

    List<BusinessProcess> exportBusinessProcesses(Integer category, Integer status);
} 