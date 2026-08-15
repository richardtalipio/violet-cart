package com.violetCart.backend.common.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class ImageStorageService {

    @Value("${app.image.upload-dir:D:/PersonalProject/imageUploads}")
    private String uploadDir;

    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList(
            "jpg", "jpeg", "png", "gif", "webp", "bmp"
    ));

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    /**
     * Saves image file to local filesystem with naming convention: productId_userAccountId_storeProfileId.ext
     * @param file the image file to save
     * @param productId the product ID
     * @param userAccountId the user account ID
     * @param storeProfileId the store profile ID
     * @return the relative path/filename of the saved image
     * @throws IllegalArgumentException if file is invalid or save fails
     */
    public String saveImage(MultipartFile file, Long productId, Long userAccountId, Long storeProfileId) {
        validateFile(file);

        try {
            // Ensure upload directory exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Get file extension
            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);

            // Create filename: ProductId_userAccountId_storeProfileId.ext
            String filename = String.format("%d_%d_%d.%s", productId, userAccountId, storeProfileId, extension);
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.write(filePath, file.getBytes());

            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image file: " + e.getMessage(), e);
        }
    }

    /**
     * Deletes image file from filesystem
     * @param filename the filename to delete
     */
    public void deleteImage(String filename) {
        if (filename == null || filename.isEmpty()) {
            return;
        }

        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            // Log warning but don't throw - deletion failure shouldn't block product operations
            System.err.println("Failed to delete image file: " + filename + " - " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Image file size exceeds maximum limit of 5MB");
        }

        String extension = getFileExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + ALLOWED_EXTENSIONS);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new IllegalArgumentException("Invalid filename: no extension found");
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}

