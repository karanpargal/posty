from rest_framework import viewsets
from posty.models import Template, Template_format, Template_color
from posty.serializers import TemplateSerializer, Template_formatSerializer, Template_colorSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from bs4 import BeautifulSoup as bs
import os
import re
import imgkit
from html2image import Html2Image
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

class getImageURL(APIView):
    def get(self, request, template_id, format_id, color_id, format=None):
        try:
            template = Template_color.objects.get(template_id=template_id, format_id=format_id, color_id=color_id)
            read_serializer = Template_colorSerializer(template)
            return Response(read_serializer.data)
        except:
            return Response(status=404)
    
class getMultipleTemplates(APIView):
    def get(self, request,format_value, format=None):
        try:
            template = Template_format.objects.filter(format = format_value)
            read_serializer = Template_formatSerializer(template)
            return Response(read_serializer.data)
        except:
            return Response(status=404)

class generateTemplates(APIView):
    def get(self, request, template_name, format=None):
        try:
            data = request.query_params
            base = os.path.dirname(os.path.abspath(__file__))
            html = open(os.path.join(base, template_name+".html"))
            soup = bs(html, 'html.parser')
            
            old_Title = soup.find("p", {"id": "title"})
            new_Title = old_Title.find(text=re.compile('Enter Title')).replace_with(data['title'])
            old_Punchline = soup.find("p", {"id": "punchline"})
            new_Punchline = old_Punchline.find(text=re.compile('Enter Punchline')).replace_with(data['punchline'])
            old_description = soup.find("p", {"id": "description"})
            new_description = old_description.find(text=re.compile('Enter description')).replace_with(data['description'])

            with open(template_name+".html", "wb") as f_output:
                f_output.write(soup.prettify("utf-8"))

            hti = Html2Image()
            hti.screenshot(html_file=template_name+".html", save_as=template_name+".jpg")

            return Response(data)
        except:
            return Response(status=404)