from django.db import models
from django.contrib.auth.models import User


class Detail(models.Model):
    name = models.CharField(max_length=100)
    STLfile = models.CharField(max_length=100, blank=True)
    filename = models.CharField(max_length=100)
    owner = models.ForeignKey(
        User, related_name="details", on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
