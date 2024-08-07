from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import uuid
from .models import MockViva
from django.http import JsonResponse
import logging
from .services import genratevivadata

logger = logging.getLogger(__name__)

@csrf_exempt
def handle_viva_data(request):
    if request.method == 'POST':
        data = request.POST
        specialization = data.get('specialization')
        description = data.get('description')
        difficulty = data.get('difficulty')
        useremail = data.get("useremail")

        try:

            viva_response = genratevivadata(specialization,description,difficulty)

            # Generate unique vivaid
            vivaid = str(uuid.uuid4())

            # Create MockViva instance with data
            mock_viva = MockViva(
                jsonvivaresponse=viva_response,
                Specialization=specialization,
                SpecializationDescription=description,
                difficulty=difficulty,
                created_by=useremail,
                vivaid=vivaid,
            )
            
            mock_viva.save()

            # Return success response with vivaid and answer
            return JsonResponse({'success': True, 'vivaid': vivaid, 'answer': viva_response}, status=201)

        except Exception as e:
            # Log the error message for debugging
            logger.error(f"Error occurred: {e}")
            return JsonResponse({'error': 'An error occurred calling groq'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


    
@csrf_exempt
def get_mockviva_data(request, viva_id):
    if request.method == 'GET':
        try:
            mock_viva = MockViva.objects.get(pk=viva_id)
            # Serialize the entire model instance to JSON
            data = model_to_dict(mock_viva)
            return JsonResponse(data, status=200)
        except MockViva.DoesNotExist:
            return JsonResponse({'error': 'MockViva with given ID not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
@csrf_exempt
def get_interview_list(request):
    if request.method == "POST":
        try:
            data = request.POST
            useremail = data.get("created_by")

            interviews = MockViva.objects.filter(created_by=useremail)
            interview_data = [interview.to_dict() for interview in interviews]

            return JsonResponse({"success": True, "data": interview_data}, status=200)  # Use 200 for successful data retrieval

        except Exception as e:
            print(f"Error retrieving interview list: {e}")
            return JsonResponse({"error": "An error occurred while retrieving interview data"}, status=500)

    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
