from django.contrib import admin
from .models import Leadership

# Register your models here.
@admin.register(Leadership)
class LeadershipAdmin (admin.ModelAdmin):
    list_display = ('name', 'points')
    search_fields = ('name',)
    list_filter = ('points', )