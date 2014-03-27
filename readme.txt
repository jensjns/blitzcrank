=== Blitzcrank ===
Contributors: jensnilsson
Tags: wp-admin, admin, shortcut, keyboard shortcut
Requires at least: 3.0.1
Tested up to: 3.8.1
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Jump around wp-admin in a blitz!

== Description ==

If you are using WordPress' admin-section in english keyboard-shortcuts some of the the top-level pages will be:  
<code>d a</code> Dashboard  
<code>p o</code> Posts  
<code>m e</code> Media  
<code>p a</code> Pages  
<code>c o</code> Comments  
<code>?</code> Help section  
And so on.. It uses the first two letters of the label to create the keyboard shortcut. Which means the shortcuts will make sense regardless of language.

== Installation ==

1. Upload the `blitzcrank` directory to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Check out the help-section by hitting `?` on your keyboard

== Frequently Asked Questions ==

= How do I show the help-section? =

By hitting `?`

== Screenshots ==

1. Help section for an english wp-admin

== Changelog ==

= 1.0.0 =
* Keyboard shortcuts to open submenus working
* Keyboard shortcuts to top-level pages working
* Help section showing activate keyboard-shortcuts
* Initial release

== Upgrade Notice ==

= 1.0.0 =
* Initial release

== Known Issues ==

* Combo-collisions. Example: If `Settings` is open, the top-level menu-item `Media` collides with `Settings -> Media`. This will probably be solved with modifier keys.

== Goals/Future ==

* Bring useful keyboard-shortcuts to wp-admin regardless of language.
* Bring useful keyboard-shortcuts to individual admin-screens.

== GitHub ==

My [github repository](https://github.com/jensjns/blitzcrank/) for this plugin, if you want to fork it.