package com.kdu.ibe.service;

import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kdu.ibe.entity.TravellerInfo;
import com.kdu.ibe.repository.TravellerInfoRepository;

import java.util.List;

@Service
public class TravellerInfoService {


    private final TravellerInfoRepository travellerInfoRepository;

    public TravellerInfoService(TravellerInfoRepository travellerInfoRepository) {
        this.travellerInfoRepository = travellerInfoRepository;
    }

    public TravellerInfo saveTravellerInfo(TravellerInfo travellerInfo) {
        return travellerInfoRepository.save(travellerInfo);
    }

    public TravellerInfo getByBookingId(Long bookingId) {
        List<TravellerInfo> travellerInfos = travellerInfoRepository.getByBookingId(bookingId);
        if(travellerInfos.isEmpty()){
            throw new UnprocessableEntityException("not able to find any TravellerInfo of bookingId " + bookingId);
        }
        return travellerInfos.get(0);
    }
}