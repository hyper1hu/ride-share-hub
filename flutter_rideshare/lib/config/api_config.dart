/// API Configuration for RideShare App
/// 
/// This file contains the base URL configuration for the API.
/// Update the baseUrl based on your deployment environment.

class ApiConfig {
  // Development: Use your local machine IP or localhost
  // For Android Emulator: use 10.0.2.2
  // For iOS Simulator: use localhost or 127.0.0.1
  // For Physical Device: use your computer's local IP (e.g., 192.168.1.100)
  
  // Production: Use your deployed API URL
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:5000', // Default for Android Emulator
  );

  // Alternative URLs for different environments
  static const String productionUrl = 'https://your-app.onrender.com';
  static const String stagingUrl = 'https://your-app-staging.onrender.com';
  static const String localUrl = 'http://10.0.2.2:5000';
  static const String physicalDeviceUrl = 'http://192.168.1.100:5000'; // Update with your IP

  // API Endpoints
  static const String authSendOtp = '/api/auth/send-otp';
  static const String authVerifyOtp = '/api/auth/verify-otp';
  static const String authLogout = '/api/auth/logout';
  static const String authMe = '/api/auth/me';
  
  static const String cars = '/api/cars';
  static const String carsSearch = '/api/cars/search';
  
  static const String bookings = '/api/bookings';
  
  static const String drivers = '/api/drivers';
  static const String driversRegister = '/api/drivers/register';
  
  static const String locations = '/api/locations/all';
  static const String locationsSearch = '/api/locations/search';
  static const String locationsPopular = '/api/locations/popular';
  
  static const String vehicleTypes = '/api/vehicle-types';
  
  static const String stats = '/api/stats';

  // Timeout configurations
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Get full URL
  static String getFullUrl(String endpoint) {
    return '$baseUrl$endpoint';
  }

  // Environment detection
  static bool get isProduction => baseUrl.contains('https://');
  static bool get isDevelopment => !isProduction;

  // Debug info
  static void printConfig() {
    print('=== API Configuration ===');
    print('Base URL: $baseUrl');
    print('Environment: ${isProduction ? 'Production' : 'Development'}');
    print('Connection Timeout: ${connectionTimeout.inSeconds}s');
    print('Receive Timeout: ${receiveTimeout.inSeconds}s');
    print('========================');
  }
}

/// Environment-specific configuration
/// 
/// To use different environments, build with:
/// - Development: flutter run
/// - Production: flutter run --dart-define=API_BASE_URL=https://your-app.onrender.com
/// - Staging: flutter run --dart-define=API_BASE_URL=https://your-app-staging.onrender.com
/// 
/// For release builds:
/// flutter build apk --release --dart-define=API_BASE_URL=https://your-app.onrender.com
