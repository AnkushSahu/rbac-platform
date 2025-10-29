# # backend/urls.py
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from rest_framework.authtoken.views import obtain_auth_token
# from .views import TeamViewSet, RoleViewSet, PolicyViewSet, RolePolicyViewSet
#
# router = DefaultRouter()
# router.register(r"teams", TeamViewSet)
# router.register(r"roles", RoleViewSet)
# router.register(r"policies", PolicyViewSet)
# router.register(r"role-policies", RolePolicyViewSet)
#
# urlpatterns = [
#     path("api/", include(router.urls)),
#     path("api/token-auth/", obtain_auth_token),  # <<--- LOGIN ENDPOINT
# ]
#
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    TeamViewSet, RoleViewSet, PolicyViewSet,
    RolePolicyViewSet, TeamRoleViewSet
)

from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


router = DefaultRouter()
router.register(r"teams", TeamViewSet, basename="team")
router.register(r"roles", RoleViewSet, basename="role")
router.register(r"policies", PolicyViewSet, basename="policy")
router.register(r"role-policies", RolePolicyViewSet, basename="rolepolicy")
router.register(r"assignments", TeamRoleViewSet, basename="assignment")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/token-auth/", obtain_auth_token),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]
