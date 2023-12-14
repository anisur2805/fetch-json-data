<div class="afs-report-table-fe">
	<h3> <?php echo $attributes['title']; ?> </h3>
	<p> <?php echo $attributes['content']; ?> </p>

	<table class="afs-report-table">
		<thead>
			<tr>
			<tr>
				<th><?php esc_html_e( 'ID', 'afs-fs' ); ?></th>
				<th><?php esc_html_e( 'Name', 'afs-fs' ); ?></th>
				<th><?php esc_html_e( 'Email', 'afs-fs' ); ?></th>
				<th><?php esc_html_e( 'Phone', 'afs-fs' ); ?></th>
				<th><?php esc_html_e( 'Website', 'afs-fs' ); ?></th>
			</tr>
			<tr>
			<?php
			$current_page = get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1;
			fetch_and_output_json_data( $attributes, $current_page );
			?>
			</tr>
			</tr>
		</thead>

		<tbody>
		</tbody>
	</table>

	<?php if ( $attributes['showPagination'] ) : // phpcs:ignore ?>
	<div class="afs-footer-pagination">	
		<?php
			$data = array(
				'total_pages'  => $attributes['rowsPerPage'],
				'current_page' => $current_page,
			);

			?>
	</div>
	<?php endif; ?>
</div>
