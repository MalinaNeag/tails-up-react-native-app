# TailsUp

## Project Proposal

**Problem Statement:**
Pet owners often struggle to find trustworthy and convenient pet care services when they travel or work long hours. Traditional methods of finding pet sitters, such as word-of-mouth or small local platforms, are limited in terms of security and the variety of choices.

**Proposed Solution:**
TailsUp is a mobile application that connects pet owners with reliable, verified pet sitters. The app streamlines the process of finding and booking pet care services through features such as pet sitter matching, real-time updates, and comprehensive pet profiles. The platform is secure, user-friendly, and includes geolocation-based search, sitter certification, and integrated payment options.

**Target Audience:**
- Pet owners (especially those who travel often)
- Pet sitters

## Tools & Technologies
- **Frontend:** React Native
- **Backend:** AWS Amplify
- **Database:** AWS S3 Storage
- **APIs:** Google Maps API, Stripe/PayPal API, GraphQL

## Requirements Gathering

### Functional Requirements:
- **User Registration & Authentication:** Users can sign up, log in, and log out.
- **Pet Profiles:** Users can create detailed profiles for their pets, including medical info and care preferences.
- **Sitter Profiles:** Sitters can create profiles with their experience, certifications, and services offered.
- **Search & Filters:** Pet owners can search sitters based on location, service type, pet type, and availability.
- **Booking System:** Owners can book sitters, and sitters can accept or reject bookings.
- **Payment Integration:** Secure in-app payment system for transactions between pet owners and sitters.
- **Reviews & Ratings:** Pet owners can leave feedback after services.
- **Real-Time Notifications:** Users receive updates about bookings, payments, and sitter activity.
- **In-App Messaging:** Facilitates communication between sitters and owners.

### Non-Functional Requirements:
- **Performance:** The app is optimized to handle a large volume of users.
- **Security:** All user data and payment information are encrypted and securely stored.
- **Usability:** The app has an intuitive, accessible interface with clear navigation.
- **Scalability:** The architecture supports future features like additional pet services and expanding to new regions.

## High-Level Architecture Diagram

### 1. **Presentation Layer (Frontend)**
- **Technology:** React Native
- **Role:** Manages user interactions, UI rendering, and communicates with the backend via GraphQL.
- **Key Features:** 
  - User registration & login
  - Profile management (pets and sitters)
  - Search and filter sitters
  - Booking and real-time notifications (using Google Maps API for geolocation)

### 2. **Business Logic Layer (Backend)**
- **Technology:** AWS Amplify, GraphQL
- **Role:** Handles core app logic such as pet-sitter matching, bookings, payments, and authentication.
- **Key Features:**
  - Manages business workflows and processes (booking, sitter matching)
  - Payment processing (via Stripe/PayPal)
  - Session management and user authentication
  - Notifications (real-time updates)

### 3. **Data Access Layer (Database and External Services)**
- **Technology:** AWS S3, Google Maps API, Stripe/PayPal
- **Role:** Stores and retrieves data from the database and interacts with third-party services (e.g., payments, geolocation).
- **Key Features:**
  - Data storage for user profiles, pet profiles, sitter profiles, bookings
  - Secure payment processing
  - Geolocation services for sitters via Google Maps API

![architecture](https://github.com/user-attachments/assets/216282e5-3de0-48e3-8e6c-18c3dfd2c508)


## High-Level Architecture Diagram

### 1. **Presentation Layer (Frontend)**
- **Technology:** React Native
- **Role:** Manages user interactions, UI rendering, and communicates with the backend via GraphQL.
- **Key Features:** 
  - User registration & login
  - Profile management (pets and sitters)
  - Search and filter sitters
  - Booking and real-time notifications (using Google Maps API for geolocation)

### 2. **Business Logic Layer (Backend)**
- **Technology:** AWS Amplify, GraphQL
- **Role:** Handles core app logic such as pet-sitter matching, bookings, payments, and authentication.
- **Key Features:**
  - Manages business workflows and processes (booking, sitter matching)
  - Payment processing (via Stripe/PayPal)
  - Session management and user authentication
  - Notifications (real-time updates)

### 3. **Data Access Layer (Database and External Services)**
- **Technology:** AWS S3, Google Maps API, Stripe/PayPal
- **Role:** Stores and retrieves data from the database and interacts with third-party services (e.g., payments, geolocation).
- **Key Features:**
  - Data storage for user profiles, pet profiles, sitter profiles, bookings
  - Secure payment processing
  - Geolocation services for sitters via Google Maps API

![architecture](https://github.com/user-attachments/assets/216282e5-3de0-48e3-8e6c-18c3dfd2c508)

