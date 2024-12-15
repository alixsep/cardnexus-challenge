import React, { useEffect, useState, useCallback } from 'react'
import { Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  isExpressionValid,
  OPERATOR_CONFIG,
  OPERATOR_VALUES,
} from '@/utils/expression-validator'
import { useSearchStore } from '@/stores/search-store'

const ExpressionBuilder: React.FC = () => {
  const { searchConditions, performSearch, setExtendedExpression } =
    useSearchStore()

  // For each condition in the store, assign a label like 'A', 'B', 'C'
  const conditionLabels = useCallback(() => {
    return (
      searchConditions.conditions?.map((_, idx) =>
        String.fromCharCode(65 + idx),
      ) || []
    )
  }, [searchConditions.conditions])

  const [expression, setExpression] = useState<string[]>(conditionLabels)

  // For adding a new operator at a certain slot.
  const [operatorSlotIndex, setOperatorSlotIndex] = useState<number | null>(
    null,
  )
  // For editing an operator in place.
  const [editOperatorIndex, setEditOperatorIndex] = useState<number | null>(
    null,
  )

  const isOperator = useCallback(
    (item: string) => OPERATOR_VALUES.includes(item),
    [],
  )

  /* Insert new operator at operatorSlotIndex */
  const handleOperatorInsert = (operator: string) => {
    if (operatorSlotIndex !== null) {
      const newExpr = [...expression]
      newExpr.splice(operatorSlotIndex, 0, operator)
      setExpression(newExpr)
      setOperatorSlotIndex(null)
    }
  }

  /* Edit existing operator */
  const handleOperatorEdit = (operator: string, index: number) => {
    const newExpr = [...expression]
    newExpr[index] = operator
    setExpression(newExpr)
    setEditOperatorIndex(null)
  }

  /* Delete operator from expression */
  const handleDeleteOperator = (index: number) => {
    const newExpr = [...expression]
    newExpr.splice(index, 1)
    setExpression(newExpr)
  }

  /* Move an item left */
  const handleMoveLeft = (index: number) => {
    if (index > 0) {
      const newExpr = [...expression]
      ;[newExpr[index - 1], newExpr[index]] = [
        newExpr[index],
        newExpr[index - 1],
      ]
      setExpression(newExpr)
    }
  }

  /* Move an item right */
  const handleMoveRight = (index: number) => {
    if (index < expression.length - 1) {
      const newExpr = [...expression]
      ;[newExpr[index], newExpr[index + 1]] = [
        newExpr[index + 1],
        newExpr[index],
      ]
      setExpression(newExpr)
    }
  }

  // Syntax validation
  const [isValid, setIsValid] = useState<boolean>(true)
  useEffect(() => {
    setIsValid(isExpressionValid(expression, OPERATOR_VALUES))
  }, [expression])

  /**
   * Sync changes in `conditionLabels` to the expression:
   *  - Append newly added operands if not already present
   *  - Remove operands that no longer appear in `conditionLabels`
   */
  useEffect(() => {
    let changed = false
    let newExpr = [...expression]

    // Add new operands that don't exist yet
    for (const operand of conditionLabels()) {
      if (!newExpr.includes(operand)) {
        newExpr.push(operand)
        changed = true
      }
    }

    // Remove operands not in `conditionLabels`, but keep operators
    newExpr = newExpr.filter(
      item => isOperator(item) || conditionLabels().includes(item),
    )

    if (changed || newExpr.length !== expression.length) {
      setExpression(newExpr)
    }
  }, [conditionLabels, expression, isOperator])

  // New method to get the full condition details for a label
  const getConditionDetails = (label: string) => {
    const index = conditionLabels().indexOf(label)
    return searchConditions.conditions?.[index] || null
  }

  const extendedExpression = expression.map(label => {
    const condition = getConditionDetails(label)
    if (!condition) return label
    return condition
  })

  // Render method to show condition details
  const renderConditionDetails = (label: string) => {
    const condition = getConditionDetails(label)
    if (!condition) return label

    // Format the condition details
    const { field, operator, value } = condition
    return `${field} ${operator} ${value}`
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {/* Expression Builder UI */}
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: expression.length + 1 }).map((_, slotIndex) => (
          <React.Fragment key={slotIndex}>
            {/* Operator slot (popover) */}
            <Popover
              open={operatorSlotIndex === slotIndex}
              onOpenChange={open =>
                setOperatorSlotIndex(open ? slotIndex : null)
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="size-6 p-0 text-gray"
                  onClick={() => setOperatorSlotIndex(slotIndex)}
                >
                  <Plus size={8} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex gap-1 w-auto p-1">
                {OPERATOR_CONFIG.map(op => (
                  <Button
                    key={op.value}
                    variant="outline"
                    size="icon"
                    onClick={() => handleOperatorInsert(op.value)}
                  >
                    {op.icon}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            {slotIndex < expression.length && (
              <div
                className={`
                  relative group size-16 flex items-center justify-center
                  border border-gray-300 rounded-md px-4 py-2
                  transition 
                  ${isOperator(expression[slotIndex]) ? 'bg-gray-300' : 'bg-white'}
                `}
              >
                {expression[slotIndex]}

                {/* Move Left/Right Icons */}
                <ChevronLeft
                  size={16}
                  className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                  onClick={() => handleMoveLeft(slotIndex)}
                />
                <ChevronRight
                  size={16}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                  onClick={() => handleMoveRight(slotIndex)}
                />

                {/* If it’s an operator, show edit/delete icons */}
                {isOperator(expression[slotIndex]) && (
                  <>
                    {/* Edit operator (Pencil icon) */}
                    <Popover
                      open={editOperatorIndex === slotIndex}
                      onOpenChange={open =>
                        setEditOperatorIndex(open ? slotIndex : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Pencil
                          size={16}
                          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                        />
                      </PopoverTrigger>
                      <PopoverContent className="flex gap-1 w-auto p-1">
                        {OPERATOR_CONFIG.map(op => (
                          <Button
                            key={op.value}
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleOperatorEdit(op.value, slotIndex)
                            }
                          >
                            {op.icon}
                          </Button>
                        ))}
                      </PopoverContent>
                    </Popover>

                    {/* Delete operator (Trash icon) */}
                    <Trash2
                      size={16}
                      className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                      onClick={() => handleDeleteOperator(slotIndex)}
                    />
                  </>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Syntax validation status */}
      <div
        className={`${isValid ? 'text-green-600' : 'text-red-600'} font-semibold`}
      >
        {isValid
          ? 'Expression is syntactically correct'
          : 'Invalid expression syntax'}
      </div>
      <p className="w-full text-sm">Raw extended expression representation:</p>
      <div className="text-sm text-gray-500">
        <pre className="break-all text-wrap">
          {JSON.stringify(extendedExpression, null, 0)}
        </pre>
      </div>

      <p className="w-full text-sm">
        Human readable expression representation:
      </p>

      <div className="text-sm text-gray-500 space-x-1">
        {expression.map((label, idx) => (
          <span key={idx}>{renderConditionDetails(label)}</span>
        ))}
      </div>
      {/* Search Button */}
      <Button
        disabled={!isValid}
        onClick={() => {
          setExtendedExpression(extendedExpression)
          performSearch(extendedExpression)
        }}
        className="w-full mt-4"
      >
        Search Cards
      </Button>
    </div>
  )
}

export default ExpressionBuilder
