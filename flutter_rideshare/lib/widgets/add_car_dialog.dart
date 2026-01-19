import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/car.dart';

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

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('List Your Car'),
      content: SizedBox(
        width: 400,
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Expanded(child: _buildTextField(_driverNameController, 'Your Name', Icons.person)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildTextField(_driverPhoneController, 'Phone Number', Icons.phone)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildTextField(_carModelController, 'Car Model', Icons.directions_car)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildTextField(_carNumberController, 'Car Number', Icons.confirmation_number)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildTextField(_originController, 'From (Origin)', Icons.location_on)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildTextField(_destinationController, 'To (Destination)', Icons.location_on)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildTextField(_fareController, 'One Way Fare (\$)', Icons.attach_money, isNumber: true)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildTextField(_returnFareController, 'Return Fare (\$)', Icons.attach_money, isNumber: true)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildTimeField(_departureTimeController, 'Departure Time')),
                    const SizedBox(width: 12),
                    Expanded(child: _buildTimeField(_returnTimeController, 'Return Time')),
                  ],
                ),
                const SizedBox(height: 12),
                _buildTextField(_seatsController, 'Available Seats', Icons.event_seat, isNumber: true),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        FilledButton(onPressed: _submitForm, child: const Text('List Car')),
      ],
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, IconData icon, {bool isNumber = false}) {
    return TextFormField(
      controller: controller,
      keyboardType: isNumber ? TextInputType.number : TextInputType.text,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: const OutlineInputBorder(),
      ),
      validator: (value) => value == null || value.isEmpty ? 'Required' : null,
    );
  }

  Widget _buildTimeField(TextEditingController controller, String label) {
    return TextFormField(
      controller: controller,
      readOnly: true,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: const Icon(Icons.access_time),
        border: const OutlineInputBorder(),
      ),
      onTap: () async {
        final time = await showTimePicker(context: context, initialTime: TimeOfDay.now());
        if (time != null) {
          controller.text = time.format(context);
        }
      },
      validator: (value) => value == null || value.isEmpty ? 'Required' : null,
    );
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final car = Car(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        driverName: _driverNameController.text,
        driverPhone: _driverPhoneController.text,
        carModel: _carModelController.text,
        carNumber: _carNumberController.text,
        origin: _originController.text,
        destination: _destinationController.text,
        fare: double.tryParse(_fareController.text) ?? 0,
        returnFare: double.tryParse(_returnFareController.text) ?? 0,
        departureTime: _departureTimeController.text,
        returnTime: _returnTimeController.text,
        seatsAvailable: int.tryParse(_seatsController.text) ?? 4,
      );

      Provider.of<AppProvider>(context, listen: false).addCar(car);
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Car listed successfully!')),
      );
    }
  }
}
