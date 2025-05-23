
export const commands = {
  createVariable: /create\s+(?:a\s+)?variable\s+(\w+)\s+(?:equal\s+to|equals|=)\s+(.+)/i,
  createFunction: /create\s+(?:a\s+)?function\s+(\w+)/i,
  print: /print\s+(.+)/i,
  runCode: /run\s+(?:the\s+)?code/i,
  clearCode: /clear\s+(?:the\s+)?code/i,
  help: /(?:show|tell\s+me)\s+(?:the\s+)?commands/i,
  setInput: /(?:set|input)\s+(\w+)\s+(?:to|as|equals?)\s+(.+)/i,
  multiplicationProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+multiplication\s+(?:of\s+)?(?:two)\s+numbers/i,
  divisionProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+division\s+(?:of\s+)?(?:two\s+)?numbers/i,
  leapYearProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+leap\s+year/i,
  evenOddProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+even\s+or\s+odd/i,
  primeNumberProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+prime\s+number/i,
  firstNumber: /(?:first|1st)\s+number\s+(?:is|equals?|=)?\s+(\d+)/i,
  secondNumber: /(?:second|2nd)\s+number\s+(?:is|equals?|=)?\s+(\d+)/i,
  setNumber: /(?:number|num|year)\s+(?:is|equals?|=)?\s+(\d+)/i,
  additionProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+addition\s+(?:of\s+)?(?:two)\s+numbers/i,
  lcmProgram: /write\s+(?:a\s+)?program\s+(?:on|for)?\s+lcm\s+(?:of\s+)?(?:two)\s+numbers/i,
};
