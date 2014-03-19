#!/usr/bin/env node
// Prime Number Generator (operates on array of variable length)
// See Sieve of Eratosthenes: http://en.wikipedia.org/wiki/Sieve_of_Eratosthenes/ &
// "Lazy" Incremental Sieve: http://www.cs.hmc.edu/~oneill/papers/Sieve-JFP.pdf
// Functions: PrimeCount(array); Sieve(prime, array, end_range); FirstXPrimes(end_range); fmt(array);
// does not use priority queue data structure referenced by Melissa O'Neill
// Uses simple one dimensional array since I'm not familiar with more complex js data structures yet 
// no wheel or other optimizations implemented beyond squaring prime and checking every two primes


// Counts the number of Primes in the Array
var PrimeCount = function(a) {
	var z = 3;
	var count = 1;
// Start counting at 3 since it is more efficient to count only odd entries
	for (z = 3; z < (a.length + 1); z+=2) {
	     if (!isNaN(a[z])) {count++;}
	}
//	console.log("Count = " + count);
	return count;
}

// Determine for a given candidate prime, p, and array of primes prior to candidate, if it is composite (returns false) else prime (returns true)
// works for primes defined up to candidate prime, p
var IsPrime = function(p, a) {
//	console.log("In IsPrime() a[p]=" + a[p] + "\n");
	if (a[p] == undefined) {	
		return true;} 
	else
		return false;
}


// Find previous prime in array; returns 1 if curr is 2
// var PreviousPrime = function(curr, ay) {
//	var rtnval = curr;
//        console.log("Array = " + ay + " Curr = " + curr + "\n");
//	for (rtnval; rtnval > 1; rtnval--) {
//		if (!isNaN(ay[curr])) {
//		return rtnval;}
//	}
//	return 1;
//}


// Marks Array with all items that are composites of prime and sets index values in array to next "lazy" value
// while recursively setting index values for all previous primes below the bound
// Returns fully marked array with consistent index values with array[0] set to new upper bound

var IncSieve = function(newprime, array) {
//     console.log("Prime = " + prime + " Array = " + array + " end = " + end);
//   if array is marked from "prime", return array
// else mark array and make consistent for all index values up to bound (array[0])
	 var bound = array[0];
	 var i = 2; //start with first prime
	 // for each prime in array, working upward, test if they have been incremented to reach bound
	 for (i = 2; i <= newprime; i++) {
	 	if (!isNaN(array[i])) {
//	 		console.log("Got to right before while loop");
	 		while (array[i] < bound) {
	 			array[array[i] + i] = "FALSE";
	 			array[i] += i;
	 		}
	 		if (array[i] > bound) {bound = array[i];}
	 	}	
	 }
	 array[0] = bound;
//	 console.log("in IncSieve with array = " + array);
     return array;
};


// Function to find first k primes by incrementally calling Sieve

var FirstXPrimes = function(k) {
	// arr is a table of "discovered" primes for which there is a "lazy" iterator stored at the prime elements indicating the next iteration to marked off
	var arr= ["4", "X", 4]; // 2 is First prime number & 4 is the first index value (prime^2) with elements 0 set to bound and 1 set to NaN
	arr[arr[2]] = "FALSE"; // set 4th element to "FALSE"
	var i = 3; // index to first candidate prime after 2
	var b = 4; // first prime squared for optimization 
	while (PrimeCount(arr) < k) {
		if (IsPrime(i, arr)) {
			arr[i] = i * i;
			arr[arr[i]] = "FALSE";
			if (arr[i] > arr[0]) {arr[0] = arr[i];}
//			console.log("Calling IncSieve with i = " + i + " arr = " + arr);
			IncSieve(i, arr);
			}
		i+=2; // optimization to consider only odd numbers as candidates
//		console.log("k = " + k + " i = " + i);
	}
       return arr; 
   };

// Format by identifying primes in array
var fmt = function(ar) {
	var i = 2;
	var fmtarray = [2];
	for(i = 3; i < (ar.length +1); i+=2) {
		if (!isNaN(ar[i])) {
		   fmtarray.push(i);
//		   console.log("Array = " + ar + "i = " + i);
		}
	}
	return fmtarray.join(",");
};

// console.log("Primes Between 2 & " + N + "\n"); 
// console.log(fmt(FirstNPrimes(N)));

var X = 100;

var outfile = "Primes.txt";
var fs = require('fs');
fs.writeFileSync(outfile, fmt(FirstXPrimes(X))); 
