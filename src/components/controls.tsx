import React, { ReactNode, useState } from 'react'
import { colors } from 'theme'
import styled from 'styled-components/native'
import { SearchBar } from './search'

interface ControlsProps {
  searchValue: string
  onSearchChange: (value: string) => void
  minimize?: boolean
}

export const Controls = ({ onSearchChange, searchValue }: ControlsProps) => (
  <ControlsContainer>
    <SearchBar value={searchValue} onSearchChange={onSearchChange} />
  </ControlsContainer>
)

const ControlsContainer = styled.View`
  display: flex;
  padding: 10px;
`
