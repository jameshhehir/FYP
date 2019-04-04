from rest_framework import routers
from .api import DetailViewSet

router = routers.DefaultRouter()
router.register('api/details', DetailViewSet, 'details')

urlpatterns = router.urls