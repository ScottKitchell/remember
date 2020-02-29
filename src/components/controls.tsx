import React, { ReactNode, useState } from 'react'
import { colors } from 'theme'
import styled from 'styled-components/native'
import { SearchBar } from './search'
import Icon from 'react-native-vector-icons/Feather'

interface ControlsProps {
  onSearchChange: (value: string) => void
  minimize: boolean
}

export const Controls = ({ onSearchChange, minimize }: ControlsProps) => {
  // const [searchValue, setSearchValue] = useState('')

  // const handleChange = (value: string) => {
  //   setSearchValue(value)
  //   onSearchChange({value})
  // }

  return (
    <ControlsContainer>
      <SearchBar onChangeText={onSearchChange} />
    </ControlsContainer>
  )
}

const ControlsContainer = styled.View`
  display: flex;
  padding: 10px;
`
