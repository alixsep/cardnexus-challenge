import AppError from '@/utils/app-error'

export const buildMongooseQuery = (conditions: any[]): any => {
  if (conditions.length === 0) return {} // Empty query

  const processCondition = (condition: any): any => {
    if (condition.type === 'simple') {
      // Process simple conditions
      const { field, operator, value } = condition
      switch (operator) {
        case 'equals':
          return { [field]: value }
        case 'not equals':
          return { [field]: { $ne: value } }
        case 'contains':
          return { [field]: { $regex: value, $options: 'i' } } // Case-insensitive regex
        case "doesn't contain":
          return { [field]: { $not: { $regex: value, $options: 'i' } } }
        case 'less than':
          return { [field]: { $lt: value } }
        case 'greater than':
          return { [field]: { $gt: value } }
        case 'greater or equal':
          return { [field]: { $gte: value } }
        case 'less or equal':
          return { [field]: { $lte: value } }
        default:
          throw new Error(`Unknown operator: ${operator}`)
      }
    }

    throw new AppError('Invalid condition format', 400)
  }

  const stack: any[] = []
  const operators: string[] = ['AND', 'OR', 'NOR'] // Supported operators

  for (const token of conditions) {
    if (token === '(') {
      stack.push(token) // Push opening parenthesis
    } else if (token === ')') {
      // Build subquery for the group
      const subQuery: any[] = []
      while (stack.length && stack[stack.length - 1] !== '(') {
        subQuery.unshift(stack.pop())
      }
      stack.pop() // Remove the opening parenthesis

      // Combine subqueries into a single group
      const groupQuery = buildGroupQuery(subQuery)
      stack.push(groupQuery)
    } else if (typeof token === 'string' && operators.includes(token)) {
      stack.push(token) // Push operators directly
    } else {
      stack.push(processCondition(token)) // Push processed condition
    }
  }

  return buildGroupQuery(stack)
}

const buildGroupQuery = (tokens: any[]): any => {
  if (tokens.length === 1) return tokens[0] // Single condition

  const operatorMap: Record<string, string> = {
    AND: '$and',
    OR: '$or',
    NOR: '$nor',
  }

  // Determine the logical operator based on the tokens
  const operatorKey = tokens.find(token => token in operatorMap)
  if (!operatorKey)
    throw new AppError('No logical operator found in group', 400)

  const operator = operatorMap[operatorKey]
  const grouped: any[] = []

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === operatorKey) continue // Skip logical operators
    grouped.push(tokens[i])
  }

  return { [operator]: grouped }
}
