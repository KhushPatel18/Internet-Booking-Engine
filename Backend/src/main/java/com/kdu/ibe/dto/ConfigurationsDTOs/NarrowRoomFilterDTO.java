package com.kdu.ibe.dto.ConfigurationsDTOs;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class NarrowRoomFilterDTO {
    @NotEmpty
    private String name;

    @NotEmpty
    @Size(min = 1)
    private List<String> values;

}
