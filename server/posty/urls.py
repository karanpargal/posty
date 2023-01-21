from django.urls import path, include
from posty.views import TemplateViewSet, Template_formatViewSet, Template_colorViewSet, getImageURL, getMultipleTemplates, generateTemplates, uploadTemplateToS3

urlpatterns = [
    path('templates/', TemplateViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('templates/<int:pk>/', TemplateViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('templateFormats/', Template_formatViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('templateFormats/<int:pk>/', Template_formatViewSet.as_view({'get': 'retrieve','delete': 'destroy'})),
    path('templateColors/', Template_colorViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('templateColors/<int:pk>/', Template_colorViewSet.as_view({'get': 'retrieve'})),
    path('getDownloadURL/<int:template_id>/<int:format_id>/<int:color_id>/', getImageURL.as_view()),
    path('getMultipleTemplates/<str:format_value>/', getMultipleTemplates.as_view()),
    path('generateTemplates/<str:template_name>/', generateTemplates.as_view())
]
