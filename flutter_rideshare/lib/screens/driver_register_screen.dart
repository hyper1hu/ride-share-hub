import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class DriverRegisterScreen extends StatefulWidget {
  const DriverRegisterScreen({super.key});

  @override
  State<DriverRegisterScreen> createState() => _DriverRegisterScreenState();
}

class _DriverRegisterScreenState extends State<DriverRegisterScreen> {
  bool _isLoginMode = true;
  final _loginFormKey = GlobalKey<FormState>();
  final _registerFormKey = GlobalKey<FormState>();
  
  final _mobileController = TextEditingController();
  final _nameController = TextEditingController();
  final _ageController = TextEditingController(text: '25');
  final _aadhaarController = TextEditingController();
  final _licenseController = TextEditingController();

  @override
  void dispose() {
    _mobileController.dispose();
    _nameController.dispose();
    _ageController.dispose();
    _aadhaarController.dispose();
    _licenseController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_loginFormKey.currentState!.validate()) return;

    final provider = context.read<AppProvider>();
    final success = await provider.loginDriver(_mobileController.text);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Welcome back!'), backgroundColor: Colors.green),
      );
      Navigator.pop(context);
    } else if (mounted) {
      setState(() => _isLoginMode = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('New driver? Please complete registration.')),
      );
    }
  }

  Future<void> _handleRegister() async {
    if (!_registerFormKey.currentState!.validate()) return;

    final provider = context.read<AppProvider>();
    final success = await provider.registerDriver(
      mobile: _mobileController.text,
      name: _nameController.text,
      age: int.parse(_ageController.text),
      aadhaarNumber: _aadhaarController.text,
      licenseNumber: _licenseController.text,
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Registration submitted! Awaiting admin verification.'),
          backgroundColor: Colors.orange,
        ),
      );
      Navigator.pop(context);
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(provider.error ?? 'Registration failed'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final colorScheme = Theme.of(context).colorScheme;

    if (provider.isDriverLoggedIn && provider.driver != null) {
      return _buildDriverProfile(provider, colorScheme);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Portal'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: colorScheme.primaryContainer.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.directions_car, size: 48, color: colorScheme.primary),
              ),
              const SizedBox(height: 24),
              Text(
                _isLoginMode ? 'Driver Login' : 'Driver Registration',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                _isLoginMode
                    ? 'Enter your mobile number to continue'
                    : 'Complete your profile to start driving',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              if (_isLoginMode) _buildLoginForm(provider) else _buildRegisterForm(provider),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => setState(() => _isLoginMode = !_isLoginMode),
                child: Text(_isLoginMode ? 'New driver? Register here' : 'Already registered? Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoginForm(AppProvider provider) {
    return Form(
      key: _loginFormKey,
      child: Column(
        children: [
          TextFormField(
            controller: _mobileController,
            keyboardType: TextInputType.phone,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(10)],
            decoration: const InputDecoration(
              labelText: 'Mobile Number',
              hintText: '10 digit mobile number',
              prefixIcon: Icon(Icons.phone),
              border: OutlineInputBorder(),
            ),
            validator: (v) => (v?.length ?? 0) < 10 ? 'Enter 10 digit mobile number' : null,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: provider.isLoading ? null : _handleLogin,
              child: provider.isLoading
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Text('Continue'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRegisterForm(AppProvider provider) {
    return Form(
      key: _registerFormKey,
      child: Column(
        children: [
          TextFormField(
            controller: _mobileController,
            keyboardType: TextInputType.phone,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(10)],
            decoration: const InputDecoration(
              labelText: 'Mobile Number',
              prefixIcon: Icon(Icons.phone),
              border: OutlineInputBorder(),
            ),
            validator: (v) => (v?.length ?? 0) < 10 ? 'Enter 10 digit mobile number' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _nameController,
            textCapitalization: TextCapitalization.words,
            decoration: const InputDecoration(
              labelText: 'Full Name',
              prefixIcon: Icon(Icons.person),
              border: OutlineInputBorder(),
            ),
            validator: (v) => (v?.length ?? 0) < 2 ? 'Enter your full name' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _ageController,
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(2)],
            decoration: const InputDecoration(
              labelText: 'Age',
              prefixIcon: Icon(Icons.cake),
              border: OutlineInputBorder(),
            ),
            validator: (v) {
              final age = int.tryParse(v ?? '') ?? 0;
              if (age < 18) return 'Must be 18 or older';
              if (age > 70) return 'Maximum age is 70';
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _aadhaarController,
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(12)],
            decoration: const InputDecoration(
              labelText: 'Aadhaar Number',
              hintText: '12 digit Aadhaar number',
              prefixIcon: Icon(Icons.credit_card),
              border: OutlineInputBorder(),
            ),
            validator: (v) => (v?.length ?? 0) != 12 ? 'Enter 12 digit Aadhaar number' : null,
          ),
          const SizedBox(height: 8),
          Text(
            'Your Aadhaar is stored securely and will be masked for privacy',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _licenseController,
            textCapitalization: TextCapitalization.characters,
            decoration: const InputDecoration(
              labelText: 'Driving License Number',
              prefixIcon: Icon(Icons.badge),
              border: OutlineInputBorder(),
            ),
            validator: (v) => (v?.length ?? 0) < 5 ? 'Enter valid license number' : null,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: provider.isLoading ? null : _handleRegister,
              child: provider.isLoading
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Text('Submit for Verification'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDriverProfile(AppProvider provider, ColorScheme colorScheme) {
    final driver = provider.driver!;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Profile'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await provider.logoutDriver();
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Logged out successfully')),
                );
              }
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: colorScheme.primaryContainer.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.person, size: 64, color: colorScheme.primary),
              ),
              const SizedBox(height: 16),
              Text(driver.name, style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              _buildStatusBadge(driver.verificationStatus, colorScheme),
              const SizedBox(height: 32),
              _buildInfoCard('Mobile', driver.mobile, Icons.phone, colorScheme),
              _buildInfoCard('Aadhaar', driver.maskedAadhaar, Icons.credit_card, colorScheme),
              _buildInfoCard('License', driver.licenseNumber, Icons.badge, colorScheme),
              const SizedBox(height: 24),
              if (driver.isApproved)
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () => Navigator.pushNamed(context, '/driver'),
                    icon: const Icon(Icons.directions_car),
                    label: const Text('Go to Dashboard'),
                  ),
                )
              else if (driver.isPending)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.orange.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.hourglass_empty, color: Colors.orange[700]),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Your registration is pending admin verification. You will be notified once approved.',
                          style: TextStyle(color: Colors.orange[700]),
                        ),
                      ),
                    ],
                  ),
                )
              else if (driver.isRejected)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.red.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.error, color: Colors.red[700]),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Your registration was rejected. Please contact support.',
                          style: TextStyle(color: Colors.red[700]),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status, ColorScheme colorScheme) {
    Color bgColor;
    Color textColor;
    IconData icon;
    String label;

    switch (status) {
      case 'approved':
        bgColor = Colors.green.withOpacity(0.1);
        textColor = Colors.green[700]!;
        icon = Icons.check_circle;
        label = 'Verified';
        break;
      case 'rejected':
        bgColor = Colors.red.withOpacity(0.1);
        textColor = Colors.red[700]!;
        icon = Icons.cancel;
        label = 'Rejected';
        break;
      default:
        bgColor = Colors.orange.withOpacity(0.1);
        textColor = Colors.orange[700]!;
        icon = Icons.hourglass_empty;
        label = 'Pending Verification';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: textColor),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(color: textColor, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildInfoCard(String label, String value, IconData icon, ColorScheme colorScheme) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerHighest.withOpacity(0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, color: colorScheme.primary),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant)),
              Text(value, style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w500)),
            ],
          ),
        ],
      ),
    );
  }
}
