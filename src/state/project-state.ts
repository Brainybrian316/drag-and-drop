import { Project, ProjectStatus } from '../models/project';

// listener for listener type field
type Listener<T> = (items: T[]) => void;

// base state class
class State<T> {
	protected listeners: Listener<T>[] = [];

	addListener(listenerFn: Listener<T>) {
		// the idea is to have an array of function references so that when something changes we can loop through them and call them
		this.listeners.push(listenerFn);
	}
}

//! project state management class
export class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, people: number) {
		// create a new project with a unique id
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			people,
			ProjectStatus.Active, // default status using the enum
		);
		this.projects.push(newProject);
		this.updateListeners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((project) => project.id === projectId);
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}

	private updateListeners() {
		// loop through all the listeners and call them to update the UI
		for (const listenerFn of this.listeners) {
			// use slice so it doesn't mutate the original array
			listenerFn(this.projects.slice());
		}
	}
}

export const projectState = ProjectState.getInstance();
