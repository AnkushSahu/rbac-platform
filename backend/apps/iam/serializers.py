from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Team, Role, Policy, RolePolicy, TeamRole
from .validators import validate_policy_json

User = get_user_model()


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "name", "description", "created_at", "updated_at"]


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name", "description", "created_at", "updated_at"]


class TeamRoleSerializer(serializers.ModelSerializer):
    team_name = serializers.ReadOnlyField(source="team.name")
    role_name = serializers.ReadOnlyField(source="role.name")

    class Meta:
        model = TeamRole
        fields = ["id", "team", "team_name", "role", "role_name", "created_at", "updated_at"]


class RolePolicySerializer(serializers.ModelSerializer):
    role_name = serializers.ReadOnlyField(source="role.name")
    policy_display = serializers.ReadOnlyField(source="policy.action")

    class Meta:
        model = RolePolicy
        fields = ["id", "role", "role_name", "policy", "policy_display"]


class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = ["id", "action", "resource", "effect", "created_at", "updated_at"]

    def validate(self, attrs):
        validate_policy_json(attrs)
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
