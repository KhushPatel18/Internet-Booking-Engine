package com.kdu.ibe.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyConfigGetRequestDTO {
    @JsonProperty(value = "tenant_id")
    private Long tenantId;
    @JsonProperty(value = "property_name")
    private String propertyName;
}
