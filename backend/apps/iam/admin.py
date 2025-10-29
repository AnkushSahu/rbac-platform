from django.contrib import admin
from .models import Team, Role, Policy, RolePolicy

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    search_fields = ("name",)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")

@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ("id", "action", "resource", "effect")

@admin.register(RolePolicy)
class RolePolicyAdmin(admin.ModelAdmin):
    list_display = ("id", "role", "policy")
