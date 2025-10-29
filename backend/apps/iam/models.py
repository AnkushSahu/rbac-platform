from __future__ import annotations
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Team(TimestampedModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Role(TimestampedModel):
    # NOTE: no FK to Team anymore; roles are independent
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    # Optional convenience M2M if you want reverse access (not required for API):
    teams = models.ManyToManyField(
        Team, through="TeamRole", related_name="roles", blank=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Policy(TimestampedModel):
    EFFECT_CHOICES = [("allow", "allow"), ("deny", "deny")]
    action = models.CharField(max_length=100)
    resource = models.CharField(max_length=100)
    effect = models.CharField(max_length=10, choices=EFFECT_CHOICES, default="allow")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.effect}:{self.action}@{self.resource}"


class RolePolicy(TimestampedModel):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="role_policies")
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name="policy_roles")

    class Meta:
        unique_together = ("role", "policy")
        ordering = ["-created_at"]


class TeamRole(TimestampedModel):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="team_roles")
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="team_roles")

    class Meta:
        unique_together = ("team", "role")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.team} ↔ {self.role}"
