import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class FirebaseSetupApp extends StatelessWidget {
  final Object? error;

  const FirebaseSetupApp({super.key, required this.error});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'RideShare - Setup',
      theme: ThemeData(
        useMaterial3: true,
        textTheme: GoogleFonts.poppinsTextTheme(),
      ),
      home: FirebaseSetupScreen(error: error),
    );
  }
}

class FirebaseSetupScreen extends StatelessWidget {
  final Object? error;

  const FirebaseSetupScreen({super.key, required this.error});

  @override
  Widget build(BuildContext context) {
    final message = error?.toString() ?? 'Firebase initialization failed.';
    return Scaffold(
      appBar: AppBar(title: const Text('Firebase Setup Required')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'This app requires Firebase (Auth + Firestore) to run.',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            const Text(
              '''Fix:
1) Create a Firebase project
2) Add Android app in Firebase console
3) Download google-services.json into android/app/
4) Rebuild the app''',
            ),
            const SizedBox(height: 12),
            Text(
              'Error details:\n$message',
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: Theme.of(context).colorScheme.error),
            ),
          ],
        ),
      ),
    );
  }
}
