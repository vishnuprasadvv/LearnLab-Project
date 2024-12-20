export const preprocessQuery = (query:string):string => {
    // Normalize query by removing all non-alphanumeric characters
    const normalizedQuery = query.replace(/[^a-zA-Z0-9]/g, '');
    // Add regex to allow for zero or more non-alphanumeric characters between letters
    return normalizedQuery.split('').join('[^a-zA-Z0-9]*');
  };