import React, {ReactNode, useState} from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
import {colors} from 'theme'

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
    <View style={styles.container}>
      <TextInput onChangeText={onSearchChange} style={styles.searchBar} placeholder="Search" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  searchBar: {
    // paddingTop: 8,
    // paddingRight: 16,
    // paddingBottom: 16,
    // paddingLeft: 8,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 25,
  },
})
