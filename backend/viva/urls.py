from django.urls import path
from . import vivaviews
from . import feedbackviews

urlpatterns = [
    path('handle-viva-data/', vivaviews.handle_viva_data,name="handle_viva_data"),
    path('getdata/<str:viva_id>/',vivaviews.get_mockviva_data,name="get_mockviva_data"),
    path("getinterviewlist/",vivaviews.get_interview_list,name="get_interview_list"),
    path("storefeedback/",feedbackviews.store_feedback,name="store_feedback"),
    path("<str:vivaid>/getfeedback",feedbackviews.get_feedback,name="get_feedback"),
    path('send-email/',feedbackviews.send_email, name='send_email'),
    path('genratefeedback/',feedbackviews.genrate_Feedback, name='genrate_feedback'),
]

