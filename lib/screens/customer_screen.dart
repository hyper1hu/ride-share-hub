import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/car.dart';
import '../services/data_service.dart';
import '../widgets/booking_dialog.dart';

class CustomerScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  final bool isDark;

  const CustomerScreen({
    super.key,
    required this.onToggleTheme,
    required this.isDark,
  });

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

  void _showBookingDialog(Car car) {
    showDialog(
      context: context,
      builder: (context) => BookingDialog(car: car),
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
            Icon(Icons.people, color: colorScheme.primary),
            const SizedBox(width: 8),
            const Text('Find Your Ride'),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(widget.isDark ? Icons.light_mode : Icons.dark_mode),
            onPressed: widget.onToggleTheme,
          ),
        ],
      ),
      body: Consumer<DataService>(
        builder: (context, dataService, _) {
          final cars = dataService.searchCars(
            origin: _originController.text,
            destination: _destinationController.text,
          );

          return Column(
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
                            hintText: 'From (origin)',
                            prefixIcon: Icon(Icons.location_on, color: colorScheme.primary),
                          ),
                          onChanged: (_) => setState(() {}),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Icon(Icons.arrow_forward, color: colorScheme.onSurface.withOpacity(0.5)),
                      ),
                      Expanded(
                        child: TextField(
                          controller: _destinationController,
                          decoration: InputDecoration(
                            hintText: 'To (destination)',
                            prefixIcon: Icon(Icons.location_on, color: colorScheme.error),
                          ),
                          onChanged: (_) => setState(() {}),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Expanded(
                child: cars.isEmpty
                    ? Center(
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
                                Icons.search_off,
                                size: 48,
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No rides available',
                              style: theme.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _originController.text.isNotEmpty || _destinationController.text.isNotEmpty
                                  ? 'Try adjusting your search filters'
                                  : 'Check back later for available rides',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: colorScheme.onSurface.withOpacity(0.6),
                              ),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: cars.length + 1,
                        itemBuilder: (context, index) {
                          if (index == 0) {
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: Text(
                                '${cars.length} ride${cars.length != 1 ? 's' : ''} available',
                                style: theme.textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            );
                          }
                          final car = cars[index - 1];
                          final availableSeats = dataService.getAvailableSeatsForCar(car.id);
                          
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Icon(Icons.location_on, size: 18, color: colorScheme.primary),
                                      const SizedBox(width: 4),
                                      Text(car.origin, style: const TextStyle(fontWeight: FontWeight.w500)),
                                      const SizedBox(width: 8),
                                      Icon(Icons.arrow_forward, size: 16, color: colorScheme.onSurface.withOpacity(0.5)),
                                      const SizedBox(width: 8),
                                      Icon(Icons.location_on, size: 18, color: colorScheme.error),
                                      const SizedBox(width: 4),
                                      Text(car.destination, style: const TextStyle(fontWeight: FontWeight.w500)),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Wrap(
                                    spacing: 16,
                                    runSpacing: 8,
                                    children: [
                                      _InfoChip(icon: Icons.directions_car, text: '${car.carModel} (${car.carNumber})'),
                                      _InfoChip(icon: Icons.person, text: car.driverName),
                                      _InfoChip(icon: Icons.event_seat, text: '$availableSeats seats'),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Icon(Icons.schedule, size: 16, color: colorScheme.onSurface.withOpacity(0.5)),
                                      const SizedBox(width: 4),
                                      Text('Departs: ${car.departureTime}', style: theme.textTheme.bodySmall),
                                      const SizedBox(width: 16),
                                      Text('Returns: ${car.returnTime}', style: theme.textTheme.bodySmall),
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
                                                  color: colorScheme.secondaryContainer,
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: Text('One Way', style: TextStyle(fontSize: 12, color: colorScheme.onSecondaryContainer)),
                                              ),
                                              const SizedBox(width: 8),
                                              Text('\$${car.fare.toStringAsFixed(0)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                                decoration: BoxDecoration(
                                                  border: Border.all(color: colorScheme.outline),
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: Text('Round Trip', style: TextStyle(fontSize: 12, color: colorScheme.onSurface.withOpacity(0.7))),
                                              ),
                                              const SizedBox(width: 8),
                                              Text('\$${(car.fare + car.returnFare).toStringAsFixed(0)}', style: TextStyle(fontSize: 14, color: colorScheme.onSurface.withOpacity(0.7))),
                                            ],
                                          ),
                                        ],
                                      ),
                                      FilledButton(
                                        onPressed: availableSeats > 0 ? () => _showBookingDialog(car) : null,
                                        child: const Text('Book Now'),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String text;

  const _InfoChip({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: colorScheme.onSurface.withOpacity(0.5)),
        const SizedBox(width: 4),
        Text(text, style: TextStyle(fontSize: 13, color: colorScheme.onSurface.withOpacity(0.7))),
      ],
    );
  }
}
