import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/car.dart';
import '../models/booking.dart';

class BookingDialog extends StatefulWidget {
  final Car car;

  const BookingDialog({super.key, required this.car});

  @override
  State<BookingDialog> createState() => _BookingDialogState();
}

class _BookingDialogState extends State<BookingDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  int _seatsBooked = 1;
  String _tripType = 'one_way';
  bool _bookingSuccess = false;

  double get _totalFare {
    double fare = widget.car.fare * _seatsBooked;
    if (_tripType == 'round_trip') {
      fare += widget.car.returnFare * _seatsBooked;
    }
    return fare;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final appProvider = Provider.of<AppProvider>(context);
    final availableSeats = appProvider.getAvailableSeats(widget.car);

    if (_bookingSuccess) {
      return AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle, size: 48, color: Colors.green),
            ),
            const SizedBox(height: 16),
            Text('Booking Confirmed!', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Your ride has been booked successfully.', textAlign: TextAlign.center),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  Row(children: [
                    Icon(Icons.location_on, size: 16, color: theme.colorScheme.primary),
                    const SizedBox(width: 4),
                    Text('${widget.car.origin} to ${widget.car.destination}'),
                  ]),
                  const SizedBox(height: 8),
                  Row(children: [
                    Icon(Icons.directions_car, size: 16, color: theme.colorScheme.onSurface.withOpacity(0.6)),
                    const SizedBox(width: 4),
                    Text('${widget.car.carModel} - ${widget.car.driverName}'),
                  ]),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Text('Total: ₹${_totalFare.toStringAsFixed(0)}', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          FilledButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Done'),
          ),
        ],
      );
    }

    return AlertDialog(
      title: const Text('Book Your Ride'),
      content: SizedBox(
        width: 350,
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.location_on, size: 16, color: theme.colorScheme.primary),
                  const SizedBox(width: 4),
                  Text('${widget.car.origin} to ${widget.car.destination}'),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Your Name',
                  prefixIcon: Icon(Icons.person),
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value == null || value.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  prefixIcon: Icon(Icons.phone),
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value == null || value.length < 10 ? 'Enter valid phone' : null,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Text('Seats: '),
                  IconButton(
                    onPressed: _seatsBooked > 1 ? () => setState(() => _seatsBooked--) : null,
                    icon: const Icon(Icons.remove_circle_outline),
                  ),
                  Text('$_seatsBooked', style: theme.textTheme.titleMedium),
                  IconButton(
                    onPressed: _seatsBooked < availableSeats ? () => setState(() => _seatsBooked++) : null,
                    icon: const Icon(Icons.add_circle_outline),
                  ),
                  Text('($availableSeats available)', style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.6))),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _TripTypeCard(
                      title: 'One Way',
                      price: widget.car.fare * _seatsBooked,
                      selected: _tripType == 'one_way',
                      onTap: () => setState(() => _tripType = 'one_way'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _TripTypeCard(
                      title: 'Round Trip',
                      price: (widget.car.fare + widget.car.returnFare) * _seatsBooked,
                      selected: _tripType == 'round_trip',
                      onTap: () => setState(() => _tripType = 'round_trip'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Fare'),
                    Text('₹${_totalFare.toStringAsFixed(0)}',
                        style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        FilledButton(onPressed: _submitBooking, child: const Text('Confirm Booking')),
      ],
    );
  }

  void _submitBooking() {
    if (_formKey.currentState!.validate()) {
      final booking = Booking(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        carId: widget.car.id,
        customerName: _nameController.text,
        customerPhone: _phoneController.text,
        seatsBooked: _seatsBooked,
        tripType: _tripType,
        totalFare: _totalFare,
      );

      Provider.of<AppProvider>(context, listen: false).addBooking(booking);
      setState(() => _bookingSuccess = true);
    }
  }
}

class _TripTypeCard extends StatelessWidget {
  final String title;
  final double price;
  final bool selected;
  final VoidCallback onTap;

  const _TripTypeCard({
    required this.title,
    required this.price,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: selected ? theme.colorScheme.primary : theme.colorScheme.outline,
            width: selected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
            const SizedBox(height: 4),
            Text('₹${price.toStringAsFixed(0)}', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
