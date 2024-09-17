from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('', include('users.urls')),
    path('', include('tasks.urls')),
    path('', include('meetings.urls')),

]
