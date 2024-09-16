from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet


router = DefaultRouter()
router.register('tasks', TaskViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/tasks/<int:pk>/approve-extension/', TaskViewSet.as_view({'post': 'approve_extension'})),
    path('api/tasks/<int:pk>/reject-extension/', TaskViewSet.as_view({'post': 'reject_extension'})),
    path('api/tasks/<int:pk>/request-extension/', TaskViewSet.as_view({'post': 'request_extension'})),
    path('api/tasks/extension-requests/', TaskViewSet.as_view({'get': 'get_extension_requests'})),

]
