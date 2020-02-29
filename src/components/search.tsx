import React, { ReactNode, useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { colors } from 'theme'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'

interface SearchProps {
  onChangeText: (value: string) => void
}

export const SearchBar = ({ onChangeText }: SearchProps) => {
  // const [searchValue, setSearchValue] = useState('')

  // const handleChange = (value: string) => {
  //   setSearchValue(value)
  //   onSearchChange({value})
  // }

  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput onChangeText={onChangeText} />
    </SearchContainer>
  )
}

const SearchContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  background-color: #fff;
  border-radius: 25px;
`

const SearchInput = styled.TextInput.attrs({ placeholder: 'Search' })`
  flex: 1;
  padding: 4px 8px;
`

const SearchIcon = styled(Icon).attrs({ name: 'search' })`
  flex: 0 0 20px;
  font-size: 18px;
`
