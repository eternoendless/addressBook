<nav class="navbar navbar-default">
	<div class="container">
		<div class="navbar-header">
			<a class="navbar-brand" href="#">Address Book</a>
		</div>

		<form class="navbar-form navbar-right" role="search">
			<div class="form-group">
				<input type="text" class="form-control" placeholder="Search contacts...">
			</div>
		</form>
	</div>
</nav>
<div class="container">

	<div class="add-contact-big">
		<button class="btn btn-primary btn-lg" id="contactList-addContactButton">
			<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
			Add contact
		</button>
	</div>

	<table class="table" id="contactsList">
		<thead>
		<tr>
			<th>Name</th>
			<th>Email</th>
			<th>Country</th>
			<th></th>
		</tr>
		</thead>
		<tbody>

		</tbody>
		<tfoot>
		<tr>
			<td colspan="4"><div class="itemCount pull-right"></div></td>
		</tr>
		</tfoot>
	</table>

</div>