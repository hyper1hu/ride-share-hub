import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/map_service.dart';
import '../data/landmarks.dart';
import 'vehicle_marker.dart';

class RouteMapView extends StatelessWidget {
  final LatLng? pickupLocation;
  final LatLng? dropLocation;
  final List<LatLng>? routePoints;
  final bool showLandmarks;
  final bool showControls;
  final MapController? mapController;
  final Function(LatLng)? onMapTap;

  const RouteMapView({
    super.key,
    this.pickupLocation,
    this.dropLocation,
    this.routePoints,
    this.showLandmarks = false,
    this.showControls = true,
    this.mapController,
    this.onMapTap,
  });

  @override
  Widget build(BuildContext context) {
    final mapService = MapService();

    // Calculate center and zoom
    final center = pickupLocation ?? mapService.getDefaultCenter();
    double zoom = 13.0;

    if (pickupLocation != null && dropLocation != null) {
      final distance = mapService.calculateDistance(pickupLocation!, dropLocation!);
      zoom = mapService.calculateZoomLevel(distance);
    }

    // Get route points if not provided
    final points = routePoints ??
        (pickupLocation != null && dropLocation != null
            ? mapService.generateRoutePoints(pickupLocation!, dropLocation!)
            : <LatLng>[]);

    // Get nearby landmarks
    final landmarks = showLandmarks && pickupLocation != null
        ? mapService.getNearbyLandmarks(pickupLocation!, 5.0)
        : <Landmark>[];

    return Stack(
      children: [
        FlutterMap(
          mapController: mapController,
          options: MapOptions(
            initialCenter: center,
            initialZoom: zoom,
            onTap: onMapTap != null
                ? (tapPosition, point) => onMapTap!(point)
                : null,
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.chalooride.app',
            ),
            // Route polyline
            if (points.isNotEmpty)
              PolylineLayer(
                polylines: [
                  Polyline(
                    points: points,
                    color: const Color(0xFF3B82F6),
                    strokeWidth: 4.0,
                    borderColor: Colors.white,
                    borderStrokeWidth: 2.0,
                  ),
                ],
              ),
            // Landmarks
            if (showLandmarks && landmarks.isNotEmpty)
              MarkerLayer(
                markers: landmarks.map((landmark) {
                  return Marker(
                    point: landmark.location,
                    width: 80,
                    height: 50,
                    child: LandmarkMarker(
                      name: landmark.name,
                      type: landmark.type,
                    ),
                  );
                }).toList(),
              ),
            // Location markers
            MarkerLayer(
              markers: [
                if (pickupLocation != null)
                  Marker(
                    point: pickupLocation!,
                    width: 80,
                    height: 60,
                    child: const LocationMarker(
                      isPickup: true,
                      label: 'Pickup',
                    ),
                  ),
                if (dropLocation != null)
                  Marker(
                    point: dropLocation!,
                    width: 80,
                    height: 60,
                    child: const LocationMarker(
                      isPickup: false,
                      label: 'Drop',
                    ),
                  ),
              ],
            ),
          ],
        ),
        // Map controls
        if (showControls)
          Positioned(
            right: 16,
            bottom: 100,
            child: Column(
              children: [
                _MapControlButton(
                  icon: Icons.add,
                  onPressed: () {
                    mapController?.move(
                      mapController!.camera.center,
                      mapController!.camera.zoom + 1,
                    );
                  },
                ),
                const SizedBox(height: 8),
                _MapControlButton(
                  icon: Icons.remove,
                  onPressed: () {
                    mapController?.move(
                      mapController!.camera.center,
                      mapController!.camera.zoom - 1,
                    );
                  },
                ),
                const SizedBox(height: 8),
                _MapControlButton(
                  icon: Icons.my_location,
                  onPressed: () {
                    if (pickupLocation != null) {
                      mapController?.move(pickupLocation!, 15.0);
                    }
                  },
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class _MapControlButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;

  const _MapControlButton({
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(12),
          child: Icon(
            icon,
            color: const Color(0xFF3B82F6),
            size: 24,
          ),
        ),
      ),
    );
  }
}

class VehicleMapView extends StatelessWidget {
  final List<Map<String, dynamic>> vehicles;
  final LatLng center;
  final double zoom;
  final Function(Map<String, dynamic>)? onVehicleTap;

  const VehicleMapView({
    super.key,
    required this.vehicles,
    required this.center,
    this.zoom = 13.0,
    this.onVehicleTap,
  });

  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      options: MapOptions(
        initialCenter: center,
        initialZoom: zoom,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.rideshare.rideshare',
        ),
        MarkerLayer(
          markers: vehicles.map((vehicle) {
            // Assuming vehicle has lat/lng or using center as fallback
            final lat = vehicle['latitude'] as double? ?? center.latitude;
            final lng = vehicle['longitude'] as double? ?? center.longitude;

            return Marker(
              point: LatLng(lat, lng),
              width: 44,
              height: 44,
              child: VehicleMarker(
                vehicleType: vehicle['type'] ?? 'car',
                isAvailable: vehicle['isAvailable'] ?? true,
                onTap: onVehicleTap != null
                    ? () => onVehicleTap!(vehicle)
                    : null,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
