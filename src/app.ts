/// <reference path="./models/drag-drop.ts" />
/// <reference path="./models/project.ts" />
/// <reference path="./utils/validation.ts" />
/// <reference path="./decorator/autobind.ts" />
/// <reference path="./components/project-input.ts" />
/// <reference path="./components/project-list.ts" />
/// <reference path="./components/project-item.ts" />

namespace App {
	// create a new instance of the class to render the form to the DOM when the app loads
	new ProjectInput();

	new ProjectList('active');

	new ProjectList('finished');
}
