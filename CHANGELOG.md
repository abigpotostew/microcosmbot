# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2023-06-25
Release candidate.
* Admins can now ban a user and the user will not be able to join the group, even after they verify again, until an admin lifts the ban.
* A user cannot generate more than one invite link at a time. If they generate a new link, the old one will be invalidated. This ensures a user cannot generate multiple invite links and share with multiple users who do not qualify for the group.

## [0.2.0] - 2023-07-12
Release.
* Redesigned verify UI to include more info about which group the user is joining.
* Add support for wallet connect for mobile users.