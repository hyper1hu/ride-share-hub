import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../models/car.dart';
import '../models/booking.dart';
import '../services/data_service.dart';

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
  final _seatsController = TextEditingController(text: '1');
  String _tripType = 'one_way';
  bool _isLoading = false;
  bool _bookingSuccess = false;
  double _totalFare = 0;

  @override
  void initState() {
    super.initState();
    _calculateFare();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _seatsController.dispose();
    super.dispose();
  }

  void _calculateFare() {
    final seats = int.tryParse(_seatsController.text) ?? 1;
    double fare = widget.car.fare * seats;
    if (_tripType == 'round_trip') {
      fare += widget.car.returnFare * seats;
    }
    setState(() => _totalFare = fare);
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      final booking = Booking(
        carId: widget.car.id,
        customerName: _nameController.text,
        customerPhone: _phoneController.text,
        seatsBooked: int.parse(_seatsController.text),
        tripType: _tripType,
        totalFare: _totalFare,
      );

      final success = context.read<DataService>().addBooking(booking);

      if (success) {
        setState(() {
          _isLoading = false;
          _bookingSuccess = true;
        });
      } else {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Not enough seats available')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final availableSeats = context.read<DataService>().getAvailableSeatsForCar(widget.car.id);

    if (_bookingSuccess) {
      return Dialog(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 400),
          padding: const EdgeInsets.all(24),
          child: Column(
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
              const SizedBox(height: 20),
              const Text(
                'Booking Confirmed!',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'Your ride has been booked successfully',
                style: TextStyle(color: colorScheme.onSurface.withOpacity(0.6)),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainerHighest.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(Icons.location_on, size: 18, color: colorScheme.primary),
                        const SizedBox(width: 8),
                        Text(widget.car.origin),
                        const SizedBox(width: 8),
                        const Icon(Icons.arrow_forward, size: 16),
                        const SizedBox(width: 8),
                        Text(widget.car.destination),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Icon(Icons.directions_car, size: 18, color: colorScheme.onSurface.withOpacity(0.5)),
                        const SizedBox(width: 8),
                        Text('${widget.car.carModel} - ${widget.car.driverName}'),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Icon(Icons.schedule, size: 18, color: colorScheme.onSurface.withOpacity(0.5)),
                        const SizedBox(width: 8),
                        Text('Departure: ${widget.car.departureTime}'),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Total: \$${_totalFare.toStringAsFixed(0)}',
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Done'),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Dialog(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 420),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Book Your Ride',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.location_on, size: 18, color: colorScheme.primary),
                      const SizedBox(width: 4),
                      Text(widget.car.origin),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward, size: 16),
                      const SizedBox(width: 8),
                      Text(widget.car.destination),
                    ],
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(labelText: 'Your Name'),
                      validator: (v) => v!.length < 2 ? 'Enter your name' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _phoneController,
                      decoration: const InputDecoration(labelText: 'Phone Number'),
                      keyboardType: TextInputType.phone,
                      validator: (v) => v!.length < 10 ? 'Enter valid phone' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _seatsController,
                      decoration: InputDecoration(
                        labelText: 'Number of Seats',
                        helperText: '$availableSeats seats available',
                      ),
                      keyboardType: TextInputType.number,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      onChanged: (_) => _calculateFare(),
                      validator: (v) {
                        if (v!.isEmpty) return 'Required';
                        final n = int.tryParse(v);
                        if (n == null || n < 1) return 'At least 1 seat';
                        if (n > availableSeats) return 'Only $availableSeats available';
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    const Text('Trip Type', style: TextStyle(fontWeight: FontWeight.w500)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _TripTypeOption(
                            label: 'One Way',
                            price: '\$${(widget.car.fare * (int.tryParse(_seatsController.text) ?? 1)).toStringAsFixed(0)}',
                            isSelected: _tripType == 'one_way',
                            onTap: () {
                              setState(() => _tripType = 'one_way');
                              _calculateFare();
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _TripTypeOption(
                            label: 'Round Trip',
                            price: '\$${((widget.car.fare + widget.car.returnFare) * (int.tryParse(_seatsController.text) ?? 1)).toStringAsFixed(0)}',
                            isSelected: _tripType == 'round_trip',
                            onTap: () {
                              setState(() => _tripType = 'round_trip');
                              _calculateFare();
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: colorScheme.surfaceContainerHighest.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total Fare',
                            style: TextStyle(color: colorScheme.onSurface.withOpacity(0.6)),
                          ),
                          Text(
                            '\$${_totalFare.toStringAsFixed(0)}',
                            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FilledButton(
                      onPressed: _isLoading ? null : _submit,
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Confirm Booking'),
                    ),
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

class _TripTypeOption extends StatelessWidget {
  final String label;
  final String price;
  final bool isSelected;
  final VoidCallback onTap;

  const _TripTypeOption({
    required this.label,
    required this.price,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? colorScheme.primary : colorScheme.outline,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          color: isSelected ? colorScheme.primary.withOpacity(0.05) : null,
        ),
        child: Column(
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: isSelected ? colorScheme.primary : null,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              price,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isSelected ? colorScheme.primary : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
