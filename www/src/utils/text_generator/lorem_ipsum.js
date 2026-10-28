// ===========================================================================================================
// ==========================================     lorem_ipsum.js     =========================================
// ===========================================================================================================
// https://omegaunlimited.com/seotools/lorem-ipsum-text-generator.html
"use strict";

// sample 24 words text:
// in rhoncus id commodo quis tristique dapibus felis dignissim Duis tempor luctus quis feugiat interdum suscipit sapien sed sapien Suspendisse imperdiet nisl tempor mi

const RANDOM_ENGLISH = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "Nulla", 
                        "eu", "placerat", "Phasellus", "ultricies", "pharetra", "lectus", "varius", "dapibus", 
						"leo", "laoreet", "a", "Praesent", "orci", "eros", "rhoncus", "nec", "volutpat", "id", 
						"ut", "nunc", "Vivamus", "semper", "metus", "quam", "venenatis", "Proin", "accumsan", 
						"nisl", "augue", "non", "aliquet", "ante", "auctor", "sed", "Fusce", "sapien", "lobortis", 
						"lacinia", "faucibus", "Suspendisse", "bibendum", "interdum", "ex", "scelerisque", "dui", 
						"in", "maximus", "fringilla", "nisi", "ullamcorper", "suscipit", "tellus", "risus", "eget", 
						"nibh", "magna", "velit", "egestas", "ultrices", "ornare", "justo", "Aliquam", "pellentesque", 
						"mauris", "vulputate", "Aenean", "iaculis", "mollis", "vehicula", "vitae", "elementum", "purus", 
						"tristique", "gravida", "Nam", "et", "ligula", "Etiam", "felis", "vel", "sagittis", "libero", 
						"mi", "lacus", "turpis", "diam", "Maecenas", "neque", "quis", "convallis", "rutrum", "odio", 
						"Donec", "commodo", "hendrerit", "massa", "porttitor", "ac", "cursus", "eleifend", "posuere", 
						"Integer", "sodales", "blandit", "at", "vestibulum", "viverra", "pulvinar", "pretium", "mattis", 
						"tortor", "efficitur", "Cras", "tincidunt", "est", "feugiat", "urna", "tempor", "luctus", 
						"porta", "potenti", "Nullam", "fermentum", "sollicitudin", "Duis", "facilisis", "dignissim", 
						"habitant", "morbi", "senectus", "netus", "malesuada", "fames", "arcu", "tempus", "imperdiet", 
						"Curabitur", "euismod", "erat", "Quisque", "enim", "congue", "sem", "primis", "dictum", 
						"condimentum", "molestie", "finibus", "consequat"];
						
class LoremIpsum {	
	static CreateRandomString(length) {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		for (let i = 0; i < length; i++) {
		  result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}; // LoremIpsum.CreateRandomString()

	static GetRandomEnglish(word_count) {
		if (word_count == undefined)  word_count = 12;
		let out      = [];
		let use_seed = false;
		
		let text_length      = word_count;
		const seed_phrase    = "";
		const seed_frequency = 5;
		
		let seed_occurrences = 0;
		let seed_length      = 0;
		
		if (seed_phrase.length && seed_frequency.length && seed_frequency > 0) {
			seed_occurrences = Math.ceil( seed_frequency / 100 * textLength ); // # occurrences of seed
			seed_length = seedPhrase.trim().split(/\s+/).length; // # words in see		
			text_length = text_length - (seed_occurrences * seed_length);		
			use_seed = true;
		}
		
		for (let i = 0; i <text_length; i++) {
			out.push( RANDOM_ENGLISH[ Math.floor(Math.random() * RANDOM_ENGLISH.length) ] );		
		}
		
		if (use_seed) {
			const step = Math.floor( text_length / seed_occurrences );		
			for(let a = 1; a < seed_occurrences; a++) {
				out.splice(a * step, 0, seed_phrase);
			}		
			out.push(seed_phrase);
		}
		
		return out;
	} // LoremIpsum.GetRandomEnglish

	static Generate(word_count) {
		if (word_count == undefined)  word_count = 12;
		var out = LoremIpsum.GetRandomEnglish(word_count);	
		let unique_string = LoremIpsum.CreateRandomString(10 + (Math.random() * 30));
		// if (unique_string.length) out.push(unique_string);
		let value = out.join(" ");
		return value;
	} // LoremIpsum.Generate()
} // LoremIpsum	

// let result = LoremIpsum.Generate();
// console.log(result);

if ( typeof exports === 'object' ) {	
    exports.LoremIpsum = LoremIpsum
} // exports of 'lorem_ipsum.js'