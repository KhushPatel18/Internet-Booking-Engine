package com.kdu.ibe.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdu.ibe.dto.ConfigurationsDTOs.TenantConfigurationRequestDTO;
import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ConfigConverter implements AttributeConverter<TenantConfigurationRequestDTO, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(TenantConfigurationRequestDTO config) {
        try {
            return objectMapper.writeValueAsString(config);
        } catch (JsonProcessingException e) {
            throw new UnprocessableEntityException("Error converting Config to JSON");
        }
    }

    @Override
    public TenantConfigurationRequestDTO convertToEntityAttribute(String json) {
        try {
            return objectMapper.readValue(json, TenantConfigurationRequestDTO.class);
        } catch (JsonProcessingException e) {
            throw new UnprocessableEntityException("Error converting JSON to Config");
        }
    }
}
