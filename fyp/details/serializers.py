from rest_framework import serializers
from details.models import Detail 

# Detail Serializer
class DetailSerializer(serializers.ModelSerializer):
  class Meta:
    model = Detail 
    fields = '__all__'