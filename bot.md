Initial interaction:
User navigates to this link to invite the bot (from the web frontent)
https://telegram.me/stargateway_bot?startgroup=true

user selects the channel

Bot DMs the invitor with a link to the channel admin panel (generates a OTP code for the admin panel so no login required)

user opens the admin panel and configures the


### This is the link to initially setup the bot in a group
https://telegram.me/microcosmbotdotxyz_bot?startgroup=true

### generate a unique link for group owner to add their group

## todo
* maybe need a session for each button
* [x] set max num token rules
* [x] logic to prevent duplciate addresses. unlink the address
* [x] edge case-- they verify wallet and get their link but do not click it for a while. Fixed by adding member only when they actually join
* [x] when the bot is kicked, deactivate the group and maybe also all the members
* first time group setup, links to https://t.me/microcosmbotdotxyz_bot?start=true which shows settings
* terms of service
* [x] verify page check if the otp is already used.
* [x] todo /help cmd, on DM and in group
* [x] prevent multipl pending invite links
* make audit log a configuration option 