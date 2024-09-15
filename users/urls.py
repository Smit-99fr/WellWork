from django.urls import path, include
from rest_framework.routers import DefaultRouter

from django.conf import settings
from django.conf.urls.static import static
from .views import TeamViewSet
from .api import RegisterAPI,LoginAPI,UserAPI
from knox.views import LogoutView

# router = DefaultRouter()
# router.register(r'users', UserViewSet)
#router.register(r'teams', TeamViewSet)
router = DefaultRouter()
router.register(r'teams', TeamViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth',include('knox.urls')),
    path('api/auth/register',RegisterAPI.as_view()),
    path('api/auth/login',LoginAPI.as_view()),
    path('api/auth/user',UserAPI.as_view()),
    path('api/auth/logout',LogoutView.as_view(),name='knox-logout')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)