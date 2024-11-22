package com.restApp.charityApp.service;

import com.restApp.charityApp.repository.UserCollectionRepository;
import com.restApp.charityApp.repository.UserRepository;
import com.restApp.charityApp.usermodel.User;
import com.restApp.charityApp.usermodel.UserCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImplementation implements  UserDetailsService {

    private final UserRepository userRepository;
    private final UserCollectionRepository userCollectionRepository;

    @Autowired
    public UserServiceImplementation(UserRepository userRepository, UserCollectionRepository userCollectionRepository) {
        this.userRepository = userRepository;
        this.userCollectionRepository = userCollectionRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        System.out.println(user);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with this email: " + username);
        }
        System.out.println("Loaded user: " + user.getEmail() + ", Role: " + user.getRole());
        List<GrantedAuthority> authorities = new ArrayList<>();

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }


    public User findUserById(String userId) {
        Optional<User> user = userRepository.findById(Long.parseLong(userId));
        return user.orElse(null);
    }

}
