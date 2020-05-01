import React from 'react'
import styled from 'styled-components/native'
import { SearchBar } from './search'

interface ControlsProps {
  searchValue: string
  onSearchChange: (value: string) => void
  minimize: boolean
  onFocus: () => void
}

export const Controls = ({ onSearchChange, searchValue, onFocus }: ControlsProps) => (
  <ControlsContainer>
    <SearchBar value={searchValue} onSearchChange={onSearchChange} onFocus={onFocus} />
  </ControlsContainer>
)

const ControlsContainer = styled.View`
  display: flex;
  padding: 10px;
`
