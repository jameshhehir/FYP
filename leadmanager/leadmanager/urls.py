from django.contrib import admin
from django.urls import path, include, re_path

urlpatterns = [
    path('', include('frontend.urls')),
    path('', include('leads.urls')),
    path('', include('accounts.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html'))
]
