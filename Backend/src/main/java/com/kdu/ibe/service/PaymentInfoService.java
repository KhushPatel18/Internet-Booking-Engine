package com.kdu.ibe.service;

import com.kdu.ibe.exception.custom.UnprocessableEntityException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kdu.ibe.entity.PaymentInfo;
import com.kdu.ibe.repository.PaymentInfoRepository;

import java.util.List;

@Service
public class PaymentInfoService {

    private final PaymentInfoRepository paymentInfoRepository;

    public PaymentInfoService(PaymentInfoRepository paymentInfoRepository) {
        this.paymentInfoRepository = paymentInfoRepository;
    }

    public PaymentInfo savePaymentInfo(PaymentInfo paymentInfo) {
        return paymentInfoRepository.save(paymentInfo);
    }

    public PaymentInfo getByBookingId(Long bookingId) {
        List<PaymentInfo> paymentInfos = paymentInfoRepository.getByBookingId(bookingId);
        if (paymentInfos.isEmpty()) {
            throw new UnprocessableEntityException("not able to find any PaymentInfo of bookingId " + bookingId);
        }
        return paymentInfos.get(0);
    }
}
