from .models import Reservation

def get_user_favourites(user, properties):
    """Get a list of property IDs favourited by the user."""
    return [property.id for property in properties if user in property.favourited.all()]

def filter_properties(properties, request):
    """Apply filters from the request to the properties queryset."""
    filters = {
        'host_id': request.GET.get('host_id'),
        'country': request.GET.get('country'),
        'category': request.GET.get('category'),
        'checkin_date': request.GET.get('checkIn'),
        'checkout_date': request.GET.get('checkOut'),
        'bedrooms': request.GET.get('numbBedrooms'),
        'bathrooms': request.GET.get('numBathrooms'),
        'guests': request.GET.get('numGuests'),
    }

    if filters['host_id']:
        properties = properties.filter(host_id=filters['host_id'])
    if filters['country']:
        properties = properties.filter(country=filters['country'])
    if filters['category'] and filters['category'] != 'undefined':
        properties = properties.filter(category=filters['category'])
    if filters['bedrooms']:
        properties = properties.filter(bedrooms__gte=filters['bedrooms'])
    if filters['bathrooms']:
        properties = properties.filter(bathrooms__gte=filters['bathrooms'])
    if filters['guests']:
        properties = properties.filter(guests__gte=filters['guests'])

    if filters['checkin_date'] and filters['checkout_date']:
        properties = filter_by_availability(properties, filters['checkin_date'], filters['checkout_date'])

    return properties

def filter_by_availability(properties, checkin_date, checkout_date):
    """Filter properties based on availability within the given date range."""
    exact_matches = Reservation.objects.filter(start_date=checkin_date) | Reservation.objects.filter(end_date=checkout_date)
    overlap_matches = Reservation.objects.filter(start_date__lte=checkout_date, end_date__gte=checkin_date)
    unavailable_property_ids = set(reservation.property_id for reservation in exact_matches | overlap_matches)
    
    return properties.exclude(id__in=unavailable_property_ids)
