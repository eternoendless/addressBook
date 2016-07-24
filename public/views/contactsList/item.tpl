{{#each contacts}}
<tr data-contact-id="{{this.id}}">
	<td>{{this.fullName}}</td>
	<td>{{this.email}}</td>
	<td>{{this.countryName}}</td>
	<td class="contact-list-buttons">
		<button type="button" class="btn btn-default btn-sm edit-contact"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Edit</button>
		<button type="button" class="btn btn-danger btn-sm delete-contact"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete</button>
	</td>
</tr>
{{/each}}