<?php

/**
 * Fetch data from the API and output a table.
 *
 * @param array $attributes Block attributes.
 */
function fetch_and_output_json_data( $attributes, $paged ) {
	$per_page = $attributes['rowsPerPage'];
	$start    = ( $paged - 1 ) * $per_page;
	$api_url  = esc_url_raw( "https://jsonplaceholder.typicode.com/users?_limit={$per_page}&_start={$start}" );

	$response = wp_remote_get( $api_url );

	if ( is_wp_error( $response ) ) {
		printf( '<tr><td colspan="5">%s</td></tr>', esc_html( $response->get_error_message() ) );
		return;
	}

	$response_code = wp_remote_retrieve_response_code( $response );
	if ( 200 !== $response_code ) {
		printf( '<tr><td colspan="5">%s</td></tr>', esc_html( 'Error: ' . $response_code ) );
		return;
	}

	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body, true );

	if ( ! is_array( $data ) ) {
		printf( '<tr><td colspan="5">%s</td></tr>', esc_html( 'Invalid data format' ) );
		return;
	}

	// Output table rows
	foreach ( $data as $item ) {
		printf(
			'<tr>
                <td>%s</td>
                <td>%s</td>
                <td>%s</td>
                <td>%s</td>
                <td>%s</td>
            </tr>',
			esc_attr( $item['id'] ),
			esc_attr( $item['name'] ),
			esc_attr( $item['email'] ),
			esc_attr( $item['phone'] ),
			esc_url( $item['website'] )
		);
	}

	echo '</table>';

	$total_items   = 10; // As we know users endpoint has 10 items only.
	$max_num_pages = ceil( $total_items / $per_page );

	$paginate_links_args = array(
		'total'   => $max_num_pages,
		'current' => $paged,
	);

	printf( '<div class="afs-footer-pagination">%s</div>', paginate_links( $paginate_links_args ) );
}
