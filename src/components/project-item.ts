/// <reference path="base-component.ts" />
/// <reference path="../models/drag-drop.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../decorator/autobind.ts" />

namespace App {
	export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
		private project: Project;

		get plural() {
			if (this.project.people === 1) {
				return '1 person';
			} else {
				return `${this.project.people} persons`;
			}
		}

		constructor(hostId: string, project: Project) {
			// id of the template element, id of the host element which is the ul element, we insert at the end, id of the li element(project)
			super('single-project', hostId, false, project.id);
			// references the project property of the class
			this.project = project;

			// passed down from the base class
			this.configure();
			this.renderContent();
		}

		@AutoBind
		dragStartHandler(event: DragEvent) {
			// we set the dataTransfer property of the event to the id of the project dataTransfer is built into the browser
			event.dataTransfer!.setData('text/plain', this.project.id);
			// effectAllowed is a property of the dataTransfer object
			event.dataTransfer!.effectAllowed = 'move';
		}

		dragEndHandler(_: DragEvent) {}

		configure() {
			// 'dragstart' is a built in event
			this.element.addEventListener('dragstart', this.dragStartHandler);
			// 'dragend' is a built in event
			this.element.addEventListener('dragend', this.dragEndHandler);
		}
		renderContent() {
			this.element.querySelector('h2')!.textContent = this.project.title;
			this.element.querySelector('h3')!.textContent = this.plural + ' assigned';
			this.element.querySelector('p')!.textContent = this.project.description;
		}
	}
}
