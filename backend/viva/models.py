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
