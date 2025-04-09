package com.kdu.ibe.service;


import com.kdu.ibe.entity.Feedback;
import com.kdu.ibe.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }


    public Feedback submitFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public boolean getStatus(String feedbackId) {
        return feedbackRepository.findById(feedbackId).map(Feedback::isSubmitted).orElse(true);
    }

    public List<Feedback> getFeedbackByRoomTypeId(Long roomTypeId){
        return feedbackRepository.findAllByRoomTypeId(roomTypeId);
    }
}
