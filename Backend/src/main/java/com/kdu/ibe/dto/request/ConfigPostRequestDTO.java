package com.kdu.ibe.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Data;


@Data
public class ConfigPostRequestDTO {
    @JsonProperty(value = "configurations")
    private JsonNode configurations;
}
