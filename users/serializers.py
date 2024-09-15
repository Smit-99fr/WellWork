from urllib import response
from rest_framework import serializers
# from .models import User
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Profile,Team 

# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = ['id', 'image']

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['user', 'image','is_team_leader']  # Include the custom fields  


# User Serializer
class UserSerializer(serializers.ModelSerializer):
  profile = ProfileSerializer()

  class Meta:
    model = User
    fields = ('id', 'username', 'email','profile')
    read_only_fields = ['created_by'] 

#Team serializer
class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)  # Use the UserSerializer to display full user objects

    class Meta:
        model = Team
        fields = ['id', 'name', 'created_by', 'created_at', 'description', 'members']
        read_only_fields = ['created_by']

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user:
            raise serializers.ValidationError("User not authenticated.")

        # Automatically set 'created_by' and add the creator to the team members
        team = Team.objects.create(created_by=request.user, **validated_data)
        user_profile = request.user.profile
        team.add_member(user_profile, leader=True)  # Add the creator to the team by default
        return team


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'profile_pic', 'team_leader']
#         read_only_fields = ['team_leader']

# class TeamSerializer(serializers.ModelSerializer):
#     team_leader = serializers.StringRelatedField()
#     members = serializers.StringRelatedField(many=True)

#     class Meta:
#         model = Team
#         fields = ['id', 'name', 'team_token', 'team_leader', 'members']
#         read_only_fields = ['team_token', 'team_leader', 'members']
    
#     def create(self, validated_data):
#         user = self.context['request'].user
#         team = Team.objects.create(
#             name=validated_data['name'],
#             team_leader=user
#         )
#         team.members.add(user)
#         user.team_leader = True
#         user.save()
#         return team

    
# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'password')
    extra_kwargs = {'password': {'write_only': True}}

  def create(self, validated_data):
    user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

    return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
  username=serializers.CharField()
  password = serializers.CharField()

  def validate(self, data):
    user = authenticate(**data)
    if user and user.is_active:
      return user
    raise serializers.ValidationError("Incorrect Credentials")

