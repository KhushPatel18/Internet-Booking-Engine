package com.kdu.ibe.controller;

import com.kdu.ibe.dto.ConfigurationsDTOs.PropertyConfigurationDTO;
import com.kdu.ibe.dto.ConfigurationsDTOs.TenantConfigurationRequestDTO;
import com.kdu.ibe.dto.ConfigurationsDTOs.TenantResponseConfigurationDTO;
import com.kdu.ibe.dto.request.ConfigGetRequestDTO;
import com.kdu.ibe.dto.request.ConfigPutRequestDTO;
import com.kdu.ibe.dto.request.PropertyConfigGetRequestDTO;
import com.kdu.ibe.dto.response.ConfigGetResponseDTO;
import com.kdu.ibe.service.ConfigurationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Controller class for handling configuration-related endpoints.
 */
@RestController
@RequestMapping("/api/v1/config")
public class ConfigurationController {

    private final ConfigurationService configurationService;

    /**
     * Constructor for ConfigurationController.
     * @param configurationService The ConfigurationService instance to be injected.
     */
    public ConfigurationController(ConfigurationService configurationService) {
        this.configurationService = configurationService;
    }

    /**
     * Endpoint for retrieving configuration by tenant ID.
     * @param tenantId The ID of the tenant.
     * @return ResponseEntity with the tenant configuration.
     */
    @GetMapping("/{tenantId}")
    public ResponseEntity<TenantResponseConfigurationDTO> getConfiguration(@PathVariable @Valid Long tenantId) {
        return new ResponseEntity<>(configurationService.getConfiguration(tenantId), HttpStatus.OK);
    }

    /**
     * Endpoint for retrieving configuration by property name.
     * @param propertyConfigGetRequestDTO The PropertyConfigGetRequestDTO containing property name.
     * @return ResponseEntity with the property configuration.
     */
    @PostMapping("/propertyConfig")
    public ResponseEntity<PropertyConfigurationDTO> getConfigurationByPropertyName(@RequestBody @Valid PropertyConfigGetRequestDTO propertyConfigGetRequestDTO) {
        return new ResponseEntity<>(configurationService.getPropertyConfig(propertyConfigGetRequestDTO), HttpStatus.OK);
    }

    /**
     * Endpoint for creating a new configuration.
     * @param tenantConfigurationRequestDTO The TenantConfigurationRequestDTO containing configuration information.
     * @return ResponseEntity with the created configuration.
     */
    @PostMapping
    public ResponseEntity<TenantResponseConfigurationDTO> postConfiguration(@RequestBody @Valid TenantConfigurationRequestDTO tenantConfigurationRequestDTO) {
        return new ResponseEntity<>(configurationService.postConfiguration(tenantConfigurationRequestDTO), HttpStatus.OK);
    }

    /**
     * Endpoint for updating an existing configuration.
     * @param tenantPutRequestConfigurationDTO The TenantResponseConfigurationDTO containing updated configuration.
     * @return ResponseEntity with the updated configuration.
     */
    @PutMapping
    public ResponseEntity<TenantResponseConfigurationDTO> putConfiguration(@RequestBody @Valid TenantResponseConfigurationDTO tenantPutRequestConfigurationDTO) {
        return new ResponseEntity<>(configurationService.putConfiguration(tenantPutRequestConfigurationDTO), HttpStatus.OK);
    }

    /**
     * Endpoint for removing a configuration.
     * @param configGetRequestDTO The ConfigGetRequestDTO containing tenant ID.
     * @return ResponseEntity with the result message.
     */
    @DeleteMapping
    public ResponseEntity<String> removeConfiguration(@RequestBody @Valid ConfigGetRequestDTO configGetRequestDTO) {
        return new ResponseEntity<>(configurationService.removeConfiguration(configGetRequestDTO.getTenantId()), HttpStatus.OK);
    }
}
