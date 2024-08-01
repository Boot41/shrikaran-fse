from django.db import models

class MockViva(models.Model):
    jsonvivaresponse = models.TextField(null=False)
    Specialization = models.CharField(max_length=100, null=False)
    SpecializationDescription = models.TextField(null=False)
    difficulty = models.CharField(max_length=10, null=False)
    created_by = models.CharField(max_length=100, null=False)  # Adjust max_length as needed
    created_at = models.DateTimeField(auto_now_add=True)
    vivaid = models.CharField(max_length=36, primary_key=True, unique=True, null=False)

    class Meta:
        app_label = 'viva'

class QuestionData(models.Model):
    vivaid = models.CharField(max_length=100)
    question = models.TextField()
    answer = models.TextField()
    useranswer = models.TextField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    rating = models.IntegerField(null=True)
    useremail = models.CharField(null=True)
    # Additional fields as needed (e.g., created_at, updated_at, user_id)

    def __str__(self):
        return self.question[:50]  # Truncate question for display

