import os
from groq import Groq
from django.core.mail import send_mail

groq_api_key = os.getenv('GROQ_API_KEY')
client = Groq(api_key=groq_api_key)

def genratevivadata(specialization,description,difficulty):
    inputprompt = f"Specialization: {specialization}, subject: {description}, difficulty: {difficulty}, medium based on this information give 5 viva question and answeres in json format give question and answer in field as json dont give any other data no addtional data like Here are 5 viva questions and answers related to the anatomy of the body, with a difficulty level of easy to medium just the json data beacuse i have to parse it into json i dont need any additional data just the json ur giving even the aditinal data which is making my application not run dont give addtional data just the json response so that i can parse it ur give this 'Here are the 5 viva questions and answers in JSON format:' dont even give this i just plain json data"

    return groq_chat(inputprompt)

def groq_chat(prompt):
    try:
        # Create a chat completion using the Groq client
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama3-8b-8192",
        )
        result = chat_completion.choices[0].message.content
        return result
    
    except Exception as e:
        print(f"Error: {e}")
        return "Cannot get the data from Groq"
    
def sendemail(recipient_email,subject,message):
    send_mail(
        subject,
        message,
        'shrikaranksmycoding@gmail.com',  # From email
        [recipient_email],
        fail_silently=False,
    )
