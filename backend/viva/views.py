from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import uuid
from .models import MockViva, QuestionData
from django.http import JsonResponse
import logging
from .services import groq_chat,sendemail,genratevivadata

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
def store_feedback(request):
    if request.method == 'POST':
        data = request.POST
        vivaid = data.get("viva_id")
        question = data.get("question")
        answer = data.get("answer")
        useranswer = data.get("useranswer")
        feedback = data.get("feedback")
        rating = data.get("rating")
        useremail = data.get("useremail")

        try:
            question_data = QuestionData(
                vivaid=vivaid,
                question=question,
                answer=answer,
                useranswer=useranswer,
                feedback=feedback,
                rating=rating,
                useremail=useremail
            )
            question_data.full_clean()  # Validate data before saving
            question_data.save()
            return JsonResponse({'success': True}, status=201)
        except (ValueError, TypeError, KeyError) as e:
            return JsonResponse({'error': f'Invalid data: {str(e)}'}, status=400)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': 'An error occurred'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt   
def get_feedback(request, vivaid):
    try:
        question_data = QuestionData.objects.filter(vivaid=vivaid).order_by('id').values()

        return JsonResponse(list(question_data), safe=False)
    except QuestionData.DoesNotExist:
        return JsonResponse({'error': 'No feedback found for this viva id'}, status=404)

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
    
logger = logging.getLogger(__name__)

@csrf_exempt
def send_email(request):
    if request.method == 'POST':
        try:
            data = request.POST
            recipient_email = data.get('to')
            subject = data.get('subject')
            message = data.get('message')

            sendemail(recipient_email,subject,message)

            return JsonResponse({"message": "Email sent successfully"}, status=200)
        except Exception as e:
            logger.error(f"Error sending email: {e}", exc_info=True)
            return JsonResponse({"message": str(e)}, status=500)
    return JsonResponse({"message": "Invalid request method"}, status=400)

@csrf_exempt
def genrate_Feedback(request):
    if request.method == "POST":
        data = request.POST
        inputprompt = data.get("prompt")
        try:
            feedbackresponse = groq_chat(inputprompt)
            return JsonResponse({"feedback" : feedbackresponse}, status=201)
            
        except Exception as e:
            # Log the error message for debugging
            logger.error(f"Error occurred: {e}")
            return JsonResponse({'error': 'An error occurred calling groq'}, status=500)
    
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)






