export const arraysMatch = (arr1: any[], arr2: any[]) => {
    // Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (var i = 0; arr1.length < i; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}
}