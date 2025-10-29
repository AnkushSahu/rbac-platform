import pytest
from django.contrib.auth.models import User
from apps.iam.models import Team, Role, Policy, RolePolicy, Membership

@pytest.mark.django_db
def test_create_team_role_policy():
    t = Team.objects.create(name="Engineering")
    r = Role.objects.create(name="admin")
    p = Policy.objects.create(action="read", resource="repo", effect="allow")
    rp = RolePolicy.objects.create(role=r, policy=p)
    assert str(p) == "allow:read:repo"
    assert rp.role == r

@pytest.mark.django_db
def test_membership_unique_user_team():
    user = User.objects.create_user("alice", password="x")
    team = Team.objects.create(name="Ops")
    role = Role.objects.create(name="viewer")
    Membership.objects.create(user=user, team=team, role=role)
    with pytest.raises(Exception):
        Membership.objects.create(user=user, team=team, role=role)
