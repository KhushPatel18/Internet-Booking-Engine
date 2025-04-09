package com.kdu.ibe;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kdu.ibe.controller.PropertyController;
import com.kdu.ibe.dto.graphql.PropertyResponseDTO;
import com.kdu.ibe.dto.response.RoomRateResponseDTO;
import com.kdu.ibe.service.ThirdPartyAPIService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PropertyController.class)
@Slf4j
class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ThirdPartyAPIService thirdPartyAPIService;

    @Autowired
    private ObjectMapper objectMapper;

//    @Test
//    void testGraphqlResponse() throws Exception {
//        // Mock the response from ThirdPartyAPIService
//        String mockPayload = "{\"data\":{\"getProperty\":{\"property_id\":12,\"property_name\":\"Team 12 Hotel\",\"property_address\":\"Kickdrum\",\"contact_number\":\"123456789\"}}}";
//        Mockito.when(thirdPartyAPIService.getPayload(PropertyResponseDTO.class)).thenReturn(mockPayload);
//
//        // Perform GET request to /api/v1/property/getProperty
//        mockMvc.perform(get("/api/v1/property/getProperty"))
//                .andExpect(status().isOk())
//                .andExpect(content().json(mockPayload));
//    }
    @Test
    void testGraphqlRateResponse() throws Exception {
        // Perform GET request to /api/v1/property/getRates
        mockMvc.perform(get("/api/v1/property/getRates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}

