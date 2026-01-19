import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/car.dart';
import '../widgets/add_car_dialog.dart';

class DriverScreen extends StatelessWidget {
  const DriverScreen({super.key});

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
    final cars = appProvider.cars;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.directions_car, color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            const Text('Driver Dashboard'),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(appProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            onPressed: () => appProvider.toggleTheme(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddCarDialog(context),
        icon: const Icon(Icons.add),
        label: const Text('Add Vehicle'),
      ),
      body: cars.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.directions_car_outlined, size: 64, color: theme.colorScheme.onSurface.withOpacity(0.3)),
                  const SizedBox(height: 16),
                  Text('No vehicles listed yet', style: theme.textTheme.titleLarge),
                  const SizedBox(height: 8),
                  Text('Start earning by listing your vehicle.',
                      style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: () => _showAddCarDialog(context),
                    icon: const Icon(Icons.add),
                    label: const Text('Add Your First Vehicle'),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: cars.length,
              itemBuilder: (context, index) {
                final car = cars[index];
                return _DriverCarCard(car: car, getVehicleIcon: _getVehicleIcon);
              },
            ),
    );
  }

  void _showAddCarDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const AddCarDialog(),
    );
  }
}

class _DriverCarCard extends StatelessWidget {
  final Car car;
  final IconData Function(String) getVehicleIcon;

  const _DriverCarCard({required this.car, required this.getVehicleIcon});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final appProvider = Provider.of<AppProvider>(context);
    final bookings = appProvider.getBookingsForCar(car.id);
    final availableSeats = appProvider.getAvailableSeats(car);
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
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(vehicleIcon, color: theme.colorScheme.primary),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(car.carModel, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              border: Border.all(color: theme.colorScheme.outline),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(car.vehicleTypeLabel, style: const TextStyle(fontSize: 10)),
                          ),
                        ],
                      ),
                      Text(car.carNumber, style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text('Available', style: TextStyle(color: Colors.green, fontWeight: FontWeight.w500)),
                ),
                IconButton(
                  icon: Icon(Icons.delete_outline, color: theme.colorScheme.error),
                  onPressed: () => _confirmDelete(context, car),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _InfoRow(icon: Icons.location_on, text: '${car.origin} to ${car.destination}'),
                      const SizedBox(height: 8),
                      _InfoRow(icon: Icons.access_time, text: 'Departs ${car.departureTime}, Returns ${car.returnTime}'),
                      const SizedBox(height: 8),
                      _InfoRow(icon: Icons.phone, text: car.driverPhone),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _InfoRow(icon: Icons.event_seat, text: '$availableSeats of ${car.seatsAvailable} seats available'),
                      const SizedBox(height: 8),
                      Text('One Way: \$${car.fare.toStringAsFixed(0)}  |  Round Trip: \$${(car.fare + car.returnFare).toStringAsFixed(0)}'),
                      const SizedBox(height: 8),
                      if (bookings.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.secondaryContainer,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text('${bookings.length} booking${bookings.length != 1 ? 's' : ''}'),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _confirmDelete(BuildContext context, Car car) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove vehicle listing?'),
        content: const Text('This will remove your vehicle listing and any pending bookings. This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error),
            onPressed: () {
              Provider.of<AppProvider>(context, listen: false).removeCar(car.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Vehicle listing removed')),
              );
            },
            child: const Text('Remove'),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6)),
        const SizedBox(width: 8),
        Flexible(child: Text(text, style: const TextStyle(fontSize: 14))),
      ],
    );
  }
}
