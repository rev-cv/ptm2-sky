
def serialize_min_user(user):
    last_transaction = max(user.transactions, key=lambda t: t.created_at) if user.transactions else None
    
    return {
        "id": user.id,
        "full_name": user.profile.full_name if user.profile else "",
        "email": user.email,
        "role": user.role,
        "avatar_url": user.profile.avatar_url if user.profile else None,
        "balance": last_transaction.balance if last_transaction else 0,
        "registered": user.registered.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

def serialize_max_user(user):

    last_transaction = max(user.transactions, key=lambda t: t.created_at) if user.transactions else None
    
    return {
        "id": user.id,
        "full_name": user.profile.full_name if user.profile else "",
        "email": user.email,
        "role": user.role,
        # "filters": user.custom_filters.count(),
        "avatar_url": user.profile.avatar_url if user.profile else None,
        "balance": last_transaction.balance if last_transaction else 0,
        "keys": [
            {
                "id": api_key.id,
                "mask_key": api_key.mask_key,
                "created_at": api_key.created_at.isoformat()
            } for api_key in user.apikeys
        ],
        "registered": user.registered.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }