from rest_framework import serializers
from .models import Leadership

class LeadershipSerializer (serializers.ModelSerializer):
    class Meta: 
        model = Leadership
        fields = ('name', 'points')