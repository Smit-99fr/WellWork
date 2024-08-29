import uuid
from django.contrib.auth.models import User
from django.db import models
from django.db import connection

class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    image=models.ImageField(default='default.jpg',upload_to='profile_pics')
    
     # Team-related fields
    team = models.ForeignKey('Team', on_delete=models.SET_NULL, null=True, blank=True, related_name='members')
    is_team_leader = models.BooleanField(default=False)

    def assign_to_team(self, team):
        """Assign a user to a team."""
        self.team = team
        self.save()

    def remove_from_team(self):
        """Remove a user from the team."""
        self.team = None
        self.is_team_leader = False
        self.save()

    def promote_to_leader(self):
        """Promote the user to team leader."""
        if self.team:
            self.is_team_leader = True
            self.save()

    def demote_from_leader(self):
        """Demote the user from team leader."""
        self.is_team_leader = False
        self.save()
    #till here

    def __str__(self):
        return f'{self.user.username} Profile'
    



# class User(AbstractUser):
#     profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
#     team_leader = models.BooleanField(default=False,null=True)

#     def __str__(self):
#         return self.username

# class Team(models.Model):
#     name = models.CharField(max_length=255)
#     team_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
#     team_leader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='led_teams')
#     members = models.ManyToManyField(User, related_name='teams', blank=True)

#     # def save(self, *args, **kwargs):
#     #     if not self.id:
#     #         self.team_leader.team_leader = True
#     #         self.team_leader.team_token = self.team_token
#     #         self.team_leader.save()
#     #     super().save(*args, **kwargs)


#     def __str__(self):
#         return self.name
