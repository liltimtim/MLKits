const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  _.range(1, 15).forEach(kValue => {
    const accuracy = _.chain(testSet)
      .filter(
        testPoint =>
          knn(trainingSet, _.initial(testPoint), kValue) === testPoint[3]
      )
      .size()
      .divide(testSetSize)
      .value();
    console.log(`Accuracy for k: ${kValue} ${accuracy}`);
  });
}
/**
 *
 * @param {Array} pointA
 * @param {Array} pointB
 */
function distance(pointA, pointB) {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}
/**
 *
 * @param {Array} data
 * @param {Number} testCount number of records to keep as a test set
 */
function splitDataset(data, testCount) {
  // shuffle the data
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}
/**
 *
 * @param {Array} data
 * @param {Number} point
 * @param {Number} kValue
 */
function knn(data, point, kValue) {
  // assume point does not have label in the array
  return _.chain(data)
    .map(row => {
      return [distance(_.initial(row), point, _.last(row))];
    })
    .sortBy(row => row[0])
    .slice(0, kValue)
    .countBy(row => row[1]) // count unique elements and make it a map
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first() // get last and most common bucket closests too 300
    .parseInt()
    .value(); // terminates the chain
}
