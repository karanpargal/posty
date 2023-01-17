from django.urls import path, include  # Ensure `include` is imported
from posty.views import TemplateViewSet, Template_formatViewSet, Template_colorViewSet

urlpatterns = [
    path('templates/', TemplateViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('templates/<int:pk>/', TemplateViewSet.as_view({'get': 'retrieve'})),
    path('template_formats/', Template_formatViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('template_formats/<int:pk>/', Template_formatViewSet.as_view({'get': 'retrieve'})),
    path('template_colors/', Template_colorViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('template_colors/<int:pk>/', Template_colorViewSet.as_view({'get': 'retrieve'})),
]
