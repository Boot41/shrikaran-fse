from django.urls import path
from . import views

urlpatterns = [
    path('handle-viva-data/', views.handle_viva_data,name="handle_viva_data"),
    path('getdata/<str:viva_id>/',views.get_mockviva_data,name="get_mockviva_data"),
    path("storefeedback/",views.store_feedback,name="store_feedback"),
    path("<str:vivaid>/getfeedback",views.get_feedback,name="get_feedback"),
    path("getinterviewlist/",views.get_interview_list,name="get_interview_list"),
    path('send-email/', views.send_email, name='send_email'),
]

