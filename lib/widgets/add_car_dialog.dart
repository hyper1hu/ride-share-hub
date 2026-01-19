import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../models/car.dart';
import '../services/data_service.dart';

class AddCarDialog extends StatefulWidget {
  const AddCarDialog({super.key});

  @override
  State<AddCarDialog> createState() => _AddCarDialogState();
}

class _AddCarDialogState extends State<AddCarDialog> {
  final _formKey = GlobalKey<FormState>();
  final _driverNameController = TextEditingController();
  final _driverPhoneController = TextEditingController();
  final _carModelController = TextEditingController();
  final _carNumberController = TextEditingController();
  final _originController = TextEditingController();
  final _destinationController = TextEditingController();
  final _fareController = TextEditingController();
  final _returnFareController = TextEditingController();
  final _departureTimeController = TextEditingController();
  final _returnTimeController = TextEditingController();
  final _seatsController = TextEditingController(text: '4');

  bool _isLoading = false;

  @override
  void dispose() {
    _driverNameController.dispose();
    _driverPhoneController.dispose();
    _carModelController.dispose();
    _carNumberController.dispose();
    _originController.dispose();
    _destinationController.dispose();
    _fareController.dispose();
    _returnFareController.dispose();
    _departureTimeController.dispose();
    _returnTimeController.dispose();
    _seatsController.dispose();
    super.dispose();
  }

  Future<void> _selectTime(TextEditingController controller) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null) {
      controller.text = '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
    }
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      final car = Car(
        driverName: _driverNameController.text,
        driverPhone: _driverPhoneController.text,
        carModel: _carModelController.text,
        carNumber: _carNumberController.text,
        origin: _originController.text,
        destination: _destinationController.text,
        fare: double.parse(_fareController.text),
        returnFare: double.parse(_returnFareController.text),
        departureTime: _departureTimeController.text,
        returnTime: _returnTimeController.text,
        seatsAvailable: int.parse(_seatsController.text),
      );

      context.read<DataService>().addCar(car);

      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Car listed successfully!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500, maxHeight: 600),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'List Your Car',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Add your car details to start accepting bookings',
                          style: TextStyle(fontSize: 14, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _driverNameController,
                              decoration: const InputDecoration(labelText: 'Your Name'),
                              validator: (v) => v!.length < 2 ? 'Enter your name' : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _driverPhoneController,
                              decoration: const InputDecoration(labelText: 'Phone Number'),
                              keyboardType: TextInputType.phone,
                              validator: (v) => v!.length < 10 ? 'Enter valid phone' : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _carModelController,
                              decoration: const InputDecoration(labelText: 'Car Model'),
                              validator: (v) => v!.isEmpty ? 'Required' : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _carNumberController,
                              decoration: const InputDecoration(labelText: 'Car Number'),
                              validator: (v) => v!.isEmpty ? 'Required' : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _originController,
                              decoration: const InputDecoration(labelText: 'From (Origin)'),
                              validator: (v) => v!.isEmpty ? 'Required' : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _destinationController,
                              decoration: const InputDecoration(labelText: 'To (Destination)'),
                              validator: (v) => v!.isEmpty ? 'Required' : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _fareController,
                              decoration: const InputDecoration(labelText: 'One Way Fare (\$)'),
                              keyboardType: TextInputType.number,
                              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                              validator: (v) => v!.isEmpty ? 'Required' : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _returnFareController,
                              decoration: const InputDecoration(labelText: 'Return Fare (\$)'),
                              keyboardType: TextInputType.number,
                              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                              validator: (v) => v!.isEmpty ? 'Required' : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _departureTimeController,
                              decoration: const InputDecoration(
                                labelText: 'Departure Time',
                                suffixIcon: Icon(Icons.access_time),
                              ),
                              readOnly: true,
                              onTap: () => _selectTime(_departureTimeController),
                              validator: (v) => v!.isEmpty ? 'Required' : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _returnTimeController,
                              decoration: const InputDecoration(
                                labelText: 'Return Time',
                                suffixIcon: Icon(Icons.access_time),
                              ),
                              readOnly: true,
                              onTap: () => _selectTime(_returnTimeController),
                              validator: (v) => v!.isEmpty ? 'Required' : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _seatsController,
                        decoration: const InputDecoration(labelText: 'Available Seats'),
                        keyboardType: TextInputType.number,
                        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                        validator: (v) {
                          if (v!.isEmpty) return 'Required';
                          final n = int.tryParse(v);
                          if (n == null || n < 1 || n > 10) return '1-10 seats';
                          return null;
                        },
                      ),
                    ],
                  ),
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
                          : const Text('List Car'),
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
