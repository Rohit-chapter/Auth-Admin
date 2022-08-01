exports.isValueExists = (collection, property, value) => {

  let propertyExists = false;

  for (let item of collection) {

    if (item[property] === value) {
      propertyExists = true;
      break;
    }

  }

  return propertyExists;

};