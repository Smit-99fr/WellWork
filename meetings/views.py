from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Meeting
from users.models import Team
from .serializers import MeetingSerializer
import uuid
from datetime import datetime

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Get dynamic input from the request
        title = self.request.data.get('title')
        description = self.request.data.get('description')
        scheduled_at = self.request.data.get('scheduled_at')  # Should be in ISO format
        duration_minutes = self.request.data.get('duration_minutes')
        team_id = self.request.data.get('team_id')

        # Get team and verify that user is the team leader
        team = Team.objects.get(id=team_id)
        if self.request.user.profile.is_team_leader and self.request.user.profile.team == team:
            # Generate a unique meeting link
            meeting_link = f"https://meet.jit.si/{uuid.uuid4()}"
            # Create the meeting with the provided data
            serializer.save(
                title=title,
                description=description,
                scheduled_at=scheduled_at,
                duration_minutes=duration_minutes,
                scheduled_by=self.request.user,
                team=team,
                meeting_link=meeting_link
            )
        else:
            return Response({"detail": "Only team leaders can schedule meetings."}, status=status.HTTP_403_FORBIDDEN)

    def perform_destroy(self, instance):
        # Only team leader or the meeting scheduler can cancel the meeting
        if self.request.user == instance.scheduled_by or self.request.user.profile.is_team_leader:
            instance.cancel()
        else:
            return Response({"detail": "Only the team leader or meeting organizer can cancel this meeting."}, status=status.HTTP_403_FORBIDDEN)
    
    @action(detail=True, methods=['post'], url_path='attend')
    def attend(self, request, pk=None):
        meeting = self.get_object()
        user = request.user
        print(f"User: {user}, Meeting: {meeting}")  # Debug print to check data
        print(f"Meeting attendees: {meeting.attendances.all()}")  # Check attendees list
        
        # Check if the user is already marked as attending
        if user in meeting.attendances.all():
            return Response({"detail": "User already marked as attending."}, status=status.HTTP_400_BAD_REQUEST)

        # Add the user to the meeting's attendances
        meeting.attendances.add(user)
        meeting.save()

        return Response({"detail": "Attendance marked successfully."}, status=status.HTTP_200_OK)
# class AttendanceViewSet(viewsets.ModelViewSet):
#     queryset = Attendance.objects.all()
#     serializer_class = AttendanceSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         meeting = Meeting.objects.get(id=self.request.data['meeting_id'])
#         # Only team members can attend the meeting
#         if self.request.user.profile.team == meeting.team:
#             serializer.save(participant=self.request.user, meeting=meeting)
#         else:
#             return Response({"detail": "Only team members can attend the meeting."}, status=status.HTTP_403_FORBIDDEN)