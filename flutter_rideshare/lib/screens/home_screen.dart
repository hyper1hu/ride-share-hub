import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/custom_gradient_button.dart';
import '../widgets/stats_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    // final size = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        children: [
          // Animated gradient background
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).primaryColor.withOpacity(0.1),
                  Theme.of(context).colorScheme.secondary.withOpacity(0.05),
                  Theme.of(context).colorScheme.tertiary.withOpacity(0.08),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),
          SafeArea(
            child: CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                // Custom App Bar
                SliverAppBar(
                  floating: true,
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  title: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Theme.of(context).primaryColor,
                              Theme.of(context).colorScheme.secondary,
                            ],
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.local_taxi, color: Colors.white, size: 22),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Ride Share Hub',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  actions: [
                    CustomIconButton(
                      icon: provider.isDarkMode ? Icons.light_mode : Icons.dark_mode,
                      onPressed: provider.toggleTheme,
                    ),
                    const SizedBox(width: 16),
                  ],
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 20),
                        // Hero Section
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(32),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Theme.of(context).primaryColor,
                                Theme.of(context).colorScheme.secondary,
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: Theme.of(context).primaryColor.withOpacity(0.3),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.location_on,
                                  size: 60,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 24),
                              const Text(
                                'Travel Across',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'West Bengal',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1,
                                ),
                              ),
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Text(
                                  '441+ Locations • 23 Districts',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),
                        // Action Cards
                        Text(
                          'Get Started',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 16),
                        ActionCard(
                          title: 'Book a Ride',
                          subtitle: 'Find vehicles near you',
                          icon: Icons.search,
                          color: Theme.of(context).colorScheme.tertiary,
                          onTap: () => Navigator.pushNamed(context, '/customer'),
                        ),
                        const SizedBox(height: 12),
                        ActionCard(
                          title: 'Become a Driver',
                          subtitle: 'Register your vehicle & earn',
                          icon: Icons.directions_car,
                          color: Theme.of(context).colorScheme.secondary,
                          onTap: () => Navigator.pushNamed(context, '/driver-register'),
                        ),
                        const SizedBox(height: 12),
                        ActionCard(
                          title: 'Driver Dashboard',
                          subtitle: 'Manage bookings & earnings',
                          icon: Icons.dashboard,
                          color: Theme.of(context).primaryColor,
                          onTap: () => Navigator.pushNamed(context, '/driver'),
                        ),
                        const SizedBox(height: 32),
                        // Stats
                        Text(
                          'Why Choose Us',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 16),
                        GridView.count(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                          childAspectRatio: 1.3,
                          children: [
                            StatsCard(
                              title: 'Coverage',
                              value: '441+',
                              icon: Icons.location_city,
                              gradientColors: [
                                Theme.of(context).colorScheme.tertiary,
                                Theme.of(context).colorScheme.tertiary.withOpacity(0.7),
                              ],
                              subtitle: 'Locations',
                            ),
                            StatsCard(
                              title: 'Districts',
                              value: '23',
                              icon: Icons.map,
                              gradientColors: [
                                Theme.of(context).colorScheme.secondary,
                                Theme.of(context).colorScheme.secondary.withOpacity(0.7),
                              ],
                              subtitle: 'All of WB',
                            ),
                            const StatsCard(
                              title: 'Vehicle Types',
                              value: '8+',
                              icon: Icons.car_rental,
                              gradientColors: [
                                Color(0xFF1E3A8A),
                                Color(0xFF1E3A8A),
                              ],
                              subtitle: 'Options',
                            ),
                            const StatsCard(
                              title: 'Support',
                              value: '24/7',
                              icon: Icons.support_agent,
                              gradientColors: [
                                Color(0xFFF59E0B),
                                Color(0xFFD97706),
                              ],
                              subtitle: 'Always here',
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        // Vehicle Types
                        Text(
                          'Available Vehicles',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 16),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _buildVehicleChip(Icons.directions_car, 'Car'),
                            _buildVehicleChip(Icons.two_wheeler, 'Bike'),
                            _buildVehicleChip(Icons.electric_rickshaw, 'Auto'),
                            _buildVehicleChip(Icons.local_shipping, 'Tempo'),
                            _buildVehicleChip(Icons.directions_bus, 'Mini Bus'),
                            _buildVehicleChip(Icons.directions_bus_filled, 'Bus'),
                            _buildVehicleChip(Icons.airport_shuttle, 'Maxi Cab'),
                            _buildVehicleChip(Icons.commute, 'Sharing'),
                          ],
                        ),
                        const SizedBox(height: 32),
                        // Popular Routes
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.05),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.trending_up,
                                    color: Theme.of(context).primaryColor,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Popular Routes',
                                    style: Theme.of(context).textTheme.titleLarge,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              _buildRouteItem('Kolkata', 'Darjeeling', Icons.landscape),
                              _buildRouteItem('Kolkata', 'Digha', Icons.beach_access),
                              _buildRouteItem('Siliguri', 'Kalimpong', Icons.terrain),
                              _buildRouteItem('Kolkata', 'Shantiniketan', Icons.school),
                              _buildRouteItem('Durgapur', 'Asansol', Icons.factory),
                            ],
                          ),
                        ),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVehicleChip(IconData icon, String label) {
    return Builder(
      builder: (context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: Theme.of(context).primaryColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Theme.of(context).primaryColor.withOpacity(0.2),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18, color: Theme.of(context).primaryColor),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: Theme.of(context).primaryColor,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRouteItem(String from, String to, IconData icon) {
    return Builder(
      builder: (context) => Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.tertiary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                icon,
                size: 20,
                color: Theme.of(context).colorScheme.tertiary,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                from,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Icon(
              Icons.arrow_forward,
              size: 18,
              color: Theme.of(context).textTheme.bodySmall?.color,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                to,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
