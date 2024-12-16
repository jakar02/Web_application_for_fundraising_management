package com.restApp.charityApp.service;

import com.restApp.charityApp.repository.UserCollectionRepository;
import com.restApp.charityApp.repository.UserCollectionImageRepository;
import com.restApp.charityApp.repository.UserRepository;
import com.restApp.charityApp.usermodel.User;
import com.restApp.charityApp.usermodel.UserCollection;
import com.restApp.charityApp.usermodel.UserCollectionImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserCollectionService {

    @Autowired
    private UserCollectionRepository userCollectionRepository;

    @Autowired
    private UserCollectionImageRepository userCollectionImageRepository;

    @Autowired
    private UserRepository userRepository;

    public UserCollection createUserCollection(UserCollection userCollection, List<MultipartFile> images, String userEmail) throws IOException {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new IllegalArgumentException("User not found with this email: " + userEmail);
        }
        userCollection.setUser(user);
        UserCollection savedCollection = userCollectionRepository.save(userCollection);

        List<UserCollectionImage> savedImages = new ArrayList<>();
        for (MultipartFile image : images) {
            UserCollectionImage collectionImage = new UserCollectionImage();
            collectionImage.setUserCollection(savedCollection);
            collectionImage.setImageData(image.getBytes());
            collectionImage.setImageName(image.getOriginalFilename());
            savedImages.add(collectionImage);
        }
        userCollectionImageRepository.saveAll(savedImages);

        return savedCollection;
    }

    public List<UserCollection> getAllCollections(){
        return userCollectionRepository.findAll();
    }

    public List<UserCollection> getUserCollections(User user){
        return userCollectionRepository.findByUser(user);
    }

    public UserCollection getUserCollection(User user, Long id){
        return userCollectionRepository.getReferenceById(id);
    }

    public void updateUserCollection(UserCollection userCollection) {
        userCollectionRepository.save(userCollection);
    }

    public void updateUserCollection(UserCollection userCollection, UserCollection userCollectionFromDb, List<MultipartFile> images) throws IOException {
        userCollectionFromDb.setCollectionGoal(userCollection.getCollectionGoal());
        userCollectionFromDb.setCollectionAmount(userCollection.getCollectionAmount());
        userCollectionFromDb.setAccountNumber(userCollection.getAccountNumber());
        userCollectionFromDb.setDescription(userCollection.getDescription());
        userCollectionFromDb.setCity(userCollection.getCity());
        userCollectionFromDb.setDate(userCollection.getDate());
        if (images != null && !images.isEmpty()) {
            userCollectionFromDb.getImages().clear();
            for (MultipartFile image : images) {
                UserCollectionImage collectionImage = new UserCollectionImage();
                collectionImage.setUserCollection(userCollectionFromDb);
                collectionImage.setImageData(image.getBytes());
                collectionImage.setImageName(image.getOriginalFilename());
                userCollectionFromDb.getImages().add(collectionImage);
            }
        }
        userCollectionRepository.save(userCollectionFromDb);
    }

    public UserCollection getCollectionById(Long id) {
        return userCollectionRepository.findById(id).orElse(null);
    }

    public void updatePostedOnTwitter(UserCollection userCollection) {
        userCollection.setPostedOnTwitter(true);
        userCollectionRepository.save(userCollection);
    }
}
