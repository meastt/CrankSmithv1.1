import { SimulationResults } from './SimulationResults'

export default function Results({ results, onSave, bikeType, currentSetup, proposedSetup, componentDatabase }) {
  if (!results) return null

  const { comparison } = results
  const speedUnit = comparison.speedUnit || 'mph'

  return (
    <SimulationResults 
      results={results}
      speedUnit={speedUnit}
      bikeType={bikeType}
      onSave={onSave}
      showComparison={true}
    />
  )
}