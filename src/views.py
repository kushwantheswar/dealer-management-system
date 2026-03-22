from django.http import JsonResponse
from .models import Vehicle, Customer

def get_customer_by_vehicle(request):
    # 1. Get the vehicle number from the request
    vehicle_number = request.GET.get('registrationNo', None)
    
    if not vehicle_number:
        return JsonResponse({'error': 'No vehicle number provided'}, status=400)

    try:
        # 2. Find the vehicle in the database (case insensitive)
        # Assuming your model field is 'registration_number'
        vehicle = Vehicle.objects.get(registration_number__iexact=vehicle_number)
        
        # 3. Get the linked customer
        customer = vehicle.customer 

        # 4. Return customer details
        data = {
            'exists': True,
            'customerName': customer.name,
            'mobile': customer.mobile,
            'email': customer.email,
            'address': customer.address, # If you have this field
        }
        return JsonResponse(data)

    except Vehicle.DoesNotExist:
        # 5. If not found, return exists: False
        return JsonResponse({'exists': False})