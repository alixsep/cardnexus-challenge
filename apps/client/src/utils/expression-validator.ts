/**
 * Operators used in the expression builder
 */
export const OPERATOR_CONFIG = [
  { icon: 'AND', value: 'AND' },
  { icon: 'OR', value: 'OR' },
  { icon: 'NOR', value: 'NOR' },
  { icon: '(', value: '(' },
  { icon: ')', value: ')' },
]
export const OPERATOR_VALUES = OPERATOR_CONFIG.map(o => o.value)

/**
 * Checks basic syntax rules:
 * 1) Balanced parentheses.
 * 2) Proper sequence of operators and operands.
 * 3) No operators in a row (except '(' can follow an operator, ')' can precede an operator).
 * 4) No operand-operand adjacency without an operator between them.
 */
export function isExpressionValid(
  expression: string[],
  operators: string[],
): boolean {
  let openParenCount = 0
  let lastWasOperator = false
  let lastWasOperand = false

  for (let i = 0; i < expression.length; i++) {
    const token = expression[i]

    // Check parentheses balance
    if (token === '(') {
      openParenCount++
      // '(' should not follow an operand directly
      if (lastWasOperand) return false
      lastWasOperator = true
      lastWasOperand = false
      continue
    } else if (token === ')') {
      openParenCount--
      if (openParenCount < 0) return false // too many ')'
      // ')' should not follow an operator
      if (lastWasOperator) return false
      lastWasOperator = false
      lastWasOperand = true
      continue
    }

    // Distinguish operators vs. operands
    const isOp = operators.includes(token)
    if (isOp) {
      // Two operators in a row invalid
      if (lastWasOperator) return false
      // Can't start or end with an operator (unless '(' or ')' handled above)
      if (i === 0) return false
      if (i === expression.length - 1) return false
      lastWasOperator = true
      lastWasOperand = false
    } else {
      // It's an operand (like 'A', 'B', 'C')
      // Two operands in a row invalid
      if (lastWasOperand) return false
      lastWasOperator = false
      lastWasOperand = true
    }
  }

  // Balanced parentheses
  if (openParenCount !== 0) return false
  return true
}
