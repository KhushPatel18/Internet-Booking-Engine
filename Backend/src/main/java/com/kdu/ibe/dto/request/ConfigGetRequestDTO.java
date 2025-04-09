package com.kdu.ibe.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NonNull;

@Data
public class ConfigGetRequestDTO {
    @JsonProperty(value = "tenant_id")
    @NonNull
    private Long tenantId;
}
