from django.db import models
from users.models import Team,User

class Meeting(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='meetings')
    scheduled_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meetings_scheduled')
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    is_canceled = models.BooleanField(default=False)
    meeting_link = models.URLField(null=True, blank=True)  # Video call link
    attendances = models.ManyToManyField(User, related_name='meetings_attended')

    def __str__(self):
        return f"{self.title} - {self.team.name}"

    def cancel(self):
        """Cancel the meeting."""
        self.is_canceled = True
        self.save()

# class Attendance(models.Model):
#     meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='attendances')
#     participants = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
#     attended_at = models.DateTimeField(auto_now_add=True)
#     attended = models.BooleanField(default=False)

#     def mark_attended(self):
#         self.attended = True
#         self.save()

