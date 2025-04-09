package com.kdu.ibe.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kdu.ibe.util.DateStringFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmailRequestDTO {
    @NotNull
    @Email
    private String email;
    private String type;
    private String customerName;
    private String companyName;
    private Boolean isScheduled;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @DateStringFormat
    private String scheduledTime;

}

