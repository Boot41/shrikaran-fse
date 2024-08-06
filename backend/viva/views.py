from django.forms.models import model_to_dict
from groq import Groq
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import uuid
from .models import MockViva, QuestionData
import pdb


client = Groq(
    api_key="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",
)

@csrf_exempt
def handle_viva_data(request):
    if request.method == 'POST':
        data = request.POST
        specialization = data.get('specialization')
        description = data.get('description')
        difficulty = data.get('difficulty')
        useremail = data.get("useremail")

        inputprompt = f"Specialization: {specialization}, subject: {description}, difficulty: {difficulty}, medium based on this information give 5 viva question and answeres in json format give question and answer in field as json dont give any other data no addtional data like Here are 5 viva questions and answers related to the anatomy of the body, with a difficulty level of easy to medium just the json data beacuse i have to parse it into json i dont need any additional data just the json ur giving even the aditinal data which is making my application not run dont give addtional data just the json response so that i can parse it ur give this 'Here are the 5 viva questions and answers in JSON format:' dont even give this i just plain json data"

        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": inputprompt,
                    }
                ],
                model="llama3-8b-8192",
            )
            result = chat_completion.choices[0].message.content
            viva_response = result

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

            # Save the data to the database
            print(viva_response)  # Debugging purpose
            
            mock_viva.save()

            # Return success response with vivaid and answer
            return JsonResponse({'success': True, 'vivaid': vivaid, 'answer': viva_response}, status=201)

        except Exception as e:
            # Log the error message for debugging
            print(f"Error occurred: {e}")
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
            print(data)
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
            print("this is the response",vivaid,question,answer,useranswer,feedback,rating,useremail)
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
        print(list(question_data))
        return JsonResponse(list(question_data), safe=False)
    except QuestionData.DoesNotExist:
        return JsonResponse({'error': 'No feedback found for this viva id'}, status=404)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt  # Only use for specific, idempotent views

@csrf_exempt
def get_interview_list(request):
    if request.method == "POST":
        try:
            data = request.POST
            useremail = data.get("created_by")

            interviews = MockViva.objects.filter(created_by=useremail)
            interview_data = [interview.to_dict() for interview in interviews]

            print(interview_data)

            return JsonResponse({"success": True, "data": interview_data}, status=200)  # Use 200 for successful data retrieval

        except Exception as e:
            print(f"Error retrieving interview list: {e}")
            return JsonResponse({"error": "An error occurred while retrieving interview data"}, status=500)

    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
    
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def send_email(request):
    if request.method == 'POST':
        try:
            # pdb.set_trace()
            data = request.POST
            recipient_email = data.get('to')
            subject = data.get('subject')
            message = data.get('message')

           

            send_mail(
                subject,
                message,
                'shrikaranksmycoding@gmail.com',  # From email
                [recipient_email],
                fail_silently=False,
            )
            return JsonResponse({"message": "Email sent successfully"}, status=200)
        except Exception as e:
            logger.error(f"Error sending email: {e}", exc_info=True)
            return JsonResponse({"message": str(e)}, status=500)
    return JsonResponse({"message": "Invalid request method"}, status=400)


def check():
    all_objs = MockViva.objects.all()
    for data in all_objs:
        print(data.vivaid)




