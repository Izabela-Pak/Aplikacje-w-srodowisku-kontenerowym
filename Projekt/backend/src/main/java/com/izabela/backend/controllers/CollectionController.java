package com.izabela.backend.controllers;

import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.izabela.backend.dtos.CDResponse;
import com.izabela.backend.entities.CD;
import com.izabela.backend.repositories.CDRepository;
import com.izabela.backend.repositories.UserRepository;
import com.izabela.backend.service.StorageService;
import com.izabela.backend.entities.User;

@RestController
@RequestMapping("/api")
public class CollectionController {

    private final CDRepository cdRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;

    public CollectionController(CDRepository cdRepository, StorageService storageService, UserRepository userRepository){
        this.cdRepository = cdRepository;
        this.storageService = storageService;
        this.userRepository = userRepository;
    }

    @GetMapping("/list")
    public List<CDResponse> getListCD(@RequestParam String email) {

        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));
        return cdRepository.findAllByUser(user)
        .stream()
        .map(cd -> new CDResponse(
            cd.getId_album(),
            cd.getTitle(),
            cd.getAuthor(),
            cd.getYear(),
            cd.getImage_link()
        ))
        .toList();
    }

    @GetMapping("/cd/{id}")
    @ResponseBody
    public CDResponse getSpecificCd(@PathVariable("id") int id_album) {
        CD cd = cdRepository.findById(id_album).orElseThrow(() -> new RuntimeException("Nie znaleziono albumu o id=" + id_album));
        return new CDResponse(
            cd.getId_album(),
            cd.getTitle(),
            cd.getAuthor(),
            cd.getYear(),
            cd.getImage_link()
        );
    }

    @PostMapping
    public CDResponse createProduct(@RequestParam String title, @RequestParam String author, @RequestParam String year, @RequestParam String email  , @RequestPart(value = "file", required = false) MultipartFile file) throws Exception {
        
        CD cd = new CD();
        cd.setTitle(title);
        cd.setAuthor(author);
        cd.setYear(year);
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cd.setUser(user);
        
        //Jeśli użytkownik przesłał zdjęcie to wrzuca je do storage'a i generuje link
        if (file != null && !file.isEmpty()) {
            String imageUrl = storageService.uploadFile(file, user.getId());
            cd.setImageLink(imageUrl);
        }

        CD saved = cdRepository.save(cd);

        return new CDResponse(
            saved.getId_album(),
            saved.getTitle(),
            saved.getAuthor(),
            saved.getYear(),
            saved.getImageLink()
        );
        
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable int id){
        return cdRepository.findById(id)
            .map(album -> {
                cdRepository.delete(album);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<CDResponse> modifyAlbum(@PathVariable int id, @RequestParam String title, @RequestParam String author, @RequestParam String year, @RequestParam String email  , @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new RuntimeException("User not found"));
        return cdRepository.findById(id)
                .map(existingAlbum -> {
                    existingAlbum.setTitle(title);
                    existingAlbum.setAuthor(author);
                    existingAlbum.setYear(year);
                    existingAlbum.setUser(user);

                    if (image != null && !image.isEmpty()) {
                        try {
                            String imageUrl = storageService.uploadFile(image, user.getId());
                            existingAlbum.setImageLink(imageUrl);
                        } catch (Exception e) {
                            throw new RuntimeException("Nie udało się wgrać zdjęcia");
                        }
                    }

                    CD saved = cdRepository.save(existingAlbum);

                    CDResponse response = new CDResponse(
                            saved.getId_album(),
                            saved.getTitle(),
                            saved.getAuthor(),
                            saved.getYear(),
                            saved.getImageLink()
                    );

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /* 
    Testowanie samego wrzucania obrazu do bazy danych
    @PostMapping("/image")
    public void createProduct(@RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        
        //Jeśli użytkownik przesłał zdjęcie to wrzuca je do storage'a i generuje link
        if (image != null && !image.isEmpty()) {
            String imageUrl = storageService.uploadFile(image);
            System.out.println(imageUrl);
        }
        
    }
    */

}

