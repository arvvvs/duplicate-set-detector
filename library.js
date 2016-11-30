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
* Parameters: An array containing sorted and parsed arrays, and the raw unfilered array of inputs
* Returns the set with the highest repetitive frequency and 
* if the set is a duplicate or invalid
*/
function checkInput(array_of_sorted_sets, raw_array) {
    //this will hold the sets as keys and value is number of times
    //they've been duplicated
    const fs = require('fs');
    let unique_sets = 0;
    let duplicate_sets = 0;
    let non_duplicate_sets = 0;
    let invalid_lines = 0;
    let set_freq = {};
    let input_line_number = 1;
    let highest_freq_set = {
        "set": [],
        "frequency": 0
    };
    fs.writeFileSync("output.txt", "Output: \n");
    for (let array_line of array_of_sorted_sets) {
        if (array_line.indexOf('\u2205') !== -1) {
            fs.appendFileSync("output.txt", "False line " + input_line_number + ":" + " invalid \n")
            invalid_lines++;
        }
        else if (set_freq[array_line] >= 0) {
            set_freq[array_line] += 1;
            duplicate_sets++;
            fs.appendFileSync("output.txt", "False line " + input_line_number+": "+raw_array[input_line_number-1]+"\n");
            if (set_freq[array_line] > highest_freq_set["frequency"]) {
                highest_freq_set["set"] = array_line;
                highest_freq_set["frequency"] = set_freq[array_line];
            }
            if(set_freq[array_line]===1){
                unique_sets--;
            }
        }
        else {
            set_freq[array_line] = 0;
            unique_sets++;
            non_duplicate_sets++;
            fs.appendFileSync("output.txt", "True line " + input_line_number+": "+raw_array[input_line_number-1]+"\n");
        }
        input_line_number++;
    }
    console.log(`There were ${unique_sets} unique sets, ${non_duplicate_sets} non duplicate sets, ${duplicate_sets} duplicate sets, ${invalid_lines} invalid sets`);
    console.log(`The set with the most frequent duplicate group was "${highest_freq_set.set}" with ${highest_freq_set.frequency} duplicates`);
}
/*
* Parameters: array containing all the invalid lines, and the unsorted and unparsed array
* Writes the invalid lines to file 
*/
function invalidWriteFile(invalid_lines, raw_array_set) {
    let invalid_lines_output = '';
    writeFilePromisified("./invalid_input.txt", 'List of Invalid Inputs-\n');
    appendFilePromisified("./invalid_input.txt", invalid_lines.size + ' lines were invalid out of ' + raw_array_set.length + ' lines\n');
    for (let line of invalid_lines) {
        let stringified_line = stringify(raw_array_set[line - 1]);
        invalid_lines_output += ("Line " + line + ": " + stringified_line + '\n');
    }
    return appendFilePromisified("./invalid_input.txt", invalid_lines_output);
}
/*
*parameters: a string
*Takes a string and returns a better representation of it
*/
function stringify(str) {
    let arr = str.split(',');
    str = JSON.stringify(arr);
    //removes array brackets
    let front_regex_array = /^\[/g;
    let back_regex_array = /\]$/g;
    str = str.replace(/(?:\\[rn])+/g, "");
    str = str.replace(front_regex_array, '');
    str = str.replace(back_regex_array, '');
    return str;

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
//gets the name of the input file
const file_input = process.argv[2];
if(file_input == undefined){
    console.log('No file given for input')
    console.log('Program now exiting')
    process.exit(1);
}
let parsed_arrays = read_and_parse_file(file_input);
invalidWriteFile(parsed_arrays["invalid_lines"], parsed_arrays["raw"]);
checkInput(parsed_arrays["sorted"], parsed_arrays["raw"]);
console.log("Duplicate and non duplicate lines in output.txt");
console.log("Invalid Input report in text file: invalid_input.txt");

