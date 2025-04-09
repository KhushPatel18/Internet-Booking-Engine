package com.kdu.ibe.service;

import com.kdu.ibe.dto.request.SubscriberRequestDTO;
import com.kdu.ibe.entity.Subscriber;
import com.kdu.ibe.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriberService {

    private final SubscriberRepository subscriberRepository;

    @Autowired
    public SubscriberService(SubscriberRepository subscriberRepository) {
        this.subscriberRepository = subscriberRepository;
    }

    public void addSubscriber(SubscriberRequestDTO subscriberDTO) {
        Subscriber subscriber = new Subscriber();
        subscriber.setEmail(subscriberDTO.getEmail());
        subscriber.setPhone(subscriberDTO.getPhone());
        subscriberRepository.save(subscriber);
    }

    public List<String> getAllSubscriberEmails() {
        List<Subscriber> subscribers = subscriberRepository.findAll();
        return subscribers.stream()
                .map(Subscriber::getEmail)
                .collect(Collectors.toList());
    }
}