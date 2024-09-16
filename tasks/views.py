from datetime import date
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Task, ExtensionRequest
from .serializers import TaskSerializer, ExtensionRequestSerializer
from django.contrib.auth.models import User
from users.models import Team
from rest_framework.decorators import api_view


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        profile = self.request.user.profile
        assigned_username = self.request.data.get('assigned_to')

        if assigned_username:
            try:
                assigned_user = User.objects.get(username=assigned_username)
            except User.DoesNotExist:
                return Response({"detail": "Assigned user does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            assigned_user = None

        serializer.save(team=profile.team, assigned_to=assigned_user)

    def get_queryset(self):
        profile = self.request.user.profile
        if profile.is_team_leader:
            return Task.objects.filter(team=profile.team)
        else:
            return Task.objects.filter(assigned_to=self.request.user)

    # Request extension for task
    from datetime import date  # Import to use today's date

    @action(detail=False, methods=['get'], url_path='extension-requests', permission_classes=[permissions.IsAuthenticated])
    def get_extension_requests(self, request):
        profile = request.user.profile

        # Check if the user is a team leader
        if profile.is_team_leader:
            # Filter only extension requests that belong to the user's team
            team_tasks = profile.team.tasks.all()
            extension_requests = ExtensionRequest.objects.filter(task__in=team_tasks, approved=None)  # Only pending requests
            serializer = ExtensionRequestSerializer(extension_requests, many=True)
            return Response(serializer.data, status=200)

        # If not a team leader, return unauthorized
        return Response({"detail": "You are not authorized to view extension requests."}, status=403)

    @action(detail=True, methods=['post'], url_path='request-extension')
    def request_extension(self, request, pk=None):
        task = self.get_object()

        # Only the task assignee can request an extension
        if task.assigned_to == request.user:
            reason = request.data.get('reason')
            requested_date = request.data.get('expected_completion_date')  # This is the new due date

            # Ensure both reason and requested_date are provided
            if reason and requested_date:
                # Create the extension request with today's date as the `requested_date`
                extension_request = ExtensionRequest.objects.create(
                    task=task,
                    task_name=task.task_name,
                    requested_by=request.user,
                    reason=reason,
                    requested_date=date.today(),  # Set the request date to today
                    new_due_date=requested_date  # Use the expected completion date from the request
                )
                task.requested_extension = True  # Mark that an extension has been requested
                task.save()
                return Response({
                    "task": TaskSerializer(task).data,
                    "extensionRequest": ExtensionRequestSerializer(extension_request).data
                }, status=status.HTTP_200_OK)
            return Response({"error": "Reason or expected completion date missing."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You are not authorized to request an extension for this task."}, status=status.HTTP_403_FORBIDDEN)


    @action(detail=True, methods=['post'], url_path='approve-extension')
    def approve_extension(self, request, pk=None):
        task = self.get_object()
        profile = self.request.user.profile

        if task.team == profile.team:
            extension_request = ExtensionRequest.objects.filter(task=task, approved=None).first()
            if extension_request:
                new_due_date = extension_request.new_due_date
                task.due_date = new_due_date
                task.requested_extension = False
                task.save()

                extension_request.approved = True
                extension_request.save()

                return Response({
                    "task": TaskSerializer(task).data,
                    "extensionRequest": ExtensionRequestSerializer(extension_request).data
                }, status=status.HTTP_200_OK)
            return Response({"error": "No pending extension requests for this task."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You are not authorized to approve the extension."}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['post'], url_path='reject-extension')
    def reject_extension(self, request, pk=None):
        task = self.get_object()
        profile = self.request.user.profile

        if task.team.id == profile.team.id:
            extension_request = ExtensionRequest.objects.filter(task=task, approved=None).first()
            if extension_request:
                task.requested_extension = False
                task.save()

                extension_request.approved = False
                extension_request.save()

                return Response({
                    "task": TaskSerializer(task).data,
                    "extensionRequest": ExtensionRequestSerializer(extension_request).data
                }, status=status.HTTP_200_OK)
            return Response({"error": "No pending extension requests for this task."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You are not authorized to reject the extension."}, status=status.HTTP_403_FORBIDDEN)
