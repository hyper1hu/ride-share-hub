import 'package:flutter/material.dart';

class VehicleMarker extends StatelessWidget {
  final String vehicleType;
  final bool isAvailable;
  final VoidCallback? onTap;

  const VehicleMarker({
    super.key,
    required this.vehicleType,
    this.isAvailable = true,
    this.onTap,
  });

  IconData _getVehicleIcon() {
    switch (vehicleType.toLowerCase()) {
      case 'car':
        return Icons.directions_car;
      case 'bike':
        return Icons.two_wheeler;
      case 'auto':
        return Icons.electric_rickshaw;
      case 'tempo':
      case 'mini-bus':
      case 'bus':
        return Icons.directions_bus;
      case 'maxi-cab':
        return Icons.airport_shuttle;
      default:
        return Icons.local_taxi;
    }
  }

  Color _getVehicleColor() {
    if (!isAvailable) return Colors.grey;
    
    switch (vehicleType.toLowerCase()) {
      case 'car':
        return const Color(0xFF3B82F6); // Blue
      case 'bike':
        return const Color(0xFFF59E0B); // Orange
      case 'auto':
        return const Color(0xFF14B8A6); // Teal
      case 'tempo':
        return const Color(0xFF8B5CF6); // Purple
      case 'mini-bus':
        return const Color(0xFFEC4899); // Pink
      case 'bus':
        return const Color(0xFF10B981); // Green
      case 'maxi-cab':
        return const Color(0xFFEF4444); // Red
      default:
        return const Color(0xFF3B82F6);
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getVehicleColor();
    
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.4),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            Center(
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  _getVehicleIcon(),
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ),
            if (!isAvailable)
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class LocationMarker extends StatelessWidget {
  final bool isPickup;
  final String? label;

  const LocationMarker({
    super.key,
    this.isPickup = true,
    this.label,
  });

  @override
  Widget build(BuildContext context) {
    final color = isPickup ? const Color(0xFF14B8A6) : const Color(0xFFEF4444);
    
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              label!,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 3),
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: 0.4),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Container(
              width: 12,
              height: 12,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class LandmarkMarker extends StatelessWidget {
  final String name;
  final String type;
  final VoidCallback? onTap;

  const LandmarkMarker({
    super.key,
    required this.name,
    required this.type,
    this.onTap,
  });

  IconData _getIcon() {
    switch (type) {
      case 'station':
        return Icons.train;
      case 'airport':
        return Icons.flight;
      case 'tourist':
        return Icons.landscape;
      case 'monument':
        return Icons.account_balance;
      default:
        return Icons.location_city;
    }
  }

  Color _getColor() {
    switch (type) {
      case 'station':
        return const Color(0xFF8B5CF6);
      case 'airport':
        return const Color(0xFF3B82F6);
      case 'tourist':
        return const Color(0xFF10B981);
      case 'monument':
        return const Color(0xFFF59E0B);
      default:
        return const Color(0xFF6B7280);
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getColor();
    
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            margin: const EdgeInsets.only(bottom: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(6),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              name,
              style: TextStyle(
                color: color,
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2),
              boxShadow: [
                BoxShadow(
                  color: color.withValues(alpha: 0.3),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Icon(
              _getIcon(),
              color: Colors.white,
              size: 14,
            ),
          ),
        ],
      ),
    );
  }
}
