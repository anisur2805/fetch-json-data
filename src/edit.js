import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import {
	useBlockProps,
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
} from "@wordpress/block-editor";
import {
	ToggleControl,
	RangeControl,
	PanelBody,
	PanelRow,
} from "@wordpress/components";
import PaginationComponent from "./Pagination";

import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
	const [userData, setUserData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [reportData, setReportData] = useState({
		data: [],
		current_page: 1,
		per_page: 4,
		total_items: 10,
		total_pages: 5,
	});


	const total_items   = 10;
	const max_num_pages = Math.ceil( total_items / attributes.rowsPerPage );


	function calculatePagination(totalItems, itemsPerPage) {
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		return totalPages;
	}

	const totalPages = calculatePagination(
		reportData.total_items,
		attributes.showPagination,
	);
	console.log(`Total Pages: ${totalPages}`);

	const handlePageChange = (newPage) => {
		setReportData((prevState) => ({
			...prevState,
			current_page: newPage,
		}));
	};

	console.log(attributes);
	const handleRowsPerPage = (perPage) => {
		setAttributes({ rowsPerPage: perPage });
	};

	useEffect(() => {
		fetch(
			`https://jsonplaceholder.typicode.com/users?_start=0&_limit=${attributes.rowsPerPage}`,
		)
			.then((response) => response.json())
			.then((data) => {
				setUserData(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setLoading(false);
			});
	}, [attributes.rowsPerPage]);

	const onChangeTitleAlignment = (newAlignment) => {
		setAttributes({
			titleAlignment: newAlignment === undefined ? "none" : newAlignment,
		});
	};

	const onChangeContentAlignment = (newAlignment) => {
		setAttributes({
			contentAlignment: newAlignment === undefined ? "none" : newAlignment,
		});
	};

	const onChangeTitle = (newTitle) => {
		setAttributes({
			title: newTitle,
		});
	};

	const onChangeContent = (newContent) => {
		setAttributes({
			content: newContent,
		});
	};

	const onChangePagination = (newVal) => {
		setAttributes({
			showPagination: newVal,
		});
	};

	return (
		<>
			<div {...useBlockProps()}>
				<InspectorControls>
					<PanelBody
						className="fetch-json-data-wrapper"
						title={__("Fetch JSON Data", "afs-form")}
						initialOpen={true}
					>
						<PanelRow>
							<RangeControl
								label={__("Rows Per Page", "fetch-json-data")}
								value={attributes.rowsPerPage}
								min="1"
								max="10"
								onChange={handleRowsPerPage}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__("Toggle Pagination", "fetch-json-data")}
								checked={attributes.showPagination}
								onChange={onChangePagination}
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>

				<BlockControls>
					<AlignmentToolbar
						value={attributes.titleAlignment}
						onChange={onChangeTitleAlignment}
					/>
				</BlockControls>
				<RichText
					tagName="h2"
					className="table-title"
					style={{ textAlign: attributes.titleAlignment }}
					value={attributes.title}
					onChange={onChangeTitle}
				/>
				<BlockControls>
					<AlignmentToolbar
						value={attributes.contentAlignment}
						onChange={onChangeContentAlignment}
					/>
				</BlockControls>
				<RichText
					className="table-content"
					tagName="p"
					style={{ textAlign: attributes.contentAlignment }}
					value={attributes.content}
					onChange={onChangeContent}
				/>

				{loading && <p>Loading...</p>}
				{!loading && userData && userData.length > 0 && (
					<table>
						<thead>
							<tr>
								<th>{__("ID", "fetch-json-data")}</th>
								<th>{__("Name", "fetch-json-data")}</th>
								<th>{__("Email", "fetch-json-data")}</th>
								<th>{__("Phone", "fetch-json-data")}</th>
								<th>{__("Website", "fetch-json-data")}</th>
							</tr>
						</thead>
						<tbody>
							{userData.map((user) => (
								<tr key={user.id}>
									<td>{user.id}</td>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.phone}</td>
									<td>{user.website}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{!loading && (!userData || userData.length === 0) && (
					<p>{__("No report found", "fetch-json-data")}</p>
				)}

				<PaginationComponent
					current_page={reportData.current_page}
					total_pages={reportData.total_pages}
					onChangePage={handlePageChange}
					showPagination={attributes.showPagination}
					max_num_pages={max_num_pages}
				/>
			</div>
		</>
	);
}
