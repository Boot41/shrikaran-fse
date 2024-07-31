from django.urls import path
from . import views

urlpatterns = [
    path('handle-viva-data/', views.handle_viva_data),
    path('getdata/<str:viva_id>/',views.get_mockviva_data),
    path("storefeedback/",views.store_feedback)
]
