from django.db import models

# Create your models here.
class Template(models.Model):
    template_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Template_format(models.Model):
    format_id = models.AutoField(primary_key=True)
    template_id = models.ForeignKey(Template, on_delete=models.CASCADE)
    format = models.CharField(max_length=9)
    maxCharactersBody = models.IntegerField()
    maxCharactersDescription = models.IntegerField()
    maxCharactersCTA = models.IntegerField()
    fontBody = models.CharField(max_length=30)
    fontDescription = models.CharField(max_length=30)
    fontCTA = models.CharField(max_length=30)
    fontSizeBody = models.IntegerField()
    fontSizeDescription = models.IntegerField()
    fontSizeCTA = models.IntegerField()

    def __str__(self):
        return self.format


class Template_color(models.Model):
    color_id = models.AutoField(primary_key=True)
    template_id = models.ForeignKey(Template, on_delete=models.CASCADE)
    format_id = models.ForeignKey(Template_format, on_delete=models.CASCADE)
    color = models.CharField(max_length=30)
    fontColorBody = models.CharField(max_length=30)
    fontColorDescription = models.CharField(max_length=30)
    fontColorCTA = models.CharField(max_length=30)
    templateS3URL = models.CharField(max_length=200)

    def __str__(self):
        return self.color
