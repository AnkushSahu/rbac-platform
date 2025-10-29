from rest_framework import serializers

ALLOWED_EFFECTS = {"allow", "deny"}


def validate_policy_json(value: dict) -> dict:
    action = value.get("action")
    resource = value.get("resource")
    effect = value.get("effect", "allow")
    if not action or not resource:
        raise serializers.ValidationError("Policy requires 'action' and 'resource'.")
    if effect not in ALLOWED_EFFECTS:
        raise serializers.ValidationError("Policy 'effect' must be 'allow' or 'deny'.")
    return value
