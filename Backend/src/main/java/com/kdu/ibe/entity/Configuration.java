package com.kdu.ibe.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.kdu.ibe.dto.ConfigurationsDTOs.TenantConfigurationRequestDTO;
import com.kdu.ibe.util.ConfigConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Configuration extends Metadata {

    @Id
    @JsonProperty("tenant_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tenantId;

    @Column(columnDefinition = "TEXT")
    @Convert(converter = ConfigConverter.class)
    private TenantConfigurationRequestDTO configurations;
}
