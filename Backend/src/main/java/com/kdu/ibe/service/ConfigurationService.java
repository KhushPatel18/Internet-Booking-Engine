package com.kdu.ibe.service;

import com.kdu.ibe.dto.ConfigurationsDTOs.PropertyConfigurationDTO;
import com.kdu.ibe.dto.ConfigurationsDTOs.TenantConfigurationRequestDTO;
import com.kdu.ibe.dto.ConfigurationsDTOs.TenantResponseConfigurationDTO;
import com.kdu.ibe.dto.request.ConfigPostRequestDTO;
import com.kdu.ibe.dto.request.ConfigPutRequestDTO;
import com.kdu.ibe.dto.request.PropertyConfigGetRequestDTO;
import com.kdu.ibe.dto.response.ConfigGetResponseDTO;
import com.kdu.ibe.entity.Configuration;
import com.kdu.ibe.exception.custom.EntityNotFoundException;
import com.kdu.ibe.repository.ConfigurationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;


/**
 * Service layer for managing configurations related to tenants and properties.
 * This service provides CRUD operations for configurations, including fetching, creating, updating, and deleting configurations.
 */
@Service
@Slf4j
public class ConfigurationService {
    private final ConfigurationRepository configurationRepository;

    public ConfigurationService(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
    }

    /**
     * Retrieves the configuration for a given tenant ID.
     *
     * @param tenantId the ID of the tenant whose configuration is to be retrieved
     * @return the tenant's configuration as a DTO
     * @throws EntityNotFoundException if no configuration exists for the given tenant ID
     */
    public TenantResponseConfigurationDTO getConfiguration(Long tenantId) {
        Configuration configuration = configurationRepository.findById(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Configuration for tenant_id: " + tenantId + " does not exist"));
        return MapperService.toDTO(configuration);
    }

    /**
     * Creates a new configuration for a tenant based on the provided request DTO.
     *
     * @param tenantConfigurationRequestDTO the DTO containing the configuration details for the tenant
     * @return the created tenant's configuration as a DTO
     */
    public TenantResponseConfigurationDTO postConfiguration(TenantConfigurationRequestDTO tenantConfigurationRequestDTO) {
        return MapperService.toDTO(configurationRepository.save(MapperService.toEntity(tenantConfigurationRequestDTO)));
    }

    /**
     * Updates an existing configuration for a tenant based on the provided request DTO.
     *
     * @param tenantResponseConfigurationDTO the DTO containing the updated configuration details for the tenant
     * @return the updated tenant's configuration as a DTO
     * @throws EntityNotFoundException if no configuration exists for the given tenant ID
     */
    public TenantResponseConfigurationDTO putConfiguration(TenantResponseConfigurationDTO tenantResponseConfigurationDTO) {
        Configuration configuration = configurationRepository.findById(tenantResponseConfigurationDTO.getTenantId())
                .orElseThrow(() -> new EntityNotFoundException("Configuration for tenant_id: " + tenantResponseConfigurationDTO.getTenantId() + " does not exist"));
        configuration.setConfigurations(MapperService.toRequestDTO(tenantResponseConfigurationDTO));
        configurationRepository.save(configuration);
        return MapperService.toDTO(configuration);
    }

    /**
     * Deletes the configuration for a given tenant ID.
     *
     * @param tenantId the ID of the tenant whose configuration is to be deleted
     * @return a success message indicating the deletion of the configuration
     */
    public String removeConfiguration(Long tenantId) {
        configurationRepository.deleteById(tenantId);
        return "tenant id : " + tenantId + " deleted successfully";
    }

    /**
     * Retrieves the property configuration for a given tenant ID and property name.
     *
     * @param propertyConfigGetRequestDTO the DTO containing the tenant ID and property name
     * @return the property configuration as a DTO
     * @throws EntityNotFoundException if no configuration exists for the given tenant ID or if the property does not exist
     */
    public PropertyConfigurationDTO getPropertyConfig(PropertyConfigGetRequestDTO propertyConfigGetRequestDTO) {
        Configuration configuration = configurationRepository.findById(propertyConfigGetRequestDTO.getTenantId())
                .orElseThrow(() -> new EntityNotFoundException("Configuration for tenant_id: " + propertyConfigGetRequestDTO.getTenantId() + " does not exist"));
        Optional<PropertyConfigurationDTO> propertyConfigurationDTOOptional = configuration.getConfigurations().getConfigurationsByProperty().stream()
                .filter(temp -> temp.getName().equals(propertyConfigGetRequestDTO.getPropertyName()))
                .findFirst();
        return propertyConfigurationDTOOptional.orElseThrow(() -> new EntityNotFoundException("Property with name " + propertyConfigGetRequestDTO.getPropertyName() + " Not Exist"));
    }
}
