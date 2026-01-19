import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final appProvider = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.directions_car, color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            const Text('RideShare', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(appProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            onPressed: () => appProvider.toggleTheme(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    theme.colorScheme.primary.withOpacity(0.05),
                    theme.colorScheme.primary.withOpacity(0.1),
                  ],
                ),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.directions_car, size: 16, color: theme.colorScheme.primary),
                        const SizedBox(width: 8),
                        Text('Reliable Car Hire Service',
                            style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.w500)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text('Travel Between Cities',
                      style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center),
                  Text('With Ease',
                      style: theme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                      textAlign: TextAlign.center),
                  const SizedBox(height: 16),
                  Text('Book rides from point A to B, and enjoy the convenience of return trips.',
                      style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                      textAlign: TextAlign.center),
                  const SizedBox(height: 32),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      FilledButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/customer'),
                        icon: const Icon(Icons.people),
                        label: const Text('Book a Ride'),
                      ),
                      const SizedBox(width: 16),
                      OutlinedButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/driver'),
                        icon: const Icon(Icons.directions_car),
                        label: const Text('List Your Car'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Text('How It Works', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(child: _FeatureCard(
                        icon: Icons.location_on,
                        title: 'Choose Your Route',
                        description: 'Browse available routes from your origin to destination.',
                        color: theme.colorScheme.primary,
                      )),
                      const SizedBox(width: 16),
                      Expanded(child: _FeatureCard(
                        icon: Icons.access_time,
                        title: 'Pick Departure Time',
                        description: 'Select from available departure and return times.',
                        color: theme.colorScheme.primary,
                      )),
                      const SizedBox(width: 16),
                      Expanded(child: _FeatureCard(
                        icon: Icons.security,
                        title: 'Safe & Reliable',
                        description: 'Travel with verified drivers. No hidden charges.',
                        color: theme.colorScheme.primary,
                      )),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final Color color;

  const _FeatureCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color),
            ),
            const SizedBox(height: 16),
            Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text(description, style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7))),
          ],
        ),
      ),
    );
  }
}
