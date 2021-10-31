module.exports = {
  deleteElements,
};

function deleteElements(array, value) {
  for (let i in array) {
    if (array[i] === value) {
      array.splice(i, 1);
    }
  }
} //36ms for 16000 element

// function deleteElements(array, value) {
//   for (var i = 0; i < array.length; i++) {
//     if (array[i] === value) {
//       array.splice(i, 1);
//       i--;
//     }
//   }
// } //31ms for 16000 element
