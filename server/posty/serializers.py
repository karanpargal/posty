from rest_framework import serializers
from posty.models import Template, Template_format, Template_color

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'
    
class Template_formatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template_format
        fields = '__all__'

class Template_colorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template_color
        fields = '__all__'
