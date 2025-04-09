package com.kdu.ibe.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConfigGetResponseDTO {
    @JsonProperty(value = "tenant_id")
    private Long tenantId;
    private JsonNode configurations;
}
