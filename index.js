const path = require("path");
const fs = require("fs");

// Consts
const METADATA_ID_REGEX = /(id:\s)(.+)/;
const METADATA_NAME_REGEX = /(name:\s)(.+)/;
const INPUT_ARG = 2;
const OUTPUT_ARG = 3;
const INDEX_ARG = 4;

// ARGS
const inputPath = process.argv[INPUT_ARG];
const outputPath = process.argv[OUTPUT_ARG];
const startIndex = Number.parseInt(process.argv[INDEX_ARG]);

// ARGS check
if (!inputPath || !outputPath || !startIndex) {
  console.error("⚠️\t Missing args, see README.md!");
  return;
}

// Folders
const directoryInputPath = path.join(__dirname, inputPath);
const directoryOutputPath = path.join(__dirname, outputPath);

// Ensure output dir exists
if (!fs.existsSync(directoryOutputPath)) fs.mkdirSync(directoryOutputPath);

// Read Input dir
fs.readdir(directoryInputPath, function (err, fileNames) {
  if (err) return console.log("Unable to scan directory: " + err);
  // Filter task files
  const taskFileNames = fileNames.filter((m) => m.endsWith(".task"));
  // Loop trough each filenames
  taskFileNames.forEach(function (fileName, i) {
    const index = startIndex + i;
    const paddedIndex = padWithZeroes(index, 3);
    fs.readFile(path.join(directoryInputPath, fileName), "utf8", function (err, content) {
      // Replace content
      content = content.replace(METADATA_ID_REGEX, `$1task-${paddedIndex}`);
      content = content.replace(METADATA_NAME_REGEX, `$1Task ${index}`);

      // Write File
      fs.writeFileSync(path.join(directoryOutputPath, `task-${paddedIndex}.task`), content);
    });
  });
});

/**
 * Pads a given number with zeroes until the given length
 * @param {*} number
 * @param {*} length
 */
function padWithZeroes(number, length) {
  var my_string = "" + number;
  while (my_string.length < length) {
    my_string = "0" + my_string;
  }
  return my_string;
}
