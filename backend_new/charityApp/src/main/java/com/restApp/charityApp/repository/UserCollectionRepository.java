package com.restApp.charityApp.repository;

import com.restApp.charityApp.usermodel.User;
import com.restApp.charityApp.usermodel.UserCollection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCollectionRepository extends JpaRepository<UserCollection, Long> {
    List<UserCollection> findByUser(User user);
}
