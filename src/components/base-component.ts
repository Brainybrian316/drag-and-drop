namespace App {
	//! component base class (abstract means no one can instantiate this class)
	export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
		templateElement: HTMLTemplateElement;
		hostElement: T;
		element: U;

		constructor(
			templateId: string,
			hostElementId: string,
			insertAtStart: boolean,
			newElementId?: string,
		) {
			// '!' tells typescript to be non-null
			this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
			// 'as' is type casting to let typescript know this will be of 'element'
			this.hostElement = document.getElementById(hostElementId)! as T;

			// importNode is a document property on the document object 'content' exist on HTML elements
			const importedNode = document.importNode(this.templateElement.content, true); // takes 2 arguments
			// points to the node element of the template element which is a ul element in this case
			this.element = importedNode.firstElementChild as U; // keep in mind the first child will be a <ul>
			// check if newElementId is defined since it is optional
			if (newElementId) {
				// dynamically set the id of the ul element'
				this.element.id = newElementId;
			}

			this.attach(insertAtStart);
		}

		// takes in argument from the constructor
		private attach(insertAtBeginning: boolean) {
			// if insertAtBeginning is true then insert the element at the beginning of the host element else...
			this.hostElement.insertAdjacentElement(
				insertAtBeginning ? 'afterbegin' : 'beforeend',
				this.element,
			);
		}

		abstract configure(): void;

		abstract renderContent(): void;
	}
}
