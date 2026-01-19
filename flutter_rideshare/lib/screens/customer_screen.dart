import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/car.dart';
import '../widgets/booking_dialog.dart';

class CustomerScreen extends StatefulWidget {
  const CustomerScreen({super.key});

  @override
  State<CustomerScreen> createState() => _CustomerScreenState();
}

class _CustomerScreenState extends State<CustomerScreen> {
  final _originController = TextEditingController();
  final _destinationController = TextEditingController();

  @override
  void dispose() {
    _originController.dispose();
    _destinationController.dispose();
    super.dispose();
  }

  IconData _getVehicleIcon(String type) {
    switch (type) {
      case 'bus':
      case 'minibus':
        return Icons.directions_bus;
      case 'motorcycle':
        return Icons.two_wheeler;
      case 'truck':
        return Icons.local_shipping;
      default:
        return Icons.directions_car;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final appProvider = Provider.of<AppProvider>(context);

    final filteredCars = appProvider.searchCars(
      origin: _originController.text,
      destination: _destinationController.text,
    );

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.people, color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            const Text('Find Your Ride'),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(appProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            onPressed: () => appProvider.toggleTheme(),
          ),
        ],
      ),
      body: Column(
        children: [
          Card(
            margin: const EdgeInsets.all(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _originController,
                      decoration: InputDecoration(
                        prefixIcon: Icon(Icons.location_on, color: theme.colorScheme.primary),
                        hintText: 'From (origin)',
                        border: const OutlineInputBorder(),
                      ),
                      onChanged: (_) => setState(() {}),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Icon(Icons.arrow_forward, color: theme.colorScheme.onSurface.withOpacity(0.5)),
                  ),
                  Expanded(
                    child: TextField(
                      controller: _destinationController,
                      decoration: InputDecoration(
                        prefixIcon: Icon(Icons.location_on, color: theme.colorScheme.error),
                        hintText: 'To (destination)',
                        border: const OutlineInputBorder(),
                      ),
                      onChanged: (_) => setState(() {}),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: filteredCars.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off, size: 64, color: theme.colorScheme.onSurface.withOpacity(0.3)),
                        const SizedBox(height: 16),
                        Text('No rides available', style: theme.textTheme.titleLarge),
                        const SizedBox(height: 8),
                        Text('Check back later for available rides.',
                            style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: filteredCars.length,
                    itemBuilder: (context, index) {
                      final car = filteredCars[index];
                      return _CarCard(car: car, getVehicleIcon: _getVehicleIcon);
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _CarCard extends StatelessWidget {
  final Car car;
  final IconData Function(String) getVehicleIcon;

  const _CarCard({required this.car, required this.getVehicleIcon});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final vehicleIcon = getVehicleIcon(car.vehicleType);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    border: Border.all(color: theme.colorScheme.outline),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(vehicleIcon, size: 14),
                      const SizedBox(width: 4),
                      Text(car.vehicleTypeLabel, style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Icon(Icons.location_on, size: 18, color: theme.colorScheme.primary),
                const SizedBox(width: 4),
                Text(car.origin, style: const TextStyle(fontWeight: FontWeight.w500)),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: Icon(Icons.arrow_forward, size: 16),
                ),
                Icon(Icons.location_on, size: 18, color: theme.colorScheme.error),
                const SizedBox(width: 4),
                Text(car.destination, style: const TextStyle(fontWeight: FontWeight.w500)),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 16,
              runSpacing: 8,
              children: [
                _InfoChip(icon: vehicleIcon, label: '${car.carModel} (${car.carNumber})'),
                _InfoChip(icon: Icons.person, label: car.driverName),
                _InfoChip(icon: Icons.event_seat, label: '${car.seatsAvailable} seats'),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(Icons.access_time, size: 16, color: theme.colorScheme.onSurface.withOpacity(0.6)),
                const SizedBox(width: 4),
                Text('Departs: ${car.departureTime}'),
                const SizedBox(width: 16),
                Text('Returns: ${car.returnTime}'),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.secondaryContainer,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('One Way', style: TextStyle(fontSize: 12)),
                        ),
                        const SizedBox(width: 8),
                        Text('\$${car.fare.toStringAsFixed(0)}',
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            border: Border.all(color: theme.colorScheme.outline),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('Round Trip', style: TextStyle(fontSize: 12)),
                        ),
                        const SizedBox(width: 8),
                        Text('\$${(car.fare + car.returnFare).toStringAsFixed(0)}',
                            style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.7))),
                      ],
                    ),
                  ],
                ),
                FilledButton(
                  onPressed: () => _showBookingDialog(context, car),
                  child: const Text('Book Now'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showBookingDialog(BuildContext context, Car car) {
    showDialog(
      context: context,
      builder: (context) => BookingDialog(car: car),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6)),
        const SizedBox(width: 4),
        Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8))),
      ],
    );
  }
}
