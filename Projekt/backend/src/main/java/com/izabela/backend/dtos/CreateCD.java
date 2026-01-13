package com.izabela.backend.dtos;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCD {
    String title;
    String author;
    String year;
    MultipartFile file;
    String email;
}
