from django.contrib.auth.models import User
from django.db import models
from django.db import connection

class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    image=models.ImageField(default='default.jpg',upload_to='profile_pics')
    
     # Team-related fields
    team = models.ForeignKey('Team', on_delete=models.SET_NULL, null=True, blank=True, related_name='profiles')
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
    

class Team(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams_created')
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, related_name='teams_members', blank=True)  # Updated to store User objects directly

    def __str__(self):
        return self.name

    def add_member(self, user_profile,leader=False):
        """Add a user to the team."""
        print(f"Adding member {user_profile.user.username} to team {self.name}")  # Debug print
        
        user_profile.assign_to_team(self)
        if leader:  # Promote to leader if specified
            user_profile.promote_to_leader()  # Sets is_team_leader = True
        self.members.add(user_profile.user)  # Add the user to the team's members list

    def remove_member(self, user_profile):
        """Remove a user from the team."""
        if user_profile.team == self:
            user_profile.remove_from_team()
            self.members.remove(user_profile.user)  # Remove the user from the team's members list

    def change_team_leader(self, new_leader_profile):
        """Change the team leader to a new user."""
        current_leader = self.members.filter(profile__is_team_leader=True).first()
        if current_leader and current_leader.profile.is_team_leader:
            current_leader.profile.demote_from_leader()
        new_leader_profile.promote_to_leader()



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
