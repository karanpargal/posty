from rest_framework import viewsets
from posty.models import Template, Template_format, Template_color
from posty.serializers import (
    TemplateSerializer,
    Template_formatSerializer,
    Template_colorSerializer,
)
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from bs4 import BeautifulSoup as bs
from django.conf import settings
from django.http import JsonResponse
import os
import boto3
import requests
import openai
from selenium import webdriver
import time
import random
from selenium.webdriver.common.by import By
from cohesive.auth import AuthDetails

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer

class generateTemplates(APIView):
    def get(self, request, format=None):
        try:
            if not isinstance(request.auth_details, AuthDetails):
                return Response({"error": "no auth details found"}, status=401)
            title = request.GET.get("title")
            cta = request.GET.get("cta")
            description = request.GET.get("description")
            body = request.GET.get("body")
            format_value = request.GET.get("formatValue")
            base = os.path.abspath(os.path.dirname(__file__))
            template = Template_format.objects.filter(format=format_value)
            read_serializer = Template_formatSerializer(template, many=True)
            template_id_check = []
            color_id = []
            template_list = []
            format_list = []
            uploaded_URLs = []
            images = []
            for i in range(len(read_serializer.data)):
                format_list.append(read_serializer.data[i]["format_id"])
            for i in range(len(format_list)):
                template = Template_color.objects.filter(format_id=format_list[i])
                read_serializer = Template_colorSerializer(template, many=True)
                for j in range(len(read_serializer.data)):
                    if read_serializer.data[j]["template_id"] not in template_id_check:
                        template_id_check.append(read_serializer.data[j]["template_id"])
                        color_id.append(read_serializer.data[j]["color_id"])
                        template_list.append(read_serializer.data[j]["templateS3URL"])
            for i in range(len(template_list)):
                downloadFileFromURL(
                    template_list[i],
                    base
                    + "/"
                    + str(template_list[i].split("/")[-1].split(".")[0])
                    + ".html",
                )
            templateLinks = template_list
            

            for i in range(len(templateLinks)):
                template_name = templateLinks[i].split("/")[-1].split(".")[0]
                base = os.path.abspath(os.path.dirname(__file__))
                html = open(os.path.join(base, template_name + ".html"))
                soup = bs(html, "html.parser")
                old_Title = soup.find(id="title")
                old_Title.clear()
                old_Title.append(title)
                if description != "":
                    old_img = soup.find(id="bg-img")
                    new_img = fetchRandomImage(description)
                    images.append(new_img)
                    old_img["src"] = new_img
                old_Punchline = soup.find(id="cta")
                old_Punchline.clear()
                old_Punchline.append(cta)
                old_body = soup.find(id="body")
                old_body.clear()
                old_body.append(body)
                pathToFile = os.path.join(base, template_name + ".html")
            return JsonResponse(
                {
                    "urls": uploaded_URLs,
                    "template_ids": template_id_check,
                    "format_ids": format_list,
                    "color_ids": color_id,
                    "images": images,
                }
            )

        except Exception as e:
            return JsonResponse({"error": str(e)})


def uploadTemplateToS3(request, file_name, uploaded_URLs, format=None):
    session = boto3.Session()
    s3 = session.client("s3")
    s3 = boto3.client("s3")
    try:
        bucket_name = "posty-templates"
        base = os.path.abspath(os.path.dirname(__file__))
        print(base)
        s3.upload_file(
            os.path.join(base, file_name),
            bucket_name,
            "generated-templates/" + file_name,
            ExtraArgs={
                "ACL": "public-read",
                "ContentType": "image/png",
                "ContentDisposition": "inline",
            },
        )  # Recheck the path
        print(f"Successfully uploaded {file_name} to {bucket_name}")
        url = f"https://{bucket_name}.s3.amazonaws.com/generated-templates/{file_name}"
        uploaded_URLs.append(url)
        return JsonResponse({"url": url})
    except Exception as e:
        print(e)
        print(f"Error uploading {file_name} to {bucket_name}")


def fetchRandomImage(description, format=None):
    description = description.replace(" ", "%20")
    url = f"https://api.unsplash.com/search/photos?page=1&query={description}&client_id={settings.UNSPLASH_API_KEY}&orientation=landscape"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return (response.json()["results"][0]["urls"]["regular"])
    except Exception as e:
        print(e)
        return Response(status=404)


@api_view(["GET"])
def rephrasePrompt(request):
    if not isinstance(request.auth_details, AuthDetails):
        return Response({"error": "no auth details found"}, status=401)
    prompt = request.GET.get("prompt")
    openai.api_key = settings.OPENAI_API_KEY
    completions = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Rewrite the following in same character limit: {prompt} ",
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.1,
    )

    message = completions.choices[0].text
    return JsonResponse({"message": message})


def downloadFileFromURL(url, local_file_path):
    try:
        response = requests.get(url)
        open(local_file_path, "wb").write(response.content)
        print(f"Successfully downloaded {url} and saved to {local_file_path}")
    except Exception as e:
        print(f"Unable to download file from URL: {e}")


@api_view(["GET"])
def fetchOtherColor(request):
    if request.method == "GET":
        try:
            if not isinstance(request.auth_details, AuthDetails):
                return Response({"error": "no auth details found"}, status=401)
            uploaded_URLs = []
            color_id = request.GET.get("colorID")
            template_id = request.GET.get("templateID")
            format_id = request.GET.get("formatID")
            title = request.GET.get("title")
            cta = request.GET.get("cta")
            description = request.GET.get("description")
            body = request.GET.get("body")
            oldImgURL = request.GET.get("imageURL")
            template = Template_color.objects.filter(
                template_id=template_id, format_id=format_id
            )
            read_serializer = Template_colorSerializer(template, many=True)
            colours = []
            for i in range(len(read_serializer.data)):
                colours.append(read_serializer.data[i]["color_id"])
            print(colours, color_id)
            if color_id in colours:
                print("Color already exists")
            new_color = random.choice(list(set(colours)))
            print(new_color)
            template = Template_color.objects.get(
                template_id=template_id, format_id=format_id, color_id=new_color
            )
            read_serializer = Template_colorSerializer(template)
            print(read_serializer.data)
            templateS3URL = read_serializer.data["templateS3URL"]
            base = os.path.abspath(os.path.dirname(__file__))
            downloadFileFromURL(
                templateS3URL,
                base + "/" + str(templateS3URL.split("/")[-1].split(".")[0]) + ".html",
            )
            template_name = templateS3URL.split("/")[-1].split(".")[0]
            base = os.path.abspath(os.path.dirname(__file__))
            html = open(os.path.join(base, template_name + ".html"))
            soup = bs(html, "html.parser")
            old_Title = soup.find(id="title")
            old_Title.clear()
            old_Title.append(title)
            if description != "":
                old_img = soup.find(id="bg-img")
                new_img = oldImgURL
                old_img["src"] = new_img
            old_Punchline = soup.find(id="cta")
            old_Punchline.clear()
            old_Punchline.append(cta)
            old_body = soup.find(id="body")
            old_body.clear()
            old_body.append(body)
            with open(os.path.join(base, template_name + ".html"), "wb") as f_output:
                f_output.write(soup.encode())
            # chrome_options = webdriver.ChromeOptions()
            # chrome_options.add_argument("--no-sandbox")
            # chrome_options.add_argument("--headless")
            # chrome_options.add_argument("--disable-gpu")
            # chrome_options.add_argument("--window-size=1920,1920")
            # chrome_options.add_argument('--disable-dev-shm-usage')   
            # chrome_options.add_argument("--disable-setuid-sandbox")    
            # driver = webdriver.Chrome(options=chrome_options)
            # driver.maximize_window()
            # pathToFile = os.path.join(base, template_name + ".html")
            # driver.get("file://"+pathToFile)
            # time.sleep(0.5)
            # print(pathToFile)
            # time.sleep(1)
            # driver.find_element(By.ID, "template").screenshot(
            #     os.path.join(base, template_name + ".png")
            # )
            # driver.quit()
            # uploadTemplateToS3(
            #     request, template_name + ".png", uploaded_URLs=uploaded_URLs
            # )
            return JsonResponse({"url": uploaded_URLs, "color_id": new_color})
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)})

@api_view(["GET"])
def fetchAllTemplates(request):
    if request.method == "GET":
        try:
            if not isinstance(request.auth_details, AuthDetails):
                return Response({"error": "no auth details found"}, status=401)
            templates = Template_color.objects.all()
            read_serializer = Template_colorSerializer(templates, many=True)
            S3Links = []
            TemplatesFetched = []
            for i in range(len(read_serializer.data)):
                if read_serializer.data[i]["template_id"] not in TemplatesFetched:
                    S3Links.append(read_serializer.data[i]["templateS3URL"])
                    TemplatesFetched.append(read_serializer.data[i]["template_id"])
            return JsonResponse(read_serializer.data, safe=False)
        except Exception as e:
            print(e)
            return Response(status=404)

@api_view(["GET"])
def fetchRecentTemplates(request):
    if request.method == "GET":
        try:
            if not isinstance(request.auth_details, AuthDetails):
                return Response({"error": "no auth details found"}, status=401)
            s3 = boto3.resource("s3")
            bucket_name = s3.Bucket("posty-templates")
            L=[]
            for obj in bucket_name.objects.all(Prefix="generated-templates/"):
                L.append("https://posty-templates.s3.amazonaws.com/generated-templates/"+obj.key)
                if(len(L)==5):
                    break
            return JsonResponse({"urls":L})
        except Exception as e:
            print(e)
            return Response(status=404)