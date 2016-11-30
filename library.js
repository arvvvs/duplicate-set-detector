/*
* parameters: name of the file to read
* Reads the file and returns the contents in a sorted array
*/
function read_and_parse_file(file_to_read) {
    //requires file system module
    const fs = require('fs');
    //reads entire file into a single string
    const contents = fs.readFileSync(file_to_read, 'utf8');
    //contains the unsorted array to be returned
    let raw_input_array = [];
    //contains the parsed and sorted array to be returned
    let array_of_sorted_sets = [];
    //contains the line numbers of the invalid lines
    let invalid_lines_set = new Set();
    let start_of_line_index = 0;
    //Keeps track of the line number we are on
    let line_number = 1;
    //loops through the string line by line adding each line to an array
    //parses array to see if it has non numerical values and marks them 
    while (start_of_line_index < contents.length) {
        /*
        * Because the entire file is in a single string 
        * we find the index of the start of a line and the end of a line 
        * parse that 
        */ 
        let end_of_line_index = contents.indexOf("\n", start_of_line_index);
        let raw_content_array = contents.substring(start_of_line_index, end_of_line_index);
        let set_input = (contents.substring(start_of_line_index, end_of_line_index).split(","));
        //parses array to either return a number or ∅ if character is not a number
        // if character is not a number returns line the number is on
        let parsed_set = set_input.map((value) => {
            if (isNaN(Number(value)) || Number(value) === 0) {
                invalid_lines_set.add(line_number)
                return '\u2205';
            }
            else {
                return Number(value);
            }
        });
        //sorts the array and adds it to an array containing the sets
        array_of_sorted_sets.push(parsed_set.sort((a, b) => { return a - b }));
        //adds "raw" unsorted and unparsed array to array containing other lines
        raw_input_array.push(raw_content_array);
        //increments line number
        line_number++;
        //finds the start of the next line
        start_of_line_index = end_of_line_index + 1;
    }
    // returns sorted and raw arrays along with an array containing
    // all the invalid lines in the file
    return { "sorted": array_of_sorted_sets, "raw": raw_input_array, "invalid_lines": invalid_lines_set };
}
/*
* Parameters: An array containing sorted and parsed arrays
* Returns the set with the highest repetitive frequency and 
* checks to see if set is duplicate or new
*/
function checkInput(array_of_sorted_sets) {
    //this will hold the sets as keys and value is number of times
    //they've been duplicated
    let set_freq = {};
    let input_line_number = 1;
    // let invalid_input_line_numbers = [];
    let highest_freq_set = {
        "set": [],
        "frequency": 0
    };
    for (let array_line of array_of_sorted_sets) {
        // console.log(input_line_number);
        if (array_line.indexOf('\u2205') !== -1) {
            // console.log("invalid input");
            // invalid_input_line_numbers.push(input_line_number);
        }
        else if (set_freq[array_line] >= 0) {
            set_freq[array_line] += 1;
            // console.log(`${array_line} is a duplicate ${set_freq[array_line]}`)
            if (set_freq[array_line] > highest_freq_set["frequency"]) {
                highest_freq_set["set"] = array_line;
                highest_freq_set["frequency"] = set_freq[array_line];
            }
        }
        else {
            set_freq[array_line] = 0;
            // console.log(`${array_line} is new`)
        }
        input_line_number++;
    }
    // console.log(highest_freq_set);
    // return invalid_input_line_numbers;
    return highest_freq_set;
}
/*
* Parameters: array containing all the invalide lines, and the unsorted and unparsed array
* Writes the invalid lines to file 
*/
function invalidWriteFile(invalid_lines, raw_array_set) {
    let invalid_lines_output = '';
    writeFilePromisified("./invalid_input.txt", 'List of Invalid Inputs-\n');
    appendFilePromisified("./invalid_input.txt", invalid_lines.size + ' lines were invalid out of ' + raw_array_set.length + ' lines\n');
    for (let x of invalid_lines) {
        invalid_lines_output += ("Line " + x + ": " + raw_array_set[x - 1] + '\n');
    }
    return appendFilePromisified("./invalid_input.txt", invalid_lines_output);
}
/*
* Paramters: name of the file, and string to be written to file 
* Uses promises to write to file, overwriting what was previously in the file
*/
function writeFilePromisified(filename, to_write) {
    const fs = require('fs');
    return new Promise(
        function(resolve, reject) {
            fs.writeFile(filename, to_write,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
}
/*
* Paramters: name of the file, and string to be written to file 
* Appends to file using promises
*/
function appendFilePromisified(filename, to_write) {
    const fs = require('fs');
    return new Promise(
        function(resolve, reject) {
            fs.appendFile(filename, to_write,
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
}
const file_input = process.argv[2];
console.time('init time');
let parsed_arrays = read_and_parse_file('input.txt');
console.time('timer');
invalidWriteFile(parsed_arrays["invalid_lines"], parsed_arrays["raw"]);
console.timeEnd('timer');
console.log(checkInput(parsed_arrays["sorted"]));
// invalid_input_return(invalid_lines, array_input["raw"]);
console.timeEnd('init time');
//check_input([["50 41 20"]]);
// let invalid_linse = check_input(array_input);

