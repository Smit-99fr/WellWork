from django.db import models
from django.contrib.auth.models import User
from users.models import Team  # Import from users app

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('mid', 'Mid'),
        ('high', 'High'),
    ]
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    task_name = models.CharField(max_length=255)
    due_date = models.DateField()
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='tasks')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    requested_extension = models.BooleanField(default=False)

    def __str__(self):
        return self.task_name

    def request_due_date_extension(self):
        """Method to request extension of due date."""
        self.requested_extension = True
        self.save()

from django.db import models
from django.contrib.auth.models import User

class ExtensionRequest(models.Model):
    task = models.ForeignKey('Task', on_delete=models.CASCADE, related_name='extension_requests')
    task_name = models.CharField(max_length=255,null=True)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    requested_date = models.DateField()
    new_due_date = models.DateField()
    approved = models.BooleanField(null=True, default=None)  # None = Pending, True = Approved, False = Rejected
    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.task.task_name} - Requested by {self.requested_by.username}"
 