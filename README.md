blitzcrank
==========

Description
-----------

Jump around wp-admin in a blitz! Show the help-section by hitting `?`

If you are using WordPress' admin-section in english keyboard-shortcuts some of the the top-level pages will be:  
`d a` Dashboard  
`p o` Posts  
`m e` Media  
`p a` Pages  
`c o` Comments  
`?` Help Section  
And so on.. It uses the first two letters of the label to create the keyboard shortcut. Which means the shortcuts will make sense regardless of language.

Installation
------------

1. Upload the `blitzcrank` directory to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Check out the help-section by hitting `?` on your keyboard

Known Issues
------------

* Combo-collisions. Example: If `Settings` is open, the top-level menu-item `Media` collides with `Settings -> Media`. This will probably be solved with modifier keys.