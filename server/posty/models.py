from django.db import models
class Template(models.Model):
    template_id = models.AutoField(primary_key=True)
    format = models.CharField(max_length=9)
    S3URL = models.CharField(max_length=200)

    def __str__(self):
        return self.S3URL
    
    