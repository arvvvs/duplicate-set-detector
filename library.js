//reads the file and returns the contents in a sorted array
function readFile(file_to_read) {
    //file system reading
    const fs = require('fs');
    //name of the file we're using as input
    //reads file into a string
    const contents = fs.readFileSync(file_to_read, 'utf8');
    //contains the array to be returned
    let array_of_sorted_sets = [];
    let raw_input_array = [];
    //loops through the string line by line
    //and adds each line to the array_of_arrays
    let i = 0;
    let line_number = 1;
    let invalid_lines = [];
    while (i < contents.length) {
        let j = contents.indexOf("\n", i);
        let raw_content_array = contents.substring(i, j);
        let check = 0;
        raw_input_array.push(raw_content_array);
        let set_input = (contents.substring(i, j).split(","));
        let parsed_set = set_input.map((value) => {
            if (isNaN(Number(value)) || Number(value) === 0) {
                check++;
                return '\u2205';
            }
            else {
                return Number(value);
            }
        });
        if (check > 0) {
            invalid_lines.push(line_number);
        }
        array_of_sorted_sets.push(parsed_set.sort((a, b) => { return a - b }));
        i = j + 1;
        line_number++;
    }
    return { "sorted": array_of_sorted_sets, "raw": raw_input_array, "invalid_lines": invalid_lines };
}

function check_input(array_of_sorted_sets) {
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
}
function invalid_input_return(invalid_lines, raw_array_set) {
    const fs = require('fs');
    let array_output = '';
    console.time('timer');
    writeFilePromisified("./invalid_input.txt", 'List of Invalid Inputs-\n');
    for (let x of invalid_lines) {

        array_output+=("Line " + x + ": " + raw_array_set[x-1]+'\n');
        // if (x === 0) {
            // fs.writeFileSync("./invalid_input.txt", 'List of Invalid Inputs-\n');
            // (function(){
            // fs.writeFile("./invalid_input.txt", 'List of Invalid Inputs-\n');
            // }
            // )()
        // }
        // (function(raw_array_set, x) {
        //     // console.log(raw_array_set[x - 1]);
        //     fs.appendFile("./invalid_input.txt", "Line " + x + ": " + raw_array_set[x - 1], function(data, err) {
        //         if (err) {
        //             throw err;
        //         }
        //     })
        // })(raw_array_set, invalid_lines[x])

    }
    appendFilePromisified("./invalid_input.txt", array_output); 
    console.timeEnd('timer');
    // fs.writeFile("./invalid_input.txt", 'List of Invalid Inputs-\n', function (data, err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    /*    fs.appendFile("./invalid_input.txt", (array_output).join('\n'), function (data, err) {
            if (err) {
                console.log(err);
            }
        })
        */
}
function writeFilePromisified(filename, to_write) {
    const fs = require('fs');
    return new Promise(
        function (resolve, reject) {
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
function appendFilePromisified(filename, to_write) {
    const fs = require('fs');
    return new Promise(
        function (resolve, reject) {
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
let array_input = readFile('input.txt');
invalid_input_return(array_input["invalid_lines"], array_input["raw"]);
let invalid_lines_set = check_input(array_input["sorted"]);
// invalid_input_return(invalid_lines, array_input["raw"]);
console.timeEnd('init time');
//check_input([["50 41 20"]]);
// let invalid_linse = check_input(array_input);

