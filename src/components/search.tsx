import React, {ReactNode, useState} from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
import {colors} from 'theme'
import styled from 'styled-components/native'

interface SearchProps {
  onSearchChange: (value: string) => void
  minimize: boolean
}

export const Search = ({onSearchChange, minimize}: SearchProps) => {
  // const [searchValue, setSearchValue] = useState('')

  // const handleChange = (value: string) => {
  //   setSearchValue(value)
  //   onSearchChange({value})
  // }

  return (
    <Container>
      <SearchBar onChangeText={onSearchChange} placeholder="Search" />
    </Container>
  )
}

const Container = styled.View`
  padding: 10px;
`

const SearchBar = styled.TextInput`
  height: 36px;
  background-color: #fff;
  border-radius: 25px;
`
