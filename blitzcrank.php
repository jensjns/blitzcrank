<?php
/*
    Plugin Name: Blitzcrank
    Plugin URI: http://wordpress.org/plugins/blitzcrank/
    Description: Jump around wp-admin in a blitz! Show the help-section by hitting <code>?</code>
    Version: 1.1.0
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
        wp_enqueue_script( 'doT', plugin_dir_url( __FILE__ ) . 'js/lib/doT.min.js', array(), 'daf27a4d673bf321d80634e12e65530aa4c67edb' );
        wp_enqueue_script( 'blitzcrank', plugin_dir_url( __FILE__ ) . 'js/blitzcrank.js', array( 'mousetrap', 'doT' ), '20140405', true );

        $data = [
            'plugin_url' => plugin_dir_url( __FILE__ ),
            'screen' => get_current_screen()->id
        ];

        wp_localize_script( 'blitzcrank', 'Blitzcrank', $data );
    }
}

?>