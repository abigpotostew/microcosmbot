Initial interaction:
User navigates to this link to invite the bot (from the web frontent)
https://telegram.me/stargateway_bot?startgroup=true

user selects the channel

Bot DMs the invitor with a link to the channel admin panel (generates a OTP code for the admin panel so no login required)

user opens the admin panel and configures the


remove from group: msg:
```json
{
  "update": {
    "update_id": 179506053,
    "my_chat_member": {
      "chat": {
        "id": -1001981308196,
        "title": "stargate dev 03",
        "type": "supergroup"
      },
      "from": {
        "id": 6100753315,
        "is_bot": false,
        "first_name": "Stew",
        "last_name": "Dev01",
        "username": "stewdev01",
        "language_code": "en"
      },
      "date": 1686765189,
      "old_chat_member": {
        "user": {
          "id": 5904192851,
          "is_bot": true,
          "first_name": "Stargateway",
          "username": "stargateway_bot"
        },
        "status": "member"
      },
      "new_chat_member": {
        "user": {
          "id": 5904192851,
          "is_bot": true,
          "first_name": "Stargateway",
          "username": "stargateway_bot"
        },
        "status": "left"
      }
    }
  },
  "api": {
    "raw": {},
    "config": {}
  },
  "me": {
    "id": 5904192851,
    "is_bot": true,
    "first_name": "Stargateway",
    "username": "stargateway_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": true,
    "supports_inline_queries": true
  },
  "chatMembers": {}
}
```


Add bot message:
```json
{
  "update": {
    "update_id": 179506051,
    "my_chat_member": {
      "chat": {
        "id": -1001981308196,
        "title": "stargate dev 03",
        "type": "supergroup"
      },
      "from": {
        "id": 6100753315,
        "is_bot": false,
        "first_name": "Stew",
        "last_name": "Dev01",
        "username": "stewdev01",
        "language_code": "en"
      },
      "date": 1686765137,
      "old_chat_member": {
        "user": {
          "id": 5904192851,
          "is_bot": true,
          "first_name": "Stargateway",
          "username": "stargateway_bot"
        },
        "status": "left"
      },
      "new_chat_member": {
        "user": {
          "id": 5904192851,
          "is_bot": true,
          "first_name": "Stargateway",
          "username": "stargateway_bot"
        },
        "status": "member"
      }
    }
  },
  "api": {
    "raw": {},
    "config": {}
  },
  "me": {
    "id": 5904192851,
    "is_bot": true,
    "first_name": "Stargateway",
    "username": "stargateway_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": true,
    "supports_inline_queries": true
  },
  "chatMembers": {}
}
```


correclty adding via startgroup=true

```json
{
  "update": {
    "update_id": 179506055,
    "my_chat_member": {
      "chat": {
        "id": -1001981308196,
        "title": "stargate dev 03",
        "type": "supergroup"
      },
      "from": {
        "id": 6100753315,
        "is_bot": false,
        "first_name": "Stew",
        "last_name": "Dev01",
        "username": "stewdev01",
        "language_code": "en"
      },
      "date": 1686765255,
      "old_chat_member": {
        "user": {
          "id": 5904192851,
          "is_bot": true,
          "first_name": "Stargateway",
          "username": "stargateway_bot"
        },
        "status": "kicked",
        "until_date": 0
      },
      "new_chat_member": {
        "user": {
          "id": 5904192851,
          "is_bot": true,
          "first_name": "Stargateway",
          "username": "stargateway_bot"
        },
        "status": "administrator",
        "can_be_edited": false,
        "can_manage_chat": true,
        "can_change_info": true,
        "can_delete_messages": false,
        "can_invite_users": true,
        "can_restrict_members": true,
        "can_pin_messages": true,
        "can_manage_topics": false,
        "can_promote_members": false,
        "can_manage_video_chats": false,
        "is_anonymous": false,
        "can_manage_voice_chats": false
      }
    }
  },
  "api": {
    "raw": {},
    "config": {}
  },
  "me": {
    "id": 5904192851,
    "is_bot": true,
    "first_name": "Stargateway",
    "username": "stargateway_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": true,
    "supports_inline_queries": true
  },
  "chatMembers": {}
}
```

when a user modifies the bot admin permissions:

```json
{
  "update": {
    "update_id": 179506057,
    "my_chat_member": {
      "chat": {
        "id": -1001981308196,
        "title": "stargate dev 03",
        "type": "supergroup"
      },
      "from": {
        "id": 6100753315,
        "is_bot": false,
        "first_name": "Stew",
        "last_name": "Dev01",
        "username": "stewdev01",
        "language_code": "en"
      },
      "date": 1686765325,
      "old_chat_member": {
        "user": {
          "id": 5904192851,
          "is_bot": true,
          "first_name": "Stargateway",
          "username": "stargateway_bot"
        },
        "status": "administrator",
        "can_be_edited": false,
        "can_manage_chat": true,
        "can_change_info": true,
        "can_delete_messages": false,
        "can_invite_users": true,
        "can_restrict_members": true,
        "can_pin_messages": true,
        "can_manage_topics": false,
        "can_promote_members": false,
        "can_manage_video_chats": false,
        "is_anonymous": false,
        "can_manage_voice_chats": false
      },
      "new_chat_member": {
        "user": {
          "id": 5904192851,
          "is_bot": true,
          "first_name": "Stargateway",
          "username": "stargateway_bot"
        },
        "status": "administrator",
        "can_be_edited": false,
        "can_manage_chat": true,
        "can_change_info": true,
        "can_delete_messages": false,
        "can_invite_users": true,
        "can_restrict_members": false,
        "can_pin_messages": true,
        "can_manage_topics": false,
        "can_promote_members": false,
        "can_manage_video_chats": false,
        "is_anonymous": false,
        "can_manage_voice_chats": false
      }
    }
  },
  "api": {
    "raw": {},
    "config": {}
  },
  "me": {
    "id": 5904192851,
    "is_bot": true,
    "first_name": "Stargateway",
    "username": "stargateway_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": true,
    "supports_inline_queries": true
  },
  "chatMembers": {}
}
```