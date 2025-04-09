package com.kdu.ibe.service;


import com.kdu.ibe.dto.graphql.PropertyResponseDTO;
import com.kdu.ibe.dto.graphql.RoomRateGQLResponseDTO;
import com.kdu.ibe.dto.graphql.RoomRateResponseItrDTO;
import com.kdu.ibe.dto.request.RoomRateDTO;
import com.kdu.ibe.dto.request.RoomRateItrRequestDTO;
import com.kdu.ibe.dto.response.RoomRateResponseDTO;
import com.kdu.ibe.util.Queries;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import static com.kdu.ibe.util.GetMinimumNightlyRate.getMinimumNightlyRateForDate;

@Service
public class RoomRateService {


    private final ThirdPartyAPIService thirdPartyAPIService;


    public RoomRateService(ThirdPartyAPIService thirdPartyAPIService) {
        this.thirdPartyAPIService = thirdPartyAPIService;
    }

    @Cacheable(value = "nightly-rates", key = "#propertyId", cacheManager = "caffeineCacheManager")
    public List<RoomRateResponseDTO> getRoomRatesByProperty(int propertyId) {
        return getMinimumNightlyRateForDate(MapperService.toDTOs(thirdPartyAPIService.getPayload(RoomRateGQLResponseDTO.class,Queries.getNightlyRate(propertyId))));
    }

    public List<RoomRateResponseItrDTO.RoomRateDetails> getRatesForItr(RoomRateItrRequestDTO roomRateItrRequestDTO){
        RoomRateResponseItrDTO roomRateResponseItrDTO = thirdPartyAPIService.getPayload(RoomRateResponseItrDTO.class,String.format(Queries.dateRateMapping,roomRateItrRequestDTO.getRoomTypeId(),roomRateItrRequestDTO.getStartDate(),roomRateItrRequestDTO.getEndDate()));
        return roomRateResponseItrDTO.getData().getRoomRates().stream().map(RoomRateResponseItrDTO.RoomRate::getRoomRateDetails).toList();
    }
}
