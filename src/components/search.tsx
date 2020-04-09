import React, { createContext, useContext, ReactNode, useState } from 'react'
import RichTextInput from 'components/rich-text/text-input'
import { colors } from 'theme'
import styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'

type SearchContextType = [string, React.Dispatch<React.SetStateAction<string>>]

const SearchStateContext = createContext<SearchContextType>(['', () => null])

export const SearchStateProvider = (props: { children: ReactNode }) => {
  const searchState = useState('')

  return (
    <SearchStateContext.Provider value={searchState}>{props.children}</SearchStateContext.Provider>
  )
}

export const useSearchState = () => useContext(SearchStateContext)

interface SearchProps {
  value: string
  onSearchChange: (value: string) => void
}

export const SearchBar = ({ value, onSearchChange }: SearchProps) => (
  <SearchContainer>
    <SearchIcon />
    <SearchInput onChangeText={onSearchChange} value={value} />
  </SearchContainer>
)

const SearchContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  background-color: #fff;
  border-radius: 25px;
`

// const SearchInput = styled.TextInput.attrs({ placeholder: 'Search' })`
//   flex: 1;
//   padding: 4px 12px;
//   font-size: 15px;
// `

const SearchInput = styled(RichTextInput).attrs({
  selectionColor: colors.primary,
  hashtagStyle: { color: colors.primaryDark },
})`
  flex: 1;
  padding: 10px 15px;
  font-size: 15px;
`

const SearchIcon = styled(Icon).attrs({ name: 'search' })`
  flex: 0 0 20px;
  font-size: 18px;
`
