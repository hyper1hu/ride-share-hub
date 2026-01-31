import 'backend.dart';
import 'simple_backend.dart';

class BackendBootstrap {
  static Future<RideShareBackend> initialize() async {
    // Simple in-memory backend - no external dependencies
    await Future.delayed(const Duration(milliseconds: 100));
    return SimpleBackend();
  }
}
