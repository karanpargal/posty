from rest_framework import viewsets
from posty.models import Template, Template_format, Template_color
from posty.serializers import TemplateSerializer, Template_formatSerializer, Template_colorSerializer

# Create your views here.
class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer

class Template_formatViewSet(viewsets.ModelViewSet):
    queryset = Template_format.objects.all()
    serializer_class = Template_formatSerializer

class Template_colorViewSet(viewsets.ModelViewSet):
    queryset = Template_color.objects.all()
    serializer_class = Template_colorSerializer
