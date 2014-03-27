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
        add_action( 'adminmenu', array( $this, 'parse_menu' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
    }

    function enqueue() {
        wp_enqueue_style( 'blitzcrank', plugin_dir_url( __FILE__ ) . 'css/blitzcrank.css', array(), '20140326', 'all' );
    }

    function parse_menu() {
        wp_enqueue_script( 'mousetrap', plugin_dir_url( __FILE__ ) . 'js/lib/mousetrap.min.js', array(), '1.4.6' );
        wp_enqueue_script( 'blitzcrank', plugin_dir_url( __FILE__ ) . 'js/blitzcrank.js', array( 'mousetrap' ), '20140326' );

        global $menu;
        global $submenu;
        $bindings = [];

        $data = [
            'help_template' => plugin_dir_url( __FILE__ ) . 'help-template.html',
            'bindings' => []
        ];

        $request_uri = $_SERVER['REQUEST_URI'];

        foreach ( $menu as $menupage ) {
            if ( strlen( $menupage[0] ) > 1 ) {

                $data['bindings'][] = $this->add_bind( $menupage[0], $menupage[2], $menupage[5], 'menu-top' );

                if ( substr( $request_uri, -strlen($menupage[2]) ) == $menupage[2] ) {
                    if ( isset( $submenu[ $menupage[2] ] ) ) {
                        foreach ( $submenu[ $menupage[2] ] as $index => $submenupage ) {
                            if ( $index != 0 ) {
                                if ( strpos($submenupage[2], '.php') === false ) {
                                    $target = add_query_arg( array('page' => $submenupage[2]), $menupage[2] );
                                } else {
                                    $target = $submenupage[2];
                                }
                                $data['bindings'][] = $this->add_bind( $submenupage[0], $target, '', 'sub-menu' );
                            }
                        }
                    }
                }
            }
        }


        wp_localize_script( 'blitzcrank', 'Blitzcrank', $data );
    }

    function add_bind( $name, $target, $selector, $type ) {
        return array(
            'name'      => $name,
            'combo'     => substr( $name, 0, 1 ) . ' ' . substr( $name, 1, 1 ),
            'target'    => $target,
            'selector'  => ( !empty( $selector ) ) ? preg_replace( '|[^a-zA-Z0-9_:.]|', '-', $selector ) : false,
            'type'      => $type
        );
    }
}
?>