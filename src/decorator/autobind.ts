namespace App {
	/* notes: 
1. decorators take 3 arguments: target, propertyKey, descriptor
2. target is the class prototype
3. propertyKey is the name of the method
4. descriptor is the property descriptor for the method
*/
	// auto bind decorator
	export function AutoBind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
		// descriptor.value is the original method implementation (the function)
		const originalMethod = descriptor.value;
		// adjustedDescriptor is the new property descriptor for the method
		const adjustedDescriptor: PropertyDescriptor = {
			// configurable is set to true so that the method can be overwritten
			configurable: true,
			// get is a getter function that returns a new function
			get() {
				// we bind the original method to the instance of the class.
				const boundFn = originalMethod.bind(this);
				// we return the bound function
				return boundFn;
			},
		};
		// we return the adjusted descriptor to overwrite the original descriptor
		return adjustedDescriptor;
	}
}
