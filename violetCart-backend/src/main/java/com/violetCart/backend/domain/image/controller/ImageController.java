package com.violetCart.backend.domain.image.controller;

import com.violetCart.backend.domain.image.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageStorageService imageStorageService;

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        Resource file = imageStorageService.getImage(filename);
        
        String contentType = "application/octet-stream";
        String filenameStr = file.getFilename();
        if (filenameStr != null) {
            if (filenameStr.endsWith(".png")) {
                contentType = "image/png";
            } else if (filenameStr.endsWith(".jpg") || filenameStr.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (filenameStr.endsWith(".gif")) {
                contentType = "image/gif";
            } else if (filenameStr.endsWith(".webp")) {
                contentType = "image/webp";
            }
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filenameStr + "\"")
                .body(file);
    }
}
