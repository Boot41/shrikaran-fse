from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from .models import MockViva, QuestionData
from django.http import JsonResponse
import json

class ViewsTestCase(TestCase):
    
    def setUp(self):
        # URL reverse names updated according to urls.py
        self.handle_viva_data_url = reverse('handle_viva_data')
        self.get_mockviva_data_url = reverse('get_mockviva_data', kwargs={'viva_id': 'test-viva-id'})
        self.store_feedback_url = reverse('store_feedback')
        self.get_feedback_url = reverse('get_feedback', kwargs={'vivaid': 'test-viva-id'})
        self.get_interview_list_url = reverse('get_interview_list')
        self.send_email_url = reverse('send_email')

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
        mock_viva = MockViva.objects.create(
            jsonvivaresponse='{"question": "What is anatomy?", "answer": "Study of body parts"}',
            Specialization='Anatomy',
            SpecializationDescription='Body parts',
            difficulty='Easy',
            created_by='testuser@example.com',
            vivaid='test-viva-id'
        )
        response = self.client.get(reverse('get_mockviva_data', kwargs={'viva_id': mock_viva.vivaid}))
        self.assertEqual(response.status_code, 200)
        self.assertIn('jsonvivaresponse', json.loads(response.content))

    def test_store_feedback(self):
        response = self.client.post(self.store_feedback_url, {
            'viva_id': 'test-viva-id',
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
        QuestionData.objects.create(
            vivaid='test-viva-id',
            question='What is anatomy?',
            answer='Study of body parts',
            useranswer='Study of body parts',
            feedback='Correct',
            rating=5,
            useremail='testuser@example.com'
        )
        response = self.client.get(reverse('get_feedback', kwargs={'vivaid': 'test-viva-id'}))
        self.assertEqual(response.status_code, 200)
        self.assertIn('question', json.loads(response.content)[0])

    def test_get_interview_list(self):
        MockViva.objects.create(
            jsonvivaresponse='{"question": "What is anatomy?", "answer": "Study of body parts"}',
            Specialization='Anatomy',
            SpecializationDescription='Body parts',
            difficulty='Easy',
            created_by='testuser@example.com',
            vivaid='test-viva-id'
        )
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
