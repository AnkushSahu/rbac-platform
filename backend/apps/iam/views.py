from rest_framework import viewsets, permissions
from .models import Team, Role, Policy, RolePolicy, TeamRole
from .serializers import (
    TeamSerializer, RoleSerializer, PolicySerializer,
    RolePolicySerializer, TeamRoleSerializer
)

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by("-created_at")
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all().order_by("-created_at")
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]


class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all().order_by("-created_at")
    serializer_class = PolicySerializer
    permission_classes = [permissions.IsAuthenticated]


class RolePolicyViewSet(viewsets.ModelViewSet):
    queryset = RolePolicy.objects.select_related("role", "policy").all()
    serializer_class = RolePolicySerializer
    permission_classes = [permissions.IsAuthenticated]


class TeamRoleViewSet(viewsets.ModelViewSet):
    """
    Assignment endpoint. POST {team, role} to assign.
    DELETE /api/assignments/{id}/ to unassign.
    """
    queryset = TeamRole.objects.select_related("team", "role").order_by("-created_at")
    serializer_class = TeamRoleSerializer
    permission_classes = [permissions.IsAuthenticated]
