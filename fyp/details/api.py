from details.models import Detail
from rest_framework import viewsets, permissions
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.viewsets import ModelViewSet
from .serializers import DetailSerializer

# Detail Viewset


class DetailViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = DetailSerializer

    def get_queryset(self):
        return self.request.user.details.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)





