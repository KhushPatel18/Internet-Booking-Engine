package com.kdu.ibe.dto.response;


import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PromoEmailResponseDTO {
    private Long subCount;
    private Long success;
    private List<String> failedEmails;
}
