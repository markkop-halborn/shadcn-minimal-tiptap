import { useState, useCallback, useEffect } from 'react'

export function useDragResize({
  initialWidth,
  initialHeight,
  contentWidth,
  contentHeight,
  gridInterval,
  minWidth,
  minHeight,
  maxWidth,
  onDimensionsChange
}) {
  const [dimensions, updateDimensions] = useState({
    width: Math.max(initialWidth ?? minWidth, minWidth),
    height: Math.max(initialHeight ?? minHeight, minHeight)
  })
  const [boundaryWidth, setBoundaryWidth] = useState(Infinity)
  const [resizeOrigin, setResizeOrigin] = useState(0)
  const [initialDimensions, setInitialDimensions] = useState(dimensions)
  const [resizeDirection, setResizeDirection] = useState(undefined)

  const widthConstraint = useCallback(
    (proposedWidth, maxAllowedWidth) => {
      const effectiveMinWidth = Math.max(
        minWidth,
        Math.min(contentWidth ?? minWidth, (gridInterval / 100) * maxAllowedWidth)
      )
      return Math.min(maxAllowedWidth, Math.max(proposedWidth, effectiveMinWidth))
    },
    [gridInterval, contentWidth, minWidth]
  )

  const handlePointerMove = useCallback(
    (event) => {
      event.preventDefault()
      const movementDelta = (resizeDirection === 'left' ? resizeOrigin - event.pageX : event.pageX - resizeOrigin) * 2
      const gridUnitWidth = (gridInterval / 100) * boundaryWidth
      const proposedWidth = initialDimensions.width + movementDelta
      const alignedWidth = Math.round(proposedWidth / gridUnitWidth) * gridUnitWidth
      const finalWidth = widthConstraint(alignedWidth, boundaryWidth)
      const aspectRatio = contentHeight && contentWidth ? contentHeight / contentWidth : 1

      updateDimensions({
        width: Math.max(finalWidth, minWidth),
        height: Math.max(contentWidth ? finalWidth * aspectRatio : (contentHeight ?? minHeight), minHeight)
      })
    },
    [
      widthConstraint,
      resizeDirection,
      boundaryWidth,
      resizeOrigin,
      gridInterval,
      contentHeight,
      contentWidth,
      initialDimensions.width,
      minWidth,
      minHeight
    ]
  )

  const handlePointerUp = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      setResizeOrigin(0)
      setResizeDirection(undefined)
      onDimensionsChange?.(dimensions)
    },
    [onDimensionsChange, dimensions]
  )

  const handleKeydown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        updateDimensions({
          width: Math.max(initialDimensions.width, minWidth),
          height: Math.max(initialDimensions.height, minHeight)
        })
        setResizeDirection(undefined)
      }
    },
    [initialDimensions, minWidth, minHeight]
  )

  const initiateResize = useCallback(
    (direction) => (event) => {
      event.preventDefault()
      event.stopPropagation()

      setBoundaryWidth(maxWidth)
      setInitialDimensions({
        width: Math.max(widthConstraint(dimensions.width, maxWidth), minWidth),
        height: Math.max(dimensions.height, minHeight)
      })
      setResizeOrigin(event.pageX)
      setResizeDirection(direction)
    },
    [maxWidth, widthConstraint, dimensions.width, dimensions.height, minWidth, minHeight]
  )

  useEffect(() => {
    if (resizeDirection) {
      document.addEventListener('keydown', handleKeydown)
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)

      return () => {
        document.removeEventListener('keydown', handleKeydown)
        document.removeEventListener('pointermove', handlePointerMove)
        document.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, [resizeDirection, handleKeydown, handlePointerMove, handlePointerUp])

  return {
    initiateResize,
    isResizing: !!resizeDirection,
    updateDimensions,
    currentWidth: Math.max(dimensions.width, minWidth),
    currentHeight: Math.max(dimensions.height, minHeight)
  }
}
