DateTime parseDateTime(dynamic value) {
  if (value == null) return DateTime.now();
  if (value is DateTime) return value;

  if (value is String) {
    return DateTime.tryParse(value) ?? DateTime.now();
  }

  if (value is int) {
    return DateTime.fromMillisecondsSinceEpoch(value);
  }

  try {
    final dynamic dynamicValue = value;
    final toDate = dynamicValue.toDate;
    if (toDate is Function) {
      final dynamic result = toDate();
      if (result is DateTime) return result;
    }
  } catch (_) {
    // ignore
  }

  return DateTime.now();
}

