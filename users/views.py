from django.shortcuts import render
from rest_framework import viewsets,permissions,status
# from .models import User
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
# from .serializers import UserSerializer
from .models import Profile, Team
from .serializers import TeamSerializer, ProfileSerializer, UserSerializer

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class TeamViewSet(viewsets.ModelViewSet):
#     queryset = Team.objects.all()
#     serializer_class = TeamSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(team_leader=self.request.user)
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        # Pass the request context to the serializer
        return {'request': self.request}

    def perform_create(self, serializer):
        # Set the user as the creator and leader of the team
        # profile = self.request.user.profile
        # user = self.request.user
        # team = serializer.save()
        # team.add_member(profile, leader=True)  
        team = serializer.save() 

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        team = self.get_object()
        username = request.data.get('username')

        if not username:
            return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_add = User.objects.get(username=username)
            team.members.add(user_to_add)  # Add the specified user to the team
            user_data = UserSerializer(user_to_add).data
            return Response({'status': 'Member added successfully.','user':user_data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Remove a specified user from the team by user ID."""
        team = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_remove = User.objects.get(id=user_id)
            if user_to_remove in team.members.all():
                team.members.remove(user_to_remove)  # Remove the user from the team
                user_to_remove.profile.remove_from_team()  # Update the user's profile
                return Response({'status': 'Member removed successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'User is not a member of this team.'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=True, methods=['post'])
    def change_leader(self, request, pk=None):
        """Change the team leader."""
        team = self.get_object()
        new_leader_id = request.data.get('new_leader_id')
        try:
            new_leader_profile = Profile.objects.get(user__id=new_leader_id)
            team.change_team_leader(new_leader_profile)
            new_leader_profile.promote_to_leader()
            return Response({'status': 'team leader changed'})
        except Profile.DoesNotExist:
            return Response({'error': 'User not found'}, status=400)
        
    def destroy(self, request, *args, **kwargs):
        """Delete the specified team."""
        team = self.get_object()
        self.perform_destroy(team)
        return Response({'status': 'Team deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)