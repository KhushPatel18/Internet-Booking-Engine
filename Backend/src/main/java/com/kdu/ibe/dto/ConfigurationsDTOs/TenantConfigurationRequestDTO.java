package com.kdu.ibe.dto.ConfigurationsDTOs;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenantConfigurationRequestDTO {
    @NotEmpty
    private String tenantName;

    @NotEmpty
    private String tenantHeaderName;

    @NotEmpty
    private String tenantLogoFooter;

    @NotEmpty
    private String tenantLogoHeader;

    @NotEmpty
    private String tenantFooterCompanyText;

    @NotEmpty
    @Size(min = 1)
    private List<String> properties;

    @NotEmpty
    @Valid
    @Size(min = 1)
    private List<PropertyConfigurationDTO> configurationsByProperty;
}