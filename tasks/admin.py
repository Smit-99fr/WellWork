from django.contrib import admin

# Register your models here.
from .models import Task,ExtensionRequest

admin.site.register(Task)
admin.site.register(ExtensionRequest)

