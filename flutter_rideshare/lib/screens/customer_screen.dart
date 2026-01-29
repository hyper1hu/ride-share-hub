import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/car.dart';
import '../data/locations.dart';
import '../models/booking.dart';

class CustomerScreen extends StatefulWidget {
  const CustomerScreen({super.key});

  @override
  State<CustomerScreen> createState() => _CustomerScreenState();
}

class _CustomerScreenState extends State<CustomerScreen> {
  final _originController = TextEditingController();
  final _destinationController = TextEditingController();
  List<Car> _searchResults = [];
  bool _isLoading = false;
  bool _hasSearched = false;

  @override
  void initState() {
    super.initState();
    _loadCars();
  }

  @override
  void dispose() {
    _originController.dispose();
    _destinationController.dispose();
    super.dispose();
  }

  Future<void> _loadCars() async {
    setState(() => _isLoading = true);
    _searchResults = await context.read<AppProvider>().searchCars(origin: '', destination: '');
    setState(() {
      _isLoading = false;
      _hasSearched = true;
    });
  }

  Future<void> _searchCars() async {
    setState(() => _isLoading = true);
    _searchResults = await context.read<AppProvider>().searchCars(
          origin: _originController.text,
          destination: _destinationController.text,
        );
    setState(() {
      _isLoading = false;
      _hasSearched = true;
    });
  }

  IconData _getVehicleIcon(String type) {
    switch (type) {
      case 'bus':
      case 'minibus':
        return Icons.directions_bus;
      case 'motorcycle':
        return Icons.two_wheeler;
      case 'auto_rickshaw':
        return Icons.electric_rickshaw;
      case 'truck':
        return Icons.local_shipping;
      case 'suv':
        return Icons.directions_car_filled;
      case 'van':
        return Icons.airport_shuttle;
      default:
        return Icons.directions_car;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final appProvider = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.search, color: theme.colorScheme.primary),
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
              child: Column(
                children: [
                  _buildLocationField(
                    controller: _originController,
                    hint: 'Pickup Location',
                    icon: Icons.my_location,
                    iconColor: theme.colorScheme.primary,
                  ),
                  const SizedBox(height: 12),
                  _buildLocationField(
                    controller: _destinationController,
                    hint: 'Drop Location',
                    icon: Icons.location_on,
                    iconColor: theme.colorScheme.error,
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      onPressed: _searchCars,
                      icon: const Icon(Icons.search),
                      label: const Text('Search Rides'),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _searchResults.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_off, size: 64, color: theme.colorScheme.onSurface.withValues(alpha: 0.3)),
                            const SizedBox(height: 16),
                            Text(_hasSearched ? 'No rides available' : 'Search for rides',
                                style: theme.textTheme.titleLarge),
                            const SizedBox(height: 8),
                            Text(
                              _hasSearched ? 'Try different locations' : 'Enter pickup and drop locations',
                              style: TextStyle(color: theme.colorScheme.onSurface.withValues(alpha: 0.6)),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: _searchResults.length,
                        itemBuilder: (context, index) {
                          final car = _searchResults[index];
                          return _CarCard(car: car, getVehicleIcon: _getVehicleIcon);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    required Color iconColor,
  }) {
    return Autocomplete<String>(
      optionsBuilder: (textEditingValue) {
        if (textEditingValue.text.isEmpty) {
          return LocationData.allLocationNames.take(10);
        }
        return LocationData.searchLocations(textEditingValue.text).take(10);
      },
      onSelected: (selection) {
        controller.text = selection;
      },
      fieldViewBuilder: (context, textController, focusNode, onEditingComplete) {
        textController.text = controller.text;
        textController.addListener(() => controller.text = textController.text);
        return TextField(
          controller: textController,
          focusNode: focusNode,
          onEditingComplete: onEditingComplete,
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: iconColor),
            hintText: hint,
            border: const OutlineInputBorder(),
          ),
        );
      },
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
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer,
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
                              color: theme.colorScheme.secondaryContainer,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(car.vehicleTypeLabel, style: const TextStyle(fontSize: 10)),
                          ),
                        ],
                      ),
                      Text(car.carNumber, style: TextStyle(color: theme.colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Icon(Icons.location_on, size: 18, color: theme.colorScheme.primary),
                const SizedBox(width: 4),
                Text(car.origin, style: const TextStyle(fontWeight: FontWeight.w500)),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: Icon(Icons.arrow_forward, size: 16),
                ),
                Icon(Icons.location_on, size: 18, color: theme.colorScheme.error),
                const SizedBox(width: 4),
                Expanded(child: Text(car.destination, style: const TextStyle(fontWeight: FontWeight.w500))),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 16,
              runSpacing: 8,
              children: [
                _InfoChip(icon: Icons.person, label: car.driverName),
                _InfoChip(icon: Icons.event_seat, label: '${car.seatsAvailable} seats'),
                _InfoChip(icon: Icons.access_time, label: car.departureTime),
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
                            color: theme.colorScheme.primaryContainer,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('One Way', style: TextStyle(fontSize: 11)),
                        ),
                        const SizedBox(width: 8),
                        Text('₹${car.fare.toStringAsFixed(0)}',
                            style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
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
                          child: const Text('Round Trip', style: TextStyle(fontSize: 11)),
                        ),
                        const SizedBox(width: 8),
                        Text('₹${(car.fare + car.returnFare).toStringAsFixed(0)}',
                            style: TextStyle(color: theme.colorScheme.onSurface.withValues(alpha: 0.7))),
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
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _BookingSheet(car: car),
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
        Icon(icon, size: 16, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6)),
        const SizedBox(width: 4),
        Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.8), fontSize: 13)),
      ],
    );
  }
}

class _BookingSheet extends StatefulWidget {
  final Car car;
  const _BookingSheet({required this.car});

  @override
  State<_BookingSheet> createState() => _BookingSheetState();
}

class _BookingSheetState extends State<_BookingSheet> {
  final _mobileController = TextEditingController();
  final _nameController = TextEditingController();
  final _ageController = TextEditingController(text: '25');
  int _seats = 1;
  String _tripType = 'one_way';
  bool _isLoading = false;
  bool _needsRegistration = false;

  @override
  void dispose() {
    _mobileController.dispose();
    _nameController.dispose();
    _ageController.dispose();
    super.dispose();
  }

  double get _totalFare {
    final baseFare = _tripType == 'round_trip' 
        ? widget.car.fare + widget.car.returnFare 
        : widget.car.fare;
    return baseFare * _seats;
  }

  Future<void> _checkCustomer() async {
    if (_mobileController.text.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter valid mobile number')),
      );
      return;
    }

    setState(() => _isLoading = true);
    final customer = await context.read<AppProvider>().backend.loginCustomer(_mobileController.text);
    setState(() => _isLoading = false);

    if (customer != null) {
      _nameController.text = customer.name;
      _confirmBooking();
    } else {
      setState(() => _needsRegistration = true);
    }
  }

  Future<void> _registerAndBook() async {
    if (_nameController.text.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter your name')),
      );
      return;
    }

    setState(() => _isLoading = true);
    final customer = await context.read<AppProvider>().backend.registerCustomer(
          _mobileController.text,
          _nameController.text,
          int.tryParse(_ageController.text) ?? 25,
        );
    setState(() => _isLoading = false);

    if (customer != null) {
      await _createBooking(customerName: customer.name);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration failed'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _createBooking({required String customerName}) async {
    final provider = context.read<AppProvider>();
    final booking = Booking(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      carId: widget.car.id,
      customerName: customerName,
      customerPhone: _mobileController.text,
      seatsBooked: _seats,
      tripType: _tripType,
      totalFare: _totalFare,
    );

    setState(() => _isLoading = true);
    final created = await provider.createBooking(booking);
    setState(() => _isLoading = false);

    if (created != null) {
      _confirmBooking();
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(provider.error ?? 'Booking failed'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _confirmBooking() {
    Navigator.pop(context);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        icon: const Icon(Icons.check_circle, color: Colors.green, size: 48),
        title: const Text('Booking Confirmed!'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${widget.car.origin} → ${widget.car.destination}'),
            const SizedBox(height: 8),
            Text('Vehicle: ${widget.car.carModel}'),
            Text('Driver: ${widget.car.driverName}'),
            Text('Seats: $_seats'),
            const SizedBox(height: 8),
            Text('Total: ₹${_totalFare.toStringAsFixed(0)}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        actions: [
          FilledButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: theme.colorScheme.onSurface.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text('Book Your Ride', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('${widget.car.origin} → ${widget.car.destination}',
              style: TextStyle(color: theme.colorScheme.onSurface.withValues(alpha: 0.7))),
          const SizedBox(height: 24),
          TextField(
            controller: _mobileController,
            keyboardType: TextInputType.phone,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(10)],
            decoration: const InputDecoration(
              labelText: 'Mobile Number',
              prefixIcon: Icon(Icons.phone),
              border: OutlineInputBorder(),
            ),
          ),
          if (_needsRegistration) ...[
            const SizedBox(height: 16),
            TextField(
              controller: _nameController,
              textCapitalization: TextCapitalization.words,
              decoration: const InputDecoration(
                labelText: 'Your Name',
                prefixIcon: Icon(Icons.person),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _ageController,
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              decoration: const InputDecoration(
                labelText: 'Age',
                prefixIcon: Icon(Icons.cake),
                border: OutlineInputBorder(),
              ),
            ),
          ],
          const SizedBox(height: 24),
          Text('Trip Type', style: theme.textTheme.titleSmall),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _TripOption(
                  label: 'One Way',
                  price: '₹${widget.car.fare.toStringAsFixed(0)}',
                  isSelected: _tripType == 'one_way',
                  onTap: () => setState(() => _tripType = 'one_way'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _TripOption(
                  label: 'Round Trip',
                  price: '₹${(widget.car.fare + widget.car.returnFare).toStringAsFixed(0)}',
                  isSelected: _tripType == 'round_trip',
                  onTap: () => setState(() => _tripType = 'round_trip'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Text('Seats:', style: theme.textTheme.titleSmall),
              const Spacer(),
              IconButton(
                onPressed: _seats > 1 ? () => setState(() => _seats--) : null,
                icon: const Icon(Icons.remove_circle_outline),
              ),
              Text('$_seats', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
              IconButton(
                onPressed: _seats < widget.car.seatsAvailable ? () => setState(() => _seats++) : null,
                icon: const Icon(Icons.add_circle_outline),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.colorScheme.primaryContainer.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(12),
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
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _isLoading
                  ? null
                  : _needsRegistration
                      ? _registerAndBook
                      : _checkCustomer,
              child: _isLoading
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                  : Text(_needsRegistration ? 'Register & Book' : 'Continue'),
            ),
          ),
        ],
        ),
      ),
    );
  }
}

class _TripOption extends StatelessWidget {
  final String label;
  final String price;
  final bool isSelected;
  final VoidCallback onTap;

  const _TripOption({
    required this.label,
    required this.price,
    required this.isSelected,
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
          color: isSelected ? theme.colorScheme.primaryContainer : null,
          border: Border.all(
            color: isSelected ? theme.colorScheme.primary : theme.colorScheme.outline,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(label, style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
            const SizedBox(height: 4),
            Text(price, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
