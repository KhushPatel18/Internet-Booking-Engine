package com.kdu.ibe.service;


import com.kdu.ibe.entity.IternaryInfo;
import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import com.kdu.ibe.repository.IternaryInfoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IternaryInfoService {


    private final IternaryInfoRepository iternaryInfoRepository;

    public IternaryInfoService(IternaryInfoRepository iternaryInfoRepository) {
        this.iternaryInfoRepository = iternaryInfoRepository;
    }

    public void save(IternaryInfo iternaryInfo) {
        iternaryInfoRepository.save(iternaryInfo);
    }

    public IternaryInfo getByBookingId(Long bookingId) {
        List<IternaryInfo> iternaryInfoList = iternaryInfoRepository.getByBookingId(bookingId);
        if (iternaryInfoList.isEmpty()) {
            throw new UnprocessableEntityException("not able to find any IternaryInfo of bookingId " + bookingId);
        }
        return iternaryInfoList.get(0);
    }
}
