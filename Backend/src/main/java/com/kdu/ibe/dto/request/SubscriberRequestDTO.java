package com.kdu.ibe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SubscriberRequestDTO {

    @NotBlank(message = "First name cannot be blank")
    private String email;

    @NotBlank(message = "Phone number cannot be blank")
    private String phone;
}
