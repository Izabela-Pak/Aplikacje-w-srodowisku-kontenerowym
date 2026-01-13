package com.izabela.backend.dtos;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CDResponse {
    int id_album; 
    String title;
    String author;
    String year;
    String image_link;
}
