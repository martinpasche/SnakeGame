from django.db import models

# Create your models here.
class Leadership (models.Model):
    
    name = models.CharField(max_length = 10)
    points = models.SmallIntegerField()
    
    def __str__(self):
        text = f"User: {self.name}\tPoints: {self.points}"
        return text