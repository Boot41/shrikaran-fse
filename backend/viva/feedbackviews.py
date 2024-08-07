from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import QuestionData
from django.http import JsonResponse
import logging
from .services import groq_chat,sendemail

logger = logging.getLogger(__name__)

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
