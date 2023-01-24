from rest_framework import viewsets
from posty.models import Template, Template_format, Template_color
from posty.serializers import TemplateSerializer, Template_formatSerializer, Template_colorSerializer
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from bs4 import BeautifulSoup as bs
from django.conf import settings
from django.http import JsonResponse
import os
import boto3
import json
import requests
import openai

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
            url = read_serializer.data['templateS3URL']
            return Response(url)
        except:
            return Response(status=404)

class generateTemplates(APIView):
    def get(self, request, format=None):
        try:
            data = {}
            title = request.GET.get('title')
            cta = request.GET.get('cta')
            description = request.GET.get('description')
            format_value = request.GET.get('formatValue')
            base = os.path.abspath(os.path.dirname(__file__))
            template = Template_format.objects.filter(format = format_value)
            read_serializer = Template_formatSerializer(template, many=True)
            template_id_check = []
            template_list = []
            format_list = []
            uploaded_URLs = []
            for i in range(len(read_serializer.data)):
                format_list.append(read_serializer.data[i]['format_id'])
            for i in range(len(format_list)):
                template = Template_color.objects.filter(format_id = format_list[i])
                read_serializer = Template_colorSerializer(template, many=True)
                for j in range(len(read_serializer.data)):
                    if read_serializer.data[j]['template_id'] not in template_id_check:
                        template_id_check.append(read_serializer.data[j]['template_id'])
                        template_list.append(read_serializer.data[j]['templateS3URL'])
            for i in range(len(template_list)):
                downloadFileFromURL(template_list[i],base+"/"+str(template_list[i].split('/')[-1].split('.')[0])+".html")
            templateLinks  = template_list
            for i in range(len(templateLinks)):
                template_name = templateLinks[0].split('/')[-1].split('.')[0]
                base = os.path.abspath(os.path.dirname(__file__))
                html = open(os.path.join(base, template_name+".html"))
                soup = bs(html, 'html.parser')
                old_Title = soup.find(id="title")
                old_Title.clear()
                old_Title.append(title)
                old_Punchline = soup.find(id="CTA")
                old_Punchline.clear()
                old_Punchline.append(cta)
                old_description = soup.find(id="description")
                old_description.clear()
                old_description.append(description)
                with open(os.path.join(base,template_name+".html"), "wb") as f_output:
                    f_output.write(soup.prettify("utf-8"))
                uploadTemplateToS3(self, request, template_name+".html",uploaded_URLs=uploaded_URLs)

            return JsonResponse({'urls': uploaded_URLs})

        except:
            return Response(status=404)


def uploadTemplateToS3(self, request, file_name, uploaded_URLs, format=None):
    session = boto3.Session(
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    s3 = session.client('s3')
    s3 = boto3.client('s3')
    try:
        bucket_name = 'posty-templates'
        base = os.path.abspath(os.path.dirname(__file__))
        print(base)
        s3.upload_file(base+'\\'+file_name, bucket_name,'generated-templates/'+file_name, ExtraArgs={'ACL': 'public-read','ContentType': "text/html","ContentDisposition": "inline"}) #Recheck the path
        print(f'Successfully uploaded {file_name} to {bucket_name}')
        url = f"https://{bucket_name}.s3.amazonaws.com/generated-templates/{file_name}"
        uploaded_URLs.append(url)
        return JsonResponse({'url': url})
    except Exception as e:
        print(e)
        print(f'Error uploading {file_name} to {bucket_name}')


def fetchRandomImage():
    headers = {'Authorization': f'Client-ID {settings.UNSPLASH_API_KEY}'}
    url = 'https://api.unsplash.com/photos/random'
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()['urls']['regular']
    except:
        print('Error fetching image')

@api_view(['GET'])
def rephrasePrompt(request):
    prompt = request.GET.get('prompt')
    openai.api_key = settings.OPENAI_API_KEY
    completions = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Rewrite the following prompt: {prompt}",
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    message = completions.choices[0].text
    return JsonResponse({'message': message})

def downloadFileFromURL(url, local_file_path):
    try:
        response = requests.get(url)
        open(local_file_path, 'wb').write(response.content)
        print(f"Successfully downloaded {url} and saved to {local_file_path}")
    except Exception as e:
        print(f"Unable to download file from URL: {e}")