namespace App {
	export interface Draggable {
		// drag event is built into TS
		dragStartHandler(event: DragEvent): void;
		dragEndHandler(event: DragEvent): void;
	}

	export interface DragTarget {
		// signals that the thing is a valid drag target
		dragOverHandler(event: DragEvent): void;
		// react to the actual drop that happens
		dropHandler(event: DragEvent): void;
		// visual feedback for the user if dragged over the box or revert visual update
		dragLeaveHandler(event: DragEvent): void;
	}
}
