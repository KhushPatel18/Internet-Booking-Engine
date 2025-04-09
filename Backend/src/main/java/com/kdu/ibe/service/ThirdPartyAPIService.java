package com.kdu.ibe.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.kdu.ibe.dto.response.RoomRateResponseDTO;
import com.kdu.ibe.util.GetMinimumNightlyRate;
import com.kdu.ibe.util.Queries;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service class for interacting with a third-party API.
 * This class provides a method to send a GraphQL query to the API and receive a response in a specified type.
 */
@Service
public class ThirdPartyAPIService {
    @Value("${graphql.client.url}")
    private String url;
    @Value("${API_KEY}")
    private String apikey;

    /**
     * Sends a GraphQL query to the third-party API and returns the response payload in the specified type.
     * This method constructs an HTTP POST request with the GraphQL query and API key, sends the request to the API,
     * and returns the response payload in the specified type.
     *
     * @param <T>          the type of the response payload
     * @param responseType the class of the response payload
     * @param query        the GraphQL query to send
     * @return the response payload in the specified type
     */
    public <T> T getPayload(Class<T> responseType, String query) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apikey);
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("query", query);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<T> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, responseType);
        return responseEntity.getBody();
    }

}
