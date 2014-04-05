<?php
/*
    Plugin Name: Blitzcrank
    Plugin URI: http://wordpress.org/plugins/blitzcrank/
    Description: Jump around wp-admin in a blitz! Show the help-section by hitting <code>?</code>
    Version: 1.0.0
    Author: Jens Nilsson
    Author URI: http://jensnilsson.nu
*/

$blitzcrank = new Blitzcrank();

class Blitzcrank {

    public function __construct() {
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
    }

    function enqueue() {
        wp_enqueue_style( 'blitzcrank', plugin_dir_url( __FILE__ ) . 'css/blitzcrank.css', array(), '20140404', 'all' );
        wp_enqueue_script( 'mousetrap', plugin_dir_url( __FILE__ ) . 'js/lib/mousetrap.min.js', array(), '1.4.6' );
        wp_enqueue_script( 'blitzcrank', plugin_dir_url( __FILE__ ) . 'js/blitzcrank.js', array( 'mousetrap' ), '20140405', true );

        $data = [
            'plugin_url' => plugin_dir_url( __FILE__ )
        ];

        wp_localize_script( 'blitzcrank', 'Blitzcrank', $data );
    }
}

?>