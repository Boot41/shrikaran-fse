import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import uuid
import google.generativeai as genai
from .models import MockViva
from django.forms.models import model_to_dict


# @csrf_exempt
# def handle_viva_data(request):
#     if request.method == 'POST':
#         data = request.POST
#         specialization = data.get('specialization')
#         description = data.get('description')
#         difficulty = data.get('difficulty')
#         useremail = data.get("useremail")

#         inputprompt = f"Specialization: {specialization}, subject: {description}, difficulty: {difficulty}, medium based on this information give 5 viva question and answeres in json format give question and answer in field as json"

#         try:
#             result = chat_session.send_message(inputprompt)
#             viva_response = {'answer': result.text}

#             # Generate unique vivaid
#             vivaid = str(uuid.uuid4())

#             # Create MockViva instance with data
#             mock_viva = MockViva(
#                 jsonvivaresponse=viva_response['answer'],
#                 Specialization=specialization,
#                 SpecializationDescription=description,
#                 difficulty=difficulty,
#                 created_by=useremail,  # Replace with actual user name (optional)
#                 vivaid=vivaid,
#             )

#             # Save the data to the database
#             mock_viva.save()
#             check()

#             # Return success response with vivaid and answer
#             return JsonResponse({'success': True, 'vivaid': vivaid, 'answer': viva_response['answer']}, status=201)

#         except Exception as e:
#             # Handle the exception without logging
#             return JsonResponse({'error': 'An error occurred'}, status=500)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=400)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import uuid
# Assume chat_session and MockViva are properly imported and set up

@csrf_exempt
def handle_viva_data(request):
    if request.method == 'POST':
        data = request.POST
        specialization = data.get('specialization')
        description = data.get('description')
        difficulty = data.get('difficulty')
        useremail = data.get("useremail")

        inputprompt = f"Specialization: {specialization}, subject: {description}, difficulty: {difficulty}, medium based on this information give 5 viva question and answeres in json format give question and answer in field as json"

        try:
            result = chat_session.send_message(inputprompt)
            viva_response = result.text

            # Clean the viva response by removing "```json" and "```"
            cleaned_viva_response = viva_response.replace("```json", "").replace("```").strip()

            # Generate unique vivaid
            vivaid = str(uuid.uuid4())

            # Create MockViva instance with data
            mock_viva = MockViva(
                jsonvivaresponse=cleaned_viva_response,
                Specialization=specialization,
                SpecializationDescription=description,
                difficulty=difficulty,
                created_by=useremail,  # Replace with actual user name (optional)
                vivaid=vivaid,
            )

            # Save the data to the database
            mock_viva.save()

            # Return success response with vivaid and answer
            return JsonResponse({'success': True, 'vivaid': vivaid, 'answer': cleaned_viva_response}, status=201)

        except Exception as e:
            # Handle the exception without logging
            return JsonResponse({'error': 'An error occurred'}, status=500)
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

def check():
    all_objs = MockViva.objects.all()
    for data in all_objs:
        print(data.vivaid)

genai.configure(api_key="AIzaSyCTPvOSwbjuDi18VKWbYkkCSd_0A--Ckec")
# genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

chat_session = model.start_chat(

)

response = chat_session.send_message("INSERT_INPUT_HERE")


