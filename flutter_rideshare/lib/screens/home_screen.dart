import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              floating: true,
              title: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(Icons.directions_car, color: colorScheme.primary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  const Text('RideShare', style: TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
              actions: [
                IconButton(
                  icon: Icon(provider.isDarkMode ? Icons.light_mode : Icons.dark_mode),
                  onPressed: provider.toggleTheme,
                ),
              ],
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const SizedBox(height: 40),
                    Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [colorScheme.primaryContainer, colorScheme.secondaryContainer],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.local_taxi, size: 80, color: colorScheme.primary),
                    ),
                    const SizedBox(height: 32),
                    Text(
                      'Welcome to RideShare',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Your trusted vehicle hire service across West Bengal.\n441+ locations covering all 23 districts.',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: colorScheme.onSurfaceVariant),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 48),
                    _buildRoleCard(
                      context,
                      icon: Icons.person,
                      title: 'Find a Ride',
                      subtitle: 'Browse available vehicles and book your journey',
                      color: colorScheme.primary,
                      onTap: () => Navigator.pushNamed(context, '/customer'),
                    ),
                    const SizedBox(height: 16),
                    _buildRoleCard(
                      context,
                      icon: Icons.directions_car,
                      title: 'Register as Driver',
                      subtitle: 'List your vehicle and start earning',
                      color: colorScheme.secondary,
                      onTap: () => Navigator.pushNamed(context, '/driver-register'),
                    ),
                    const SizedBox(height: 48),
                    Text(
                      'Supported Vehicle Types',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      alignment: WrapAlignment.center,
                      children: [
                        _buildVehicleChip(Icons.directions_car, 'Car', colorScheme),
                        _buildVehicleChip(Icons.directions_car_filled, 'SUV', colorScheme),
                        _buildVehicleChip(Icons.airport_shuttle, 'Van', colorScheme),
                        _buildVehicleChip(Icons.directions_bus, 'Bus', colorScheme),
                        _buildVehicleChip(Icons.two_wheeler, 'Bike', colorScheme),
                        _buildVehicleChip(Icons.electric_rickshaw, 'Auto', colorScheme),
                      ],
                    ),
                    const SizedBox(height: 48),
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: colorScheme.surfaceContainerHighest.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Popular Routes',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 16),
                          _buildRouteItem('Kolkata', 'Darjeeling', Icons.landscape, colorScheme),
                          _buildRouteItem('Kolkata', 'Digha', Icons.beach_access, colorScheme),
                          _buildRouteItem('Siliguri', 'Gangtok', Icons.terrain, colorScheme),
                          _buildRouteItem('Kolkata', 'Shantiniketan', Icons.school, colorScheme),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios, size: 16, color: Theme.of(context).colorScheme.onSurfaceVariant),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildVehicleChip(IconData icon, String label, ColorScheme colorScheme) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: colorScheme.primary),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(color: colorScheme.onSurface, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildRouteItem(String from, String to, IconData icon, ColorScheme colorScheme) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: colorScheme.primary),
          const SizedBox(width: 12),
          Text(from, style: const TextStyle(fontWeight: FontWeight.w500)),
          const SizedBox(width: 8),
          Icon(Icons.arrow_forward, size: 16, color: colorScheme.onSurfaceVariant),
          const SizedBox(width: 8),
          Text(to, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
