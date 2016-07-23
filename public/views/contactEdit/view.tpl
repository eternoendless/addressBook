<div class="container">
	<h1 class="page-header">
		{{#if contact.id}}Edit{{else}}New{{/if}} Contact
	</h1>
	<form role="form" id="editContactForm">
		<div class="form-group">
			<label for="name">First Name</label>
			<input type="text" class="form-control" id="name" name="name" placeholder="First Name" required>
			<div class="help-block with-errors"></div>
		</div>
		<div class="form-group">
			<label for="name">Last Name</label>
			<input type="text" class="form-control" id="surname" name="surname" placeholder="Last Name" required>
			<div class="help-block with-errors"></div>
		</div>
		<div class="form-group">
			<label for="email">Email address</label>
			<input type="email" class="form-control" id="email" name="email" placeholder="Email address" required>
			<div class="help-block with-errors"></div>
		</div>
		<div class="form-group">
			<label for="country">Country</label>
			<select class="form-control" id="country" name="country" required>
				<option disabled selected value>&mdash; Choose a country &mdash;</option>
				{{{countries}}}
			</select>
			<div class="help-block with-errors"></div>
		</div>
		<button type="submit" class="btn btn-primary" id="saveButton">Save</button>
		<button type="button" class="btn btn-link" id="cancelButton">Cancel</button>
	</form>
</div>