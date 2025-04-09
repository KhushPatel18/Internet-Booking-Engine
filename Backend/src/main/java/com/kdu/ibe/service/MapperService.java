package com.kdu.ibe.service;

import com.kdu.ibe.dto.ConfigurationsDTOs.TenantConfigurationRequestDTO;
import com.kdu.ibe.dto.ConfigurationsDTOs.TenantResponseConfigurationDTO;
import com.kdu.ibe.dto.graphql.PromotionsResponseDTO;
import com.kdu.ibe.dto.graphql.RoomRateGQLResponseDTO;
import com.kdu.ibe.dto.request.RoomRateDTO;
import com.kdu.ibe.entity.Configuration;
import com.kdu.ibe.entity.UserPromotion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class MapperService {
    private MapperService(){

    }
    public static List<RoomRateDTO> toDTOs(RoomRateGQLResponseDTO response) {

        List<RoomRateDTO> roomRatesList = new ArrayList<>();
        if (response == null) {
            log.error("Null response in roomRates");
            return roomRatesList;
        }
        List<RoomRateGQLResponseDTO.RoomType> roomTypes =  response.getData().getGetProperty().getRoomType();
        for(RoomRateGQLResponseDTO.RoomType roomType : roomTypes){
            roomType.getRoomRates().forEach(roomRate -> {
                roomRatesList.add(new RoomRateDTO(roomRate.getRoomRateDetail().getDate().substring(0,10),roomRate.getRoomRateDetail().getBasicNightlyRate()));
            });
        }
        return roomRatesList;
    }

    public static TenantResponseConfigurationDTO toDTO(Configuration configuration){
        TenantResponseConfigurationDTO tenantResponseConfigurationDTO = new TenantResponseConfigurationDTO();
        tenantResponseConfigurationDTO.setTenantId(configuration.getTenantId());
        TenantConfigurationRequestDTO tenantConfigurationRequestDTO = configuration.getConfigurations();
        tenantResponseConfigurationDTO.setConfigurationsByProperty(tenantConfigurationRequestDTO.getConfigurationsByProperty());
        tenantResponseConfigurationDTO.setProperties(tenantConfigurationRequestDTO.getProperties());
        tenantResponseConfigurationDTO.setTenantHeaderName(tenantConfigurationRequestDTO.getTenantHeaderName());
        tenantResponseConfigurationDTO.setTenantLogoFooter(tenantConfigurationRequestDTO.getTenantLogoFooter());
        tenantResponseConfigurationDTO.setTenantName(tenantConfigurationRequestDTO.getTenantName());
        tenantResponseConfigurationDTO.setTenantLogoHeader(tenantConfigurationRequestDTO.getTenantLogoHeader());
        tenantResponseConfigurationDTO.setTenantFooterCompanyText(tenantConfigurationRequestDTO.getTenantFooterCompanyText());
        return tenantResponseConfigurationDTO;
    }
    public static Configuration toEntity(TenantConfigurationRequestDTO tenantConfigurationRequestDTO){
        Configuration configuration = new Configuration();
        configuration.setConfigurations(tenantConfigurationRequestDTO);
        return configuration;
    }
    public static TenantConfigurationRequestDTO toRequestDTO(TenantResponseConfigurationDTO tenantResponseConfigurationDTO) {
        TenantConfigurationRequestDTO tenantConfigurationRequestDTO = new TenantConfigurationRequestDTO();
        tenantConfigurationRequestDTO.setConfigurationsByProperty(tenantResponseConfigurationDTO.getConfigurationsByProperty());
        tenantConfigurationRequestDTO.setProperties(tenantResponseConfigurationDTO.getProperties());
        tenantConfigurationRequestDTO.setTenantHeaderName(tenantResponseConfigurationDTO.getTenantHeaderName());
        tenantConfigurationRequestDTO.setTenantLogoFooter(tenantResponseConfigurationDTO.getTenantLogoFooter());
        tenantConfigurationRequestDTO.setTenantName(tenantResponseConfigurationDTO.getTenantName());
        tenantConfigurationRequestDTO.setTenantLogoHeader(tenantResponseConfigurationDTO.getTenantLogoHeader());
        tenantConfigurationRequestDTO.setTenantFooterCompanyText(tenantResponseConfigurationDTO.getTenantFooterCompanyText());
        return  tenantConfigurationRequestDTO;
    }

    public static PromotionsResponseDTO.Promotion toDTO(UserPromotion userPromotion) {
        return new PromotionsResponseDTO.Promotion(userPromotion.getPromotionId(), userPromotion.getPromotionTitle(), userPromotion.getPromotionDescription(), userPromotion.isDeactivated(), userPromotion.getMinimumDaysOfStay(), userPromotion.getPriceFactor());
    }
}
