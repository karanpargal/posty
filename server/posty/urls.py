from django.urls import path, include
from posty.views import TemplateViewSet, Template_formatViewSet, Template_colorViewSet, getImageURL, getMultipleTemplates, generateTemplates

urlpatterns = [
    path('templates/', TemplateViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('templates/<int:pk>/', TemplateViewSet.as_view({'get': 'retrieve'})),
    path('template_formats/', Template_formatViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('template_formats/<int:pk>/', Template_formatViewSet.as_view({'get': 'retrieve'})),
    path('template_colors/', Template_colorViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('template_colors/<int:pk>/', Template_colorViewSet.as_view({'get': 'retrieve'})),
    path('getDownloadURL/<int:template_id>/<int:format_id>/<int:color_id>/', getImageURL.as_view()),
    path('getMultipleTemplates/<str:format_value>/', getMultipleTemplates.as_view()), #currently not working
    path('generateTemplates/<str:template_name>/', generateTemplates.as_view()),
]
