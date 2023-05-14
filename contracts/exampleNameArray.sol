// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract NameContract {
    // Define a mapping from uint to string
    mapping(uint => string) public names;

    constructor() {
        // Initialize the mapping with 30 prewritten names
        names[1] = "Alice";
        names[2] = "Bob";
        names[3] = "Charlie";
        names[4] = "David";
        names[5] = "Eve";
        names[6] = "Frank";
        names[7] = "Grace";
        names[8] = "Heidi";
        names[9] = "Ivan";
        names[10] = "Judy";
        names[11] = "Karl";
        names[12] = "Liam";
        names[13] = "Mia";
        names[14] = "Noah";
        names[15] = "Olivia";
        names[16] = "Paul";
        names[17] = "Quinn";
        names[18] = "Rachel";
        names[19] = "Sam";
        names[20] = "Trudy";
        names[21] = "Ursula";
        names[22] = "Victor";
        names[23] = "Wendy";
        names[24] = "Xavier";
        names[25] = "Yolanda";
        names[26] = "Zack";
        names[27] = "Anna";
        names[28] = "Brian";
        names[29] = "Christine";
        names[30] = "Daniel";
    }

    // Function to retrieve a name given a uint key
    function getName(uint key) public view returns (string memory) {
        return names[key];
    }
}
