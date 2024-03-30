from django.shortcuts import render
from rest_framework import viewsets
from .serializers import LeadershipSerializer
from .models import Leadership


# Create your views here.
class LeadershipView (viewsets.ModelViewSet):
    serializer_class = LeadershipSerializer
    queryset = Leadership.objects.all().order_by('-points')[:3]