from django.test import TestCase,Client
from django.urls import reverse
from .models import MockViva, QuestionData
import json
import uuid

class ViewsTestCase(TestCase):

    def setUp(self):
        # Create test data
        self.viva_id = str(uuid.uuid4())
        self.mock_viva = MockViva.objects.create(
            jsonvivaresponse='{"question": "What is anatomy?", "answer": "Study of body parts"}',
            Specialization='Anatomy',
            SpecializationDescription='Body parts',
            difficulty='Easy',
            created_by='testuser@example.com',
            vivaid=self.viva_id
        )
        self.question_data = QuestionData.objects.create(
            vivaid=self.viva_id,
            question='What is anatomy?',
            answer='Study of body parts',
            useranswer='Study of body parts',
            feedback='Correct',
            rating=5,
            useremail='testuser@example.com'
        )

        # URL reverse names updated according to urls.py
        self.handle_viva_data_url = reverse('handle_viva_data')
        self.get_mockviva_data_url = reverse('get_mockviva_data', kwargs={'viva_id': self.viva_id})
        self.store_feedback_url = reverse('store_feedback')
        self.get_feedback_url = reverse('get_feedback', kwargs={'vivaid': self.viva_id})
        self.get_interview_list_url = reverse('get_interview_list')
        self.send_email_url = reverse('send_email')
        self.genrate_Feedback_url = reverse('genrate_feedback')

    def test_handle_viva_data(self):
        response = self.client.post(self.handle_viva_data_url, {
            'specialization': 'Anatomy',
            'description': 'Body parts',
            'difficulty': 'Easy',
            'useremail': 'testuser@example.com'
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn('vivaid', json.loads(response.content))
        self.assertIn('answer', json.loads(response.content))

    def test_get_mockviva_data(self):
        response = self.client.get(self.get_mockviva_data_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('jsonvivaresponse', json.loads(response.content))

    def test_store_feedback(self):
        response = self.client.post(self.store_feedback_url, {
            'viva_id': self.viva_id,
            'question': 'What is anatomy?',
            'answer': 'Study of body parts',
            'useranswer': 'Study of body parts',
            'feedback': 'Correct',
            'rating': 5,
            'useremail': 'testuser@example.com'
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content)['success'], True)

    def test_get_feedback(self):
        response = self.client.get(self.get_feedback_url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(json.loads(response.content)) > 0)

    def test_get_interview_list(self):
        response = self.client.post(self.get_interview_list_url, {
            'created_by': 'testuser@example.com'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('data', json.loads(response.content))

    def test_send_email(self):
        response = self.client.post(self.send_email_url, {
            'to': 'testrecipient@example.com',
            'subject': 'Test Subject',
            'message': 'Test Message'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('Email sent successfully', json.loads(response.content)['message'])

    def test_genrate_Feedback(self):
        response = self.client.post(self.genrate_Feedback_url, {
            'prompt': 'Give me feedback for this answer.'
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn('feedback', json.loads(response.content))

class IntegrationTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.handle_viva_data_url = reverse('handle_viva_data')
        self.get_mockviva_data_url = reverse('get_mockviva_data', kwargs={'viva_id': 'test-viva-id'})
        self.store_feedback_url = reverse('store_feedback')
        self.get_feedback_url = reverse('get_feedback', kwargs={'vivaid': 'test-viva-id'})
        self.get_interview_list_url = reverse('get_interview_list')
        self.send_email_url = reverse('send_email')
        self.genrate_Feedback_url = reverse('genrate_feedback')

    def test_full_viva_creation_and_feedback_flow(self):
        # Step 1: Create a MockViva
        viva_creation_response = self.client.post(self.handle_viva_data_url, {
            'specialization': 'Anatomy',
            'description': 'Body parts',
            'difficulty': 'Easy',
            'useremail': 'testuser@example.com'
        })
        self.assertEqual(viva_creation_response.status_code, 201)
        viva_data = json.loads(viva_creation_response.content)
        self.assertIn('vivaid', viva_data)
        viva_id = viva_data['vivaid']

        # Step 2: Get the MockViva data
        mock_viva_response = self.client.get(reverse('get_mockviva_data', kwargs={'viva_id': viva_id}))
        self.assertEqual(mock_viva_response.status_code, 200)
        mock_viva_data = json.loads(mock_viva_response.content)
        self.assertIn('jsonvivaresponse', mock_viva_data)

        # Step 3: Store feedback for a question
        feedback_response = self.client.post(self.store_feedback_url, {
            'viva_id': viva_id,
            'question': 'What is anatomy?',
            'answer': 'Study of body parts',
            'useranswer': 'Study of body parts',
            'feedback': 'Correct',
            'rating': 5,
            'useremail': 'testuser@example.com'
        })
        self.assertEqual(feedback_response.status_code, 201)
        self.assertEqual(json.loads(feedback_response.content)['success'], True)

        # Step 4: Retrieve feedback
        get_feedback_response = self.client.get(reverse('get_feedback', kwargs={'vivaid': viva_id}))
        self.assertEqual(get_feedback_response.status_code, 200)
        feedback_data = json.loads(get_feedback_response.content)
        self.assertTrue(len(feedback_data) > 0)
        self.assertIn('question', feedback_data[0])

    def test_email_sending(self):
        response = self.client.post(self.send_email_url, {
            'to': 'testrecipient@example.com',
            'subject': 'Test Subject',
            'message': 'Test Message'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('Email sent successfully', json.loads(response.content)['message'])

