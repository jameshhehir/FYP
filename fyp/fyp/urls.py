from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('', include('frontend.urls')),
    path('', include('details.urls')),
    path('', include('accounts.urls')),
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]
