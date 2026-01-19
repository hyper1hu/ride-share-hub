import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/car.dart';
import '../services/data_service.dart';
import '../widgets/add_car_dialog.dart';

class DriverScreen extends StatelessWidget {
  final VoidCallback onToggleTheme;
  final bool isDark;

  const DriverScreen({
    super.key,
    required this.onToggleTheme,
    required this.isDark,
  });

  void _showAddCarDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const AddCarDialog(),
    );
  }

  void _showDeleteConfirmation(BuildContext context, Car car) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove car listing?'),
        content: const Text('This will remove your car listing and any pending bookings. This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              context.read<DataService>().removeCar(car.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Car listing removed')),
              );
            },
            style: FilledButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.directions_car, color: colorScheme.primary),
            const SizedBox(width: 8),
            const Text('Driver Dashboard'),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode),
            onPressed: onToggleTheme,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddCarDialog(context),
        icon: const Icon(Icons.add),
        label: const Text('Add Car'),
      ),
      body: Consumer<DataService>(
        builder: (context, dataService, _) {
          final cars = dataService.cars;

          if (cars.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: colorScheme.surfaceContainerHighest,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.directions_car,
                      size: 48,
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No cars listed yet',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Start earning by listing your car',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: colorScheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                  const SizedBox(height: 24),
                  FilledButton.icon(
                    onPressed: () => _showAddCarDialog(context),
                    icon: const Icon(Icons.add),
                    label: const Text('Add Your First Car'),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: cars.length + 1,
            itemBuilder: (context, index) {
              if (index == 0) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Your Listings',
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Manage your car listings and view bookings',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurface.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                );
              }

              final car = cars[index - 1];
              final bookings = dataService.getBookingsForCar(car.id);
              final bookedSeats = dataService.getBookedSeatsForCar(car.id);

              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ListTile(
                      leading: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(Icons.directions_car, color: colorScheme.primary),
                      ),
                      title: Text(car.carModel, style: const TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: Text(car.carNumber),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.green.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              'Available',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Colors.green.shade700,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.delete_outline, color: colorScheme.error),
                            onPressed: () => _showDeleteConfirmation(context, car),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Icon(Icons.location_on, size: 16, color: colorScheme.primary),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(
                                            '${car.origin} to ${car.destination}',
                                            style: const TextStyle(fontSize: 14),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        Icon(Icons.schedule, size: 16, color: colorScheme.onSurface.withOpacity(0.5)),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Departs ${car.departureTime}, Returns ${car.returnTime}',
                                          style: TextStyle(fontSize: 13, color: colorScheme.onSurface.withOpacity(0.7)),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        Icon(Icons.phone, size: 16, color: colorScheme.onSurface.withOpacity(0.5)),
                                        const SizedBox(width: 4),
                                        Text(
                                          car.driverPhone,
                                          style: TextStyle(fontSize: 13, color: colorScheme.onSurface.withOpacity(0.7)),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Row(
                                    children: [
                                      Icon(Icons.event_seat, size: 16, color: colorScheme.onSurface.withOpacity(0.5)),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${car.seatsAvailable - bookedSeats} of ${car.seatsAvailable} seats',
                                        style: const TextStyle(fontSize: 13),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'One Way: \$${car.fare.toStringAsFixed(0)}',
                                    style: TextStyle(fontSize: 13, color: colorScheme.onSurface.withOpacity(0.7)),
                                  ),
                                  Text(
                                    'Round Trip: \$${(car.fare + car.returnFare).toStringAsFixed(0)}',
                                    style: TextStyle(fontSize: 13, color: colorScheme.onSurface.withOpacity(0.7)),
                                  ),
                                  if (bookings.isNotEmpty) ...[
                                    const SizedBox(height: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: colorScheme.secondaryContainer,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        '${bookings.length} booking${bookings.length != 1 ? 's' : ''}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: colorScheme.onSecondaryContainer,
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
