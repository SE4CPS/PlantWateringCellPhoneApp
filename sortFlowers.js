var flowers = [
  "Rose",
  "Tulip",
  "Sunflower",
  "Daisy",
  "Snapdragon",
  "Orchid",
  "Carnation",
  "Buttercup",
  "Hibiscus",
]

console.log(flowers.sort());

var countComparission = 0;

function sortFlowers() {
  var isSorted = true;
	for (var j = 0; j < flowers.length; j = j + 1) {
    for (var index = 0; index < flowers.length - j; index = index + 1) {

      var flower1 = flowers[index];
      var flower2 = flowers[index+1];

      if (flower1 > flower2) { // flower1 = Rose and flower2 = Daisy
        isSorted = false;
        flowers[index] = flower2;
        flowers[index+1] = flower1;
      }
      countComparission = countComparission + 1;
    }

    if (isSorted == true) {
      countComparission
      return;
    }
    
  }
  console.log(countComparission)
}
  
// sortFlowers();
