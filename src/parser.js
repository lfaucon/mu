var Parser = require("jison").Parser;
  
MU_grammar = {
    "lex": {
        "rules": [
           ["\\s+",                    "/* skip whitespace */"],
           ["not",                     "return 'UNARY_OP';"],
           ["(or)|(=>)|(and)",         "return 'BINARY_OP';"],
           ["\\(",                     "return '(';"],
           ["\\)",                     "return ')';"],
           ["\\w+\\b",                "return 'WORD';"],
           ["$",                       "return 'EOF';"]
        ]
    },

    "operators": [
        ["left", "BINARY_OP", "UNARY_OP"],
    ],

    "bnf": {
        "expressions" :[[ "e EOF",   "console.log($1); return $1;"  ]],

        "e" :[[ "e BINARY_OP e",       "$$ = [$2, $1, $3];" ],
              [ "UNARY_OP e",          "$$ = [$1, $2];"],
              [ "( e )",   "$$ = $2;" ],
              [ "WORD",  "$$ = $1;" ],
              ]
    }
}


var parser = new Parser(MU_grammar);
var parserSource = parser.generate();
 
function stringToProp(s){
    return parser.parse(s);
}

/*
function propToString(prop){
    case (prop){
        when [a,b] -> return propToString(a)+" ("+propToString(b)+")"
        when [a,b,c] -> return propToString(b)+" "+propToString(a)+" "+propToString(c)
    }

}*/

stringToProp("not (not not( Test => AAA))")

