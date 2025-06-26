package com.internship.dto;

import java.util.List;

public class PageResponse<T> {
    private Integer currentPage;
    private Integer pageSize;
    private Long totalRecords;
    private List<T> records;

    public PageResponse(Integer currentPage, Integer pageSize, Long totalRecords, List<T> records) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalRecords = totalRecords;
        this.records = records;
    }

    // Getters
    public Integer getCurrentPage() { return currentPage; }
    public Integer getPageSize() { return pageSize; }
    public Long getTotalRecords() { return totalRecords; }
    public List<T> getRecords() { return records; }

    // Setters
    public void setCurrentPage(Integer currentPage) { this.currentPage = currentPage; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }
    public void setTotalRecords(Long totalRecords) { this.totalRecords = totalRecords; }
    public void setRecords(List<T> records) { this.records = records; }
}
