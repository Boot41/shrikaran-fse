from groq import Groq
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os, pdb
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

        inputprompt = f"Specialization: {specialization}, subject: {description}, difficulty: {difficulty}, medium based on this information give 5 viva question and answeres in json format give question and answer in field as json dont give any other data no addtional data like Here are 5 viva questions and answers related to the anatomy of the body, with a difficulty level of easy to medium just the json data beacuse i have to parse it into json"

        try:
            # pdb.set_trace()
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

            # Clean the viva response by removing "```json" and "```"
            # cleaned_viva_response = viva_response.replace("```json", "").replace("```").strip()

            # Generate unique vivaid
            vivaid = str(uuid.uuid4())

            # Create MockViva instance with data
            mock_viva = MockViva(
                jsonvivaresponse=viva_response,
                Specialization=specialization,
                SpecializationDescription=description,
                difficulty=difficulty,
                created_by=useremail,  # Replace with actual user name (optional)
                vivaid=vivaid,
            )

            # Save the data to the database
            mock_viva.save()

            # Return success response with vivaid and answer
            return JsonResponse({'success': True, 'vivaid': vivaid, 'answer': viva_response}, status=201)

        except Exception as e:
            # Handle the exception without logging
            return JsonResponse({'error': 'An error occurred calling Gemini'}, status=500)
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
        feeback = data.get("feeback")
        rating = data.get("rating")
        useremail = data.get("useremail")

        try:
            print("this is the response",vivaid,question,answer,useranswer,feeback,rating,useremail)
            return JsonResponse({"answer" : "printed succes fully"})
        except:
            return JsonResponse({"answer" : "not printed correctly"})

def check():
    all_objs = MockViva.objects.all()
    for data in all_objs:
        print(data.vivaid)

# genai.configure(api_key="AIzaSyCTPvOSwbjuDi18VKWbYkkCSd_0A--Ckec")
# # genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# # Create the model
# generation_config = {
#   "temperature": 1,
#   "top_p": 0.95,
#   "top_k": 64,
#   "max_output_tokens": 8192,
#   "response_mime_type": "text/plain",
# }

# model = genai.GenerativeModel(
#   model_name="gemini-1.5-flash",
#   generation_config=generation_config,
#   # safety_settings = Adjust safety settings
#   # See https://ai.google.dev/gemini-api/docs/safety-settings
# )

# chat_session = model.start_chat(

# )

# response = chat_session.send_message("INSERT_INPUT_HERE")



