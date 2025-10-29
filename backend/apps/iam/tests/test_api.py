import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_team_crud():
    client = APIClient()
    # list (anon OK)
    assert client.get("/api/teams/").status_code == 200

    # create requires auth
    assert client.post("/api/teams/", {"name":"X"}).status_code in (401,403)

    # login
    User.objects.create_user("bob", password="secret12345")
    resp = client.post("/api/auth/token/", {"username":"bob","password":"secret12345"}, format="json")
    token = resp.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    created = client.post("/api/teams/", {"name":"Alpha"} , format="json")
    assert created.status_code == 201
    tid = created.data["id"]

    got = client.get(f"/api/teams/{tid}/")
    assert got.status_code == 200
    assert got.data["name"] == "Alpha"

    patched = client.patch(f"/api/teams/{tid}/", {"description":"Core team"}, format="json")
    assert patched.status_code == 200
    assert patched.data["description"] == "Core team"

    deleted = client.delete(f"/api/teams/{tid}/")
    assert deleted.status_code == 204
