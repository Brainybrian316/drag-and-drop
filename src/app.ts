// Modules in es2015 are loaded asynchronously
import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';

// create a new instance of the class to render the form to the DOM when the app loads
new ProjectInput();

new ProjectList('active');

new ProjectList('finished');
