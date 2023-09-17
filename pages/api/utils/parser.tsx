import { marked } from "marked";

export const parser = (s: string) => {
	const description = {
		name: "cloze",
		level: "inline", // Is this a block-level or inline-level tokenizer?
		start(src: any) {
			const result2 = src.match(/\{\{c/)?.index;
			return result2;
		}, // Hint to Marked.js to stop and check for a match
		tokenizer(src: any) {
			const rule2 = /^\{\{c:([^{]*)\}\}/; // Regex for the complete token, anchor to string start
			// const rule2 = /^\{\{c(\d+)::([^{]*)\}\}/; // Regex for the complete token, anchor to string start
			const match = rule2.exec(src);
			if (match) {
				return {
					// Token to generate
					type: "cloze", // Should match "name" above
					raw: match[0], // Text to consume from the source
					text: match[0], // Text to consume from the source
					clozeContent: match[1], //   any further-nested inline tokens
				};
			}
		},
		renderer(token: any) {
			return `${token}`;
		},
		childTokens: ["dt", "dd"], // Any child tokens to be visited by walkTokens
	};

	function walkTokens(token: any) {
		// Post-processing on the completed token tree
		if (token.type === "strong") {
			token.text += " walked";
			token.tokens = (this as unknown as any).Lexer.lexInline(token.text);
		}
	}
	marked.use({ extensions: [description], walkTokens });
	const lexer = new marked.Lexer();
	return lexer.lex(s);
};
